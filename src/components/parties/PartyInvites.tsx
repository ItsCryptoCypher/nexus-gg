"use client";

import { Check, X } from "lucide-react";
import { useTransition } from "react";
import {
  acceptPartyInvite,
  declinePartyInvite,
} from "@/app/parties/actions";
import { Avatar } from "@/components/ui/Avatar";
import { SectionCard } from "@/components/ui/SectionCard";
import type { LivePartyInvite } from "@/lib/parties/get-parties-page";

type PartyInvitesProps = {
  invites: LivePartyInvite[];
};

export function PartyInvites({ invites }: PartyInvitesProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Party Invites</h2>
      </div>
      {invites.length === 0 ? (
        <p className="text-xs text-muted">No party invites right now.</p>
      ) : (
        <ul className="space-y-3">
          {invites.map((invite) => (
            <li key={invite.id} className="flex items-center gap-2.5">
              <Avatar src={invite.avatarUrl} alt={invite.username} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {invite.username}
                </p>
                <p className="truncate text-xs text-muted">{invite.gameTitle}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={isPending}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                  aria-label={`Accept invite from ${invite.username}`}
                  onClick={() => {
                    startTransition(async () => {
                      await acceptPartyInvite(invite.partyId);
                    });
                  }}
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-subtle text-muted transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
                  aria-label={`Decline invite from ${invite.username}`}
                  onClick={() => {
                    startTransition(async () => {
                      await declinePartyInvite(invite.partyId);
                    });
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
