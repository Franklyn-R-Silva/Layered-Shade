/** Framework and Python exports (#77): box and text, escaping per target, platform limits. */
import { describe, it, expect } from 'vitest';
import ts from 'typescript';
import { compile } from 'svelte/compiler';
import { addBackgroundLayer, createInitialState, getCSS, getTextShadowCSS, update } from './shadow';
import {
  getAngular,
  getCSSProperties,
  getFlet,
  getQt,
  getReact,
  getSvelte,
  getTextAngular,
  getTextFlet,
  getTextQt,
  getTextReact,
  getTextSvelte,
  getTextVue,
  getVue,
} from './frameworks';

/** Syntax errors TypeScript finds in a .tsx file (none = valid TSX). */
const tsxErrors = (code: string) =>
  ts.transpileModule(code, { fileName: 'x.tsx', reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.Preserve } })
    .diagnostics ?? [];

const s = createInitialState();
s.layers = [
  { horizontal: 0, vertical: 4, blur: 12, spread: -2, color: '#17191e', opacity: 0.12, inset: false },
  { horizontal: 1, vertical: 1, blur: 2, spread: 0, color: '#ffffff', opacity: 0.5, inset: true },
  { horizontal: -2, vertical: 8, blur: 24, spread: 0, color: '#000000', opacity: 0.25, inset: false },
  { horizontal: 9, vertical: 9, blur: 9, spread: 0, color: '#00ff00', opacity: 1, inset: false, hidden: true },
];
update(s, 'borderRadius', 16);
s.text = { content: 'It\'s <b>"$x"</b> & \\o/\nsecond', font: 'Times New Roman', size: 64, weight: 800, color: '#23272b' };

