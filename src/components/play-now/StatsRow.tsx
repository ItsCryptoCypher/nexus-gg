import {
  Activity,
  Gamepad2,
  Headphones,
  Mail,
  PartyPopper,
  Radio,
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
    iconWrap: "bg-accent-soft",
    icon: "text-accent-hover",
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
            className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface px-4 py-3.5 transition-colors hover:bg-surface-hover"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${tone.iconWrap}`}
            >
              <Icon className={`h-4 w-4 ${tone.icon}`} />
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
