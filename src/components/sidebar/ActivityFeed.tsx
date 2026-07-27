import {
  PartyPopper,
  Trophy,
  UserPlus,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SectionCard } from "@/components/ui/SectionCard";
import type { ActivityItem } from "@/data/mock";

const typeIcon: Record<ActivityItem["type"], LucideIcon> = {
  trophy: Trophy,
  party: PartyPopper,
  video: Video,
  level: Zap,
  friend: UserPlus,
};

const typeTone: Record<ActivityItem["type"], string> = {
  trophy: "text-yellow-400",
  party: "text-accent-hover",
  video: "text-red-400",
  level: "text-status-in-game",
  friend: "text-status-online",
};

type ActivityFeedProps = {
  items: ActivityItem[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Activity Feed</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          See all
        </button>
      </div>
      <ul className="space-y-3">
        {items.map((item) => {
          const Icon = typeIcon[item.type];
          return (
            <li key={item.id} className="flex items-start gap-2.5">
              <Avatar src={item.avatarUrl} alt={item.username} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-relaxed text-muted">
                  <span className="font-medium text-foreground">{item.username}</span>{" "}
                  {item.message}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-dark">{item.timeAgo}</p>
              </div>
              <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${typeTone[item.type]}`} />
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
