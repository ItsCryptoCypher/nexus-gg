import type { ReactNode } from "react";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { RightSidebar } from "@/components/layout/RightSidebar";
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
};

export async function AppShell({
  children,
  activeNavId = "play-now",
  rightSidebar,
  basePath,
  user = currentUser,
  unreadMessages,
}: AppShellProps) {
  const unread =
    unreadMessages ??
    (basePath === "/demo" ? 0 : await getUnreadMessageCount());

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <div className="hidden md:block">
        <LeftSidebar
          activeNavId={activeNavId}
          basePath={basePath}
          user={user}
          unreadMessages={unread}
        />
      </div>
      <main className="min-w-0 flex-1 overflow-y-auto scrollbar-thin">
        <MobileNav
          activeNavId={activeNavId}
          basePath={basePath}
          user={user}
          unreadMessages={unread}
        />
        <div className="mx-auto max-w-[1200px] px-4 py-5 pb-24 sm:px-6 lg:px-8 md:pb-5">
          {children}
        </div>
      </main>
      {rightSidebar === undefined ? <RightSidebar /> : rightSidebar}
    </div>
  );
}
