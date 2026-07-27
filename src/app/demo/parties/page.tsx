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

export const metadata = {
  title: "Nexus.gg — Parties (Demo)",
  description:
    "Mock Parties showcase with placeholder data for demos and investor previews.",
};

/** Static mock showcase — keep for demos while /parties moves to real data. */
export default function DemoPartiesPage() {
  return (
    <AppShell
      basePath="/demo"
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
