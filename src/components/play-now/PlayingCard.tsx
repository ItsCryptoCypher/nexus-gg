import type { CSSProperties } from "react";
import Image from "next/image";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import type { PlayingSession } from "@/data/mock";

const playingCardFill = {
  "--glass-fill-gradient":
    "linear-gradient(135deg, #0e1122 0%, #090b18 55%, #090b18 100%)",
} as CSSProperties;

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
    <article
      className="glass-panel w-[200px] shrink-0 overflow-hidden rounded-xl"
      style={playingCardFill}
    >
      <div className="relative h-[55px] w-full">
        <Image
          src={session.coverUrl}
          alt={session.gameTitle}
          fill
          className="object-cover"
          sizes="200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1122] via-transparent to-black/20" />
        <div className="absolute right-2 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-accent/30 bg-black/55 text-white backdrop-blur-sm">
          <PlatformIcon platform={session.platform} className="h-3 w-3" />
        </div>
        <div className="absolute -bottom-4 left-3">
          <Avatar src={session.avatarUrl} alt={session.username} size="md" />
        </div>
      </div>

      <div className="space-y-2.5 bg-[image:var(--glass-fill-gradient)] px-3 pb-3 pt-6">
        <div>
          <p className="truncate text-sm font-semibold text-foreground">
            {session.username}
          </p>
          <p className="truncate text-xs text-muted">{session.gameTitle}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Badge tone={status.tone}>{status.label}</Badge>
          {session.partySize != null && session.partyMax != null ? (
            <span className="text-[11px] text-muted">
              {session.partySize} / {session.partyMax}
            </span>
          ) : null}
        </div>

        <Button
          variant={isOutline ? "outline" : "primary"}
          size="sm"
          fullWidth
        >
          {actionLabel[session.action]}
        </Button>
      </div>
    </article>
  );
}
