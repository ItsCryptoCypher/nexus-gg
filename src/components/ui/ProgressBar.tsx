type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
};

export function ProgressBar({ value, max, className = "" }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover shadow-[0_0_10px_rgba(124,58,237,0.65)] transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
