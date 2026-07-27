import { MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import {
  avatarStatusFromPresence,
  friendStatusTextClass,
  friendStatusLabel,
} from "@/components/friends/friend-status";
import type { NexusFriend } from "@/data/mock";

type NexusFriendCardProps = {
  friend: NexusFriend;
};

export function NexusFriendCard({ friend }: NexusFriendCardProps) {
  return (
    <article className="flex min-w-[200px] flex-1 flex-col rounded-xl border border-border-subtle bg-surface-elevated p-4 transition-colors hover:bg-surface-hover">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Avatar
          src={friend.avatarUrl}
          alt={friend.username}
          size="lg"
          status={avatarStatusFromPresence(friend.status)}
          ring={friend.status === "online" || friend.status === "in-party"}
        />
        <button
          type="button"
          className="rounded-lg p-1 text-muted transition-colors hover:bg-surface hover:text-foreground"
          aria-label={`More options for ${friend.username}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {friend.username}
        </p>
        <p
          className={`mt-0.5 text-xs font-medium ${friendStatusTextClass[friend.status]}`}
        >
          {friendStatusLabel[friend.status]}
        </p>
      </div>

      <div className="mb-3 flex min-h-[28px] items-center gap-2">
        {friend.gameTitle ? (
          <>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-soft text-[10px] font-bold text-accent-hover">
              {friend.gameTitle.charAt(0)}
            </span>
            <p className="truncate text-xs text-muted">{friend.gameTitle}</p>
          </>
        ) : (
          <p className="text-xs text-muted-dark">Not in a game</p>
        )}
      </div>

      <div className="mb-4 flex items-center gap-1.5">
        {friend.platforms.map((platform) => (
          <span
            key={platform}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-surface text-muted"
          >
            <PlatformIcon platform={platform} className="h-3 w-3" />
          </span>
        ))}
      </div>

      <div className="mt-auto flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Message
        </Button>
        <Button variant="primary" size="sm" className="flex-1">
          Invite
        </Button>
      </div>
    </article>
  );
}
