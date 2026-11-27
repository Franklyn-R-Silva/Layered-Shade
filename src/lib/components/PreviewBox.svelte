<script lang="ts">
  import { state as shadow, ui } from '../state.svelte';
  import { getCSS, getBackgroundCSS, isDarkColor } from '../shadow';
  import { plateGeometry, BOX } from '../dimensions';
  import { fmt } from '../format';
  import Toolbar from './Toolbar.svelte';

  const css = $derived(getCSS(shadow));
  const bg = $derived(getBackgroundCSS(shadow));
  const radius = $derived(shadow.boxProperties.borderRadius);
  const layer = $derived(shadow.layers[shadow.currentLayerIndex]);
  const dark = $derived(isDarkColor(shadow.boxProperties.canvasColor));

  let stageW = $state(0);
  let stageH = $state(0);
  const g = $derived(plateGeometry(layer, radius, { w: stageW, h: stageH }));

  // The lines draw in only when another layer is selected, never on page load.
  let mounted = false;
  let animate = $state(false);
  $effect(() => {
    void shadow.currentLayerIndex;
    if (mounted) animate = true;
    mounted = true;
  });
</script>

{#snippet label(l: { x: number; y: number; anchor: string; text: string })}
  <text class="dim-label" x={l.x} y={l.y} text-anchor={l.anchor}>{l.text}</text>
{/snippet}

<section
  id="preview"
  class="column column-stage"
  aria-labelledby="preview-title"
  style:--canvas={shadow.boxProperties.canvasColor}
  class:dark
>
  <h2 id="preview-title" class="visually-hidden">Preview</h2>
  <Toolbar />

  <div class="stage" class:guides={ui.guides} bind:clientWidth={stageW} bind:clientHeight={stageH}>
    <div class="plate">
      <div
        id="box"
        role="img"
        aria-label={`Caixa de demonstração com ${shadow.layers.length} ${shadow.layers.length === 1 ? 'camada' : 'camadas'} de sombra`}
        style:box-shadow={css}
        style:background={bg}
        style:border-radius={`${radius}px`}
      ></div>

      {#if ui.guides}
        <svg class="dims" width={BOX} height={BOX} viewBox={`0 0 ${BOX} ${BOX}`} aria-hidden="true">
          {#key shadow.currentLayerIndex}
            <g class:draw-in={animate}>
              {#if g.spread}
                {@const s = g.spread}
                <rect class="dim-outline" x={s.l} y={s.t} width={s.r - s.l} height={s.b - s.t} rx={s.rx} />
              {/if}
              {#if g.reach}
                {@const p = g.reach}
                <rect class="dim-reach" x={p.l} y={p.t} width={p.r - p.l} height={p.b - p.t} rx={p.rx} />
              {/if}

              {#each [g.dimX, g.dimY] as d, i (i)}
                <path class="dim-ext" d={d.ext} />
                {#if d.line}<path class="dim-line" pathLength="1" d={d.line} />{/if}
                {#if d.marks}<path class="dim-tick" d={d.marks} />{/if}
                {#each d.arrows as a, j (j)}<polyline class="dim-arrow" points={a} />{/each}
                {@render label(d.label)}
              {/each}

              {#if g.ray}
                <path class="dim-ray" pathLength="1" d={g.ray.line} />
                <polyline class="dim-arrow" points={g.ray.head} />
                {@render label(g.ray.label)}
              {/if}

              {#if g.radius}
                <path class="dim-ext" d={g.radius.leader} />
                {@render label(g.radius.label)}
              {/if}
            </g>
          {/key}
        </svg>
      {/if}
    </div>
  </div>

  <div class="stage-caption">
    <span>{`Camada ${shadow.currentLayerIndex + 1} de ${shadow.layers.length}${layer.inset ? ', interna' : ''}, escala 1:1`}</span>
    {#if ui.guides && g.spread}
      <span class="legend">
        <span class="key" aria-hidden="true"></span> contorno com spread
        <span class="num-text">{fmt(layer.spread)}</span>
        {#if g.reach}
          <span class="key key-reach" aria-hidden="true"></span> alcance do blur
          <span class="num-text">{layer.blur}</span>
        {/if}
      </span>
    {/if}
  </div>
</section>
