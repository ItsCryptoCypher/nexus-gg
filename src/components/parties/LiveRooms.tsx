import { ChevronLeft, ChevronRight } from "lucide-react";
import { LiveRoomCard } from "@/components/parties/LiveRoomCard";
import { SectionCard } from "@/components/ui/SectionCard";
import type { LiveRoom } from "@/data/mock";

type LiveRoomsProps = {
  rooms: LiveRoom[];
};

export function LiveRooms({ rooms }: LiveRoomsProps) {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Live Rooms</h2>
          <p className="mt-0.5 text-xs text-muted">
            Drop into voice rooms happening right now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-xs text-muted transition-colors hover:text-foreground"
          >
            View all
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-subtle text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label="Scroll rooms left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-subtle text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label="Scroll rooms right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {rooms.map((room) => (
          <LiveRoomCard key={room.id} room={room} />
        ))}
      </div>
    </SectionCard>
  );
}
