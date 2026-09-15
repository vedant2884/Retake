"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  startChallenge,
  recordResult,
  resetChallenge,
} from "@/lib/challenges-repo";

import { CHALLENGE_TYPES } from "@/lib/challenges";
import { listCustomChallengeTypes } from "@/lib/custom-challenges-repo";

/**
 * Starts a challenge or resumes the existing active run.
 */
export async function startChallengeAction(
  challengeTypeId: string,
  _formData: FormData
) {
  startChallenge(challengeTypeId);

  revalidatePath(
    `/challenges/${challengeTypeId}`
  );

  revalidatePath("/challenges");
}

/**
 * Records a win/loss for the selected agent.
 */
export async function recordResultAction(
  challengeTypeId: string,
  agentId: string,
  result: "win" | "loss"
) {
  const updated = recordResult(
    challengeTypeId,
    agentId,
    result
  );

  revalidatePath(
    `/challenges/${challengeTypeId}`
  );

  revalidatePath("/challenges");

  return updated;
}

/**
 * Completely resets the current challenge run
 * and starts a fresh one.
 */
export async function resetChallengeAction(
  challengeTypeId: string
) {
  resetChallenge(challengeTypeId);

  revalidatePath(
    `/challenges/${challengeTypeId}`
  );

  revalidatePath("/challenges");
}

/**
 * Picks a random built-in or custom challenge.
 */
export async function surpriseMeAction() {
  const ids = [
    ...CHALLENGE_TYPES.map(
      (challenge) => challenge.id
    ),
    ...listCustomChallengeTypes().map(
      (challenge) => challenge.id
    ),
  ];

  if (ids.length === 0) {
    return;
  }

  const pick =
    ids[Math.floor(Math.random() * ids.length)];

  redirect(`/challenges/${pick}`);
}