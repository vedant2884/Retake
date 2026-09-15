"use server";

import { redirect } from "next/navigation";
import { createCustomChallengeType } from "@/lib/custom-challenges-repo";

export async function createCustomChallengeAction(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const agentIds = formData.getAll("agentIds").map(String);

  let challengeId: string;

  try {
    challengeId = createCustomChallengeType(name, agentIds).id;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    redirect(`/challenges/new?error=${encodeURIComponent(message)}`);
  }

  redirect(`/challenges/${challengeId}`);
}
