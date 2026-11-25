export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);
export const clampDen = (n: number) => Math.min(12, Math.max(1, n));

const NAMES: Record<number, string> = { 1: "inteiro", 2: "meio", 3: "terço", 4: "quarto", 5: "quinto", 6: "sexto", 7: "sétimo", 8: "oitavo", 9: "nono", 10: "décimo", 11: "onze avos", 12: "doze avos" };
export function fractionLabel(n: number, d: number) {
  const base = NAMES[d] ?? `${d} avos`;
  const plural = n === 1 || base.endsWith("avos") ? base : base + "s";
  return `${n} ${plural}`;
}
