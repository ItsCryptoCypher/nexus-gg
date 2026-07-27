import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { PartiesHome } from "@/components/parties/PartiesHome";
import { PartiesRightSidebar } from "@/components/parties/PartiesRightSidebar";
import { PartiesTabs } from "@/components/parties/PartiesTabs";
import {
  friendsInParties,
  liveNowItems,
  liveRooms,
  openParties,
  partyInvites,
  partyStats,
  yourParty,
} from "@/data/mock";
import { getAppUser } from "@/lib/auth/get-app-user";

export const metadata = {
  title: "Nexus.gg — Parties",
  description:
    "Create, join, and discover live game parties and rooms with friends and the community.",
};

export default async function PartiesPage() {
  const user = await getAppUser();

  return (
    <AppShell
      user={user}
      activeNavId="parties"
      rightSidebar={
        <PartiesRightSidebar
          invites={partyInvites}
          friends={friendsInParties}
          liveNow={liveNowItems}
        />
      }
    >
      <TopBar
        user={user}
        title="Parties"
        subtitle="Create, join, and discover live game parties and rooms."
      />
      <PartiesTabs>
        <PartiesHome
          stats={partyStats}
          yourParty={yourParty}
          openParties={openParties}
          liveRooms={liveRooms}
        />
      </PartiesTabs>
    </AppShell>
  );
}
