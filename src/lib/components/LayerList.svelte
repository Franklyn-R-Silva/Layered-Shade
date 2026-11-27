<script lang="ts">
  import { state, actions } from '../state.svelte';
  import { hexToRgba } from '../shadow';
  import { fmt } from '../format';
  import Icon from './Icon.svelte';
  import { t } from '../i18n.svelte';

  const current = $derived(state.currentLayerIndex);
</script>

<div class="panel-head">
  <h2 id="layers-title">{t('shadowLayers')}</h2>
  <button type="button" class="btn btn-quiet" onclick={() => actions.addLayer()}>
    <Icon name="plus" /> {t('add')}
  </button>
</div>

<ol class="layer-list" aria-labelledby="layers-title">
  {#each state.layers as layer, i (i)}
    <li class="layer-item" class:active={i === current} class:muted={layer.hidden}>
      <button
        type="button"
        class="layer-select"
        aria-current={i === current ? 'true' : undefined}
        onclick={() => actions.selectLayer(i)}
      >
        <span class="layer-index" aria-hidden="true">{i + 1}</span>
        <span class="layer-text">
          <span class="layer-name"
            >{t('layerN', { n: i + 1 })}{layer.inset ? t('insetTag') : ''}{layer.hidden ? t('hiddenTag') : ''}</span
          >
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
        aria-label={t('hideLayerN', { n: i + 1 })}
        aria-pressed={layer.hidden ? 'true' : 'false'}
        title={t('hideLayer')}
        onclick={() => actions.setLayerHidden(i, !layer.hidden)}
      >
        <Icon name={layer.hidden ? 'eyeOff' : 'eye'} />
      </button>
      <button
        type="button"
        class="icon-btn icon-btn-danger"
        aria-label={t('removeLayerN', { n: i + 1 })}
        title={t(state.layers.length <= 1 ? 'lastLayer' : 'removeLayer')}
        disabled={state.layers.length <= 1}
        onclick={() => actions.removeLayer(i)}
      >
        <Icon name="close" />
      </button>
    </li>
  {/each}
</ol>

<div class="layer-actions" role="group" aria-label={t('layerActionsN', { n: current + 1 })}>
  <button type="button" class="btn btn-quiet" onclick={() => actions.duplicateLayer(current)}>
    <Icon name="duplicate" /> {t('duplicate')}
  </button>
  <button
    type="button"
    class="btn btn-quiet"
    disabled={current === 0}
    onclick={() => actions.moveLayer(current, -1)}
  >
    <Icon name="up" /> {t('moveUp')}
  </button>
  <button
    type="button"
    class="btn btn-quiet"
    disabled={current === state.layers.length - 1}
    onclick={() => actions.moveLayer(current, 1)}
  >
    <Icon name="down" /> {t('moveDown')}
  </button>
</div>
