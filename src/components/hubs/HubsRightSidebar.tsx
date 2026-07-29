import { LiveFromHubs } from "@/components/hubs/LiveFromHubs";
import { RecentHubPosts } from "@/components/hubs/RecentHubPosts";
import { SuggestedHubs } from "@/components/hubs/SuggestedHubs";
import { TrendingHubs } from "@/components/hubs/TrendingHubs";
import type {
  HubLiveStream,
  HubRecentPost,
  SuggestedHub,
  TrendingHub,
} from "@/data/mock";

type HubsRightSidebarProps = {
  trending: TrendingHub[];
  streams: HubLiveStream[];
  recentPosts: HubRecentPost[];
  suggested: SuggestedHub[];
};

export function HubsRightSidebar({
  trending,
  streams,
  recentPosts,
  suggested,
}: HubsRightSidebarProps) {
  return (
    <aside className="hidden h-full w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border-subtle bg-background p-4 scrollbar-thin xl:flex">
      <TrendingHubs hubs={trending} />
      <LiveFromHubs streams={streams} />
      <RecentHubPosts posts={recentPosts} />
      <SuggestedHubs hubs={suggested} />
    </aside>
  );
}
