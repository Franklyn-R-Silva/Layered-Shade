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
    expect(twTab?.classList.contains('active')).toBe(true);
    // The tailwind panel should be the active one.
    const twPanel = host.querySelector('#tailwind-rule');
    expect(twPanel?.closest('.tab-content')?.classList.contains('active')).toBe(true);
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
