/**
 * state.svelte.ts
 * Reactive singleton state (Svelte 5 runes) wrapping the pure logic in `shadow.ts`.
 * Components import `state`, `ui` and `actions`; mutating `state` re-renders the UI,
 * which replaces the manual `refreshView()` wiring of the old MVC controller.
 * It also restores the session (share link first, then the last visit), saves it, and keeps
 * the undo/redo history.
 */
import * as core from './shadow';
import { encodeState, decodeState } from './share';
import { createHistory } from './history';
import type { CodeMode, PreviewContext, ShadowLayer, ShadowState } from './types';

const STORAGE_KEY = 'layered-shade:v1';

/** Share link (`#s=…`) wins over the saved session; the hash is dropped so a reload keeps edits. */
function initialState(): ShadowState {
  try {
    const hash = /[#&]s=([\w-]+)/.exec(location.hash)?.[1];
    if (hash) {
      history.replaceState(null, '', location.pathname + location.search);
      const shared = decodeState(hash);
      if (shared) return shared;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    const restored = saved ? decodeState(saved) : null;
    if (restored) return restored;
  } catch {
    // Storage blocked (private mode, sandbox): start from the default.
  }
  return core.createInitialState();
}

export const state: ShadowState = $state(initialState());

export const ui = $state<{
  mode: CodeMode;
  sidebar: 'shadow' | 'background';
  /** Grid and dimension lines on the preview stage. */
  guides: boolean;
  context: PreviewContext;
  cssFormat: 'props' | 'var';
  twFormat: 'classes' | 'theme';
}>({
  mode: 'css',
  sidebar: 'shadow',
  guides: true,
  context: 'box',
  cssFormat: 'props',
  twFormat: 'classes',
});

/* ---- Undo / redo and persistence ---- */

const past = createHistory(50);
export const historyFlags = $state({ canUndo: false, canRedo: false });

let committed = encodeState(state); // state at the last history point
let burst: ReturnType<typeof setTimeout> | undefined;
let restoring = false;

$effect.root(() => {
  $effect(() => {
    const now = encodeState(state);
    try {
      localStorage.setItem(STORAGE_KEY, now);
    } catch {
      // Saving is a convenience; the tool works without it.
    }
    if (restoring) {
      restoring = false;
      committed = now;
    } else if (now !== committed) {
      // A slider drag is one step: record where we were when the burst of changes began.
      if (!burst) past.record(committed);
      clearTimeout(burst);
      burst = setTimeout(() => {
        burst = undefined;
        committed = encodeState(state);
      }, 400);
    }
    historyFlags.canUndo = past.canUndo;
    historyFlags.canRedo = past.canRedo;
  });
});

function restore(token: string | undefined) {
  const next = token ? decodeState(token) : null;
  if (!next) return;
  clearTimeout(burst);
  burst = undefined;
  restoring = true;
  Object.assign(state, next);
}

export const actions = {
  update: (key: string, value: unknown) => core.update(state, key, value),
  reset: () => core.reset(state),
  addLayer: () => core.addLayer(state),
  removeLayer: (index: number) => core.removeLayer(state, index),
  selectLayer: (index: number) => core.selectLayer(state, index),
  duplicateLayer: (index: number) => core.duplicateLayer(state, index),
  moveLayer: (index: number, step: -1 | 1) => core.moveLayer(state, index, step),
  setLayerHidden: (index: number, hidden: boolean) => core.setLayerHidden(state, index, hidden),
  setLayers: (layers: ShadowLayer[]) => core.setLayers(state, layers),
  addBackgroundLayer: (type: 'linear' | 'radial' = 'linear') =>
    core.addBackgroundLayer(state, type),
  removeBackgroundLayer: (index: number) => core.removeBackgroundLayer(state, index),
  selectBackgroundLayer: (index: number) => core.selectBackgroundLayer(state, index),
  applyPreset: (name: core.PresetName) => core.applyPreset(state, name),
  undo: () => restore(past.undo(burst ? encodeState(state) : committed)),
  redo: () => restore(past.redo(burst ? encodeState(state) : committed)),
  /** Absolute link that reopens exactly this shadow. */
  shareUrl: () => `${location.origin}${location.pathname}#s=${encodeState(state)}`,
};

export const TAB_LABELS: Record<CodeMode, string> = {
  css: 'CSS',
  tailwind: 'Tailwind',
  dart: 'Dart',
  compose: 'Compose',
  swiftui: 'SwiftUI',
  rn: 'React Native',
};
