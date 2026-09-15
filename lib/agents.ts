import type { Agent } from "@/types";

/**
 * The full agent roster. Portraits are intentionally left unset,
 * the UI falls back to a role-colored placeholder until real
 * agent artwork is provided.
 *
 * This list reflects the current roster and will need small
 * additions as Riot releases new agents. Nothing else in the app
 * depends on the list length, so updating this file is enough.
 */
export const AGENTS: Agent[] = [
  { id: "jett", name: "Jett", role: "duelist", portrait: "/agents/jett.png" },
  { id: "reyna", name: "Reyna", role: "duelist", portrait: "/agents/reyna.png" },
  { id: "neon", name: "Neon", role: "duelist", portrait: "/agents/neon.png" },
  { id: "raze", name: "Raze", role: "duelist", portrait: "/agents/raze.png" },
  { id: "phoenix", name: "Phoenix", role: "duelist", portrait: "/agents/phoenix.png" },
  { id: "iso", name: "Iso", role: "duelist", portrait: "/agents/iso.png" },
  { id: "waylay", name: "Waylay", role: "duelist", portrait: "/agents/waylay.png" },
  { id: "yoru", name: "Yoru", role: "duelist", portrait: "/agents/yoru.png" },

  { id: "clove", name: "Clove", role: "controller", portrait: "/agents/clove.png" },
  { id: "omen", name: "Omen", role: "controller", portrait: "/agents/omen.png" },
  { id: "viper", name: "Viper", role: "controller", portrait: "/agents/viper.png" },
  { id: "brimstone", name: "Brimstone", role: "controller", portrait: "/agents/brimstone.png" },
  { id: "harbor", name: "Harbor", role: "controller", portrait: "/agents/harbour.png" },
  { id: "astra", name: "Astra", role: "controller", portrait: "/agents/astra.png" },
  { id: "miks", name: "Miks", role: "controller", portrait: "/agents/miks.png" },

  { id: "vyse", name: "Vyse", role: "sentinel", portrait: "/agents/vyse.png" },
  { id: "killjoy", name: "Killjoy", role: "sentinel", portrait: "/agents/killjoy.png" },
  { id: "sage", name: "Sage", role: "sentinel", portrait: "/agents/sage.png" },
  { id: "cypher", name: "Cypher", role: "sentinel", portrait: "/agents/cypher.png" },
  { id: "chamber", name: "Chamber", role: "sentinel", portrait: "/agents/chamber.png" },
  { id: "deadlock", name: "Deadlock", role: "sentinel", portrait: "/agents/deadlock.png" },
  { id: "veto", name: "Veto", role: "sentinel", portrait: "/agents/veto.png" },

  { id: "tejo", name: "Tejo", role: "initiator", portrait: "/agents/tejo.png" },
  { id: "breach", name: "Breach", role: "initiator", portrait: "/agents/breach.png" },
  { id: "sova", name: "Sova", role: "initiator", portrait: "/agents/sova.png" },
  { id: "fade", name: "Fade", role: "initiator", portrait: "/agents/fade.png" },
  { id: "gekko", name: "Gekko", role: "initiator", portrait: "/agents/gekko.png" },
  { id: "skye", name: "Skye", role: "initiator", portrait: "/agents/skye.png" },
  { id: "kayo", name: "KAY/O", role: "initiator", portrait: "/agents/kayo.png" },
];

export function getAgentsByRole(role: Agent["role"]): Agent[] {
  return AGENTS.filter((agent) => agent.role === role);
}
