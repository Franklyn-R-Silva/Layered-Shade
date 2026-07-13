<script lang="ts">
  import { state, actions } from '../state.svelte';

  function selectKey(e: KeyboardEvent, i: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      actions.selectLayer(i);
    }
  }
</script>

<div class="layer-controls-header">
  <h3>Camadas</h3>
  <button class="layer-btn add" title="Adicionar Camada" onclick={() => actions.addLayer()}>+</button>
</div>
<div class="layers-list">
  {#each state.layers as _layer, i (i)}
    <div
      class="layer-item {i === state.currentLayerIndex ? 'active' : ''}"
      role="button"
      tabindex="0"
      onclick={() => actions.selectLayer(i)}
      onkeydown={(e) => selectKey(e, i)}
    >
      <span class="layer-name">Camada {i + 1}</span>
      <button
        class="remove-layer-btn"
        title="Remover Camada"
        onclick={(e) => {
          e.stopPropagation();
          actions.removeLayer(i);
        }}
      >
        ×
      </button>
    </div>
  {/each}
</div>
