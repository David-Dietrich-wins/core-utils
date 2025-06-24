import winston, { Logger } from 'winston'
import { DateHelper } from './DateHelper.mjs'
import { ObjectTypesToString } from './object-helper.mjs'
import { LogManager, LogManagerOptions } from './LogManager.mjs'
import {
  getGlobalLogger,
  mockLoggerDebug,
  mockLoggerError,
  mockLoggerInfo,
  mockLoggerLog,
  mockLoggerSilly,
  mockLoggerWarn,
} from '../jest.setup.mjs'

const lineFormatter = winston.format.printf(({ level, message, timestamp }) => {
  const msg = (message as any)
    .map((e: unknown) => ObjectTypesToString(e, false, false))
    .join(' ')

  return `${DateHelper.FormatDateTimeWithMillis()}: [${level}]: ${msg}`
})

test('constructor', () => {
  const lmopts: LogManagerOptions = {
    componentName: 'TestComponent',
    includeHttpRequestDataInTheLog: true,
    includeHttpResponseDataInTheLog: true,
    logCallback: (logLevel, msg) => {
      console.log(`Log Callback: ${logLevel} - ${msg}`)
    },
    logBaseFileName: 'test_base.log',
    logFileName: 'test.log',
    logLevel: 'info',
    maxFiles: 5,
    maxSize: 100,
    rotateBaseFileName: 'test_rotate.log',
    showConsole: true,
    suffixDatePattern: 'YYYY-MM-DD',
  }

  const logManager = new LogManager(lmopts)
  expect(logManager).toBeDefined()

  // expect(logManager.componentName).toBe('TestComponent')
  // expect(logManager.logLevel).toBe('info')
  // expect(logManager.includeHttpRequestDataInTheLog).toBe(false)
  // expect(logManager.includeHttpResponseDataInTheLog).toBe(false)
})

describe('log levels', () => {
  beforeEach(() => {
    mockLoggerDebug.mockRestore()
    mockLoggerError.mockRestore()
    mockLoggerInfo.mockRestore()
    mockLoggerLog.mockRestore()
    mockLoggerSilly.mockRestore()
    mockLoggerWarn.mockRestore()
  })

  test('debug', () => {
    getGlobalLogger().debug('1', '2', '3', '4', '5')

    expect(getGlobalLogger().debug).toHaveBeenCalledTimes(1)
    expect(getGlobalLogger().debug).toHaveBeenCalledWith(
      '1',
      '2',
      '3',
      '4',
      '5'
    )
  })

  test('error', () => {
    getGlobalLogger().error('1', '2', '3', '4', '5')

    expect(getGlobalLogger().error).toHaveBeenCalledTimes(1)
    expect(getGlobalLogger().error).toHaveBeenCalledWith(
      '1',
      '2',
      '3',
      '4',
      '5'
    )
  })

  test('info', () => {
    getGlobalLogger().info('1', '2', '3', '4', '5')

    expect(getGlobalLogger().info).toHaveBeenCalledTimes(1)
    expect(getGlobalLogger().info).toHaveBeenCalledWith('1', '2', '3', '4', '5')
  })

  // test('log', () => {
  //   getGlobalLogger().log('1', '2', '3', '4', '5')

  //   expect(getGlobalLogger().log).toHaveBeenCalledTimes(1)
  //   expect(getGlobalLogger().log).toHaveBeenCalledWith('1', '2', '3', '4', '5')
  // })

  test('silly', () => {
    getGlobalLogger().silly('1', '2', '3', '4', '5')

    expect(getGlobalLogger().silly).toHaveBeenCalledTimes(1)
    expect(getGlobalLogger().silly).toHaveBeenCalledWith(
      '1',
      '2',
      '3',
      '4',
      '5'
    )
  })

  test('warn', () => {
    getGlobalLogger().warn('1', '2', '3', '4', '5')

    expect(getGlobalLogger().warn).toHaveBeenCalledTimes(1)
    expect(getGlobalLogger().warn).toHaveBeenCalledWith('1', '2', '3', '4', '5')
  })
})

// test('Winston transports', () => {
//   const ret = LogManager.WinstonLogTransports(
//     'info',
//     'TEST.WinstonLogTransports-logFileName.log',
//     'TEST.WinstonLogTransports-logBaseFileName.log',
//     'TEST.WinstonLogTransports-rotateBaseFileName.log',
//     'YYY-MM-DD',
//     10,
//     1024,
//     false,
//     lineFormatter
//   )

//   expect(ret.length).toBe(2)
// })
