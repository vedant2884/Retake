import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { buttonStyles } from "@/components/ui/Button";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { CHALLENGE_TYPES } from "@/lib/challenges";
import { AGENTS } from "@/lib/agents";
import type { Role } from "@/types";

const STEPS = [
  {
    title: "Pick a challenge",
    body: "Choose a role to master, or take on the full roster.",
  },
  {
    title: "Get your agent",
    body: "A cinematic selector assigns one agent from the pool.",
  },
  {
    title: "Report the result",
    body: "Win and the agent is retired. Lose and try again.",
  },
];

export default function Home() {
  return (
    <>
      <Section className="pt-3xl">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Win with every agent.
            </h1>
            <p className="mt-md text-lg text-graphite-200">
              Retake turns ranked into a run. Pick a challenge, let the selector
              choose your agent, and clear the roster one win at a time.
            </p>
            <div className="mt-xl flex gap-md">
              <Link href="/challenges" className={buttonStyles("primary")}>
                Start a challenge
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-graphite-800">
        <Container>
          <div className="grid gap-lg sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title}>
                <p className="font-display text-sm text-signal-500">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-sm text-lg font-medium">{step.title}</h3>
                <p className="mt-1 text-sm text-graphite-200">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-graphite-800">
        <Container>
          <h2 className="text-2xl font-semibold">Challenges</h2>
          <div className="mt-lg grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
            {CHALLENGE_TYPES.map((challenge) => {
              const pool = challenge.getAgentPool(AGENTS);
              const role: Role | null =
                pool.length > 0 && pool.every((agent) => agent.role === pool[0]!.role)
                  ? pool[0]!.role
                  : null;

              return (
                <Link key={challenge.id} href={`/challenges/${challenge.id}`}>
                  <Card className="h-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{challenge.name}</h3>
                      {role && <RoleBadge role={role} />}
                    </div>
                    <p className="mt-sm text-sm text-graphite-200">
                      {challenge.description}
                    </p>
                    <p className="mt-md text-xs text-graphite-400">
                      {pool.length} agents
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
