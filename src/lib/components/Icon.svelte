<script lang="ts">
  // One stroke icon set (24px grid, 1.75 stroke) so no glyph or emoji stands in for an icon.
  const PATHS = {
    plus: 'M12 5v14M5 12h14',
    close: 'M6 6l12 12M18 6L6 18',
    copy: 'M9 9h10v10H9zM5 15V5h10',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    reset: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5',
    package: 'M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8',
  } as const;

  const { name, size = 16 }: { name: keyof typeof PATHS; size?: number } = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"><path d={PATHS[name]} /></svg
>
