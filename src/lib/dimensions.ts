/**
 * Dimension-line geometry for the preview plate (pure, no DOM). Coordinates are in CSS px with
 * (0,0) at the box's top-left; the box is drawn 1:1, so every label reads in real pixels.
 * Lines sit on the side the shadow falls toward, the light ray comes from the opposite corner,
 * and everything is kept inside the visible stage.
 */
import type { ShadowLayer } from './types';
import { shadowCornerRadius } from './shadow';
import { fmt } from './format';

export const BOX = 200;
const GAP = 22; // object → dimension line
const SHORT = 28; // shorter spans get arrows from outside instead of ticks
const EDGE = 14; // keep lines and labels this far inside the stage

export interface Label {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  text: string;
}

export interface Dim {
  /** Path data: the dimension line (or outside stubs), extension stubs, and end marks. */
  line: string;
  ext: string;
  marks: string;
  /** Arrowheads (short spans) are drawn as open polylines. */
  arrows: string[];
  label: Label;
}

export interface Rect {
  l: number;
  t: number;
  r: number;
  b: number;
  rx: number;
}

export interface PlateGeometry {
  spread: Rect | null;
  reach: Rect | null;
  dimX: Dim;
  dimY: Dim;
  ray: { line: string; head: string; label: Label } | null;
  radius: { leader: string; label: Label } | null;
}

const tick = (px: number, py: number) => `M${px - 4} ${py + 4}L${px + 4} ${py - 4}`;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Builds a dimension along one axis between `a` and `b`, on a baseline at `base` (other axis). */
function dimension(
  axis: 'x' | 'y',
  a: number,
  b: number,
  base: number,
  outward: 1 | -1,
  text: string,
): Dim {
  // P(along, across) maps the axis-local point to plate coordinates.
  const P = (u: number, v: number) => (axis === 'x' ? `${u} ${v}` : `${v} ${u}`);
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const span = hi - lo;
  const ext = `M${P(a, base - outward * 10)}L${P(a, base + outward * 4)}M${P(b, base - outward * 10)}L${P(b, base + outward * 4)}`;
  const tickAt = (u: number) => (axis === 'x' ? tick(u, base) : tick(base, u));

  let line = '';
  let marks = '';
  const arrows: string[] = [];
  if (span >= SHORT) {
    line = `M${P(lo, base)}L${P(hi, base)}`;
    marks = tickAt(lo) + tickAt(hi);
  } else if (span > 0) {
    // Too short for ticks: stubs outside both ends with arrows pointing in.
    line = `M${P(lo - 14, base)}L${P(lo, base)}M${P(hi, base)}L${P(hi + 14, base)}`;
    arrows.push(`${P(lo - 6, base - 3)} ${P(lo, base)} ${P(lo - 6, base + 3)}`);
    arrows.push(`${P(hi + 6, base - 3)} ${P(hi, base)} ${P(hi + 6, base + 3)}`);
  } else {
    marks = tickAt(a);
  }

  const mid = (a + b) / 2;
  const label: Label =
    axis === 'x'
      ? { x: mid, y: base + (outward > 0 ? 18 : -9), anchor: 'middle', text }
      : { x: base + outward * 10, y: mid + 4, anchor: outward > 0 ? 'start' : 'end', text };
  return { line, ext, marks, arrows, label };
}

const LABEL_W = 62; // ~"luz 45°" at 13px mono

/** Label beside the ray's start; above or below it when the side has no room. */
function rayLabel(sx0: number, sy0: number, ux: number, uy: number, text: string, b: { l: number; r: number }): Label {
  if (Math.abs(ux) >= 0.3) {
    const x = sx0 - Math.sign(ux) * 6;
    const fits = ux > 0 ? x - LABEL_W >= b.l : x + LABEL_W <= b.r;
    if (fits) return { x, y: sy0 + 4, anchor: ux > 0 ? 'end' : 'start', text };
    return { x: sx0, y: uy > 0 ? sy0 - 8 : sy0 + 16, anchor: 'middle', text };
  }
  return { x: sx0 + 8, y: sy0 + (uy > 0 ? 4 : 10), anchor: 'start', text };
}

