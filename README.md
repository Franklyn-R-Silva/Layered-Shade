# Layered Shade

**Design layered box and text shadows visually, then copy the same shadow as CSS, Tailwind, Flutter, Jetpack Compose, SwiftUI or React Native.**

[🇧🇷 Português](docs/pt-BR/README.md) · [Open the app](https://layeredshade.netlify.app/) · [Report a bug](https://github.com/Franklyn-R-Silva/Layered-Shade/issues/new?template=bug_report.md) · [Request a feature](https://github.com/Franklyn-R-Silva/Layered-Shade/issues/new?template=feature_request.md)

[![CI](https://github.com/Franklyn-R-Silva/Layered-Shade/actions/workflows/ci.yml/badge.svg)](https://github.com/Franklyn-R-Silva/Layered-Shade/actions/workflows/ci.yml)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/17195/badge)](https://www.bestpractices.dev/projects/17195)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-2747c9.svg)](CONTRIBUTING.md)
[![Good first issues](https://img.shields.io/github/issues/Franklyn-R-Silva/Layered-Shade/good%20first%20issue?label=good%20first%20issues&color=2747c9)](https://github.com/Franklyn-R-Silva/Layered-Shade/labels/good%20first%20issue)

![Layered Shade: layer controls on the left, the 1:1 preview plate with dimension lines in the centre, generated code on the right](public/github/tela.png)

## Why Layered Shade

- **One shadow, every platform.** The same layers export to six targets, and each export says plainly what its platform cannot do instead of silently dropping it.
- **Measured, not guessed.** The preview is drawn at 1:1 on a grid, with dimension lines for the selected layer's offset, spread, blur reach and light direction.
- **Free, instant, private.** No account, no backend, no analytics. Nothing is requested from third parties unless you click to load a Google font. Fonts you upload never leave your browser.

## Features

**Build**
- Stack as many shadow layers as you need: offset, blur, spread, color, opacity and inset per layer; duplicate, reorder, hide or remove them.
- Drag on the preview to move the selected shadow; undo and redo with Ctrl+Z / Ctrl+Shift+Z.
- Set the offset as **angle and distance** too (Photoshop's convention: the angle is where the light comes from), turn the light by dragging the start of the ray on the preview, and tick **Global light** to turn every visible layer together.
- Start from a preset (Soft, Neumorph, Glass), generate a **smooth multi-layer shadow**, or **import** an existing `box-shadow`, CSS rule or Tailwind `shadow-[…]` class.
- Gradient backgrounds (linear and radial, any number of stops) and border radius.

**Preview**
- On a box, a card, a button or **your own multi-line text**, in a font from your computer (Chromium can list them all), any of the ~1,960 searchable **Google Fonts**, or a font file you upload.
- In Portuguese or English (PT/EN switch, or `?lang=en`).
- On a light or dark ground, or any canvas color; the guide lines keep at least 3:1 contrast on it.

**Share**
- Copy a link that reopens exactly this shadow; your last session is restored when you come back.

**Not supported, and why:** Photoshop's per-shadow blend modes, noise and contour have no equivalent in CSS `box-shadow`, Flutter's `BoxShadow`, Compose, SwiftUI or React Native, so the tool leaves them out instead of exporting code that cannot reproduce them.

## Export support

| Target | Multiple layers | Spread | Inset | Gradient background |
| --- | :---: | :---: | :---: | :---: |
| CSS (properties or custom property) | ✅ | ✅ | ✅ | ✅ |
| Tailwind (classes or v4 `@theme` token) | ✅ | ✅ | ✅ | ✅ |
| Flutter (`BoxDecoration`) | ✅ | ✅ | via [`flutter_inset_box_shadow`](https://pub.dev/packages/flutter_inset_box_shadow) | top layer only |
| Jetpack Compose 1.9+ (`dropShadow` / `innerShadow`) | ✅ | ✅ | ✅ | API named in a comment |
| SwiftUI | ✅ | — | ✅ (iOS 16+) | API named in a comment |
| React Native 0.76+ (`boxShadow`) | ✅ | ✅ | ✅ | API named in a comment |

**Text mode** exports `text-shadow` (CSS, Tailwind), `TextStyle.shadows` (Flutter) and `.shadow` (SwiftUI); Compose and React Native accept **one** shadow per text, so they export the first layer and say so. Text shadows have no spread and no inset.

SwiftUI's shadow radius is about half the CSS blur; the export converts it and says so in a comment.

## Quick start

Use it online at **[layeredshade.netlify.app](https://layeredshade.netlify.app/)**, or run it locally (Node 20.19+):

```bash
git clone https://github.com/Franklyn-R-Silva/Layered-Shade.git
cd Layered-Shade
npm ci
npm run dev          # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm test` | Unit and integration tests (Vitest) |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run check` | Type-check with svelte-check, zero warnings allowed |
| `npm run build` | Production build in `dist/` |

## Contributing: anyone can help

You do not need to know the codebase, Svelte or shadows in depth to contribute. Issues labelled **[good first issue](https://github.com/Franklyn-R-Silva/Layered-Shade/labels/good%20first%20issue)** are small, name the exact files to touch, and say when they are done.

1. Pick an issue (or [open one](https://github.com/Franklyn-R-Silva/Layered-Shade/issues/new/choose)) and comment that you are on it.
2. Fork the repository, create a branch and run `npm ci`.
3. Make the change with a test; run `npm test`, `npm run lint` and `npm run check`.
4. Open a pull request with `Closes #<issue>`. CI runs the same checks and you will get a review.

Bug reports, translations, documentation fixes and ideas are as welcome as code. See [CONTRIBUTING.md](CONTRIBUTING.md) for the details and the [Code of Conduct](CODE_OF_CONDUCT.md) for how we treat each other.

## Security and quality

- Self-assessed against the [OpenSSF Best Practices](https://www.bestpractices.dev/projects/17195) criteria; the badge above shows the live status.
- CodeQL scans every pull request. Dependabot alerts and grouped security updates, secret scanning with push protection, lockfile-only installs and SHA-pinned actions protect the supply chain.
- The site ships a strict Content Security Policy; the only third party it can contact is Google Fonts, and only when you click to load a font.
- Found a vulnerability? Report it privately as described in [SECURITY.md](SECURITY.md).

## Architecture

A pure, framework-free logic core (`src/lib/shadow.ts` and the modules next to it) with a thin Svelte 5 UI on top, so every generator is unit-tested without a browser. See [ARCHITECTURE.md](ARCHITECTURE.md), the visual system in [DESIGN.md](DESIGN.md) and the product context in [PRODUCT.md](PRODUCT.md).

## Author

Made by **Franklyn R. Silva** · [GitHub](https://github.com/Franklyn-R-Silva) · [LinkedIn](https://www.linkedin.com/in/franklyn-roberto-dev/)

## License

[MIT](LICENSE)
