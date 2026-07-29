import { ChevronDown } from "lucide-react";
import { HubCard } from "@/components/hubs/HubCard";
import { SectionCard } from "@/components/ui/SectionCard";
import type { HubCard as HubCardData } from "@/data/mock";

type BrowseGameHubsProps = {
  hubs: HubCardData[];
};

export function BrowseGameHubs({ hubs }: BrowseGameHubsProps) {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Browse Game Hubs
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Find and follow communities for your favorite games
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-subtle bg-surface px-3 text-xs font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            All Categories
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-subtle bg-surface px-3 text-xs font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            Sort: Popular
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {hubs.map((hub) => (
          <HubCard key={hub.id} hub={hub} compact />
        ))}
      </div>
    </SectionCard>
  );
}
