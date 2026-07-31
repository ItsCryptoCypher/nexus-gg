"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ConnectPlatforms } from "@/components/sidebar/ConnectPlatforms";
import { navIconMap, resolveNavHref } from "@/components/sidebar/nav-icons";
import { UserProfileCard } from "@/components/sidebar/UserProfileCard";
import { navGroups, type CurrentUser, type NavItem } from "@/data/mock";

const bottomItems: { id: string; label: string; icon: string; href: string }[] =
  [
    { id: "play-now", label: "Play", icon: "zap", href: "/play" },
    { id: "friends", label: "Friends", icon: "users", href: "/friends" },
    { id: "parties", label: "Parties", icon: "party-popper", href: "/parties" },
    {
      id: "messages",
      label: "Messages",
      icon: "message-square",
      href: "/messages",
    },
  ];

type MobileNavProps = {
  activeNavId?: string;
  basePath?: string;
  user: CurrentUser;
  unreadMessages?: number;
};

function withMessageBadge(
  item: NavItem,
  unreadMessages?: number,
): NavItem {
  if (item.id !== "messages") return item;
  return {
    ...item,
    badge: unreadMessages && unreadMessages > 0 ? unreadMessages : undefined,
  };
}

export function MobileNav({
  activeNavId = "play-now",
  basePath,
  user,
  unreadMessages,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const groups = navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => withMessageBadge(item, unreadMessages)),
  }));

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-2.5 border-b border-border-subtle bg-background/95 px-4 py-3 backdrop-blur md:hidden">
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
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,300px)] flex-col border-r border-border-subtle bg-background shadow-2xl">
            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
                  N
                </div>
                <span className="text-sm font-bold tracking-[0.08em] text-foreground">
                  NEXUS.GG
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
              {groups.map((group, index) => (
                <div key={group.id}>
                  {index > 0 ? (
                    <div
                      className="mx-3 mb-4 h-px bg-border-subtle"
                      aria-hidden
                    />
                  ) : null}
                  <div className="mb-4">
                    <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.12em] text-muted-dark">
                      {group.label}
                    </p>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = navIconMap[item.icon] ?? navIconMap.zap;
                        const active = item.id === activeNavId;
                        return (
                          <li key={item.id}>
                            <a
                              href={resolveNavHref(item.href, basePath)}
                              onClick={() => setOpen(false)}
                              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                                active
                                  ? "border border-accent/40 bg-gradient-to-r from-accent/35 to-accent/10 font-medium text-white"
                                  : "border border-transparent text-muted hover:border-accent/15 hover:bg-white/5 hover:text-foreground"
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 ${
                                  active ? "text-violet-200" : "text-muted"
                                }`}
                              />
                              <span className="flex-1">{item.label}</span>
                              {item.badge ? (
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-white shadow-[0_0_10px_rgba(124,58,237,0.45)]">
                                  {item.badge}
                                </span>
                              ) : null}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ))}
            </nav>

            <div className="space-y-3 border-t border-border-subtle p-3">
              <UserProfileCard user={user} />
              <ConnectPlatforms />
            </div>
          </aside>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-background/95 backdrop-blur md:hidden">
        <ul className="grid grid-cols-5 px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1">
          {bottomItems.map((item) => {
            const Icon = navIconMap[item.icon] ?? navIconMap.zap;
            const active = item.id === activeNavId;
            const badge =
              item.id === "messages" && unreadMessages && unreadMessages > 0
                ? unreadMessages
                : null;
            return (
              <li key={item.id}>
                <a
                  href={resolveNavHref(item.href, basePath)}
                  className={`relative flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-medium transition-colors ${
                    active
                      ? "text-accent"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <span className="relative">
                    <Icon className="h-5 w-5" />
                    {badge ? (
                      <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-white">
                        {badge > 9 ? "9+" : badge}
                      </span>
                    ) : null}
                  </span>
                  {item.label}
                </a>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex w-full flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-medium text-muted transition-colors hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
              More
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
