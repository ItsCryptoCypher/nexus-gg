import { CreatePartyPanel } from "@/components/parties/CreatePartyPanel";
import { SectionCard } from "@/components/ui/SectionCard";

export function QuickActions() {
  return (
    <SectionCard className="mb-6" padding="lg">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Create Party</h2>
          <p className="mt-1 max-w-md text-sm text-muted">
            Start a game party. Discord hosts the private voice channel for PC
            and console.
          </p>
        </div>
        <div className="shrink-0">
          <CreatePartyPanel />
        </div>
      </div>
    </SectionCard>
  );
}
