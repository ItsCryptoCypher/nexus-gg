"use client";

import type { ComponentType } from "react";
import { Pencil, PartyPopper, Phone, Star, UserPlus, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { MessageFriendOption } from "@/lib/messages/types";

type DetailsPanelProps = {
  friend: MessageFriendOption;
  onClose?: () => void;
};

export function DetailsPanel({ friend, onClose }: DetailsPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-3.5">
        <p className="flex min-w-0 items-center gap-1.5 truncate text-sm font-semibold text-white">
          <span className="truncate">{friend.username}</span>
          <Star className="h-3.5 w-3.5 shrink-0 text-[#6b7280]" />
        </p>
        <button
          type="button"
          onClick={onClose}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-[#9ca3af] hover:bg-white/[0.04] hover:text-white ${
            onClose ? "" : "invisible"
          }`}
          aria-label="Close"
          tabIndex={onClose ? 0 : -1}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 scrollbar-thin">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar
              src={friend.avatarUrl}
              alt={friend.username}
              size="2xl"
              status="online"
            />
            <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-surface-elevated text-muted">
              <Pencil className="h-3 w-3" />
            </span>
          </div>
          <p className="mt-3 text-xs text-[#9ca3af]">
            1 member · Direct message
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Action label="Start Call" icon={Phone} />
          <Action label="Create Party" icon={PartyPopper} />
          <Action label="Invite to Party" icon={UserPlus} />
        </div>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Members</h3>
            <span className="text-xs text-[#9ca3af]">1</span>
          </div>
          <div className="flex items-center gap-2.5 py-1.5">
            <Avatar
              src={friend.avatarUrl}
              alt={friend.username}
              size="sm"
              status="online"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {friend.username}
              </p>
              <p className="text-[11px] text-[#22c55e]">Online</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-2 text-xs font-medium text-[#8b5cf6] hover:text-[#a78bfa]"
          >
            View All
          </button>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Shared Media</h3>
            <span className="text-xs text-[#9ca3af]">0</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg border border-border-subtle bg-background"
              />
            ))}
          </div>
          <button
            type="button"
            className="mt-3 text-xs font-medium text-accent-hover hover:text-[#a78bfa]"
          >
            View All Media
          </button>
        </section>
      </div>
    </div>
  );
}

function Action({
  label,
  icon: Icon,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      disabled
      className="flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-background px-1 py-3 text-center transition hover:border-accent/40 disabled:opacity-80"
    >
      <Icon className="h-4 w-4 text-accent-hover" />
      <span className="text-[10px] font-medium leading-tight text-foreground">
        {label}
      </span>
    </button>
  );
}
