import Image from "next/image";
import { SectionCard } from "@/components/ui/SectionCard";
import type { TrendingLiveRoom } from "@/data/mock";

type TrendingLiveProps = {
  rooms: TrendingLiveRoom[];
};

export function TrendingLive({ rooms }: TrendingLiveProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Trending Live</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          View all
        </button>
      </div>
      <ul className="space-y-3">
        {rooms.map((room) => (
          <li key={room.id} className="flex items-center gap-2.5">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={room.coverUrl}
                alt={room.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {room.title}
              </p>
              <p className="truncate text-xs text-muted">{room.hostUsername}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-status-online" />
              {room.viewersLabel}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
