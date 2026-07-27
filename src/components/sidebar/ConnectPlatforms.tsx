import { Plus } from "lucide-react";
import { PlatformIcon, platformLabel } from "@/components/ui/PlatformIcon";
import type { Platform } from "@/data/mock";

const platforms: Platform[] = ["xbox", "playstation", "steam", "discord"];

export function ConnectPlatforms() {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
      <p className="mb-3 text-xs font-medium text-muted">Connect More Platforms</p>
      <div className="flex items-center gap-2">
        {platforms.map((platform) => (
          <button
            key={platform}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent/40 hover:text-foreground"
            aria-label={`Connect ${platformLabel(platform)}`}
          >
            <PlatformIcon platform={platform} className="h-3.5 w-3.5" />
          </button>
        ))}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-border bg-surface text-muted transition-colors hover:border-accent/40 hover:text-foreground"
          aria-label="See more platforms"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
