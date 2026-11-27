/**
 * Parses an existing CSS `box-shadow` (a bare value, a declaration, a whole rule, or a Tailwind
 * `shadow-[…]` class) into editable layers. Returns null when anything is not understood, so the
 * UI can say so instead of importing half a shadow.
 */
import type { ShadowLayer } from './types';

const NAMED: Record<string, [string, number]> = {
  black: ['#000000', 1],
  white: ['#ffffff', 1],
  transparent: ['#000000', 0],
  currentcolor: ['#000000', 1],
};

/** Splits on commas/spaces that are not inside parentheses. */
function splitTop(s: string, sep: RegExp): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth === 0 && sep.test(ch)) {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const hex2 = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');

function parseColor(token: string): [string, number] | null {
  const t = token.toLowerCase();
  if (NAMED[t]) return NAMED[t];
  const h = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(t);
  if (h) {
    let v = h[1];
    if (v.length <= 4) v = [...v].map((c) => c + c).join('');
    const alpha = v.length === 8 ? parseInt(v.slice(6), 16) / 255 : 1;
    return [`#${v.slice(0, 6)}`, Math.round(alpha * 1000) / 1000];
  }
  const f = /^rgba?\((.*)\)$/.exec(t);
  if (!f) return null;
  const parts = f[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3 || parts.length > 4) return null;
  const nums = parts.map((p, i) => (p.endsWith('%') ? (parseFloat(p) / 100) * (i === 3 ? 1 : 255) : parseFloat(p)));
  if (nums.some((n) => !Number.isFinite(n))) return null;
  const [r, g, b, a = 1] = nums;
  return [`#${hex2(r)}${hex2(g)}${hex2(b)}`, Math.round(Math.min(1, Math.max(0, a)) * 1000) / 1000];
}

function parseLength(token: string): number | null {
  const m = /^(-?(?:\d+\.?\d*|\.\d+))(px|rem|em)?$/i.exec(token);
  if (!m) return null;
  const n = parseFloat(m[1]);
  // shortcut: rem/em assume a 16px root font size; fine for design tokens, wrong for custom roots.
  return m[2] && m[2].toLowerCase() !== 'px' ? n * 16 : n;
}

function parseLayer(text: string): ShadowLayer | null {
  let inset = false;
  let color: [string, number] = ['#000000', 1];
  let colorSeen = false;
  const lengths: number[] = [];
  for (const token of splitTop(text, /\s/)) {
    if (token.toLowerCase() === 'inset' && !inset) {
      inset = true;
      continue;
    }
    const len = parseLength(token);
    if (len !== null) {
      lengths.push(len);
      continue;
    }
    const c = parseColor(token);
    if (!c || colorSeen) return null;
    color = c;
    colorSeen = true;
  }
  if (lengths.length < 2 || lengths.length > 4) return null;
  const [horizontal, vertical, blur = 0, spread = 0] = lengths;
  if (blur < 0) return null; // a negative blur is invalid CSS
  return { horizontal, vertical, blur, spread, color: color[0], opacity: color[1], inset };
}

export function parseBoxShadow(input: string): ShadowLayer[] | null {
  let value = input.trim();
  const tw = /shadow-\[([^\]]+)\]/.exec(value);
  const decl = /(?:^|[\s;{])(?:-webkit-|-moz-)?box-shadow\s*:\s*([^;}]+)/i.exec(value);
  if (tw) value = tw[1].replace(/_/g, ' ');
  else if (decl) value = decl[1];
  value = value.replace(/;\s*$/, '').trim();
  if (!value || value.toLowerCase() === 'none') return null;
  const layers = splitTop(value, /,/).map(parseLayer);
  return layers.length && layers.every(Boolean) ? (layers as ShadowLayer[]) : null;
}
