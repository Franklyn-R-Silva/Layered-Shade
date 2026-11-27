# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[🇧🇷 Português](docs/pt-BR/CHANGELOG.md)

## [2.1.0] - 2026-11-27

### Changed

- 🎨 **Redesign ("drafting plate")**, made with the [impeccable](https://github.com/pbakaus/impeccable) design skill: the glass panels, animated blobs and gradient title are gone. A blueline top bar sits over three working columns: layer controls, a 1:1 preview plate and the generated code with the copy button, all visible at 1440×900.
- 📐 **Dimension lines on the preview** (toggle: *Cotas*): X/Y offset, spread outline, blur reach and the implied light direction of the selected layer, with light ink on dark canvases.
- 🧾 **Code panel shows exactly what is copied**: CSS one layer per line with the selected layer highlighted; the obsolete `-webkit-`/`-moz-` lines are no longer displayed (they were never copied). Tailwind shows the classes without the `class=""` wrapper, as copied.
- 🔤 Overpass / Overpass Mono, self-hosted (no Google Fonts request).
- ⌨️ Accessibility: ARIA tabs with arrow keys, no nested interactive elements in the layer lists, editable hex fields, number fields clamped to valid values, live copy status, SVG icons instead of glyphs.
- ⚪ New defaults: white box on the film-grey plate (`#ffffff` on `#e9eef0`).

### Fixed

- 🐛 **Dart export**: the default state opened `BoxDecoration(` without closing it, so the copied code did not compile.
- 🐛 Removing a layer before the selected one no longer moves the selection to another layer.
- 🐛 The Flutter inset note now appears whenever any layer is inset, not only the selected one; a note explains the one-gradient limit.
- 🐛 Opacity showed a `px` unit; it now shows `%`.
- 🐛 Removing a gradient's last-but-one color no longer opens a browser `alert()`; the button is disabled instead.

### Security / maintenance

- 🔒 Content Security Policy added to the Netlify headers (SECURITY.md already claimed it). Security contact e-mail corrected.
- 📦 Dependencies: Vite 8, `@sveltejs/vite-plugin-svelte` 7.3, TypeScript pinned to 5.9 (TypeScript 7 broke `typescript-eslint`); `npm ci` had stopped resolving on `main`. `npm audit`: 0 vulnerabilities.
- 🤖 CI installs with `npm ci`; Dependabot groups updates monthly and security fixes into one PR.

## [2.0.0] - 2026-07-13

### Changed

- 🚀 **Framework migration**: rewritten from vanilla JS (MVC) to **Svelte 5 + Vite + TypeScript**.
  - Pure code-generation logic preserved in `src/lib/shadow.ts` (state + CSS/Dart/Tailwind).
  - Reactive `$state` singleton (`src/lib/state.svelte.ts`) replaces the manual controller wiring.
  - UI split into Svelte components; global CSS design system reused unchanged.
  - Typed domain model (`src/lib/types.ts`); `svelte-check` in build and CI.
  - ~99% coverage on the pure logic core retained (71 tests); production bundle ≈ 23 KB gzip (JS).
- 🏗️ **Build/deploy**: Netlify now runs `npm run build` → `dist/`; static assets moved to `public/`.

## [1.2.0] - 2026-07-13

### Fixed

- 🐛 **Gradient stops mutation**: `getBackgroundCSS()` / `getBackgroundCSSForLayer()` no
  longer sort `layer.stops` in place, which corrupted stop order on every render.
- 🐛 **Tailwind export**: removed self-defeating escaping (parentheses were escaped then
  stripped) and normalized `rgba()` shadow values so `shadow-[...]`/`bg-[...]` are valid.
- 🐛 **Opacity display**: the opacity text field now shows the same 0–100 value as its slider.
- 🐛 **Reset consistency**: `reset()` restores the initial shadow opacity (0.2) instead of 0.5.
- 🐛 **Copy feedback**: the Tailwind tab now says "(Tailwind)" instead of "(Dart)".
- 🐛 **Shadow color control**: the color picker now initializes explicitly instead of relying
  on an implicit fallback.

### UI / Design

- 🎨 **Controls panel had no glass styling**: the stylesheet targeted a non-existent
  `#controls-container`; the real element is `#controls`, so the sidebar rendered without its
  glass card. Now both the controls and preview panels are consistent glass cards.
- 🎨 **Preview title overlap**: the "Preview" heading was absolutely positioned and could overlap
  the demo box on small screens; it now sits in normal flow with the box centered below.
- 🎨 **Footer contrast**: social links and the divider used near-invisible white-on-light colors;
  given visible backgrounds/borders suited to the light theme.
- 🎨 **Preview box** initial color synced to the model default (`#ffdd00`), removing a color flash.
- ♿ **Reduced motion**: added `prefers-reduced-motion` support to stop the floating blobs and
  fade transitions; mobile drops the sticky preview and oversized min-height.

### Added

- 🧪 **Regression tests**: coverage for the fixes above (133 tests total).
- 🔍 **SEO**: canonical link, absolute `og:image`/`twitter:image`, JSON-LD `WebApplication`
  schema, Fira Code font import, and `sitemap.xml`.
- 📱 **PWA**: `manifest.json` and `apple-touch-icon` for installability.
- ♿ **Accessibility**: `:focus-visible` indicators for preset buttons and range sliders.

### Changed

- 📊 **Honest coverage**: badges/notes now reflect that tests cover core logic (~99%), with
  the DOM/controller layers verified manually.

---

## [1.1.0] - 2025-12-27

### Added

- ✅ **Unit Tests**: 125 tests with Vitest covering the core logic (Model, config, components)
- 📁 **Test Structure**: `tests/` folder organized mirroring `js/`
- 🔧 **GitHub Actions**: CI/CD to run tests automatically
- 📝 **CONTRIBUTING.md**: Contributor guide
- ♿ **Accessibility**: Skip link, ARIA roles, semantic landmarks
- 🔒 **SECURITY.md**: Security policy
- 📜 **CODE_OF_CONDUCT.md**: Code of conduct
- 🌐 **i18n**: Documentation in English and Portuguese

### Changed

- 📖 **README.md**: Lighthouse badges, accessibility section
- 🎨 **Footer**: Updated design with social links
- 🐛 **Templates**: Fixed Neumorph and Glass presets

### Fixed

- 🔧 `addLayer`, `removeLayer`, `selectLayer` methods in ShadowModel
- 🔧 Tab panels visibility (removed conflicting `hidden` attribute)

---

## [1.0.0] - 2025-12-01

### Initial Release

- 🎨 **Shadow Generator**: Visual interface for creating box-shadows
- 🔄 **Multiple Layers**: Support for multiple shadow layers
- 🌈 **Gradients**: Linear and radial with multiple color stops
- 📋 **Export**: CSS, Dart/Flutter and Tailwind
- 📱 **Responsive**: Adaptive layout for mobile and desktop
- 🎯 **Templates**: Soft, Neumorphism and Glass presets
- 🏗️ **MVC Architecture**: Organized and modular code

---

## Links

- [Repository](https://github.com/Franklyn-R-Silva/Layered-Shade)
- [Demo](https://layeredshade.netlify.app/)
