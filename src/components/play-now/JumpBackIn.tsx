import Image from "next/image";
import { SectionCard } from "@/components/ui/SectionCard";
import type { RecentGame } from "@/data/mock";

type JumpBackInProps = {
  games: RecentGame[];
};

export function JumpBackIn({ games }: JumpBackInProps) {
  return (
    <SectionCard className="min-w-0 flex-1" padding="lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Jump Back In</h2>
          <p className="mt-0.5 text-xs text-muted">Games you play often</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
        {games.map((game) => (
          <a key={game.id} href="#" className="group min-w-0">
            <div className="relative mb-2 aspect-[3/4] overflow-hidden rounded-xl border border-border-subtle">
              <Image
                src={game.coverUrl}
                alt={game.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="120px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <p className="absolute bottom-2 left-2 right-2 truncate text-[11px] font-medium text-white">
                {game.title}
              </p>
            </div>
            <p className="truncate text-[11px] text-muted">
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
