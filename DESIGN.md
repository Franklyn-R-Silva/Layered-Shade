---
name: Layered Shade
description: A drafting plate for layered box shadows, exported as CSS, Dart/Flutter and Tailwind.
colors:
  blueline: "#2747c9"
  blueline-deep: "#1c3599"
  blueline-night: "#142a7a"
  blueline-tint: "#e1e7fa"
  blueline-ring: "rgba(39, 71, 201, 0.22)"
  on-blueline: "#ffffff"
  on-blueline-2: "#d5dcf7"
  pencil: "#b3311e"
  sheet-pencil: "#f2a493"
  film: "#e9eef0"
  film-raised: "#f6f8f9"
  film-sunk: "#dfe6e9"
  paper: "#ffffff"
  rule: "#c5ced3"
  rule-strong: "#78858d"
  graphite: "#23272b"
  graphite-2: "#4a535a"
  sheet: "#1f2327"
  sheet-rule: "#353b41"
  sheet-ink: "#e4e9ec"
  sheet-ink-2: "#a3aeb5"
  sheet-blueline: "#8fa3ff"
  sheet-current: "rgba(39, 71, 201, 0.6)"
  grid-minor: "rgba(39, 71, 201, 0.07)"
  grid-major: "rgba(39, 71, 201, 0.15)"
typography:
  headline:
    fontFamily: "Overpass, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Overpass, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.2
  subtitle:
    fontFamily: "Overpass, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Overpass, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Overpass, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.45
  field-label:
    fontFamily: "Overpass, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.45
  caption:
    fontFamily: "Overpass, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
  code:
    fontFamily: "'Overpass Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.75
    fontFeature: "'tnum' 1, 'liga' 0, 'calt' 0"
  readout:
    fontFamily: "'Overpass Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "'tnum' 1, 'liga' 0, 'calt' 0"
  dimension:
    fontFamily: "'Overpass Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 600
    fontFeature: "'tnum' 1, 'liga' 0, 'calt' 0"
rounded:
  swatch: "2px"
  nested: "3px"
  base: "4px"
spacing:
  space-1: "0.25rem"
  space-2: "0.5rem"
  space-3: "0.75rem"
  space-4: "1rem"
  space-5: "1.25rem"
  space-6: "1.5rem"
components:
  topbar:
    backgroundColor: "{colors.blueline}"
    textColor: "{colors.on-blueline}"
    typography: "{typography.headline}"
    height: "56px"
    padding: "8px 20px"
  stage-bar:
    backgroundColor: "{colors.film-raised}"
    textColor: "{colors.graphite-2}"
    typography: "{typography.caption}"
    padding: "8px 20px"
  button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    height: "32px"
    padding: "0 12px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    height: "32px"
    padding: "0 12px"
  button-quiet-hover:
    backgroundColor: "{colors.paper}"
  button-primary:
    backgroundColor: "{colors.blueline}"
    textColor: "{colors.on-blueline}"
    rounded: "{rounded.base}"
    height: "44px"
    width: "100%"
    padding: "0 12px"
  button-primary-hover:
    backgroundColor: "{colors.blueline-deep}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-2}"
    rounded: "{rounded.base}"
    size: "32px"
  icon-button-hover:
    backgroundColor: "{colors.film-sunk}"
    textColor: "{colors.pencil}"
  segmented:
    backgroundColor: "{colors.film-sunk}"
    rounded: "{rounded.base}"
    padding: "3px"
  segmented-tab:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-2}"
    rounded: "{rounded.nested}"
    height: "32px"
  segmented-tab-selected:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.blueline}"
  layer-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.base}"
    height: "48px"
  layer-row-active:
    backgroundColor: "{colors.blueline-tint}"
    textColor: "{colors.blueline-deep}"
  layer-index-active:
    backgroundColor: "{colors.blueline}"
    textColor: "{colors.on-blueline}"
    typography: "{typography.readout}"
    rounded: "{rounded.nested}"
    size: "22px"
  input-number:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.base}"
    padding: "4px 4px 4px 8px"
    width: "52px"
  input-hex:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.base}"
    padding: "6px 8px"
    width: "84px"
  code-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.sheet-ink}"
    typography: "{typography.code}"
    padding: "16px 20px"
  code-tab:
    backgroundColor: "transparent"
    textColor: "{colors.sheet-ink-2}"
    typography: "{typography.label}"
    padding: "8px 12px 10px"
  code-tab-selected:
    textColor: "{colors.sheet-ink}"
  code-line-current:
    backgroundColor: "{colors.sheet-current}"
    textColor: "{colors.on-blueline}"
  platform-note:
    backgroundColor: "rgba(242, 164, 147, 0.07)"
    textColor: "{colors.sheet-pencil}"
    typography: "{typography.caption}"
    rounded: "{rounded.base}"
    padding: "12px"
