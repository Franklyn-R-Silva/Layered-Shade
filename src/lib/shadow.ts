/**
 * shadow.ts
 * Pure state factory, mutations and code generation for the box-shadow generator.
 * No framework dependency — fully unit-testable. The reactive layer
 * (`state.svelte.ts`) wraps these with Svelte runes.
 */
import type {
  BackgroundLayer,
  BoxProperties,
  ShadowLayer,
  ShadowState,
} from './types';

/** Template for a new shadow layer. */
export const DEFAULT_LAYER: ShadowLayer = {
  horizontal: 5,
  vertical: 5,
  blur: 10,
  spread: 3,
  color: '#000000',
  opacity: 0.5,
  inset: false,
};

/** Default global box properties. */
export function defaultBoxProperties(): BoxProperties {
  return {
    borderRadius: 0,
    backgroundColor: '#ffffff',
    canvasColor: '#e9eef0',
  };
}

/** Creates a fresh state with one shadow layer and no background gradients. */
export function createInitialState(): ShadowState {
  return {
    layers: [{ ...DEFAULT_LAYER, opacity: 0.2 }],
    currentLayerIndex: 0,
    backgroundLayers: [],
    currentBgLayerIndex: -1,
    boxProperties: defaultBoxProperties(),
  };
}

const BOX_KEYS = ['borderRadius', 'backgroundColor', 'canvasColor'] as const;

/**
 * Updates a property on the current layer, the active background layer
 * (keys prefixed with `bgLayer`), or global box properties.
 */
export function update(state: ShadowState, key: string, value: unknown): void {
  if ((BOX_KEYS as readonly string[]).includes(key)) {
    (state.boxProperties as unknown as Record<string, unknown>)[key] = value;
    return;
  }

  if (key.startsWith('bgLayer')) {
    const layer = state.backgroundLayers[state.currentBgLayerIndex];
    if (state.currentBgLayerIndex >= 0 && layer) {
      const param = key.replace('bgLayer', '');
      const prop = param.charAt(0).toLowerCase() + param.slice(1);
      (layer as unknown as Record<string, unknown>)[prop] = value;
    }
    return;
  }

  const current = state.layers[state.currentLayerIndex];
  if (current) {
    (current as unknown as Record<string, unknown>)[key] = value;
  }
}

/** Resets the state to defaults (keeps the same object identity if given one). */
export function reset(state: ShadowState): void {
  state.layers = [{ ...DEFAULT_LAYER, opacity: 0.2 }];
  state.currentLayerIndex = 0;
  state.backgroundLayers = [];
  state.currentBgLayerIndex = -1;
  state.boxProperties = defaultBoxProperties();
}

export function addLayer(state: ShadowState): void {
  state.layers.push({ ...DEFAULT_LAYER });
  state.currentLayerIndex = state.layers.length - 1;
}

export function removeLayer(state: ShadowState, index: number): void {
  if (state.layers.length <= 1) return;
  state.layers.splice(index, 1);
  // Keep the same layer selected when one before it is removed.
  if (index < state.currentLayerIndex) state.currentLayerIndex--;
  if (state.currentLayerIndex >= state.layers.length) {
    state.currentLayerIndex = state.layers.length - 1;
  }
}

/** Inserts a copy of a layer right after it and selects the copy. */
export function duplicateLayer(state: ShadowState, index: number): void {
  const layer = state.layers[index];
  if (!layer) return;
  state.layers.splice(index + 1, 0, { ...layer });
  state.currentLayerIndex = index + 1;
}

/** Moves a layer one step (−1 = up / towards the top of the CSS list); the selection follows it. */
export function moveLayer(state: ShadowState, index: number, step: -1 | 1): void {
  const to = index + step;
  if (!state.layers[index] || to < 0 || to >= state.layers.length) return;
  const [layer] = state.layers.splice(index, 1);
  state.layers.splice(to, 0, layer);
  if (state.currentLayerIndex === index) state.currentLayerIndex = to;
  else if (state.currentLayerIndex === to) state.currentLayerIndex = index;
}

/** Shows or hides a layer without deleting it. */
export function setLayerHidden(state: ShadowState, index: number, hidden: boolean): void {
  if (state.layers[index]) state.layers[index].hidden = hidden;
}

/**
 * "Smooth shadow": `count` layers whose offset and blur double from the closest to the farthest
 * (…, distance/4, distance/2, distance), each with an equal share of `intensity`. Stacking them
 * gives the soft falloff a single shadow cannot. Light from above: offsets are vertical.
 */
