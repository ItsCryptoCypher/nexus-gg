"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Check,
  ChevronLeft,
  MoreVertical,
  PanelRight,
  Phone,
  Search,
  Star,
  Video,
} from "lucide-react";
import { MessageComposer } from "@/components/messages/MessageComposer";
import {
  formatDayDivider,
  formatMessageClock,
  isSameDay,
} from "@/components/messages/format-time";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/client";
import type { ActiveConversation, ChatMessage } from "@/lib/messages/types";
import { markConversationRead } from "@/app/messages/actions";

type ChatThreadProps = {
  conversation: ActiveConversation;
  meId: string;
  onToggleInfo?: () => void;
  infoOpen?: boolean;
};

export function ChatThread({
  conversation,
  meId,
  onToggleInfo,
  infoOpen,
}: ChatThreadProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.id, conversation.messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, conversation.id]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`dm:${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            conversation_id: string;
            sender_id: string;
            body: string;
            created_at: string;
          };
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [
              ...prev,
              {
                id: row.id,
                conversationId: row.conversation_id,
                senderId: row.sender_id,
                body: row.body,
                createdAt: row.created_at,
                mine: row.sender_id === meId,
              },
            ];
          });
          if (row.sender_id !== meId) {
            void markConversationRead(conversation.id);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversation.id, meId]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3.5">
        <Link
          href="/messages"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/[0.04] hover:text-foreground lg:hidden"
          aria-label="Back to inbox"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <Avatar
          src={conversation.friend.avatarUrl}
          alt={conversation.friend.username}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
            {conversation.friend.username}
            <Star className="h-3.5 w-3.5 shrink-0 fill-none text-muted-dark" />
          </p>
          <p className="truncate text-xs text-muted">Direct message</p>
        </div>
        <div className="flex items-center gap-0.5 text-muted">
          <HeaderIconButton label="Start call" disabled>
            <Phone className="h-4 w-4" />
          </HeaderIconButton>
          <HeaderIconButton label="Start video" disabled>
            <Video className="h-4 w-4" />
          </HeaderIconButton>
          <HeaderIconButton label="Search in conversation" disabled>
            <Search className="h-4 w-4" />
          </HeaderIconButton>
          {onToggleInfo ? (
            <button
              type="button"
              onClick={onToggleInfo}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.04] hover:text-foreground xl:hidden ${
                infoOpen ? "bg-accent-soft text-accent" : ""
              }`}
              aria-label="Conversation details"
            >
              <PanelRight className="h-4 w-4" />
            </button>
          ) : null}
          <HeaderIconButton label="More options" disabled>
            <MoreVertical className="h-4 w-4" />
          </HeaderIconButton>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[200px] items-center justify-center">
            <p className="text-sm text-muted">
              Say hi to {conversation.friend.username}.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const prev = messages[index - 1];
            const showDivider =
              !prev || !isSameDay(prev.createdAt, message.createdAt);

            return (
              <div key={message.id} className="space-y-5">
                {showDivider ? (
                  <div className="flex items-center gap-3 py-1">
                    <div className="h-px flex-1 bg-border-subtle" />
                    <span className="text-[11px] font-medium text-muted-dark">
                      {formatDayDivider(message.createdAt)}
                    </span>
                    <div className="h-px flex-1 bg-border-subtle" />
                  </div>
                ) : null}

                {message.mine ? (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-baseline gap-2 px-1">
                      <span className="text-xs font-semibold text-foreground">
                        You
                      </span>
                      <span className="text-[10px] text-muted-dark">
                        {formatMessageClock(message.createdAt)}
                      </span>
                    </div>
                    <div className="max-w-[70%] rounded-2xl rounded-tr-md bg-accent px-4 py-2.5 text-white">
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {message.body}
                      </p>
                    </div>
                    <Check className="mr-1 h-3.5 w-3.5 text-accent" />
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <Avatar
                      src={conversation.friend.avatarUrl}
                      alt={conversation.friend.username}
                      size="sm"
                      className="mt-5"
                    />
                    <div className="min-w-0 max-w-[70%]">
                      <div className="mb-1 flex items-baseline gap-2 px-1">
                        <span className="text-xs font-semibold text-foreground">
                          {conversation.friend.username}
                        </span>
                        <span className="text-[10px] text-muted-dark">
                          {formatMessageClock(message.createdAt)}
                        </span>
                      </div>
                      <div className="rounded-2xl rounded-tl-md bg-[#1a1824] px-4 py-2.5">
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
                          {message.body}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <MessageComposer
        conversationId={conversation.id}
        friendName={conversation.friend.username}
        onSent={(message) => {
          setMessages((prev) =>
            prev.some((m) => m.id === message.id) ? prev : [...prev, message],
          );
        }}
      />
    </div>
  );
}

function HeaderIconButton({
  children,
  label,
  disabled,
}: {
  children: ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.04] hover:text-foreground disabled:cursor-default disabled:opacity-45"
    >
      {children}
    </button>
  );
}
