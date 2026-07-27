import { BuildInnerCircle } from "@/components/friends/BuildInnerCircle";
import { FriendRequestsPanel } from "@/components/friends/FriendRequestsPanel";
import { ImportedPlatformsPanel } from "@/components/friends/ImportedPlatformsPanel";
import { OnlineNowPanel } from "@/components/friends/OnlineNowPanel";
import type {
  FriendRequest,
  ImportedPlatform,
  OnlineFriend,
} from "@/data/mock";

type FriendsRightSidebarProps = {
  requests: FriendRequest[];
  requestCount: number;
  onlineFriends: OnlineFriend[];
  onlineCount: number;
  platforms: ImportedPlatform[];
};

export function FriendsRightSidebar({
  requests,
  requestCount,
  onlineFriends,
  onlineCount,
  platforms,
}: FriendsRightSidebarProps) {
  return (
    <aside className="hidden h-full w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border-subtle bg-background p-4 scrollbar-thin xl:flex">
      <FriendRequestsPanel requests={requests} totalCount={requestCount} />
      <OnlineNowPanel friends={onlineFriends} totalCount={onlineCount} />
      <ImportedPlatformsPanel platforms={platforms} />
      <BuildInnerCircle />
    </aside>
  );
}
