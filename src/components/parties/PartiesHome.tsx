import { LiveRooms } from "@/components/parties/LiveRooms";
import { OpenGameParties } from "@/components/parties/OpenGameParties";
import { QuickActions } from "@/components/parties/QuickActions";
import { YourParty } from "@/components/parties/YourParty";
import { StatsRow } from "@/components/play-now/StatsRow";
import type {
  LiveRoom,
  OpenParty,
  StatItem,
  YourParty as YourPartyData,
} from "@/data/mock";

type PartiesHomeProps = {
  stats: StatItem[];
  yourParty: YourPartyData;
  openParties: OpenParty[];
  liveRooms: LiveRoom[];
};

export function PartiesHome({
  stats,
  yourParty,
  openParties,
  liveRooms,
}: PartiesHomeProps) {
  return (
    <>
      <StatsRow items={stats} />
      <QuickActions />
      <YourParty party={yourParty} />
      <OpenGameParties parties={openParties} />
      <LiveRooms rooms={liveRooms} />
    </>
  );
}
