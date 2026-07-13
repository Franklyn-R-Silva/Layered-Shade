import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => ({
  plugins: [svelte()],
  // Svelte 5 resolves its browser build under the "browser" condition, which the
  // test runner needs when mounting components.
  resolve: mode === 'test' ? { conditions: ['browser'] } : {},
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/shadow.ts', 'src/lib/config/controls.ts'],
      exclude: ['**/*.test.ts', '**/*.d.ts'],
    },
  },
}));
