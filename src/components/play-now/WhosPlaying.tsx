import { ChevronRight } from "lucide-react";
import { PlayingCard } from "@/components/play-now/PlayingCard";
import { SectionCard } from "@/components/ui/SectionCard";
import type { PlayingSession } from "@/data/mock";

type WhosPlayingProps = {
  sessions: PlayingSession[];
};

export function WhosPlaying({ sessions }: WhosPlayingProps) {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Who&apos;s Playing</h2>
          <p className="mt-0.5 text-xs text-muted">
            Friends currently in a game
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-0.5 text-xs text-muted transition-colors hover:text-foreground"
        >
          View All Friends
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
      {sessions.length === 0 ? (
        <p className="glass-panel rounded-xl px-4 py-6 text-sm text-muted">
          No one in a game right now. When friends launch a title with Discord
          activity on, they&apos;ll show up here.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {sessions.map((session) => (
            <PlayingCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
