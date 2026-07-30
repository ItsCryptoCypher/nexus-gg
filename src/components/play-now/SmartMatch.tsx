import { Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import type {
  CurrentUser,
  SmartMatchSuggestion,
  SmartMatchTag,
} from "@/data/mock";

type SmartMatchProps = {
  user: CurrentUser;
  suggestions: SmartMatchSuggestion[];
  tags: SmartMatchTag[];
};

export function SmartMatch({ user, suggestions, tags }: SmartMatchProps) {
  return (
    <SectionCard padding="md">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-accent/35 bg-accent/15 text-accent-hover shadow-[0_0_16px_rgba(124,58,237,0.3)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Smart Match</h2>
              <p className="text-[11px] text-muted">
                AI-powered matches based on your play style
              </p>
            </div>
          </div>

          <div className="hidden h-8 w-px bg-accent/25 sm:block" />

          <div className="flex items-center gap-2.5">
            <Avatar src={user.avatarUrl} alt={user.username} size="sm" ring />
            <div className="flex -space-x-2">
              {suggestions.map((s) => (
                <Avatar
                  key={s.id}
                  src={s.avatarUrl}
                  alt={s.username}
                  size="sm"
                  className="ring-2 ring-[#0d0b12]"
                />
              ))}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">Suggested Friends</p>
              <div className="mt-0.5 flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag.id} tone="purple">
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm">See Matches</Button>
          <Button variant="outline" size="sm">
            Customize
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
