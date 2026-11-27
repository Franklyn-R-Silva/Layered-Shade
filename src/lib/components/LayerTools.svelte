<script lang="ts">
  import { actions } from '../state.svelte';
  import { parseBoxShadow } from '../importCss';
  import { smoothLayers } from '../shadow';
  import Icon from './Icon.svelte';
  import { t } from '../i18n.svelte';

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
  <summary><Icon name="import" /> {t('importCss')}</summary>
  <div class="tool-body">
    <label for="import-css"
      >{t('importHintA')}<code>box-shadow</code>{t('importHintB')}<code>shadow-[…]</code>{t('importHintC')}</label
    >
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
      {t('importReplace')}
    </button>
    <p id="import-status" class="tool-status" class:failed={importStatus === 'error'} role="status">
      {#if importStatus === 'ok'}
        {imported === 1 ? t('importedOne') : t('importedMany', { n: imported })}
      {:else if importStatus === 'error'}
        {t('importFailed')}
      {/if}
    </p>
  </div>
</details>

<details class="tool">
  <summary><Icon name="layers" /> {t('smoothShadow')}</summary>
  <div class="tool-body">
    <p class="tool-hint">{t('smoothHint')}</p>
    <div class="field">
      <div class="field-head">
        <label for="smooth-count">{t('layers')}</label>
        <output class="readout" for="smooth-count">{count}</output>
      </div>
      <input type="range" id="smooth-count" min="2" max="8" bind:value={count} />
    </div>
    <div class="field">
      <div class="field-head">
        <label for="smooth-distance">{t('distance')}</label>
        <output class="readout" for="smooth-distance">{distance}px</output>
      </div>
      <input type="range" id="smooth-distance" min="2" max="100" bind:value={distance} />
    </div>
    <div class="field">
      <div class="field-head">
        <label for="smooth-intensity">{t('intensity')}</label>
        <output class="readout" for="smooth-intensity">{intensity}%</output>
      </div>
      <input type="range" id="smooth-intensity" min="5" max="100" bind:value={intensity} />
    </div>
    <div class="field field-inline">
      <label for="smooth-color">{t('color')}</label>
      <input type="color" id="smooth-color" bind:value={color} />
    </div>
    <button
      type="button"
      class="btn btn-block"
      onclick={() => actions.setLayers(smoothLayers({ count, distance, intensity, color }))}
    >
      {t('smoothReplace')}
    </button>
  </div>
</details>
