<script lang="ts">
  import { state, ui, actions } from '../state.svelte';
  import { tabKeydown } from '../tabs';
  import LayerList from './LayerList.svelte';
  import ShadowControls from './ShadowControls.svelte';
  import ShapeControls from './ShapeControls.svelte';
  import BackgroundPanel from './BackgroundPanel.svelte';
  import Icon from './Icon.svelte';
  import LayerTools from './LayerTools.svelte';
  import TextControls from './TextControls.svelte';
  import { t } from '../i18n.svelte';

  // Each id is also the key of its tab label.
  const panels = [{ id: 'shadow' }, { id: 'background' }] as const;
  const ids = panels.map((p) => p.id);
</script>

<aside id="controls" class="column column-controls" aria-label={t('controls')}>
  <div
    class="segmented"
    role="tablist"
    aria-label={t('settingsPanels')}
    tabindex="-1"
    onkeydown={(e) => tabKeydown(e, ids, ui.sidebar, (id) => (ui.sidebar = id))}
  >
    {#each panels as p (p.id)}
      <button
        type="button"
        role="tab"
        id={`tab-${p.id}`}
        aria-controls={`panel-${p.id}`}
        aria-selected={ui.sidebar === p.id}
        tabindex={ui.sidebar === p.id ? 0 : -1}
        onclick={() => (ui.sidebar = p.id)}
      >
        {t(p.id)}
      </button>
    {/each}
  </div>

  <div
    class="tabpanel"
    role="tabpanel"
    id="panel-shadow"
    aria-labelledby="tab-shadow"
    hidden={ui.sidebar !== 'shadow'}
  >
    {#if ui.context === 'text'}<TextControls />{/if}
    <section id="layer-controls-container" class="group"><LayerList /><LayerTools /></section>

    <section class="group" aria-labelledby="layer-title">
      <h2 id="layer-title">{t('layerN', { n: state.currentLayerIndex + 1 })}</h2>
      <div id="shadow-controls-container" class="fields"><ShadowControls /></div>
    </section>

    {#if ui.context !== 'text'}
      <!-- Border radius shapes the element; text has no box to round. -->
      <section class="group" aria-labelledby="shape-title">
        <h2 id="shape-title">{t('shape')}</h2>
        <div id="shape-controls-container" class="fields"><ShapeControls /></div>
      </section>
    {/if}
  </div>

  <div
    class="tabpanel"
    role="tabpanel"
    id="panel-background"
    aria-labelledby="tab-background"
    hidden={ui.sidebar !== 'background'}
  >
    <BackgroundPanel />
  </div>

  <button type="button" id="resetButton" class="btn btn-quiet btn-block" onclick={() => actions.reset()}>
    <Icon name="reset" /> {t('resetAll')}
  </button>
</aside>
