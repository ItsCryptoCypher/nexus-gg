import Image from "next/image";
import { SectionCard } from "@/components/ui/SectionCard";
import type { UpcomingEvent } from "@/data/mock";

type EventsHomeProps = {
  events: UpcomingEvent[];
};

export function EventsHome({ events }: EventsHomeProps) {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Upcoming Events
        </h2>
        <p className="mt-0.5 text-xs text-muted">
          Tournaments, community nights, and watch parties
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <li key={event.id}>
            <article className="glass-panel overflow-hidden rounded-xl">
              <div className="relative h-28 w-full">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                  {event.type}
                </span>
              </div>
              <div className="space-y-1 px-3 py-3">
                <p className="truncate text-sm font-semibold text-foreground">
                  {event.title}
                </p>
                <p className="truncate text-xs text-muted">{event.gameTitle}</p>
                <p className="text-[11px] text-muted-dark">{event.dateLabel}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
