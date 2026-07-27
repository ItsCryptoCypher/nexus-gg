import { ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SectionCard } from "@/components/ui/SectionCard";
import type { FriendInParty } from "@/data/mock";

type FriendsInPartiesProps = {
  friends: FriendInParty[];
  moreCount?: number;
};

export function FriendsInParties({
  friends,
  moreCount = 6,
}: FriendsInPartiesProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Friends in Parties
        </h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          View all
        </button>
      </div>
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
              <p className="truncate text-xs text-muted">{friend.gameTitle}</p>
            </div>
            <Badge tone="purple">In Party</Badge>
          </li>
        ))}
      </ul>
      {moreCount > 0 ? (
        <button
          type="button"
          className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          Show {moreCount} more
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </SectionCard>
  );
}
