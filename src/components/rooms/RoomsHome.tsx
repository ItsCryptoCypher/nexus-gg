import { BrowseByTopic } from "@/components/rooms/BrowseByTopic";
import { FeaturedLiveRooms } from "@/components/rooms/FeaturedLiveRooms";
import { JoinConversationBanner } from "@/components/rooms/JoinConversationBanner";
import { UpcomingRooms } from "@/components/rooms/UpcomingRooms";
import { StatsRow } from "@/components/play-now/StatsRow";
import type {
  LiveRoom,
  RoomTopic,
  StatItem,
  UpcomingRoom,
} from "@/data/mock";

type RoomsHomeProps = {
  stats: StatItem[];
  featuredRooms: LiveRoom[];
  topics: RoomTopic[];
  upcoming: UpcomingRoom[];
};

export function RoomsHome({
  stats,
  featuredRooms,
  topics,
  upcoming,
}: RoomsHomeProps) {
  return (
    <>
      <StatsRow items={stats} />
      <JoinConversationBanner />
      <FeaturedLiveRooms rooms={featuredRooms} />
      <BrowseByTopic topics={topics} />
      <UpcomingRooms rooms={upcoming} />
    </>
  );
}
