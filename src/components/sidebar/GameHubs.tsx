import Image from "next/image";
import { SectionCard } from "@/components/ui/SectionCard";
import type { GameHub } from "@/data/mock";

type GameHubsProps = {
  hubs: GameHub[];
};

export function GameHubs({ hubs }: GameHubsProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Game Hubs</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          Browse
        </button>
      </div>
      <ul className="space-y-2.5">
        {hubs.map((hub) => (
          <li key={hub.id}>
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-surface-hover"
            >
              <div className="relative h-9 w-9 overflow-hidden rounded-lg">
                <Image
                  src={hub.iconUrl}
                  alt={hub.title}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {hub.title}
                </p>
                <p className="text-xs text-muted">{hub.membersLabel}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
