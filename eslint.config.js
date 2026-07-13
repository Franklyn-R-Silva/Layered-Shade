import js from '@eslint/js';
import globals from 'globals';

/**
 * ESLint flat config (ESLint 9+).
 * Mirrors the rules previously kept in the legacy .eslintrc.json.
 */
export default [
  {
    ignores: ['node_modules/', 'coverage/', '**/*.test.js'],
  },
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'multi-line'],
    },
  },
];
