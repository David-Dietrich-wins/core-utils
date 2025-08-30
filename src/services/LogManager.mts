/* eslint-disable @typescript-eslint/no-explicit-any */
import DailyRotateFile, {
  DailyRotateFileTransportOptions,
} from 'winston-daily-rotate-file'
import winston, { Logger, format, transport, transports } from 'winston'
import { AppException } from '../models/AppException.mjs'
import { DateHelper } from './primitives/date-helper.mjs'
import { ObjectTypesToString } from './primitives/object-helper.mjs'
import { hasData } from './general.mjs'
import { safestrTrim } from './primitives/string-helper.mjs'

const DEFAULT_RotateDatePattern = 'YYYY-MM-DD-HH',
  DEFAULT_RotateMaxFiles = 500,
  // 1GB
  DEFAULT_RotateMaxSize = 1000000000

export type LogManagerLevel = 'all' | 'debug' | 'info' | 'warn' | 'error'

export type LogManagerOptions = {
  componentName: string
  includeHttpRequestDataInTheLog: boolean
  includeHttpResponseDataInTheLog: boolean
  logCallback?: (logLevel: LogManagerLevel, msg: string) => void
  logBaseFileName: string
  logFileName: string
  logLevel: LogManagerLevel
  maxFiles: number
  maxSize: number
  rotateBaseFileName: string
  showConsole: boolean
  suffixDatePattern: string
}

/** Handles all forms of logging from Console logging, File Logging and context.log logging using the callback facility. */
export class LogManager {
  logger: Logger

  componentName: string
  includeHttpRequestDataInTheLog?: boolean
  includeHttpResponseDataInTheLog?: boolean
  logCallback?: (logLevel: LogManagerLevel, msg: string) => void
  logLevel: LogManagerLevel

  constructor({
    componentName,
    includeHttpRequestDataInTheLog,
    includeHttpResponseDataInTheLog,
    logCallback,
    logBaseFileName,
    logFileName,
    logLevel,
    maxFiles,
    maxSize,
    rotateBaseFileName,
    showConsole,
    suffixDatePattern,
  }: LogManagerOptions) {
    this.componentName = componentName
    this.includeHttpRequestDataInTheLog = includeHttpRequestDataInTheLog
    this.includeHttpResponseDataInTheLog = includeHttpResponseDataInTheLog
    this.logCallback = logCallback
    this.logLevel = logLevel

    if (
      !hasData(safestrTrim(logBaseFileName)) &&
      !hasData(safestrTrim(logFileName)) &&
      !hasData(safestrTrim(rotateBaseFileName))
    ) {
      throw new AppException(
        'You must provide a logBaseFileName, an explicit logFileName or a rotateBaseFileName.',
        LogManager.name
      )
    }

    const alogLineFormat = winston.format.printf(({ level, message }) => {
        const msg = (message as unknown[])
          .map((e) => ObjectTypesToString(e))
          .join(' ')

        return `${DateHelper.FormatDateTimeWithMillis()}: [${
          this.componentName
        }] [${level}] ${msg}`
      }),
      arrTransports: transport[] = LogManager.WinstonLogTransports(
        logLevel,
        logFileName,
        logBaseFileName,
        rotateBaseFileName,
        suffixDatePattern,
        maxFiles,
        maxSize,
        showConsole,
        alogLineFormat
      )

    this.logger = winston.createLogger({
      level: logLevel,
      transports: arrTransports,
    })
  }

  static ConsoleLogger(logLineFormat: winston.Logform.Format) {
    // If we're not in production then **ALSO** log to the `console`
    // With the colorized simple format.
    // If (safestrLowercase(process.env.NODE_ENV) !== 'production') {
    const consoleTransport = new transports.Console({
      format: format.combine(format.colorize(), logLineFormat),
    })

    return consoleTransport
    // }
  }

  /**
   * Used to create an LogManager instance.
   * Do not use new LogManager() directly.
   * @param options Object containing the options for the logger
   * @returns A new LogManager instance
   */
  static CreateInstance(options?: Partial<LogManagerOptions>) {
    return new LogManager(LogManager.LogManagerDefaultOptions(options))
  }

