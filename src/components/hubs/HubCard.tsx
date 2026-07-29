import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { HubCard as HubCardData } from "@/data/mock";

type HubCardProps = {
  hub: HubCardData;
  compact?: boolean;
};

export function HubCard({ hub, compact = false }: HubCardProps) {
  return (
    <article
      className={`group flex shrink-0 flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated transition-colors hover:bg-surface-hover ${
        compact ? "w-full" : "w-[200px]"
      }`}
    >
      <div className={`relative w-full ${compact ? "h-[110px]" : "h-[120px]"}`}>
        <Image
          src={hub.coverUrl}
          alt={hub.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={compact ? "180px" : "200px"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-black/15 to-black/25" />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div>
          <h3 className="truncate text-sm font-semibold text-foreground">
            {hub.title}
          </h3>
          <p className="mt-0.5 text-[11px] text-muted">{hub.membersLabel}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {hub.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border-subtle bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <Button
          size="sm"
          fullWidth
          variant={hub.following ? "outline" : "primary"}
          className={
            hub.following
              ? "border-accent/50 text-accent-hover hover:bg-accent-soft"
              : ""
          }
        >
          {hub.following ? "Following" : "Follow"}
        </Button>
      </div>
    </article>
  );
}
