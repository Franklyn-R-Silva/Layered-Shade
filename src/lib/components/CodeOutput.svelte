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
    getTextCSS,
    getTextTailwind,
    getTextDart,
    getTextCompose,
    getTextSwiftUI,
    getTextReactNative,
  } from '../shadow';
  import * as fw from '../frameworks';
  import * as img from '../image';
  import type { CodeMode, PreviewContext, ShadowState } from '../types';
  import Icon from './Icon.svelte';
  import { t } from '../i18n.svelte';

  // Group names are platform names, the same in every language.
  const GROUPS: [string, CodeMode[]][] = [
    ['Web', ['css', 'tailwind', 'react', 'vue', 'svelte', 'angular']],
    ['Mobile', ['dart', 'compose', 'swiftui', 'rn']],
    ['Python', ['flet', 'qt']],
  ];

  type Generators = Record<CodeMode, (s: ShadowState) => string>;
  // The variants read `ui`, so the derived code below follows the variant switch too.
  const BOX: Generators = {
    css: (s) => (ui.cssFormat === 'var' ? getCSSVariable(s) : fw.getCSSProperties(s)),
    tailwind: (s) => (ui.twFormat === 'theme' ? getTailwindTheme(s) : getTailwind(s)),
    react: (s) => fw.getReact(s, ui.reactFormat),
    vue: fw.getVue,
    svelte: fw.getSvelte,
    angular: fw.getAngular,
    dart: getDart,
    compose: getCompose,
    swiftui: getSwiftUI,
    rn: getReactNative,
    flet: fw.getFlet,
    qt: fw.getQt,
  };
  const TEXT: Generators = {
    css: getTextCSS,
    tailwind: getTextTailwind,
    react: (s) => fw.getTextReact(s, ui.reactFormat),
    vue: fw.getTextVue,
    svelte: fw.getTextSvelte,
    angular: fw.getTextAngular,
    dart: getTextDart,
    compose: getTextCompose,
    swiftui: getTextSwiftUI,
    rn: getTextReactNative,
    flet: fw.getTextFlet,
    qt: fw.getTextQt,
  };

  const IMAGE: Generators = {
    css: img.getImageCSS,
    tailwind: img.getImageTailwind,
    react: (s) => img.getImageMarkup(s, true),
    vue: (s) => img.getImageMarkup(s, false),
    svelte: (s) => img.getImageMarkup(s, false),
    angular: (s) => img.getImageMarkup(s, false),
    dart: () => img.getImageNote('dart'),
    compose: () => img.getImageNote('compose'),
    swiftui: img.getImageSwiftUI,
    rn: () => img.getImageNote('rn'),
    flet: img.getImageFlet,
    qt: img.getImageQt,
  };

  /** The code for a preview context and export, one entry per line; CSS layer lines carry their layer index. */
  function codeLines(context: PreviewContext, mode: CodeMode): { text: string; layer?: number }[] {
    // Text and image shadows (text-shadow, drop-shadow) have no inset: those layers are not drawn.
    const outerOnly = context !== 'box';
    const code = (context === 'text' ? TEXT : context === 'image' ? IMAGE : BOX)[mode](shadow);
    // In the CSS properties view each indented line is one drawn layer, in layer order.
    const tagged = mode === 'css' && (outerOnly || ui.cssFormat === 'props');
    const order = shadow.layers.flatMap((l, i) => (l.hidden || (outerOnly && l.inset) ? [] : [i]));
    let k = 0;
    return code
      .split('\n')
      .map((text) => ({ text, layer: tagged && text.startsWith('  ') ? order[k++] : undefined }));
  }

  const isText = $derived(ui.context !== 'box'); // text or image: the box-only notes and variants do not apply
  const lines = $derived(codeLines(ui.context, ui.mode));
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
    <h2 id="code-title">{t('generatedCode')}</h2>
    <div class="code-picker">
      <label for="code-format">{t('exportFormat')}</label>
      <select id="code-format" value={ui.mode} onchange={(e) => select(e.currentTarget.value as CodeMode)}>
        {#each GROUPS as [group, modes] (group)}
          <optgroup label={group}>
            {#each modes as mode (mode)}
              <option value={mode}>{TAB_LABELS[mode]}</option>
            {/each}
          </optgroup>
        {/each}
      </select>
    </div>
  </div>

  <div class="code-body">
    {#if (ui.mode === 'react' && ui.context !== 'image') || (!isText && (ui.mode === 'css' || ui.mode === 'tailwind'))}
      <div class="format-switch" role="group" aria-label={t('variant')}>
        {#if ui.mode === 'css'}
          <button type="button" aria-pressed={ui.cssFormat === 'props'} onclick={() => (ui.cssFormat = 'props')}
            >{t('properties')}</button
          >
          <button type="button" aria-pressed={ui.cssFormat === 'var'} onclick={() => (ui.cssFormat = 'var')}
            >{t('cssVariable')}</button
          >
        {:else if ui.mode === 'tailwind'}
          <button type="button" aria-pressed={ui.twFormat === 'classes'} onclick={() => (ui.twFormat = 'classes')}
            >Classes</button
          >
          <button type="button" aria-pressed={ui.twFormat === 'theme'} onclick={() => (ui.twFormat = 'theme')}
            >{t('theme')}</button
          >
        {:else}
          <button type="button" aria-pressed={ui.reactFormat === 'inline'} onclick={() => (ui.reactFormat = 'inline')}
            >{t('inlineStyle')}</button
          >
          <button type="button" aria-pressed={ui.reactFormat === 'module'} onclick={() => (ui.reactFormat = 'module')}
            >CSS Modules</button
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
          {t('dartInsetA')}<code>BoxShadow</code>{t('dartInsetB')}
          <code class="cmd">flutter pub add flutter_inset_box_shadow</code>
        </p>
      </div>
    {/if}
    {#if ui.mode === 'dart' && extraGradients}
      <div class="note">
        <p>{t('dartGradientA')}<code>BoxDecoration</code>{t('dartGradientB')}</p>
      </div>
    {/if}
    <button type="button" class="btn btn-primary btn-block" id="copiarTexto" onclick={copy}>
      {#if status === 'copied'}
        <Icon name="check" /> {t('copied')}
      {:else}
        <Icon name="copy" /> {t('copyTab', { tab: TAB_LABELS[ui.mode] })}
      {/if}
    </button>
    <p class="copy-status" class:failed={status === 'failed'} role="status">
      {#if status === 'copied'}
        {t('copiedStatus', { tab: TAB_LABELS[ui.mode] })}
      {:else if status === 'failed'}
        {t('copyFailed')}
      {/if}
    </p>
  </div>
</section>
