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
    <SectionCard className="w-full shrink-0 lg:w-[320px]" padding="lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Looking for Players</h2>
      </div>
      <ul className="mb-4 space-y-3">
        {players.map((player) => (
          <li key={player.id} className="flex items-center gap-3">
            <Avatar src={player.avatarUrl} alt={player.username} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-medium text-foreground">
                  {player.username}
                </p>
                <PlatformIcon
                  platform={player.platform}
                  className="h-3 w-3 shrink-0 text-muted"
                />
              </div>
              <p className="truncate text-xs text-muted">
                {player.rank} · {player.gameTitle}
              </p>
            </div>
            <Badge tone="purple">LF {player.lookingFor}</Badge>
          </li>
        ))}
      </ul>
      <Button fullWidth>Find More Players</Button>
    </SectionCard>
  );
}
