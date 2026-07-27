import {
  Calendar,
  Gamepad2,
  LayoutGrid,
  Menu,
  MessageSquare,
  PartyPopper,
  Radio,
  Settings,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const navIconMap: Record<string, LucideIcon> = {
  zap: Zap,
  users: Users,
  "party-popper": PartyPopper,
  radio: Radio,
  "message-square": MessageSquare,
  "layout-grid": LayoutGrid,
  calendar: Calendar,
  "gamepad-2": Gamepad2,
  settings: Settings,
  menu: Menu,
};

export function resolveNavHref(href: string, basePath?: string) {
  if (!basePath || href === "#" || !href.startsWith("/")) return href;
  return `${basePath}${href}`;
}
