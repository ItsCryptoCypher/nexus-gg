import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import type { SuggestedHub } from "@/data/mock";

type SuggestedHubsProps = {
  hubs: SuggestedHub[];
};

export function SuggestedHubs({ hubs }: SuggestedHubsProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Suggested Hubs</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          View all
        </button>
      </div>
      <ul className="space-y-3">
        {hubs.map((hub) => (
          <li key={hub.id} className="flex items-center gap-2.5">
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
              <p className="truncate text-xs text-muted">{hub.membersLabel}</p>
            </div>
            <Button size="sm" className="shrink-0 px-2.5">
              Follow
            </Button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
