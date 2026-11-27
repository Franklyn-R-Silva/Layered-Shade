/**
 * App integration test — mounts the real component tree and verifies that
 * Svelte reactivity wires the UI to the shared state (the main migration risk).
 */
import { mount, unmount, flushSync } from 'svelte';
import { describe, it, expect, afterEach } from 'vitest';
import App from './App.svelte';
import { state, ui, actions } from './lib/state.svelte';
import { reset } from './lib/shadow';

describe('App (integration)', () => {
  let host: HTMLDivElement;
  let app: ReturnType<typeof mount> | undefined;

  afterEach(() => {
    if (app) unmount(app);
    host?.remove();
    reset(state);
    ui.mode = 'css';
    ui.sidebar = 'shadow';
    ui.context = 'box';
    ui.cssFormat = 'props';
  });

  function render() {
    reset(state);
    ui.mode = 'css';
    ui.sidebar = 'shadow';
    host = document.createElement('div');
    document.body.appendChild(host);
    app = mount(App, { target: host });
    flushSync();
    return host;
  }

  it('renders the preview box with a live box-shadow', () => {
    render();
    const box = host.querySelector('#box') as HTMLElement;
    expect(box).toBeTruthy();
    expect(box.style.boxShadow.length).toBeGreaterThan(0);
    expect(box.style.boxShadow).toContain('rgba');
  });

  it('reacts to adding a shadow layer', () => {
    render();
    expect(host.querySelectorAll('#layer-controls-container .layer-item').length).toBe(1);
    actions.addLayer();
    flushSync();
    expect(host.querySelectorAll('#layer-controls-container .layer-item').length).toBe(2);
  });

  it('switches the active code tab reactively', () => {
    render();
    ui.mode = 'tailwind';
    flushSync();
    const twTab = [...host.querySelectorAll('.tab-btn')].find(
      (b) => b.textContent?.trim() === 'Tailwind',
    );
    expect(twTab?.getAttribute('aria-selected')).toBe('true');
    // One shared panel now shows the Tailwind code only.
    expect(host.querySelector('#tailwind-rule')?.closest('[role="tabpanel"]')).toBeTruthy();
    expect(host.querySelector('#rule')).toBeNull();
  });

  it('moves between code tabs with the arrow keys', () => {
    render();
    const list = host.querySelector('.code-tabs') as HTMLElement;
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    flushSync();
    expect(ui.mode).toBe('tailwind');
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    flushSync();
    expect(ui.mode).toBe('rn');
  });

  it('shows the CSS exactly as it is copied, marking the selected layer', () => {
    render();
    actions.addLayer();
    flushSync();
    const lines = [...host.querySelectorAll('#rule .code-line')].map((l) => l.textContent);
    expect(lines[0]).toBe('box-shadow:');
    expect(lines.filter((l) => l?.startsWith('  '))).toHaveLength(2);
    expect(host.querySelector('#rule .code-line.current')?.textContent).toBe(lines[2]);
  });

  it('hides the dimension lines when Cotas is off', () => {
    render();
    expect(host.querySelector('.dims')).toBeTruthy();
    ui.guides = false;
    flushSync();
    expect(host.querySelector('.dims')).toBeFalsy();
    ui.guides = true;
  });

  it('renders background-layer controls with correct <select> values', () => {
    render();
    ui.sidebar = 'background';
    actions.addBackgroundLayer('radial');
    flushSync();

    const typeSelect = host.querySelector('#bg-type-select') as HTMLSelectElement;
    expect(typeSelect).toBeTruthy();
    // This is the key check: the <select> must reflect the layer's actual type.
    expect(typeSelect.value).toBe('radial');

    // Radial layers expose the size <select>.
    const sizeSelect = host.querySelector('#bg-radial-size') as HTMLSelectElement;
    expect(sizeSelect).toBeTruthy();
  });

  it('shows the Flutter inset note only on the Dart tab when inset is on', () => {
    render();
    actions.update('inset', true);
    ui.mode = 'dart';
    flushSync();
    expect(host.querySelector('#dart-install-info')).toBeTruthy();

    ui.mode = 'css';
    flushSync();
    expect(host.querySelector('#dart-install-info')).toBeFalsy();
  });

  it('leaves hidden layers out of the preview and the code', () => {
    render();
    actions.addLayer();
    actions.setLayerHidden(0, true);
    flushSync();
    expect(host.querySelectorAll('#rule .code-line').length).toBe(3); // box-shadow:, 1 layer, background
    expect(host.querySelector('.layer-item.muted')).toBeTruthy();
    actions.setLayerHidden(1, true);
    flushSync();
    expect(host.querySelector('#rule')?.textContent).toContain('box-shadow: none;');
  });

  it('undoes and redoes an edit', () => {
    render();
    const before = state.layers[0].blur;
    actions.update('blur', 77);
    flushSync();
    actions.undo();
    flushSync();
    expect(state.layers[0].blur).toBe(before);
    actions.redo();
    flushSync();
    expect(state.layers[0].blur).toBe(77);
  });

  it('imports a pasted box-shadow and reports what it could not read', () => {
    render();
    const area = host.querySelector('#import-css') as HTMLTextAreaElement;
    const importBtn = [...host.querySelectorAll('.tool button')].find((b) =>
      b.textContent?.includes('Importar e substituir'),
    ) as HTMLButtonElement;

    area.value = 'banana';
    area.dispatchEvent(new Event('input', { bubbles: true }));
    flushSync();
    importBtn.click();
    flushSync();
    expect(host.querySelector('#import-status')?.textContent).toContain('Não reconheci');

    area.value = 'box-shadow: 0 1px 2px #0003, 0 8px 24px rgba(0,0,0,.12);';
    area.dispatchEvent(new Event('input', { bubbles: true }));
    flushSync();
    importBtn.click();
    flushSync();
    expect(state.layers).toHaveLength(2);
    expect(state.layers[1]).toMatchObject({ vertical: 8, blur: 24, opacity: 0.12 });
  });

  it('draws the shadow on a card at its real size', () => {
    render();
    ui.context = 'card';
    flushSync();
    const box = host.querySelector('#box') as HTMLElement;
    expect(box.classList.contains('sample-card')).toBe(true);
    expect((box.parentElement as HTMLElement).style.width).toBe('280px');
    expect(box.getAttribute('aria-label')).toContain('Card');
  });
});
