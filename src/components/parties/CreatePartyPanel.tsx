"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createGameParty } from "@/app/parties/actions";
import { Button } from "@/components/ui/Button";

export function CreatePartyPanel() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button size="lg" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Create Party
      </Button>
    );
  }

  return (
    <form
      className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await createGameParty(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setOpen(false);
        });
      }}
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Game
        </label>
        <input
          name="gameTitle"
          required
          placeholder="e.g. Marvel Rivals"
          className="h-10 w-full rounded-lg border border-border-subtle bg-surface px-3 text-sm text-foreground outline-none focus:border-accent/50"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Party name
        </label>
        <input
          name="name"
          placeholder="Optional"
          className="h-10 w-full rounded-lg border border-border-subtle bg-surface px-3 text-sm text-foreground outline-none focus:border-accent/50"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Max players
        </label>
        <input
          name="partyMax"
          type="number"
          min={2}
          max={16}
          defaultValue={4}
          className="h-10 w-full rounded-lg border border-border-subtle bg-surface px-3 text-sm text-foreground outline-none focus:border-accent/50"
        />
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Creating…" : "Create & open Discord voice"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </div>
      <p className="text-[11px] text-muted">
        Creates a private Discord voice channel on the Nexus server. Friends join
        voice from Discord (including consoles).
      </p>
    </form>
  );
}
