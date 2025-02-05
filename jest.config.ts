import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
<<<<<<< HEAD
  testMatch: ['**/src/**/*.test.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/types/**/*.ts'],
  transform: {
    globals: [
      'ts-jest',
      {
        diagnostics: false,
        isolatedModules: true,
        /* ts-jest config goes here in Jest */
      },
    ],
  },
=======
  // extensionsToTreatAsEsm: ['ts', 'mts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/types/**/*.ts'],
>>>>>>> 5ed179635b17d3454802648186c6b4d535190e23
}

export default config
