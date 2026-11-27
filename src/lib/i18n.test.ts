/** Initial language: ?lang= → saved choice → browser language. Each case reloads the module. */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const KEY = 'layered-shade:lang';
// vi.resetModules() loads a fresh Svelte runtime, so wait a macrotask instead of flushSync.
const settle = () => new Promise((r) => setTimeout(r, 0));

async function load() {
  vi.resetModules();
  const mod = await import('./i18n.svelte');
  await settle();
  return mod;
}

describe('initial language', () => {
  beforeEach(() => {
    localStorage.clear();
    history.replaceState(null, '', '/');
  });

  it('?lang=en wins over the saved choice and stays in the URL', async () => {
    localStorage.setItem(KEY, 'pt');
    history.replaceState(null, '', '/?lang=en');
    const { i18n, t } = await load();
    expect(i18n.lang).toBe('en');
    expect(t('copyTab', { tab: 'CSS' })).toBe('Copy CSS');
    expect(document.documentElement.lang).toBe('en');
    expect(location.search).toBe('?lang=en');
  });

  it('then the saved choice, then the browser language (en-US in happy-dom)', async () => {
    localStorage.setItem(KEY, 'pt');
    const { i18n, t } = await load();
    expect(i18n.lang).toBe('pt');
    expect(t('copyTab', { tab: 'CSS' })).toBe('Copiar CSS');
    expect(document.documentElement.lang).toBe('pt-BR');

    localStorage.clear();
    expect((await load()).i18n.lang).toBe('en');
  });

  it('a switch is remembered and rewrites ?lang= so a reload keeps it', async () => {
    history.replaceState(null, '', '/?lang=en#s=abc');
    const { setLang } = await load();
    setLang('pt');
    expect(localStorage.getItem(KEY)).toBe('pt');
    expect(location.search).toBe('?lang=pt');
    expect(location.hash).toBe('#s=abc');
    expect((await load()).i18n.lang).toBe('pt');
  });
});
