"use client";

import { FriendsTabs } from "@/components/friends/FriendsTabs";
import { NexusFriends } from "@/components/friends/NexusFriends";
import { PlatformContacts } from "@/components/friends/PlatformContacts";
import { SuggestedFriends } from "@/components/friends/SuggestedFriends";
import { StatsRow } from "@/components/play-now/StatsRow";
import type {
  NexusFriend,
  PlatformContact,
  StatItem,
  SuggestedFriend,
} from "@/data/mock";

type FriendsHomeProps = {
  stats: StatItem[];
  nexusFriends: NexusFriend[];
  nexusCount: number;
  platformContacts: PlatformContact[];
  platformCount: number;
  suggestions: SuggestedFriend[];
};

export function FriendsHome({
  stats,
  nexusFriends,
  nexusCount,
  platformContacts,
  platformCount,
  suggestions,
}: FriendsHomeProps) {
  return (
    <FriendsTabs>
      {(activeTab) => (
        <>
          <StatsRow items={stats} />
          {activeTab === "all" || activeTab === "nexus" ? (
            <NexusFriends friends={nexusFriends} totalCount={nexusCount} />
          ) : null}
          {activeTab === "all" || activeTab === "platform" ? (
            <PlatformContacts
              contacts={platformContacts}
              totalCount={platformCount}
            />
          ) : null}
          {(activeTab === "all" || activeTab === "nexus") &&
          suggestions.length > 0 ? (
            <SuggestedFriends suggestions={suggestions} />
          ) : null}
        </>
      )}
    </FriendsTabs>
  );
}
