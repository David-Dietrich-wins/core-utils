import { jest } from '@jest/globals'
import { LogManagerOptions } from './LogManager.mjs'
jest.unstable_unmockModule('./services/LogManager.mjs')
import winston from 'winston'
import { DateHelper } from './DateHelper.mjs'
import { ObjectTypesToString } from './object-helper.mjs'
import type DailyRotateFile from 'winston-daily-rotate-file'
const { LogManager } = await import('./LogManager.mjs')

let logManagerOptions: LogManagerOptions

// Const mockLoggerCreateInstance = (LogManager.CreateInstance = jest.fn(
//   (options: LogManagerOptions) => {
//     Return new LogManager(options)
//   }
// ))

function GetTestLogManagerOptions(
  overrides?: Partial<LogManagerOptions>
): LogManagerOptions {
  const logManagerOptions: LogManagerOptions = {
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
    ...overrides,
  }

  return logManagerOptions
}

beforeEach(() => {
  logManagerOptions = GetTestLogManagerOptions()
})

const lineFormatter = winston.format.printf(({ level, message, timestamp }) => {
  const msg =
    String(timestamp) +
    (message as unknown[]).map((e) => ObjectTypesToString(e)).join(' ')

  return `${DateHelper.FormatDateTimeWithMillis()}: [${level}]: ${msg}`
})

describe('constructor', () => {
  const lmOptionsGood = GetTestLogManagerOptions({
    logBaseFileName: 'constructor1-BaseFileName.log',
    logFileName: 'constructor2-FileName.log',
    rotateBaseFileName: 'constructor3-RotateBaseFileName.log',
  })

  test('good', () => {
    const logManager = new LogManager(lmOptionsGood)
    expect(logManager).toBeInstanceOf(LogManager)

    expect(logManager.componentName).toBe('TestComponent')
    expect(logManager.logLevel).toBe('info')
    expect(logManager.includeHttpRequestDataInTheLog).toBe(true)
    expect(logManager.includeHttpResponseDataInTheLog).toBe(true)
  })

  test('bad: no logBaseFileName, logFileName, or rotateBaseFileName', () => {
    expect(() => new LogManager(logManagerOptions)).toThrow(
      'You must provide a logBaseFileName, an explicit logFileName or a rotateBaseFileName.'
    )
  })

  test('CreateInstance', () => {
    const logManager = LogManager.CreateInstance(lmOptionsGood)
    expect(logManager).toBeInstanceOf(LogManager)
  })
})

describe('log levels', () => {
  const logManagerOptions = GetTestLogManagerOptions({
    logBaseFileName: 'logLevels1-BaseFileName.log',
    logFileName: 'logLevels2-FileName.log',
    rotateBaseFileName: 'logLevels3-RotateBaseFileName.log',
    suffixDatePattern: 'YYYY-MM-DD',
  }),

   lm = new LogManager(logManagerOptions)

  test('debug', () => {
    expect(lm).toBeDefined()
    const wlogger = lm.debug('1', '2', '3', '4', '5')

    expect(wlogger).toBeDefined()
    expect(logManagerOptions.logCallback).toHaveBeenCalledTimes(0)
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

describe('transports', () => {
  test('TransportFileLogger', () => {
    const ret = LogManager.TransportFileLogger(
      '',
      'TransportFileLogger',
      'YYYY-MM-DD',
      10,
      1024,
      lineFormatter
    )

    expect(ret).toBeDefined()
    expect(ret.filename).toMatch(/^TransportFileLogger.2025-12-01.log/)
    expect(ret.level).toBe('info')
    expect(ret.format).toBeDefined()
    expect(ret.maxFiles).toBe(10)
    expect(ret.maxsize).toBe(1024)
    expect(ret.tailable).toBe(true)
    expect(ret.zippedArchive).toBe(false)
  })

  test('with log file names', () => {
    const ret = LogManager.WinstonLogTransports(
      'info',
      'WinstonLogTransports-FileName.log',
      'WinstonLogTransports-BaseFileName.log',
      'WinstonLogTransports-RotateBaseFileName.log',
      'YYYY-MM-DD',
      10,
      1024,
      false,
      lineFormatter
    )

    expect(ret.length).toBe(2)
  })

  test('no daily rotate file', () => {
    const mockDailyRotateFileLogger = (LogManager.DailyRotateFileLogger =
      jest.fn(() => null as unknown as DailyRotateFile)),

     ret = LogManager.WinstonLogTransports(
      'info',
      'TEST4.WinstonLogTransports-logFileName.log',
      'TEST5.WinstonLogTransports-logBaseFileName.log',
      'TEST6.WinstonLogTransports-rotateBaseFileName.log',
      'YYY-MM-DD',
      10,
      1024,
      false,
      lineFormatter
    )

    expect(mockDailyRotateFileLogger).toHaveBeenCalledWith(
      'info',
      'TEST6.WinstonLogTransports-rotateBaseFileName.log',
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