export function smoothLayers(opts: { count: number; distance: number; intensity: number; color: string }): ShadowLayer[] {
  const count = Math.min(8, Math.max(2, Math.round(opts.count)));
  const alpha = Math.round((Math.min(100, Math.max(0, opts.intensity)) / 100 / count) * 1000) / 1000;
  return Array.from({ length: count }, (_, i) => {
    const d = Math.max(1, Math.round(opts.distance * 2 ** (i + 1 - count)));
    return { horizontal: 0, vertical: d, blur: d, spread: 0, color: opts.color, opacity: alpha, inset: false };
  });
}

/** Replaces the shadow layers (e.g. from an import or the smooth generator) and selects the first. */
export function setLayers(state: ShadowState, layers: ShadowLayer[]): void {
  if (!layers.length) return;
  state.layers = layers;
  state.currentLayerIndex = 0;
}

export function selectLayer(state: ShadowState, index: number): void {
  if (index >= 0 && index < state.layers.length) {
    state.currentLayerIndex = index;
  }
}

/* ---- Background layer management ---- */

export function addBackgroundLayer(
  state: ShadowState,
  type: 'linear' | 'radial' = 'linear',
): void {
  state.backgroundLayers.push({
    type,
    angle: 90,
    shape: 'circle',
    stops: [
      { color: '#ffffff', position: 0 },
      { color: '#000000', position: 100 },
    ],
    opacity: 1,
  });
  state.currentBgLayerIndex = state.backgroundLayers.length - 1;
}

export function removeBackgroundLayer(state: ShadowState, index: number): void {
  state.backgroundLayers.splice(index, 1);
  state.currentBgLayerIndex = state.backgroundLayers.length > 0 ? 0 : -1;
}

export function selectBackgroundLayer(state: ShadowState, index: number): void {
  state.currentBgLayerIndex = index;
}

/* ---- Code generation ---- */

function stopsToString(layer: BackgroundLayer): string {
  return [...layer.stops]
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');
}

/** CSS for a single gradient layer. */
export function getBackgroundCSSForLayer(layer: BackgroundLayer): string {
  const stopsStr = stopsToString(layer);

  if (layer.type === 'radial') {
    const posX = layer.posX !== undefined ? layer.posX : 50;
    const posY = layer.posY !== undefined ? layer.posY : 50;
    const size = layer.size || 'farthest-corner';
    if (size === 'farthest-corner') {
      return `radial-gradient(${layer.shape || 'circle'} at ${posX}% ${posY}%, ${stopsStr})`;
    }
    return `radial-gradient(${layer.shape || 'circle'} ${size} at ${posX}% ${posY}%, ${stopsStr})`;
  }
  return `linear-gradient(${layer.angle}deg, ${stopsStr})`;
}

/** Background CSS value (all gradient layers + base color). */
export function getBackgroundCSS(state: ShadowState): string {
  const layersCSS = state.backgroundLayers.map(getBackgroundCSSForLayer);
  if (layersCSS.length > 0) {
    return `${layersCSS.join(', ')}, ${state.boxProperties.backgroundColor}`;
  }
  return state.boxProperties.backgroundColor;
}

/** The `box-shadow` string for all layers. */
export function getCSS(state: ShadowState): string {
  const visible = visibleLayers(state);
  return visible.length ? visible.map(getLayerCSS).join(', ') : 'none';
}

/** Layers that are drawn and exported (hidden ones are skipped). */
export function visibleLayers(state: ShadowState): ShadowLayer[] {
  return state.layers.filter((l) => !l.hidden);
}

/** CSS `box-shadow` value for one layer. */
export function getLayerCSS(layer: ShadowLayer): string {
  const insetValue = layer.inset ? 'inset' : '';
  const color = hexToRgba(layer.color, layer.opacity);
  return `${layer.horizontal}px ${layer.vertical}px ${layer.blur}px ${layer.spread}px ${color} ${insetValue}`.trim();
}

