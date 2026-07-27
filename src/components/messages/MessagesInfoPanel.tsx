"use client";

import type { ComponentType } from "react";
import { PartyPopper, Phone, UserPlus, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { MessageFriendOption } from "@/lib/messages/types";

type MessagesInfoPanelProps = {
  friend: MessageFriendOption;
  onClose?: () => void;
};

export function MessagesInfoPanel({ friend, onClose }: MessagesInfoPanelProps) {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-l border-border-subtle bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
        <p className="truncate text-sm font-semibold text-foreground">
          {friend.username}
        </p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            aria-label="Close details"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <span className="text-[11px] text-muted">Details</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <div className="flex flex-col items-center text-center">
          <Avatar src={friend.avatarUrl} alt={friend.username} size="xl" />
          <p className="mt-3 text-base font-semibold text-foreground">
            {friend.username}
          </p>
          <p className="mt-0.5 text-xs text-muted">Direct message</p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <ActionTile icon={Phone} label="Start Call" disabled />
          <ActionTile icon={PartyPopper} label="Create Party" disabled />
          <ActionTile icon={UserPlus} label="Invite" disabled />
        </div>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">About</h3>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
            <p className="text-xs leading-relaxed text-muted">
              Chat one-on-one with {friend.username}. Party invites and calls
              from messages are coming soon.
            </p>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Shared Media
            </h3>
            <span className="text-xs text-muted">0</span>
          </div>
          <div className="rounded-xl border border-dashed border-border-subtle px-4 py-8 text-center">
            <p className="text-xs text-muted">No shared media yet</p>
          </div>
        </section>
      </div>
    </aside>
  );
}

function ActionTile({
  icon: Icon,
  label,
  disabled,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-surface-elevated px-2 py-3 text-center transition-colors hover:bg-surface-hover disabled:opacity-50"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-hover">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-[10px] font-medium leading-tight text-foreground">
        {label}
      </span>
    </button>
  );
}
