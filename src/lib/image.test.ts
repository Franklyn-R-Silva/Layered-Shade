/**
 * image.test.ts
 * Image mode (#75): the layers as a drop-shadow() chain and its exports.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from './shadow';
import { getDropShadowFilter, getImageCSS, getImageTailwind, getImageSwiftUI, getImageNote, getImageMarkup, getImageQt, getImageFlet } from './image';
import type { ShadowLayer, ShadowState } from './types';

const layer = (o: Partial<ShadowLayer>): ShadowLayer => ({
  horizontal: 0,
  vertical: 0,
  blur: 0,
  spread: 0,
  color: '#000000',
  opacity: 1,
  inset: false,
  ...o,
});

describe('image mode exports', () => {
  let s: ShadowState;
  beforeEach(() => {
    s = createInitialState();
    s.layers = [
      layer({ horizontal: 2, vertical: 4, blur: 6, opacity: 0.5 }),
      layer({ horizontal: -1, vertical: 8, blur: 12, color: '#ff0000', opacity: 0.25 }),
    ];
  });

  it('chains one drop-shadow() per layer, in layer order', () => {
    expect(getDropShadowFilter(s)).toBe(
      'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5)) drop-shadow(-1px 8px 12px rgba(255, 0, 0, 0.25))',
    );
    expect(getImageCSS(s)).toBe(
      'filter:\n  drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5))\n  drop-shadow(-1px 8px 12px rgba(255, 0, 0, 0.25));',
    );
  });

  it('drops hidden and inset layers and spread, and says so', () => {
    s.layers.push(layer({ inset: true, blur: 3 }), layer({ hidden: true, blur: 9 }));
    s.layers[0].spread = 5;
    expect(getDropShadowFilter(s)).not.toMatch(/9px|3px/);
    expect(getDropShadowFilter(s).match(/drop-shadow/g)).toHaveLength(2);
    expect(getImageCSS(s)).toMatch(/^\/\* drop-shadow has no inset or spread: inset layers ignored, spread ignored\. \*\/\n/);
    expect(getImageSwiftUI(s)).toContain('// drop-shadow has no inset or spread: inset layers ignored, spread ignored.');
  });

  it('is none when no layer can be drawn', () => {
    s.layers = [layer({ inset: true }), layer({ hidden: true })];
    expect(getDropShadowFilter(s)).toBe('none');
    expect(getImageCSS(s)).toMatch(/filter: none;$/);
    expect(getImageTailwind(s)).toBe('drop-shadow-none');
  });

  it('exports one Tailwind drop-shadow-[…] with the layers comma-separated', () => {
    expect(getImageTailwind(s)).toBe('drop-shadow-[2px_4px_6px_rgba(0,0,0,0.5),-1px_8px_12px_rgba(255,0,0,0.25)]');
  });

  it('exports a SwiftUI Image with one .shadow per layer, radius = blur / 2', () => {
    const code = getImageSwiftUI(s);
    expect(code).toContain('Image("image") // your asset name\n    .resizable()\n    .scaledToFit()');
    expect(code).toContain('.shadow(color: Color(red: 0, green: 0, blue: 0, opacity: 0.5), radius: 3, x: 2, y: 4)');
    expect(code).toContain('.shadow(color: Color(red: 1, green: 0, blue: 0, opacity: 0.25), radius: 6, x: -1, y: 8)');
    expect(code.indexOf('radius: 3')).toBeLessThan(code.indexOf('radius: 6'));
  });

  it('explains why Flutter, Compose and React Native get no image drop shadow', () => {
    for (const target of ['dart', 'compose', 'rn'] as const) expect(getImageNote(target)).toMatch(/^\/\/ /);
    expect(getImageNote('dart')).toContain('BoxShadow');
    expect(getImageNote('compose')).toContain('Modifier.dropShadow');
    expect(getImageNote('rn')).toContain('boxShadow');
  });
});

describe('image exports for frameworks and Python', () => {
  it('puts the drop-shadow chain on an <img>, as a JSX style object or an inline style', () => {
    const s = createInitialState();
    const filter = getDropShadowFilter(s);
    // The default layer has spread 3, so each starts with its dropped-spread comment.
    expect(getImageMarkup(s, true)).toMatch(/^\{\/\*.*\*\/\}\n/);
    expect(getImageMarkup(s, true).endsWith(`<img src="/image.png" alt="" style={{ filter: '${filter}' }} />`)).toBe(true);
    expect(getImageMarkup(s, false)).toMatch(/^<!--.*-->\n/);
    expect(getImageMarkup(s, false).endsWith(`<img src="image.png" alt="" style="filter: ${filter}" />`)).toBe(true);
  });

  it('Qt: the first visible outer layer on a QLabel, alpha as 0–255', () => {
    const s = createInitialState();
    s.layers = [
      { horizontal: 1, vertical: 1, blur: 2, spread: 0, color: '#ffffff', opacity: 1, inset: true },
      { horizontal: 0, vertical: 4, blur: 12, spread: -2, color: '#17191e', opacity: 0.12, inset: false },
    ];
    const q = getImageQt(s);
    expect(q).toContain('shadow.setOffset(0, 4)');
    expect(q).toContain('shadow.setBlurRadius(12)');
    expect(q).toContain('QColor(23, 25, 30, 31)');
    s.layers[1].hidden = true;
    expect(getImageQt(s)).toContain('No visible outer layer');
    expect(getImageFlet()).toMatch(/^# Flet/);
  });
});

