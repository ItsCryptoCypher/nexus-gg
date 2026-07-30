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
    iconWrap: "bg-black/35",
    icon: "text-status-online drop-shadow-[0_0_4px_rgba(34,197,94,0.45)]",
  },
  purple: {
    iconWrap: "bg-black/35",
    icon: "text-[#a855f7] drop-shadow-[0_0_4px_rgba(168,85,247,0.55)]",
  },
  blue: {
    iconWrap: "bg-black/35",
    icon: "text-status-in-game drop-shadow-[0_0_4px_rgba(59,130,246,0.45)]",
  },
  orange: {
    iconWrap: "bg-black/35",
    icon: "text-status-looking drop-shadow-[0_0_4px_rgba(249,115,22,0.45)]",
  },
};

type StatsRowProps = {
  items: StatItem[];
};

export function StatsRow({ items }: StatsRowProps) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        const tone = toneStyles[item.tone];

        return (
          <div
            key={item.id}
            className="glass-panel flex items-center gap-2.5 rounded-xl px-3 py-2"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${tone.iconWrap}`}
            >
              <Icon className={`h-3.5 w-3.5 ${tone.icon}`} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-foreground">
                {item.value}
              </p>
              <p className="mt-0.5 text-[11px] text-[#9a9aad]">
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
