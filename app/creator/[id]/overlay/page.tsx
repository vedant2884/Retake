import { notFound } from "next/navigation";
import { resolveChallengeType, getLatestChallenge } from "@/lib/challenges-repo";
import { AGENTS } from "@/lib/agents";
import { ProgressBar } from "@/components/challenges/ProgressBar";
import { OverlayPips } from "@/components/creator/OverlayPips";
import { AutoRefresh } from "@/components/creator/AutoRefresh";

export default async function OverlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challengeType = resolveChallengeType(id);

  if (!challengeType) {
    notFound();
  }

  const latest = getLatestChallenge(id);
  const pool = challengeType.getAgentPool(AGENTS);
  const completed = latest?.agents.filter((agent) => agent.status === "completed") ?? [];
  const pips = latest?.agents ?? pool.map((agent) => ({ ...agent, status: "available" as const }));

  return (
    <div className="inline-block rounded-lg border border-graphite-700 bg-graphite-950/80 p-md text-graphite-50 backdrop-blur-sm">
      <AutoRefresh intervalMs={5000} />

      <p className="text-xs font-medium tracking-wide text-graphite-400">
        {challengeType.name}
      </p>

      {latest?.status === "completed" ? (
        <p className="mt-1 text-sm font-medium text-signal-500">Challenge complete</p>
      ) : (
        <div className="mt-1 w-56">
          <ProgressBar completed={completed.length} total={pool.length} />
        </div>
      )}

      <div className="mt-2">
        <OverlayPips agents={pips} />
      </div>
    </div>
  );
}
