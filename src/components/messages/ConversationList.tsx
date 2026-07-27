"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import type { ConversationListItem } from "@/lib/messages/types";

type ConversationListProps = {
  conversations: ConversationListItem[];
  activeId: string | null;
};

function formatTime(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function ConversationList({
  conversations,
  activeId,
}: ConversationListProps) {
  if (!conversations.length) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-10 text-center">
        <p className="text-sm text-muted">
          No conversations yet. Message a friend to get started.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex-1 overflow-y-auto scrollbar-thin">
      {conversations.map((conversation) => {
        const active = conversation.id === activeId;
        return (
          <li key={conversation.id}>
            <Link
              href={`/messages?c=${conversation.id}`}
              className={`flex items-center gap-3 border-b border-border-subtle px-4 py-3 transition-colors ${
                active
                  ? "bg-accent-soft"
                  : "hover:bg-surface-hover"
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
                    {formatTime(conversation.lastMessageAt)}
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
                    <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                  ) : null}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
