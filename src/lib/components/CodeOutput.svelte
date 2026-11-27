<script lang="ts">
  import { state as shadow, ui, TAB_LABELS } from '../state.svelte';
  import {
    getDart,
    getTailwind,
    getTailwindTheme,
    getCSSVariable,
    getCompose,
    getSwiftUI,
    getReactNative,
    getBackgroundCSS,
    getLayerCSS,
    getTextCSS,
    getTextTailwind,
    getTextDart,
    getTextCompose,
    getTextSwiftUI,
    getTextReactNative,
  } from '../shadow';
  import { tabKeydown } from '../tabs';
  import type { CodeMode, ShadowState } from '../types';
  import Icon from './Icon.svelte';

  const tabs: CodeMode[] = ['css', 'tailwind', 'dart', 'compose', 'swiftui', 'rn'];
  // Six tabs share a 400px column: React Native shows as "RN" but keeps its full accessible name.
  const SHORT: Partial<Record<CodeMode, string>> = { rn: 'RN' };

  // CSS properties, one visible layer per line, each line tagged with its layer index.
  const cssLines = $derived.by(() => {
    const visible = shadow.layers.map((l, i) => ({ l, i })).filter(({ l }) => !l.hidden);
    const lines: { text: string; layer?: number }[] = [];
    if (visible.length) {
      lines.push({ text: 'box-shadow:' });
      visible.forEach(({ l, i }, k) =>
        lines.push({ text: `  ${getLayerCSS(l)}${k < visible.length - 1 ? ',' : ';'}`, layer: i }),
      );
    } else lines.push({ text: 'box-shadow: none;' });
    lines.push({ text: `background: ${getBackgroundCSS(shadow)};` });
    if (shadow.boxProperties.borderRadius > 0)
      lines.push({ text: `border-radius: ${shadow.boxProperties.borderRadius}px;` });
    return lines;
  });

  const TEXT: Record<CodeMode, (s: ShadowState) => string> = {
    css: getTextCSS,
    tailwind: getTextTailwind,
    dart: getTextDart,
    compose: getTextCompose,
    swiftui: getTextSwiftUI,
    rn: getTextReactNative,
  };
  const isText = $derived(ui.context === 'text');

  const lines = $derived.by(() => {
    if (isText) {
      // In the CSS view each indented line is one text-shadow layer, in layer order.
      const order = shadow.layers.flatMap((l, i) => (l.hidden || l.inset ? [] : [i]));
      let k = 0;
      return TEXT[ui.mode](shadow)
        .split('\n')
        .map((text) => ({ text, layer: ui.mode === 'css' && text.startsWith('  ') ? order[k++] : undefined }));
    }
    if (ui.mode === 'css' && ui.cssFormat === 'props') return cssLines;
    const code =
      ui.mode === 'css'
        ? getCSSVariable(shadow)
        : ui.mode === 'tailwind'
          ? ui.twFormat === 'theme'
            ? getTailwindTheme(shadow)
            : getTailwind(shadow)
          : ui.mode === 'dart'
            ? getDart(shadow)
            : ui.mode === 'compose'
              ? getCompose(shadow)
              : ui.mode === 'swiftui'
                ? getSwiftUI(shadow)
                : getReactNative(shadow);
    return code.split('\n').map((text) => ({ text, layer: undefined as number | undefined }));
  });
  const text = $derived(lines.map((l) => l.text).join('\n'));
  const indentOf = (line: string) => line.length - line.trimStart().length;
  // Box-only notes: the text exports state their own limits in a comment.
  const anyInset = $derived(!isText && shadow.layers.some((l) => l.inset && !l.hidden));
  const extraGradients = $derived(!isText && shadow.backgroundLayers.length > 1);

  let status = $state<'idle' | 'copied' | 'failed'>('idle');
  let timer: ReturnType<typeof setTimeout> | undefined;

  function copy() {
    clearTimeout(timer);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        status = 'copied';
        timer = setTimeout(() => (status = 'idle'), 2000);
      })
      .catch(() => (status = 'failed'));
  }

  function select(tab: CodeMode) {
    ui.mode = tab;
    status = 'idle';
  }
