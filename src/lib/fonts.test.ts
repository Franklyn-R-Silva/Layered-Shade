import { describe, it, expect, vi, afterEach } from 'vitest';
import { googleCssUrl, googleCatalog, listLocalFonts, canListLocalFonts } from './fonts';

afterEach(() => vi.unstubAllGlobals());

describe('fonts', () => {
  it('builds the Google Fonts CSS2 URL for variable and static weights', () => {
    expect(googleCssUrl({ family: 'Roboto', weights: '100..900' })).toBe(
      'https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap',
    );
    expect(googleCssUrl({ family: 'Playfair Display SC', weights: '400,700,900' })).toBe(
      'https://fonts.googleapis.com/css2?family=Playfair+Display+SC:wght@400;700;900&display=swap',
    );
  });

  it('reads the bundled catalogue once and retries after a failure', async () => {
    const ok = { ok: true, json: async () => ({ families: [['Lobster', 'd', '400'], ['Inter', 's', '100..900']] }) };
    const fetchMock = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(ok);
    vi.stubGlobal('fetch', fetchMock);
    await expect(googleCatalog()).rejects.toThrow('offline');
    const list = await googleCatalog();
    expect(list).toEqual([
      { family: 'Lobster', weights: '400' },
      { family: 'Inter', weights: '100..900' },
    ]);
    await googleCatalog();
    expect(fetchMock).toHaveBeenCalledTimes(2); // cached after the first success
    expect(fetchMock).toHaveBeenCalledWith('/google-fonts.json');
  });

  it('lists installed families once each, sorted, when the browser can', async () => {
    expect(canListLocalFonts()).toBe(false);
    vi.stubGlobal('queryLocalFonts', async () => [
      { family: 'Ubuntu' },
      { family: 'Arial' },
      { family: 'Ubuntu' },
    ]);
    expect(canListLocalFonts()).toBe(true);
    expect(await listLocalFonts()).toEqual(['Arial', 'Ubuntu']);
  });
});
