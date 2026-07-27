"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { openConversationWithFriend } from "@/app/messages/actions";
import { Avatar } from "@/components/ui/Avatar";
import type { MessageFriendOption } from "@/lib/messages/types";

type NewMessagePickerProps = {
  friends: MessageFriendOption[];
  onClose: () => void;
};

export function NewMessagePicker({ friends, onClose }: NewMessagePickerProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = friends.filter((friend) =>
    friend.username.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function startChat(friendId: string) {
    startTransition(async () => {
      setError(null);
      const result = await openConversationWithFriend(friendId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onClose();
      router.push(`/messages?c=${result.conversationId}`);
      router.refresh();
    });
  }

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
        <p className="text-sm font-semibold text-foreground">New message</p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-muted transition-colors hover:text-foreground"
        >
          Cancel
        </button>
      </div>
      <div className="border-b border-border-subtle px-4 py-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search friends..."
          className="h-10 w-full rounded-lg border border-border-subtle bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-dark focus:border-accent/50"
          autoFocus
        />
      </div>
      {error ? (
        <p className="px-4 pt-3 text-xs text-red-400">{error}</p>
      ) : null}
      <ul className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-muted">
            {friends.length === 0
              ? "Add friends first to start messaging."
              : "No friends match that search."}
          </li>
        ) : (
          filtered.map((friend) => (
            <li key={friend.id}>
              <button
                type="button"
                disabled={pending}
                onClick={() => startChat(friend.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover disabled:opacity-60"
              >
                <Avatar
                  src={friend.avatarUrl}
                  alt={friend.username}
                  size="md"
                />
                <span className="truncate text-sm font-medium text-foreground">
                  {friend.username}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
