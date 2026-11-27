<script lang="ts">
  import { state as shadow, ui } from '../state.svelte';
  import { getCSS, getBackgroundCSS, isDarkColor, guideInk, hexToRgba } from '../shadow';
  import { plateGeometry } from '../dimensions';
  import { fmt } from '../format';
  import Toolbar from './Toolbar.svelte';

  const css = $derived(getCSS(shadow));
  const bg = $derived(getBackgroundCSS(shadow));
  const radius = $derived(shadow.boxProperties.borderRadius);
  const layer = $derived(shadow.layers[shadow.currentLayerIndex]);
  const guide = $derived(guideInk(shadow.boxProperties.canvasColor));

  // Element sizes in CSS px, drawn 1:1 so every dimension line reads in real pixels.
  const SIZES = { box: { w: 200, h: 200 }, card: { w: 280, h: 180 }, button: { w: 168, h: 48 } };
  const NAMES = { box: 'Caixa', card: 'Card', button: 'Botão' };
  const size = $derived(SIZES[ui.context]);
  const ink = $derived(isDarkColor(shadow.boxProperties.backgroundColor) ? '#f6f8f9' : '#23272b');
  const visible = $derived(shadow.layers.filter((l) => !l.hidden).length);

  let stageW = $state(0);
  let stageH = $state(0);
  const g = $derived(plateGeometry(layer, radius, { w: stageW, h: stageH }, size));

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
  style:--guide={guide}
  style:--grid-minor={hexToRgba(guide, 0.07)}
  style:--grid-major={hexToRgba(guide, 0.15)}
>
  <h2 id="preview-title" class="visually-hidden">Preview</h2>
  <Toolbar />

  <div class="stage" class:guides={ui.guides} bind:clientWidth={stageW} bind:clientHeight={stageH}>
    <div class="plate" style:width={`${size.w}px`} style:height={`${size.h}px`}>
      <div
        id="box"
        class={`sample sample-${ui.context}`}
        role="img"
        aria-label={`${NAMES[ui.context]} de demonstração com ${visible} ${visible === 1 ? 'camada' : 'camadas'} de sombra`}
        style:box-shadow={css}
        style:background={bg}
        style:border-radius={`${radius}px`}
        style:color={ink}
      >
        <!-- Sample content (synthetic) so the shadow is judged on a real-looking element. -->
        {#if ui.context === 'card'}
          <span class="sample-title" aria-hidden="true">Relatório semanal</span>
          <span class="sample-text" aria-hidden="true">12 pedidos novos, 3 aguardando envio</span>
          <span class="sample-meta" aria-hidden="true">Atualizado há 5 min</span>
        {:else if ui.context === 'button'}
          <span class="sample-button" aria-hidden="true">Comprar agora</span>
        {/if}
      </div>

      {#if ui.guides}
        <svg class="dims" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
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
