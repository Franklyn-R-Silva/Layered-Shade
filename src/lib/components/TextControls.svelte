<script module lang="ts">
  // Families loaded from files this visit. Only the name is kept; the bytes never leave this page.
  const uploaded = $state<string[]>([]);
</script>

<script lang="ts">
  import { state as shadow, actions } from '../state.svelte';
  import { cleanFontName, GENERIC_FONTS } from '../shadow';

  const FONTS = ['Overpass', 'system-ui', 'serif', 'sans-serif', 'monospace', 'Georgia', 'Times New Roman', 'Arial', 'Verdana', 'Courier New', 'Impact'];
  const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  const MAX_FONT_BYTES = 5 * 1024 * 1024;

  const t = $derived(shadow.text);
  const fonts = $derived([...new Set([...FONTS, ...uploaded])]);

  let loads = $state(0);
  let fontStatus = $state('');
  let fontFailed = $state(false);

  // A family is installed when text set in it measures differently from both generic fallbacks.
  // (document.fonts.check() answers true in Chrome even for fonts the machine does not have.)
  const missing = $derived.by(() => {
    void loads;
    if (GENERIC_FONTS.includes(t.font.toLowerCase())) return false;
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return false; // no canvas (tests, old browsers): do not claim it is missing
    const width = (family: string) => {
      ctx.font = `72px ${family}`;
      return ctx.measureText('mmmmmmmmmmlli WAV 0123').width;
    };
    return ['monospace', 'serif'].every((g) => width(`"${t.font}", ${g}`) === width(g));
  });

  const value = (e: Event) => (e.target as HTMLInputElement).value;

  // Empty text or an unusable font name would make the saved session fail to restore: keep the last
  // valid value, and show it again when the field is left.
  function onContent(e: Event) {
    if (value(e)) actions.setText({ content: value(e) });
  }
  function onFont(e: Event) {
    const font = cleanFontName(value(e));
    if (font) actions.setText({ font });
  }
  const showKept = (key: 'content' | 'font') => (e: Event) => ((e.target as HTMLInputElement).value = shadow.text[key]);

  function onSize(e: Event) {
    const v = Number(value(e));
    if (value(e) !== '' && !Number.isNaN(v)) actions.setText({ size: Math.min(240, Math.max(12, v)) });
  }

  // Hex is committed on change (blur/Enter) so a half-typed value never jumps the caret.
  function onHex(e: Event) {
    const input = e.target as HTMLInputElement;
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.value.trim());
    if (!m) {
      input.value = t.color;
      return;
    }
    const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
    actions.setText({ color: `#${hex.toLowerCase()}` });
  }

  // The file is read locally into a FontFace: no upload, no network (the CSP allows fonts from 'self' only).
  async function onFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    fontFailed = true;
    if (file.size > MAX_FONT_BYTES) {
      fontStatus = 'Arquivo grande demais: o limite é 5 MB.';
      return;
    }
    const name = cleanFontName(file.name.replace(/\.[^.]*$/, '')) || 'Fonte carregada';
    try {
      const face = new FontFace(name, await file.arrayBuffer());
      document.fonts.add(await face.load());
      if (!uploaded.includes(name)) uploaded.push(name);
      actions.setText({ font: name });
      loads++;
      fontFailed = false;
      fontStatus = `Fonte ${name} carregada.`;
    } catch {
      fontStatus = 'Não consegui ler esse arquivo de fonte.';
    }
  }
</script>

<section class="group" aria-labelledby="text-title">
  <h2 id="text-title">Tipografia</h2>
  <div class="fields">
    <div class="field">
      <label for="text-content">Texto</label>
      <input
        type="text"
        id="text-content"
        class="text-field"
        maxlength="60"
        autocomplete="off"
        value={t.content}
        oninput={onContent}
        onchange={showKept('content')}
      />
    </div>

    <div class="field">
      <label for="text-font">Fonte</label>
      <input
        type="text"
        id="text-font"
        class="text-field"
        list="text-fonts"
        maxlength="60"
        spellcheck="false"
        autocomplete="off"
        aria-describedby={missing ? 'text-font-missing' : undefined}
        value={t.font}
        oninput={onFont}
        onchange={showKept('font')}
      />
      <datalist id="text-fonts">
        {#each fonts as f (f)}<option value={f}></option>{/each}
      </datalist>
      {#if missing}
        <p id="text-font-missing" class="tool-hint">
          Fonte não encontrada neste computador; o navegador usa uma substituta.
        </p>
      {/if}
    </div>

    <div class="field">
      <label for="text-font-file">Carregar fonte</label>
      <input
        type="file"
        id="text-font-file"
        accept=".ttf,.otf,.woff,.woff2"
        aria-describedby="text-font-hint"
        onchange={onFile}
      />
      <p id="text-font-hint" class="tool-hint">A fonte fica só neste navegador; nada é enviado.</p>
      <p class="tool-status" class:failed={fontFailed} role="status">{fontStatus}</p>
    </div>

    <div class="field">
      <div class="field-head">
        <label for="text-size">Tamanho</label>
        <span class="num">
          <input
            type="number"
            id="text-size-value"
            aria-label="Tamanho em pixels"
            min="12"
            max="240"
            value={t.size}
            oninput={onSize}
          />
          <span class="unit" aria-hidden="true">px</span>
        </span>
      </div>
      <input type="range" id="text-size" min="12" max="240" value={t.size} oninput={onSize} />
    </div>

    <div class="field field-inline">
      <label for="text-weight">Peso</label>
      <select
        id="text-weight"
        value={t.weight}
        onchange={(e) => actions.setText({ weight: Number((e.target as HTMLSelectElement).value) })}
      >
        {#each WEIGHTS as w (w)}<option value={w}>{w}</option>{/each}
      </select>
    </div>

    <div class="field field-inline">
      <label for="text-color">Cor</label>
      <span class="color-pair">
        <input
          type="color"
          id="text-color"
          value={t.color}
          oninput={(e) => actions.setText({ color: value(e) })}
        />
        <input
          type="text"
          class="hex"
          id="text-color-value"
          aria-label="Cor do texto em hexadecimal"
          value={t.color}
          maxlength="7"
          spellcheck="false"
          autocomplete="off"
          onchange={onHex}
        />
      </span>
    </div>
  </div>
</section>
