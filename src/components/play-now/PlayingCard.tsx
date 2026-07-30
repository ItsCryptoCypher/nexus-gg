import Image from "next/image";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import type { PlayingSession } from "@/data/mock";

type PlayingCardProps = {
  session: PlayingSession;
};

const statusConfig = {
  "in-party": { label: "In Party", tone: "green" as const },
  "in-game": { label: "In Game", tone: "blue" as const },
  looking: { label: "Looking to Play", tone: "orange" as const },
};

const actionLabel = {
  "join-party": "Join Party",
  "join-game": "Join Game",
  invite: "Invite",
};

export function PlayingCard({ session }: PlayingCardProps) {
  const status = statusConfig[session.status];
  const isOutline = session.action === "invite";

  return (
    <article className="glass-panel-elevated w-[168px] shrink-0 overflow-hidden rounded-xl">
      <div className="relative h-[72px] w-full">
        <Image
          src={session.coverUrl}
          alt={session.gameTitle}
          fill
          className="object-cover"
          sizes="168px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b12] via-transparent to-black/20" />
        <div className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-accent/30 bg-black/55 text-white backdrop-blur-sm">
          <PlatformIcon platform={session.platform} className="h-3 w-3" />
        </div>
        <div className="absolute -bottom-3 left-2.5">
          <Avatar
            src={session.avatarUrl}
            alt={session.username}
            size="sm"
            className="ring-2 ring-accent/60 ring-offset-1 ring-offset-[#0d0b12]"
          />
        </div>
      </div>

      <div className="space-y-1.5 px-2.5 pb-2.5 pt-4">
        <div>
          <p className="truncate text-xs font-semibold text-foreground">
            {session.username}
          </p>
          <p className="truncate text-[11px] text-muted">{session.gameTitle}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Badge tone={status.tone}>{status.label}</Badge>
          {session.partySize != null && session.partyMax != null ? (
            <span className="text-[10px] text-muted">
              {session.partySize} / {session.partyMax}
            </span>
          ) : null}
        </div>

        <Button
          variant={isOutline ? "outline" : "primary"}
          size="sm"
          fullWidth
          className="h-7 text-[11px]"
        >
          {actionLabel[session.action]}
        </Button>
      </div>
    </article>
  );
}
