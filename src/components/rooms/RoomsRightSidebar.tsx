import { LiveNowByGame } from "@/components/rooms/LiveNowByGame";
import { PopularHosts } from "@/components/rooms/PopularHosts";
import { TrendingLive } from "@/components/rooms/TrendingLive";
import type {
  LiveNowByGame as LiveNowByGameItem,
  PopularHost,
  TrendingLiveRoom,
} from "@/data/mock";

type RoomsRightSidebarProps = {
  trending: TrendingLiveRoom[];
  hosts: PopularHost[];
  games: LiveNowByGameItem[];
};

export function RoomsRightSidebar({
  trending,
  hosts,
  games,
}: RoomsRightSidebarProps) {
  return (
    <aside className="hidden h-full w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border-subtle bg-background p-4 scrollbar-thin xl:flex">
      <TrendingLive rooms={trending} />
      <PopularHosts hosts={hosts} />
      <LiveNowByGame games={games} />
    </aside>
  );
}
