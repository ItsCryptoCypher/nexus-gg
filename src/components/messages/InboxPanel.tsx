"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { PenSquare, Search } from "lucide-react";
import { openConversationWithFriend } from "@/app/messages/actions";
import { relativeTime } from "@/components/messages/utils";
import { Avatar } from "@/components/ui/Avatar";
import type {
  ConversationListItem,
  MessageFriendOption,
} from "@/lib/messages/types";

type InboxPanelProps = {
  conversations: ConversationListItem[];
  friends: MessageFriendOption[];
  activeId: string | null;
};

export function InboxPanel({
  conversations,
  friends,
  activeId,
}: InboxPanelProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [composing, setComposing] = useState(false);
  const [friendQuery, setFriendQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filteredConversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.friend.username.toLowerCase().includes(q) ||
        (c.lastMessagePreview ?? "").toLowerCase().includes(q),
    );
  }, [conversations, query]);

  const filteredFriends = useMemo(() => {
    const q = friendQuery.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter((f) => f.username.toLowerCase().includes(q));
  }, [friends, friendQuery]);

  function startChat(friendId: string) {
    startTransition(async () => {
      setError(null);
      const result = await openConversationWithFriend(friendId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setComposing(false);
      setFriendQuery("");
      router.push(`/messages?c=${result.conversationId}`);
      router.refresh();
    });
  }

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      <div className="flex items-center gap-2 px-4 pb-3 pt-4">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="h-10 w-full rounded-xl border border-[#221e2c] bg-[#0a090f] pl-9 pr-3 text-sm text-white outline-none placeholder:text-[#6b7280] focus:border-[#7c3aed]/50"
          />
        </label>
        <button
          type="button"
          onClick={() => setComposing(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7c3aed] text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] transition hover:bg-[#8b5cf6]"
          aria-label="New message"
        >
          <PenSquare className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 scrollbar-thin">
        {filteredConversations.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 py-12 text-center">
            <p className="text-sm text-[#9ca3af]">
              {conversations.length === 0
                ? "No conversations yet."
                : "No matches."}
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {filteredConversations.map((conversation) => {
              const selected = conversation.id === activeId;
              return (
                <li key={conversation.id}>
                  <Link
                    href={`/messages?c=${conversation.id}`}
                    className={[
                      "flex items-center gap-3 rounded-xl px-3 py-3 transition",
                      selected
                        ? "bg-[rgba(124,58,237,0.14)] shadow-[0_0_0_1px_#7c3aed,0_0_24px_rgba(124,58,237,0.2)]"
                        : "hover:bg-white/[0.03]",
                    ].join(" ")}
                  >
                    <Avatar
                      src={conversation.friend.avatarUrl}
                      alt={conversation.friend.username}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[13px] font-semibold text-white">
                          {conversation.friend.username}
                        </p>
                        <span className="shrink-0 text-[11px] text-[#6b7280]">
                          {relativeTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="truncate text-xs text-[#9ca3af]">
                          {conversation.lastMessagePreview || "No messages yet"}
                        </p>
                        {conversation.unread ? (
                          <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] px-1.5 text-[10px] font-semibold text-white">
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

      {composing ? (
        <div className="absolute inset-0 z-20 flex flex-col bg-[#12101a]">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-semibold text-white">New message</p>
            <button
              type="button"
              onClick={() => {
                setComposing(false);
                setError(null);
              }}
              className="text-xs text-[#9ca3af] hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="px-4 pb-3">
            <input
              value={friendQuery}
              onChange={(e) => setFriendQuery(e.target.value)}
              placeholder="Search friends..."
              autoFocus
              className="h-10 w-full rounded-xl border border-[#221e2c] bg-[#0a090f] px-3 text-sm text-white outline-none placeholder:text-[#6b7280] focus:border-[#7c3aed]/50"
            />
          </div>
          {error ? (
            <p className="px-4 pb-2 text-xs text-red-400">{error}</p>
          ) : null}
          <ul className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
            {filteredFriends.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-[#9ca3af]">
                {friends.length === 0
                  ? "Add friends to start messaging."
                  : "No friends match that search."}
              </li>
            ) : (
              filteredFriends.map((friend) => (
                <li key={friend.id}>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => startChat(friend.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03] disabled:opacity-50"
                  >
                    <Avatar
                      src={friend.avatarUrl}
                      alt={friend.username}
                      size="md"
                    />
                    <span className="truncate text-sm font-medium text-white">
                      {friend.username}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
