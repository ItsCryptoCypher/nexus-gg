import { AddFriendButton } from "@/components/friends/AddFriendButton";
import {
  avatarStatusFromPresence,
  friendStatusLabel,
  friendStatusTextClass,
} from "@/components/friends/friend-status";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformIcon, platformLabel } from "@/components/ui/PlatformIcon";
import type { PlatformContact } from "@/data/mock";

type PlatformContactCardProps = {
  contact: PlatformContact;
};

export function PlatformContactCard({ contact }: PlatformContactCardProps) {
  return (
    <article className="flex w-[220px] shrink-0 flex-col rounded-xl border border-border-subtle bg-surface-elevated p-4 transition-colors hover:bg-surface-hover">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Avatar
          src={contact.avatarUrl}
          alt={contact.username}
          size="lg"
          status={avatarStatusFromPresence(contact.status)}
        />
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-muted"
          title={platformLabel(contact.sourcePlatform)}
        >
          <PlatformIcon
            platform={contact.sourcePlatform}
            className="h-3.5 w-3.5"
          />
        </span>
      </div>

      <div className="mb-2 min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {contact.username}
        </p>
        <p
          className={`mt-0.5 text-xs font-medium ${friendStatusTextClass[contact.status]}`}
        >
          {friendStatusLabel[contact.status]}
          {contact.gameTitle ? ` · ${contact.gameTitle}` : ""}
        </p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {contact.mutualFriends.slice(0, 3).map((friend) => (
            <Avatar
              key={friend.id}
              src={friend.avatarUrl}
              alt={friend.username}
              size="sm"
              className="ring-2 ring-surface-elevated"
            />
          ))}
        </div>
        <p className="text-[11px] text-muted">
          {contact.mutualCount} mutual friend
          {contact.mutualCount === 1 ? "" : "s"}
        </p>
      </div>

      <AddFriendButton
        userId={contact.id}
        pending={contact.requestPending}
        fullWidth
        className="mt-auto"
      />
    </article>
  );
}
