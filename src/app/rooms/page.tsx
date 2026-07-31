import { redirect } from "next/navigation";
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
import { getAppUser } from "@/lib/auth/get-app-user";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Nexus.gg — Rooms",
  description:
    "Discover and join live public gaming discussions about topics, strategies, and news.",
};

export default async function RoomsPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    redirect("/login?next=/rooms");
  }

  const user = await getAppUser();

  return (
    <AppShell
      user={user}
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
        user={user}
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
