import { Headphones } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { LiveRoom } from "@/data/mock";

type LiveRoomCardProps = {
  room: LiveRoom;
};

export function LiveRoomCard({ room }: LiveRoomCardProps) {
  return (
    <article className="w-[220px] shrink-0 rounded-xl border border-border-subtle bg-surface-elevated p-3.5 transition-colors hover:bg-surface-hover">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          Live
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted">
          <Headphones className="h-3 w-3" />
          {room.listenersLabel}
        </span>
      </div>

      <h3 className="truncate text-sm font-semibold text-foreground">
        {room.title}
      </h3>
      <div className="mt-2 flex items-center gap-2">
        <Avatar src={room.host.avatarUrl} alt={room.host.username} size="sm" />
        <p className="truncate text-xs text-muted">{room.host.username}</p>
      </div>

      <div className="mt-3 flex items-center">
        {room.listeners.map((listener, index) => (
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

      <div className="mt-3">
        <Button size="sm" fullWidth>
          {room.action === "listen" ? "Listen Live" : "Request to Speak"}
        </Button>
      </div>
    </article>
  );
}
