<script module lang="ts">
  // Families loaded this visit (uploaded files, the computer's list, Google loads). Names only.
  const uploaded = $state<string[]>([]);
  const local = $state<string[]>([]);
  const fromGoogle = $state<string[]>([]);
</script>

<script lang="ts">
  import { state as shadow, actions } from '../state.svelte';
  import { cleanFontName, GENERIC_FONTS } from '../shadow';
  import { MAX_LINES, MAX_TEXT } from '../share';
  import { SYSTEM_FONTS, googleCatalog, loadGoogleFont, canListLocalFonts, listLocalFonts, type GoogleFont } from '../fonts';
  import { t, type Key } from '../i18n.svelte';

  const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  const MAX_FONT_BYTES = 5 * 1024 * 1024;

  const text = $derived(shadow.text);

  // The Google catalogue (~1,960 families) is fetched from this site the first time the font field is used.
  let google = $state<GoogleFont[]>([]);
  const googleNames = $derived(new Map(google.map((f) => [f.family.toLowerCase(), f])));
  function openCatalog() {
    if (!google.length) googleCatalog().then((list) => (google = list)).catch(() => {});
  }

  const fonts = $derived([
    ...new Set(['Overpass', ...uploaded, ...local, ...SYSTEM_FONTS, ...GENERIC_FONTS, ...google.map((f) => f.family)]),
  ]);

  let loads = $state(0);
  // Kept as a key so the message follows a language switch.
  let fontStatus = $state<[Key, string?]>();
  let fontFailed = $state(false);

  // A family is installed when text set in it measures differently from both generic fallbacks.
  // (document.fonts.check() answers true in Chrome even for fonts the machine does not have.)
  const missing = $derived.by(() => {
    void loads;
    if (GENERIC_FONTS.includes(text.font.toLowerCase())) return false;
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return false; // no canvas (tests, old browsers): do not claim it is missing
    const width = (family: string) => {
      ctx.font = `72px ${family}`;
      return ctx.measureText('mmmmmmmmmmlli WAV 0123').width;
    };
    return ['monospace', 'serif'].every((g) => width(`"${text.font}", ${g}`) === width(g));
  });

  // Offer Google only for a catalogue family that is not already usable here.
  const googleFont = $derived(googleNames.get(text.font.toLowerCase()));
  const offerGoogle = $derived(!!googleFont && !fromGoogle.includes(googleFont.family) && missing);

  const value = (e: Event) => (e.target as HTMLInputElement | HTMLTextAreaElement).value;

  // Empty text or an unusable font name would make the saved session fail to restore: keep the last
  // valid value, and show it again when the field is left.
  function onContent(e: Event) {
    const v = value(e).replace(/\r\n?/g, '\n').split('\n').slice(0, MAX_LINES).join('\n');
    if (v.trim()) actions.setText({ content: v });
  }
  function onFont(e: Event) {
    const font = cleanFontName(value(e));
    if (font) actions.setText({ font });
  }
  const showKept = (key: 'content' | 'font') => (e: Event) =>
    ((e.target as HTMLInputElement | HTMLTextAreaElement).value = shadow.text[key]);

  function onSize(e: Event) {
    const v = Number(value(e));
    if (value(e) !== '' && !Number.isNaN(v)) actions.setText({ size: Math.min(240, Math.max(12, v)) });
  }

  // Hex is committed on change (blur/Enter) so a half-typed value never jumps the caret.
  function onHex(e: Event) {
    const input = e.target as HTMLInputElement;
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.value.trim());
    if (!m) {
      input.value = text.color;
      return;
    }
    const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
    actions.setText({ color: `#${hex.toLowerCase()}` });
  }

  // The file is read locally into a FontFace: no upload, no network.
  async function onFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    fontFailed = true;
    if (file.size > MAX_FONT_BYTES) {
      fontStatus = ['fontTooBig'];
      return;
    }
    const name = cleanFontName(file.name.replace(/\.[^.]*$/, '')) || t('fontDefaultName');
    try {
      const face = new FontFace(name, await file.arrayBuffer());
      document.fonts.add(await face.load());
      if (!uploaded.includes(name)) uploaded.push(name);
      actions.setText({ font: name });
      loads++;
      fontFailed = false;
      fontStatus = ['fontLoaded', name];
    } catch {
      fontStatus = ['fontUnreadable'];
    }
  }

  // Installed fonts: the browser asks the user's permission (Chromium's Local Font Access API).
  async function onListLocal() {
    try {
      const families = await listLocalFonts();
      for (const f of families) if (!local.includes(f)) local.push(f);
      fontFailed = false;
      fontStatus = ['localFontsFound', String(families.length)];
    } catch {
      fontFailed = true;
      fontStatus = ['localFontsDenied'];
    }
  }

  // Google Fonts: only on this explicit click, because it sends a request (and the IP) to Google.
  async function onLoadGoogle() {
    const font = googleFont;
    if (!font) return;
    fontFailed = false;
    fontStatus = ['googleFontLoading', font.family];
    try {
      await loadGoogleFont(font);
      fromGoogle.push(font.family);
      loads++;
      fontStatus = ['googleFontLoaded', font.family];
    } catch {
      fontFailed = true;
      fontStatus = ['googleFontFailed'];
    }
  }
