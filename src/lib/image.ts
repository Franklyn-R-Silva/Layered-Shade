/**
 * image.ts
 * Image mode (#75): the shadow layers as a CSS `drop-shadow()` chain, which follows the image's
 * alpha outline instead of its box. Pure (no DOM, no Svelte). `drop-shadow()` has no spread and
 * no inset, so inset layers and spread are left out, and every export says so in a comment.
 */
import type { ShadowLayer, ShadowState } from './types';
import { hexToColorObj, hexToRgba, toTailwindArbitrary, visibleLayers } from './shadow';

/** Layers a drop shadow can draw: visible and not inset. */
const dropLayers = (state: ShadowState) => visibleLayers(state).filter((l) => !l.inset);
const dropShadow = (l: ShadowLayer) =>
  `drop-shadow(${l.horizontal}px ${l.vertical}px ${l.blur}px ${hexToRgba(l.color, l.opacity)})`;

/** Comment line saying what was left out (inset layers, spread); empty when nothing is. */
function droppedNote(state: ShadowState, open = '//', close = ''): string {
  const v = visibleLayers(state);
  const parts: string[] = [];
  if (v.some((l) => l.inset)) parts.push('inset layers ignored');
  if (v.some((l) => !l.inset && l.spread !== 0)) parts.push('spread ignored');
  return parts.length ? `${open} drop-shadow has no inset or spread: ${parts.join(', ')}.${close}\n` : '';
}

/**
 * CSS `filter` value: one `drop-shadow()` per visible, non-inset layer, in layer order
 * (each one also shadows the ones before it); `none` when there is none.
 */
export function getDropShadowFilter(state: ShadowState): string {
  const layers = dropLayers(state);
  return layers.length ? layers.map(dropShadow).join(' ') : 'none';
}

/** CSS `filter` declaration for the image, one drop shadow per indented line. */
export function getImageCSS(state: ShadowState): string {
  const layers = dropLayers(state);
  const value = layers.length ? `\n${layers.map((l) => `  ${dropShadow(l)}`).join('\n')};` : ' none;';
  return `${droppedNote(state, '/*', ' */')}filter:${value}`;
}

/**
 * Tailwind v4.1 class: one `drop-shadow-[…]` with the layers comma-separated, which Tailwind turns
 * into a `drop-shadow()` chain (one class per layer would not stack: each sets the same variable).
 */
export function getImageTailwind(state: ShadowState): string {
  const layers = dropLayers(state);
  if (!layers.length) return 'drop-shadow-none';
  const value = layers.map((l) => `${l.horizontal}px ${l.vertical}px ${l.blur}px ${hexToRgba(l.color, l.opacity)}`);
  return `drop-shadow-[${toTailwindArbitrary(value.join(', '))}]`;
}

// Same as shadow.ts's private helper (kept local so this module does not touch shadow.ts).
const swiftColor = (hex: string, opacity: number) => {
  const c = hexToColorObj(hex).hex;
  const [r, g, b] = [0, 2, 4].map((i) => +(parseInt(c.slice(i, i + 2), 16) / 255).toFixed(3));
  return `Color(red: ${r}, green: ${g}, blue: ${b}, opacity: ${+opacity.toFixed(3)})`;
};

/** SwiftUI `Image` with one `.shadow` per layer: SwiftUI shadows follow the image's alpha (radius = blur / 2). */
export function getImageSwiftUI(state: ShadowState): string {
  const shadows = dropLayers(state)
    .map(
      (l) =>
        `\n    .shadow(color: ${swiftColor(l.color, l.opacity)}, radius: ${+(l.blur / 2).toFixed(1)}, x: ${l.horizontal}, y: ${l.vertical})`,
    )
    .join('');
  return (
    '// SwiftUI: .shadow follows the image alpha; radius = CSS blur / 2; each stacked .shadow also shadows the ones before it.\n' +
    droppedNote(state) +
    `Image("image") // your asset name\n    .resizable()\n    .scaledToFit()${shadows}`
  );
}

/** Targets whose shadow APIs cannot follow an image's transparent outline. */
export type ImageNoteTarget = 'dart' | 'compose' | 'rn';

const IMAGE_NOTES: Record<ImageNoteTarget, string> = {
  dart:
    "// Flutter: BoxShadow is drawn around the widget's box, not the image's transparent outline.\n" +
    '// Bake the shadow into the PNG, or stack a blurred, tinted copy under the image\n' +
    '// (Transform.translate + ImageFiltered(ImageFilter.blur) + ColorFiltered(BlendMode.srcIn),\n' +
    '// what the simple_shadow package does).',
  compose:
    '// Jetpack Compose: Modifier.dropShadow / shadow follow the shape you pass, not the image alpha.\n' +
    '// Pass a Shape that matches the outline, or bake the shadow into the image.',
  rn:
    "// React Native: boxShadow is drawn around the view's border box, not the image alpha.\n" +
    "// filter: 'drop-shadow(…)' follows the alpha but works on Android 12+ only; elsewhere bake the shadow into the image.",
};

/** English comment explaining why `target` has no image drop shadow, and what to do instead. */
export function getImageNote(target: ImageNoteTarget): string {
  return IMAGE_NOTES[target];
}
