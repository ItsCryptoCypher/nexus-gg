import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";

export function BuildInnerCircle() {
  return (
    <SectionCard className="bg-gradient-to-b from-accent-soft/40 to-surface">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-hover">
        <Users className="h-5 w-5" />
      </div>
      <h2 className="text-sm font-semibold text-foreground">
        Build Your Inner Circle
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Add friends on Nexus to unlock parties, invites, and live Who&apos;s
        Playing together.
      </p>
      <Button variant="primary" size="sm" fullWidth className="mt-4">
        Find Friends
      </Button>
    </SectionCard>
  );
}
