import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { PartiesHome } from "@/components/parties/PartiesHome";
import { PartiesRightSidebar } from "@/components/parties/PartiesRightSidebar";
import { PartiesTabs } from "@/components/parties/PartiesTabs";
import { getAppUser } from "@/lib/auth/get-app-user";
import { getPartiesPageData } from "@/lib/parties/get-parties-page";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Nexus.gg — Parties",
  description:
    "Create, join, and discover live game parties with friends and the community.",
};

export default async function PartiesPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    redirect("/login?next=/parties");
  }

  const [user, parties] = await Promise.all([
    getAppUser(),
    getPartiesPageData(),
  ]);

  return (
    <AppShell
      user={user}
      activeNavId="parties"
      rightSidebar={
        <PartiesRightSidebar
          invites={parties.partyInvites}
          friends={parties.friendsInParties}
          liveNow={parties.liveNow}
        />
      }
    >
      <TopBar
        user={user}
        title="Parties"
        subtitle="Create game parties in Nexus. Discord hosts the private voice for PC and console."
      />
      <PartiesTabs>
        <PartiesHome
          stats={parties.stats}
          yourParty={parties.yourParty}
          openParties={parties.openParties}
          friendOptions={parties.nexusFriendOptions}
        />
      </PartiesTabs>
    </AppShell>
  );
}
