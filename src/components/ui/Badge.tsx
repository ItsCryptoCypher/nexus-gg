import type { ReactNode } from "react";

type BadgeTone = "green" | "blue" | "orange" | "purple" | "gray";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const tones: Record<BadgeTone, string> = {
  green: "border border-status-online/30 bg-status-online/15 text-status-online",
  blue: "border border-status-in-game/30 bg-status-in-game/15 text-status-in-game",
  orange: "border border-status-looking/30 bg-status-looking/15 text-status-looking",
  purple:
    "border border-accent/45 bg-accent/10 text-foreground shadow-[0_0_10px_rgba(124,58,237,0.2)]",
  gray: "border border-white/10 bg-white/5 text-muted",
};

export function Badge({ children, tone = "gray", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
