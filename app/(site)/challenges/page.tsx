import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { buttonStyles } from "@/components/ui/Button";
import { ProgressBar } from "@/components/challenges/ProgressBar";
import { CHALLENGE_TYPES } from "@/lib/challenges";
import { AGENTS } from "@/lib/agents";
import { getLatestChallenge } from "@/lib/challenges-repo";
import { listCustomChallengeTypes } from "@/lib/custom-challenges-repo";
import { surpriseMeAction } from "@/lib/actions/challenges";
import type { Role } from "@/types";

export default function ChallengesPage() {
  const allChallengeTypes = [...CHALLENGE_TYPES, ...listCustomChallengeTypes()];

  return (
    <Section className="pt-3xl">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-md">
          <div>
            <h1 className="text-3xl font-semibold">Challenges</h1>
            <p className="mt-sm max-w-xl text-graphite-200">
              Pick a pool of agents to clear. Starting a challenge saves its
              progress, come back any time to pick up where you left off.
            </p>
          </div>

          <div className="flex gap-sm">
            <form action={surpriseMeAction}>
              <button type="submit" className={buttonStyles("secondary")}>
                Surprise me
              </button>
            </form>
            <Link href="/challenges/new" className={buttonStyles("primary")}>
              New custom challenge
            </Link>
          </div>
        </div>

        <div className="mt-xl grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
          {allChallengeTypes.map((challenge) => {
            const pool = challenge.getAgentPool(AGENTS);
            const role: Role | null =
              pool.length > 0 && pool.every((agent) => agent.role === pool[0]!.role)
                ? pool[0]!.role
                : null;
            const isCustom = challenge.id.startsWith("custom-");
            const latest = getLatestChallenge(challenge.id);
            const completedCount =
              latest?.agents.filter((agent) => agent.status === "completed").length ?? 0;

            return (
              <Link key={challenge.id} href={`/challenges/${challenge.id}`}>
                <Card className="h-full">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">{challenge.name}</h2>
                    {role && <RoleBadge role={role} />}
                    {!role && isCustom && (
                      <span className="rounded-sm border border-graphite-600 px-sm py-1 text-xs font-medium text-graphite-200">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="mt-sm text-sm text-graphite-200">{challenge.description}</p>

                  {latest?.status === "completed" ? (
                    <p className="mt-md text-xs font-medium text-signal-500">Complete</p>
                  ) : latest ? (
                    <div className="mt-md">
                      <ProgressBar completed={completedCount} total={pool.length} />
                    </div>
                  ) : (
                    <p className="mt-md text-xs text-graphite-400">{pool.length} agents</p>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