---

# Design System: Layered Shade

## Overview

**Creative North Star: "The Sciagraphy Plate"**

Sciagraphy is the drafting art of casting shadows by construction. Layered Shade's interface is that plate: a cool drafting-film ground, graphite ink, hairline rules, and one blue pencil line that carries the shell, the selection, focus, the dimension lines and the copy action. The box in the middle is drawn at 1:1, and when Cotas is on, the selected shadow layer is measured on the plate rather than guessed: its x and y offsets, the outline its spread produces, how far its blur reaches, and the light ray that would cast it.

The tool is dense and quiet because it is used beside a code editor. Three working columns share one screen (controls, plate, code), every value is editable as a number and as a slider, and the code column is a dark graphite sheet that shows character for character what the copy button puts on the clipboard. Depth comes from tone and 1px rules, never from floating panels; the only real shadow on screen is the one the person is building.

The redesign replaced a glassmorphism look with blurred blobs and translucent cards. That look is the anti-reference: the tool's own chrome is opaque, ruled and flat.

**Key Characteristics:**
- Drafting-film neutrals (cool blue-grey) with graphite ink and a single committed blue, blueline.
- Red pencil appears only where something is limited or failed.
- Overpass for every UI word; Overpass Mono, tabular and ligature-free, for every code character and measured number.
- Flat tonal layering: film, raised film, paper, plus a graphite code sheet, divided by 1px hairlines.
- Small, consistent corners (4px) and a 4px spacing base.
- One signature motion: dimension lines draw in when the selected layer changes.

## Colors

Cool drafting-film neutrals inked in graphite, one committed blue for everything the person acts on or is told to look at, and a red pencil held back for limits.

