import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { HubsHome } from "@/components/hubs/HubsHome";
import { HubsRightSidebar } from "@/components/hubs/HubsRightSidebar";
import {
  browseHubs,
  featuredHubs,
  hubActivityPosts,
  hubLiveStreams,
  hubRecentPosts,
  hubStats,
  suggestedHubs,
  trendingHubs,
} from "@/data/mock";
import { getAppUser } from "@/lib/auth/get-app-user";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Nexus.gg — Game Hubs",
  description:
    "Discover and follow game communities. Share clips, ask questions, and connect with players.",
};

export default async function HubsPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    redirect("/login?next=/hubs");
  }

  const user = await getAppUser();

  return (
    <AppShell
      user={user}
      activeNavId="game-hubs"
      rightSidebar={
        <HubsRightSidebar
          trending={trendingHubs}
          streams={hubLiveStreams}
          recentPosts={hubRecentPosts}
          suggested={suggestedHubs}
        />
      }
    >
      <TopBar
        user={user}
        title="Game Hubs"
        subtitle="Discover and follow game communities. Share clips, ask questions, and connect with players."
      />
      <HubsHome
        stats={hubStats}
        featured={featuredHubs}
        browse={browseHubs}
        activity={hubActivityPosts}
      />
    </AppShell>
  );
}
