import { useState } from "react";
import { Gift, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidEmail, setGame, useGame } from "@/lib/game";
import { celebrate, sfx } from "@/lib/sfx";
import { downloadWorksheets } from "@/lib/worksheet";

export function LeadCaptureModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const g = useGame();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [opened, setOpened] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setError("Esse e-mail parece ter uma gralha. Confirma?"); return; }
    setError("");
    setGame((s) => ({ ...s, email: email.trim(), xp: s.xp + 50 }));
    setOpened(true); sfx.chime(); celebrate();
    await downloadWorksheets(email.split("@")[0] ?? "Detetive", g.mistakes);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-2 border-gold sm:max-w-md">
        <div className="mx-auto -mt-2 text-7xl animate-floaty" aria-hidden="true">{opened ? "🎉" : "🎁"}</div>
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="font-display text-3xl font-extrabold">{opened ? "Baú aberto!" : "Guarda o teu Livro de Detetive!"}</DialogTitle>
          <DialogDescription className="text-base">
            {opened ? "As tuas medalhas estão guardadas e as 3 fichas já estão a descarregar. Boa caça aos enigmas!" : "Fizeste verificações brilhantes! Escreve o teu e-mail para manteres o teu nível de XP, guardar os teus troféus e desbloquear 3 fichas exclusivas com enigmas para imprimir."}
          </DialogDescription>
        </DialogHeader>
        {!opened ? (
          <form onSubmit={submit} className="space-y-3" noValidate>
            <Label htmlFor="lead-email" className="font-semibold">E-mail (teu ou de um adulto)</Label>
            <Input id="lead-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="marta@exemplo.pt" className="h-12 rounded-2xl border-2 text-base" aria-invalid={!!error} aria-describedby="lead-err" />
            <p id="lead-err" role="status" className="min-h-5 text-sm font-semibold text-amber">{error}</p>
            <Button type="submit" variant="glow" size="xl" className="w-full whitespace-normal"><Gift />Salvar o meu progresso e baixar fichas</Button>
            <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" />100% educativo. Sem spam. Cancela quando quiseres.</p>
          </form>
        ) : (
          <Button variant="soft" size="xl" onClick={() => onOpenChange(false)}>Continuar a aventura</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