</script>

<section class="group" aria-labelledby="text-title">
  <h2 id="text-title">{t('typography')}</h2>
  <div class="fields">
    <div class="field">
      <label for="text-content">{t('text')}</label>
      <textarea
        id="text-content"
        class="text-field"
        rows="2"
        maxlength={MAX_TEXT}
        autocomplete="off"
        aria-describedby="text-lines-hint"
        value={text.content}
        oninput={onContent}
        onchange={showKept('content')}
      ></textarea>
      <p id="text-lines-hint" class="tool-hint">{t('textLinesHint')}</p>
    </div>

    <div class="field">
      <label for="text-font">{t('font')}</label>
      <input
        type="text"
        id="text-font"
        class="text-field"
        list="text-fonts"
        maxlength="60"
        spellcheck="false"
        autocomplete="off"
        aria-describedby="text-font-search{missing ? ' text-font-missing' : ''}"
        value={text.font}
        onfocus={openCatalog}
        oninput={onFont}
        onchange={showKept('font')}
      />
      <datalist id="text-fonts">
        {#each fonts as f (f)}<option value={f}></option>{/each}
      </datalist>
      <p id="text-font-search" class="tool-hint">{t('fontSearchHint', { name: google.length || '1900+' })}</p>
      {#if offerGoogle}
        <button type="button" class="btn btn-block" aria-describedby="google-font-notice" onclick={onLoadGoogle}>
          {t('googleFontLoad', { name: googleFont?.family ?? '' })}
        </button>
        <p id="google-font-notice" class="tool-hint">{t('googleFontNotice')}</p>
      {:else if missing}
        <p id="text-font-missing" class="tool-hint">{t('fontMissing')}</p>
      {/if}
      {#if canListLocalFonts()}
        <button type="button" class="btn btn-quiet btn-block" onclick={onListLocal}>{t('listLocalFonts')}</button>
      {:else}
        <p class="tool-hint">{t('localFontsUnsupported')}</p>
      {/if}
    </div>

    <div class="field">
      <label for="text-font-file">{t('loadFont')}</label>
      <input
        type="file"
        id="text-font-file"
        accept=".ttf,.otf,.woff,.woff2"
        aria-describedby="text-font-hint"
        onchange={onFile}
      />
      <p id="text-font-hint" class="tool-hint">{t('fontStaysLocal')}</p>
      <p class="tool-status" class:failed={fontFailed} role="status">
        {fontStatus ? t(fontStatus[0], { name: fontStatus[1] ?? '' }) : ''}
      </p>
    </div>

    <div class="field">
      <div class="field-head">
        <label for="text-size">{t('size')}</label>
        <span class="num">
          <input
            type="number"
            id="text-size-value"
            aria-label={t('sizeInPixels')}
            min="12"
            max="240"
            value={text.size}
            oninput={onSize}
          />
          <span class="unit" aria-hidden="true">px</span>
        </span>
      </div>
      <input type="range" id="text-size" min="12" max="240" value={text.size} oninput={onSize} />
    </div>

    <div class="field field-inline">
      <label for="text-weight">{t('weight')}</label>
      <select
        id="text-weight"
        value={text.weight}
        onchange={(e) => actions.setText({ weight: Number((e.target as HTMLSelectElement).value) })}
      >
        {#each WEIGHTS as w (w)}<option value={w}>{w}</option>{/each}
      </select>
    </div>

    <div class="field field-inline">
      <label for="text-color">{t('color')}</label>
      <span class="color-pair">
        <input
          type="color"
          id="text-color"
          value={text.color}
          oninput={(e) => actions.setText({ color: value(e) })}
        />
        <input
          type="text"
          class="hex"
          id="text-color-value"
          aria-label={t('textColorHex')}
          value={text.color}
          maxlength="7"
          spellcheck="false"
          autocomplete="off"
          onchange={onHex}
        />
      </span>
    </div>
  </div>
</section>
