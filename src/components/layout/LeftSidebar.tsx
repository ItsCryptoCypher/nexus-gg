import { ConnectPlatforms } from "@/components/sidebar/ConnectPlatforms";
import { NavSection } from "@/components/sidebar/NavSection";
import { UserProfileCard } from "@/components/sidebar/UserProfileCard";
import { currentUser, navGroups, type CurrentUser } from "@/data/mock";
import { getUnreadMessageCount } from "@/lib/messages/get-messages-page";

type LeftSidebarProps = {
  activeNavId?: string;
  basePath?: string;
  user?: CurrentUser;
  unreadMessages?: number;
};

export async function LeftSidebar({
  activeNavId = "play-now",
  basePath,
  user = currentUser,
  unreadMessages,
}: LeftSidebarProps) {
  const unread =
    unreadMessages ??
    (basePath === "/demo" ? 0 : await getUnreadMessageCount());

  const groups = navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.id === "messages"
        ? {
            ...item,
            badge: unread > 0 ? unread : undefined,
          }
        : item,
    ),
  }));

  return (
    <aside className="relative z-10 flex h-full w-[240px] shrink-0 flex-col border-r border-accent/15 bg-background">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white shadow-[0_0_16px_rgba(124,58,237,0.45)]">
          N
        </div>
        <div className="min-w-0">
          <span className="font-display text-sm font-extrabold tracking-[0.08em] text-foreground">
            NEXUS.GG
          </span>
          {basePath === "/demo" ? (
            <p className="text-[10px] font-medium tracking-wide text-accent">
              Demo preview
            </p>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {groups.map((group, index) => (
          <div key={group.id}>
            {index > 0 ? (
              <div className="mx-3 mb-4 h-px bg-border-subtle" aria-hidden />
            ) : null}
            <NavSection
              group={group}
              activeId={activeNavId}
              basePath={basePath}
            />
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-border-subtle p-3">
        <UserProfileCard user={user} />
        <ConnectPlatforms />
      </div>
    </aside>
  );
}
