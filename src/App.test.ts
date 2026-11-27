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
    // The tailwind panel is the only visible one.
    const twPanel = host.querySelector('#tailwind-rule')?.closest('[role="tabpanel"]') as HTMLElement;
    expect(twPanel.hidden).toBe(false);
    expect((host.querySelector('#panel-css') as HTMLElement).hidden).toBe(true);
  });

  it('moves between code tabs with the arrow keys', () => {
    render();
    const list = host.querySelector('.code-tabs') as HTMLElement;
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    flushSync();
    expect(ui.mode).toBe('dart');
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    flushSync();
    expect(ui.mode).toBe('tailwind');
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
});
