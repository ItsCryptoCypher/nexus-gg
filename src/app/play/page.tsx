import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { JumpBackIn } from "@/components/play-now/JumpBackIn";
import { LookingForPlayers } from "@/components/play-now/LookingForPlayers";
import { SmartMatch } from "@/components/play-now/SmartMatch";
import { StatsRow } from "@/components/play-now/StatsRow";
import { WhosPlaying } from "@/components/play-now/WhosPlaying";
import {
  lfgPlayers,
  recentGames,
  smartMatchSuggestions,
  smartMatchTags,
  stats,
} from "@/data/mock";
import { getAppUser } from "@/lib/auth/get-app-user";
import { getPlayingSessions } from "@/lib/presence/get-playing-sessions";

export const metadata = {
  title: "Nexus.gg — Play Now",
  description:
    "Jump into games with your friends. See who's online, join parties, and find people ready to play.",
};

export default async function PlayNowPage() {
  const [user, playingSessions] = await Promise.all([
    getAppUser(),
    getPlayingSessions(),
  ]);

  return (
    <AppShell user={user}>
      <TopBar user={user} />
      <StatsRow items={stats} />
      <WhosPlaying sessions={playingSessions} />
      <div className="mb-6 flex flex-col gap-6 lg:flex-row">
        <JumpBackIn games={recentGames} />
        <LookingForPlayers players={lfgPlayers} />
      </div>
      <SmartMatch
        user={user}
        suggestions={smartMatchSuggestions}
        tags={smartMatchTags}
      />
    </AppShell>
  );
}
