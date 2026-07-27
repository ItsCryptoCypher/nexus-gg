"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PenSquare, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { formatConversationTime } from "@/components/messages/format-time";
import type { ConversationListItem } from "@/lib/messages/types";

type ConversationListProps = {
  conversations: ConversationListItem[];
  activeId: string | null;
  onCompose: () => void;
};

export function ConversationList({
  conversations,
  activeId,
  onCompose,
}: ConversationListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.friend.username.toLowerCase().includes(q) ||
        (conversation.lastMessagePreview ?? "").toLowerCase().includes(q),
    );
  }, [conversations, query]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-dark" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search messages..."
            className="h-10 w-full rounded-xl border border-border-subtle bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-dark focus:border-accent/50"
          />
        </div>
        <button
          type="button"
          onClick={onCompose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-background text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          aria-label="Compose message"
        >
          <PenSquare className="h-4 w-4" />
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4 py-10 text-center">
          <p className="text-sm text-muted">
            {conversations.length === 0
              ? "No conversations yet. Message a friend to get started."
              : "No messages match that search."}
          </p>
        </div>
      ) : (
        <ul className="flex-1 space-y-1 overflow-y-auto p-2 scrollbar-thin">
          {filtered.map((conversation) => {
            const active = conversation.id === activeId;
            return (
              <li key={conversation.id}>
                <Link
                  href={`/messages?c=${conversation.id}`}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                    active
                      ? "border border-accent bg-accent-soft shadow-[0_0_20px_rgba(124,58,237,0.18)]"
                      : "border border-transparent hover:bg-surface-hover"
                  }`}
                >
                  <Avatar
                    src={conversation.friend.avatarUrl}
                    alt={conversation.friend.username}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-sm ${
                          conversation.unread
                            ? "font-semibold text-foreground"
                            : "font-medium text-foreground"
                        }`}
                      >
                        {conversation.friend.username}
                      </p>
                      <span className="shrink-0 text-[11px] text-muted-dark">
                        {formatConversationTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <p
                        className={`truncate text-xs ${
                          conversation.unread
                            ? "font-medium text-foreground"
                            : "text-muted"
                        }`}
                      >
                        {conversation.lastMessagePreview || "No messages yet"}
                      </p>
                      {conversation.unread ? (
                        <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-white">
                          1
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
