import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SectionCard } from "@/components/ui/SectionCard";
import type { LfgPlayer } from "@/data/mock";

type LookingForPlayersProps = {
  players: LfgPlayer[];
};

export function LookingForPlayers({ players }: LookingForPlayersProps) {
  return (
    <SectionCard className="w-full shrink-0 lg:w-[280px]" padding="md">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Looking for Players</h2>
      </div>
      <ul className="mb-2.5 space-y-2">
        {players.map((player) => (
          <li key={player.id} className="flex items-center gap-2.5">
            <Avatar src={player.avatarUrl} alt={player.username} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-medium text-foreground">
                  {player.username}
                </p>
                <PlatformIcon
                  platform={player.platform}
                  className="h-3 w-3 shrink-0 text-muted"
                />
              </div>
              <p className="truncate text-[11px] text-muted">
                {player.rank} · {player.gameTitle}
              </p>
            </div>
            <Badge tone="purple">LF {player.lookingFor}</Badge>
          </li>
        ))}
      </ul>
      <Button fullWidth size="sm">
        Find More Players
      </Button>
    </SectionCard>
  );
}
