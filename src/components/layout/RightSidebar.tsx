import { ActivityFeed } from "@/components/sidebar/ActivityFeed";
import { GameHubs } from "@/components/sidebar/GameHubs";
import { UpcomingEvents } from "@/components/sidebar/UpcomingEvents";
import { activityFeed, gameHubs, upcomingEvents } from "@/data/mock";

export function RightSidebar() {
  return (
    <aside className="hidden h-full w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border-subtle bg-background p-4 scrollbar-thin xl:flex">
      <ActivityFeed items={activityFeed} />
      <GameHubs hubs={gameHubs} />
      <UpcomingEvents events={upcomingEvents} />
    </aside>
  );
}
