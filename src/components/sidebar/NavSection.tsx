import { navIconMap, resolveNavHref } from "@/components/sidebar/nav-icons";
import type { NavGroup } from "@/data/mock";

type NavSectionProps = {
  group: NavGroup;
  activeId?: string;
  /** Prefix real routes (e.g. `/demo`) so mock showcase pages stay in-demo. */
  basePath?: string;
};

export function NavSection({
  group,
  activeId = "play-now",
  basePath,
}: NavSectionProps) {
  return (
    <div className="mb-4">
      <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.12em] text-muted-dark">
        {group.label}
      </p>
      <ul className="space-y-0.5">
        {group.items.map((item) => {
          const Icon = navIconMap[item.icon] ?? navIconMap.zap;
          const active = item.id === activeId;

          return (
            <li key={item.id}>
              <a
                href={resolveNavHref(item.href, basePath)}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "border border-accent/40 bg-gradient-to-r from-accent/35 to-accent/10 font-medium text-white"
                    : "border border-transparent text-muted hover:border-accent/15 hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${active ? "text-violet-200" : "text-muted"}`}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-white shadow-[0_0_10px_rgba(124,58,237,0.45)]">
                    {item.badge}
                  </span>
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
