# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Layered Shade is a client-side web tool that visually generates multi-layer box shadows and exports them as **CSS**, **Dart/Flutter** (`BoxShadow`/`BoxDecoration`), and **Tailwind** (arbitrary utility classes). Built with **Svelte 5 + Vite + TypeScript**. Deployed to Netlify (`npm run build` → `dist/`).

> History: this was originally vanilla JS (MVC). It was migrated to Svelte 5 — the pure code-generation logic was preserved almost verbatim in `src/lib/shadow.ts`.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Vite dev server (http://localhost:5173)
npm run build            # svelte-check + vite build → dist/
npm run preview          # Serve the production build
npm run check            # svelte-check (type-check .svelte + .ts)
npm test                 # Vitest run
npm run test:coverage    # Coverage (v8 → coverage/)
npm run lint             # ESLint (flat config) over src/
npm run lint:fix         # ESLint autofix
```

Run a single test file or filter by name:

```bash
npx vitest run src/lib/shadow.test.ts
npx vitest run -t "getTailwind"
```

## Architecture

Reactive UI (Svelte 5 runes) over a **pure, framework-free logic core**. This split is the key idea — keep it.

- **`src/lib/shadow.ts` — pure logic (no Svelte).** State factory (`createInitialState`), mutations (`update`, `addLayer`, `reset`, `addBackgroundLayer`, …), presets (`applyPreset`), and all code generation (`getCSS`, `getDart`, `getTailwind`, `getBackgroundCSS`). Everything takes a `ShadowState` and is unit-tested in `src/lib/shadow.test.ts` with no DOM/Svelte. Put new logic here.
- **`src/lib/state.svelte.ts` — reactive layer.** `export const state = $state(createInitialState())` plus `ui` (`mode`, `sidebar`) and thin `actions` wrappers that call the pure functions on the singleton `state`. Mutating `state` re-renders the UI — this replaces the old manual controller wiring.
- **`src/lib/types.ts`** — `ShadowLayer`, `BackgroundLayer`, `GradientStop`, `BoxProperties`, `ShadowState`, `CodeMode`.
- **`src/lib/config/controls.ts`** — declarative slider/color/checkbox config (`shadowControls`).
- **`src/lib/components/*.svelte`** — `Control` (renders one config-driven control), `ShadowControls`/`ShapeControls`, `LayerList`, `BackgroundPanel`, `PreviewBox`, `CodeOutput` (tabs + copy), `Toolbar`, `Sidebar`, `Footer`. `src/App.svelte` composes the layout; `src/main.ts` mounts it.
- **`src/styles/`** — global CSS (`styles.css` `@import`s `variables.css` + `modules/*.css`). Imported once in `main.ts`. Components reuse these class names rather than scoped `<style>`.

### Key conventions & gotchas

- **Two opacity scales**: the UI uses `0–100`; the model stores shadow opacity as `0–1`. `Control.svelte` converts (`value / 100` on input, `* 100` for display) for the `opacity` control. Keep this boundary when adding controls.
- **CSS vs Flutter layer limits**: CSS stacks all layers; Flutter's `BoxDecoration` takes one gradient, so `getDart()` emits only `backgroundLayers[0]` (the CSS-topmost) — intentional.
- **Color handling is hex-only**: `hexToRgba`/`hexToColorObj` assume `#RGB`/`#RRGGBB`. `rgbaToHex` is a stub returning `#000000`.
- **Naming conflict**: don't name a local `state` in a component that also uses the `$state` rune — it triggers `store_rune_conflict`. `CodeOutput.svelte` imports the store as `state as shadow` for this reason.
- **Adding a shadow control**: add an entry to `controls.ts`; `ShadowControls`/`ShapeControls` render it via `Control.svelte` automatically. Only `opacity` needs the 0–100↔0–1 conversion already handled in `Control`.

## Testing & CI

- Vitest + `happy-dom` (config lives in `vite.config.ts` under `test`). Tests are `src/**/*.test.ts`; the core suite is `src/lib/shadow.test.ts` (pure logic). Coverage is scoped to `src/lib/shadow.ts` + `src/lib/config/controls.ts`.
- Lint uses ESLint 10 flat config (`eslint.config.js`) with `typescript-eslint` + `eslint-plugin-svelte`.
- CI (`.github/workflows/ci.yml`, Node 20): clean install → lint → test → coverage → **build**.

## Notes

- UI copy and `controls.ts` labels are **Portuguese (pt-BR)**. Docs have a pt-BR mirror under `docs/pt-BR/`; keep the English README in English.
- Static assets (`manifest.json`, `sitemap.xml`, `robots.txt`, `icons/`, `github/` preview images) live in `public/` and are served at the site root.