  static DailyRotateFileLogger(
    logLevel: string | undefined,
    rotateBaseFileName: string | undefined,
    suffixDatePattern: string | undefined,
    maxFiles: number | undefined,
    maxSize: number | undefined,
    logLineFormat: winston.Logform.Format
  ) {
    const fileOptions: DailyRotateFileTransportOptions = {
      datePattern: suffixDatePattern,
      filename: `./logs/${safestrTrim(rotateBaseFileName)}-%DATE%.log`,
      format: logLineFormat,
      level: logLevel,
      // LocalTime: true,
      maxFiles,
      maxSize,
      zippedArchive: false,
    }

    return new DailyRotateFile(fileOptions)
  }

  static LogManagerDefaultOptions(overrides?: Partial<LogManagerOptions>) {
    const logManagerOptions: LogManagerOptions = {
      componentName: 'LogManager',
      includeHttpRequestDataInTheLog: false,
      includeHttpResponseDataInTheLog: false,
      logBaseFileName: '',
      logFileName: '',
      logLevel: 'info',
      maxFiles: DEFAULT_RotateMaxFiles,
      maxSize: DEFAULT_RotateMaxSize,
      rotateBaseFileName: '',
      showConsole: true,
      suffixDatePattern: DEFAULT_RotateDatePattern,
      ...overrides,
    }

    return logManagerOptions
  }

  static TransportFileLogger(
    logFileName: string | undefined,
    logBaseFileName: string | undefined,
    suffixDatePattern: string | undefined,
    maxFiles: number | undefined,
    maxsize: number | undefined,
    logLineFormat: winston.Logform.Format
  ) {
    const cleanLogFileName = `./logs/${
        safestrTrim(logFileName)
          ? safestrTrim(logFileName)
          : `${safestrTrim(logBaseFileName)}-${DateHelper.FormatDateTime(
              suffixDatePattern
            )}.log`
      }`,
      logfileTransportOptions = new transports.File({
        filename: cleanLogFileName,
        format: logLineFormat,
        level: 'info',
        maxFiles,
        maxsize,
        tailable: true,
        zippedArchive: false,
      })

    return logfileTransportOptions
  }

  static WinstonLogTransports(
    logLevel: string | undefined,
    logFileName: string | undefined,
    logBaseFileName: string | undefined,
    rotateBaseFileName: string | undefined,
    suffixDatePattern: string | undefined,
    maxFiles: number | undefined,
    maxSize: number | undefined,
    showConsole: boolean | undefined,
    logLineFormat: winston.Logform.Format
  ) {
    const tports: transport[] = []

    if (
      hasData(safestrTrim(logFileName)) ||
      hasData(safestrTrim(logBaseFileName))
    ) {
      const logfileTransportOptions = LogManager.TransportFileLogger(
        logFileName,
        logBaseFileName,
        suffixDatePattern,
        maxFiles,
        maxSize,
        logLineFormat
      )

      tports.push(logfileTransportOptions)
    }

    if (hasData(safestrTrim(rotateBaseFileName))) {
      const dailyRotateFile = LogManager.DailyRotateFileLogger(
        logLevel,
        rotateBaseFileName,
        suffixDatePattern,
        maxFiles,
        maxSize,
        logLineFormat
      )

      tports.push(dailyRotateFile)
    }

    if (showConsole) {
      tports.push(this.ConsoleLogger(logLineFormat))
    }

    return tports
  }

  debug(...message: any[]) {
    return this.logger.debug(message)
  }

  error(...message: any[]) {
    return this.logger.error(message)
  }

  info(...message: any[]) {
    return this.logger.info(message)
  }

  silly(...message: any[]) {
    return this.logger.silly(message)
  }

  logToFile(...message: any[]) {
    return this.logger.info(message)
  }

  warn(...message: any[]) {
    return this.logger.warn(message)
  }
}
