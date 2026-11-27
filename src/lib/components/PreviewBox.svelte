<script lang="ts">
  import { state as shadow, ui, actions, layerPolar } from '../state.svelte';
  import { toPolar } from '../light';
  import { getCSS, getBackgroundCSS, isDarkColor, guideInk, hexToRgba, getTextShadowCSS, fontStack } from '../shadow';
  import { plateGeometry } from '../dimensions';
  import { getDropShadowFilter } from '../image';
  import { image, SAMPLE_IMAGE } from '../image.svelte';
  import { fmt } from '../format';
  import Toolbar from './Toolbar.svelte';
  import { t } from '../i18n.svelte';

  const css = $derived(getCSS(shadow));
  const bg = $derived(getBackgroundCSS(shadow));
  const radius = $derived(shadow.boxProperties.borderRadius);
  const layer = $derived(shadow.layers[shadow.currentLayerIndex]);
  const guide = $derived(guideInk(shadow.boxProperties.canvasColor));

  // Element sizes in CSS px, drawn 1:1 so every dimension line reads in real pixels.
  const SIZES = { box: { w: 200, h: 200 }, card: { w: 280, h: 180 }, button: { w: 168, h: 48 } };
  // Text and image modes measure the rendered element, so the lines start from its box.
  let elW = $state(0);
  let elH = $state(0);
  const isText = $derived(ui.context === 'text');
  // Text and image (drop-shadow) have no corners or box outline: no radius callout, no spread/blur rectangles.
  const measured = $derived(ui.context === 'text' || ui.context === 'image');
  const size = $derived(ui.context === 'text' || ui.context === 'image' ? { w: elW, h: elH } : SIZES[ui.context]);
  const textShadow = $derived(getTextShadowCSS(shadow));
  const drops = $derived(measured && shadow.layers.some((l) => !l.hidden && (l.inset || l.spread !== 0)));
  const ink = $derived(isDarkColor(shadow.boxProperties.backgroundColor) ? '#f6f8f9' : '#23272b');
  const visible = $derived(shadow.layers.filter((l) => !l.hidden).length);

  let stageW = $state(0);
  let stageH = $state(0);
  const g = $derived.by(() => {
    const geo = plateGeometry(layer, measured ? 0 : radius, { w: stageW, h: stageH }, size, t('lightRay'));
    return measured ? { ...geo, spread: null, reach: null } : geo;
  });

  // The lines draw in only when another layer is selected, never on page load.
  let mounted = false;
  let animate = $state(false);
  $effect(() => {
    void shadow.currentLayerIndex;
    if (mounted) animate = true;
    mounted = true;
  });

  // Dragging on the plate moves the selected layer's offset 1:1 with the pointer.
  let drag: { id: number; x: number; y: number; h: number; v: number } | undefined;
  const offset = (start: number, d: number) => Math.max(-100, Math.min(100, Math.round(start + d))); // sliders' range

  function grab(e: PointerEvent) {
    if (e.button !== 0 || drag) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, h: layer.horizontal, v: layer.vertical };
    actions.beginGesture();
  }

  // Dragging the light ray's start turns the light around the element's centre, keeping the distance.
  let aim: { id: number; cx: number; cy: number } | undefined;

  function grabLight(e: PointerEvent) {
    if (e.button !== 0 || drag || aim) return;
    e.stopPropagation(); // the stage drag (which moves the offset) must not start
    const el = e.currentTarget as Element;
    const r = el.closest('svg')!.getBoundingClientRect();
    // The stage keeps the pointer: the handle moves, and can vanish, while the light turns.
    el.closest('.stage')!.setPointerCapture(e.pointerId);
    aim = { id: e.pointerId, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    actions.beginGesture();
  }

  function move(e: PointerEvent) {
    if (e.pointerId === aim?.id) {
      // The light is where the pointer is, so the shadow falls from the pointer through the centre.
      const prev = layerPolar(shadow.currentLayerIndex);
      actions.aimLight(toPolar(aim.cx - e.clientX, aim.cy - e.clientY, prev).angle);
      return;
    }
    if (e.pointerId !== drag?.id) return;
    actions.update('horizontal', offset(drag.h, e.clientX - drag.x));
    actions.update('vertical', offset(drag.v, e.clientY - drag.y));
  }

  function release(e: PointerEvent) {
    if (e.pointerId === aim?.id) aim = undefined;
    else if (e.pointerId === drag?.id) drag = undefined;
    else return;
    actions.endGesture();
  }
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

  <!-- Pointer-only drag: the offset sliders and fields are its keyboard alternative (WCAG 2.5.7). -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="stage"
    class:guides={ui.guides}
    bind:clientWidth={stageW}
    bind:clientHeight={stageH}
    onpointerdown={grab}
    onpointermove={move}
    onpointerup={release}
    onpointercancel={release}
  >
    <div class="plate" style:width={measured ? undefined : `${size.w}px`} style:height={measured ? undefined : `${size.h}px`}>
      {#if ui.context === 'text'}
        <div
          id="text-sample"
          class="text-sample"
          role="img"
          aria-label={t('textSample', { text: shadow.text.content })}
          bind:clientWidth={elW}
          bind:clientHeight={elH}
          style:font-family={fontStack(shadow.text.font)}
          style:font-size={`${shadow.text.size}px`}
          style:font-weight={shadow.text.weight}
          style:color={shadow.text.color}
          style:text-shadow={textShadow}>{shadow.text.content}</div>
      {:else if ui.context === 'image'}
        <!-- draggable=false: a native image drag would cancel the plate's pointer drag. -->
        <img
          id="image-sample"
          class="image-sample"
          src={image.src}
          alt={image.name || t('imageSample')}
          width={image.width}
          draggable="false"
          onerror={() => {
            // A file of an accepted type that does not decode: say so and show the sample again.
            if (image.src !== SAMPLE_IMAGE) Object.assign(image, { src: SAMPLE_IMAGE, name: '', broken: true });
          }}
          bind:clientWidth={elW}
          bind:clientHeight={elH}
          style:filter={getDropShadowFilter(shadow)}
        />
      {:else}
      <div
        id="box"
        class={`sample sample-${ui.context}`}
        role="img"
        aria-label={t(visible === 1 ? 'sampleOneLayer' : 'sampleLayers', { name: t(ui.context), n: visible })}
        style:box-shadow={css}
        style:background={bg}
        style:border-radius={`${radius}px`}
        style:color={ink}
      >
        <!-- Sample content (synthetic) so the shadow is judged on a real-looking element. -->
        {#if ui.context === 'card'}
          <span class="sample-title" aria-hidden="true">{t('sampleTitle')}</span>
          <span class="sample-text" aria-hidden="true">{t('sampleText')}</span>
          <span class="sample-meta" aria-hidden="true">{t('sampleMeta')}</span>
        {:else if ui.context === 'button'}
          <span class="sample-button" aria-hidden="true">{t('sampleButton')}</span>
        {/if}
      </div>
      {/if}

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
                <!-- Pointer-only, like the stage drag: the Angle field is its keyboard alternative. -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <circle class="ray-handle" cx={g.ray.start.x} cy={g.ray.start.y} r="4" onpointerdown={grabLight}
                  ><title>{t('lightHandle')}</title></circle
                >
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
    <span
      >{t('stageCaption', {
        i: shadow.currentLayerIndex + 1,
        n: shadow.layers.length,
        inset: layer.inset ? t('stageCaptionInset') : '',
      })}</span
    >
    {#if ui.guides && g.spread}
      <span class="legend">
        <span class="key" aria-hidden="true"></span> {t('spreadOutline')}
        <span class="num-text">{fmt(layer.spread)}</span>
        {#if g.reach}
          <span class="key key-reach" aria-hidden="true"></span> {t('blurReach')}
          <span class="num-text">{layer.blur}</span>
        {/if}
      </span>
    {/if}
    {#if drops}<span>{t(isText ? 'textDrops' : 'imageDrops')}</span>{/if}
    <span class="drag-hint">{t('dragHint')}</span>
  </div>
</section>
