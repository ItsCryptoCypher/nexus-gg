import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { CurrentUser } from "@/data/mock";

type UserProfileCardProps = {
  user: CurrentUser;
};

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="glass-panel-elevated rounded-xl p-3">
      <div className="mb-3 flex items-center gap-3">
        <Avatar src={user.avatarUrl} alt={user.username} size="md" status="online" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {user.username}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-status-online">
            <span className="h-1.5 w-1.5 rounded-full bg-status-online" />
            Online
          </p>
        </div>
      </div>
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold tracking-wide text-muted">
        <span>LEVEL {user.level}</span>
        <span>
          XP {user.xp.toLocaleString()} / {user.xpMax.toLocaleString()}
        </span>
      </div>
      <ProgressBar value={user.xp} max={user.xpMax} />
    </div>
  );
}
