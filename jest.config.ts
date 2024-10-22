import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  verbose: true,
  // testMatch: ['src/**/*.test.ts', 'src/**/*.test.mts'],
  testMatch: ['**/__tests__/**/*.m[jt]s?(x)', '**/src/**/?(*.)+(spec|test).m[tj]s?(x)'],
  transform: {
    '^.+\\.m+ts?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}

export default config
