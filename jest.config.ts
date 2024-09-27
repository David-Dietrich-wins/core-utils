import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  // modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // preset: 'ts-jest',
  // roots: ['<rootDir>/src/', '<rootDir>/__tests__/'],
  testEnvironment: 'node',
  // extensionsToTreatAsEsm: ['.ts', '.mts'],
  moduleDirectories: ['node_modules', 'src', '__tests__'],
  // setupFiles: ['<rootDir>/__test__/setupTests'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupAfterEnvGlobal.mts'],
  testMatch: ['<rootDir>/src/**/*.test.mts'],
  // testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/__tests__/setupAfterEnvGlobal.ts'],

  // collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/types/**/*.ts'],
  transform: {
    '^.+\\.m+ts$': 'ts-jest',
  },
}

export default config
