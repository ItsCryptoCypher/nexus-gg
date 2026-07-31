import type { ReactNode } from "react";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { PresenceHeartbeat } from "@/components/presence/PresenceHeartbeat";
import { ComingSoonOverlay } from "@/components/ui/ComingSoonOverlay";
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
  /** Dim the page mockup and show a Coming Soon label. */
  comingSoon?: boolean;
};

export async function AppShell({
  children,
  activeNavId = "play-now",
  rightSidebar,
  basePath,
  user = currentUser,
  unreadMessages,
  flush = false,
  comingSoon = false,
}: AppShellProps) {
  const unread =
    unreadMessages ??
    (basePath === "/demo" ? 0 : await getUnreadMessageCount());

  return (
    <div className="relative flex h-screen overflow-hidden bg-background text-foreground">
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
              ? "relative flex min-h-0 flex-1 flex-col px-3 pb-24 pt-3 sm:px-4 md:pb-4 md:pt-4 lg:px-5"
              : `relative mx-auto max-w-[1200px] px-4 py-5 pb-24 sm:px-6 lg:px-8 md:pb-5 ${
                  comingSoon ? "min-h-[calc(100dvh-5rem)]" : ""
                }`
          }
        >
          {children}
          {comingSoon ? <ComingSoonOverlay /> : null}
        </div>
      </main>
      {rightSidebar === undefined ? <RightSidebar /> : rightSidebar}
    </div>
  );
}
