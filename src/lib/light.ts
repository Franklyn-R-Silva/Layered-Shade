/**
 * Shadow offset ⇄ light angle and distance (pure, no DOM), in Photoshop's convention: the angle is
 * where the LIGHT comes from, in whole degrees 0–359 counter-clockwise from the positive x axis
 * (0° = from the right, 90° = from above), and the shadow falls the opposite way. Screen y grows
 * downward, so a shadow falling down-right (x > 0, y > 0) is light from the upper-left: 135°.
 */

export interface Polar {
  angle: number;
  distance: number;
}

const RAD = Math.PI / 180;
const wrap = (angle: number) => ((Math.round(angle) % 360) + 360) % 360;
// `+ 0` turns Math.round's -0 into a plain 0.
const px = (v: number) => Math.round(v) + 0;

/** Whole-pixel offsets of a shadow `distance` px long, lit from `angle` (any angle; it wraps). */
export function fromPolar(angle: number, distance: number): { x: number; y: number } {
  return { x: px(-distance * Math.cos(angle * RAD)), y: px(distance * Math.sin(angle * RAD)) };
}

/**
 * Angle and distance of an offset. Several nearby angles and distances round to the same offsets,
 * and distance 0 has no direction at all, so the caller passes what it showed or set last (`prev`):
 * it is kept while it still produces (x, y), and at distance 0 its angle is kept. That stops a typed
 * angle turning into its rounded neighbour and a rotation wearing the distance down.
 */
export function toPolar(x: number, y: number, prev: Polar = { angle: 0, distance: 0 }): Polar {
  const distance = Math.round(Math.hypot(x, y));
  if (distance === 0) return { angle: wrap(prev.angle), distance: 0 };
  const kept = fromPolar(prev.angle, prev.distance);
  if (kept.x === x && kept.y === y) return { angle: wrap(prev.angle), distance: prev.distance };
  return { angle: wrap(Math.atan2(y, -x) / RAD), distance };
}

/** Longest whole distance at `angle` whose offsets stay within ±`limit` (the X/Y sliders' range). */
export const reach = (angle: number, limit: number): number =>
  Math.floor(limit / Math.max(Math.abs(Math.cos(angle * RAD)), Math.abs(Math.sin(angle * RAD))) + 1e-9);
