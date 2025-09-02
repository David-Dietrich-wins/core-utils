import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '.github/**',
      '.next/**',
      '_next/**',
      '.vscode/**',
      'build/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'out/**',
    ],
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.mjs', 'src/**/*.mts'],
  },
  eslint.configs.all,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectServices: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'camelcase': 'off',
      'capitalized-comments': 'off',
      'consistent-return': 'off',
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'id-length': 'off',
      'init-declarations': 'off',
      'max-classes-per-file': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off' /*  */,
      'max-statements': 'off',
      'new-cap': 'off',
      'no-console': 'off',
      'no-empty-function': 'off',
      'no-magic-numbers': 'off',
      'no-nested-ternary': 'off',
      'no-plusplus': 'off',
      'no-ternary': 'off',
      'no-undefined': 'off',
      'one-var': 'off',
      'prefer-destructuring': 'off',
      'yoda': 'off',
    },
  }
)
