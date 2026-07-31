import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { RoomsHome } from "@/components/rooms/RoomsHome";
import { RoomsRightSidebar } from "@/components/rooms/RoomsRightSidebar";
import {
  liveNowByGame,
  liveRooms,
  popularHosts,
  roomStats,
  roomTopics,
  trendingLiveRooms,
  upcomingRooms,
} from "@/data/mock";

export const metadata = {
  title: "Nexus.gg — Rooms (Demo)",
  description:
    "Mock Rooms showcase with placeholder data for demos and investor previews.",
};

/** Static mock showcase — keep for demos while /rooms is UI-only. */
export default function DemoRoomsPage() {
  return (
    <AppShell
      basePath="/demo"
      activeNavId="rooms"
      comingSoon
      rightSidebar={
        <RoomsRightSidebar
          trending={trendingLiveRooms}
          hosts={popularHosts}
          games={liveNowByGame}
        />
      }
    >
      <TopBar
        title="Rooms"
        subtitle="Discover and join live public gaming discussions."
      />
      <RoomsHome
        stats={roomStats}
        featuredRooms={liveRooms}
        topics={roomTopics}
        upcoming={upcomingRooms}
      />
    </AppShell>
  );
}