export function plateGeometry(
  layer: ShadowLayer,
  boxRadius: number,
  stage: { w: number; h: number },
  box: { w: number; h: number } = { w: BOX, h: BOX },
): PlateGeometry {
  const W = box.w;
  const H = box.h;
  const { horizontal: x, vertical: y, blur: b, spread: s, inset } = layer;
  const sx: 1 | -1 = x >= 0 ? 1 : -1;
  const sy: 1 | -1 = y >= 0 ? 1 : -1;

  // Visible stage in plate coordinates (the plate is centred). Unknown size: no clamping.
  const mx = stage.w > 0 ? (stage.w - W) / 2 : Infinity;
  const my = stage.h > 0 ? (stage.h - H) / 2 : Infinity;
  const bounds = { l: -mx + EDGE, t: -my + EDGE, r: W + mx - EDGE, b: H + my - EDGE };

  const rxS = shadowCornerRadius(boxRadius, s);
  const S = { l: x - s, t: y - s, r: W + x + s, b: H + y + s, rx: rxS };
  const outlined = !inset && S.r > S.l && S.b > S.t;
  const spread = outlined ? S : null;
  const reach = outlined && b > 0 ? { l: S.l - b, t: S.t - b, r: S.r + b, b: S.b + b, rx: rxS + b } : null;
  const far = reach ?? spread ?? { l: 0, t: 0, r: W, b: H };

  // Clamped into the stage, but never drawn over the element itself (a cramped stage clips instead).
  const ydIn = clamp(sy > 0 ? Math.max(H, far.b) + GAP : Math.min(0, far.t) - GAP, bounds.t + 12, bounds.b - 18);
  const xdIn = clamp(sx > 0 ? Math.max(W, far.r) + GAP : Math.min(0, far.l) - GAP, bounds.l + 48, bounds.r - 48);
  const yd = sy > 0 ? Math.max(H + 12, ydIn) : Math.min(-12, ydIn);
  const xd = sx > 0 ? Math.max(W + 12, xdIn) : Math.min(-12, xdIn);
  const ax = sx > 0 ? W : 0;
  const ay = sy > 0 ? H : 0;
  const dimX = dimension('x', ax, ax + x, yd, sy, `x ${fmt(x)}`);
  const dimY = dimension('y', ay, ay + y, xd, sx, `y ${fmt(y)}`);

  // Light ray: arrives at the box corner facing the light, from the side opposite the shadow.
  let ray: PlateGeometry['ray'] = null;
  const len = Math.hypot(x, y);
  if (len > 0) {
    const ux = x / len;
    const uy = y / len;
    const cx = x > 0 ? 0 : x < 0 ? W : W / 2;
    const cy = y > 0 ? 0 : y < 0 ? H : H / 2;
    const room = Math.min(
      ux > 0 ? (cx - bounds.l) / ux : ux < 0 ? (bounds.r - cx) / -ux : Infinity,
      uy > 0 ? (cy - bounds.t) / uy : uy < 0 ? (bounds.b - cy) / -uy : Infinity,
    );
    const L = Math.min(56, room - 12);
    if (L >= 16) {
      const ex = cx - ux * 6;
      const ey = cy - uy * 6;
      const deg = Math.round((Math.atan2(Math.abs(y), Math.abs(x)) * 180) / Math.PI);
      ray = {
        line: `M${cx - ux * L} ${cy - uy * L}L${ex} ${ey}`,
        head: `${ex - ux * 7 - uy * 3.5},${ey - uy * 7 + ux * 3.5} ${ex},${ey} ${ex - ux * 7 + uy * 3.5},${ey - uy * 7 - ux * 3.5}`,
        label: rayLabel(cx - ux * L, cy - uy * L, ux, uy, `luz ${deg}°`, bounds),
      };
    }
  }

  // Radius callout on the corner that neither the dimensions nor the light ray use.
  let radius: PlateGeometry['radius'] = null;
  if (boxRadius > 0) {
    const r = Math.min(boxRadius, W / 2, H / 2);
    const dx = sx;
    const dy = -sy;
    const k = r * (1 - Math.SQRT1_2);
    const px = (dx > 0 ? W : 0) - dx * k;
    const py = (dy > 0 ? H : 0) - dy * k;
    const qx = px + dx * 14;
    const qy = py + dy * 14;
    radius = {
      leader: `M${px} ${py}L${qx} ${qy}H${qx + dx * 14}`,
      label: { x: qx + dx * 18, y: qy + 4, anchor: dx > 0 ? 'start' : 'end', text: `R ${boxRadius}` },
    };
  }

  return { spread, reach, dimX, dimY, ray, radius };
}
