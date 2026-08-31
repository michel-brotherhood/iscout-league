# iSCOUT — Immersive Website

Experiência digital imersiva da iSCOUT, reconstruída do zero em **Vite + Three.js +
GSAP + Lenis** (vanilla JS, sem framework). O site traduz o posicionamento da marca no
conceito **VÍDEO → VISÃO → DADOS → DECISÃO**, contado como scroll-storytelling
cinematográfico sobre um único canvas WebGL persistente.

## Conceito

Uma narrativa em 6 atos que fecha o loop **INVISÍVEL → VISÍVEL**:

1. **Hero — Invisível** · atleta como nuvem de pontos no escuro
2. **Problema — Visibilidade** · câmera atravessa a nuvem de atletas; poucos no radar
3. **Detecção / Pipeline** · node → detecção → tracking → dados (“O iSCOUT muda o jogo”)
4. **Dados / Perfil** · câmera top-down tática, atleta vira node, capítulo claro
5. **Matching / Humano + IA** · filtro visual 300 → 3 (“Não substitui. Amplifica.”)
6. **CTA final — Visível** · atleta reconstruído (“O talento está em todo lugar…”)

## Arquitetura

- **DOM layer** — conteúdo, tipografia, CTAs, formulário, FAQ, SEO, acessibilidade.
- **WebGL layer** — `#webgl` fixo/fullscreen, um `SceneManager` persistente cuja cena é
  dirigida pelo progresso de scroll (nuvem de pontos que faz morph para layout de campo,
  câmera por keyframes, bounding box de detecção, filtro de matching).
- **Motion** — Lenis (smooth scroll) integrado ao GSAP ScrollTrigger; reveals por
  IntersectionObserver; alternância de capítulos dark/light.

```
src/
  main.js                 orquestração (loader, header, boot)
  three/SceneManager.js   cena WebGL única + 6 atos
  motion/ScrollManager.js Lenis + ScrollTrigger + estado de progresso
  motion/reveal.js        text reveals, kinetic typography, HUD de tracking
  lib/{supabase,contactForm,i18n}.js  formulário + legais + toggle PT/EN
  styles/{tokens,main}.css design tokens e estilos
```

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:8080
npm run build
npm run preview
```

### Variáveis de ambiente

Copie `.env.example` para `.env`. O formulário de contato envia para a edge function
`supabase/functions/verify-contact` (validação + hCaptcha server-side + insert na tabela
`contact_submissions`). Sem as variáveis Supabase, o formulário degrada com uma mensagem
orientando o contato por e-mail.

## Performance & Acessibilidade

- `pixelRatio` limitado (1.5 desktop / 1.25 mobile), BufferGeometry + shader de pontos,
  `dispose()` de recursos, renderer pausado com a aba oculta.
- `prefers-reduced-motion`: desliga smooth scroll, camera travel e reveals.
- Todo o conteúdo permanece no DOM (SEO/leitores de tela); WebGL é apresentação.

## Notas

- Assets cinematográficos são **procedurais** (WebGL). O pipeline Higgsfield fica como
  evolução opcional para substituir/realçar momentos-chave por vídeo.
- Dados de perfil, métricas de matching e HUD de tracking são **cenográficos/ilustrativos**.
- Marcas/parceiros só aparecem publicamente mediante contrato e autorização.
