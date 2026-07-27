"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { ChatThread } from "@/components/messages/ChatThread";
import { ConversationList } from "@/components/messages/ConversationList";
import { NewMessagePicker } from "@/components/messages/NewMessagePicker";
import { Button } from "@/components/ui/Button";
import type {
  ActiveConversation,
  ConversationListItem,
  MessageFriendOption,
} from "@/lib/messages/types";

type MessagesHomeProps = {
  meId: string;
  conversations: ConversationListItem[];
  friends: MessageFriendOption[];
  active: ActiveConversation | null;
};

export function MessagesHome({
  meId,
  conversations,
  friends,
  active,
}: MessagesHomeProps) {
  const [picking, setPicking] = useState(false);

  return (
    <div className="flex h-[calc(100vh-8.5rem)] min-h-[480px] overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <section
        className={`relative w-full flex-col border-r border-border-subtle md:flex md:w-[320px] md:shrink-0 ${
          active ? "hidden" : "flex"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Inbox</h2>
            <p className="text-[11px] text-muted">Message your Nexus friends</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setPicking(true)}
            aria-label="Start a new message"
          >
            <MessageSquarePlus className="h-4 w-4" />
            New
          </Button>
        </div>

        <ConversationList
          conversations={conversations}
          activeId={active?.id ?? null}
        />

        {picking ? (
          <NewMessagePicker
            friends={friends}
            onClose={() => setPicking(false)}
          />
        ) : null}
      </section>

      <section className="flex min-w-0 flex-1 flex-col">
        {active ? (
          <ChatThread conversation={active} meId={meId} />
        ) : (
          <div className="hidden flex-1 flex-col items-center justify-center gap-2 px-6 text-center md:flex">
            <p className="text-base font-semibold text-foreground">
              Select a conversation
            </p>
            <p className="max-w-sm text-sm text-muted">
              Pick a friend from your inbox or start a new message to chat.
            </p>
            <Button
              type="button"
              className="mt-3"
              onClick={() => setPicking(true)}
            >
              <MessageSquarePlus className="h-4 w-4" />
              New message
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
