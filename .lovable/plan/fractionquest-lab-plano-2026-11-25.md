# FractionQuest Lab — Plano

Plataforma lúdica (interface em português de Portugal) para crianças de 11 anos aprenderem a somar frações por descoberta visual e perguntas socráticas, sem nunca receberem a resposta final.

## Páginas
1. **/ — Caixa de Areia e Forja de Pizzas** (sem login)
   - Duas "energy cakes" (círculo e barra) cortáveis com botões +/− e setas do teclado; equação ao vivo à direita.
   - Ao juntar denominadores diferentes: as fatias ressaltam com efeito magnético e a Coruja Sócrates faz uma pergunta curiosa.
   - Ao igualar denominadores: as fatias fundem-se, som de "chime" e confetti.
   - Estado vazio e mensagem de boas-vindas conforme o guia.
2. **/detetive — Caderno Detetive** (2 verificações grátis)
   - Zona de arrastar/foto (câmara no telemóvel), feixe de scanner animado.
   - A IA lê os passos manuscritos, destaca o passo errado a âmbar e faz 1–2 perguntas socráticas. A criança responde por escrito; ao corrigir, o passo fica verde e ganha +100 XP.
3. **/cofre — Cofre de Conquistas e Almanaque de Erros**
   - Medalhas (Mesmo Denominador, Denominadores Diferentes, Mistura com Inteiros, Híbridos Decimais), bloqueadas com desfoque.
   - Após a 2.ª verificação: baú dourado pede email → abre-se, desbloqueia medalhas e descarrega um PDF com 3 fichas personalizadas.
4. **Guilda dos Mestres** (painel deslizante, 1 $/mês)
   - Mostra benefícios (verificações ilimitadas, diálogos por voz, resumo semanal para pais) e abre o checkout de pagamento.

## Componentes partilhados
FractionDisplay, SocraticBubble (coruja), ProgressBar de XP, barra de topo com XP/nível, alternador de alto contraste, regiões aria-live para as dicas.

## Design
Cores do guia (Tangerina #FF6B35, Violeta #9B5DE5, fundo #FFFDF9, Lilás #F3E8FF, Ouro, Esmeralda, Âmbar — nunca vermelho para erros), fontes Outfit / DM Sans / JetBrains Mono, cartões rounded-3xl, animações com mola (250–350 ms), alvos de toque ≥48px.

## Fases
1. Design + Caixa de Areia completa (funciona sem servidor).
2. Lovable Cloud: tabelas de sessões anónimas, emails, progresso por medalha e histórico de erros.
3. Caderno Detetive com IA (modelo pedido: Gemini 2.5 Flash, via Lovable AI — sem chaves a gerir), com instrução rígida de nunca revelar a solução.
4. Cofre + captura de email + geração de PDF.
5. Pagamentos Stripe (subscrição 1 $/mês) e estado "Mestre" a remover o limite de 2 verificações.

## Fora do âmbito inicial
Diálogos por voz e resumos semanais por WhatsApp/email aparecem como benefícios no painel premium, mas ficam para uma fase seguinte.

## Detalhes técnicos
- Rotas TanStack: `index.tsx`, `detetive.tsx`, `cofre.tsx`; head() próprio em cada uma.
- Sessão anónima: id em localStorage, ligado a linha na base de dados; email associa o perfil.
- Contagem de verificações grátis validada no servidor (createServerFn), não só no browser.
- IA: server function com imagem em base64, resposta JSON estrita {passos[], passoErrado, caixa, perguntas[]}; pós-filtro que rejeita respostas contendo a soma final.
- PDF gerado no browser (jsPDF) a partir dos erros registados.
- Confetti com canvas-confetti; sons curtos via Web Audio (sem ficheiros).
- Testes: limite de 2 verificações grátis e regra de desbloqueio após email.
