import { ChevronRight } from "lucide-react";
import { PlatformContactCard } from "@/components/friends/PlatformContactCard";
import { SectionCard } from "@/components/ui/SectionCard";
import type { PlatformContact } from "@/data/mock";

type PlatformContactsProps = {
  contacts: PlatformContact[];
  totalCount: number;
};

export function PlatformContacts({
  contacts,
  totalCount,
}: PlatformContactsProps) {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              Platform Contacts
            </h2>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-white">
              {totalCount}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            People from your connected platforms. Add them on Nexus to game
            together.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-0.5 text-xs text-muted transition-colors hover:text-foreground"
        >
          Import More
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {contacts.length === 0 ? (
        <p className="rounded-xl border border-border-subtle bg-surface px-4 py-6 text-sm text-muted">
          No platform contacts yet. When other players join Nexus through
          Discord, they&apos;ll show up here so you can add them.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {contacts.map((contact) => (
            <PlatformContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