/** Flutter gradient code for a single layer. */
export function getLayerDart(layer: BackgroundLayer): string {
  const sortedStops = [...layer.stops].sort((a, b) => a.position - b.position);
  const colors = sortedStops
    .map((s) => {
      const c = hexToColorObj(s.color.startsWith('#') ? s.color : rgbaToHex(s.color));
      return `Color(0xFF${c.hex})`;
    })
    .join(',\n      ');
  const stops = sortedStops.map((s) => (s.position / 100).toFixed(2)).join(', ');

  let code = '';
  if (layer.type === 'radial') {
    const posX = ((layer.posX !== undefined ? layer.posX : 50) / 100) * 2 - 1;
    const posY = ((layer.posY !== undefined ? layer.posY : 50) / 100) * 2 - 1;
    code += `RadialGradient(\n`;
    code += `    center: Alignment(${posX.toFixed(2)}, ${posY.toFixed(2)}),\n`;
    code += `    radius: 0.5,\n`;
    code += `    colors: [\n      ${colors}\n    ],\n`;
    code += `    stops: [${stops}],\n`;
    code += `  )`;
  } else {
    code += `LinearGradient(\n`;
    code += `    begin: Alignment.topLeft,\n`;
    code += `    end: Alignment.bottomRight,\n`;
    code += `    transform: GradientRotation(${((layer.angle * Math.PI) / 180).toFixed(3)}),\n`;
    code += `    colors: [\n      ${colors}\n    ],\n`;
    code += `    stops: [${stops}],\n`;
    code += `  )`;
  }
  return code;
}

/** Flutter `BoxShadow`/`BoxDecoration` code. */
export function getDart(state: ShadowState): string {
  const { borderRadius } = state.boxProperties;
  const hasDecoration =
    borderRadius > 0 || state.backgroundLayers.length > 0 || !!state.boxProperties.backgroundColor;
  let code = '';

  if (hasDecoration) {
    code += `// Container decoration\n`;
    code += `decoration: BoxDecoration(\n`;
    if (borderRadius > 0) code += `  borderRadius: BorderRadius.circular(${borderRadius}),\n`;

    if (state.backgroundLayers.length > 0) {
      // In CSS `background: gradientA, gradientB`, the first layer is on top.
      // BoxDecoration accepts only one gradient, so we export the top (first) layer.
      code += `  gradient: ${getLayerDart(state.backgroundLayers[0])},\n`;
    } else {
      const bg = hexToColorObj(state.boxProperties.backgroundColor);
      code += `  color: Color(0xFF${bg.hex}),\n`;
    }
    code += `  boxShadow: [\n`;
  } else {
    code += `boxShadow: [\n`;
  }

  for (const layer of visibleLayers(state)) {
    const { horizontal, vertical, blur, spread, color, opacity, inset } = layer;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    code += `    BoxShadow(\n`;
    code += `      color: Color.fromRGBO(${r}, ${g}, ${b}, ${opacity}),\n`;
    code += `      offset: Offset(${horizontal}, ${vertical}),\n`;
    code += `      blurRadius: ${blur},\n`;
    code += `      spreadRadius: ${spread},\n`;
    if (inset) {
      code += `      // inset: true, // Requires flutter_inset_box_shadow\n`;
    }
    code += `    ),\n`;
  }

  code += `  ],\n`;
  if (hasDecoration) {
    code += `)`;
  }
  return code;
}

/* ---- More export targets ---- */

/** CSS with the shadow stored in a custom property, ready for a design-token file. */
export function getCSSVariable(state: ShadowState): string {
  const radius = state.boxProperties.borderRadius;
  return (
    `:root {\n  --shadow-layered: ${getCSS(state)};\n}\n\n.elemento {\n  box-shadow: var(--shadow-layered);\n` +
    `  background: ${getBackgroundCSS(state)};\n` +
    (radius > 0 ? `  border-radius: ${radius}px;\n` : '') +
    `}`
  );
}

/** Tailwind v4 theme token: `--shadow-*` becomes a `shadow-*` utility. */
export function getTailwindTheme(state: ShadowState): string {
  return `@theme {\n  --shadow-layered: ${getCSS(state)};\n}\n\n/* uso: class="shadow-layered" */`;
}

