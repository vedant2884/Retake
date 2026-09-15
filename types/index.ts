export type Role = "duelist" | "controller" | "sentinel" | "initiator";

export interface Agent {
  id: string;
  name: string;
  role: Role;
  /**
   * Path to the agent portrait, relative to /public/agents.
   * Left undefined until real asset files are provided; UI falls
   * back to a role-colored placeholder when this is missing.
   */
  portrait?: string;
}

export interface ChallengeType {
  id: string;
  name: string;
  description: string;
  /**
   * Returns the pool of agents this challenge is played with.
   * Kept as a function rather than a stored list so new challenge
   * types (a fixed roster, a weapon rotation, a custom pick) can
   * define their own selection rule without changing the shape of
   * the data anywhere else in the app.
   */
  getAgentPool: (allAgents: Agent[]) => Agent[];
}

export type ChallengeAgentStatus = "available" | "completed";

/**
 * Shape of a challenge once it is persisted (Phase 3 onward).
 * Defined now so components can be written against a stable
 * interface before the database is wired up.
 */
export interface Challenge {
  id: string;
  challengeTypeId: string;
  status: "active" | "completed" | "abandoned";
  createdAt: string;
  completedAt?: string;
}

export interface ChallengeAgentRecord {
  id: string;
  challengeId: string;
  agentId: string;
  status: ChallengeAgentStatus;
  selectionHistory: Array<{ selectedAt: string; result: "win" | "loss" }>;
}
