import { Plus } from "lucide-react";
import { PlatformIcon, platformLabel } from "@/components/ui/PlatformIcon";
import type { Platform } from "@/data/mock";

const platforms: Platform[] = ["xbox", "playstation", "steam", "discord"];

export function ConnectPlatforms() {
  return (
    <div className="glass-panel-elevated rounded-xl p-3">
      <p className="mb-3 text-xs font-medium text-muted">Connect More Platforms</p>
      <div className="flex items-center gap-2">
        {platforms.map((platform) => (
          <button
            key={platform}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/25 bg-black/30 text-muted transition-colors hover:border-accent/50 hover:bg-accent/10 hover:text-foreground"
            aria-label={`Connect ${platformLabel(platform)}`}
          >
            <PlatformIcon platform={platform} className="h-3.5 w-3.5" />
          </button>
        ))}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-accent/30 bg-black/20 text-muted transition-colors hover:border-accent/50 hover:text-foreground"
          aria-label="See more platforms"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
