import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getActiveChallenge, resolveChallengeType } from "@/lib/challenges-repo";
import { AgentSelector } from "@/components/selector/AgentSelector";

export default async function CreatorSelectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challengeType = resolveChallengeType(id);

  if (!challengeType) {
    notFound();
  }

  const active = getActiveChallenge(id);
  const remaining = active?.agents.filter((agent) => agent.status === "available") ?? [];

  if (!active || remaining.length === 0) {
    redirect(`/challenges/${id}`);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-graphite-950 text-graphite-50">
      <Link
        href={`/challenges/${id}`}
        className="absolute left-4 top-4 text-xs text-graphite-600 transition-colors duration-fast hover:text-graphite-400"
      >
        Exit creator mode
      </Link>

      <p className="text-xs font-medium tracking-wide text-graphite-400">
        {challengeType.name}
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold">Select your agent</h1>

      <div className="mt-2xl scale-110">
        <AgentSelector agents={remaining} challengeTypeId={id} backHref={`/challenges/${id}`} />
      </div>
    </div>
  );
}
