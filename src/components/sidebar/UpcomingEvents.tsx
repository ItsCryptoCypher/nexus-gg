import Image from "next/image";
import { SectionCard } from "@/components/ui/SectionCard";
import type { UpcomingEvent } from "@/data/mock";

type UpcomingEventsProps = {
  events: UpcomingEvent[];
};

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <SectionCard padding="sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Upcoming Events</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          View all
        </button>
      </div>
      <ul className="space-y-2">
        {events.map((event) => (
          <li key={event.id}>
            <a
              href="#"
              className="glass-panel flex gap-2.5 rounded-xl p-1.5 transition-opacity hover:opacity-95"
            >
              <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 py-0.5">
                <p className="truncate text-sm font-medium text-foreground">
                  {event.title}
                </p>
                <p className="truncate text-xs text-muted">
                  {event.type} · {event.gameTitle}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-dark">{event.dateLabel}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
