<script lang="ts">
  import { state, ui, actions } from '../state.svelte';
  import type { PresetName } from '../shadow';
  import type { PreviewContext } from '../types';

  const presets: { name: PresetName; label: string }[] = [
    { name: 'soft', label: 'Soft' },
    { name: 'neumorphism', label: 'Neumorph' },
    { name: 'cristal', label: 'Glass' },
  ];
  const contexts: { id: PreviewContext; label: string }[] = [
    { id: 'box', label: 'Caixa' },
    { id: 'card', label: 'Card' },
    { id: 'button', label: 'Botão' },
  ];
  // Quick canvases to judge the same shadow on a light and on a dark app surface.
  const grounds = [
    { color: '#e9eef0', label: 'Claro' },
    { color: '#16181d', label: 'Escuro' },
  ];
</script>

<div id="toolbar" class="stage-bar">
  <div class="bar-group" role="group" aria-labelledby="presets-label">
    <span class="bar-label" id="presets-label">Começar de</span>
    <div class="button-row">
      {#each presets as p (p.name)}
        <button type="button" class="btn btn-quiet" onclick={() => actions.applyPreset(p.name)}>
          {p.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="bar-group">
    <label class="bar-label" for="preview-context">Elemento</label>
    <select id="preview-context" bind:value={ui.context}>
      {#each contexts as c (c.id)}
        <option value={c.id}>{c.label}</option>
      {/each}
    </select>
  </div>

  <div class="bar-group" role="group" aria-labelledby="ground-label">
    <span class="bar-label" id="ground-label">Fundo</span>
    <div class="button-row">
      {#each grounds as g (g.color)}
        <button
          type="button"
          class="btn btn-quiet"
          aria-pressed={state.boxProperties.canvasColor === g.color ? 'true' : 'false'}
          onclick={() => actions.update('canvasColor', g.color)}>{g.label}</button
        >
      {/each}
    </div>
    <input
      type="color"
      id="bg-color-picker"
      aria-label="Cor do fundo da prancha"
      value={state.boxProperties.canvasColor}
      oninput={(e) => actions.update('canvasColor', (e.target as HTMLInputElement).value)}
    />
    <label class="check">
      <input type="checkbox" bind:checked={ui.guides} />
      <span>Cotas</span>
    </label>
  </div>
</div>
