<script lang="ts">
  import { state as shadow, ui, TAB_LABELS } from '../state.svelte';
  import { getCSS, getDart, getTailwind, getBackgroundCSS } from '../shadow';
  import type { CodeMode } from '../types';

  const css = $derived(getCSS(shadow));
  const dart = $derived(getDart(shadow));
  const tw = $derived(getTailwind(shadow));
  const bg = $derived(getBackgroundCSS(shadow));
  const radius = $derived(shadow.boxProperties.borderRadius);
  const currentInset = $derived(shadow.layers[shadow.currentLayerIndex]?.inset ?? false);

  const tabs: CodeMode[] = ['css', 'dart', 'tailwind'];

  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const buttonText = $derived(
    copied ? 'Copiado com sucesso!' : `Clique aqui para copiar as regras (${TAB_LABELS[ui.mode]})`,
  );

  function buildText(): string {
    if (ui.mode === 'dart') return dart;
    if (ui.mode === 'tailwind') return tw;
    let t = `box-shadow: ${css};\nbackground: ${bg};\n`;
    if (radius > 0) t += `border-radius: ${radius}px;`;
    return t;
  }

  function copy() {
    navigator.clipboard
      .writeText(buildText())
      .then(() => {
        copied = true;
        clearTimeout(timer);
        timer = setTimeout(() => (copied = false), 2000);
      })
      .catch((err) => console.error('Failed to copy', err));
  }
</script>

<section id="generated-rule" aria-label="Código gerado">
  <h2>Copie o código gerado:</h2>

  <div class="tabs-container">
    <div class="tabs-header" role="tablist" aria-label="Formatos de código">
      {#each tabs as tab (tab)}
        <button
          class="tab-btn {ui.mode === tab ? 'active' : ''}"
          role="tab"
          aria-selected={ui.mode === tab}
          onclick={() => (ui.mode = tab)}
        >
          {TAB_LABELS[tab]}
        </button>
      {/each}
    </div>

    <div id="rules-area">
      <div class="tab-content {ui.mode === 'css' ? 'active' : ''}" role="tabpanel">
        <p id="rule">box-shadow: <span>{css}</span>;</p>
        <p id="webkit-rule">-webkit-box-shadow: <span>{css}</span>;</p>
        <p id="moz-rule">-moz-box-shadow: <span>{css}</span>;</p>
        <p id="bg-rule">background: <span>{bg}</span>;</p>
        {#if radius > 0}
          <p id="border-radius-rule">border-radius: <span>{radius}px</span>;</p>
        {/if}
      </div>

      <div class="tab-content {ui.mode === 'dart' ? 'active' : ''}" role="tabpanel">
        <pre id="dart-rule"><span>{dart}</span></pre>
        {#if ui.mode === 'dart' && currentInset}
          <div id="dart-install-info" style="display:block">
            <p>📦 Pacote necessário:</p>
            <code>flutter pub add flutter_inset_box_shadow</code>
          </div>
        {/if}
      </div>

      <div class="tab-content {ui.mode === 'tailwind' ? 'active' : ''}" role="tabpanel">
        <p id="tailwind-rule">class="<span>{tw}</span>"</p>
      </div>
    </div>
  </div>

  <button
    class="copiarTexto"
    id="copiarTexto"
    class:copied
    aria-label="Copiar código para a área de transferência"
    onclick={copy}
  >
    <span id="texto">{buttonText}</span>
  </button>
</section>
