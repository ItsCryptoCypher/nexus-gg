import { ChevronLeft, ChevronRight } from "lucide-react";
import { HubCard } from "@/components/hubs/HubCard";
import { SectionCard } from "@/components/ui/SectionCard";
import type { HubCard as HubCardData } from "@/data/mock";

type FeaturedGameHubsProps = {
  hubs: HubCardData[];
};

export function FeaturedGameHubs({ hubs }: FeaturedGameHubsProps) {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Featured Game Hubs
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Popular communities you might like
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-xs text-muted transition-colors hover:text-foreground"
          >
            View All
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-subtle text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label="Scroll featured hubs left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-subtle text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label="Scroll featured hubs right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {hubs.map((hub) => (
          <HubCard key={hub.id} hub={hub} />
        ))}
      </div>
    </SectionCard>
  );
}
