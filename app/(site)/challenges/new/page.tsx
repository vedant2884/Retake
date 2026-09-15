import { AGENTS } from "@/lib/agents";
import { ROLE_META } from "@/lib/roles";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { buttonStyles } from "@/components/ui/Button";
import { createCustomChallengeAction } from "@/lib/actions/custom-challenges";
import type { Role } from "@/types";

const ROLES: Role[] = ["duelist", "controller", "sentinel", "initiator"];

export default async function NewCustomChallengePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Section className="pt-3xl">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-semibold">Create a custom challenge</h1>
        <p className="mt-sm text-graphite-200">
          Name it and pick which agents belong in the pool.
        </p>

        {error && (
          <p className="mt-lg rounded border border-role-duelist/40 bg-role-duelist/10 px-md py-sm text-sm text-role-duelist">
            {error}
          </p>
        )}

        <form action={createCustomChallengeAction} className="mt-lg">
          <label className="block text-sm font-medium text-graphite-200" htmlFor="name">
            Challenge name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            placeholder="e.g. Only my mains"
            className="mt-1 w-full rounded border border-graphite-700 bg-graphite-900 px-md py-sm text-sm text-graphite-50 outline-none focus:border-signal-500"
          />

          {ROLES.map((role) => (
            <div key={role} className="mt-lg">
              <p className="text-xs font-medium tracking-wide text-graphite-400">
                {ROLE_META[role].label}
              </p>
              <div className="mt-sm grid grid-cols-2 gap-sm sm:grid-cols-3">
                {AGENTS.filter((agent) => agent.role === role).map((agent) => (
                  <label
                    key={agent.id}
                    className="flex items-center gap-2 rounded border border-graphite-700 bg-graphite-900 px-md py-sm text-sm transition-colors duration-fast has-[:checked]:border-signal-500"
                  >
                    <input
                      type="checkbox"
                      name="agentIds"
                      value={agent.id}
                      className="accent-signal-500"
                    />
                    {agent.name}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" className={buttonStyles("primary", "mt-xl")}>
            Create challenge
          </button>
        </form>
      </Container>
    </Section>
  );
}
