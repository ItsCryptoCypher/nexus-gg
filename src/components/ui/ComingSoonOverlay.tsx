type ComingSoonOverlayProps = {
  className?: string;
};

/** Faint gray veil so mock pages stay visible but clearly inactive. */
export function ComingSoonOverlay({ className = "" }: ComingSoonOverlayProps) {
  return (
    <div
      className={`absolute inset-0 z-20 bg-gradient-to-b from-zinc-950/35 via-zinc-800/40 to-zinc-950/45 ${className}`}
      role="status"
      aria-label="Coming soon"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <p className="text-3xl font-semibold tracking-[0.14em] text-white/75 sm:text-4xl">
          Coming Soon
        </p>
      </div>
    </div>
  );
}
