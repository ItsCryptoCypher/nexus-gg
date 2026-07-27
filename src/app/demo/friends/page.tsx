import { FriendsHome } from "@/components/friends/FriendsHome";
import { FriendsRightSidebar } from "@/components/friends/FriendsRightSidebar";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import {
  friendRequests,
  friendStats,
  importedPlatforms,
  nexusFriends,
  onlineFriends,
  platformContacts,
  suggestedFriends,
} from "@/data/mock";

export const metadata = {
  title: "Nexus.gg — Friends (Demo)",
  description:
    "Mock Friends showcase with placeholder data for demos and investor previews.",
};

/** Static mock showcase — keep for demos while /friends moves to real data. */
export default function DemoFriendsPage() {
  return (
    <AppShell
      basePath="/demo"
      activeNavId="friends"
      rightSidebar={
        <FriendsRightSidebar
          requests={friendRequests}
          requestCount={6}
          onlineFriends={onlineFriends}
          onlineCount={14}
          platforms={importedPlatforms}
        />
      }
    >
      <TopBar
        title="Friends"
        subtitle="Manage your inner circle and discover your platform contacts."
      />
      <FriendsHome
        stats={friendStats}
        nexusFriends={nexusFriends}
        nexusCount={32}
        platformContacts={platformContacts}
        platformCount={84}
        suggestions={suggestedFriends}
      />
    </AppShell>
  );
}
