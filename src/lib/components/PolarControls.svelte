<script lang="ts">
  import { state as shadow, ui, actions, layerPolar } from '../state.svelte';
  import { t } from '../i18n.svelte';

  // Angle and distance are another view of the selected layer's X/Y (see light.ts).
  const i = $derived(shadow.currentLayerIndex);
  const polar = $derived(layerPolar(i));
  $effect(() => actions.keepPolar(i, polar));

  // X/Y written by an edit that hit ±100: the note stays until they change again.
  const offsets = $derived(`${i} ${shadow.layers[i].horizontal} ${shadow.layers[i].vertical}`);
  let clampedAt = $state('');

  function edit(e: Event, key: 'angle' | 'distance') {
    const input = e.target as HTMLInputElement;
    const v = Math.round(Number(input.value));
    if (input.value === '' || Number.isNaN(v)) return;
    const clamped =
      key === 'angle' ? actions.aimLight(v) : actions.aimLight(polar.angle, Math.min(141, Math.max(0, v)));
    clampedAt = clamped ? offsets : '';
  }
</script>

<div class="field">
  <div class="field-head">
    <label for="light-angle">{t('angle')}</label>
    <span class="num">
      <input
        type="number"
        id="light-angle-value"
        aria-label={t('inDegrees', { label: t('angle') })}
        min="0"
        max="359"
        value={polar.angle}
        oninput={(e) => edit(e, 'angle')}
      />
      <span class="unit" aria-hidden="true">°</span>
    </span>
  </div>
  <input type="range" id="light-angle" min="0" max="359" value={polar.angle} oninput={(e) => edit(e, 'angle')} />
</div>

<div class="field">
  <div class="field-head">
    <label for="light-distance">{t('distance')}</label>
    <span class="num">
      <input
        type="number"
        id="light-distance-value"
        aria-label={t('inPixels', { label: t('distance') })}
        aria-describedby="light-clamped"
        min="0"
        max="141"
        value={polar.distance}
        oninput={(e) => edit(e, 'distance')}
      />
      <span class="unit" aria-hidden="true">px</span>
    </span>
  </div>
  <input
    type="range"
    id="light-distance"
    min="0"
    max="141"
    value={polar.distance}
    aria-describedby="light-clamped"
    oninput={(e) => edit(e, 'distance')}
  />
  <p id="light-clamped" class="tool-status failed" role="status">
    {clampedAt === offsets ? t('lightClamped') : ''}
  </p>
</div>

<label class="check">
  <input type="checkbox" id="global-light" bind:checked={ui.globalLight} />
  <span>{t('globalLight')}</span>
</label>
