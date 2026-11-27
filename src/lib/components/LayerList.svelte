<script lang="ts">
  import { state, actions } from '../state.svelte';
  import { hexToRgba } from '../shadow';
  import { fmt } from '../format';
  import Icon from './Icon.svelte';
</script>

<div class="panel-head">
  <h2 id="layers-title">Camadas de sombra</h2>
  <button type="button" class="btn btn-quiet" onclick={() => actions.addLayer()}>
    <Icon name="plus" /> Adicionar
  </button>
</div>

<ol class="layer-list" aria-labelledby="layers-title">
  {#each state.layers as layer, i (i)}
    <li class="layer-item" class:active={i === state.currentLayerIndex}>
      <button
        type="button"
        class="layer-select"
        aria-current={i === state.currentLayerIndex ? 'true' : undefined}
        onclick={() => actions.selectLayer(i)}
      >
        <span class="layer-index" aria-hidden="true">{i + 1}</span>
        <span class="layer-text">
          <span class="layer-name">Camada {i + 1}{layer.inset ? ' (interna)' : ''}</span>
          <span class="layer-spec" aria-hidden="true"
            >{fmt(layer.horizontal)} {fmt(layer.vertical)} {fmt(layer.blur)} {fmt(layer.spread)} · {Math.round(
              layer.opacity * 100,
            )}%</span
          >
        </span>
        <span
          class="layer-swatch"
          aria-hidden="true"
          style:background-color={hexToRgba(layer.color, layer.opacity)}
        ></span>
      </button>
      <button
        type="button"
        class="icon-btn"
        aria-label={`Remover camada ${i + 1}`}
        title={state.layers.length <= 1 ? 'A sombra precisa de pelo menos uma camada' : 'Remover camada'}
        disabled={state.layers.length <= 1}
        onclick={() => actions.removeLayer(i)}
      >
        <Icon name="close" />
      </button>
    </li>
  {/each}
</ol>
