export function Owl({ size = 64, surprised = false }: { size?: number; surprised?: boolean }) {
  const eye = surprised ? 11 : 9;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="shrink-0">
      <path d="M20 30 L30 12 L40 26 Z M80 30 L70 12 L60 26 Z" className="fill-accent" />
      <ellipse cx="50" cy="58" rx="36" ry="38" className="fill-accent" />
      <ellipse cx="50" cy="68" rx="22" ry="22" className="fill-secondary" />
      <circle cx="36" cy="44" r="15" className="fill-card stroke-foreground" strokeWidth="3" />
      <circle cx="64" cy="44" r="15" className="fill-card stroke-foreground" strokeWidth="3" />
      <line x1="51" y1="44" x2="49" y2="44" className="stroke-foreground" strokeWidth="3" />
      <circle cx="36" cy="44" r={eye / 2} className="fill-foreground" />
      <circle cx="64" cy="44" r={eye / 2} className="fill-foreground" />
      <circle cx="38" cy="42" r="1.8" className="fill-card" />
      <circle cx="66" cy="42" r="1.8" className="fill-card" />
      <path d="M45 58 L55 58 L50 66 Z" className="fill-gold" />
    </svg>
  );
}
