import { describe, it, expect } from 'vitest';
import { fromPolar, toPolar, reach } from './light';

describe('toPolar', () => {
  it('measures where the light comes from, counter-clockwise from +x (screen y points down)', () => {
    expect(toPolar(-10, 0)).toEqual({ angle: 0, distance: 10 }); // light from the right
    expect(toPolar(0, 10)).toEqual({ angle: 90, distance: 10 }); // from above, shadow below
    expect(toPolar(10, 0)).toEqual({ angle: 180, distance: 10 }); // from the left
    expect(toPolar(0, -10)).toEqual({ angle: 270, distance: 10 }); // from below
  });

  it('puts each quadrant on the opposite side of the shadow', () => {
    expect(toPolar(5, 5)).toEqual({ angle: 135, distance: 7 }); // down-right: upper-left light
    expect(toPolar(-5, 5)).toEqual({ angle: 45, distance: 7 });
    expect(toPolar(-5, -5)).toEqual({ angle: 315, distance: 7 });
    expect(toPolar(5, -5)).toEqual({ angle: 225, distance: 7 });
    expect(toPolar(-100, 1).angle).toBe(1); // just above the axis, never 360
    expect(toPolar(-100, -1).angle).toBe(359);
  });

  it('keeps the previous angle at distance 0, where an offset has no direction', () => {
    expect(toPolar(0, 0)).toEqual({ angle: 0, distance: 0 });
    expect(toPolar(0, 0, { angle: 200, distance: 30 })).toEqual({ angle: 200, distance: 0 });
    expect(toPolar(0, 0, { angle: -90, distance: 0 })).toEqual({ angle: 270, distance: 0 });
  });

  it('keeps the previous angle and distance while they still produce the offsets', () => {
    // 1 px at 140° and at 135° both round to (1, 1): the typed angle stays.
    expect(fromPolar(140, 1)).toEqual({ x: 1, y: 1 });
    expect(toPolar(1, 1, { angle: 140, distance: 1 })).toEqual({ angle: 140, distance: 1 });
    // 2 px at 45° rounds to (−1, 1), whose own length rounds to 1: the distance stays 2.
    expect(toPolar(-1, 1, { angle: 45, distance: 2 })).toEqual({ angle: 45, distance: 2 });
    // Offsets moved on: the stale value is ignored.
    expect(toPolar(10, 0, { angle: 45, distance: 2 })).toEqual({ angle: 180, distance: 10 });
  });
});

describe('fromPolar', () => {
  it('casts the shadow away from the light, in whole pixels', () => {
    expect(fromPolar(135, 10)).toEqual({ x: 7, y: 7 });
    expect(fromPolar(0, 10)).toEqual({ x: -10, y: 0 });
    expect(fromPolar(90, 10)).toEqual({ x: 0, y: 10 });
    expect(fromPolar(180, 10)).toEqual({ x: 10, y: 0 });
    expect(fromPolar(270, 10)).toEqual({ x: 0, y: -10 });
    expect(fromPolar(30, 0)).toEqual({ x: 0, y: 0 });
  });

  it('accepts negative and full-turn angles', () => {
    expect(fromPolar(-90, 10)).toEqual(fromPolar(270, 10));
    expect(fromPolar(360 + 45, 10)).toEqual(fromPolar(45, 10));
    expect(toPolar(fromPolar(-45, 20).x, fromPolar(-45, 20).y).angle).toBe(315);
  });

  it('round-trips every offset of the ±100 sliders within 1 px', () => {
    let worst = 0;
    for (let x = -100; x <= 100; x++)
      for (let y = -100; y <= 100; y++) {
        const { angle, distance } = toPolar(x, y);
        const back = fromPolar(angle, distance);
        worst = Math.max(worst, Math.abs(back.x - x), Math.abs(back.y - y));
      }
    expect(worst).toBeLessThanOrEqual(1);
  });

  it('round-trips every whole angle and distance exactly when the previous value is passed', () => {
    for (let angle = 0; angle < 360; angle += 7)
      for (const distance of [0, 1, 2, 7, 50, 141]) {
        const p = fromPolar(angle, distance);
        expect(toPolar(p.x, p.y, { angle, distance })).toEqual({ angle, distance });
      }
  });
});

describe('reach', () => {
  it('is the longest distance whose offsets stay within the limit', () => {
    expect(reach(0, 100)).toBe(100);
    expect(reach(90, 100)).toBe(100);
    expect(reach(135, 100)).toBe(141);
    for (let angle = 0; angle < 360; angle++) {
      const p = fromPolar(angle, reach(angle, 100));
      expect(Math.max(Math.abs(p.x), Math.abs(p.y))).toBeLessThanOrEqual(100);
    }
  });
});
