/** Session restore order: share link (#s=) → saved session → default. Each case reloads the module. */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { encodeState } from './share';
import { createInitialState } from './shadow';

const KEY = 'layered-shade:v1';
// vi.resetModules() loads a fresh Svelte runtime, so wait a macrotask instead of flushSync.
const settle = () => new Promise((r) => setTimeout(r, 0));

async function load() {
  vi.resetModules();
  const mod = await import('./state.svelte');
  await settle(); // let the save effect run before the next case touches storage
  expect(mod.STORAGE_KEY).toBe(KEY);
  return mod.state;
}

const withBlur = (blur: number) => {
  const s = createInitialState();
  s.layers[0].blur = blur;
  return encodeState(s);
};

describe('session restore', () => {
  beforeEach(() => {
    localStorage.clear();
    history.replaceState(null, '', '/');
  });

  it('a share link wins over the saved session, and the hash is cleared', async () => {
    localStorage.setItem(KEY, withBlur(11));
    history.replaceState(null, '', `/#s=${withBlur(22)}`);
    expect((await load()).layers[0].blur).toBe(22);
    expect(location.hash).toBe('');
  });

  it('a broken link falls back to the saved session, and broken storage to the default', async () => {
    localStorage.setItem(KEY, withBlur(11));
    history.replaceState(null, '', '/#s=broken');
    expect((await load()).layers[0].blur).toBe(11);

    localStorage.setItem(KEY, 'garbage');
    expect((await load()).layers[0].blur).toBe(createInitialState().layers[0].blur);
  });

  it('saves every change for the next visit', async () => {
    const state = await load();
    state.layers[0].blur = 33;
    await settle();
    expect(localStorage.getItem(KEY)).toBe(withBlur(33));
  });
});
