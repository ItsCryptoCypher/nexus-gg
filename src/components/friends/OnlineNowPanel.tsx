import { Avatar } from "@/components/ui/Avatar";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SectionCard } from "@/components/ui/SectionCard";
import type { OnlineFriend } from "@/data/mock";

type OnlineNowPanelProps = {
  friends: OnlineFriend[];
  totalCount: number;
};

export function OnlineNowPanel({ friends, totalCount }: OnlineNowPanelProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Online Now
          <span className="ml-1.5 text-muted">({totalCount})</span>
        </h2>
      </div>
      {friends.length === 0 ? (
        <p className="text-xs text-muted">
          Online Nexus friends will show up here.
        </p>
      ) : (
        <ul className="space-y-3">
          {friends.map((friend) => (
            <li key={friend.id} className="flex items-center gap-2.5">
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
                {friend.activityDetail ? (
                  <p className="truncate text-[11px] text-muted-dark">
                    {friend.activityDetail}
                  </p>
                ) : null}
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
