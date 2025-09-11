import { jest } from '@jest/globals'
// eslint-disable-next-line sort-imports
import * as z from 'zod/v4'
import { numberToString } from './primitives/number-helper.mjs'
import { safestr } from './primitives/string-helper.mjs'

// Import { HttpHandler } from 'msw'
// Import { setupServer } from 'msw/node'

const originalEnv = { ...process.env }

// eslint-disable-next-line one-var
export const TEST_Settings: {
    apiBaseUrl: string
    beforeEach: () => void
    currentDate: Date
    currentDateInMilliseconds: number
    currentDateString: string
    // jwt: string
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
    },
    currentDate: new Date('2025-12-01T12:00:00.000Z'),
    currentDateInMilliseconds: 0,
    currentDateString: '2025-12-01T12:00:00.000Z',
    rsaPassPhrase: safestr(process.env.rsaPassPhrase),
    rsaPrivateKey: safestr(process.env.rsaPrivateKey),
    rsaPublicKey: safestr(process.env.rsaPublicKey),
    userIdBad: 987654321,
    userIdGood: 123456789,
    userIdGoodEmail: 'test@test.com',
  },
  mockConsoleDebug = jest.spyOn(console, 'debug').mockImplementation(() => {}),
  mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {}),
  mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation(() => {}),
  mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {}),
  mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {}),
  mockLoggerDebug = jest.fn(),
  mockLoggerError = jest.fn(),
  mockLoggerInfo = jest.fn(),
  mockLoggerLog = jest.fn(),
  mockLoggerSilly = jest.fn(),
  mockLoggerWarn = jest.fn()

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ZodTestHelper {
  static issue(error: object) {
    return {
      issues: expect.arrayContaining([expect.objectContaining(error)]),
    }
  }

  static successFalseSingle(error: object) {
    return {
      error: expect.objectContaining({
        issues: expect.arrayContaining([expect.objectContaining(error)]),
      }),
      success: false,
    }
  }

  static successFalse(errors: z.ZodError[][]) {
    return {
      error: expect.objectContaining(ZodTestHelper.invalidUnion(errors)),
      success: false,
    }
  }
  static invalidUnion(errors: z.ZodError[][]) {
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

  static invalidEmail() {
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

  static invalidType(
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
  static invalidTypeArrayString() {
    return ZodTestHelper.invalidType('array', 'string')
  }
  static invalidTypeStringArray() {
    return ZodTestHelper.invalidType('string', 'array')
  }

  static stringTooBig(
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
  static stringTooSmall(
    minimum: number,
    path: (string | number)[] = [],
    inclusive?: boolean
  ) {
    const ret: Partial<z.core.$ZodIssueTooSmall & { origin: string }> = {
      code: 'too_small',
      inclusive,
      message: `Too small: expected string to have >=${numberToString(
        minimum
      )} characters`,
      minimum,
      origin: 'string',
      path,
    }

    return ret
  }

  static arrayTooBig(maximum: number, path: (string | number)[] = []) {
    return {
      code: 'too_big',
      maximum,
      message: `Too big: expected array to have <=${numberToString(
        maximum
      )} items`,
      origin: 'array',
      path,
    }
  }
  static arrayTooSmall(minimum: number, path: (string | number)[] = []) {
    return {
      code: 'too_small',
      message: `Too small: expected array to have >=${numberToString(
        minimum
      )} items`,
      minimum,
      origin: 'array',
      path,
    }
  }
}

// Const httpHandlers: HttpHandler[] = []

// Export const mockServer = setupServer(...httpHandlers)

beforeAll(() => {
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

beforeEach(() => {
  jest.clearAllMocks()

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
