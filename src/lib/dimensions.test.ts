import { describe, it, expect } from 'vitest';
import { plateGeometry, BOX } from './dimensions';
import { DEFAULT_LAYER } from './shadow';
import type { ShadowLayer } from './types';

const layer = (o: Partial<ShadowLayer>): ShadowLayer => ({ ...DEFAULT_LAYER, ...o });
const stage = { w: 700, h: 760 };
const nums = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

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
});
