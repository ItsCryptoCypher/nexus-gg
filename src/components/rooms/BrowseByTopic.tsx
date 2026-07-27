import {
  Crosshair,
  Gamepad2,
  Newspaper,
  Sparkles,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import type { RoomTopic } from "@/data/mock";

const topicIcons: Record<RoomTopic["icon"], LucideIcon> = {
  strategy: Target,
  ranked: Crosshair,
  esports: Trophy,
  chill: Sparkles,
  news: Newspaper,
  coaching: Gamepad2,
};

type BrowseByTopicProps = {
  topics: RoomTopic[];
};

export function BrowseByTopic({ topics }: BrowseByTopicProps) {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Browse by Topic
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Find rooms around the conversations you care about
          </p>
        </div>
        <button
          type="button"
          className="text-xs text-muted transition-colors hover:text-foreground"
        >
          View All Topics
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {topics.map((topic) => {
          const Icon = topicIcons[topic.icon];
          return (
            <button
              key={topic.id}
              type="button"
              className="flex flex-col items-start gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-3.5 text-left transition-colors hover:bg-surface-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-hover">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {topic.label}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {topic.activeRooms} active rooms
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}
