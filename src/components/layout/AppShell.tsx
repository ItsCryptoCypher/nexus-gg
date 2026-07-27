import type { ReactNode } from "react";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import type { CurrentUser } from "@/data/mock";

type AppShellProps = {
  children: ReactNode;
  activeNavId?: string;
  rightSidebar?: ReactNode;
  /** Use `/demo` for mock showcase routes that keep nav inside the demo. */
  basePath?: string;
  user?: CurrentUser;
};

export function AppShell({
  children,
  activeNavId = "play-now",
  rightSidebar,
  basePath,
  user,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <div className="hidden md:block">
        <LeftSidebar
          activeNavId={activeNavId}
          basePath={basePath}
          user={user}
        />
      </div>
      <main className="min-w-0 flex-1 overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-2.5 border-b border-border-subtle px-4 py-3 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
            N
          </div>
          <div className="min-w-0">
            <span className="text-sm font-bold tracking-[0.08em]">NEXUS.GG</span>
            {basePath === "/demo" ? (
              <p className="text-[10px] font-medium tracking-wide text-accent">
                Demo preview
              </p>
            ) : null}
          </div>
        </div>
        <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      {rightSidebar ?? <RightSidebar />}
    </div>
  );
}
