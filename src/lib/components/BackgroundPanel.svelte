<script lang="ts">
  import { state, actions } from '../state.svelte';
  import type { BackgroundLayer } from '../types';

  const activeLayer = $derived(
    state.currentBgLayerIndex >= 0 ? state.backgroundLayers[state.currentBgLayerIndex] : null,
  );

  function miniPreview(layer: BackgroundLayer): string {
    const first = layer.stops[0].color;
    const last = layer.stops[layer.stops.length - 1].color;
    return layer.type === 'linear'
      ? `linear-gradient(90deg, ${first}, ${last})`
      : `radial-gradient(circle, ${first}, ${last})`;
  }

  function selectKey(e: KeyboardEvent, i: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      actions.selectBackgroundLayer(i);
    }
  }

  function addStop() {
    activeLayer?.stops.push({ color: '#888888', position: 100 });
  }

  function removeStop(i: number) {
    if (!activeLayer) return;
    if (activeLayer.stops.length <= 2) {
      alert('Mínimo 2 cores necessárias.');
      return;
    }
    activeLayer.stops.splice(i, 1);
  }
</script>

<h2>Camadas de Fundo:</h2>

<div id="background-layers-container">
  <div class="layer-controls-header">
    <h3>Gradientes ({state.backgroundLayers.length})</h3>
    <button
      class="layer-btn add"
      title="Adicionar Gradiente"
      onclick={() => actions.addBackgroundLayer('linear')}>+</button
    >
  </div>
  <div class="layers-list">
    {#each state.backgroundLayers as layer, i (i)}
      <div
        class="layer-item {i === state.currentBgLayerIndex ? 'active' : ''}"
        role="button"
        tabindex="0"
        onclick={() => actions.selectBackgroundLayer(i)}
        onkeydown={(e) => selectKey(e, i)}
      >
        <div class="bg-preview-wrapper">
          <div class="bg-preview-swatch" style:background={miniPreview(layer)}></div>
          <span class="layer-name">{layer.type === 'linear' ? 'Linear' : 'Radial'}</span>
        </div>
        <button
          class="remove-layer-btn"
          onclick={(e) => {
            e.stopPropagation();
            actions.removeBackgroundLayer(i);
          }}>×</button
        >
      </div>
    {/each}
  </div>
</div>

<div id="bg-controls-wrapper">
  {#if activeLayer}
    <div class="bg-controls-group">
      <div class="control-header"><label for="bg-type-select">Tipo</label></div>
      <select
        id="bg-type-select"
        class="form-select bg-select-input"
        value={activeLayer.type}
        onchange={(e) => {
          if (activeLayer)
            activeLayer.type = (e.target as HTMLSelectElement).value as 'linear' | 'radial';
        }}
      >
        <option value="linear">Linear</option>
        <option value="radial">Radial</option>
      </select>

      {#if activeLayer.type === 'linear'}
        <div class="control-header control-header-margin">
          <label for="bg-angle-range">Ângulo: {activeLayer.angle}°</label>
        </div>
        <input
          type="range"
          id="bg-angle-range"
          min="0"
          max="360"
          value={activeLayer.angle}
          oninput={(e) => {
            if (activeLayer) activeLayer.angle = Number((e.target as HTMLInputElement).value);
          }}
        />
      {:else}
        <div class="bg-position-controls">
          <div class="bg-position-control">
            <label for="bg-pos-x">Posição X ({activeLayer.posX ?? 50}%)</label>
            <input
              type="range"
              id="bg-pos-x"
              min="0"
              max="100"
              value={activeLayer.posX ?? 50}
              oninput={(e) => {
                if (activeLayer) activeLayer.posX = Number((e.target as HTMLInputElement).value);
              }}
            />
          </div>
          <div class="bg-position-control">
            <label for="bg-pos-y">Posição Y ({activeLayer.posY ?? 50}%)</label>
            <input
              type="range"
              id="bg-pos-y"
              min="0"
              max="100"
              value={activeLayer.posY ?? 50}
              oninput={(e) => {
                if (activeLayer) activeLayer.posY = Number((e.target as HTMLInputElement).value);
              }}
            />
          </div>
        </div>
        <div class="control-header control-header-margin">
          <label for="bg-radial-size">Tamanho (Radial)</label>
        </div>
        <select
          id="bg-radial-size"
          class="form-select bg-select-input"
          value={activeLayer.size ?? 'farthest-corner'}
          onchange={(e) => {
            if (activeLayer) activeLayer.size = (e.target as HTMLSelectElement).value;
          }}
        >
          <option value="farthest-corner">Farthest Corner (Padrão)</option>
          <option value="closest-side">Closest Side</option>
          <option value="closest-corner">Closest Corner</option>
          <option value="farthest-side">Farthest Side</option>
        </select>
      {/if}

      <div class="bg-stops-header">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label>Cores (Stops)</label>
        <button class="bg-add-stop-btn" onclick={addStop}>+ Add Cor</button>
      </div>
      <div class="bg-stops-list">
        {#each activeLayer.stops as stop, i (i)}
          <div class="bg-stop-row">
            <input
              type="color"
              class="bg-stop-input"
              value={stop.color}
              title="Cor do Stop"
              oninput={(e) => (stop.color = (e.target as HTMLInputElement).value)}
            />
            <input
              type="range"
              class="bg-stop-slider"
              min="0"
              max="100"
              value={stop.position}
              title={`Posição: ${stop.position}%`}
              oninput={(e) => (stop.position = Number((e.target as HTMLInputElement).value))}
            />
            <button class="bg-remove-stop-btn" title="Remover cor" onclick={() => removeStop(i)}
              >×</button
            >
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <p class="bg-empty-state">Adicione uma camada de gradiente acima ou edite a cor base.</p>
  {/if}
</div>

<div class="color-mode-section">
  <label for="base-bg-picker">Cor Base (Sólida):</label>
  <input
    type="color"
    id="base-bg-picker"
    value={state.boxProperties.backgroundColor}
    aria-label="Selecionar cor base sólida"
    oninput={(e) => actions.update('backgroundColor', (e.target as HTMLInputElement).value)}
  />
</div>
