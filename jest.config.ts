import type { Config } from 'jest'
// import { defaults } from 'jest-config'

const config: Config = {
  // collectCoverageFrom: [
  //   'src/**/*.ts',
  //   'src/**/*.mts',
  //   '!src/**/*.d.ts',
  //   '!src/**/*.d.mts',
  // ],
  // coverageDirectory: 'coverage',
  coverageReporters: ['text'],
  // detectOpenHandles: true,
  // extensionsToTreatAsEsm: ['.ts', '.mts'],
  fakeTimers: {
    enableGlobally: true,
  },
  // moduleFileExtensions: ['js', 'ts', 'mjs', 'mts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.[cm]?[tj]s$': '$1',
  },
  preset: 'ts-jest/presets/default-esm',
  setupFilesAfterEnv: ['./src/jest.setup.mts'],

  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[cm]?ts$',
  transform: {
    '^.+\\.[cm]?[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        useESM: true,
      },
    ],
  },
  verbose: true,
}

export default config