describe('box exports', () => {
  it('CSS properties: one visible layer per indented line, background and radius', () => {
    expect(getCSSProperties(s)).toBe(
      'box-shadow:\n  0px 4px 12px -2px rgba(23, 25, 30, 0.12),\n  1px 1px 2px 0px rgba(255, 255, 255, 0.5) inset,\n' +
        '  -2px 8px 24px 0px rgba(0, 0, 0, 0.25);\nbackground: #ffffff;\nborder-radius: 16px;',
    );
  });

  it('React / Next.js: inline style object with camelCase keys, or a CSS Module, both valid TSX', () => {
    const inline = getReact(s);
    expect(inline).toContain(`boxShadow: '${getCSS(s)}',`);
    expect(inline).toContain("background: '#ffffff',\n        borderRadius: 16,");
    expect(tsxErrors(inline)).toHaveLength(0);

    const mod = getReact(s, 'module');
    const [css, tsx] = mod.split('\n\n// ShadowBox.tsx\n');
    expect(css).toBe(`/* styles.module.css */\n.box {\n${getCSSProperties(s).replace(/^/gm, '  ')}\n}`);
    expect(tsx).toContain("import styles from './styles.module.css';");
    expect(tsx).toContain('<div className={styles.box}>{children}</div>');
    expect(tsxErrors(tsx)).toHaveLength(0);
  });

  it('Vue, Svelte and Angular wrap the same CSS rule', () => {
    const rule = getCSSProperties(s).split('\n')[1].trim(); // the first layer line
    for (const code of [getVue(s), getSvelte(s), getAngular(s)]) expect(code).toContain(rule);
    expect(getVue(s)).toMatch(/^<template>\n {2}<div class="box"><slot \/><\/div>\n<\/template>\n\n<style scoped>\n\.box \{/);
    expect(() => compile(getSvelte(s), {})).not.toThrow();
    const ng = getAngular(s);
    expect(ng).toContain("selector: 'app-shadow-box',\n  standalone: true,");
    expect(ng).toContain('export class ShadowBoxComponent {}');
    expect(tsxErrors(ng)).toHaveLength(0);
  });

  it('Flet: every outer layer as a BoxShadow, inset left out and said so', () => {
    const f = getFlet(s);
    expect(f.match(/ft\.BoxShadow\(/g)).toHaveLength(2);
    expect(f).toContain(
      'spread_radius=-2,\n            blur_radius=12,\n            color=ft.Colors.with_opacity(0.12, "#17191e"),\n            offset=ft.Offset(0, 4),',
    );
    expect(f).toContain('bgcolor="#ffffff",\n    border_radius=16,');
    expect(f).toMatch(/# Flet's BoxShadow has no inset/);
    expect(getFlet(createInitialState())).not.toMatch(/inset/);
  });

  it('PySide6 / PyQt: one shadow only, the first visible outer layer, and a comment saying so', () => {
    const q = getQt(s);
    expect(q).toMatch(/^# Qt draws a single drop shadow, with no spread and no inset/);
    expect(q.match(/setColor/g)).toHaveLength(1);
    expect(q).toContain('shadow.setBlurRadius(12)\nshadow.setOffset(0, 4)\nshadow.setColor(QColor(23, 25, 30, 31))');
    expect(q).toContain('box.setStyleSheet("#box { background-color: #ffffff; border-radius: 16px; }")');

    const insetOnly = createInitialState();
    insetOnly.layers[0].inset = true;
    expect(getQt(insetOnly)).toContain('# No visible outer layer');
  });

  it('states the gradient limit in the Python exports', () => {
    const g = createInitialState();
    addBackgroundLayer(g, 'linear');
    for (const f of [getFlet, getQt]) expect(f(g)).toMatch(/# Gradients not exported/);
    expect(getVue(g)).toContain('background: linear-gradient(');
  });
});

describe('text exports', () => {
  it('React: the text as string expressions split by <br />, textShadow, valid TSX in both variants', () => {
    const r = getTextReact(s);
    expect(r).toContain(String.raw`{"It's <b>\"$x\"</b> & \\o/"}` + '\n      <br />\n      {"second"}');
    expect(r).toContain(`textShadow: '${getTextShadowCSS(s)}',`);
    expect(r).toContain(`fontFamily: '"Times New Roman", sans-serif',\n        fontSize: 64,\n        fontWeight: 800,`);
    expect(r).toMatch(/^\/\/ Text shadows have no inset or spread/);
    expect(tsxErrors(r)).toHaveLength(0);

    const [css, tsx] = getTextReact(s, 'module').split('\n\n// ShadowText.tsx\n');
    expect(css).toContain('.text {\n  /* Text shadows have no inset or spread');
    expect(tsx).toContain('<p className={styles.text}>');
    expect(tsxErrors(tsx)).toHaveLength(0);
  });

  it('Vue, Svelte and Angular HTML-escape the text, braces and @ included', () => {
    const html = 'It&#39;s &lt;b&gt;&quot;$x&quot;&lt;/b&gt; &amp; \\o/<br />second';
    expect(getTextVue(s)).toContain(`<p class="text">${html}</p>`);
    expect(getTextSvelte(s)).toContain(`<p class="text">${html}</p>`);
    expect(() => compile(getTextSvelte(s), {})).not.toThrow();
    // In Angular the template is a TS template literal: the backslash is escaped once more.
    const ng = getTextAngular(s);
    expect(ng).toContain('template: `<p class="text">It&#39;s &lt;b&gt;&quot;$x&quot;&lt;/b&gt; &amp; \\\\o/<br />second</p>`');
    expect(tsxErrors(ng)).toHaveLength(0);
    for (const code of [getTextVue(s), getTextSvelte(s), getTextAngular(s)])
      expect(code).toContain('text-shadow:\n');

    const b = createInitialState();
    b.text.content = '{a} @if `x` ${y}';
    for (const code of [getTextVue(b), getTextSvelte(b), getTextAngular(b)]) expect(code).toContain('&#123;a&#125; &#64;if');
    expect(() => compile(getTextSvelte(b), {})).not.toThrow();
    expect(tsxErrors(getTextAngular(b))).toHaveLength(0);
  });

  it('Flet: every text layer in TextStyle.shadow without spread, text as a Python literal', () => {
    const f = getTextFlet(s);
    expect(f).toContain(String.raw`ft.Text(` + '\n    ' + String.raw`"It's <b>\"$x\"</b> & \\o/\nsecond",`);
    expect(f).toContain('font_family="Times New Roman",\n        size=64,\n        weight=ft.FontWeight.W_800,\n        color="#23272b",');
    expect(f.match(/ft\.BoxShadow\(/g)).toHaveLength(2);
    expect(f).not.toContain('spread_radius');
    expect(f).toMatch(/# Text shadows have no inset or spread: inset layers ignored, spread ignored/);
  });

  it('PySide6 / PyQt: a plain-text QLabel with the first text layer only', () => {
    const q = getTextQt(s);
    expect(q).toContain(String.raw`label = QLabel("It's <b>\"$x\"</b> & \\o/\nsecond")`);
    expect(q).toContain('label.setTextFormat(Qt.TextFormat.PlainText)');
    expect(q).toContain('font.setPixelSize(64)\nfont.setWeight(QFont.Weight.ExtraBold)');
    expect(q.match(/setColor/g)).toHaveLength(1);
    expect(q).toContain('shadow.setOffset(0, 4)');
    expect(q).toMatch(/single drop shadow/);
  });

  it('never leaves a raw line break inside a string literal', () => {
    for (const code of [getTextReact(s), getTextFlet(s), getTextQt(s), getTextVue(s), getTextSvelte(s), getTextAngular(s)])
      expect(code).not.toMatch(/o\/\nsecond/);
  });
});
