import { Bell } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SearchInput } from "@/components/ui/SearchInput";
import { currentUser, type CurrentUser } from "@/data/mock";

type TopBarProps = {
  title?: string;
  subtitle?: string;
  user?: CurrentUser;
  className?: string;
};

export function TopBar({
  title = "Play Now",
  subtitle = "Jump into games with your friends. No waiting, just playing.",
  user = currentUser,
  className = "",
}: TopBarProps) {
  return (
    <header
      className={`mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between ${className}`}
    >
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 lg:max-w-xl lg:flex-1 lg:justify-end">
        <SearchInput
          placeholder="Search for games, friends, or players..."
          className="min-w-0 flex-1 lg:max-w-md"
        />
        <button
          type="button"
          className="glass-panel relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <Avatar src={user.avatarUrl} alt={user.username} size="md" ring />
      </div>
    </header>
  );
}
