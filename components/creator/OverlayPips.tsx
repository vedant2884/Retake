import type { Agent, ChallengeAgentStatus } from "@/types";
import { cn } from "@/lib/utils";

const roleDot: Record<Agent["role"], string> = {
  duelist: "bg-role-duelist",
  controller: "bg-role-controller",
  sentinel: "bg-role-sentinel",
  initiator: "bg-role-initiator",
};

export function OverlayPips({
  agents,
}: {
  agents: Array<Agent & { status: ChallengeAgentStatus }>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {agents.map((agent) => (
        <span
          key={agent.id}
          title={agent.name}
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            agent.status === "completed" ? roleDot[agent.role] : "bg-graphite-700"
          )}
        />
      ))}
    </div>
  );
}
