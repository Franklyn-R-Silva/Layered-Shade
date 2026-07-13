# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Layered Shade is a client-side web tool that visually generates multi-layer box shadows and exports them as **CSS**, **Dart/Flutter** (`BoxShadow`/`BoxDecoration`), and **Tailwind** (arbitrary utility classes). It is vanilla JavaScript with ES Modules and **zero runtime dependencies** — everything under `devDependencies` is for testing/linting only. Deployed as a static site to Netlify (`publish = "."`, no build step).

## Commands

```bash
npm install              # Install dev dependencies (test/lint only)
npm test                 # Run all tests once (vitest run)
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report (v8 → coverage/)
npm run lint             # ESLint over js/
npm run lint:fix         # ESLint autofix
```

Run a single test file or filter by name:

```bash
npx vitest run tests/model/ShadowModel.test.js
npx vitest run -t "getCSS"
```

**Running the app locally:** it uses ES Modules loaded via `<script type="module">`, so opening `index.html` from the filesystem will NOT work — it must be served over HTTP (e.g. VS Code Live Server, or `npx serve .`).

## Architecture

Strict **MVC** with one-directional flow. Full details in `ARCHITECTURE.md`.

- **Controller — `js/main.js` (`ShadowController`)**: the only place that wires Model ↔ View. Instantiated on `DOMContentLoaded`. Receives all user events through a single `handleEvent(type, value)` dispatcher plus manager callbacks, mutates the Model, then calls `refreshView()` which pulls fresh state + generated code strings and pushes them to the View. The View never touches the Model directly.
- **Model — `js/model/ShadowModel.js`**: all state and code generation. No DOM access. Holds three independent pieces of state: `layers` (shadow layers, always ≥1), `backgroundLayers` (gradient stack), and `boxProperties` (borderRadius, backgroundColor, canvasColor). `update(key, value)` routes by key: `bgLayer*` keys → active background layer, box-property keys → `boxProperties`, everything else → the currently selected shadow layer. Output generators: `getCSS()`, `getDart()`, `getTailwind()`, `getBackgroundCSS()`.
- **View — `js/view/ShadowView.js`**: all DOM reads/writes and event binding. Builds sliders dynamically from `js/config/controlsConfig.js` via `ControlFactory`, then delegates sub-areas to component managers.
- **Components — `js/components/`**: `LayerManager` (shadow layer list), `BackgroundManager` + `GradientManager` (gradient stack + stops), `TabManager` (CSS/Dart/Tailwind output tabs), `NotificationManager` (copy feedback), `ControlFactory` (builds control DOM from config).

### Key conventions & gotchas

- **Two opacity scales**: sliders/UI use `0–100`; the Model stores shadow opacity as `0–1`. The controller divides by 100 in `handleEvent` before calling `model.update('opacity', …)`. Keep this boundary in mind when adding controls.
- **CSS vs Flutter layer limits**: CSS `box-shadow`/`background` stack all layers. Flutter's `BoxDecoration` accepts only ONE gradient and one color, so `getDart()` emits only `backgroundLayers[0]` (the CSS-topmost) as the gradient — this is intentional, not a bug.
- **Color handling is hex-only**: helpers (`hexToRgba`, `hexToColorObj`) assume `#RGB`/`#RRGGBB` from color pickers. `rgbaToHex` is a stub returning `#000000`; presets that inject `rgba(...)` background strings won't round-trip to Dart correctly.
- **Presets** (`soft`, `neumorphism`, `cristal`) live in `ShadowController.applyPreset` and are built by calling `model.update(...)` sequentially — not stored as data objects.
- **Adding a shadow control**: add an entry to `controlsConfig.js` (the View auto-renders it), then handle its `type` in `ShadowController.handleEvent` if it needs parsing (int/opacity coercion happens there).

## Testing & CI

- Vitest with the `happy-dom` environment (`vitest.config.js`). Tests live in `tests/**/*.test.js` mirroring the `js/` layout.
- Coverage is scoped to Model, config, and components only — `main.js` and `ShadowView.js` are excluded from coverage (heavy DOM wiring).
- CI (`.github/workflows/ci.yml`) runs on push/PR to `main`: clean `npm install`, `npm test`, then `npm run test:coverage`. Node 20.

## Notes

- Some source strings and `controlsConfig.js` labels are in **Portuguese** (`pt-BR`); DOM IDs mix English and Portuguese (e.g. `#opacidade`, `#insetBox`). Match existing IDs exactly when querying elements. Docs have a Portuguese mirror under `docs/pt-BR/`.
- CSS is modularized: `css/styles.css` `@import`s `css/variables.css` + `css/modules/*.css`. Add new styles as a module and import it there.
