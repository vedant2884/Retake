import type { Agent, ChallengeType } from "@/types";
import { getAgentsByRole } from "@/lib/agents";
import {
  startChallenge,
  recordResult,
  resetChallenge,
} from "@/lib/challenges-repo";

/**
 * Every challenge type is defined by an id, display copy, and a rule
 * for which agents belong in its pool. Adding a new challenge, a
 * fixed roster, a random subset, a future weapon rotation, means
 * adding one entry here. Nothing in the UI or challenge-tracking
 * logic needs to change.
 */
export const CHALLENGE_TYPES: ChallengeType[] = [
  {
    id: "every-duelist",
    name: "Every duelist",
    description: "Win a match with each duelist before repeating one.",
    getAgentPool: () => getAgentsByRole("duelist"),
  },
  {
    id: "every-controller",
    name: "Every controller",
    description: "Win a match with each controller before repeating one.",
    getAgentPool: () => getAgentsByRole("controller"),
  },
  {
    id: "every-sentinel",
    name: "Every sentinel",
    description: "Win a match with each sentinel before repeating one.",
    getAgentPool: () => getAgentsByRole("sentinel"),
  },
  {
    id: "every-initiator",
    name: "Every initiator",
    description: "Win a match with each initiator before repeating one.",
    getAgentPool: () => getAgentsByRole("initiator"),
  },
  {
    id: "every-agent",
    name: "Every agent",
    description: "Win a match with every agent in the roster before repeating one.",
    getAgentPool: (allAgents: Agent[]) => allAgents,
  },
];

export function getChallengeType(id: string): ChallengeType | undefined {
  return CHALLENGE_TYPES.find((challenge) => challenge.id === id);
}

export async function resetChallengeAction(
  challengeTypeId: string
) {
  resetChallenge(challengeTypeId);

  revalidatePath(`/challenges/${challengeTypeId}`);
  revalidatePath("/challenges");
}