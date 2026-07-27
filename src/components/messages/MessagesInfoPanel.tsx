"use client";

import type { ComponentType } from "react";
import { PartyPopper, Phone, Star, UserPlus, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { MessageFriendOption } from "@/lib/messages/types";

type MessagesInfoPanelProps = {
  friend: MessageFriendOption;
  onClose?: () => void;
};

export function MessagesInfoPanel({ friend, onClose }: MessagesInfoPanelProps) {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <p className="flex min-w-0 items-center gap-1.5 truncate text-sm font-semibold text-foreground">
          <span className="truncate">{friend.username}</span>
          <Star className="h-3.5 w-3.5 shrink-0 text-muted-dark" />
        </p>
        <button
          type="button"
          onClick={onClose}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/[0.04] hover:text-foreground ${
            onClose ? "" : "invisible"
          }`}
          aria-label="Close details"
          tabIndex={onClose ? 0 : -1}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-5 scrollbar-thin">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar
              src={friend.avatarUrl}
              alt={friend.username}
              size="2xl"
              status="online"
            />
          </div>
          <p className="mt-3 text-base font-semibold text-foreground">
            {friend.username}
          </p>
          <p className="mt-1 text-xs text-muted">1 member · Direct message</p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <ActionTile icon={Phone} label="Start Call" disabled />
          <ActionTile icon={PartyPopper} label="Create Party" disabled />
          <ActionTile icon={UserPlus} label="Invite to Party" disabled />
        </div>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Members</h3>
            <span className="text-xs text-muted">1</span>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center gap-2.5 rounded-xl px-1 py-1.5">
              <Avatar
                src={friend.avatarUrl}
                alt={friend.username}
                size="sm"
                status="online"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {friend.username}
                </p>
                <p className="text-[11px] text-status-online">Online</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Shared Media
            </h3>
            <span className="text-xs text-muted">0</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg border border-border-subtle bg-[#0c0b11]"
              />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-dark">
            No shared media yet
          </p>
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
      className="flex flex-col items-center gap-2 rounded-xl border border-accent/35 bg-accent-soft/40 px-1.5 py-3 text-center transition-colors hover:border-accent/55 hover:bg-accent-soft disabled:opacity-55"
    >
      <Icon className="h-4 w-4 text-accent-hover" />
      <span className="text-[10px] font-medium leading-tight text-foreground">
        {label}
      </span>
    </button>
  );
}
