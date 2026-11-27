/** Tests for the 2.2 features: CSS import, share tokens, history, layer edits, smooth layers, exports. */
import { describe, it, expect } from 'vitest';
import { parseBoxShadow } from './importCss';
import { encodeState, decodeState } from './share';
import { createHistory } from './history';
import {
  createInitialState,
  addLayer,
  duplicateLayer,
  moveLayer,
  setLayerHidden,
  smoothLayers,
  setLayers,
  getCSS,
  getDart,
  getCompose,
  getSwiftUI,
  getReactNative,
  getCSSVariable,
  getTailwindTheme,
  update,
  addBackgroundLayer,
} from './shadow';

describe('parseBoxShadow', () => {
  it('reads a declaration with several layers, rgba, hex alpha and inset', () => {
    const l = parseBoxShadow('box-shadow: 0 1px 2px rgba(23, 25, 30, 0.08), inset 0px 4px 12px -2px #17191e80;')!;
    expect(l).toHaveLength(2);
    expect(l[0]).toEqual({ horizontal: 0, vertical: 1, blur: 2, spread: 0, color: '#17191e', opacity: 0.08, inset: false });
    expect(l[1]).toMatchObject({ vertical: 4, blur: 12, spread: -2, color: '#17191e', inset: true });
    expect(l[1].opacity).toBeCloseTo(0.502, 3);
  });

  it('accepts a whole rule, a Tailwind class, modern rgb syntax and named colors', () => {
    expect(parseBoxShadow('.card { color: red; box-shadow: 2px 2px black }')?.[0].horizontal).toBe(2);
    expect(parseBoxShadow('shadow-[0_8px_24px_rgba(0,0,0,0.2)]')?.[0]).toMatchObject({ vertical: 8, blur: 24, opacity: 0.2 });
    expect(parseBoxShadow('0 4px 8px rgb(0 0 0 / 25%)')?.[0].opacity).toBe(0.25);
    expect(parseBoxShadow('1rem 0 transparent')?.[0]).toMatchObject({ horizontal: 16, opacity: 0 });
    expect(parseBoxShadow('3px 3px')?.[0]).toMatchObject({ color: '#000000', opacity: 1, blur: 0 });
  });

  it('rejects what it does not understand instead of importing half of it', () => {
    for (const bad of ['', 'none', '5px', '1px 2px 3px 4px 5px', '1px 2px -3px', '1px 2px hsl(0 0% 0%)', '1px 2px red blue', 'banana']) {
      expect(parseBoxShadow(bad)).toBeNull();
    }
  });
});

describe('share tokens', () => {
  it('round-trips the whole state', () => {
    const s = createInitialState();
    addLayer(s);
    setLayerHidden(s, 0, true);
    addBackgroundLayer(s, 'radial');
    update(s, 'borderRadius', 12);
    expect(decodeState(encodeState(s))).toEqual(JSON.parse(JSON.stringify(s)));
  });

  it('clamps out-of-range numbers and rejects malformed or hostile tokens', () => {
    const s = createInitialState();
    s.layers[0].blur = 9999;
    expect(decodeState(encodeState(s))!.layers[0].blur).toBe(500);

    const forge = (o: unknown) => btoa(JSON.stringify(o)).replace(/=+$/, '');
    const base = JSON.parse(atob(encodeState(createInitialState())));
    expect(decodeState('not base64 !!')).toBeNull();
    expect(decodeState(forge({ ...base, v: 2 }))).toBeNull();
    expect(decodeState(forge({ ...base, l: [] }))).toBeNull();
    expect(decodeState(forge({ ...base, l: [{ ...base.l[0], color: 'red;background:url(x)' }] }))).toBeNull();
    expect(decodeState(forge({ ...base, p: { ...base.p, backgroundColor: '</style>' } }))).toBeNull();
    expect(decodeState(forge({ ...base, l: [{ ...base.l[0], blur: 'Infinity' }] }))).toBeNull();
    expect(decodeState(forge({ ...base, i: 99 }))!.currentLayerIndex).toBe(0);
  });
});

