import type { Role } from "@/types";
import { ROLE_META } from "@/lib/roles";
import { cn } from "@/lib/utils";

/**
 * Full class strings are listed explicitly (rather than built from a
 * template string) so Tailwind's build-time content scan can find
 * and keep them. A dynamic `bg-role-${role}/10` string would not
 * survive the production build.
 */
const roleStyles: Record<Role, string> = {
  duelist: "border-role-duelist/30 bg-role-duelist/10 text-role-duelist",
  controller: "border-role-controller/30 bg-role-controller/10 text-role-controller",
  sentinel: "border-role-sentinel/30 bg-role-sentinel/10 text-role-sentinel",
  initiator: "border-role-initiator/30 bg-role-initiator/10 text-role-initiator",
};

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-sm py-1 text-xs font-medium",
        roleStyles[role],
        className
      )}
    >
      {ROLE_META[role].label}
    </span>
  );
}
