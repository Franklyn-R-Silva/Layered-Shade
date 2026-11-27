/**
 * App integration test — mounts the real component tree and verifies that
 * Svelte reactivity wires the UI to the shared state (the main migration risk).
 */
import { mount, unmount, flushSync } from 'svelte';
import { describe, it, expect, afterEach, vi } from 'vitest';
import App from './App.svelte';
import { state, ui, actions } from './lib/state.svelte';
import { reset } from './lib/shadow';
import { setLang } from './lib/i18n.svelte';
import { image, SAMPLE_IMAGE } from './lib/image.svelte';

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
    Object.assign(image, { src: SAMPLE_IMAGE, name: '', width: 200 });
  });

  function render() {
    setLang('pt'); // happy-dom reports en-US; these checks read the pt-BR copy
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

  it('switches the UI to English and back from the top bar', () => {
    render();
    const toggle = () => host.querySelector('.topbar button[lang]') as HTMLButtonElement;
    const text = (sel: string) => host.querySelector(sel)?.textContent?.trim();
    expect(toggle().textContent).toBe('EN');
    expect(toggle().getAttribute('aria-label')).toBe('EN: Switch to English');
    expect(toggle().getAttribute('lang')).toBe('en');

    toggle().click();
    flushSync();
    expect(document.documentElement.lang).toBe('en');
    expect(text('.bar-btn-label span')).toBe('Copy link');
    expect(text('#tab-shadow')).toBe('Shadow');
    expect(text('#copiarTexto')).toBe('Copy CSS');
    expect(text('#layers-title')).toBe('Shadow layers');
    expect(toggle().textContent).toBe('PT');
    expect(toggle().getAttribute('aria-label')).toBe('PT: Mudar para português');
    expect(toggle().getAttribute('lang')).toBe('pt-BR');

    toggle().click();
    flushSync();
    expect(document.documentElement.lang).toBe('pt-BR');
    expect(text('.bar-btn-label span')).toBe('Copiar link');
    expect(text('#tab-shadow')).toBe('Sombra');
    expect(text('#copiarTexto')).toBe('Copiar CSS');
    expect(text('#layers-title')).toBe('Camadas de sombra');
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

  it('applies the layers as text-shadow to the typed text and exports it', () => {
    render();
    const select = host.querySelector('#preview-context') as HTMLSelectElement;
    expect([...select.options].map((o) => o.textContent)).toContain('Texto');
    ui.context = 'text';
    flushSync();
    expect(host.querySelector('#box')).toBeNull();

    const input = host.querySelector('#text-content') as HTMLInputElement;
    input.value = 'AMOR ❤';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    actions.addLayer();
    flushSync();
    const sample = host.querySelector('#text-sample') as HTMLElement;
    expect(sample.textContent).toBe('AMOR ❤');
    expect(sample.style.textShadow).toContain('rgba');

    const css = host.querySelector('#rule')?.textContent;
    expect(css).toContain('font-family: "Overpass", sans-serif;');
    expect(css).toContain('text-shadow:');
    expect(host.querySelector('#rule .code-line.current')?.textContent).toMatch(/^ {2}5px 5px 10px rgba\(0, 0, 0, 0\.5\);$/);

    ui.mode = 'dart';
    flushSync();
    expect(host.querySelector('#dart-rule')?.textContent).toContain("'AMOR ❤'");

    // An empty field keeps the last text: an empty one would not restore from the saved session.
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    flushSync();
    expect(state.text.content).toBe('AMOR ❤');
  });

  it('draws the layers as a drop-shadow filter on the sample image, then on a chosen file', async () => {
    render();
    const select = host.querySelector('#preview-context') as HTMLSelectElement;
    expect([...select.options].map((o) => o.textContent)).toContain('Imagem');
    ui.context = 'image';
    flushSync();
    expect(host.querySelector('#box')).toBeNull();
    expect(host.querySelector('#shape-title')).toBeNull(); // no radius: the shadow follows the outline
    const img = host.querySelector('#image-sample') as HTMLImageElement;
    expect(img.getAttribute('src')).toMatch(/^data:image\/svg\+xml,/);
    expect(img.alt).toBe('Imagem de exemplo');
    expect(img.style.filter).toContain('drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))');
    expect(host.querySelector('.stage-caption')?.textContent).toContain('sem spread e sem inset');

    const width = host.querySelector('#image-width') as HTMLInputElement;
    width.value = '900';
    width.dispatchEvent(new Event('input', { bubbles: true }));
    flushSync();
    expect(img.getAttribute('width')).toBe('480');

    // Read locally with FileReader as a data: URL.
    const input = host.querySelector('#image-file') as HTMLInputElement;
    const file = new File([new Uint8Array([137, 80, 78, 71])], 'logo.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await vi.waitFor(() => expect(img.getAttribute('src')).toMatch(/^data:image\/png;base64,/));
    flushSync();
    expect(img.alt).toBe('logo.png');
    expect(host.querySelector('[aria-labelledby="image-title"] [role="status"]')?.textContent).toContain('logo.png');
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

  it('drags the selected layer on the stage 1:1, clamped to ±100, as one undo step', async () => {
    render();
    actions.addLayer(); // the drag must move layer 2 only, and undo must keep this new layer
    flushSync();
    const stage = host.querySelector('.stage') as HTMLElement;
    const pointer = (type: string, clientX: number, clientY: number) => {
      stage.dispatchEvent(new PointerEvent(type, { clientX, clientY, pointerId: 1, button: 0, bubbles: true }));
      flushSync();
    };

    pointer('pointerdown', 100, 100);
    pointer('pointermove', 130, 90);
    expect(state.layers[1]).toMatchObject({ horizontal: 35, vertical: -5 });
    await new Promise((r) => setTimeout(r, 450)); // pause longer than the 400ms undo burst
    pointer('pointermove', 400, -300);
    pointer('pointerup', 400, -300);
    expect(state.layers[1]).toMatchObject({ horizontal: 100, vertical: -100 });
    expect(state.layers[0]).toMatchObject({ horizontal: 5, vertical: 5 });

    actions.undo();
    flushSync();
    expect(state.layers).toHaveLength(2);
    expect(state.layers[1]).toMatchObject({ horizontal: 5, vertical: 5 });
  });
});
