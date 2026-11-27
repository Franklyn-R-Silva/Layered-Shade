<script lang="ts">
  import { state, ui, actions } from '../state.svelte';
  import type { PresetName } from '../shadow';
  import type { PreviewContext } from '../types';
  import { t } from '../i18n.svelte';

  // Preset names are the same in every language.
  const presets: { name: PresetName; label: string }[] = [
    { name: 'soft', label: 'Soft' },
    { name: 'neumorphism', label: 'Neumorph' },
    { name: 'cristal', label: 'Glass' },
  ];
  // Each id is also the key of its label.
  const contexts: PreviewContext[] = ['box', 'card', 'button', 'text', 'image'];
  // Quick canvases to judge the same shadow on a light and on a dark app surface.
  const grounds = [
    { color: '#e9eef0', label: 'light' },
    { color: '#16181d', label: 'dark' },
  ] as const;
</script>

<div id="toolbar" class="stage-bar">
  <div class="bar-group" role="group" aria-labelledby="presets-label">
    <span class="bar-label" id="presets-label">{t('startFrom')}</span>
    <div class="button-row">
      {#each presets as p (p.name)}
        <button type="button" class="btn btn-quiet" onclick={() => actions.applyPreset(p.name)}>
          {p.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="bar-group">
    <label class="bar-label" for="preview-context">{t('element')}</label>
    <select id="preview-context" bind:value={ui.context}>
      {#each contexts as c (c)}
        <option value={c}>{t(c)}</option>
      {/each}
    </select>
  </div>

  <div class="bar-group" role="group" aria-labelledby="ground-label">
    <span class="bar-label" id="ground-label">{t('canvas')}</span>
    <div class="button-row">
      {#each grounds as g (g.color)}
        <button
          type="button"
          class="btn btn-quiet"
          aria-pressed={state.boxProperties.canvasColor === g.color ? 'true' : 'false'}
          onclick={() => actions.update('canvasColor', g.color)}>{t(g.label)}</button
        >
      {/each}
    </div>
    <input
      type="color"
      id="bg-color-picker"
      aria-label={t('canvasColor')}
      value={state.boxProperties.canvasColor}
      oninput={(e) => actions.update('canvasColor', (e.target as HTMLInputElement).value)}
    />
    <label class="check">
      <input type="checkbox" bind:checked={ui.guides} />
      <span>{t('guides')}</span>
    </label>
  </div>
</div>
