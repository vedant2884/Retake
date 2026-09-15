"use client";

import { resetChallengeAction } from "@/lib/actions/challenges";
import { buttonStyles } from "@/components/ui/Button";

export function ResetChallengeButton({
  challengeId,
}: {
  challengeId: string;
}) {
  function handleReset(event: React.MouseEvent<HTMLButtonElement>) {
    const confirmed = window.confirm(
      "Reset this challenge?\n\nAll progress from the current run will be lost."
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={resetChallengeAction.bind(null, challengeId)}>
      <button
        type="submit"
        onClick={handleReset}
        className={buttonStyles(
          "secondary",
          "text-sm"
        )}
      >
        Reset challenge
      </button>
    </form>
  );
}