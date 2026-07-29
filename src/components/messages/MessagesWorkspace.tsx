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

const card =
  "min-h-0 overflow-hidden rounded-2xl border border-border-subtle bg-surface";

export function MessagesWorkspace({
  meId,
  conversations,
  friends,
  active,
}: MessagesWorkspaceProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 gap-3">
      <section
        className={[
          card,
          "w-full shrink-0 lg:w-[290px] xl:w-[310px]",
          active ? "hidden lg:flex lg:flex-col" : "flex flex-col",
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
          card,
          "min-w-0 flex-1",
          active ? "flex flex-col" : "hidden lg:flex lg:flex-col",
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
          <section
            className={[
              card,
              "hidden w-[270px] shrink-0 xl:flex xl:flex-col 2xl:w-[290px]",
            ].join(" ")}
          >
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
              <div className="absolute inset-y-0 right-0 w-[min(100%,320px)] border-l border-border-subtle bg-surface shadow-2xl">
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
