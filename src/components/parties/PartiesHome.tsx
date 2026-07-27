import { LiveRooms } from "@/components/parties/LiveRooms";
import { OpenGameParties } from "@/components/parties/OpenGameParties";
import { QuickActions } from "@/components/parties/QuickActions";
import { YourParty } from "@/components/parties/YourParty";
import { StatsRow } from "@/components/play-now/StatsRow";
import type { LiveRoom, OpenParty, StatItem } from "@/data/mock";
import type { LiveYourParty } from "@/lib/parties/get-parties-page";

type PartiesHomeProps = {
  stats: StatItem[];
  yourParty: LiveYourParty | null;
  openParties: OpenParty[];
  liveRooms: LiveRoom[];
  friendOptions: { id: string; username: string; avatarUrl: string }[];
};

export function PartiesHome({
  stats,
  yourParty,
  openParties,
  liveRooms,
  friendOptions,
}: PartiesHomeProps) {
  return (
    <>
      <StatsRow items={stats} />
      <QuickActions />
      <YourParty party={yourParty} friendOptions={friendOptions} />
      <OpenGameParties parties={openParties} />
      <LiveRooms rooms={liveRooms} />
    </>
  );
}
