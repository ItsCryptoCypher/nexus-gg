import Image from "next/image";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import type { OpenParty } from "@/data/mock";

type OpenPartyCardProps = {
  party: OpenParty;
};

export function OpenPartyCard({ party }: OpenPartyCardProps) {
  return (
    <article className="group w-[220px] shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated transition-colors hover:bg-surface-hover">
      <div className="relative h-[120px] w-full">
        <Image
          src={party.coverUrl}
          alt={party.gameTitle}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="220px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-transparent to-black/25" />
        <p className="absolute bottom-2 left-3 right-3 truncate text-sm font-semibold text-white">
          {party.gameTitle}
        </p>
      </div>

      <div className="space-y-3 px-3 pb-3 pt-3">
        <div className="flex items-center gap-2">
          <Avatar
            src={party.host.avatarUrl}
            alt={party.host.username}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {party.host.username}
            </p>
            <p className="text-[11px] text-muted">Host</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {party.tags.map((tag) => (
            <Badge key={tag} tone="gray">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-muted">
            {party.platforms.map((platform) => (
              <PlatformIcon
                key={platform}
                platform={platform}
                className="h-3.5 w-3.5"
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-muted">
            {party.partySize} / {party.partyMax}
          </span>
        </div>

        <Button size="sm" fullWidth>
          Join Party
        </Button>
      </div>
    </article>
  );
}
