import { createServerFn } from "@tanstack/react-start";

const MODEL = "google/gemini-2.5-flash";
const URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const RULES = `És a "Coruja Sócrates", uma treinadora de matemática curiosa e entusiasta para crianças de 11 anos. Falas SEMPRE em português de Portugal (tu, "repara", "fatias", "consegues").
REGRA ABSOLUTA: NUNCA dês a resposta final, nem o resultado de um passo, nem a fração simplificada. Nunca escrevas "a resposta é" nem o número certo. Só fazes perguntas que guiam (máx. 2), com exemplos de pizzas ou fatias.
Nunca uses palavras como "errado" ou "mal". Diz "repara", "olha com atenção", "quase lá".`;

export type Step = { text: string; ok: boolean; box: [number, number, number, number] | null };
export type Analysis = { steps: Step[]; errorIndex: number | null; concept: "same" | "unlike" | "whole" | "decimal"; questions: string[]; unreadable: boolean };

async function callTool<T>(messages: unknown[], name: string, parameters: object): Promise<T> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("config");
  const res = await fetch(URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({ model: MODEL, messages, tools: [{ type: "function", function: { name, parameters } }], tool_choice: { type: "function", function: { name } } }),
  });
  if (res.status === 429) throw new Error("busy");
  if (res.status === 402) throw new Error("credits");
  if (!res.ok) { console.error("AI error", res.status, await res.text()); throw new Error("network"); }
  const json = await res.json();
  const args = json?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error("network");
  return JSON.parse(args) as T;
}

const errMsg = (e: unknown) => {
  const m = e instanceof Error ? e.message : "";
  if (m === "busy") return "Muitos detetives ao mesmo tempo! Espera uns segundos e tenta de novo.";
  if (m === "credits") return "A lupa da Coruja está sem energia de momento. Avisa um adulto, por favor.";
  return "O Coruja Sócrates perdeu o sinal da lupa! Vamos tentar de novo sem perder o teu lugar?";
};

export const analyzeNotebook = createServerFn({ method: "POST" })
  .inputValidator((d: { image: string }) => {
    if (typeof d?.image !== "string" || !d.image.startsWith("data:image/") || d.image.length > 8_000_000) throw new Error("Imagem inválida");
    return d;
  })
  .handler(async ({ data }): Promise<{ ok: true; analysis: Analysis } | { ok: false; error: string }> => {
    try {
      const analysis = await callTool<Analysis>([
        { role: "system", content: RULES + `\nRecebes uma fotografia de um caderno com somas de frações (mesmo denominador, denominadores diferentes, inteiros + frações ou decimais + frações). Transcreve cada linha/passo por ordem, marca ok=false APENAS no primeiro passo com erro, dá a caixa aproximada [x,y,largura,altura] de cada passo em percentagem (0-100) da imagem, e escreve 1-2 perguntas socráticas sobre esse passo. Se tudo estiver certo, errorIndex=null e as perguntas celebram e pedem para explicar o raciocínio. Se não conseguires ler, unreadable=true.` },
        { role: "user", content: [{ type: "text", text: "Analisa o meu caderno, por favor." }, { type: "image_url", image_url: { url: data.image } }] },
      ], "report_analysis", {
        type: "object",
        properties: {
          steps: { type: "array", items: { type: "object", properties: { text: { type: "string" }, ok: { type: "boolean" }, box: { type: "array", items: { type: "number" } } }, required: ["text", "ok"] } },
          errorIndex: { type: ["integer", "null"] },
          concept: { type: "string", enum: ["same", "unlike", "whole", "decimal"] },
          questions: { type: "array", items: { type: "string" } },
          unreadable: { type: "boolean" },
        },
        required: ["steps", "errorIndex", "concept", "questions", "unreadable"],
      });
      analysis.steps = (analysis.steps ?? []).map((s) => ({ ...s, box: Array.isArray(s.box) && s.box.length === 4 ? (s.box as Step["box"]) : null }));
      return { ok: true, analysis };
    } catch (e) {
      return { ok: false, error: errMsg(e) };
    }
  });

export const replyToOwl = createServerFn({ method: "POST" })
  .inputValidator((d: { step: string; questions: string[]; history: { role: "owl" | "kid"; text: string }[]; answer: string }) => {
    if (!d?.answer?.trim() || d.answer.length > 500) throw new Error("Resposta inválida");
    return { ...d, history: d.history.slice(-10) };
  })
  .handler(async ({ data }): Promise<{ ok: true; solved: boolean; reply: string } | { ok: false; error: string }> => {
    try {
      const convo = data.history.map((h) => `${h.role === "owl" ? "Coruja" : "Aluno"}: ${h.text}`).join("\n");
      const r = await callTool<{ solved: boolean; reply: string }>([
        { role: "system", content: RULES + `\nO aluno está a corrigir este passo do caderno: "${data.step}". Avalia a resposta mais recente. solved=true só se o aluno mostrou que percebeu e corrigiu o erro sozinho. Se solved=true, celebra em 1-2 frases sem acrescentar a resposta. Se não, faz UMA nova pergunta mais pequena e concreta.` },
        { role: "user", content: `Conversa:\n${convo}\nAluno: ${data.answer}` },
      ], "evaluate", { type: "object", properties: { solved: { type: "boolean" }, reply: { type: "string" } }, required: ["solved", "reply"] });
      return { ok: true, ...r };
    } catch (e) {
      return { ok: false, error: errMsg(e) };
    }
  });
