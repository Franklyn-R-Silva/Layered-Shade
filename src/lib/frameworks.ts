/**
 * frameworks.ts
 * Component exports for the web frameworks (React / Next.js, Vue, Svelte, Angular) and the Python
 * toolkits (Flet, PySide6 / PyQt6), for the box and for the text. Pure, like `shadow.ts`: the
 * web targets reuse its CSS, so every export draws the same shadow.
 */
import type { ShadowLayer, ShadowState } from './types';
import {
  droppedNote,
  fontStack,
  getBackgroundCSS,
  getCSS,
  getLayerCSS,
  getTextCSS,
  getTextShadowCSS,
  hexToColorObj,
  textLayers,
  visibleLayers,
} from './shadow';

export type ReactVariant = 'inline' | 'module';

const indent = (code: string, pad: string) => code.replace(/^(?=.)/gm, pad);

/** A string literal valid in TS/JSX and in Python: quotes, backslashes and line breaks escaped. */
const str = (s: string) => JSON.stringify(s);

const ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '{': '&#123;',
  '}': '&#125;',
  '@': '&#64;',
};
/** The user's text as template markup: braces and `@` escaped too (they open Svelte, Vue and Angular syntax). */
const markup = (s: string) =>
  s
    .replace(/[&<>"'{}@]/g, (c) => ENTITIES[c])
    .split('\n')
    .join('<br />');

/** CSS declarations for the box, one shadow layer per indented line (the CSS properties view). */
export function getCSSProperties(state: ShadowState): string {
  const layers = visibleLayers(state).map((l) => `  ${getLayerCSS(l)}`);
  const r = state.boxProperties.borderRadius;
  return (
    (layers.length ? `box-shadow:\n${layers.join(',\n')};` : 'box-shadow: none;') +
    `\nbackground: ${getBackgroundCSS(state)};` +
    (r > 0 ? `\nborder-radius: ${r}px;` : '')
  );
}

const rule = (selector: string, body: string) => `${selector} {\n${indent(body, '  ')}\n}`;
const boxRule = (state: ShadowState) => rule('.box', getCSSProperties(state));
const textRule = (state: ShadowState) => rule('.text', getTextCSS(state));

/* ---- React / Next.js ---- */

const jsxStyle = (entries: [string, string | number][]) =>
  `style={{\n${entries.map(([k, v]) => `        ${k}: ${typeof v === 'number' ? v : `'${v}'`},\n`).join('')}      }}`;
const jsxText = (s: string) =>
  s
    .split('\n')
    .map((line) => `      {${str(line)}}`)
    .join('\n      <br />\n');
const shadowBox = (imports: string, body: string) =>
  `import type { ReactNode } from 'react';\n${imports}\nexport function ShadowBox({ children }: { children?: ReactNode }) {\n  return ${body}\n}`;

/** React / Next.js function component: an inline `style` object, or a CSS Module and its component. */
export function getReact(state: ShadowState, variant: ReactVariant = 'inline'): string {
  if (variant === 'module')
    return (
      `/* styles.module.css */\n${boxRule(state)}\n\n// ShadowBox.tsx\n` +
      shadowBox("import styles from './styles.module.css';\n", '<div className={styles.box}>{children}</div>;')
    );
  const r = state.boxProperties.borderRadius;
  const style: [string, string | number][] = [
    ['boxShadow', getCSS(state)],
    ['background', getBackgroundCSS(state)],
  ];
  if (r > 0) style.push(['borderRadius', r]);
  return shadowBox('', `(\n    <div\n      ${jsxStyle(style)}\n    >\n      {children}\n    </div>\n  );`);
}

/** React / Next.js text: the layers as `textShadow`, the text as string expressions. */
export function getTextReact(state: ShadowState, variant: ReactVariant = 'inline'): string {
  const { content, font, size, weight, color } = state.text;
  const open = 'export function ShadowText() {\n  return (\n';
  const close = `${jsxText(content)}\n    </p>\n  );\n}`;
  if (variant === 'module')
    return (
      `/* styles.module.css */\n${textRule(state)}\n\n// ShadowText.tsx\n` +
      `import styles from './styles.module.css';\n\n${open}    <p className={styles.text}>\n${close}`
    );
  const style: [string, string | number][] = [
    ['fontFamily', fontStack(font)],
    ['fontSize', size],
    ['fontWeight', weight],
    ['color', color],
    ['textShadow', getTextShadowCSS(state)],
  ];
  return `${droppedNote(state)}${open}    <p\n      ${jsxStyle(style)}\n    >\n${close}`;
}

/* ---- Vue 3, Svelte 5, Angular ---- */

/** Vue 3 single-file component with a scoped style. */
export function getVue(state: ShadowState): string {
  return `<template>\n  <div class="box"><slot /></div>\n</template>\n\n<style scoped>\n${boxRule(state)}\n</style>`;
}

export function getTextVue(state: ShadowState): string {
  return `<template>\n  <p class="text">${markup(state.text.content)}</p>\n</template>\n\n<style scoped>\n${textRule(state)}\n</style>`;
}

/** Svelte 5 component (children rendered as a snippet). */
export function getSvelte(state: ShadowState): string {
  return (
    `<script lang="ts">\n  import type { Snippet } from 'svelte';\n\n  let { children }: { children?: Snippet } = $props();\n</script>\n\n` +
    `<div class="box">{@render children?.()}</div>\n\n<style>\n${indent(boxRule(state), '  ')}\n</style>`
  );
}

export function getTextSvelte(state: ShadowState): string {
  return `<p class="text">${markup(state.text.content)}</p>\n\n<style>\n${indent(textRule(state), '  ')}\n</style>`;
}

function angular(name: 'box' | 'text', template: string, css: string): string {
  const literal = template.replace(/[\\`]/g, '\\$&'); // the template sits in a TS template literal
  const cls = `Shadow${name[0].toUpperCase()}${name.slice(1)}Component`;
  return (
    `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-shadow-${name}',\n  standalone: true,\n` +
    `  template: \`${literal}\`,\n  styles: [\n    \`\n${indent(css, '      ')}\n    \`,\n  ],\n})\nexport class ${cls} {}`
  );
}

/** Angular standalone component. */
export function getAngular(state: ShadowState): string {
  return angular('box', '<div class="box"><ng-content></ng-content></div>', boxRule(state));
}

export function getTextAngular(state: ShadowState): string {
  return angular('text', `<p class="text">${markup(state.text.content)}</p>`, textRule(state));
}

/* ---- Python: Flet ---- */

const pyColor = (hex: string) => `"#${hexToColorObj(hex).hex.toLowerCase()}"`;
const fletShadow = (l: ShadowLayer, pad: string, spread: boolean) =>
  `${pad}ft.BoxShadow(\n` +
  (spread ? `${pad}    spread_radius=${l.spread},\n` : '') +
  `${pad}    blur_radius=${l.blur},\n` +
  `${pad}    color=ft.Colors.with_opacity(${l.opacity}, ${pyColor(l.color)}),\n` +
  `${pad}    offset=ft.Offset(${l.horizontal}, ${l.vertical}),\n${pad}),\n`;

/**
 * Flet `Container` with every outer layer in `shadow`. Flet's `BoxShadow` has no inset (its
 * `BlurStyle.INNER` blurs inside the shadow shape, which the box then covers), so inset layers are left out.
 */
export function getFlet(state: ShadowState): string {
  const layers = visibleLayers(state);
  const r = state.boxProperties.borderRadius;
  let code = 'import flet as ft\n\n';
  if (layers.some((l) => l.inset)) code += "# Flet's BoxShadow has no inset: the inset layers are left out.\n";
  if (state.backgroundLayers.length)
    code += '# Gradients not exported: use Container.gradient (ft.LinearGradient / ft.RadialGradient).\n';
  code += `box = ft.Container(\n    bgcolor=${pyColor(state.boxProperties.backgroundColor)},\n`;
  if (r > 0) code += `    border_radius=${r},\n`;
  code += `    shadow=[\n${layers
    .filter((l) => !l.inset)
    .map((l) => fletShadow(l, '        ', true))
    .join('')}    ],\n)`;
  return code;
}

/** Flet `Text` with every text layer in `TextStyle.shadow` (no spread, no inset). */
export function getTextFlet(state: ShadowState): string {
  const { content, font, size, weight, color } = state.text;
  return (
    'import flet as ft\n\n' +
    droppedNote(state, '#') +
    `text = ft.Text(\n    ${str(content)},\n    style=ft.TextStyle(\n        font_family=${str(font)},\n        size=${size},\n` +
    `        weight=ft.FontWeight.W_${weight},\n        color=${pyColor(color)},\n` +
    `        shadow=[\n${textLayers(state)
      .map((l) => fletShadow(l, '            ', false))
      .join('')}        ],\n    ),\n)`
  );
}

/* ---- Python: PySide6 / PyQt6 ---- */

const QT_NOTE =
  '# Qt draws a single drop shadow, with no spread and no inset: the first visible outer layer is exported.\n' +
  '# PyQt6: the same code, importing from PyQt6 instead of PySide6.\n';

function qtShadow(l: ShadowLayer | undefined, target: string): string {
  if (!l) return '# No visible outer layer: there is no shadow to export.';
  const c = hexToColorObj(l.color).hex;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16));
  return (
    `shadow = QGraphicsDropShadowEffect(${target})\nshadow.setBlurRadius(${l.blur})\n` +
    `shadow.setOffset(${l.horizontal}, ${l.vertical})\n` +
    `shadow.setColor(QColor(${r}, ${g}, ${b}, ${Math.round(l.opacity * 255)}))\n${target}.setGraphicsEffect(shadow)`
  );
}

/** PySide6 / PyQt6: a `QFrame` styled by a style sheet, with a `QGraphicsDropShadowEffect`. */
export function getQt(state: ShadowState): string {
  const { borderRadius: r, backgroundColor } = state.boxProperties;
  const css = `background-color: ${backgroundColor};${r > 0 ? ` border-radius: ${r}px;` : ''}`;
  return (
    QT_NOTE +
    (state.backgroundLayers.length
      ? '# Gradients not exported: use qlineargradient / qradialgradient in the style sheet.\n'
      : '') +
    'from PySide6.QtGui import QColor\nfrom PySide6.QtWidgets import QFrame, QGraphicsDropShadowEffect\n\n' +
    `box = QFrame()\nbox.setObjectName("box")  # so the style sheet skips child widgets\n` +
    `box.setStyleSheet("#box { ${css} }")\n\n${qtShadow(visibleLayers(state).find((l) => !l.inset), 'box')}`
  );
}

const QT_WEIGHTS: Record<number, string> = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Normal',
  500: 'Medium',
  600: 'DemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
};

/** PySide6 / PyQt6 `QLabel` (plain text, so markup in it stays text) with the first text layer. */
export function getTextQt(state: ShadowState): string {
  const { content, font, size, weight, color } = state.text;
  return (
    QT_NOTE +
    'from PySide6.QtCore import Qt\nfrom PySide6.QtGui import QColor, QFont\n' +
    'from PySide6.QtWidgets import QGraphicsDropShadowEffect, QLabel\n\n' +
    `label = QLabel(${str(content)})\nlabel.setTextFormat(Qt.TextFormat.PlainText)\n` +
    `font = QFont(${str(font)})\nfont.setPixelSize(${size})\nfont.setWeight(QFont.Weight.${QT_WEIGHTS[weight] ?? 'Normal'})\n` +
    `label.setFont(font)\nlabel.setStyleSheet("color: ${color};")\n\n${qtShadow(textLayers(state)[0], 'label')}`
  );
}
