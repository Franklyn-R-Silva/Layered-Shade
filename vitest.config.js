import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'js/model/ShadowModel.js',
        'js/config/controlsConfig.js',
        'js/components/ControlFactory.js',
        'js/components/NotificationManager.js',
        'js/components/TabManager.js',
        'js/components/LayerManager.js',
      ],
      exclude: ['**/*.test.js', 'node_modules/**', 'tests/**'],
    },
  },
});
