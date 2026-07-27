import { ChevronRight } from "lucide-react";
import { NexusFriendCard } from "@/components/friends/NexusFriendCard";
import { SectionCard } from "@/components/ui/SectionCard";
import type { NexusFriend } from "@/data/mock";

type NexusFriendsProps = {
  friends: NexusFriend[];
  totalCount: number;
};

export function NexusFriends({ friends, totalCount }: NexusFriendsProps) {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              Nexus Friends
            </h2>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-white">
              {totalCount}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            Your inner circle. Friends you&apos;ve added on Nexus.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-0.5 text-xs text-muted transition-colors hover:text-foreground"
        >
          Manage Friends
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {friends.length === 0 ? (
        <p className="rounded-xl border border-border-subtle bg-surface px-4 py-6 text-sm text-muted">
          No Nexus friends yet. Add people from Platform Contacts to build your
          inner circle.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {friends.map((friend) => (
            <NexusFriendCard key={friend.id} friend={friend} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
