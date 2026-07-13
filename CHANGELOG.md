# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[🇧🇷 Português](docs/pt-BR/CHANGELOG.md)

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
