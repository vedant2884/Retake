import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { AGENTS } from "@/lib/agents";
import type { ChallengeType } from "@/types";

interface CustomChallengeRow {
  id: string;
  name: string;
  description: string;
  agent_ids: string;
  created_at: string;
}

function toChallengeType(row: CustomChallengeRow): ChallengeType {
  const agentIds: string[] = JSON.parse(row.agent_ids);

  return {
    id: row.id,
    name: row.name,
    description: row.description || `A custom challenge with ${agentIds.length} agents.`,
    getAgentPool: (allAgents) => allAgents.filter((agent) => agentIds.includes(agent.id)),
  };
}

export function listCustomChallengeTypes(): ChallengeType[] {
  const rows = db
    .prepare(`SELECT * FROM custom_challenges ORDER BY created_at DESC`)
    .all() as unknown as CustomChallengeRow[];

  return rows.map(toChallengeType);
}

export function getCustomChallengeType(id: string): ChallengeType | undefined {
  const row = db.prepare(`SELECT * FROM custom_challenges WHERE id = ?`).get(id) as unknown as
    CustomChallengeRow | undefined;

  return row ? toChallengeType(row) : undefined;
}

export function createCustomChallengeType(name: string, agentIds: string[]): ChallengeType {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("A challenge name is required.");
  }

  const validAgentIds = agentIds.filter((id) => AGENTS.some((agent) => agent.id === id));
  if (validAgentIds.length === 0) {
    throw new Error("Select at least one agent.");
  }

  const id = `custom-${randomUUID()}`;
  const createdAt = new Date().toISOString();

  db.prepare(
    `INSERT INTO custom_challenges (id, name, description, agent_ids, created_at) VALUES (?, ?, '', ?, ?)`
  ).run(id, trimmedName, JSON.stringify(validAgentIds), createdAt);

  return getCustomChallengeType(id)!;
}
