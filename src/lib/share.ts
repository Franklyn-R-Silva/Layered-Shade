/**
 * Share links and saved sessions: the whole state as a compact base64url token.
 * A token comes from a URL or from storage, so it is untrusted: every field is validated and
 * clamped to what the controls allow, and anything malformed is rejected as a whole.
 */
import type { BackgroundLayer, ShadowLayer, ShadowState } from './types';

const HEX = /^#[0-9a-f]{6}$/i;
const SIZES = ['farthest-corner', 'closest-side', 'closest-corner', 'farthest-side'];

const num = (v: unknown, min: number, max: number): number => {
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error('number');
  return Math.min(max, Math.max(min, v));
};
const hex = (v: unknown): string => {
  if (typeof v !== 'string' || !HEX.test(v)) throw new Error('color');
  return v.toLowerCase();
};
const list = (v: unknown, min: number, max: number): unknown[] => {
  if (!Array.isArray(v) || v.length < min || v.length > max) throw new Error('list');
  return v;
};
const obj = (v: unknown): Record<string, unknown> => {
  if (!v || typeof v !== 'object') throw new Error('object');
  return v as Record<string, unknown>;
};

function layer(v: unknown): ShadowLayer {
  const o = obj(v);
  const l: ShadowLayer = {
    horizontal: num(o.horizontal, -500, 500),
    vertical: num(o.vertical, -500, 500),
    blur: num(o.blur, 0, 500),
    spread: num(o.spread, -500, 500),
    color: hex(o.color),
    opacity: num(o.opacity, 0, 1),
    inset: o.inset === true,
  };
  if (o.hidden === true) l.hidden = true;
  return l;
}

function bgLayer(v: unknown): BackgroundLayer {
  const o = obj(v);
  if (o.type !== 'linear' && o.type !== 'radial') throw new Error('type');
  const b: BackgroundLayer = {
    type: o.type,
    angle: num(o.angle, 0, 360),
    shape: o.shape === 'ellipse' ? 'ellipse' : 'circle',
    stops: list(o.stops, 2, 12).map((s) => {
      const so = obj(s);
      return { color: hex(so.color), position: num(so.position, 0, 100) };
    }),
    opacity: num(o.opacity ?? 1, 0, 1),
  };
  if (o.posX !== undefined) b.posX = num(o.posX, 0, 100);
  if (o.posY !== undefined) b.posY = num(o.posY, 0, 100);
  if (o.size !== undefined) {
    if (typeof o.size !== 'string' || !SIZES.includes(o.size)) throw new Error('size');
    b.size = o.size;
  }
  return b;
}

export function encodeState(state: ShadowState): string {
  const json = JSON.stringify({
    v: 1,
    l: state.layers,
    i: state.currentLayerIndex,
    b: state.backgroundLayers,
    bi: state.currentBgLayerIndex,
    p: state.boxProperties,
  });
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeState(token: string): ShadowState | null {
  try {
    if (token.length > 20000) return null;
    const o = obj(JSON.parse(atob(token.replace(/-/g, '+').replace(/_/g, '/'))));
    if (o.v !== 1) return null;
    const layers = list(o.l, 1, 30).map(layer);
    const backgroundLayers = list(o.b ?? [], 0, 12).map(bgLayer);
    const p = obj(o.p);
    return {
      layers,
      currentLayerIndex: Math.round(num(o.i ?? 0, 0, layers.length - 1)),
      backgroundLayers,
      currentBgLayerIndex: backgroundLayers.length ? Math.round(num(o.bi ?? 0, 0, backgroundLayers.length - 1)) : -1,
      boxProperties: {
        borderRadius: num(p.borderRadius, 0, 100),
        backgroundColor: hex(p.backgroundColor),
        canvasColor: hex(p.canvasColor),
      },
    };
  } catch {
    return null;
  }
}
