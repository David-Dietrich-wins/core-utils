import type { Config } from 'jest'
// import { defaults } from 'jest-config'

const config: Config = {
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.mts',
    '!src/**/*.d.ts',
    '!src/**/*.d.mts',
  ],
  coverageDirectory: 'coverage',
  extensionsToTreatAsEsm: ['.ts', '.mts'],
  fakeTimers: {
    enableGlobally: true,
  },
  moduleFileExtensions: ['js', 'ts', 'mjs', 'mts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.m?js$': '$1',
  },
  preset: 'ts-jest/presets/default-esm',
  setupFilesAfterEnv: ['./src/jest.setup.mts'],

  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  transform: {},
  // transform: {
  //   '^.+\\.(mt|t|cj|j)s$': [
  //     'ts-jest',
  //     {
  //       useESM: true,
  //     },
  //   ],
  // },
}

export default config
