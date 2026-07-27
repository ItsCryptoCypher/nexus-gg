import { LayoutGrid, Mic, Radio } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";

export function JoinConversationBanner() {
  return (
    <SectionCard
      className="mb-6 overflow-hidden border-accent/20 bg-gradient-to-r from-accent-soft via-surface to-surface"
      padding="lg"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold text-foreground">
            Join the conversation
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Jump into live discussions about your favorite games, strategies, and
            the latest news.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button size="lg">
              <Mic className="h-4 w-4" />
              Start a Room
            </Button>
            <Button size="lg" variant="outline">
              <LayoutGrid className="h-4 w-4" />
              Browse Topics
            </Button>
          </div>
        </div>

        <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0">
          <div className="absolute inset-0 rounded-3xl bg-accent/20 blur-xl" />
          <div className="absolute inset-2 flex items-center justify-center rounded-2xl border border-accent/30 bg-surface-elevated shadow-[0_0_32px_rgba(124,58,237,0.35)]">
            <Radio className="h-10 w-10 text-accent-hover" />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