### Primary
- **Blueline** (#2747c9): the committed field. Fills the top bar and the copy button, colors the selected segmented tab's label, the active layer's index chip, focus outlines, text selection, the caret, native range/checkbox accents (`accent-color`) and the dimension lines on a light plate. Also the PWA `theme_color` and the app icon ground.
- **Blueline Deep** (#1c3599): hover state of the copy button and the active layer's name. The shadow square in the favicon and app icon.
- **Blueline Night** (#142a7a): the shadow square of the brand mark inside the top bar, dark enough to read against the bar.
- **Blueline Tint** (#e1e7fa): background of the active layer row.
- **Blueline Ring** (rgba(39, 71, 201, 0.22)): the 3px halo around a focused number or hex field.
- **On Blueline** (#ffffff) and **On Blueline Soft** (#d5dcf7): primary and secondary text on the blue top bar (name and links; tagline and author credit).

### Secondary
- **Red Pencil** (#b3311e): on light film, the hover color of a remove (×) button.
- **Red Pencil on Sheet** (#f2a493): on the code sheet, the text and tinted border of platform-limit notes (Flutter has no inset; `BoxDecoration` takes one gradient) and the failed-copy message.

### Neutral
- **Drafting Film** (#e9eef0): the page ground and the default plate color (the canvas the person can recolor).
- **Raised Film** (#f6f8f9): the controls column, the stage bar above the plate and the caption below it.
- **Sunk Film** (#dfe6e9): the recessed track of the Sombra/Fundo switch and the hover wash of icon buttons.
- **Paper** (#ffffff): anything that holds a value: buttons, layer rows, number and hex fields, selects, color wells.
- **Hairline** (#c5ced3): 1px rules between columns, groups and bars; swatch outlines; the quiet button's border.
- **Strong Hairline** (#78858d): button and color-well borders, the layer index box, the dashed empty-state border, scrollbars on film.
- **Graphite** (#23272b): body text and headings.
- **Graphite Soft** (#4a535a): secondary text: bar labels, units, readouts, layer specs, unselected tabs, icon buttons at rest.
- **Graphite Sheet** (#1f2327), **Sheet Rule** (#353b41), **Sheet Ink** (#e4e9ec), **Sheet Ink Soft** (#a3aeb5): the code column. Ink for code and the selected tab, soft ink for idle tabs and the copy status, rules between head, body and foot.
- **Sheet Blueline** (#8fa3ff): blueline translated to the dark sheet: the selected export tab's underline, focus outlines and text selection inside the code.
- **Current Line** (rgba(39, 71, 201, 0.6)): highlights the CSS line of the selected shadow layer when there is more than one.

### Plate inks
- **Guide ink**: dimension lines, labels and grid stay Blueline while it reaches 3:1 against the plate color; otherwise they switch to graphite (#16181d) or film (#f6f8f9), whichever contrasts more (`guideInk`). Mid-tone plates such as teal take graphite.
- **Grid Minor / Grid Major** (rgba(39, 71, 201, 0.07) / rgba(39, 71, 201, 0.15)): the 8px and 40px grid, the guide ink at 7% and 15%.

### Named Rules
**The Blueline Rule.** Blueline is the committed field: the top bar, selection, focus, the dimension lines and the copy action. Nothing decorative is ever blue.

**The Red Pencil Rule.** Red marks a limit or a failure: platform-limit notes, a failed copy, a remove action under the pointer. Never emphasis, never decoration.

**The Content Owns Color Rule.** The person's colors live on the plate and in swatches. The chrome stays film, graphite and blueline whatever the person picks.

## Typography

**Display Font:** none; the tool has no display voice.
**Body Font:** Overpass (with system-ui, -apple-system, Segoe UI, sans-serif)
**Label/Mono Font:** Overpass Mono (with ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)

**Character:** Overpass is a highway-signage grotesque: legible at 13–14px, a touch technical without costume. Its mono sibling shares the skeleton, so code and measurements sit beside labels as one hand. Both are self-hosted variable fonts (latin and latin-ext subsets, `font-display: swap`, the latin Overpass file preloaded).

### Hierarchy
- **Headline** (700, 1.125rem, 1.2, -0.01em): the product name in the top bar. The largest type in the tool.
- **Title** (700, 0.875rem, 1.2): section headings: "Camadas de sombra", "Camada 1", "Forma", "Código gerado". Same size as body, separated by weight.
- **Subtitle** (700, 0.8125rem, 1.2): the gradient stops heading ("Cores").
- **Body** (400, 0.875rem, 1.45): base text; segmented tabs use it at 600.
- **Label** (600, 0.8125rem): buttons, export tabs, layer names.
- **Field Label** (500, 0.8125rem): the label above or beside every control.
- **Caption** (400, 0.8125rem): tagline, bar labels, the stage caption, platform notes.
- **Code** (Overpass Mono 400, 0.8125rem, 1.75): the exported code. Wrapped lines hang 4ch under the value.
- **Readout** (Overpass Mono 400, 0.75rem): units, slider readouts, the layer spec line ("5 5 10 3 · 20%"), layer index digits (at 600).
- **Dimension** (Overpass Mono 600, 13px): labels on the plate ("x 5", "y 5", "luz 45°", "R 12"), with a 3px halo in the plate color so they read over the grid.

### Named Rules
**The Measured Figure Rule.** Any number the person reads as a value (code, px, %, layer specs, dimension labels) is Overpass Mono with tabular figures and ligatures off. Words are Overpass.

**The Weight-Not-Size Rule.** Hierarchy inside the columns comes from weight (400/500/600/700) at 12–14px, not from bigger type. Only the product name reaches 18px.

## Layout

A full-height application frame: a 56px blueline top bar over a three-column workspace that fills the rest of the viewport (`100dvh` minus the bar). Each column scrolls on its own.

- **Controls** (300–340px, left): Raised Film, 16px top and 20px side padding, hairline on its right edge. A Sombra/Fundo switch, then groups separated by a hairline and 20px. "Resetar tudo" sits at the bottom.
- **Stage** (flexible, centre, widest): a stage bar (presets "Começar de", plate color, Cotas toggle), the plate with 24px padding and the 200px box centred, and a caption bar (layer n of m, scale 1:1, line legend). The grid is centred so the box edges land on major lines.
- **Code** (340–400px, right): Graphite Sheet in three rows: head (title + format select), scrolling code body, and a foot with notes and the full-width copy button. The foot never scrolls, so the copy button is in view at 1440×900.

Responsive behavior:
- **≤1199px:** two columns. Controls span the left; the stage (min 560px tall) sits over the code on the right; the page scrolls instead of the columns.
- **≤759px:** one column. The stage comes first and sticks to the top at `clamp(380px, 52dvh, 460px)` while controls and code scroll under it. The top bar wraps and hides the tagline and the link labels (icons stay, with accessible names). Side padding drops to 16px.

Spacing runs on a 4px base: 4–8px inside a control, 12–16px between fields, 20px between groups and as column padding, 24px around the plate.

### Named Rules
**The Copy In View Rule.** The copy action is pinned at the foot of the code column; on desktop it is always visible without scrolling.

## Elevation & Depth

Flat by construction. Depth is tonal: Drafting Film is the ground, Raised Film carries panels and bars, Paper carries anything that holds a value, Sunk Film marks recesses, and the code column is a separate dark sheet. Regions and groups are divided by 1px hairlines, never lifted. The shadow on the box is the person's content and is not part of this vocabulary.

### Shadow Vocabulary
- **Tab lift** (`box-shadow: 0 0 0 1px var(--rule), 0 1px 2px rgba(35, 39, 43, 0.12)`): the selected tab of the Sombra/Fundo switch, raised one step out of its sunk track.
- **Field halo** (`box-shadow: 0 0 0 3px var(--blueline-ring)`): focus on number and hex fields, alongside a blueline border.

### Named Rules
**The Flat Film Rule.** Panels never float. If a surface needs separation, change its tone or draw a hairline; the only chrome shadows are the tab lift and the focus halo.

## Shapes

Small, even corners: 4px on every control and container, 3px for anything nested inside one (segmented tabs, the layer index chip), 2px for color swatches and the inner well of a color input. The person's box is the only element that gets a large radius. Strokes are 1px; dashed strokes mean "extent, not edge" (the blur-reach outline on the plate, dash 4/3, and the empty-state box). Grouped buttons (the preset row) join with shared 1px borders and round only their outer corners. Icons are drawn on a 24px grid with a 1.75 stroke, round caps and joins, rendered at 16px; the brand mark is two offset squares, a box and its shadow.

## Components

### Buttons
Plain, ruled and quick; the copy button is the only filled one.
- **Shape:** gently squared (4px radius), 32px tall, 12px side padding, 6px gap to a 16px icon.
- **Default:** Paper fill, Strong Hairline border, Graphite label; hover darkens the border to Graphite Soft; press nudges it down 1px.
- **Quiet:** transparent with a Hairline border; hover fills with Paper. Used for "Adicionar", "Cor", the presets and "Resetar tudo".
- **Primary (copy):** Blueline fill and border, On Blueline label at 0.875rem, 44px tall, full column width; hover goes Blueline Deep. Its label names the format ("Copiar CSS") and turns to "Copiado" with a check for 2s; a live status line below confirms or, in red pencil, explains a failure and the manual fallback.
- **Icon button (remove):** 32px square, transparent, Graphite Soft ×; hover washes Sunk Film and turns the × red pencil. Disabled at 35% opacity with a title explaining why (the last layer, the last two gradient stops).
- **Disabled:** 45% opacity, not-allowed cursor.

### Panel switch (Sombra / Fundo)
- **Style:** a Sunk Film track (3px padding, 2px gap, Hairline border, 4px radius) holding two 32px tabs.
- **States:** idle tabs are transparent Graphite Soft at 600; the selected tab is Paper with a Blueline label and the tab lift. Arrow keys move between tabs (ARIA tablist).

### Layer rows
- **Style:** Paper rows (4px radius, Hairline border, 48px minimum) listed with 4px gaps: an index chip (22px, 3px radius, mono digits), the name, a mono spec line of the layer's values and a swatch of its color; a remove button closes the row.
- **Active:** Blueline border, Blueline Tint fill, Blueline Deep name, index chip filled Blueline. Hover on an idle row strengthens its border.
- **Focus:** the 2px Blueline outline wraps the whole row, remove button included.
- **Gradient rows** reuse the pattern with a 56×14px gradient swatch instead of the spec line.
- **Empty:** a dashed Strong Hairline box with a sentence that says what to do.

### Inputs / Fields
- **Number field + slider:** every numeric control is a label and a right-aligned mono number field (52px, unit suffix in Readout) above a full-width native range slider tinted Blueline. Both edit the same value; out-of-range input is clamped.
- **Hex field:** an 84px mono field, uppercase, committed on blur or Enter, beside a 32px color well (Strong Hairline border, 3px inner padding, 2px inner radius).
- **Select and checkbox:** native controls, 32px selects on Paper; checkboxes 16px with the Blueline accent.
- **Style:** Paper fill, 1px outline, 4px radius; hover strengthens the outline to Strong Hairline.
- **Field outlines use Strong Rule** (#78858d), at least 3:1 against Paper, Raised Film and Film, the minimum for a field boundary (WCAG 1.4.11). Hairline is for dividers only, never for a field edge.
- **Focus:** border turns Blueline with the 3px field halo; every other control gets a 2px Blueline outline at 2px offset (On Blueline in the top bar, Sheet Blueline on the code sheet).

### Navigation (top bar)
- **Style:** a 56px Blueline bar: brand mark, the name in Headline, a Caption tagline after a translucent white hairline; on the right the author credit and GitHub/LinkedIn links with 18px icons, underlined on hover.
- **Mobile:** wraps; the tagline and link labels hide.

### Code sheet
- **Style:** Graphite Sheet with Sheet Ink code at 0.8125rem/1.75; head, body and foot divided by Sheet Rule.
- **Format select:** a native `<select>` labelled Formato, grouped by optgroup (Web, Mobile, Python), on Graphite Sheet with a Sheet Rule border and Sheet Ink label text (`color-scheme: dark`); the per-format variant switch sits above the code.
- **Current line:** in CSS, the selected layer's line is washed in Current Line when the shadow has more than one layer.
- **Platform note:** shown in place above the copy button only when it applies: Red Pencil on Sheet text in a box with a 1px border of the same red at 40% and a 7% wash, 4px radius, 12px padding; the install command is selectable in one click.

### Stage plate (signature)
The drafting plate. The 200px box renders at 1:1 on the person's plate color, over an 8px/40px Blueline grid when Cotas is on. Dimension lines in the guide ink (Blueline unless the plate color drops it under 3:1) measure the selected layer: x and y offsets with ticks (or arrows from outside when the span is under 28px) and extension stubs, a solid outline of the spread, a dashed outline of the blur reach, a light ray with arrowhead and angle from the opposite corner, and an R callout on the free corner when the box is rounded. Lines sit on the side the shadow falls toward and stay inside the stage. When another layer is selected, lines draw in and labels fade in once (260ms, the expo ease-out); never on page load. A legend in the caption bar keys the solid and dashed lines to their values.

### Motion
State changes (color, border, background, the skip link) run 160ms on `cubic-bezier(0.16, 1, 0.3, 1)`. The dimension draw-in is the one authored moment. Under `prefers-reduced-motion` every animation and transition collapses to an instant change.

## Do's and Don'ts

### Do:
- **Do** keep Blueline (#2747c9) to the shell, selection, focus, the dimension lines and the copy action; everything else is Graphite on film.
- **Do** set every value a person reads as a number in Overpass Mono with tabular figures and ligatures off.
- **Do** separate regions and groups with 1px Hairline rules and spacing (20px between groups), not boxes.
- **Do** state platform limits in place, in red pencil on the code sheet, next to the export they affect and only while they apply.
- **Do** theme the browser's own surfaces: selection and caret in Blueline, `accent-color` Blueline, scrollbar thumbs in Strong Hairline (Sheet Rule on the code sheet).
- **Do** give every control a visible focus: 2px Blueline outline at 2px offset, On Blueline in the top bar, Sheet Blueline on the code sheet, the 3px halo on text fields.
- **Do** keep state transitions at 160ms on the expo ease-out and keep the draw-in as the only authored animation.
- **Do** keep the plate at 1:1 with the grid aligned so the box edges land on 40px lines.

### Don't:
- **Don't** use glass, backdrop blur, blurred blobs or translucent floating panels in the tool's chrome; "Glass" is a preset the person builds, not a style for the interface.
- **Don't** lift panels with drop shadows; depth is tone and hairlines, and the only chrome shadows are the tab lift and the field focus halo.
- **Don't** use red pencil for emphasis, branding or decoration.
- **Don't** add accent colors beyond Blueline and red pencil, or tint the chrome with the person's colors.
- **Don't** round controls past 4px; large radii belong to the person's box.
- **Don't** set headings, labels or prose in Overpass Mono; mono is for code and measurements.
- **Don't** use glyphs or emoji as icons; draw them on the 24px, 1.75-stroke set.
