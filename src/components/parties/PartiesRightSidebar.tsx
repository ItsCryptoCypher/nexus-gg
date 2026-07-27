import { FriendsInParties } from "@/components/parties/FriendsInParties";
import { LiveNow } from "@/components/parties/LiveNow";
import { PartyInvites } from "@/components/parties/PartyInvites";
import type { FriendInParty, LiveNowItem } from "@/data/mock";
import type { LivePartyInvite } from "@/lib/parties/get-parties-page";

type PartiesRightSidebarProps = {
  invites: LivePartyInvite[];
  friends: FriendInParty[];
  liveNow: LiveNowItem[];
};

export function PartiesRightSidebar({
  invites,
  friends,
  liveNow,
}: PartiesRightSidebarProps) {
  return (
    <aside className="hidden h-full w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border-subtle bg-background p-4 scrollbar-thin xl:flex">
      <PartyInvites invites={invites} />
      <FriendsInParties friends={friends} />
      <LiveNow items={liveNow} />
    </aside>
  );
}
