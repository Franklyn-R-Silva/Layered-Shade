/**
 * state.svelte.ts
 * Reactive singleton state (Svelte 5 runes) wrapping the pure logic in `shadow.ts`.
 * Components import `state`, `ui` and `actions`; mutating `state` re-renders the UI,
 * which replaces the manual `refreshView()` wiring of the old MVC controller.
 */
import * as core from './shadow';
import type { CodeMode, ShadowState } from './types';

export const state: ShadowState = $state(core.createInitialState());

export const ui = $state<{ mode: CodeMode; sidebar: 'shadow' | 'background' }>({
  mode: 'css',
  sidebar: 'shadow',
});

export const actions = {
  update: (key: string, value: unknown) => core.update(state, key, value),
  reset: () => core.reset(state),
  addLayer: () => core.addLayer(state),
  removeLayer: (index: number) => core.removeLayer(state, index),
  selectLayer: (index: number) => core.selectLayer(state, index),
  addBackgroundLayer: (type: 'linear' | 'radial' = 'linear') =>
    core.addBackgroundLayer(state, type),
  removeBackgroundLayer: (index: number) => core.removeBackgroundLayer(state, index),
  selectBackgroundLayer: (index: number) => core.selectBackgroundLayer(state, index),
  applyPreset: (name: core.PresetName) => core.applyPreset(state, name),
};

export const TAB_LABELS: Record<CodeMode, string> = {
  css: 'CSS',
  dart: 'Dart',
  tailwind: 'Tailwind',
};
