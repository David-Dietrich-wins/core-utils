import * as z from 'zod/v4'
import { jest } from '@jest/globals'
// eslint-disable-next-line sort-imports
import { JwtPayload } from 'jsonwebtoken'
import { JwtTokenWithEmail } from './services/jwt.mjs'
import { LogManagerOptions } from './services/LogManager.mjs'
import { NumberToString } from './primitives/number-helper.mjs'
import { safestr } from './primitives/string-helper.mjs'

// Import { HttpHandler } from 'msw'
// Import { setupServer } from 'msw/node'

// Set to 60 seconds. We are going over Global VPN.
// jest.setTimeout(600000)

export const CONST_RegexUptimeMatcher = /^\d+m*s$/u
export const CONST_RegexForElapsedTime = /^(?:\d+ seconds|1 second|\d+m?s)/u
export const CONST_RegexStringSecondsOrMilliseconds =
  '(\\d+ seconds|1 second|\\d+ms)'

export const mockLoggerDebug = jest.fn()
export const mockLoggerError = jest.fn()
export const mockLoggerInfo = jest.fn()
export const mockLoggerLog = jest.fn()
export const mockLoggerSilly = jest.fn()
export const mockLoggerWarn = jest.fn()

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ZodTestHelper {
  static Issue(error: object) {
    return {
      issues: expect.arrayContaining([expect.objectContaining(error)]),
    }
  }

  static SuccessFalseSingle(error: object) {
    return {
      error: expect.objectContaining({
        issues: expect.arrayContaining([expect.objectContaining(error)]),
      }),
      success: false,
    }
  }

  static SuccessFalse(errors: z.ZodError[][]) {
    return {
      error: expect.objectContaining(ZodTestHelper.InvalidUnion(errors)),
      success: false,
    }
  }
  static InvalidUnion(errors: z.ZodError[][]) {
    return {
      issues: expect.arrayContaining([
        expect.objectContaining({
          code: 'invalid_union',
          errors: expect.arrayContaining(errors),
          message: 'Invalid input',
          path: [],
        }),
      ]),
    }
  }

  static InvalidEmail() {
    return {
      code: 'invalid_format',
      format: 'email',
      message: 'Invalid email address',
      origin: 'string',
      path: [],
      pattern:
        "/^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$/",
    }
  }

  static InvalidType(
    expected = 'array',
    received = 'string',
    path: (string | number)[] = []
  ) {
    return {
      code: 'invalid_type',
      expected,
      message: `Invalid input: expected ${expected}, received ${received}`,
      path,
    }
  }
  static InvalidTypeArrayString() {
    return ZodTestHelper.InvalidType('array', 'string')
  }
  static InvalidTypeStringArray() {
    return ZodTestHelper.InvalidType('string', 'array')
  }

  static StringTooBig(
    maximum: number,
    path: (string | number)[] = [],
    inclusive?: boolean
  ) {
    const ret: Partial<z.core.$ZodIssueTooBig & { origin: string }> = {
      code: 'too_big',
      inclusive,
      maximum,
      message: `Too big: expected string to have <=${maximum.toString()} characters`,
      origin: 'string',
      path,
    }

    return ret
  }
  static StringTooSmall(
    minimum: number,
    path: (string | number)[] = [],
    inclusive?: boolean
  ) {
    const ret: Partial<z.core.$ZodIssueTooSmall & { origin: string }> = {
      code: 'too_small',
      inclusive,
      message: `Too small: expected string to have >=${NumberToString(
        minimum
      )} characters`,
      minimum,
      origin: 'string',
      path,
    }

    return ret
  }

  static ArrayTooBig(maximum: number, path: (string | number)[] = []) {
    return {
      code: 'too_big',
      maximum,
      message: `Too big: expected array to have <=${NumberToString(
        maximum
      )} items`,
      origin: 'array',
      path,
    }
  }
  static ArrayTooSmall(minimum: number, path: (string | number)[] = []) {
    return {
      code: 'too_small',
      message: `Too small: expected array to have >=${NumberToString(
        minimum
      )} items`,
      minimum,
      origin: 'array',
      path,
    }
  }
}

const globalLogger = jest.fn().mockImplementation(() => ({
  debug: mockLoggerDebug,
  error: mockLoggerError,
  info: mockLoggerInfo,
  log: mockLoggerLog,
  silly: mockLoggerSilly,
  warn: mockLoggerWarn,
}))
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

// Const httpHandlers: HttpHandler[] = []

// Export const mockServer = setupServer(...httpHandlers)

export const TEST_Settings: {
  apiBaseUrl: string
  beforeEach: () => void
  currentDate: Date
  currentDateInMilliseconds: number
  currentDateString: string
  jwt: string
  rsaPassPhrase: string
  rsaPrivateKey: string
  rsaPublicKey: string
  userIdBad: number
  userIdGood: number
  userIdGoodEmail: string
} = {
  apiBaseUrl: 'http://localhost:3000',
  beforeEach: () => {
    TEST_Settings.currentDate = new Date(TEST_Settings.currentDateString)
    TEST_Settings.currentDateInMilliseconds =
      TEST_Settings.currentDate.getTime()

    TEST_Settings.rsaPassPhrase = safestr(process.env.rsaPassPhrase)
    TEST_Settings.rsaPrivateKey = safestr(process.env.rsaPrivateKey)
    TEST_Settings.rsaPublicKey = safestr(process.env.rsaPublicKey)

    // eslint-disable-next-line no-use-before-define
    TEST_Settings.jwt = GenerateSignedJwtToken(TEST_Settings.userIdGoodEmail)
  },
  currentDate: new Date('2025-12-01T12:00:00.000Z'),
  currentDateInMilliseconds: 0,
  currentDateString: '2025-12-01T12:00:00.000Z',
  jwt: '',
  rsaPassPhrase: safestr(process.env.rsaPassPhrase),
  rsaPrivateKey: safestr(process.env.rsaPrivateKey),
  rsaPublicKey: safestr(process.env.rsaPublicKey),
  userIdBad: 987654321,
  userIdGood: 123456789,
  userIdGoodEmail: 'test@test.com',
}

export function GenerateSignedJwtToken(
  email: string = TEST_Settings.userIdGoodEmail,
  overrides?: Partial<JwtPayload>
) {
  return JwtTokenWithEmail(
    email,
    TEST_Settings.rsaPrivateKey,
    TEST_Settings.rsaPassPhrase,
    overrides
  )
}

beforeAll(() => {
  // Process.env.NODE_ENV = 'test'
  const jwtToken = GenerateSignedJwtToken(TEST_Settings.userIdGoodEmail)

  TEST_Settings.jwt = jwtToken

  // MockServer.listen({
  //   // This tells MSW to throw an error whenever it
  //   // encounters a request that doesn't have a
  //   // matching request handler.
  //   OnUnhandledRequest: 'error',
  // })

  // https://stackoverflow.com/questions/29719631/how-do-i-set-a-mock-date-in-jest
  jest.useFakeTimers({
    doNotFake: ['queueMicrotask'],
  })

  jest.setSystemTime(TEST_Settings.currentDate)
})

afterAll(() => {
  jest.useRealTimers()
})

export function getCurrentDate() {
  return TEST_Settings.currentDate
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
  // Jest.resetModules()

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

  TEST_Settings.beforeEach()
})

afterEach(() => {
  jest.resetModules()
  // MockServer.resetHandlers()

  process.env = { ...originalEnv }
})

// AfterAll(() => {
//   MockServer.close()
// })
