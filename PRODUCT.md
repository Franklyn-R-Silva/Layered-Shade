# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Flutter and web developers in the middle of a task. They need a box shadow (often a layered one) for a card, button or panel, tune it against a live preview, copy the code and go back to their editor. Flutter developers are the audience neighbouring generators serve worst.

## Product Purpose

Layered Shade builds multi-layer box shadows and gradient backgrounds visually and exports the same result as CSS, Dart/Flutter (`BoxShadow` / `BoxDecoration`) and Tailwind arbitrary classes. Success is a developer getting from "I need a shadow" to pasted, correct code in under a minute, with no sign-up and nothing to install.

## Positioning

One shadow model, three exports that agree: the Dart output is a first-class target, not an afterthought, and the tool states Flutter's real limits (no native inset, one gradient per `BoxDecoration`) instead of hiding them.

## Operating Context

- Used beside a code editor, often on a laptop screen; some visits come from phones.
- The session is short and task-shaped: pick a preset or start from the default, adjust layers, switch the export tab, copy.
- Free, client-side only, deployed on Netlify at https://layeredshade.netlify.app/.

## Capabilities and Constraints

- Shadow layers: add, select, duplicate, reorder, hide, remove; per layer X/Y offset, blur, spread, color, opacity (UI 0–100, model 0–1) and inset. Smooth-shadow generator and CSS import replace the layer list.
- Session: undo/redo, share link (state in the URL hash), last session restored from localStorage. No backend and no AI features, by decision.
- Shape: border radius. Canvas (preview background) color and a solid base color for the box. Preview element: box, card or button.
- Background: stacked linear/radial gradient layers with 2+ color stops, angle, radial position and size.
- Presets: Soft, Neumorphism, Glass.
- Export tabs: CSS (properties or variable), Tailwind (classes or v4 theme), Dart, Jetpack Compose, SwiftUI, React Native; one copy button for the active tab. The panel shows exactly what is copied (the obsolete -webkit/-moz lines were display-only and were dropped in 2.1.0).
- Flutter limits are intentional: inset needs the `flutter_inset_box_shadow` package; Dart exports only the top gradient layer.
- Colors are hex-only (`#RGB` / `#RRGGBB`).
- Stack: Svelte 5 + Vite + TypeScript. The pure logic core (`src/lib/shadow.ts`) stays framework-free and unit-tested.
- UI copy is Portuguese (pt-BR).

## Brand Commitments

- Name: Layered Shade. Author credit: Franklyn R. Silva, with GitHub and LinkedIn links.
- Free and open source (MIT).

## Evidence on Hand

- Live demo: https://layeredshade.netlify.app/
- Screenshots: `public/github/tela.png`, `public/github/demo.webp` (these show the old look and go stale after a redesign).
- 71 unit tests on the logic core.
- No testimonials, user counts or download numbers exist; do not invent them.

## Product Principles

1. The preview is the product: it is always visible and always shows exactly what the code says.
2. Copying is the finish line: the active export is one action away and the code is readable before it is copied.
3. Tell the truth about platform limits, in place, when they apply.
4. Stay instant and free: no account, no backend, no waiting.

## Accessibility & Inclusion

Keyboard-operable controls with visible focus, a skip link, semantic landmarks and ARIA tabs are existing commitments. Respect `prefers-reduced-motion`.
