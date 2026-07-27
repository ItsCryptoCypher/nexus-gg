import { Avatar } from "@/components/ui/Avatar";
import { SectionCard } from "@/components/ui/SectionCard";
import type { LiveNowItem } from "@/data/mock";

type LiveNowProps = {
  items: LiveNowItem[];
};

export function LiveNow({ items }: LiveNowProps) {
  return (
    <SectionCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Live Now</h2>
        <button type="button" className="text-xs text-muted hover:text-foreground">
          View all
        </button>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2.5">
            <Avatar src={item.avatarUrl} alt={item.username} size="sm" ring />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {item.username}
              </p>
              <p className="truncate text-xs text-muted">{item.roomTitle}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              {item.viewers.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
