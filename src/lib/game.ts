import { useSyncExternalStore } from "react";

export const FREE_SCANS = 2;
export const MERGES_FOR_UNLOCK = 3;

export type Concept = "same" | "unlike" | "whole" | "decimal";
export type Mistake = { concept: Concept; note: string; at: number };
export type GameState = {
  xp: number;
  streak: number;
  scans: number;
  merges: number;
  email: string | null;
  master: boolean;
  mastered: Concept[];
  mistakes: Mistake[];
  leadPrompted: boolean;
};

const KEY = "fq-state-v1";
const initial: GameState = { xp: 0, streak: 0, scans: 0, merges: 0, email: null, master: false, mastered: [], mistakes: [], leadPrompted: false };
let state: GameState = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const raw = localStorage.getItem(KEY); if (raw) state = { ...initial, ...JSON.parse(raw) }; } catch { /* ignore */ }
}
export function setGame(fn: (s: GameState) => GameState) {
  load();
  state = fn(state);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}
export function useGame(): GameState {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => { load(); return state; },
    () => initial,
  );
}

export const levelFromXp = (xp: number) => Math.floor(xp / 300) + 1;
export const canScan = (s: Pick<GameState, "scans" | "master">) => s.master || s.scans < FREE_SCANS;
export const shouldPromptLead = (s: Pick<GameState, "scans" | "merges" | "email">) =>
  !s.email && (s.scans >= FREE_SCANS || s.merges >= MERGES_FOR_UNLOCK);
export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

export function addXp(n: number) { setGame((s) => ({ ...s, xp: s.xp + n, streak: s.streak + 1 })); }
export function master(c: Concept) { setGame((s) => (s.mastered.includes(c) ? s : { ...s, mastered: [...s.mastered, c] })); }
