import { Link } from "@tanstack/react-router";
import { Contrast, Flame, Sparkles, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { levelFromXp, useGame } from "@/lib/game";
import { ProgressBar } from "./ProgressBar";
import { GuildSheet } from "./GuildSheet";

const nav = [
  { to: "/", label: "Laboratório" },
  { to: "/detetive", label: "Caderno Detetive" },
  { to: "/cofre", label: "Cofre" },
] as const;

export function TopQuestHeader() {
  const g = useGame();
  const [hc, setHc] = useState(false);
  useEffect(() => { setHc(localStorage.getItem("fq-hc") === "1"); }, []);
  useEffect(() => { document.documentElement.classList.toggle("high-contrast", hc); localStorage.setItem("fq-hc", hc ? "1" : "0"); }, [hc]);
  const lvl = levelFromXp(g.xp);
  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">½</span>
          FractionQuest<span className="text-accent">Lab</span>
        </Link>
        <nav className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:ml-6 md:w-auto">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="flex min-h-12 items-center rounded-full px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-secondary-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden w-36 flex-col gap-1 sm:flex">
            <div className="flex justify-between text-xs font-bold"><span>Nível {lvl}</span><span className="text-primary">{g.xp} XP</span></div>
            <ProgressBar value={g.xp % 300} max={300} label="Progresso de XP" variant="xp-boost" />
          </div>
          <span className="flex items-center gap-1 rounded-full bg-amber-surface px-3 py-1 text-sm font-bold" title="Sequência"><Flame className="h-4 w-4 text-primary" />{g.streak}</span>
          <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-bold sm:hidden"><Sparkles className="h-4 w-4 text-accent" />{g.xp}</span>
          <button onClick={() => setHc((v) => !v)} aria-pressed={hc} aria-label="Alto contraste" className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-border bg-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"><Contrast className="h-5 w-5" /></button>
          <GuildSheet trigger={
            <button className="flex h-12 items-center gap-2 rounded-2xl bg-accent px-4 font-display text-sm font-extrabold uppercase text-accent-foreground lift">
              <Crown className="h-4 w-4" /><span className="hidden sm:inline">{g.master ? "Mestre" : "Guilda"}</span>
            </button>
          } />
        </div>
      </div>
    </header>
  );
}
