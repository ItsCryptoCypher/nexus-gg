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
    <SectionCard padding="lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/35 bg-accent/15 text-accent-hover shadow-[0_0_16px_rgba(124,58,237,0.3)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Smart Match</h2>
              <p className="text-xs text-muted">
                AI-powered matches based on your play style
              </p>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-accent/25 sm:block" />

          <div className="flex items-center gap-3">
            <Avatar src={user.avatarUrl} alt={user.username} size="md" ring />
            <div className="flex -space-x-2">
              {suggestions.map((s) => (
                <Avatar
                  key={s.id}
                  src={s.avatarUrl}
                  alt={s.username}
                  size="md"
                  className="ring-2 ring-[#0d0b12]"
                />
              ))}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Suggested Friends</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
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
          <Button>See Matches</Button>
          <Button variant="outline">Customize</Button>
        </div>
      </div>
    </SectionCard>
  );
}
