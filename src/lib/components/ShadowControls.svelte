<script lang="ts">
  import { shadowControls } from '../config/controls';
  import Control from './Control.svelte';
  import PolarControls from './PolarControls.svelte';

  const controls = shadowControls.filter((c) => c.category === 'shadow');
</script>

{#each controls as config (config.id)}
  <Control {config} />
  <!-- Angle and distance edit the same offset as X/Y, so they sit right under them. -->
  {#if config.id === 'vertical'}<PolarControls />{/if}
{/each}
