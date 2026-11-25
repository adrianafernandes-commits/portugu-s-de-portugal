let ctx: AudioContext | null = null;
function tone(freq: number, dur = 0.12, type: OscillatorType = "sine", delay = 0) {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("fq-mute") === "1") return;
  ctx ??= new AudioContext();
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  const t = ctx.currentTime + delay;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02);
}
export const sfx = {
  pop: () => tone(620, 0.07, "triangle"),
  bonk: () => { tone(180, 0.15, "square"); tone(140, 0.15, "square", 0.08); },
  chime: () => { tone(784, 0.18); tone(988, 0.18, "sine", 0.09); tone(1319, 0.3, "sine", 0.18); },
};
export async function celebrate() {
  const confetti = (await import("canvas-confetti")).default;
  const colors = ["#FF6B35", "#9B5DE5", "#FFD93D", "#10B981"];
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 }, colors, shapes: ["star", "circle"] });
  setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 60, origin: { x: 0 }, colors }), 150);
  setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 60, origin: { x: 1 }, colors }), 300);
}
