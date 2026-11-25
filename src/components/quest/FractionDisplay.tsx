import { cn } from "@/lib/utils";
import { fractionLabel } from "@/lib/fractions";

export function FractionDisplay({ numerator, denominator, className, tone = "default" }: { numerator: number; denominator: number; className?: string; tone?: "default" | "a" | "b" | "common" }) {
  const color = { default: "text-foreground", a: "text-slice-a", b: "text-slice-b", common: "text-slice-common" }[tone];
  return (
    <span role="math" aria-label={fractionLabel(numerator, denominator)} className={cn("inline-flex flex-col items-center font-mono font-bold leading-none", color, className)}>
      <span aria-hidden="true">{numerator}</span>
      <span aria-hidden="true" className="my-1 h-[3px] w-full min-w-[1.4em] rounded-full bg-current" />
      <span aria-hidden="true">{denominator}</span>
    </span>
  );
}
