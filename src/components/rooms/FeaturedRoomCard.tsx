import Image from "next/image";
import { BadgeCheck, Headphones } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { LiveRoom } from "@/data/mock";

type FeaturedRoomCardProps = {
  room: LiveRoom;
};

export function FeaturedRoomCard({ room }: FeaturedRoomCardProps) {
  return (
    <article className="group flex w-[260px] shrink-0 flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated transition-colors hover:bg-surface-hover">
      <div className="relative h-[130px] w-full">
        <Image
          src={room.coverUrl}
          alt={room.gameTitle}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="260px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-black/20 to-black/30" />
        <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md bg-red-500/90 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Live
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <div className="flex items-center gap-2">
          <Avatar
            src={room.host.avatarUrl}
            alt={room.host.username}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-sm font-medium text-foreground">
              {room.host.username}
              {room.host.verified ? (
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-accent-hover" />
              ) : null}
            </p>
            <p className="truncate text-[11px] text-muted">{room.gameTitle}</p>
          </div>
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {room.title}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center">
            {room.listeners.slice(0, 3).map((listener, index) => (
              <div
                key={listener.id}
                className={index === 0 ? "" : "-ml-2"}
                style={{ zIndex: room.listeners.length - index }}
              >
                <Avatar
                  src={listener.avatarUrl}
                  alt={listener.username}
                  size="sm"
                  className="ring-2 ring-surface-elevated"
                />
              </div>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
            <Headphones className="h-3 w-3" />
            {room.listenersLabel}
          </span>
        </div>

        <Button size="sm" fullWidth>
          {room.action === "listen" ? "Listen Live" : "Request to Speak"}
        </Button>
      </div>
    </article>
  );
}
