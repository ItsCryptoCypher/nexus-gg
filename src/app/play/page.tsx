import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { JumpBackIn } from "@/components/play-now/JumpBackIn";
import { LookingForPlayers } from "@/components/play-now/LookingForPlayers";
import { SmartMatch } from "@/components/play-now/SmartMatch";
import { StatsRow } from "@/components/play-now/StatsRow";
import { WhosOnline } from "@/components/play-now/WhosOnline";
import { WhosPlaying } from "@/components/play-now/WhosPlaying";
import {
  lfgPlayers,
  recentGames,
  smartMatchSuggestions,
  smartMatchTags,
} from "@/data/mock";
import { getAppUser } from "@/lib/auth/get-app-user";
import { getOnlineSessions } from "@/lib/presence/get-online-sessions";
import {
  buildPlayNowStats,
  countPeopleInParties,
} from "@/lib/presence/get-play-now-stats";
import { getPlayingSessions } from "@/lib/presence/get-playing-sessions";

export const metadata = {
  title: "Nexus.gg — Play Now",
  description:
    "Jump into games with your friends. See who's online, join parties, and find people ready to play.",
};

export default async function PlayNowPage() {
  const [user, playingSessions, onlineSessions, inPartyCount] =
    await Promise.all([
      getAppUser(),
      getPlayingSessions(),
      getOnlineSessions(),
      countPeopleInParties(),
    ]);
  const stats = buildPlayNowStats({
    onlineCount: onlineSessions.length,
    inGameCount: playingSessions.length,
    inPartyCount,
  });

  return (
    <AppShell user={user}>
      <TopBar user={user} />
      <StatsRow items={stats} />
      <WhosPlaying sessions={playingSessions} />
      <WhosOnline friends={onlineSessions} />
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
