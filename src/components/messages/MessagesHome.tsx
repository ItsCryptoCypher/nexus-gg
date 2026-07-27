"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { ChatThread } from "@/components/messages/ChatThread";
import { ConversationList } from "@/components/messages/ConversationList";
import { MessagesInfoPanel } from "@/components/messages/MessagesInfoPanel";
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
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-border-subtle bg-[#0c0b11]">
      {/* Conversation list */}
      <section
        className={`relative w-full min-w-0 flex-col border-r border-border-subtle bg-[#111018] lg:flex lg:w-[300px] lg:shrink-0 xl:w-[320px] ${
          active ? "hidden" : "flex"
        }`}
      >
        <ConversationList
          conversations={conversations}
          activeId={active?.id ?? null}
          onCompose={() => setPicking(true)}
        />
        {picking ? (
          <NewMessagePicker
            friends={friends}
            onClose={() => setPicking(false)}
          />
        ) : null}
      </section>

      {/* Chat thread */}
      <section
        className={`min-w-0 flex-1 flex-col bg-[#0c0b11] ${
          active ? "flex" : "hidden lg:flex"
        }`}
      >
        {active ? (
          <ChatThread
            conversation={active}
            meId={meId}
            infoOpen={infoOpen}
            onToggleInfo={() => setInfoOpen((open) => !open)}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-base font-semibold text-foreground">
              Select a conversation
            </p>
            <p className="max-w-sm text-sm text-muted">
              Pick someone from your inbox or start a new message.
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

      {/* Right info panel */}
      {active ? (
        <>
          <section className="hidden w-[280px] shrink-0 border-l border-border-subtle bg-[#111018] xl:flex 2xl:w-[300px]">
            <MessagesInfoPanel friend={active.friend} />
          </section>
          {infoOpen ? (
            <div className="fixed inset-0 z-40 xl:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/60"
                aria-label="Close details"
                onClick={() => setInfoOpen(false)}
              />
              <div className="absolute inset-y-0 right-0 w-[min(100%,320px)] bg-[#111018] shadow-2xl">
                <MessagesInfoPanel
                  friend={active.friend}
                  onClose={() => setInfoOpen(false)}
                />
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
