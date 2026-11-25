export function ProgressBar({ value, max, label }: { value: number; max: number; label: string; variant?: "xp-boost" }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-primary transition-all duration-500 ease-elastic" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
