import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Owl } from "./Owl";

type Tone = "curious" | "celebrate" | "rethink";
export function SocraticBubble({ tone = "curious", children, className, avatar = "owl" }: { tone?: Tone; children: ReactNode; className?: string; avatar?: "owl" | "none" }) {
  const styles = {
    curious: "bg-secondary border-accent/30 text-secondary-foreground",
    celebrate: "bg-success/10 border-success/40 text-foreground",
    rethink: "bg-amber-surface border-amber/60 text-foreground",
  }[tone];
  return (
    <div className={cn("flex items-end gap-3 animate-socratic-in", className)}>
      {avatar === "owl" && <Owl size={56} surprised={tone === "rethink"} />}
      <div role="status" aria-live="polite" className={cn("relative rounded-3xl rounded-bl-md border-2 px-5 py-4 text-base leading-relaxed", styles)}>
        <p className="mb-1 font-display text-xs font-bold uppercase tracking-wider text-accent">Coruja Sócrates</p>
        {children}
      </div>
    </div>
  );
}
