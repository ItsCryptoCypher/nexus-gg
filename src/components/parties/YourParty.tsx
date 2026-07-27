"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { ExternalLink, Mic, UserPlus } from "lucide-react";
import {
  endGameParty,
  inviteFriendToParty,
  leaveGameParty,
} from "@/app/parties/actions";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SectionCard } from "@/components/ui/SectionCard";
import type { LiveYourParty } from "@/lib/parties/get-parties-page";

type FriendOption = { id: string; username: string; avatarUrl: string };

type YourPartyProps = {
  party: LiveYourParty | null;
  friendOptions?: FriendOption[];
};

export function YourParty({ party, friendOptions = [] }: YourPartyProps) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!party) {
    return (
      <SectionCard className="mb-6" padding="lg">
        <h2 className="text-base font-semibold text-foreground">Your Party</h2>
        <p className="mt-2 text-sm text-muted">
          You&apos;re not in a party yet. Create one above — we&apos;ll spin up a
          private Discord voice channel for cross-platform chat.
        </p>
      </SectionCard>
    );
  }

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
            <h3 className="truncate text-lg font-semibold text-foreground">
              {party.name}
            </h3>
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

          {error ? <p className="text-xs text-red-400">{error}</p> : null}

          {inviteOpen ? (
            <div className="rounded-lg border border-border-subtle bg-surface p-3">
              <p className="mb-2 text-xs font-medium text-muted">
                Invite a Nexus friend
              </p>
              {friendOptions.length === 0 ? (
                <p className="text-xs text-muted">
                  Add Nexus friends first, then invite them here.
                </p>
              ) : (
                <ul className="space-y-2">
                  {friendOptions.map((friend) => (
                    <li
                      key={friend.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar
                          src={friend.avatarUrl}
                          alt={friend.username}
                          size="sm"
                        />
                        <span className="truncate text-sm text-foreground">
                          {friend.username}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        disabled={isPending}
                        onClick={() => {
                          setError(null);
                          startTransition(async () => {
                            const result = await inviteFriendToParty(
                              party.id,
                              friend.id,
                            );
                            if (!result.ok) setError(result.error);
                            else setInviteOpen(false);
                          });
                        }}
                      >
                        Invite
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-2 lg:w-44">
          {party.isHost ? (
            <Button
              size="sm"
              fullWidth
              disabled={isPending}
              onClick={() => setInviteOpen((v) => !v)}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite Friends
            </Button>
          ) : null}

          {party.discordInviteUrl ? (
            <a
              href={party.discordInviteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover"
            >
              <Mic className="h-3.5 w-3.5" />
              Join party voice
              <ExternalLink className="h-3 w-3 text-muted" />
            </a>
          ) : (
            <Button size="sm" variant="outline" fullWidth disabled>
              <Mic className="h-3.5 w-3.5" />
              Voice setting up…
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            fullWidth
            disabled={isPending}
            className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const result = party.isHost
                  ? await endGameParty(party.id)
                  : await leaveGameParty(party.id);
                if (!result.ok) setError(result.error);
              });
            }}
          >
            {party.isHost ? "End Party" : "Leave Party"}
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
