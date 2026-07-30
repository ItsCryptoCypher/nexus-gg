import { Avatar } from "@/components/ui/Avatar";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SectionCard } from "@/components/ui/SectionCard";
import type { OnlineFriend } from "@/data/mock";

type WhosOnlineProps = {
  friends: OnlineFriend[];
};

export function WhosOnline({ friends }: WhosOnlineProps) {
  return (
    <SectionCard className="mb-3" padding="md">
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-foreground">
          Who&apos;s Online
        </h2>
        <p className="mt-0.5 text-[11px] text-muted">
          On Nexus, Discord, or a console — not in a game yet
        </p>
      </div>
      {friends.length === 0 ? (
        <p className="glass-panel rounded-xl px-3 py-3 text-xs text-muted">
          Nobody online right now. Open Nexus or Discord and you&apos;ll show up
          here.
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="glass-panel flex items-center gap-2 rounded-xl px-2.5 py-1.5"
            >
              <Avatar
                src={friend.avatarUrl}
                alt={friend.username}
                size="sm"
                status="online"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {friend.username}
                </p>
                <p className="truncate text-[11px] text-muted">
                  {friend.gameTitle ?? "Online"}
                </p>
              </div>
              <PlatformIcon
                platform={friend.platform}
                className="h-3 w-3 shrink-0 text-muted"
              />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
