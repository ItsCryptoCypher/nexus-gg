import { ActivityFeed } from "@/components/sidebar/ActivityFeed";
import { GameHubs } from "@/components/sidebar/GameHubs";
import { UpcomingEvents } from "@/components/sidebar/UpcomingEvents";
import { activityFeed, gameHubs, upcomingEvents } from "@/data/mock";

export function RightSidebar() {
  return (
    <aside className="relative z-10 hidden h-full w-[280px] shrink-0 flex-col gap-2.5 overflow-y-auto border-l border-accent/15 bg-background p-3 scrollbar-thin xl:flex">
      <ActivityFeed items={activityFeed} />
      <GameHubs hubs={gameHubs} />
      <UpcomingEvents events={upcomingEvents} />
    </aside>
  );
}
