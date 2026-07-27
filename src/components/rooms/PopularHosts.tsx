import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import type { PopularHost } from "@/data/mock";

type PopularHostsProps = {
  hosts: PopularHost[];
};

export function PopularHosts({ hosts }: PopularHostsProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Popular Hosts</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          View all
        </button>
      </div>
      <ul className="space-y-3">
        {hosts.map((host) => (
          <li key={host.id} className="flex items-center gap-2.5">
            <Avatar src={host.avatarUrl} alt={host.username} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {host.username}
              </p>
              <p className="truncate text-xs text-muted">
                {host.followersLabel} followers
              </p>
            </div>
            <Button size="sm" className="shrink-0 px-2.5">
              Follow
            </Button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
