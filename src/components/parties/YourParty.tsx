import Image from "next/image";
import { ChevronDown, Mic, Pencil, UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SectionCard } from "@/components/ui/SectionCard";
import type { YourParty as YourPartyData } from "@/data/mock";

type YourPartyProps = {
  party: YourPartyData;
};

export function YourParty({ party }: YourPartyProps) {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-foreground">Your Party</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-status-online/15 px-2 py-0.5 text-[11px] font-medium text-status-online">
            <span className="h-1.5 w-1.5 rounded-full bg-status-online" />
            Live
          </span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-border-subtle px-2.5 py-1.5 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          Party Actions
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-border-subtle bg-surface-elevated p-4 lg:flex-row lg:items-stretch">
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl lg:h-auto lg:w-48">
          <Image
            src={party.coverUrl}
            alt={party.gameTitle}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 192px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <p className="absolute bottom-2 left-2 text-xs font-medium text-white">
            {party.gameTitle}
          </p>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-semibold text-foreground">
                {party.name}
              </h3>
              <button
                type="button"
                className="rounded-md p-1 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                aria-label="Edit party name"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted">{party.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {party.tags.map((tag) => (
              <Badge key={tag} tone="purple">
                {tag}
              </Badge>
            ))}
            <div className="ml-1 flex items-center gap-1.5 text-muted">
              {party.platforms.map((platform) => (
                <PlatformIcon
                  key={platform}
                  platform={platform}
                  className="h-3.5 w-3.5"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <div>
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-dark">
                Members
              </p>
              <div className="flex items-center">
                {party.members.map((member, index) => (
                  <div
                    key={member.id}
                    className={index === 0 ? "" : "-ml-2"}
                    style={{ zIndex: party.members.length - index }}
                  >
                    <Avatar
                      src={member.avatarUrl}
                      alt={member.username}
                      size="sm"
                      className="ring-2 ring-surface-elevated"
                    />
                  </div>
                ))}
                {party.extraMembers > 0 ? (
                  <span className="-ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-[11px] font-semibold text-muted ring-2 ring-surface-elevated">
                    +{party.extraMembers}
                  </span>
                ) : null}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-dark">
                Open Slots
              </p>
              <p className="text-sm font-semibold text-foreground">
                {party.openSlots} / {party.partyMax}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-dark">
                Status
              </p>
              <p className="inline-flex items-center gap-1.5 text-sm font-medium text-status-online">
                <span className="h-1.5 w-1.5 rounded-full bg-status-online" />
                {party.readyStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 lg:w-40">
          <Button size="sm" fullWidth>
            <UserPlus className="h-3.5 w-3.5" />
            Invite Friends
          </Button>
          <Button size="sm" variant="outline" fullWidth>
            <Mic className="h-3.5 w-3.5" />
            Start Voice
          </Button>
          <Button
            size="sm"
            variant="outline"
            fullWidth
            className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            Leave Party
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
