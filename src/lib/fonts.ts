/**
 * Font sources for the text mode: installed fonts (Local Font Access API where the browser has it,
 * a curated list per OS otherwise) and the Google Fonts catalogue (same-origin JSON, loaded on
 * demand). A Google font is only fetched from Google when the user asks for it.
 */

export interface GoogleFont {
  family: string;
  /** `100..900` for a variable weight axis, otherwise the static weights, e.g. `400,700`. */
  weights: string;
}

/** Common families shipped with Windows, macOS and popular Linux desktops. */
export const SYSTEM_FONTS = [
  // Windows
  'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Candara', 'Comic Sans MS', 'Consolas',
  'Constantia', 'Corbel', 'Courier New', 'Franklin Gothic Medium', 'Gabriola', 'Georgia', 'Impact',
  'Lucida Console', 'Palatino Linotype', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Sitka', 'Sylfaen',
  'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana',
  // macOS
  'American Typewriter', 'Avenir', 'Avenir Next', 'Baskerville', 'Chalkboard', 'Didot', 'Futura',
  'Geneva', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Hoefler Text', 'Menlo', 'Monaco', 'Optima',
  'Palatino', 'Rockwell', 'SF Pro', 'Snell Roundhand',
  // Linux
  'Cantarell', 'DejaVu Sans', 'DejaVu Sans Mono', 'DejaVu Serif', 'Fira Sans', 'Liberation Mono',
  'Liberation Sans', 'Liberation Serif', 'Noto Sans', 'Noto Serif', 'Ubuntu', 'Ubuntu Mono',
];

let catalog: Promise<GoogleFont[]> | undefined;

/** The Google Fonts catalogue, fetched once from this site (public/google-fonts.json). */
export function googleCatalog(): Promise<GoogleFont[]> {
  catalog ??= fetch('/google-fonts.json')
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then((d: { families: [string, string, string][] }) => d.families.map(([family, , weights]) => ({ family, weights })))
    .catch((e) => {
      catalog = undefined; // let a later attempt retry
      throw e;
    });
  return catalog;
}

/** Google Fonts CSS2 URL for every weight the family has. */
export function googleCssUrl(font: GoogleFont): string {
  const family = encodeURIComponent(font.family).replace(/%20/g, '+');
  const weights = font.weights.includes('..') ? font.weights : font.weights.split(',').join(';');
  return `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap`;
}

/** Adds the family's stylesheet once and waits until the font can render. */
export async function loadGoogleFont(font: GoogleFont): Promise<void> {
  const href = googleCssUrl(font);
  if (!document.querySelector(`link[data-google-font="${CSS.escape(font.family)}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.googleFont = font.family;
    await new Promise<void>((resolve, reject) => {
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Could not load ${font.family}`));
      document.head.append(link);
    });
  }
  await document.fonts.load(`32px "${font.family}"`);
}

type LocalFontData = { family: string };
type FontQuery = () => Promise<LocalFontData[]>;

/** True when the browser can list installed fonts (Chromium: Local Font Access API). */
export const canListLocalFonts = () => typeof (window as unknown as { queryLocalFonts?: FontQuery }).queryLocalFonts === 'function';

/** Families installed on this computer, sorted and unique; asks the browser's permission. */
export async function listLocalFonts(): Promise<string[]> {
  const query = (window as unknown as { queryLocalFonts: FontQuery }).queryLocalFonts;
  const fonts = await query();
  return [...new Set(fonts.map((f) => f.family))].sort((a, b) => a.localeCompare(b));
}
