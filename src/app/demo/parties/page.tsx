import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { PartiesHome } from "@/components/parties/PartiesHome";
import { PartiesRightSidebar } from "@/components/parties/PartiesRightSidebar";
import { PartiesTabs } from "@/components/parties/PartiesTabs";
import {
  friendsInParties,
  liveNowItems,
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

/** Static mock showcase — keep for demos while /parties uses live Discord parties. */
export default function DemoPartiesPage() {
  const liveYourParty = {
    ...yourParty,
    isHost: true,
    discordInviteUrl: "https://discord.gg/nexus-demo",
    voiceReady: true,
    memberCount: yourParty.members.length + yourParty.extraMembers,
    inVoiceCount: 2,
  };

  const liveInvites = partyInvites.map((invite) => ({
    ...invite,
    partyId: invite.id,
    hostId: "demo-host",
  }));

  return (
    <AppShell
      basePath="/demo"
      activeNavId="parties"
      rightSidebar={
        <PartiesRightSidebar
          invites={liveInvites}
          friends={friendsInParties}
          liveNow={liveNowItems}
        />
      }
    >
      <TopBar
        title="Parties"
        subtitle="Create, join, and discover live game parties."
      />
      <PartiesTabs>
        <PartiesHome
          stats={partyStats}
          yourParty={liveYourParty}
          openParties={openParties}
          friendOptions={[]}
        />
      </PartiesTabs>
    </AppShell>
  );
}
