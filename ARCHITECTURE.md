# "Layered Shade" Project Architecture

This document describes the file structure and design of the project.

[🇧🇷 Português](docs/pt-BR/ARCHITECTURE.md)

## Stack

**Svelte 5 + Vite + TypeScript.** The design separates a **pure, framework-free logic core**
from a thin **reactive UI layer**, so the code generation stays fully unit-testable and the
components stay declarative.

## Design

- **Pure logic (`src/lib/shadow.ts`)** — no Svelte, no DOM. Owns the state shape, all mutations
  and every code generator. Each function receives a `ShadowState`:
  - State: `createInitialState()`, `update()`, `reset()`, `addLayer()`, `removeLayer()`,
    `selectLayer()`, `addBackgroundLayer()`, `removeBackgroundLayer()`, `applyPreset()`.
  - Generators: `getCSS()`, `getDart()` (Flutter `BoxShadow`/`BoxDecoration`), `getTailwind()`,
    `getBackgroundCSS()`, `getLayerDart()`, `getLayerTailwind()`.
- **Reactive state (`src/lib/state.svelte.ts`)** — a Svelte 5 `$state` singleton wrapping the
  pure core: `state` (the `ShadowState`), `ui` (`mode`, `sidebar`) and `actions` (thin wrappers).
  Mutating `state` re-renders any component that reads it — replacing the manual wiring of the
  previous MVC controller.
- **Types (`src/lib/types.ts`)** — `ShadowLayer`, `BackgroundLayer`, `GradientStop`,
  `BoxProperties`, `ShadowState`, `CodeMode`.
- **Config (`src/lib/config/controls.ts`)** — declarative control definitions (`shadowControls`).

## File Structure

```text
index.html                # Vite entry (SEO/OG/JSON-LD/PWA head)
src/
  main.ts                 # mounts App, imports global CSS
  App.svelte              # layout: header, Toolbar, generator grid, CodeOutput, Footer
  lib/
    shadow.ts             # pure state + code generation
    shadow.test.ts        # unit tests (no DOM)
    state.svelte.ts       # $state singleton + actions
    types.ts
    config/controls.ts
    components/
      Control.svelte      # one config-driven control (range/color/checkbox)
      ShadowControls.svelte / ShapeControls.svelte
      LayerList.svelte    # shadow layers
      BackgroundPanel.svelte   # gradient layers + stops
      PreviewBox.svelte
      CodeOutput.svelte   # CSS/Dart/Tailwind tabs + copy
      Toolbar.svelte / Sidebar.svelte / Footer.svelte
  styles/                 # global CSS (styles.css → variables.css + modules/*.css)
public/                   # manifest.json, sitemap.xml, robots.txt, icons/, github/
```

## Data Flow

1. A component handler (e.g. a slider `oninput`) calls an `action` or mutates `state` directly.
2. The pure logic updates the `ShadowState` (`update`, `addLayer`, …).
3. Components that read `state` re-render automatically (Svelte reactivity); derived outputs like
   `$derived(getCSS(state))` recompute and the preview + code panels update.

## Notes

- Flutter has no native inset shadow: `getDart()` emits `inset` as a comment referencing the
  [`flutter_inset_box_shadow`](https://pub.dev/packages/flutter_inset_box_shadow) package, and
  exports only the top gradient layer (`BoxDecoration` accepts a single gradient).
- Global CSS is reused by class name (not scoped `<style>` blocks) so the migrated markup keeps
  the original design system.
