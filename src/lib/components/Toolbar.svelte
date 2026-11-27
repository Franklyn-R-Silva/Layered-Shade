<script lang="ts">
  import { state, ui, actions } from '../state.svelte';
  import type { PresetName } from '../shadow';

  const presets: { name: PresetName; label: string }[] = [
    { name: 'soft', label: 'Soft' },
    { name: 'neumorphism', label: 'Neumorph' },
    { name: 'cristal', label: 'Glass' },
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
    <label class="bar-label" for="bg-color-picker">Fundo da prancha</label>
    <input
      type="color"
      id="bg-color-picker"
      value={state.boxProperties.canvasColor}
      oninput={(e) => actions.update('canvasColor', (e.target as HTMLInputElement).value)}
    />
    <label class="check">
      <input type="checkbox" bind:checked={ui.guides} />
      <span>Cotas</span>
    </label>
  </div>
</div>
