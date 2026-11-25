import type { ReactNode } from "react";
import { Crown, Infinity as InfIcon, Mic, Mail, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { levelFromXp, useGame } from "@/lib/game";

const perks = [
  { icon: InfIcon, t: "Verificações ilimitadas do caderno", d: "Fotografa quantos trabalhos de casa quiseres." },
  { icon: Mic, t: "Diálogos socráticos por voz", d: "A Coruja fala contigo, passo a passo." },
  { icon: Mail, t: "Resumo semanal para os pais", d: "Ex.: “O Lucas domina o m.m.c., mas precisa de reforço a converter decimais em frações.”" },
];

export function GuildSheet({ trigger }: { trigger: ReactNode }) {
  const g = useGame();
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full overflow-y-auto border-l-2 border-border sm:max-w-md">
        <SheetHeader>
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground animate-star"><Crown /></div>
          <SheetTitle className="font-display text-3xl font-extrabold">Guilda dos Mestres das Frações</SheetTitle>
          <SheetDescription>Para campeões que querem ir mais longe — e pais que querem ver o progresso real.</SheetDescription>
        </SheetHeader>
        <div className="mx-4 mt-4 rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
          <p className="text-xs font-bold uppercase tracking-wider opacity-90">Cartão de campeão</p>
          <p className="font-display text-4xl font-extrabold">{g.xp} XP</p>
          <p className="text-sm">Nível {levelFromXp(g.xp)} · {g.mastered.length}/4 medalhas</p>
        </div>
        <ul className="mx-4 mt-6 space-y-4">
          {perks.map((p) => (
            <li key={p.t} className="flex gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-accent"><p.icon className="h-5 w-5" /></span>
              <div><p className="font-display font-bold">{p.t}</p><p className="text-sm text-muted-foreground">{p.d}</p></div>
            </li>
          ))}
        </ul>
        <div className="mx-4 mt-8 space-y-3 pb-6">
          <p className="text-center font-display text-2xl font-extrabold">1 $ <span className="text-base font-semibold text-muted-foreground">/ mês</span></p>
          <Button variant="magic" size="xl" className="w-full" onClick={() => toast("O pagamento está quase pronto! Em breve vais poder entrar na Guilda.")}>Desbloquear a Guilda</Button>
          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" />Pagamento seguro. Cancela quando quiseres.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
