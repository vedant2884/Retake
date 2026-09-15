import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { AGENTS } from "@/lib/agents";
import { getChallengeType } from "@/lib/challenges";
import { getCustomChallengeType } from "@/lib/custom-challenges-repo";
import type {
  Agent,
  ChallengeAgentStatus,
  ChallengeType,
} from "@/types";

/**
 * Looks up a challenge type whether it's one of the built-in
 * challenges or a user-created custom challenge.
 */
export function resolveChallengeType(
  challengeTypeId: string
): ChallengeType | undefined {
  return (
    getChallengeType(challengeTypeId) ??
    getCustomChallengeType(challengeTypeId)
  );
}

/**
 * Runs multiple database operations inside a transaction.
 */
function withTransaction<T>(fn: () => T): T {
  db.exec("BEGIN");

  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export interface ChallengeAgentView extends Agent {
  status: ChallengeAgentStatus;
}

export interface ChallengeProgress {
  id: string;
  challengeTypeId: string;
  status: "active" | "completed" | "abandoned";
  createdAt: string;
  completedAt: string | null;
  agents: ChallengeAgentView[];
}

interface ChallengeRow {
  id: string;
  challenge_type_id: string;
  status: "active" | "completed" | "abandoned";
  created_at: string;
  completed_at: string | null;
}

interface ChallengeAgentRow {
  id: string;
  challenge_id: string;
  agent_id: string;
  status: ChallengeAgentStatus;
  selection_history: string;
}

/**
 * Converts a database challenge row into the format
 * used by the application.
 */
function toProgress(row: ChallengeRow): ChallengeProgress {
  const agentRows = db
    .prepare(
      `SELECT *
       FROM challenge_agents
       WHERE challenge_id = ?`
    )
    .all(row.id) as unknown as ChallengeAgentRow[];

  const agents = agentRows.reduce<ChallengeAgentView[]>(
    (acc, agentRow) => {
      const agent = AGENTS.find(
        (candidate) => candidate.id === agentRow.agent_id
      );

      if (agent) {
        acc.push({
          ...agent,
          status: agentRow.status,
        });
      }

      return acc;
    },
    []
  );

  return {
    id: row.id,
    challengeTypeId: row.challenge_type_id,
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    agents,
  };
}

/**
 * Gets the currently active challenge for a challenge type.
 */
export function getActiveChallenge(
  challengeTypeId: string
): ChallengeProgress | null {
  const row = db
    .prepare(
      `SELECT *
       FROM challenges
       WHERE challenge_type_id = ?
         AND status = 'active'
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .get(challengeTypeId) as unknown as
    | ChallengeRow
    | undefined;

  return row ? toProgress(row) : null;
}

/**
 * Gets a challenge by its database ID.
 */
function getChallengeById(
  challengeId: string
): ChallengeProgress | null {
  const row = db
    .prepare(
      `SELECT *
       FROM challenges
       WHERE id = ?`
    )
    .get(challengeId) as unknown as
    | ChallengeRow
    | undefined;

  return row ? toProgress(row) : null;
}

/**
 * Gets the latest challenge run regardless of status.
 */
export function getLatestChallenge(
  challengeTypeId: string
): ChallengeProgress | null {
  const row = db
    .prepare(
      `SELECT *
       FROM challenges
       WHERE challenge_type_id = ?
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .get(challengeTypeId) as unknown as
    | ChallengeRow
    | undefined;

  return row ? toProgress(row) : null;
}

/**
 * Starts a challenge.
 *
 * If an active challenge already exists, it is returned instead
 * of creating a duplicate.
 */
export function startChallenge(
  challengeTypeId: string
): ChallengeProgress {
  const existing = getActiveChallenge(challengeTypeId);

  if (existing) {
    return existing;
  }

  const challengeType =
    resolveChallengeType(challengeTypeId);

  if (!challengeType) {
    throw new Error(
      `Unknown challenge type: ${challengeTypeId}`
    );
  }

  const pool = challengeType.getAgentPool(AGENTS);

  const challengeId = randomUUID();
  const createdAt = new Date().toISOString();

  const insertChallenge = db.prepare(
    `INSERT INTO challenges
      (id, challenge_type_id, status, created_at)
     VALUES (?, ?, 'active', ?)`
  );

  const insertAgent = db.prepare(
    `INSERT INTO challenge_agents
      (id, challenge_id, agent_id, status, selection_history)
     VALUES (?, ?, ?, 'available', '[]')`
  );

  withTransaction(() => {
    insertChallenge.run(
      challengeId,
      challengeTypeId,
      createdAt
    );

    for (const agent of pool) {
      insertAgent.run(
        randomUUID(),
        challengeId,
        agent.id
      );
    }
  });

  return getActiveChallenge(challengeTypeId)!;
}

/**
 * Completely resets a challenge.
 *
 * The current run and all of its agent progress are deleted.
 * A brand-new run is then created with every agent available.
 */
export function resetChallenge(
  challengeTypeId: string
): ChallengeProgress {
  const challenge = getLatestChallenge(challengeTypeId);

  if (challenge) {
    withTransaction(() => {
      db.prepare(
        `DELETE FROM challenge_agents
         WHERE challenge_id = ?`
      ).run(challenge.id);

      db.prepare(
        `DELETE FROM challenges
         WHERE id = ?`
      ).run(challenge.id);
    });
  }

  return startChallenge(challengeTypeId);
}

/**
 * Records the result of a match played with an agent.
 *
 * Win:
 * - Agent becomes completed.
 * - If every agent is completed, the challenge becomes completed.
 *
 * Loss:
 * - Agent remains available.
 * - The attempt is added to selection history.
 */
export function recordResult(
  challengeTypeId: string,
  agentId: string,
  result: "win" | "loss"
): ChallengeProgress {
  const challenge =
    getActiveChallenge(challengeTypeId);

  if (!challenge) {
    throw new Error(
      `No active challenge for: ${challengeTypeId}`
    );
  }

  const agentRow = db
    .prepare(
      `SELECT *
       FROM challenge_agents
       WHERE challenge_id = ?
         AND agent_id = ?`
    )
    .get(
      challenge.id,
      agentId
    ) as unknown as ChallengeAgentRow | undefined;

  if (!agentRow) {
    throw new Error(
      `Agent ${agentId} is not part of this challenge`
    );
  }

  const history = JSON.parse(
    agentRow.selection_history
  ) as Array<{
    selectedAt: string;
    result: "win" | "loss";
  }>;

  history.push({
    selectedAt: new Date().toISOString(),
    result,
  });

  const nextStatus: ChallengeAgentStatus =
    result === "win"
      ? "completed"
      : "available";

  withTransaction(() => {
    db.prepare(
      `UPDATE challenge_agents
       SET status = ?, selection_history = ?
       WHERE id = ?`
    ).run(
      nextStatus,
      JSON.stringify(history),
      agentRow.id
    );

    if (result === "win") {
      const remaining = db
        .prepare(
          `SELECT COUNT(*) as count
           FROM challenge_agents
           WHERE challenge_id = ?
             AND status != 'completed'`
        )
        .get(challenge.id) as unknown as {
        count: number;
      };

      if (remaining.count === 0) {
        db.prepare(
          `UPDATE challenges
           SET status = 'completed',
               completed_at = ?
           WHERE id = ?`
        ).run(
          new Date().toISOString(),
          challenge.id
        );
      }
    }
  });

  return getChallengeById(challenge.id)!;
}