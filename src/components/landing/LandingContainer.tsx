import type { ReactNode } from "react";

type LandingContainerProps = {
  children: ReactNode;
  className?: string;
};

/** Shared content width for landing sections (~1280px). */
export function LandingContainer({
  children,
  className = "",
}: LandingContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 md:px-6 xl:px-8 ${className}`}>
      {children}
    </div>
  );
}
