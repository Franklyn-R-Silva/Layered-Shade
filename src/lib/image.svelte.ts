/**
 * image.svelte.ts
 * Image mode (#75): the image the preview draws its drop shadow on. It lives only in this tab:
 * it is not part of ShadowState, share links or the saved session (too big, and private).
 */

// A star, so the drop shadow visibly follows an outline that is not a box.
const STAR =
  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">' +
  '<path d="M50 7L61.8 36.8 93.8 38.8 69 59.2 77 90.2 50 73 23 90.2 31 59.2 6.2 38.8 38.2 36.8Z" ' +
  'fill="#fff" stroke="#fff" stroke-width="6" stroke-linejoin="round"/></svg>';

/** Shown until the user picks a file. A data: URL, as the CSP allows `img-src data:` (not blob:). */
export const SAMPLE_IMAGE = `data:image/svg+xml,${encodeURIComponent(STAR)}`;

/**
 * `name` is the file name (the preview's alt text); empty for the sample. `width` is in CSS px.
 * `broken` is set when the browser could not draw the chosen file (the preview falls back to the sample).
 */
export const image = $state({ src: SAMPLE_IMAGE, name: '', width: 200, broken: false });
