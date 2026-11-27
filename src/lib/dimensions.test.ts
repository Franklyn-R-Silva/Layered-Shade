import { describe, it, expect } from 'vitest';
import { plateGeometry, BOX, type Dim, type Label } from './dimensions';
import { DEFAULT_LAYER } from './shadow';
import type { ShadowLayer } from './types';

const layer = (o: Partial<ShadowLayer>): ShadowLayer => ({ ...DEFAULT_LAYER, ...o });
const stage = { w: 700, h: 760 };
const nums = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

// A 13px mono label as a box: ~7.8px per character, ~14px tall (11 above the baseline, 3 below).
const box = (l: Label) => {
  const w = [...l.text].length * 7.8;
  const left = l.anchor === 'start' ? l.x : l.anchor === 'end' ? l.x - w : l.x - w / 2;
  return { l: left, r: left + w, t: l.y - 11, b: l.y + 3 };
};
type Box = ReturnType<typeof box>;
const overlaps = (a: Box, b: Box) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
// Bounding box of everything a dimension strokes (line, stubs, ticks, arrows): its points alternate x, y.
const drawn = (d: Dim): Box => {
  const n = nums([d.line, d.ext, d.marks, ...d.arrows].join(' '));
  const xs = n.filter((_, i) => i % 2 === 0);
  const ys = n.filter((_, i) => i % 2 === 1);
  return { l: Math.min(...xs), r: Math.max(...xs), t: Math.min(...ys), b: Math.max(...ys) };
};

describe('plateGeometry', () => {
  it('puts the dimensions on the side the shadow falls toward', () => {
    const down = plateGeometry(layer({ horizontal: 40, vertical: 30 }), 0, stage);
    expect(down.dimX.label.y).toBeGreaterThan(BOX);
    expect(down.dimY.label.x).toBeGreaterThan(BOX);

    const up = plateGeometry(layer({ horizontal: -40, vertical: -30 }), 0, stage);
    expect(up.dimX.label.y).toBeLessThan(0);
    expect(up.dimY.label.x).toBeLessThan(0);
    expect(up.dimX.label.text).toBe('x −40');
  });

  it('brings the light from the opposite corner, labelled with its angle', () => {
    const g = plateGeometry(layer({ horizontal: 10, vertical: 10 }), 0, stage);
    expect(g.ray?.label.text).toBe('luz 45°');
    expect(g.ray!.label.x).toBeLessThan(0);
    expect(g.ray!.label.y).toBeLessThan(0);
    expect(plateGeometry(layer({ horizontal: 0, vertical: 0 }), 0, stage).ray).toBeNull();
    // A phone-sized stage leaves ~45px above the box: the ray shortens instead of vanishing.
    const phone = plateGeometry(layer({ horizontal: 5, vertical: 5 }), 0, { w: 390, h: 290 }).ray;
    expect(phone).not.toBeNull();
    // No room beside the ray on a 390px stage: the label moves above it instead of off the edge.
    expect(phone!.label.anchor).toBe('middle');
    expect(phone!.label.x - 31).toBeGreaterThanOrEqual(-(390 - BOX) / 2);
  });

  it('keeps the dimension baselines and labels inside a small stage', () => {
    const small = { w: 360, h: 300 };
    const g = plateGeometry(layer({ horizontal: 100, vertical: -100, blur: 100, spread: 100 }), 0, small);
    const half = { x: (small.w - BOX) / 2, y: (small.h - BOX) / 2 };
    const insideX = (v: number) => v >= -half.x && v <= BOX + half.x;
    const insideY = (v: number) => v >= -half.y && v <= BOX + half.y;
    // X dimension runs horizontally: every y (odd index) is on its baseline.
    nums(g.dimX.line + g.dimX.ext).forEach((v, i) => i % 2 && expect(insideY(v)).toBe(true));
    // Y dimension runs vertically: every x (even index) is on its baseline.
    nums(g.dimY.line + g.dimY.ext).forEach((v, i) => i % 2 || expect(insideX(v)).toBe(true));
    for (const l of [g.dimX.label, g.dimY.label]) {
      expect(insideX(l.x) && insideY(l.y)).toBe(true);
    }
  });

  it('never draws a dimension over the element, even on a cramped stage', () => {
    const g = plateGeometry(layer({ horizontal: 5, vertical: 5 }), 0, { w: 390, h: 210 });
    expect(g.dimX.label.y).toBeGreaterThan(BOX);
    expect(g.dimY.label.x).toBeGreaterThan(BOX);
  });

  it('draws short spans with outside arrows instead of colliding ticks', () => {
    const g = plateGeometry(layer({ horizontal: 5, vertical: 5 }), 0, stage);
    expect(g.dimX.arrows).toHaveLength(2);
    expect(g.dimX.marks).toBe('');
    const long = plateGeometry(layer({ horizontal: 60, vertical: 5 }), 0, stage);
    expect(long.dimX.arrows).toHaveLength(0);
    expect(long.dimX.marks).not.toBe('');
  });

  it('calls out the radius and follows the spec corner for the spread outline', () => {
    const g = plateGeometry(layer({ spread: 20, blur: 0 }), 0, stage);
    expect(g.spread?.rx).toBe(0);
    expect(g.reach).toBeNull();
    expect(g.radius).toBeNull();
    expect(plateGeometry(layer({}), 16, stage).radius?.label.text).toBe('R 16');
  });

  it('measures a non-square element (card, button) from its own edges', () => {
    const g = plateGeometry(layer({ horizontal: 40, vertical: 30 }), 0, stage, { w: 280, h: 180 });
    expect(g.dimX.line).toContain('M280 ');
    expect(g.dimY.label.y).toBeCloseTo(180 + 15 + 4);
  });

  it('never lets the labels overlap each other or the element', () => {
    const offsets = [-100, -60, -33, -15, -5, 0, 5, 15, 33, 60, 100];
    const clashes: string[] = [];
    for (const light of ['luz', 'ray']) // the ray label in pt-BR and in English
    for (const st of [stage, { w: 390, h: 290 }])
      for (const el of [{ w: 200, h: 200 }, { w: 280, h: 180 }, { w: 168, h: 48 }])
        for (const horizontal of offsets)
          for (const vertical of offsets)
            for (const blur of [0, 10, 40])
              for (const spread of [-10, 0, 10])
                for (const r of [0, 16]) {
                  const g = plateGeometry(layer({ horizontal, vertical, blur, spread }), r, st, el, light);
                  const named = { dimX: g.dimX.label, dimY: g.dimY.label, ray: g.ray?.label, radius: g.radius?.label };
                  const boxes = Object.entries(named).flatMap(([k, l]) => (l ? [[k, box(l)] as const] : []));
                  const element = { l: 0, t: 0, r: el.w, b: el.h };
                  const where = `${light} ${st.w}x${st.h} ${el.w}x${el.h} x${horizontal} y${vertical} b${blur} s${spread} r${r}`;
                  boxes.forEach(([k, a], i) => {
                    if (overlaps(a, element)) clashes.push(`${where}: ${k}/element`);
                    for (const [k2, c] of boxes.slice(i + 1)) if (overlaps(a, c)) clashes.push(`${where}: ${k}/${k2}`);
                  });
                  // The reported case: the x label sitting on the y dimension's line in the corner (and vice versa).
                  if (overlaps(box(g.dimX.label), drawn(g.dimY))) clashes.push(`${where}: dimX/y line`);
                  if (overlaps(box(g.dimY.label), drawn(g.dimX))) clashes.push(`${where}: dimY/x line`);
                }
    expect(clashes.slice(0, 20)).toEqual([]);
  });
});
