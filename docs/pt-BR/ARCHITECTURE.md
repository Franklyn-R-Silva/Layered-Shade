# Arquitetura do Projeto "Layered Shade"

Este documento descreve a estrutura de arquivos e o design do projeto.

[🇺🇸 English](../../ARCHITECTURE.md)

## Stack

**Svelte 5 + Vite + TypeScript.** O design separa um **núcleo de lógica puro (sem framework)**
de uma **camada de UI reativa** enxuta, mantendo a geração de código 100% testável por unidade
e os componentes declarativos.

## Design

- **Lógica pura (`src/lib/shadow.ts`)** — sem Svelte, sem DOM. Define o formato do estado, todas
  as mutações e todos os geradores de código. Cada função recebe um `ShadowState`:
  - Estado: `createInitialState()`, `update()`, `reset()`, `addLayer()`, `removeLayer()`,
    `selectLayer()`, `addBackgroundLayer()`, `removeBackgroundLayer()`, `applyPreset()`.
  - Geradores: `getCSS()`, `getDart()` (Flutter `BoxShadow`/`BoxDecoration`), `getTailwind()`,
    `getBackgroundCSS()`, `getLayerDart()`, `getLayerTailwind()`.
- **Estado reativo (`src/lib/state.svelte.ts`)** — um singleton `$state` do Svelte 5 que envolve
  o núcleo puro: `state` (o `ShadowState`), `ui` (`mode`, `sidebar`) e `actions` (wrappers finos).
  Mutar `state` re-renderiza qualquer componente que o lê — substituindo o wiring manual do antigo
  controller MVC.
- **Tipos (`src/lib/types.ts`)** — `ShadowLayer`, `BackgroundLayer`, `GradientStop`,
  `BoxProperties`, `ShadowState`, `CodeMode`.
- **Config (`src/lib/config/controls.ts`)** — definições declarativas dos controles (`shadowControls`).

## Estrutura de Arquivos

```text
index.html                # entry do Vite (head com SEO/OG/JSON-LD/PWA)
src/
  main.ts                 # monta o App, importa o CSS global
  App.svelte              # layout: header, Toolbar, grid do gerador, CodeOutput, Footer
  lib/
    shadow.ts             # estado puro + geração de código
    shadow.test.ts        # testes de unidade (sem DOM)
    state.svelte.ts       # singleton $state + actions
    types.ts
    config/controls.ts
    components/
      Control.svelte      # um controle guiado por config (range/color/checkbox)
      ShadowControls.svelte / ShapeControls.svelte
      LayerList.svelte    # camadas de sombra
      BackgroundPanel.svelte   # camadas de gradiente + stops
      PreviewBox.svelte
      CodeOutput.svelte   # abas CSS/Dart/Tailwind + copiar
      Toolbar.svelte / Sidebar.svelte / Footer.svelte
  styles/                 # CSS global (styles.css → variables.css + modules/*.css)
public/                   # manifest.json, sitemap.xml, robots.txt, icons/, github/
```

## Fluxo de Dados

1. Um handler de componente (ex.: `oninput` de um slider) chama uma `action` ou muta `state`.
2. A lógica pura atualiza o `ShadowState` (`update`, `addLayer`, …).
3. Componentes que leem `state` re-renderizam automaticamente (reatividade do Svelte); saídas
   derivadas como `$derived(getCSS(state))` recalculam e os painéis de preview/código atualizam.

## Notas

- O Flutter não tem sombra inset nativa: `getDart()` emite `inset` como comentário indicando o
  pacote [`flutter_inset_box_shadow`](https://pub.dev/packages/flutter_inset_box_shadow) e exporta
  apenas a camada de gradiente do topo (o `BoxDecoration` aceita um único gradiente).
- O CSS global é reutilizado por nome de classe (sem `<style>` com escopo), então o markup migrado
  mantém o design system original.
