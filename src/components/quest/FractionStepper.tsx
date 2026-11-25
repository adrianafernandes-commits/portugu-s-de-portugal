import { Minus, Plus } from "lucide-react";
import type { KeyboardEvent } from "react";
import { sfx } from "@/lib/sfx";

export function FractionStepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const set = (n: number) => { const v = Math.min(max, Math.max(min, n)); if (v !== value) { sfx.pop(); onChange(v); } };
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowUp: value + 1, ArrowRight: value + 1, ArrowDown: value - 1, ArrowLeft: value - 1, Home: min, End: max };
    const next = map[e.key];
    if (next !== undefined) { e.preventDefault(); set(next); }
  };
  const btn = "flex h-12 w-12 items-center justify-center rounded-2xl bg-card border-2 border-border text-foreground lift disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40";
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <div role="spinbutton" tabIndex={0} aria-label={label} aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} onKeyDown={onKey}
        className="flex items-center gap-2 rounded-2xl p-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40">
        <button type="button" tabIndex={-1} className={btn} onClick={() => set(value - 1)} disabled={value <= min} aria-label={`Diminuir ${label}`}><Minus /></button>
        <span key={value} className="w-10 text-center font-mono text-2xl font-bold animate-star">{value}</span>
        <button type="button" tabIndex={-1} className={btn} onClick={() => set(value + 1)} disabled={value >= max} aria-label={`Aumentar ${label}`}><Plus /></button>
      </div>
    </div>
  );
}
