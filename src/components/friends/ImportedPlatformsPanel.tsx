import { Check } from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SectionCard } from "@/components/ui/SectionCard";
import type { ImportedPlatform } from "@/data/mock";

type ImportedPlatformsPanelProps = {
  platforms: ImportedPlatform[];
};

export function ImportedPlatformsPanel({
  platforms,
}: ImportedPlatformsPanelProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Imported Platforms
        </h2>
        <button
          type="button"
          className="text-xs text-muted transition-colors hover:text-foreground"
        >
          Manage
        </button>
      </div>
      <ul className="space-y-2.5">
        {platforms.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-muted">
              <PlatformIcon platform={item.platform} className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {item.label}
              </p>
              <p className="text-xs text-status-online">
                {item.connected ? "Connected" : "Not connected"}
              </p>
            </div>
            {item.connected ? (
              <Check className="h-4 w-4 shrink-0 text-status-online" />
            ) : null}
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
