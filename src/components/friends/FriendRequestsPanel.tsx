import { ChevronDown } from "lucide-react";
import { FriendRequestActions } from "@/components/friends/FriendRequestActions";
import { Avatar } from "@/components/ui/Avatar";
import { SectionCard } from "@/components/ui/SectionCard";
import type { FriendRequest } from "@/data/mock";

type FriendRequestsPanelProps = {
  requests: FriendRequest[];
  totalCount: number;
};

export function FriendRequestsPanel({
  requests,
  totalCount,
}: FriendRequestsPanelProps) {
  const extra = Math.max(0, totalCount - requests.length);

  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Friend Requests
          <span className="ml-1.5 text-muted">({totalCount})</span>
        </h2>
      </div>
      {requests.length === 0 ? (
        <p className="text-xs text-muted">No pending requests right now.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((request) => (
            <li key={request.id} className="flex items-center gap-2.5">
              <Avatar
                src={request.avatarUrl}
                alt={request.username}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {request.username}
                </p>
                <p className="truncate text-xs text-muted">
                  {request.mutualCount} mutual friend
                  {request.mutualCount === 1 ? "" : "s"}
                </p>
              </div>
              <FriendRequestActions
                friendshipId={request.id}
                username={request.username}
              />
            </li>
          ))}
        </ul>
      )}
      {extra > 0 ? (
        <button
          type="button"
          className="mt-3 inline-flex w-full items-center justify-center gap-1 text-xs text-muted transition-colors hover:text-foreground"
        >
          +{extra} more requests
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </SectionCard>
  );
}
