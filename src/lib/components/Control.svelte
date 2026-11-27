<script lang="ts">
  import { state, actions } from '../state.svelte';
  import type { ControlConfig } from '../config/controls';
  import type { ShadowLayer } from '../types';
  import { t } from '../i18n.svelte';

  const { config }: { config: ControlConfig } = $props();
  const label = $derived(t(config.label));

  const layer = $derived(state.layers[state.currentLayerIndex]);

  const raw = $derived(
    config.id === 'borderRadius'
      ? state.boxProperties.borderRadius
      : (layer?.[config.id as keyof ShadowLayer] as number | string | boolean | undefined),
  );

  // Opacity is stored 0–1 but displayed/edited on a 0–100 scale.
  const displayValue = $derived(
    config.id === 'opacity' ? Math.round(((raw as number) ?? 0) * 100) : raw,
  );

  function onRange(e: Event) {
    let v = Number((e.target as HTMLInputElement).value);
    if (Number.isNaN(v) || (e.target as HTMLInputElement).value === '') return;
    // Out-of-range values make invalid CSS (a negative blur drops the whole box-shadow).
    v = Math.min(config.max ?? v, Math.max(config.min ?? v, v));
    if (config.id === 'opacity') v = v / 100;
    actions.update(config.id, v);
  }

  function onColor(e: Event) {
    actions.update(config.id, (e.target as HTMLInputElement).value);
  }

  // Hex is committed on change (blur/Enter) so a half-typed value never jumps the caret.
  function onHex(e: Event) {
    const input = e.target as HTMLInputElement;
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.value.trim());
    if (!m) {
      input.value = raw as string;
      return;
    }
    const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
    actions.update(config.id, `#${hex.toLowerCase()}`);
  }

  function onCheck(e: Event) {
    actions.update(config.id, (e.target as HTMLInputElement).checked);
  }
</script>

{#if config.type === 'checkbox'}
  <label class="check">
    <input type="checkbox" id={config.id} checked={raw as boolean} onchange={onCheck} />
    <span>{label}</span>
  </label>
{:else if config.type === 'color'}
  <div class="field field-inline">
    <label for={config.id}>{label}</label>
    <span class="color-pair">
      <input type="color" id={config.id} value={raw as string} oninput={onColor} />
      <input
        type="text"
        class="hex"
        id={`${config.id}-value`}
        aria-label={t('inHex', { label })}
        value={raw as string}
        maxlength="7"
        spellcheck="false"
        autocomplete="off"
        onchange={onHex}
      />
    </span>
  </div>
{:else}
  <div class="field">
    <div class="field-head">
      <label for={config.id}>{label}</label>
      <span class="num">
        <input
          type="number"
          id={`${config.id}-value`}
          aria-label={t(config.unit === '%' ? 'inPercent' : 'inPixels', { label })}
          min={config.min}
          max={config.max}
          value={displayValue}
          oninput={onRange}
        />
        <span class="unit" aria-hidden="true">{config.unit}</span>
      </span>
    </div>
    <input
      type="range"
      id={config.id}
      min={config.min}
      max={config.max}
      value={displayValue}
      oninput={onRange}
    />
  </div>
{/if}
