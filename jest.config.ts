import type { Config } from 'jest'
// import { defaults } from 'jest-config'

const config: Config = {
  // moduleFileExtensions: [...defaults.moduleFileExtensions, 'mjs'],
  // modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // preset: 'ts-jest',
  testEnvironment: 'node',
  // extensionsToTreatAsEsm: ['.ts', '.mts'],
  // setupFiles: ['<rootDir>/__test__/setupTests'],
  // setupFilesAfterEnv: ['<rootDir>/__tests__/setupAfterEnvGlobal.ts'],
  // testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/__tests__/setupAfterEnvGlobal.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules'],
  testMatch: ['**/*.test.ts', '**/*.test.mts', '**/*.test.mjs'],

  // collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/types/**/*.ts'],
  // transform: {
  //   '^.+\\.ts$': 'ts-jest',
  // },
}

export default config
