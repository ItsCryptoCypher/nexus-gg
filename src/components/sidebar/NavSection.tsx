import {
  Calendar,
  Gamepad2,
  LayoutGrid,
  MessageSquare,
  PartyPopper,
  Radio,
  Settings,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { NavGroup } from "@/data/mock";

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  users: Users,
  "party-popper": PartyPopper,
  radio: Radio,
  "message-square": MessageSquare,
  "layout-grid": LayoutGrid,
  calendar: Calendar,
  "gamepad-2": Gamepad2,
  settings: Settings,
};

type NavSectionProps = {
  group: NavGroup;
  activeId?: string;
  /** Prefix real routes (e.g. `/demo`) so mock showcase pages stay in-demo. */
  basePath?: string;
};

function resolveHref(href: string, basePath?: string) {
  if (!basePath || href === "#" || !href.startsWith("/")) return href;
  return `${basePath}${href}`;
}

export function NavSection({
  group,
  activeId = "play-now",
  basePath,
}: NavSectionProps) {
  return (
    <div className="mb-4">
      <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.12em] text-muted-dark">
        {group.label}
      </p>
      <ul className="space-y-0.5">
        {group.items.map((item) => {
          const Icon = iconMap[item.icon] ?? Zap;
          const active = item.id === activeId;

          return (
            <li key={item.id}>
              <a
                href={resolveHref(item.href, basePath)}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-accent-soft font-medium text-foreground before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-accent"
                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${active ? "text-accent" : "text-muted"}`}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
