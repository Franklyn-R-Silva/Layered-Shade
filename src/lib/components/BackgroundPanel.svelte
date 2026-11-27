<script lang="ts">
  import { state, actions } from '../state.svelte';
  import type { BackgroundLayer } from '../types';
  import Icon from './Icon.svelte';

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

  function addStop() {
    activeLayer?.stops.push({ color: '#888888', position: 100 });
  }

  function removeStop(i: number) {
    if (activeLayer && activeLayer.stops.length > 2) activeLayer.stops.splice(i, 1);
  }
</script>

<section class="group" aria-labelledby="base-title">
  <h2 id="base-title">Cor base</h2>
  <div class="field field-inline">
    <label for="base-bg-picker">Cor sólida da caixa</label>
    <span class="color-pair">
      <input
        type="color"
        id="base-bg-picker"
        value={state.boxProperties.backgroundColor}
        oninput={(e) => actions.update('backgroundColor', (e.target as HTMLInputElement).value)}
      />
      <code class="hex hex-static">{state.boxProperties.backgroundColor}</code>
    </span>
  </div>
</section>

<section id="background-layers-container" class="group">
  <div class="panel-head">
    <h2 id="gradients-title">Gradientes</h2>
    <button type="button" class="btn btn-quiet" onclick={() => actions.addBackgroundLayer('linear')}>
      <Icon name="plus" /> Adicionar
    </button>
  </div>

  {#if state.backgroundLayers.length === 0}
    <p class="empty">Sem gradientes: a caixa usa só a cor base. Adicione um para empilhar gradientes sobre ela.</p>
  {:else}
    <ol class="layer-list" aria-labelledby="gradients-title">
      {#each state.backgroundLayers as layer, i (i)}
        <li class="layer-item" class:active={i === state.currentBgLayerIndex}>
          <button
            type="button"
            class="layer-select"
            aria-current={i === state.currentBgLayerIndex ? 'true' : undefined}
            onclick={() => actions.selectBackgroundLayer(i)}
          >
            <span class="layer-index" aria-hidden="true">{i + 1}</span>
            <span class="layer-name">{layer.type === 'linear' ? 'Linear' : 'Radial'}</span>
            <span class="gradient-swatch" aria-hidden="true" style:background={miniPreview(layer)}></span>
          </button>
          <button
            type="button"
            class="icon-btn"
            aria-label={`Remover gradiente ${i + 1}`}
            title="Remover gradiente"
            onclick={() => actions.removeBackgroundLayer(i)}
          >
            <Icon name="close" />
          </button>
        </li>
      {/each}
    </ol>
  {/if}
</section>

{#if activeLayer}
  <section class="group" aria-labelledby="gradient-title">
    <h2 id="gradient-title">Gradiente {state.currentBgLayerIndex + 1}</h2>
    <div class="fields">
      <div class="field field-inline">
        <label for="bg-type-select">Tipo</label>
        <select
          id="bg-type-select"
          value={activeLayer.type}
          onchange={(e) => {
            if (activeLayer)
              activeLayer.type = (e.target as HTMLSelectElement).value as 'linear' | 'radial';
          }}
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
      </div>

      {#if activeLayer.type === 'linear'}
        <div class="field">
          <div class="field-head">
            <label for="bg-angle-range">Ângulo</label>
            <output class="readout" for="bg-angle-range">{activeLayer.angle}°</output>
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
        </div>
      {:else}
        <div class="field">
          <div class="field-head">
            <label for="bg-pos-x">Posição X</label>
            <output class="readout" for="bg-pos-x">{activeLayer.posX ?? 50}%</output>
          </div>
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
        <div class="field">
          <div class="field-head">
            <label for="bg-pos-y">Posição Y</label>
            <output class="readout" for="bg-pos-y">{activeLayer.posY ?? 50}%</output>
          </div>
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
        <div class="field field-inline">
          <label for="bg-radial-size">Tamanho</label>
          <select
            id="bg-radial-size"
            value={activeLayer.size ?? 'farthest-corner'}
            onchange={(e) => {
              if (activeLayer) activeLayer.size = (e.target as HTMLSelectElement).value;
            }}
          >
            <option value="farthest-corner">Canto distante (padrão)</option>
            <option value="closest-side">Lado próximo</option>
            <option value="closest-corner">Canto próximo</option>
            <option value="farthest-side">Lado distante</option>
          </select>
        </div>
      {/if}
    </div>

    <div class="panel-head stops-head">
      <h3 id="stops-title">Cores</h3>
      <button type="button" class="btn btn-quiet" onclick={addStop}>
        <Icon name="plus" /> Cor
      </button>
    </div>
    <ol class="stop-list" aria-labelledby="stops-title">
      {#each activeLayer.stops as stop, i (i)}
        <li class="stop-row">
          <input
            type="color"
            value={stop.color}
            aria-label={`Cor ${i + 1}`}
            oninput={(e) => (stop.color = (e.target as HTMLInputElement).value)}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={stop.position}
            aria-label={`Posição da cor ${i + 1}`}
            aria-valuetext={`${stop.position}%`}
            oninput={(e) => (stop.position = Number((e.target as HTMLInputElement).value))}
          />
          <span class="readout" aria-hidden="true">{stop.position}%</span>
          <button
            type="button"
            class="icon-btn"
            aria-label={`Remover cor ${i + 1}`}
            title={activeLayer.stops.length <= 2 ? 'Um gradiente precisa de pelo menos 2 cores' : 'Remover cor'}
            disabled={activeLayer.stops.length <= 2}
            onclick={() => removeStop(i)}
          >
            <Icon name="close" />
          </button>
        </li>
      {/each}
    </ol>
  </section>
{/if}
