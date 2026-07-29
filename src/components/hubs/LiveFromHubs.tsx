import Image from "next/image";
import { SectionCard } from "@/components/ui/SectionCard";
import type { HubLiveStream } from "@/data/mock";

type LiveFromHubsProps = {
  streams: HubLiveStream[];
};

export function LiveFromHubs({ streams }: LiveFromHubsProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Live from Hubs</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          View all
        </button>
      </div>
      <ul className="space-y-3">
        {streams.map((stream) => (
          <li key={stream.id} className="flex items-center gap-2.5">
            <div className="relative h-12 w-[72px] shrink-0 overflow-hidden rounded-lg">
              <Image
                src={stream.coverUrl}
                alt={stream.title}
                fill
                className="object-cover"
                sizes="72px"
              />
              <span className="absolute left-1 top-1 rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                Live
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {stream.title}
              </p>
              <p className="truncate text-xs text-muted">{stream.gameTitle}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {stream.viewersLabel}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