describe('history', () => {
  it('undoes and redoes, and a new change clears redo', () => {
    const h = createHistory(3);
    h.record('a');
    h.record('b');
    expect(h.undo('c')).toBe('b');
    expect(h.redo('b')).toBe('c');
    h.undo('c');
    h.record('x');
    expect(h.canRedo).toBe(false);
    for (const s of ['1', '2', '3', '4']) h.record(s);
    expect([h.undo('z'), h.undo('4'), h.undo('3'), h.undo('2')]).toEqual(['4', '3', '2', undefined]);
  });
});

describe('layer edits', () => {
  it('duplicates, moves (selection follows) and hides layers', () => {
    const s = createInitialState();
    s.layers[0].blur = 1;
    addLayer(s);
    s.layers[1].blur = 2;
    duplicateLayer(s, 0);
    expect(s.layers.map((l) => l.blur)).toEqual([1, 1, 2]);
    expect(s.currentLayerIndex).toBe(1);

    moveLayer(s, 2, -1);
    expect(s.layers.map((l) => l.blur)).toEqual([1, 2, 1]);
    expect(s.currentLayerIndex).toBe(2);
    moveLayer(s, 0, -1); // already at the top: no-op
    expect(s.layers[0].blur).toBe(1);

    setLayerHidden(s, 0, true);
    setLayerHidden(s, 2, true);
    expect(getCSS(s)).toBe('5px 5px 2px 3px rgba(0, 0, 0, 0.5)');
    expect(getDart(s).match(/BoxShadow\(/g)).toHaveLength(1);
    setLayerHidden(s, 1, true);
    expect(getCSS(s)).toBe('none');
  });

  it('smooth layers double offset and blur and share the intensity', () => {
    const l = smoothLayers({ count: 5, distance: 16, intensity: 40, color: '#17191e' });
    expect(l.map((x) => x.vertical)).toEqual([1, 2, 4, 8, 16]);
    expect(l.every((x) => x.blur === x.vertical && x.opacity === 0.08 && x.horizontal === 0)).toBe(true);
    expect(smoothLayers({ count: 99, distance: 2, intensity: 500, color: '#000000' })).toHaveLength(8);

    const s = createInitialState();
    setLayers(s, l);
    expect(s.layers).toHaveLength(5);
    setLayers(s, []);
    expect(s.layers).toHaveLength(5);
  });
});

describe('more exports', () => {
  const s = createInitialState();
  s.layers = [
    { horizontal: 0, vertical: 4, blur: 12, spread: -2, color: '#17191e', opacity: 0.12, inset: false },
    { horizontal: 1, vertical: 1, blur: 2, spread: 0, color: '#ffffff', opacity: 0.5, inset: true },
  ];
  update(s, 'borderRadius', 16);

  it('Compose: drop shadows before the background, inner shadows after, ARGB colors', () => {
    const c = getCompose(s);
    expect(c).toContain('spread = (-2).dp');
    expect(c).toContain('color = Color(0x1F17191E)');
    expect(c.indexOf('.dropShadow(')).toBeLessThan(c.indexOf('.background('));
    expect(c.indexOf('.background(')).toBeLessThan(c.indexOf('.innerShadow('));
    expect(c).toContain('RoundedCornerShape(16.dp)');
  });

  it('SwiftUI: halves the blur, one shape per drop shadow, inner shadows on the fill', () => {
    const w = getSwiftUI(s);
    expect(w).toContain('radius: 6, x: 0, y: 4');
    expect(w).toContain('.shadow(.inner(color: Color(red: 1, green: 1, blue: 1, opacity: 0.5), radius: 1, x: 1, y: 1))');
    expect(w.match(/RoundedRectangle\(cornerRadius: 16\)/g)).toHaveLength(2);
  });

  it('React Native, CSS variable and Tailwind theme reuse the CSS value', () => {
    expect(getReactNative(s)).toContain(`boxShadow: '${getCSS(s)}'`);
    expect(getCSSVariable(s)).toContain(`--shadow-layered: ${getCSS(s)};`);
    expect(getCSSVariable(s)).toContain('border-radius: 16px;');
    expect(getTailwindTheme(s)).toContain('@theme {');
  });

  it('states the gradient limit where the target cannot take it', () => {
    const g = createInitialState();
    addBackgroundLayer(g, 'linear');
    for (const f of [getCompose, getSwiftUI, getReactNative]) expect(f(g)).toMatch(/Gradientes não exportados/);
  });
});
