/** Number for display: a typographic minus sign instead of the hyphen (code output keeps ASCII). */
export const fmt = (n: number): string => (n < 0 ? `−${-n}` : `${n}`);
