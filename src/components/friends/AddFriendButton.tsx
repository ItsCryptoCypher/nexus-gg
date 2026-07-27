"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { sendFriendRequest } from "@/app/friends/actions";

type AddFriendButtonProps = {
  userId: string;
  pending?: boolean;
  label?: string;
  pendingLabel?: string;
  size?: "sm" | "md";
  fullWidth?: boolean;
  className?: string;
};

export function AddFriendButton({
  userId,
  pending = false,
  label = "Add on Nexus",
  pendingLabel = "Requested",
  size = "sm",
  fullWidth = false,
  className = "",
}: AddFriendButtonProps) {
  const [isPending, startTransition] = useTransition();

  if (pending) {
    return (
      <Button
        variant="outline"
        size={size}
        fullWidth={fullWidth}
        disabled
        className={className}
      >
        {pendingLabel}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size={size}
      fullWidth={fullWidth}
      disabled={isPending}
      className={`border-accent/40 text-accent-hover hover:bg-accent-soft hover:text-accent-hover ${className}`}
      onClick={() => {
        startTransition(async () => {
          await sendFriendRequest(userId);
        });
      }}
    >
      {isPending ? "Sending…" : label}
    </Button>
  );
}
