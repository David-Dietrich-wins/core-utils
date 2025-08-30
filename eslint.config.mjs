import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/**/*.ts',
      'dist/**',
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'build/**',
      '**/*.mjs',
      'next.config.ts',
      'jest.config.ts',
      'jest.setup.mts',
      'jest.setup.ts',
      'jsdom-extended.mts',
      'jsdom-extended.ts',
      'eslint.config.mjs',
      '**/*.js',
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
        project: './tsconfig.test.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
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
