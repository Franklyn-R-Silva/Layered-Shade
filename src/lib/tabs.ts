/**
 * Keyboard support for an ARIA tablist (WAI-ARIA tabs pattern, automatic activation):
 * Left/Right wrap around, Home/End jump to the ends. Attach to the tablist's `onkeydown`.
 */
export function tabKeydown<T>(
  e: KeyboardEvent,
  ids: readonly T[],
  current: T,
  select: (id: T) => void,
): void {
  const n = ids.length;
  const i = ids.indexOf(current);
  const keys: Record<string, number> = {
    ArrowRight: (i + 1) % n,
    ArrowLeft: (i - 1 + n) % n,
    Home: 0,
    End: n - 1,
  };
  const next = keys[e.key];
  if (next === undefined) return;
  e.preventDefault();
  select(ids[next]);
  const tabs = (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="tab"]');
  tabs[next]?.focus();
}
