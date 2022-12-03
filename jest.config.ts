export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.spec.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/types/**/*.ts',
  ],
  transform: {
    'globals': ['ts-jest', {
      diagnostics: false,
      isolatedModules: true,
      /* ts-jest config goes here in Jest */
    }]
  }
}
