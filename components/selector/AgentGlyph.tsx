import Image from "next/image";
import type { Agent } from "@/types";
import { cn } from "@/lib/utils";

const roleStyles: Record<Agent["role"], string> = {
  duelist: "border-role-duelist/40 bg-role-duelist/15 text-role-duelist",
  controller: "border-role-controller/40 bg-role-controller/15 text-role-controller",
  sentinel: "border-role-sentinel/40 bg-role-sentinel/15 text-role-sentinel",
  initiator: "border-role-initiator/40 bg-role-initiator/15 text-role-initiator",
};

export function AgentGlyph({ agent, className }: { agent: Agent; className?: string }) {
  if (agent.portrait) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden rounded-full", className)}>
        <Image src={agent.portrait} alt={agent.name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full border font-display text-lg font-semibold",
        roleStyles[agent.role],
        className
      )}
    >
      {agent.name.slice(0, 2).toUpperCase()}
    </div>
  );
}
