import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded px-lg py-sm text-sm font-medium transition-colors duration-fast disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-signal-500 text-graphite-950 hover:bg-signal-400 focus-visible:outline-none focus-visible:shadow-glow-accent",
  secondary:
    "border border-graphite-600 text-graphite-50 hover:border-signal-500 hover:text-signal-400",
  ghost: "text-graphite-200 hover:text-graphite-50",
};

/**
 * Exposed so non-button elements (an `<a>` via next/link, for
 * example) can carry the same visual style without nesting an
 * actual <button> inside an anchor.
 */
export function buttonStyles(variant: ButtonVariant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return <button ref={ref} className={buttonStyles(variant, className)} {...props} />;
  }
);

Button.displayName = "Button";
