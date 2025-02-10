import { jest } from '@jest/globals'
import { MgmLogger } from './services/MgmLogger.mjs'
import CryptoHelper from './services/CryptoHelper.mjs'
import { ApiProps } from './models/types.mjs'
import { JwtTokenWithUserId } from './services/jwt.mjs'
// import { HttpHandler } from 'msw'
// import { setupServer } from 'msw/node'

// Set to 60 seconds. We are going over Global VPN.
jest.setTimeout(600000)

export const CONST_RegexUptimeMatcher = new RegExp('^\\d+m*s$')
export const CONST_RegexForElapsedTime = /^(\d+ seconds|1 second|\d+m?s)/
export const CONST_RegexStringSecondsOrMilliseconds = '(\\d+ seconds|1 second|\\d+ms)'

// const mgmHandlers: HttpHandler[] = []

// export const mockServer = setupServer(...mgmHandlers)

const TEST_Parameters_DEV = {
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
})

export const mockConsoleDebug = jest.spyOn(console, 'debug').mockImplementation(() => {})
export const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
export const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation(() => {})
export const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
export const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})

export const mockLoggerDebug: jest.Mock<typeof MgmLogger.prototype.debug> = jest.fn()
export const mockLoggerError: jest.Mock<typeof MgmLogger.prototype.error> = jest.fn()
export const mockLoggerInfo: jest.Mock<typeof MgmLogger.prototype.info> = jest.fn()
export const mockLoggerLog: jest.Mock<typeof MgmLogger.prototype.logToFile> = jest.fn()
export const mockLoggerSilly: jest.Mock<typeof MgmLogger.prototype.silly> = jest.fn()
export const mockLoggerWarn: jest.Mock<typeof MgmLogger.prototype.warn> = jest.fn()

export const globalLogger = {
  debug: mockLoggerDebug,
  error: mockLoggerError,
  info: mockLoggerInfo,
  log: mockLoggerLog,
  warn: mockLoggerWarn,
} as unknown as MgmLogger

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
  return CryptoHelper.rsaEncryptStatic(CryptoHelper.GenerateRandomPin(4), 'rsaPublicKey')
}

export function getAceApiParams() {
  const apiParams: ApiProps = {
    baseUrl: TEST_Parameters_DEV.apiBaseUrl,
  }

  return apiParams
}
