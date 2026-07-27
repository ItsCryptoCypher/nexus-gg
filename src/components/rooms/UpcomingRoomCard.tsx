import Image from "next/image";
import { BadgeCheck, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { UpcomingRoom } from "@/data/mock";

type UpcomingRoomCardProps = {
  room: UpcomingRoom;
};

export function UpcomingRoomCard({ room }: UpcomingRoomCardProps) {
  return (
    <article className="group flex w-[260px] shrink-0 flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated transition-colors hover:bg-surface-hover">
      <div className="relative h-[110px] w-full">
        <Image
          src={room.coverUrl}
          alt={room.gameTitle}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="260px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-black/25 to-black/20" />
        <span className="absolute left-2.5 top-2.5 rounded-md bg-surface/90 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-sm">
          {room.whenLabel}
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

        <Button size="sm" variant="outline" fullWidth className="mt-auto">
          <Bell className="h-3.5 w-3.5" />
          Set Reminder
        </Button>
      </div>
    </article>
  );
}
