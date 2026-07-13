<script lang="ts">
  import { state, actions } from '../state.svelte';
  import type { ControlConfig } from '../config/controls';
  import type { ShadowLayer } from '../types';

  const { config }: { config: ControlConfig } = $props();

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
    if (Number.isNaN(v)) return; // ignore non-numeric text entry
    if (config.id === 'opacity') v = v / 100;
    actions.update(config.id, v);
  }

  function onColor(e: Event) {
    actions.update(config.id, (e.target as HTMLInputElement).value);
  }

  function onCheck(e: Event) {
    actions.update(config.id, (e.target as HTMLInputElement).checked);
  }
</script>

{#if config.type === 'checkbox'}
  <div class="form-control checkbox-control">
    <label for={config.id}>{config.label}</label>
    <input
      type="checkbox"
      id={config.id}
      class="checkmark"
      title={config.label}
      checked={raw as boolean}
      onchange={onCheck}
    />
  </div>
{:else if config.type === 'color'}
  <div class="form-control">
    <div class="control-header">
      <label for={config.id}>{config.label}</label>
      <div class="reference-input">
        <input type="text" id={`${config.id}-value`} aria-label={`Valor de ${config.label}`} value={displayValue} readonly />
      </div>
    </div>
    <div class="control-body">
      <input type="color" id={config.id} title={config.label} value={raw as string} oninput={onColor} />
    </div>
  </div>
{:else}
  <div class="form-control">
    <div class="control-header">
      <label for={config.id}>{config.label}</label>
      <div class="reference-input">
        <input
          type="text"
          id={`${config.id}-value`}
          aria-label={`Valor de ${config.label}`}
          value={displayValue}
          oninput={onRange}
        />
        <span class="unit">px</span>
      </div>
    </div>
    <div class="control-body">
      <input
        type="range"
        id={config.id}
        title={config.label}
        min={config.min}
        max={config.max}
        value={displayValue}
        oninput={onRange}
      />
    </div>
  </div>
{/if}
