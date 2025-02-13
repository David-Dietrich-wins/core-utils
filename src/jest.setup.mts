import { jest } from '@jest/globals'
import CryptoHelper from './services/CryptoHelper.mjs'
import { ApiProps } from './models/types.mjs'
import { JwtTokenWithUserId } from './services/jwt.mjs'
import { LogManagerOptions } from './index.mjs'
// import { HttpHandler } from 'msw'
// import { setupServer } from 'msw/node'

// Set to 60 seconds. We are going over Global VPN.
jest.setTimeout(600000)

export const CONST_RegexUptimeMatcher = new RegExp('^\\d+m*s$')
export const CONST_RegexForElapsedTime = /^(\d+ seconds|1 second|\d+m?s)/
export const CONST_RegexStringSecondsOrMilliseconds =
  '(\\d+ seconds|1 second|\\d+ms)'

export const mockLoggerDebug = jest.fn()
export const mockLoggerError = jest.fn()
export const mockLoggerInfo = jest.fn()
export const mockLoggerLog = jest.fn()
export const mockLoggerSilly = jest.fn()
export const mockLoggerWarn = jest.fn()

const globalLogger = jest.fn().mockImplementation(() => {
  return {
    debug: mockLoggerDebug,
    error: mockLoggerError,
    info: mockLoggerInfo,
    log: mockLoggerLog,
    silly: mockLoggerSilly,
    warn: mockLoggerWarn,
  }
})
jest.unstable_mockModule('./services/LogManager.mjs', () => ({
  LogManager: globalLogger,
}))

const { LogManager } = await import('./services/LogManager.mjs')
export function getGlobalLogger() {
  const loggerOptions: LogManagerOptions = {
    componentName: 'test',
    includeHttpRequestDataInTheLog: true,
    includeHttpResponseDataInTheLog: true,
    logBaseFileName: 'test',
    logFileName: 'test.log',
    logLevel: 'all',
    maxFiles: 10,
    maxSize: 1000000,
    rotateBaseFileName: 'test',
    showConsole: true,
    suffixDatePattern: 'YYYY-MM-DD-HH',
  }

  return new LogManager(loggerOptions)
}

// const httpHandlers: HttpHandler[] = []

// export const mockServer = setupServer(...httpHandlers)

export const TEST_Parameters_DEV = {
  apiBaseUrl: 'http://localhost:3000',
  userIdGood: 123456789,
  userIdBad: 987654321,
  jwt: '',
}

export function getSignedJwtTokenWithPlayerId(userId: number) {
  return JwtTokenWithUserId(userId, 'my passphrase')
}

beforeAll(() => {
  // process.env.NODE_ENV = 'test'
  // process.env.APPLICATIONINSIGHTS_CONNECTION_STRING =
  //   'InstrumentationKey=771cff7b-216b-4919-9aee-686918a3c877;IngestionEndpoint=https://westus-0.in.applicationinsights.azure.com/;LiveEndpoint=https://westus.livediagnostics.monitor.azure.com/'

  const jwtToken = getSignedJwtTokenWithPlayerId(TEST_Parameters_DEV.userIdGood)

  TEST_Parameters_DEV.jwt = jwtToken

  // mockServer.listen({
  //   // This tells MSW to throw an error whenever it
  //   // encounters a request that doesn't have a
  //   // matching request handler.
  //   onUnhandledRequest: 'error',
  // })

  Date.now = jest.fn(() => new Date().getTime())
})

export function getCurrentDate() {
  return new Date(Date.now())
}

export const mockConsoleDebug = jest
  .spyOn(console, 'debug')
  .mockImplementation(() => {})
export const mockConsoleError = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {})
export const mockConsoleInfo = jest
  .spyOn(console, 'info')
  .mockImplementation(() => {})
export const mockConsoleLog = jest
  .spyOn(console, 'log')
  .mockImplementation(() => {})
export const mockConsoleWarn = jest
  .spyOn(console, 'warn')
  .mockImplementation(() => {})

const originalEnv = { ...process.env }

beforeEach(() => {
  // jest.resetModules()

  mockConsoleDebug.mockClear()
  mockConsoleError.mockClear()
  mockConsoleInfo.mockClear()
  mockConsoleLog.mockClear()
  mockConsoleWarn.mockClear()

  mockLoggerDebug.mockClear()
  mockLoggerError.mockClear()
  mockLoggerInfo.mockClear()
  mockLoggerLog.mockClear()
  mockLoggerSilly.mockClear()
  mockLoggerWarn.mockClear()
})

afterEach(() => {
  // mockServer.resetHandlers()

  process.env = originalEnv
})

// afterAll(() => {
//   mockServer.close()
// })

export function GenerateRandomPinEncrypted() {
  return CryptoHelper.rsaEncryptStatic(
    CryptoHelper.GenerateRandomPin(4),
    'rsaPublicKey'
  )
}

export function getAceApiParams() {
  const apiParams: ApiProps = {
    baseUrl: TEST_Parameters_DEV.apiBaseUrl,
  }

  return apiParams
}
