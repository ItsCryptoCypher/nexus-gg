import {
  Activity,
  Calendar,
  Gamepad2,
  Headphones,
  LayoutGrid,
  Mail,
  MessageSquare,
  Mic,
  PartyPopper,
  Radio,
  TrendingUp,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { StatItem } from "@/data/mock";

const iconMap: Record<StatItem["icon"], LucideIcon> = {
  activity: Activity,
  gamepad: Gamepad2,
  users: Users,
  headset: Headphones,
  party: PartyPopper,
  radio: Radio,
  mail: Mail,
  "user-plus": UserPlus,
  mic: Mic,
  calendar: Calendar,
  "layout-grid": LayoutGrid,
  "trending-up": TrendingUp,
  "message-square": MessageSquare,
};

const toneStyles: Record<
  StatItem["tone"],
  { iconWrap: string; icon: string }
> = {
  green: {
    iconWrap: "bg-status-online/15",
    icon: "text-status-online",
  },
  purple: {
    iconWrap: "bg-[rgba(76,29,149,0.55)]",
    icon: "text-violet-300",
  },
  blue: {
    iconWrap: "bg-status-in-game/15",
    icon: "text-status-in-game",
  },
  orange: {
    iconWrap: "bg-status-looking/15",
    icon: "text-status-looking",
  },
};

type StatsRowProps = {
  items: StatItem[];
};

export function StatsRow({ items }: StatsRowProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        const tone = toneStyles[item.tone];

        return (
          <div
            key={item.id}
            className="glass-panel flex items-center gap-3 rounded-xl px-4 py-3.5"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-accent/25 ${tone.iconWrap}`}
            >
              <Icon className={`h-4 w-4 ${tone.icon} drop-shadow-[0_0_6px_currentColor]`} />
            </div>
            <div>
              <p className="text-xl font-bold leading-none text-foreground">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-muted">
                {item.label}
                {item.hint ? (
                  <span className="text-muted-dark"> · {item.hint}</span>
                ) : null}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
