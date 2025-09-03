// @ts-check

import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import jestPlugin from 'eslint-plugin-jest'
import tseslint from 'typescript-eslint'

export default defineConfig(
  {
    ignores: [
      '**/.github/**',
      '**/.next/**',
      '**/_next/**',
      '**/.vscode/**',
      '**/build/**',
      '**/coverage/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/out/**',
      '**/storybook-static/**',
      '**/*.d.ts',
      '**/*.d.cts',
      '**/*.d.mts',
    ],
  },
  eslint.configs.all,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // projectService: true,
        project: './tsconfig.test.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'jest': jestPlugin,
    },
    rules: {
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'camelcase': 'off',
      'capitalized-comments': 'off',
      'class-methods-use-this': 'off',
      'consistent-return': 'off',
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'id-length': 'off',
      'init-declarations': 'off',
      'max-classes-per-file': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',
      'max-statements': 'off',
      'new-cap': 'off',
      'no-console': 'off',
      'no-empty-function': 'off',
      // '@typescript-eslint/no-floating-promises': 'error',
      'no-magic-numbers': 'off',
      'no-nested-ternary': 'off',
      'no-plusplus': 'off',
      'no-ternary': 'off',
      'no-undef-init': 'off',
      'no-undefined': 'off',
      'no-underscore-dangle': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-useless-assignment': 'off',
      'one-var': 'off',
      'prefer-destructuring': 'off',
      'yoda': 'off',
    },
  },
  {
    // disable type-aware linting on JS files
    extends: [tseslint.configs.disableTypeChecked],
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
  },
  {
    // enable jest rules on test files
    extends: [jestPlugin.configs['flat/all']],
    files: [
      '__tests__/**',
      'test/**',
      '**/*.test.js',
      '**/*.test.ts',
      '**/*.spec.js',
      '**/*.spec.ts',
    ],
  }
)
