import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { buttonStyles } from "@/components/ui/Button";
import { AgentTile } from "@/components/challenges/AgentTile";
import { ProgressBar } from "@/components/challenges/ProgressBar";
import { CreatorTools } from "@/components/challenges/CreatorTools";
import { AGENTS } from "@/lib/agents";
import { getLatestChallenge, resolveChallengeType } from "@/lib/challenges-repo";
import { startChallengeAction } from "@/lib/actions/challenges";
import { AgentGlyph } from "@/components/selector/AgentGlyph";
import { ResetChallengeButton } from "@/components/challenges/ResetChallengeButton";

export default async function ChallengeDetailPage({
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

  if (!latest) {
    const pool = challengeType.getAgentPool(AGENTS);

    return (
      <Section className="pt-3xl">
        <Container>
          <h1 className="text-3xl font-semibold">{challengeType.name}</h1>
          <p className="mt-sm max-w-xl text-graphite-200">{challengeType.description}</p>

          <div className="mt-lg flex flex-wrap gap-sm">
            <ResetChallengeButton challengeId={id} />
          </div>

          <p className="mt-xl text-xs font-medium tracking-wide text-graphite-400">
            Agent pool
          </p>
          <ul className="mt-sm grid grid-cols-2 gap-sm sm:grid-cols-3 md:grid-cols-4">
            {pool.map((agent) => (
              <li
                key={agent.id}
                className="flex items-center justify-between rounded border border-graphite-700 bg-graphite-900 px-md py-sm"
              >
                <div className="flex items-center gap-sm">
                  <AgentGlyph agent={agent} className="h-10 w-10 shrink-0" />
                  <span className="text-sm">{agent.name}</span>
                </div>

                <RoleBadge role={agent.role} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    );
  }

  const remaining = latest.agents.filter((agent) => agent.status === "available");
  const completed = latest.agents.filter((agent) => agent.status === "completed");

  if (latest.status === "completed") {
    return (
      <Section className="pt-3xl">
        <Container>
          <p className="text-xs font-medium tracking-wide text-signal-500">Complete</p>
          <h1 className="mt-1 text-3xl font-semibold">{challengeType.name}</h1>
          <p className="mt-sm max-w-xl text-graphite-200">
            Every agent in this pool has been cleared.
          </p>

          <div className="mt-lg max-w-xl">
            <ProgressBar completed={completed.length} total={latest.agents.length} />
          </div>

          <form action={startChallengeAction.bind(null, id)} className="mt-lg">
            <button type="submit" className={buttonStyles("secondary")}>
              Start a new run
            </button>
          </form>

          <div className="mt-xl">
            <p className="text-xs font-medium tracking-wide text-graphite-400">Cleared</p>
            <ul className="mt-sm grid grid-cols-2 gap-sm sm:grid-cols-3 md:grid-cols-4">
              {completed.map((agent) => (
                <AgentTile key={agent.id} agent={agent} status={agent.status} />
              ))}
            </ul>
          </div>

          <CreatorTools challengeId={id} showSelect={false} />
        </Container>
      </Section>
    );
  }

  return (
    <Section className="pt-3xl">
      <Container>
        <h1 className="text-3xl font-semibold">{challengeType.name}</h1>
        <p className="mt-sm max-w-xl text-graphite-200">{challengeType.description}</p>

        <div className="mt-lg max-w-xl">
          <ProgressBar completed={completed.length} total={latest.agents.length} />
        </div>

        {remaining.length > 0 && (
          <div className="mt-lg flex flex-wrap gap-sm">
            <Link
              href={`/challenges/${id}/select`}
              className={buttonStyles("primary")}
            >
              Select agent
            </Link>

            <ResetChallengeButton challengeId={id} />
          </div>
        )}

        {remaining.length > 0 && (
          <div className="mt-xl">
            <p className="text-xs font-medium tracking-wide text-graphite-400">Remaining</p>
            <ul className="mt-sm grid grid-cols-2 gap-sm sm:grid-cols-3 md:grid-cols-4">
              {remaining.map((agent) => (
                <AgentTile key={agent.id} agent={agent} status={agent.status} />
              ))}
            </ul>
          </div>
        )}

        {completed.length > 0 && (
          <div className="mt-xl">
            <p className="text-xs font-medium tracking-wide text-graphite-400">Completed</p>
            <ul className="mt-sm grid grid-cols-2 gap-sm sm:grid-cols-3 md:grid-cols-4">
              {completed.map((agent) => (
                <AgentTile key={agent.id} agent={agent} status={agent.status} />
              ))}
            </ul>
          </div>
        )}

        <CreatorTools challengeId={id} showSelect={remaining.length > 0} />
      </Container>
    </Section>
  );
}
