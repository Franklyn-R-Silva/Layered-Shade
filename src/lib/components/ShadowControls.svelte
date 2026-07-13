<script lang="ts">
  import { shadowControls } from '../config/controls';
  import Control from './Control.svelte';

  const controls = shadowControls.filter((c) => c.category === 'shadow');
</script>

{#each controls as config (config.id)}
  <Control {config} />
{/each}
