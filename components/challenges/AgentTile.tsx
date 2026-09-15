import { Check } from "lucide-react";
import type { Agent, ChallengeAgentStatus } from "@/types";
import { AgentGlyph } from "@/components/selector/AgentGlyph";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { cn } from "@/lib/utils";

export function AgentTile({
  agent,
  status,
}: {
  agent: Agent;
  status: ChallengeAgentStatus;
}) {
  const isCompleted = status === "completed";

  return (
    <li
      className={cn(
        "flex items-center justify-between rounded border px-md py-sm",
        isCompleted
          ? "border-graphite-800 bg-graphite-950"
          : "border-graphite-700 bg-graphite-900"
      )}
    >
      <div className="flex items-center gap-sm">
        <AgentGlyph agent={agent} className="h-10 w-10 shrink-0" />

        <span className={cn("text-sm", isCompleted && "text-graphite-400 line-through")}>
          {agent.name}
        </span>
      </div>

      {isCompleted ? (
        <Check className="h-4 w-4 text-signal-500" aria-label="Completed" />
      ) : (
        <RoleBadge role={agent.role} />
      )}
    </li>
  );
}