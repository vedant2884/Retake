import type { Role } from "@/types";

interface RoleMeta {
  label: string;
  /** Tailwind color token, matches the `role.*` colors in tailwind.config.ts */
  colorToken: "duelist" | "controller" | "sentinel" | "initiator";
}

export const ROLE_META: Record<Role, RoleMeta> = {
  duelist: { label: "Duelist", colorToken: "duelist" },
  controller: { label: "Controller", colorToken: "controller" },
  sentinel: { label: "Sentinel", colorToken: "sentinel" },
  initiator: { label: "Initiator", colorToken: "initiator" },
};
