"use client";

import { Check, X } from "lucide-react";
import { useTransition } from "react";
import {
  acceptFriendRequest,
  declineFriendRequest,
} from "@/app/friends/actions";

type FriendRequestActionsProps = {
  friendshipId: string;
  username: string;
};

export function FriendRequestActions({
  friendshipId,
  username,
}: FriendRequestActionsProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={isPending}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-status-online text-white transition-colors hover:brightness-110 disabled:opacity-50"
        aria-label={`Accept request from ${username}`}
        onClick={() => {
          startTransition(async () => {
            await acceptFriendRequest(friendshipId);
          });
        }}
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        disabled={isPending}
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-subtle text-muted transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
        aria-label={`Decline request from ${username}`}
        onClick={() => {
          startTransition(async () => {
            await declineFriendRequest(friendshipId);
          });
        }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
