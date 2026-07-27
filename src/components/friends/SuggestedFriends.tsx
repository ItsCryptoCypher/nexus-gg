import { ChevronRight } from "lucide-react";
import { AddFriendButton } from "@/components/friends/AddFriendButton";
import { Avatar } from "@/components/ui/Avatar";
import { SectionCard } from "@/components/ui/SectionCard";
import type { SuggestedFriend } from "@/data/mock";

type SuggestedFriendsProps = {
  suggestions: SuggestedFriend[];
};

export function SuggestedFriends({ suggestions }: SuggestedFriendsProps) {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Suggested Nexus Friends
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            People you may know from parties, hubs, and mutual friends.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-0.5 text-xs text-muted transition-colors hover:text-foreground"
        >
          View All Suggestions
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-sm text-muted">
          Suggestions will appear as more players join Nexus.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {suggestions.map((person) => (
            <article
              key={person.id}
              className="flex w-[220px] shrink-0 items-center gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-3"
            >
              <Avatar
                src={person.avatarUrl}
                alt={person.username}
                size="md"
                status="online"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {person.username}
                </p>
                <p className="truncate text-[11px] text-muted">
                  {person.mutualCount} mutual · {person.recentGames}
                </p>
              </div>
              <AddFriendButton
                userId={person.id}
                label="Add"
                className="border-transparent bg-accent text-white hover:bg-accent-hover hover:text-white"
              />
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
