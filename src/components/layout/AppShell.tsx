import type { ReactNode } from "react";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { PresenceHeartbeat } from "@/components/presence/PresenceHeartbeat";
import { currentUser, type CurrentUser } from "@/data/mock";
import { getUnreadMessageCount } from "@/lib/messages/get-messages-page";

type AppShellProps = {
  children: ReactNode;
  activeNavId?: string;
  /** Pass `null` to hide the right sidebar (e.g. Messages). */
  rightSidebar?: ReactNode | null;
  /** Use `/demo` for mock showcase routes that keep nav inside the demo. */
  basePath?: string;
  user?: CurrentUser;
  /** Override Messages nav badge; omit to let the shell load unread count. */
  unreadMessages?: number;
  /** Full-bleed main content (e.g. Messages three-panel layout). */
  flush?: boolean;
};

export async function AppShell({
  children,
  activeNavId = "play-now",
  rightSidebar,
  basePath,
  user = currentUser,
  unreadMessages,
  flush = false,
}: AppShellProps) {
  const unread =
    unreadMessages ??
    (basePath === "/demo" ? 0 : await getUnreadMessageCount());

  return (
    <div className="relative flex h-screen overflow-hidden bg-background text-foreground before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,_rgba(88,28,135,0.08),_transparent_50%)] before:content-['']">
      {basePath !== "/demo" ? <PresenceHeartbeat /> : null}
      <div className="hidden md:block">
        <LeftSidebar
          activeNavId={activeNavId}
          basePath={basePath}
          user={user}
          unreadMessages={unread}
        />
      </div>
      <main
        className={`relative z-10 min-w-0 flex-1 ${
          flush ? "flex flex-col overflow-hidden" : "overflow-y-auto scrollbar-thin"
        }`}
      >
        <MobileNav
          activeNavId={activeNavId}
          basePath={basePath}
          user={user}
          unreadMessages={unread}
        />
        <div
          className={
            flush
              ? "flex min-h-0 flex-1 flex-col px-3 pb-24 pt-3 sm:px-4 md:pb-4 md:pt-4 lg:px-5"
              : "mx-auto max-w-[1200px] px-4 py-5 pb-24 sm:px-6 lg:px-8 md:pb-5"
          }
        >
          {children}
        </div>
      </main>
      {rightSidebar === undefined ? <RightSidebar /> : rightSidebar}
    </div>
  );
}
