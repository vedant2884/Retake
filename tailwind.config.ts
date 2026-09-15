import type { Config } from "tailwindcss";

/**
 * Design token system for the challenge platform.
 *
 * Naming follows the tonal roles used throughout the codebase:
 * - graphite: the neutral base. 950 is the page background, working
 *   up to 50 for primary text. Nothing here is pure black or pure white.
 * - signal: the single product-wide accent (cold cyan). Used for
 *   primary actions, active navigation, links, and focus states.
 *   Not used as a background fill outside of buttons.
 * - role.*: contextual colors for agent roles. These only ever appear
 *   inside challenge and agent-specific UI (badges, agent cards,
 *   progress rings). They never set page or nav chrome.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0A0D0F",
          900: "#12161A",
          850: "#171C20",
          800: "#1D2328",
          700: "#262D33",
          600: "#333C43",
          400: "#6B767D",
          200: "#A7B0B5",
          50: "#E9EDEE",
        },
        signal: {
          400: "#4FCBD1",
          500: "#2FB8C0",
          600: "#22929A",
        },
        role: {
          duelist: "#C15B45",
          initiator: "#C99A3E",
          controller: "#7C6FCB",
          sentinel: "#4F9A6B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.625rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.625rem" }],
        "5xl": ["3rem", { lineHeight: "3.25rem" }],
        "6xl": ["3.75rem", { lineHeight: "4rem" }],
      },
      spacing: {
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
        "4xl": "6rem",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        lg: "12px",
      },
      boxShadow: {
        elevate: "0 4px 16px rgba(0, 0, 0, 0.4)",
        "glow-accent": "0 0 0 1px rgba(47, 184, 192, 0.4), 0 0 24px rgba(47, 184, 192, 0.25)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "350ms",
      },
      transitionTimingFunction: {
        reveal: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
