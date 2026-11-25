import type { Concept, Mistake } from "./game";

const BANK: Record<Concept, { q: string; hint: string }[]> = {
  same: [{ q: "2/7 + 3/7 = ?", hint: "As fatias já são do mesmo tamanho. O que muda: o número de fatias ou o tamanho?" }, { q: "5/9 + 1/9 = ?", hint: "Conta as fatias de cima. O denominador também se soma?" }],
  unlike: [{ q: "1/2 + 1/3 = ?", hint: "Que corte transforma meios e terços em fatias gémeas?" }, { q: "3/4 + 1/6 = ?", hint: "Procura um número que esteja na tabuada do 4 e do 6." }],
  whole: [{ q: "2 + 3/4 = ?", hint: "Uma pizza inteira tem quantas fatias de 1/4? E duas pizzas?" }, { q: "1 + 2/5 = ?", hint: "Escreve o 1 como uma fração com denominador 5." }],
  decimal: [{ q: "0,5 + 1/4 = ?", hint: "0,5 é metade. Que fração é essa?" }, { q: "0,25 + 2/8 = ?", hint: "Transforma 0,25 numa fração antes de juntar." }],
};

export async function downloadWorksheets(name: string, mistakes: Mistake[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const order: Concept[] = Array.from(new Set([...mistakes.map((m) => m.concept), "unlike", "whole", "decimal", "same"] as Concept[]));
  order.slice(0, 3).forEach((c, i) => {
    if (i) doc.addPage();
    doc.setFontSize(22); doc.setTextColor(255, 107, 53);
    doc.text(`Missão ${i + 1} — FractionQuest Lab`, 20, 25);
    doc.setFontSize(12); doc.setTextColor(43, 45, 66);
    doc.text(`Detetive: ${name}`, 20, 35);
    let y = 55;
    BANK[c].forEach((p, k) => {
      doc.setFontSize(18); doc.text(`${k + 1}. ${p.q}`, 20, y);
      doc.setFontSize(11); doc.setTextColor(155, 93, 229);
      doc.text(`Pista da Coruja: ${p.hint}`, 24, y + 9, { maxWidth: 165 });
      doc.setTextColor(43, 45, 66);
      doc.setDrawColor(255, 232, 214); doc.rect(20, y + 16, 170, 45);
      y += 80;
    });
    doc.setFontSize(10); doc.text("Desenha as fatias antes de escreveres a resposta!", 20, 285);
  });
  doc.save("fractionquest-missoes.pdf");
}
