import { jest } from '@jest/globals'
import { LogManagerOptions } from './LogManager.mjs'
jest.unstable_unmockModule('./services/LogManager.mjs')
import winston from 'winston'
import { DateHelper } from './DateHelper.mjs'
import { ObjectTypesToString } from './object-helper.mjs'
import type DailyRotateFile from 'winston-daily-rotate-file'
const { LogManager } = await import('./LogManager.mjs')

let logManagerOptions: LogManagerOptions

const lmOptionsNoFiles: LogManagerOptions = {
  componentName: 'TestComponent',
  includeHttpRequestDataInTheLog: true,
  includeHttpResponseDataInTheLog: true,
  logCallback: jest.fn(),
  logBaseFileName: '',
  logFileName: '',
  logLevel: 'info',
  maxFiles: 5,
  maxSize: 100,
  rotateBaseFileName: '',
  showConsole: true,
  suffixDatePattern: 'YYYY-MM-DD',
}

// const mockLoggerCreateInstance = (LogManager.CreateInstance = jest.fn(
//   (options: LogManagerOptions) => {
//     return new LogManager(options)
//   }
// ))

beforeEach(() => {
  logManagerOptions = { ...lmOptionsNoFiles }
})

const lineFormatter = winston.format.printf(({ level, message, timestamp }) => {
  const msg =
    String(timestamp) +
    (message as unknown[])
      .map((e: unknown) => ObjectTypesToString(e, false, false))
      .join(' ')

  return `${DateHelper.FormatDateTimeWithMillis()}: [${level}]: ${msg}`
})

describe('constructor', () => {
  const lmOptionsGood = {
    ...logManagerOptions,
    logBaseFileName: 'test_base.log',
    logFileName: 'test.log',
    rotateBaseFileName: 'test_rotate.log',
  }

  test('good', () => {
    const logManager = new LogManager(lmOptionsGood)
    expect(logManager).toBeInstanceOf(LogManager)

    // expect(logManager.componentName).toBe('TestComponent')
    // expect(logManager.logLevel).toBe('info')
    // expect(logManager.includeHttpRequestDataInTheLog).toBe(false)
    // expect(logManager.includeHttpResponseDataInTheLog).toBe(false)
  })

  test('bad: no logBaseFileName, logFileName, or rotateBaseFileName', () => {
    expect(() => new LogManager(lmOptionsNoFiles)).toThrow(
      'You must provide a logBaseFileName, an explicit logFileName or a rotateBaseFileName.'
    )
  })

  test('CreateInstance', () => {
    const logManager = LogManager.CreateInstance(lmOptionsGood)
    expect(logManager).toBeInstanceOf(LogManager)
  })
})

describe('log levels', () => {
  const logManagerOptions: LogManagerOptions = {
    componentName: 'TestComponent',
    includeHttpRequestDataInTheLog: true,
    includeHttpResponseDataInTheLog: true,
    logCallback: jest.fn(),
    logBaseFileName: 'test_base.log',
    logFileName: 'test.log',
    logLevel: 'debug',
    maxFiles: 5,
    maxSize: 100,
    rotateBaseFileName: 'test_rotate.log',
    showConsole: true,
    suffixDatePattern: 'YYYY-MM-DD',
  }
  const lm = new LogManager(logManagerOptions)

  test('debug', () => {
    expect(lm).toBeDefined()
    const wlogger = lm.debug('1', '2', '3', '4', '5')

    expect(wlogger).toBeDefined()
  })

  test('error', () => {
    const wlogger = lm.error('1', '2', '3', '4', '5')

    expect(wlogger).toBeDefined()
  })

  test('info', () => {
    const wlogger = lm.info('1', '2', '3', '4', '5')

    expect(wlogger).toBeDefined()
  })

  test('logToFile', () => {
    const wlogger = lm.logToFile('1', '2', '3', '4', '5')

    expect(wlogger).toBeDefined()
  })

  test('silly', () => {
    const wlogger = lm.silly('1', '2', '3', '4', '5')

    expect(wlogger).toBeDefined()
  })

  test('warn', () => {
    const wlogger = lm.warn('1', '2', '3', '4', '5')

    expect(wlogger).toBeDefined()
  })
})

describe('Winston transports', () => {
  test('with log file names', () => {
    const ret = LogManager.WinstonLogTransports(
      'info',
      'TEST.WinstonLogTransports-logFileName.log',
      'TEST.WinstonLogTransports-logBaseFileName.log',
      'TEST.WinstonLogTransports-rotateBaseFileName.log',
      'YYY-MM-DD',
      10,
      1024,
      false,
      lineFormatter
    )

    expect(ret.length).toBe(2)
  })

  test('no daily rotate file', () => {
    const mockDailyRotateFileLogger = (LogManager.DailyRotateFileLogger =
      jest.fn(() => null as unknown as DailyRotateFile))

    const ret = LogManager.WinstonLogTransports(
      'info',
      'TEST.WinstonLogTransports-logFileName.log',
      'TEST.WinstonLogTransports-logBaseFileName.log',
      'TEST.WinstonLogTransports-rotateBaseFileName.log',
      'YYY-MM-DD',
      10,
      1024,
      false,
      lineFormatter
    )

    expect(mockDailyRotateFileLogger).toHaveBeenCalledWith(
      'info',
      'TEST.WinstonLogTransports-rotateBaseFileName.log',
      'YYY-MM-DD',
      10,
      1024,
      lineFormatter
    )
    expect(mockDailyRotateFileLogger).toHaveBeenCalledTimes(1)
    mockDailyRotateFileLogger.mockRestore()

    expect(ret.length).toBe(1)
  })

  test('without log file names', () => {
    const ret = LogManager.WinstonLogTransports(
      'info',
      '',
      '',
      '',
      'YYY-MM-DD',
      10,
      1024,
      false,
      lineFormatter
    )

    expect(ret.length).toBe(0)
  })
})
