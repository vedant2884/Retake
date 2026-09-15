import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getActiveChallenge, resolveChallengeType } from "@/lib/challenges-repo";
import { AgentSelector } from "@/components/selector/AgentSelector";

export default async function SelectAgentPage({
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
    <Section className="pt-3xl">
      <Container className="flex flex-col items-center text-center">
        <p className="text-xs font-medium tracking-wide text-graphite-400">
          {challengeType.name}
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Select your agent</h1>

        <div className="mt-2xl">
          <AgentSelector agents={remaining} challengeTypeId={id} backHref={`/challenges/${id}`} />
        </div>
      </Container>
    </Section>
  );
}
