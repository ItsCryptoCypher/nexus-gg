import { redirect } from "next/navigation";
import { FriendsHome } from "@/components/friends/FriendsHome";
import { FriendsRightSidebar } from "@/components/friends/FriendsRightSidebar";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { getAppUser } from "@/lib/auth/get-app-user";
import { getFriendsPageData } from "@/lib/friends/get-friends-page";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Nexus.gg — Friends",
  description:
    "Manage your Nexus friends inner circle and discover platform contacts.",
};

export default async function FriendsPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    redirect("/login?next=/friends");
  }

  const [user, friends] = await Promise.all([
    getAppUser(),
    getFriendsPageData(),
  ]);

  return (
    <AppShell
      user={user}
      activeNavId="friends"
      rightSidebar={
        <FriendsRightSidebar
          requests={friends.requests}
          requestCount={friends.requestCount}
          onlineFriends={friends.onlineFriends}
          onlineCount={friends.onlineCount}
          platforms={friends.platforms}
        />
      }
    >
      <TopBar
        user={user}
        title="Friends"
        subtitle="Manage your inner circle and discover your platform contacts."
      />
      <FriendsHome
        stats={friends.stats}
        nexusFriends={friends.nexusFriends}
        nexusCount={friends.nexusCount}
        platformContacts={friends.platformContacts}
        platformCount={friends.platformCount}
        suggestions={friends.suggestions}
      />
    </AppShell>
  );
}
