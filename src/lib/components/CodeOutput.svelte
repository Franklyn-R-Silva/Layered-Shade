<script lang="ts">
  import { state as shadow, ui, TAB_LABELS } from '../state.svelte';
  import { getDart, getTailwind, getBackgroundCSS, getLayerCSS } from '../shadow';
  import { tabKeydown } from '../tabs';
  import type { CodeMode } from '../types';
  import Icon from './Icon.svelte';

  const tabs: CodeMode[] = ['css', 'dart', 'tailwind'];

  // CSS is shown exactly as it is copied: one shadow layer per line.
  const cssLines = $derived.by(() => {
    const n = shadow.layers.length;
    const lines: { text: string; layer?: number }[] = [{ text: 'box-shadow:' }];
    shadow.layers.forEach((l, i) =>
      lines.push({ text: `  ${getLayerCSS(l)}${i < n - 1 ? ',' : ';'}`, layer: i }),
    );
    lines.push({ text: `background: ${getBackgroundCSS(shadow)};` });
    if (shadow.boxProperties.borderRadius > 0)
      lines.push({ text: `border-radius: ${shadow.boxProperties.borderRadius}px;` });
    return lines;
  });
  const css = $derived(cssLines.map((l) => l.text).join('\n'));
  const dart = $derived(getDart(shadow));
  const dartLines = $derived(dart.split('\n'));
  const indentOf = (line: string) => line.length - line.trimStart().length;
  const tw = $derived(getTailwind(shadow));
  const anyInset = $derived(shadow.layers.some((l) => l.inset));
  const extraGradients = $derived(shadow.backgroundLayers.length > 1);

  let status = $state<'idle' | 'copied' | 'failed'>('idle');
  let timer: ReturnType<typeof setTimeout> | undefined;

  function copy() {
    const text = ui.mode === 'dart' ? dart : ui.mode === 'tailwind' ? tw : css;
    clearTimeout(timer);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        status = 'copied';
        timer = setTimeout(() => (status = 'idle'), 2000);
      })
      .catch(() => (status = 'failed'));
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
      onkeydown={(e) => tabKeydown(e, tabs, ui.mode, (id) => ((ui.mode = id), (status = 'idle')))}
    >
      {#each tabs as tab (tab)}
        <button
          type="button"
          class="tab-btn"
          role="tab"
          id={`tab-${tab}`}
          aria-controls={`panel-${tab}`}
          aria-selected={ui.mode === tab}
          tabindex={ui.mode === tab ? 0 : -1}
          onclick={() => ((ui.mode = tab), (status = 'idle'))}
        >
          {TAB_LABELS[tab]}
        </button>
      {/each}
    </div>
  </div>

  <div class="code-body">
    <div class="tab-content" role="tabpanel" id="panel-css" aria-labelledby="tab-css" hidden={ui.mode !== 'css'}>
      <pre class="code" id="rule"><code
          >{#each cssLines as line, i (i)}<span
              class="code-line"
              class:current={line.layer === shadow.currentLayerIndex && shadow.layers.length > 1}
              style:--indent={indentOf(line.text)}>{line.text}</span
            >{/each}</code
        ></pre>
    </div>

    <div class="tab-content" role="tabpanel" id="panel-dart" aria-labelledby="tab-dart" hidden={ui.mode !== 'dart'}>
      <pre class="code" id="dart-rule"><code
          >{#each dartLines as line, i (i)}<span class="code-line" style:--indent={indentOf(line)}>{line}</span
            >{/each}</code
        ></pre>
    </div>

    <div class="tab-content" role="tabpanel" id="panel-tailwind" aria-labelledby="tab-tailwind" hidden={ui.mode !== 'tailwind'}>
      <pre class="code" id="tailwind-rule"><code>{tw}</code></pre>
    </div>
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
