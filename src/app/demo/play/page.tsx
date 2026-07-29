import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { JumpBackIn } from "@/components/play-now/JumpBackIn";
import { LookingForPlayers } from "@/components/play-now/LookingForPlayers";
import { SmartMatch } from "@/components/play-now/SmartMatch";
import { StatsRow } from "@/components/play-now/StatsRow";
import { WhosOnline } from "@/components/play-now/WhosOnline";
import { WhosPlaying } from "@/components/play-now/WhosPlaying";
import {
  currentUser,
  lfgPlayers,
  onlineFriends,
  playingSessions,
  recentGames,
  smartMatchSuggestions,
  smartMatchTags,
  stats,
} from "@/data/mock";

export const metadata = {
  title: "Nexus.gg — Play Now (Demo)",
  description:
    "Mock Play Now showcase with placeholder data for demos and investor previews.",
};

/** Static mock showcase — keep for demos while /play moves to real data. */
export default function DemoPlayNowPage() {
  return (
    <AppShell basePath="/demo">
      <TopBar />
      <StatsRow items={stats} />
      <WhosPlaying sessions={playingSessions} />
      <WhosOnline friends={onlineFriends} />
      <div className="mb-6 flex flex-col gap-6 lg:flex-row">
        <JumpBackIn games={recentGames} />
        <LookingForPlayers players={lfgPlayers} />
      </div>
      <SmartMatch
        user={currentUser}
        suggestions={smartMatchSuggestions}
        tags={smartMatchTags}
      />
    </AppShell>
  );
}
