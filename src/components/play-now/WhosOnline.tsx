import { Avatar } from "@/components/ui/Avatar";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SectionCard } from "@/components/ui/SectionCard";
import type { OnlineFriend } from "@/data/mock";

type WhosOnlineProps = {
  friends: OnlineFriend[];
};

export function WhosOnline({ friends }: WhosOnlineProps) {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Who&apos;s Online
        </h2>
        <p className="mt-0.5 text-xs text-muted">
          On Nexus, Discord, or a console — not in a game yet
        </p>
      </div>
      {friends.length === 0 ? (
        <p className="rounded-xl border border-accent/20 bg-black/25 px-4 py-6 text-sm text-muted">
          Nobody online right now. Open Nexus or Discord and you&apos;ll show up
          here.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center gap-2.5 rounded-xl border border-accent/20 bg-black/25 px-3 py-2.5"
            >
              <Avatar
                src={friend.avatarUrl}
                alt={friend.username}
                size="sm"
                status="online"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {friend.username}
                </p>
                <p className="truncate text-xs text-muted">
                  {friend.gameTitle ?? "Online"}
                </p>
              </div>
              <PlatformIcon
                platform={friend.platform}
                className="h-3.5 w-3.5 shrink-0 text-muted"
              />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
