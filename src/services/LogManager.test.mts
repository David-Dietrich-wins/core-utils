import { jest } from '@jest/globals'
import { LogManagerOptions } from './LogManager.mjs'
jest.unstable_unmockModule('./services/LogManager.mjs')
// import winston from 'winston'
// import { DateHelper } from './DateHelper.mjs'
// import { ObjectTypesToString } from './object-helper.mjs'
const { LogManager } = await import('./LogManager.mjs')

// const lineFormatter = winston.format.printf(({ level, message, timestamp }) => {
//   const msg =
//     String(timestamp) +
//     (message as unknown[])
//       .map((e: unknown) => ObjectTypesToString(e, false, false))
//       .join(' ')

//   return `${DateHelper.FormatDateTimeWithMillis()}: [${level}]: ${msg}`
// })

describe('constructor', () => {
  const lmOptionsGood: LogManagerOptions = {
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

  test('good', () => {
    const logManager = new LogManager(lmOptionsGood)
    expect(logManager).toBeInstanceOf(LogManager)

    // expect(logManager.componentName).toBe('TestComponent')
    // expect(logManager.logLevel).toBe('info')
    // expect(logManager.includeHttpRequestDataInTheLog).toBe(false)
    // expect(logManager.includeHttpResponseDataInTheLog).toBe(false)
  })

  test('bad: no logBaseFileName, logFileName, or rotateBaseFileName', () => {
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
