import type { Config } from 'jest'
// import { defaults } from 'jest-config'

const config: Config = {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  // globals: {
  //   'ts-jest': {
  //     useESM: true,
  //   },
  // },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
  },
  moduleFileExtensions: ['js', 'ts', 'mjs', 'mts'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.mts', '!src/**/*.d.ts', '!src/**/*.d.mts'],

  extensionsToTreatAsEsm: ['.ts', '.mts'],
  setupFilesAfterEnv: ['./src/jest.setup.mts'],
  transform: {
    '^.+\\.(mt|t|cj|j)s$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
}

export default config
