---
version: 1
slug: "src-app-svelte"
primary_target: "src/App.svelte"
related_targets: ["src/lib/components"]
---

## Scope

The whole Layered Shade tool page (`src/App.svelte` and its components). Visitor mode: Operate. Redesign: the glass/blob look is replaced; every function, the pt-BR copy and the author footer stay.

## Audience and task

Flutter and web developers beside their editor: start from a preset or the default, tune layers against the preview, pick CSS / Dart / Tailwind, copy. Constraints: Flutter limits shown in place (inset package, one gradient), hex-only colors, pure logic core untouched.

## Direction contract

THESIS: the preview is a drafting plate where the selected layer is measured, not guessed. It refuses the category's glass panel with a floating box and a code dump below.

OWN-WORLD: cool drafting-film ground (#e9eef0) with lighter film panels, graphite ink, hairline rules, and blueline (#2747c9) as the committed field: the top bar, selection, focus and the copy action. Red pencil only for platform-limit notes. Overpass for every UI word; Overpass Mono for code and measurements, tabular figures.

STORY: the visitor sees the box and its shadow at once, reads what each number does on the plate, trusts that the code panel says exactly what the stage shows, copies.

FIRST VIEWPORT: blueline top bar with the name and presets; three working columns: layers + controls (left, ~360px), the stage with a fine grid and dimension lines (centre, widest), the export tabs, code and copy button (right, ~400px). Copy is visible without scrolling at 1440×900.

FORM: own grounded candidate 1 (sciagraphy plate), taken as the pick. seed:6be03dd2e3aa666b. Signature interaction: dimension lines track the selected layer live (X, Y, blur extent, spread outline) and the implied light ray, toggleable as "Cotas". Motion grammar: 180ms ease-out state changes; the lines draw in once when the selected layer changes.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Open decisions

- `public/github/demo.webp` shows the old look; it needs a new recording by the author.
