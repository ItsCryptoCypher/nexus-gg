import { Mic, Radio } from "lucide-react";
import { CreatePartyPanel } from "@/components/parties/CreatePartyPanel";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";

export function QuickActions() {
  return (
    <SectionCard className="mb-6 overflow-hidden" padding="lg">
      <div className="relative grid gap-8 md:grid-cols-2 md:gap-0">
        <div className="flex flex-col justify-between gap-5 md:pr-12">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Create Party</h2>
            <p className="mt-1 max-w-sm text-sm text-muted">
              Start a game party. Discord hosts the private voice channel for PC
              and console.
            </p>
          </div>
          <div>
            <CreatePartyPanel />
          </div>
        </div>

        <div
          className="absolute left-1/2 top-1/2 z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-[11px] font-semibold text-muted md:flex"
          aria-hidden
        >
          OR
        </div>
        <div
          className="absolute bottom-2 left-1/2 top-2 hidden w-px -translate-x-1/2 bg-border-subtle md:block"
          aria-hidden
        />

        <div className="flex flex-col justify-between gap-5 border-t border-border-subtle pt-8 md:border-t-0 md:pl-12 md:pt-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Start Live Room
              </h2>
              <p className="mt-1 max-w-sm text-sm text-muted">
                Community rooms coming next — game parties ship first.
              </p>
            </div>
            <div className="relative hidden h-16 w-16 shrink-0 sm:block">
              <div className="absolute inset-0 rounded-2xl bg-accent-soft" />
              <div className="absolute inset-2 flex items-center justify-center rounded-xl border border-accent/30 bg-surface-elevated text-accent-hover shadow-[0_0_24px_rgba(124,58,237,0.25)]">
                <Mic className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div>
            <Button size="lg" disabled>
              <Radio className="h-4 w-4" />
              Coming soon
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
