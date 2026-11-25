import { cn } from "@/lib/utils";

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + r * Math.cos(a - Math.PI / 2), cy + r * Math.sin(a - Math.PI / 2)];
  const [x0, y0] = p(a0); const [x1, y1] = p(a1);
  return `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1},${y1} Z`;
}

export function SliceCake({ numerator, denominator, shape, tone, className }: { numerator: number; denominator: number; shape: "pie" | "bar"; tone: "a" | "b" | "common"; className?: string }) {
  const fill = { a: "fill-slice-a", b: "fill-slice-b", common: "fill-slice-common" }[tone];
  const slices = Array.from({ length: denominator }, (_, i) => i);
  if (shape === "bar") {
    const w = 200 / denominator;
    return (
      <svg viewBox="-4 -4 208 68" className={cn("w-full max-w-[260px]", className)} aria-hidden="true">
        {slices.map((i) => (
          <rect key={`${denominator}-${i}`} x={i * w} y={0} width={w} height={60} rx={denominator === 1 ? 12 : 4}
            className={cn("stroke-card transition-all duration-300", i < numerator ? fill : "fill-muted")} strokeWidth={3} />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className={cn("w-full max-w-[200px]", className)} aria-hidden="true">
      {denominator === 1 ? (
        <circle cx={100} cy={100} r={92} className={cn("stroke-card", numerator ? fill : "fill-muted")} strokeWidth={4} />
      ) : slices.map((i) => {
        const step = (Math.PI * 2) / denominator;
        return <path key={`${denominator}-${i}`} d={arc(100, 100, 92, i * step, (i + 1) * step)} className={cn("stroke-card transition-all duration-300", i < numerator ? fill : "fill-muted")} strokeWidth={4} strokeLinejoin="round" />;
      })}
      <circle cx={100} cy={100} r={92} fill="none" className="stroke-border" strokeWidth={2} />
    </svg>
  );
}
