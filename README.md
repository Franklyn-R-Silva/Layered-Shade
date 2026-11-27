# Layered Shade

Build multi-layer box shadows visually and copy the same result as **CSS**, **Flutter/Dart** (`BoxShadow`, `BoxDecoration`) or **Tailwind**.

[🇧🇷 Português](docs/pt-BR/README.md)

[![Demo](https://img.shields.io/badge/Demo-layeredshade.netlify.app-2747c9)](https://layeredshade.netlify.app/)
[![CI](https://github.com/Franklyn-R-Silva/Layered-Shade/actions/workflows/ci.yml/badge.svg)](https://github.com/Franklyn-R-Silva/Layered-Shade/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/17195/badge)](https://www.bestpractices.dev/projects/17195)

![Layered Shade: layer controls on the left, the preview plate with dimension lines in the centre, generated CSS on the right](public/github/tela.png)

## Why

Most shadow generators stop at CSS. Layered Shade treats Flutter as a first-class target: one shadow model, three exports that agree, and the Flutter limits stated where they apply instead of being hidden.

## Features

### Shadows

- **Layers**: add, select and remove shadow layers; each has X/Y offset, blur, spread, color, opacity and inset.
- **Measured preview**: the box is drawn 1:1 on a grid, and dimension lines show the selected layer's offset, its spread outline, how far the blur reaches and where the light comes from. Toggle them with **Cotas**.
- **Presets**: Soft, Neumorph and Glass as starting points.

### Background and shape

- **Gradients**: stack linear and radial gradients with any number of color stops, over a solid base color.
- **Shape**: border radius; the preview canvas color is adjustable too.

### Export

- **CSS**: `box-shadow`, `background` and `border-radius`, one layer per line. The panel shows exactly what is copied, with the selected layer highlighted.
- **Dart/Flutter**: `BoxDecoration` with `BoxShadow` entries, ready to paste into a `Container`.
- **Tailwind**: `shadow-[…]` and `bg-[…]` arbitrary-value classes.
- **Copy**: one button for the active format, with a confirmation that screen readers announce.

## Known limitations

- **Flutter `inset`**: Flutter's `BoxShadow` has no inset. When a layer is inset, the Dart tab says so and gives the [`flutter_inset_box_shadow`](https://pub.dev/packages/flutter_inset_box_shadow) install command.
- **Several gradients in Flutter**: `BoxDecoration` takes one gradient, so the Dart export uses the top one (gradient 1). CSS and Tailwind export all of them.
- **Colors are hex only** (`#RGB` / `#RRGGBB`).

## Accessibility

- Every control has a visible label; number fields and sliders stay in sync and are clamped to valid values.
- The panel switch and the export tabs follow the WAI-ARIA tabs pattern (arrow keys, Home, End).
- Visible focus everywhere, a skip link to the preview, and `prefers-reduced-motion` respected.
- Copy success and failure are announced through a live region.

## Tech stack

| Technology     | Usage                                                     |
| -------------- | --------------------------------------------------------- |
| **Svelte 5**   | Reactive UI with runes (`$state`, `$derived`)             |
| **TypeScript** | Typed state, logic and components                         |
| **Vite**       | Dev server and production build                           |
| **CSS**        | Custom properties, Grid; self-hosted Overpass fonts       |
| **Vitest**     | Unit tests for the logic core and integration tests (DOM) |

## Architecture

A **pure, framework-free logic core** with a thin **reactive UI** on top:

```text
src/
├── App.svelte           # Top bar + the three working columns
├── main.ts              # Mounts the app
├── App.test.ts          # Integration tests (happy-dom)
└── lib/
    ├── shadow.ts        # Pure state + code generation (CSS/Dart/Tailwind)
    ├── shadow.test.ts   # Unit tests (no DOM)
    ├── state.svelte.ts  # $state singleton + actions + UI flags
    ├── tabs.ts          # Keyboard support for ARIA tabs
    ├── types.ts
    ├── config/controls.ts
    └── components/      # Control, LayerList, BackgroundPanel, PreviewBox, CodeOutput, …
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for details and [DESIGN.md](DESIGN.md) for the visual system.

## Getting started

Use it online at [layeredshade.netlify.app](https://layeredshade.netlify.app/), or run it locally (Node 20.19+):

```bash
git clone https://github.com/Franklyn-R-Silva/Layered-Shade.git
cd Layered-Shade
npm ci
npm run dev      # http://localhost:5173
```

Build with `npm run build` (output in `dist/`) and serve the build with `npm run preview`.

## Testing

```bash
npm test               # Unit + integration tests
npm run test:coverage  # Coverage of the logic core
npm run check          # Type-check (svelte-check)
npm run lint           # ESLint
```

The logic core (`src/lib/shadow.ts`: state mutations and the CSS/Dart/Tailwind generators) is covered by unit tests with no DOM. `src/App.test.ts` mounts the real component tree to check that the UI follows the state.

## Contributing

1. Fork the project
2. Create a branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push the branch (`git push origin feature/new-feature`)
5. Open a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for the guidelines and [SECURITY.md](SECURITY.md) to report a vulnerability.

## Author

Franklyn R. Silva

- GitHub: [@Franklyn-R-Silva](https://github.com/Franklyn-R-Silva)
- LinkedIn: [franklyn-roberto-dev](https://www.linkedin.com/in/franklyn-roberto-dev/)

## License

[MIT](LICENSE)
