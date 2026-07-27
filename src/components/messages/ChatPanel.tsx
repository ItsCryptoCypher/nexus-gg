"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  Check,
  ChevronLeft,
  ImagePlus,
  MoreVertical,
  PanelRight,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Star,
  Video,
} from "lucide-react";
import { markConversationRead, sendDirectMessage } from "@/app/messages/actions";
import { clockTime, dayLabel, sameDay } from "@/components/messages/utils";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/client";
import type { ActiveConversation, ChatMessage } from "@/lib/messages/types";

type ChatPanelProps = {
  conversation: ActiveConversation;
  meId: string;
  onOpenDetails?: () => void;
};

export function ChatPanel({
  conversation,
  meId,
  onOpenDetails,
}: ChatPanelProps) {
  const [messages, setMessages] = useState(conversation.messages);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.id, conversation.messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, conversation.id]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${conversation.id}`)
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

  function send() {
    const trimmed = body.trim();
    if (!trimmed || pending) return;
    startTransition(async () => {
      setError(null);
      const result = await sendDirectMessage(conversation.id, trimmed);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setBody("");
      setMessages((prev) =>
        prev.some((m) => m.id === result.message.id)
          ? prev
          : [...prev, result.message],
      );
    });
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#221e2c] px-4 py-3.5">
        <Link
          href="/messages"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9ca3af] hover:bg-white/[0.04] hover:text-white lg:hidden"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <Avatar
          src={conversation.friend.avatarUrl}
          alt={conversation.friend.username}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-white">
            {conversation.friend.username}
            <Star className="h-3.5 w-3.5 shrink-0 text-[#6b7280]" />
          </p>
          <p className="text-xs text-[#9ca3af]">Direct message</p>
        </div>
        <div className="flex items-center gap-0.5 text-[#9ca3af]">
          <IconBtn label="Call" disabled>
            <Phone className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Video" disabled>
            <Video className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Search" disabled>
            <Search className="h-4 w-4" />
          </IconBtn>
          {onOpenDetails ? (
            <button
              type="button"
              onClick={onOpenDetails}
              aria-label="Open details"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9ca3af] transition hover:bg-white/[0.04] hover:text-white xl:hidden"
            >
              <PanelRight className="h-4 w-4" />
            </button>
          ) : null}
          <IconBtn label="More" disabled>
            <MoreVertical className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[#9ca3af]">
              Say hi to {conversation.friend.username}.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const prev = messages[index - 1];
            const showDay =
              !prev || !sameDay(prev.createdAt, message.createdAt);
            return (
              <div key={message.id}>
                {showDay ? (
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#221e2c]" />
                    <span className="text-[11px] font-medium text-[#6b7280]">
                      {dayLabel(message.createdAt)}
                    </span>
                    <div className="h-px flex-1 bg-[#221e2c]" />
                  </div>
                ) : null}
                <MessageBubble
                  message={message}
                  friendName={conversation.friend.username}
                  friendAvatar={conversation.friend.avatarUrl}
                />
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-[#221e2c] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-1 rounded-2xl border border-[#221e2c] bg-[#12101a] px-3 py-1.5">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              maxLength={4000}
              placeholder={`Message ${conversation.friend.username}...`}
              disabled={pending}
              className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm text-white outline-none placeholder:text-[#6b7280]"
            />
            <IconBtn label="Emoji" disabled>
              <Smile className="h-4 w-4" />
            </IconBtn>
            <IconBtn label="Attach" disabled>
              <Paperclip className="h-4 w-4" />
            </IconBtn>
            <IconBtn label="Image" disabled>
              <ImagePlus className="h-4 w-4" />
            </IconBtn>
          </div>
          <button
            type="button"
            onClick={send}
            disabled={pending || !body.trim()}
            aria-label="Send"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition hover:bg-[#8b5cf6] disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  friendName,
  friendAvatar,
}: {
  message: ChatMessage;
  friendName: string;
  friendAvatar: string;
}) {
  if (message.mine) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-white">You</span>
          <span className="text-[10px] text-[#6b7280]">
            {clockTime(message.createdAt)}
          </span>
        </div>
        <div className="max-w-[min(70%,420px)] rounded-2xl rounded-tr-md bg-[#7c3aed] px-4 py-2.5 text-white">
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.body}
          </p>
        </div>
        <Check className="mr-0.5 h-3.5 w-3.5 text-[#7c3aed]" />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <Avatar
        src={friendAvatar}
        alt={friendName}
        size="sm"
        className="mt-5"
      />
      <div className="max-w-[min(70%,420px)]">
        <div className="mb-1 flex items-baseline gap-2 px-0.5">
          <span className="text-xs font-semibold text-white">{friendName}</span>
          <span className="text-[10px] text-[#6b7280]">
            {clockTime(message.createdAt)}
          </span>
        </div>
        <div className="rounded-2xl rounded-tl-md bg-[#1a1825] px-4 py-2.5">
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white">
            {message.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
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
      aria-label={label}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9ca3af] transition hover:bg-white/[0.04] hover:text-white disabled:opacity-45"
    >
      {children}
    </button>
  );
}
