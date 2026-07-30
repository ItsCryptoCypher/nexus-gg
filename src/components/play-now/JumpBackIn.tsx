import Image from "next/image";
import { SectionCard } from "@/components/ui/SectionCard";
import type { RecentGame } from "@/data/mock";

type JumpBackInProps = {
  games: RecentGame[];
};

export function JumpBackIn({ games }: JumpBackInProps) {
  return (
    <SectionCard className="min-w-0 flex-1" padding="md">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Jump Back In</h2>
          <p className="mt-0.5 text-[11px] text-muted">Games you play often</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {games.map((game) => (
          <a key={game.id} href="#" className="group min-w-0">
            <div className="glass-panel relative mb-1.5 aspect-[3/4] max-h-[120px] overflow-hidden rounded-xl">
              <Image
                src={game.coverUrl}
                alt={game.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="100px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <p className="absolute bottom-1.5 left-1.5 right-1.5 truncate text-[10px] font-medium text-white">
                {game.title}
              </p>
            </div>
            <p className="truncate text-[10px] text-muted">
              {game.recentlyPlayed
                ? "Recently played"
                : `${game.friendsPlaying} friend${game.friendsPlaying === 1 ? "" : "s"} playing`}
            </p>
          </a>
        ))}
      </div>
    </SectionCard>
  );
}
