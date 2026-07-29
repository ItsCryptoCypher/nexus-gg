import { BrowseGameHubs } from "@/components/hubs/BrowseGameHubs";
import { FeaturedGameHubs } from "@/components/hubs/FeaturedGameHubs";
import { FromHubsYouFollow } from "@/components/hubs/FromHubsYouFollow";
import { StatsRow } from "@/components/play-now/StatsRow";
import type {
  HubActivityPost,
  HubCard,
  StatItem,
} from "@/data/mock";

type HubsHomeProps = {
  stats: StatItem[];
  featured: HubCard[];
  browse: HubCard[];
  activity: HubActivityPost[];
};

export function HubsHome({
  stats,
  featured,
  browse,
  activity,
}: HubsHomeProps) {
  return (
    <>
      <StatsRow items={stats} />
      <FeaturedGameHubs hubs={featured} />
      <BrowseGameHubs hubs={browse} />
      <FromHubsYouFollow posts={activity} />
    </>
  );
}
