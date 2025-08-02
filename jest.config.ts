import type { Config } from 'jest'
// import { defaults } from 'jest-config'

const config: Config = {
  fakeTimers: {
    enableGlobally: true,
  },
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.m?js$': '$1',
  },
  moduleFileExtensions: ['js', 'ts', 'mjs', 'mts'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.mts',
    '!src/**/*.d.ts',
    '!src/**/*.d.mts',
  ],

  extensionsToTreatAsEsm: ['.ts', '.mts'],
  setupFilesAfterEnv: ['./src/jest.setup.mts'],
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
