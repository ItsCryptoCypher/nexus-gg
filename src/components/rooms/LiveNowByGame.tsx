import Image from "next/image";
import { SectionCard } from "@/components/ui/SectionCard";
import type { LiveNowByGame as LiveNowByGameItem } from "@/data/mock";

type LiveNowByGameProps = {
  games: LiveNowByGameItem[];
};

export function LiveNowByGame({ games }: LiveNowByGameProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Live Now by Game</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          View all
        </button>
      </div>
      <ul className="space-y-3">
        {games.map((game) => (
          <li key={game.id} className="flex items-center gap-2.5">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={game.iconUrl}
                alt={game.gameTitle}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {game.gameTitle}
              </p>
              <p className="truncate text-xs text-muted">
                {game.roomsLabel} rooms
              </p>
            </div>
            <span className="text-[11px] font-semibold text-status-online">
              {game.growthLabel}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