</script>

<section id="generated-rule" class="column column-code" aria-labelledby="code-title">
  <div class="code-head">
    <h2 id="code-title">Código gerado</h2>
    <div
      class="code-tabs"
      role="tablist"
      aria-label="Formato do código"
      tabindex="-1"
      onkeydown={(e) => tabKeydown(e, tabs, ui.mode, select)}
    >
      {#each tabs as tab (tab)}
        <button
          type="button"
          class="tab-btn"
          role="tab"
          id={`tab-${tab}`}
          aria-controls="code-panel"
          aria-label={SHORT[tab] ? TAB_LABELS[tab] : undefined}
          aria-selected={ui.mode === tab}
          tabindex={ui.mode === tab ? 0 : -1}
          onclick={() => select(tab)}
        >
          {SHORT[tab] ?? TAB_LABELS[tab]}
        </button>
      {/each}
    </div>
  </div>

  <div class="code-body" role="tabpanel" id="code-panel" aria-labelledby={`tab-${ui.mode}`}>
    {#if !isText && (ui.mode === 'css' || ui.mode === 'tailwind')}
      <div class="format-switch" role="group" aria-label="Variante">
        {#if ui.mode === 'css'}
          <button type="button" aria-pressed={ui.cssFormat === 'props'} onclick={() => (ui.cssFormat = 'props')}
            >Propriedades</button
          >
          <button type="button" aria-pressed={ui.cssFormat === 'var'} onclick={() => (ui.cssFormat = 'var')}
            >Variável CSS</button
          >
        {:else}
          <button type="button" aria-pressed={ui.twFormat === 'classes'} onclick={() => (ui.twFormat = 'classes')}
            >Classes</button
          >
          <button type="button" aria-pressed={ui.twFormat === 'theme'} onclick={() => (ui.twFormat = 'theme')}
            >Tema (v4)</button
          >
        {/if}
      </div>
    {/if}
    <pre class="code" id={ui.mode === 'css' ? 'rule' : `${ui.mode}-rule`}><code
        >{#each lines as line, i (i)}<span
            class="code-line"
            class:current={line.layer === shadow.currentLayerIndex && shadow.layers.length > 1}
            style:--indent={indentOf(line.text)}>{line.text}</span
          >{/each}</code
      ></pre>
  </div>

  <div class="code-foot">
    {#if ui.mode === 'dart' && anyInset}
      <div class="note" id="dart-install-info">
        <Icon name="package" />
        <p>
          O <code>BoxShadow</code> do Flutter não tem inset. Para as camadas internas, instale o pacote:
          <code class="cmd">flutter pub add flutter_inset_box_shadow</code>
        </p>
      </div>
    {/if}
    {#if ui.mode === 'dart' && extraGradients}
      <div class="note">
        <p>
          O <code>BoxDecoration</code> aceita um gradiente só: o Dart exporta o gradiente 1 (o do topo). CSS e Tailwind
          levam todos.
        </p>
      </div>
    {/if}
    <button type="button" class="btn btn-primary btn-block" id="copiarTexto" onclick={copy}>
      {#if status === 'copied'}
        <Icon name="check" /> Copiado
      {:else}
        <Icon name="copy" /> Copiar {TAB_LABELS[ui.mode]}
      {/if}
    </button>
    <p class="copy-status" class:failed={status === 'failed'} role="status">
      {#if status === 'copied'}
        Código {TAB_LABELS[ui.mode]} copiado para a área de transferência.
      {:else if status === 'failed'}
        Não deu para copiar. Selecione o código acima e use Ctrl+C.
      {/if}
    </p>
  </div>
</section>
