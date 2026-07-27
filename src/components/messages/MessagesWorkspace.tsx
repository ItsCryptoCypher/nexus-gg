"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { ChatPanel } from "@/components/messages/ChatPanel";
import { DetailsPanel } from "@/components/messages/DetailsPanel";
import { InboxPanel } from "@/components/messages/InboxPanel";
import type {
  ActiveConversation,
  ConversationListItem,
  MessageFriendOption,
} from "@/lib/messages/types";

type MessagesWorkspaceProps = {
  meId: string;
  conversations: ConversationListItem[];
  friends: MessageFriendOption[];
  active: ActiveConversation | null;
};

export function MessagesWorkspace({
  meId,
  conversations,
  friends,
  active,
}: MessagesWorkspaceProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-[#221e2c] bg-[#0a090f]">
      <section
        className={[
          "min-h-0 w-full shrink-0 border-r border-[#221e2c] bg-[#12101a]",
          "lg:flex lg:w-[300px] xl:w-[320px]",
          active ? "hidden lg:flex" : "flex",
        ].join(" ")}
      >
        <InboxPanel
          conversations={conversations}
          friends={friends}
          activeId={active?.id ?? null}
        />
      </section>

      <section
        className={[
          "min-h-0 min-w-0 flex-1 bg-[#0a090f]",
          active ? "flex" : "hidden lg:flex",
        ].join(" ")}
      >
        {active ? (
          <ChatPanel
            conversation={active}
            meId={meId}
            onOpenDetails={() => setDetailsOpen(true)}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(124,58,237,0.15)] text-[#8b5cf6]">
              <MessageSquarePlus className="h-5 w-5" />
            </div>
            <p className="text-base font-semibold text-white">
              Select a conversation
            </p>
            <p className="max-w-xs text-sm text-[#9ca3af]">
              Choose a chat from the left, or compose a new message to a friend.
            </p>
          </div>
        )}
      </section>

      {active ? (
        <>
          <section className="hidden min-h-0 w-[280px] shrink-0 border-l border-[#221e2c] bg-[#12101a] xl:flex 2xl:w-[300px]">
            <DetailsPanel friend={active.friend} />
          </section>

          {detailsOpen ? (
            <div className="fixed inset-0 z-50 xl:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/65"
                aria-label="Close details"
                onClick={() => setDetailsOpen(false)}
              />
              <div className="absolute inset-y-0 right-0 w-[min(100%,320px)] border-l border-[#221e2c] bg-[#12101a] shadow-2xl">
                <DetailsPanel
                  friend={active.friend}
                  onClose={() => setDetailsOpen(false)}
                />
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
