import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-graphite-700 bg-graphite-900 p-lg transition-colors duration-base hover:border-graphite-600",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";
