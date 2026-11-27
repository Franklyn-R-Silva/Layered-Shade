<script lang="ts">
  import { image } from '../image.svelte';
  import { t, type Key } from '../i18n.svelte';

  const TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
  const MIN_W = 40;
  const MAX_W = 480;

  // Kept as a key so the message follows a language switch.
  let status = $state<[Key, string?]>();
  let failed = $state(false);

  // Read locally as a data: URL (the CSP allows img-src data:, not blob:): no upload, no network.
  // shortcut: a file of an accepted type that does not decode shows a broken image; check img.decode() if that matters.
  function onFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    failed = true;
    if (!TYPES.includes(file.type)) {
      status = ['imageWrongType'];
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      status = ['imageTooBig'];
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      image.src = reader.result as string;
      image.name = file.name;
      failed = false;
      status = ['imageLoaded', file.name];
    };
    reader.onerror = () => (status = ['imageUnreadable']);
    reader.readAsDataURL(file);
  }

  function onWidth(e: Event) {
    const input = e.target as HTMLInputElement;
    const v = Number(input.value);
    if (input.value !== '' && !Number.isNaN(v)) image.width = Math.min(MAX_W, Math.max(MIN_W, Math.round(v)));
  }
</script>

<section class="group" aria-labelledby="image-title">
  <h2 id="image-title">{t('image')}</h2>
  <div class="fields">
    <div class="field">
      <label for="image-file">{t('imageFile')}</label>
      <input type="file" id="image-file" accept={TYPES.join(',')} aria-describedby="image-hint" onchange={onFile} />
      <p id="image-hint" class="tool-hint">{t('imageHint')}</p>
      <p class="tool-status" class:failed role="status">
        {status ? t(status[0], { name: status[1] ?? '' }) : ''}
      </p>
    </div>

    <div class="field">
      <div class="field-head">
        <label for="image-width">{t('imageWidth')}</label>
        <span class="num">
          <input
            type="number"
            id="image-width-value"
            aria-label={t('inPixels', { label: t('imageWidth') })}
            min={MIN_W}
            max={MAX_W}
            value={image.width}
            oninput={onWidth}
          />
          <span class="unit" aria-hidden="true">px</span>
        </span>
      </div>
      <input type="range" id="image-width" min={MIN_W} max={MAX_W} value={image.width} oninput={onWidth} />
    </div>
  </div>
</section>
