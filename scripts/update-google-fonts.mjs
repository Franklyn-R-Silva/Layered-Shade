#!/usr/bin/env node
// Refreshes public/google-fonts.json from Google Fonts' public metadata (no API key).
// Usage: node scripts/update-google-fonts.mjs [metadata.json]
//   Behind a proxy Node's fetch may not connect; download first and pass the file:
//   curl -s https://fonts.google.com/metadata/fonts > /tmp/gf.json && node scripts/update-google-fonts.mjs /tmp/gf.json
// Output: { updated, families: [[family, category, weights]] }, category s|S|d|h|m
// (sans, serif, display, handwriting, mono), weights "100..900" (variable) or "400,700".
import { readFileSync, writeFileSync } from 'node:fs';

const CATEGORY = { 'Sans Serif': 's', Serif: 'S', Display: 'd', Handwriting: 'h', Monospace: 'm' };

async function metadata() {
  if (process.argv[2]) return readFileSync(process.argv[2], 'utf8');
  const res = await fetch('https://fonts.google.com/metadata/fonts');
  if (!res.ok) throw new Error(`Google Fonts metadata: HTTP ${res.status}`);
  return res.text();
}
const text = await metadata();
const { familyMetadataList } = JSON.parse(text.slice(text.indexOf('{')));

const families = familyMetadataList
  .map((f) => {
    const wght = (f.axes ?? []).find((a) => a.tag === 'wght');
    const statics = Object.keys(f.fonts ?? {})
      .filter((k) => /^\d+$/.test(k))
      .map(Number)
      .sort((a, b) => a - b);
    const weights = wght ? `${wght.min}..${wght.max}` : statics.join(',') || '400';
    return [f.family, CATEGORY[f.category] ?? 's', weights];
  })
  .sort((a, b) => a[0].localeCompare(b[0]));

if (families.length < 1000) throw new Error(`Only ${families.length} families: metadata format changed?`);
const updated = new Date().toISOString().slice(0, 10);
writeFileSync(new URL('../public/google-fonts.json', import.meta.url), JSON.stringify({ updated, families }) + '\n');
console.log(`public/google-fonts.json: ${families.length} families (${updated})`);