const argb = (hex: string, opacity: number) =>
  Math.round(Math.min(1, Math.max(0, opacity)) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase() + hexToColorObj(hex).hex;
const dp = (n: number) => (n < 0 ? `(${n}).dp` : `${n}.dp`);

/** Jetpack Compose (1.9+): `Modifier.dropShadow` / `innerShadow`; inner shadows go after the background. */
export function getCompose(state: ShadowState): string {
  const { borderRadius: r, backgroundColor } = state.boxProperties;
  const shape = r > 0 ? `RoundedCornerShape(${r}.dp)` : 'RectangleShape';
  const shadow = (l: ShadowLayer, kind: 'dropShadow' | 'innerShadow') =>
    `    .${kind}(\n        shape = ${shape},\n        shadow = Shadow(\n` +
    `            radius = ${dp(l.blur)},\n            spread = ${dp(l.spread)},\n` +
    `            color = Color(0x${argb(l.color, l.opacity)}),\n` +
    `            offset = DpOffset(x = ${dp(l.horizontal)}, y = ${dp(l.vertical)})\n        )\n    )\n`;
  const layers = visibleLayers(state);
  let code = '// Jetpack Compose 1.9+ (Modifier.dropShadow / innerShadow)\nModifier\n';
  code += layers.filter((l) => !l.inset).map((l) => shadow(l, 'dropShadow')).join('');
  code += `    .background(color = Color(0xFF${hexToColorObj(backgroundColor).hex}), shape = ${shape})\n`;
  code += layers.filter((l) => l.inset).map((l) => shadow(l, 'innerShadow')).join('');
  if (state.backgroundLayers.length) code += '// Gradientes não exportados: use Brush.linearGradient / radialGradient no background.\n';
  return code.trimEnd();
}

const swiftColor = (hex: string, opacity: number) => {
  const c = hexToColorObj(hex).hex;
  const [r, g, b] = [0, 2, 4].map((i) => +(parseInt(c.slice(i, i + 2), 16) / 255).toFixed(3));
  return `Color(red: ${r}, green: ${g}, blue: ${b}, opacity: ${+opacity.toFixed(3)})`;
};

/**
 * SwiftUI: one shape per drop shadow in a background ZStack (stacked `.shadow` modifiers would
 * shadow each other), inner shadows as `ShapeStyle.shadow(.inner)` (iOS 16+). SwiftUI's radius is
 * about half the CSS blur, and SwiftUI has no spread.
 */
export function getSwiftUI(state: ShadowState): string {
  const { borderRadius: r, backgroundColor } = state.boxProperties;
  const shape = r > 0 ? `RoundedRectangle(cornerRadius: ${r})` : 'Rectangle()';
  const fill = swiftColor(backgroundColor, 1);
  const layers = visibleLayers(state);
  const radius = (l: ShadowLayer) => +(l.blur / 2).toFixed(1);
  const inner = layers
    .filter((l) => l.inset)
    .map((l) => `\n        .shadow(.inner(color: ${swiftColor(l.color, l.opacity)}, radius: ${radius(l)}, x: ${l.horizontal}, y: ${l.vertical}))`)
    .join('');
  let code = '// SwiftUI: radius = blur CSS / 2; spread não existe no SwiftUI.\n';
  code += `${shape}\n    .fill(${fill}${inner})\n`;
  const drops = layers.filter((l) => !l.inset);
  if (drops.length) {
    code += '    .background {\n        ZStack {\n';
    code += drops
      .map((l) => `            ${shape}\n                .fill(${fill})\n                .shadow(color: ${swiftColor(l.color, l.opacity)}, radius: ${radius(l)}, x: ${l.horizontal}, y: ${l.vertical})\n`)
      .join('');
    code += '        }\n    }\n';
  }
  if (state.backgroundLayers.length) code += '// Gradientes não exportados: use LinearGradient / RadialGradient no fill.\n';
  return code.trimEnd();
}

/** React Native 0.76+ (New Architecture): `boxShadow` takes the CSS syntax, inset and spread included. */
export function getReactNative(state: ShadowState): string {
  const r = state.boxProperties.borderRadius;
  let code = '// React Native 0.76+ (New Architecture)\nconst styles = StyleSheet.create({\n  box: {\n';
  code += `    boxShadow: '${getCSS(state)}',\n`;
  if (r > 0) code += `    borderRadius: ${r},\n`;
  code += `    backgroundColor: '${state.boxProperties.backgroundColor}',\n  },\n});`;
  if (state.backgroundLayers.length) code += '\n// Gradientes não exportados: use experimental_backgroundImage ou react-native-linear-gradient.';
  return code;
}

/** Normalizes a CSS value into a Tailwind arbitrary-value token. */
export function toTailwindArbitrary(value: string): string {
  return value.replace(/,\s+/g, ',').replace(/\s+/g, '_');
}

/** Tailwind arbitrary utility classes: `shadow-[...] bg-[...]`. */
export function getTailwind(state: ShadowState): string {
  const arbitraryShadow = toTailwindArbitrary(getCSS(state));
  const arbitraryBg = toTailwindArbitrary(getBackgroundCSS(state));
  return `shadow-[${arbitraryShadow}] bg-[${arbitraryBg}]`;
}

/** Tailwind class for a single gradient layer. */
export function getLayerTailwind(layer: BackgroundLayer): string {
  return `bg-[${toTailwindArbitrary(getBackgroundCSSForLayer(layer))}]`;
}

/* ---- Presets ---- */

export type PresetName = 'soft' | 'neumorphism' | 'cristal';

/** Applies a named preset, mutating the state. */
export function applyPreset(state: ShadowState, presetName: PresetName): void {
  reset(state);

  if (presetName === 'soft') {
    update(state, 'blur', 10);
    update(state, 'opacity', 0.15);
    update(state, 'vertical', 4);
    update(state, 'canvasColor', '#f3f4f6');
    update(state, 'backgroundColor', '#ffffff');
    state.backgroundLayers = [];
  } else if (presetName === 'neumorphism') {
    update(state, 'horizontal', -5);
    update(state, 'vertical', -5);
    update(state, 'blur', 10);
    update(state, 'color', '#ffffff');
    update(state, 'opacity', 1);
    addLayer(state);
    update(state, 'horizontal', 5);
    update(state, 'vertical', 5);
    update(state, 'blur', 10);
    update(state, 'color', '#bebebe');
    update(state, 'opacity', 1);
    update(state, 'backgroundColor', '#e0e0e0');
    update(state, 'canvasColor', '#e0e0e0');
    state.backgroundLayers = [];
  } else if (presetName === 'cristal') {
    update(state, 'horizontal', 0);
    update(state, 'vertical', 8);
    update(state, 'blur', 32);
    update(state, 'color', '#1f2687');
    update(state, 'opacity', 0.37);
    addLayer(state);
    update(state, 'horizontal', 0);
    update(state, 'vertical', 0);
    update(state, 'blur', 0);
    update(state, 'spread', 1);
    update(state, 'color', '#ffffff');
    update(state, 'opacity', 0.18);
    update(state, 'inset', true);
    update(state, 'backgroundColor', 'rgba(255, 255, 255, 0.15)');
    update(state, 'canvasColor', '#0891b2');
    state.backgroundLayers = [];
  }
}

/* ---- Color helpers ---- */

/** Hex (+ alpha) → `rgba(...)`. */
export function hexToRgba(hex: string, alpha: number): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0,0,0,${alpha})`;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Corner radius of an outer shadow's shape after `spread` (CSS Backgrounds 3, "Shadow shape"):
 * radius + spread, except that a radius smaller than the spread grows by spread·(1 + (r/spread − 1)³),
 * so a square box keeps square shadow corners. Negative spread shrinks it, floored at 0.
 */
export function shadowCornerRadius(radius: number, spread: number): number {
  if (spread <= 0) return Math.max(0, radius + spread);
  if (radius >= spread) return radius + spread;
  return radius + spread * (1 + (radius / spread - 1) ** 3);
}

/** WCAG relative luminance of a hex color (0–1); unparseable input reads as white. */
function luminance(hex: string): number {
  const c = hexToColorObj(hex).hex;
  if (!/^[0-9A-F]{6}$/.test(c)) return 1;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** True when a hex color is dark enough that light ink reads better on it (WCAG relative luminance). */
export function isDarkColor(hex: string): boolean {
  return luminance(hex) < 0.18;
}

/** WCAG 2 contrast ratio between two hex colors, 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Ink for the dimension lines and grid on a plate color: blueline while it reaches 3:1 (WCAG
 * non-text contrast), else graphite or film, whichever contrasts more (one always reaches 4:1).
 */
export function guideInk(canvas: string): string {
  if (contrastRatio('#2747c9', canvas) >= 3) return '#2747c9';
  return contrastRatio('#16181d', canvas) >= contrastRatio('#f6f8f9', canvas) ? '#16181d' : '#f6f8f9';
}

/** Fallback for non-hex colors. TODO: parse rgba() if stops ever store rgba strings. */
export function rgbaToHex(_rgba: string): string {
  return '#000000';
}

/** Normalizes a hex color to a 6-digit uppercase string (no `#`). */
export function hexToColorObj(hex: string): { hex: string } {
  let c = hex.startsWith('#') ? hex.substring(1) : hex;
  if (c.length === 3) {
    c = c
      .split('')
      .map((char) => char + char)
      .join('');
  }
  return { hex: c.toUpperCase() };
}
