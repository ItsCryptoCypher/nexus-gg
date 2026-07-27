import { Check, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SectionCard } from "@/components/ui/SectionCard";
import type { PartyInvite } from "@/data/mock";

type PartyInvitesProps = {
  invites: PartyInvite[];
};

export function PartyInvites({ invites }: PartyInvitesProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Party Invites</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          View all
        </button>
      </div>
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
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent-hover"
                aria-label={`Accept invite from ${invite.username}`}
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-subtle text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                aria-label={`Decline invite from ${invite.username}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
