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
    backgroundColor: '#ffdd00',
    canvasColor: '#ffffff',
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
  if (state.currentLayerIndex >= state.layers.length) {
    state.currentLayerIndex = state.layers.length - 1;
  }
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
  return state.layers
    .map((layer) => {
      const insetValue = layer.inset ? 'inset' : '';
      const color = hexToRgba(layer.color, layer.opacity);
      return `${layer.horizontal}px ${layer.vertical}px ${layer.blur}px ${layer.spread}px ${color} ${insetValue}`.trim();
    })
    .join(', ');
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
  let code = '';

  if (borderRadius > 0 || state.backgroundLayers.length > 0 || state.boxProperties.backgroundColor) {
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

  for (const layer of state.layers) {
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
  if (borderRadius > 0 || state.backgroundLayers.length > 0) {
    code += `)`;
  }
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
