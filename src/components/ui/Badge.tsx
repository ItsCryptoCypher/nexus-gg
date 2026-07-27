import type { ReactNode } from "react";

type BadgeTone = "green" | "blue" | "orange" | "purple" | "gray";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const tones: Record<BadgeTone, string> = {
  green: "bg-status-online/15 text-status-online",
  blue: "bg-status-in-game/15 text-status-in-game",
  orange: "bg-status-looking/15 text-status-looking",
  purple: "bg-accent-soft text-accent-hover",
  gray: "bg-white/5 text-muted",
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
