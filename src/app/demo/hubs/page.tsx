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

export const metadata = {
  title: "Nexus.gg — Game Hubs (Demo)",
  description:
    "Mock Game Hubs showcase with placeholder data for demos and investor previews.",
};

/** Static mock showcase — keep for demos while /hubs is UI-only. */
export default function DemoHubsPage() {
  return (
    <AppShell
      basePath="/demo"
      activeNavId="game-hubs"
      comingSoon
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
