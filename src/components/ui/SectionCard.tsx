import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
};

const paddingMap = {
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export function SectionCard({
  children,
  className = "",
  padding = "md",
}: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border border-border-subtle bg-surface ${paddingMap[padding]} ${className}`}
    >
      {children}
    </section>
  );
}
