<script lang="ts">
  import { state } from '../state.svelte';
  import { getCSS, getBackgroundCSS } from '../shadow';

  const css = $derived(getCSS(state));
  const bg = $derived(getBackgroundCSS(state));
  const radius = $derived(state.boxProperties.borderRadius);
</script>

<section id="preview" aria-label="Preview da sombra" style:background-color={state.boxProperties.canvasColor}>
  <h2>Preview do efeito:</h2>
  <div
    id="box"
    role="img"
    aria-label="Caixa de demonstração com sombra aplicada"
    style:box-shadow={css}
    style:background={bg}
    style:border-radius={`${radius}px`}
  ></div>
</section>
