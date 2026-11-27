<script lang="ts">
  import { actions } from '../state.svelte';
  import { parseBoxShadow } from '../importCss';
  import { smoothLayers } from '../shadow';
  import Icon from './Icon.svelte';

  let css = $state('');
  let importStatus = $state<'idle' | 'ok' | 'error'>('idle');
  let imported = $state(0);

  function importCss() {
    const layers = parseBoxShadow(css);
    if (!layers) {
      importStatus = 'error';
      return;
    }
    actions.setLayers(layers);
    imported = layers.length;
    importStatus = 'ok';
  }

  let count = $state(5);
  let distance = $state(16);
  let intensity = $state(35);
  let color = $state('#17191e');
</script>

<details class="tool">
  <summary><Icon name="import" /> Importar CSS</summary>
  <div class="tool-body">
    <label for="import-css">Cole um <code>box-shadow</code>, uma regra CSS ou uma classe <code>shadow-[…]</code></label>
    <textarea
      id="import-css"
      rows="3"
      spellcheck="false"
      placeholder="box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.12);"
      bind:value={css}
      oninput={() => (importStatus = 'idle')}
      aria-describedby="import-status"
    ></textarea>
    <button type="button" class="btn btn-block" disabled={!css.trim()} onclick={importCss}>
      Importar e substituir camadas
    </button>
    <p id="import-status" class="tool-status" class:failed={importStatus === 'error'} role="status">
      {#if importStatus === 'ok'}
        {imported} {imported === 1 ? 'camada importada' : 'camadas importadas'}. Ctrl+Z desfaz.
      {:else if importStatus === 'error'}
        Não reconheci essa sombra. Use valores em px e cores em hex ou rgb(), separando camadas por vírgula.
      {/if}
    </p>
  </div>
</details>

<details class="tool">
  <summary><Icon name="layers" /> Gerar sombra suave</summary>
  <div class="tool-body">
    <p class="tool-hint">
      Várias camadas cujo deslocamento e desfoque dobram a cada uma: a queda suave que uma sombra só não
      consegue.
    </p>
    <div class="field">
      <div class="field-head">
        <label for="smooth-count">Camadas</label>
        <output class="readout" for="smooth-count">{count}</output>
      </div>
      <input type="range" id="smooth-count" min="2" max="8" bind:value={count} />
    </div>
    <div class="field">
      <div class="field-head">
        <label for="smooth-distance">Distância</label>
        <output class="readout" for="smooth-distance">{distance}px</output>
      </div>
      <input type="range" id="smooth-distance" min="2" max="100" bind:value={distance} />
    </div>
    <div class="field">
      <div class="field-head">
        <label for="smooth-intensity">Intensidade</label>
        <output class="readout" for="smooth-intensity">{intensity}%</output>
      </div>
      <input type="range" id="smooth-intensity" min="5" max="100" bind:value={intensity} />
    </div>
    <div class="field field-inline">
      <label for="smooth-color">Cor</label>
      <input type="color" id="smooth-color" bind:value={color} />
    </div>
    <button
      type="button"
      class="btn btn-block"
      onclick={() => actions.setLayers(smoothLayers({ count, distance, intensity, color }))}
    >
      Gerar e substituir camadas
    </button>
  </div>
</details>
