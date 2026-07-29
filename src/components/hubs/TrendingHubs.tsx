import Image from "next/image";
import { SectionCard } from "@/components/ui/SectionCard";
import type { TrendingHub } from "@/data/mock";

type TrendingHubsProps = {
  hubs: TrendingHub[];
};

export function TrendingHubs({ hubs }: TrendingHubsProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Trending Hubs</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          View all
        </button>
      </div>
      <ul className="space-y-3">
        {hubs.map((hub) => (
          <li key={hub.id} className="flex items-center gap-2.5">
            <span className="w-4 shrink-0 text-xs font-semibold text-muted">
              {hub.rank}
            </span>
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={hub.iconUrl}
                alt={hub.title}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {hub.title}
              </p>
              <p className="truncate text-xs text-muted">
                {hub.membersLabel} members
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-status-online" />
              {hub.activeLabel}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
