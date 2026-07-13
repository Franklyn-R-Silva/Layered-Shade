<script lang="ts">
  import { state, actions } from '../state.svelte';
  import type { PresetName } from '../shadow';

  const presets: { name: PresetName; label: string; aria: string }[] = [
    { name: 'soft', label: 'Soft', aria: 'Aplicar preset Soft' },
    { name: 'neumorphism', label: 'Neumorph', aria: 'Aplicar preset Neumorphism' },
    { name: 'cristal', label: 'Glass', aria: 'Aplicar preset Glass' },
  ];
</script>

<nav id="toolbar" class="glass-panel" aria-label="Barra de ferramentas">
  <div class="toolbar-section">
    <span class="toolbar-label" id="templates-label">Templates:</span>
    <div class="presets-bar" role="group" aria-labelledby="templates-label">
      {#each presets as p (p.name)}
        <button class="preset-btn" aria-label={p.aria} onclick={() => actions.applyPreset(p.name)}>
          {p.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="toolbar-separator" aria-hidden="true"></div>

  <div class="toolbar-section">
    <span class="toolbar-label" id="colors-label">Fundo &amp; Objeto:</span>
    <div class="color-config" role="group" aria-labelledby="colors-label">
      <label title="Cor do Fundo (Canvas)" for="bg-color-picker">
        <span class="visually-hidden">Cor do fundo</span>
        <input
          type="color"
          id="bg-color-picker"
          value={state.boxProperties.canvasColor}
          aria-label="Selecionar cor do fundo"
          oninput={(e) => actions.update('canvasColor', (e.target as HTMLInputElement).value)}
        />
      </label>
    </div>
  </div>
</nav>
