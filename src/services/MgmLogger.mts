/* eslint-disable @typescript-eslint/no-explicit-any */
import winston, { format, Logger, transport, transports } from 'winston'
import DailyRotateFile, {
  DailyRotateFileTransportOptions,
} from 'winston-daily-rotate-file'
import { hasData, safestr, safestrTrim } from './general.mjs'
import { DateHelper } from './DateHelper.mjs'
import { ObjectTypesToString } from './object-helper.mjs'
import { GrayArrowException } from '../models/GrayArrowException.mjs'

const DEFAULT_RotateDatePattern = 'YYYY-MM-DD-HH'
const DEFAULT_RotateMaxFiles = 500
const DEFAULT_RotateMaxSize = 1000000000 // 1GB

export type MgmLoggerLevel = 'all' | 'debug' | 'info' | 'warn' | 'error'

export type MgmLoggerOptions = {
  componentName: string
  includeHttpRequestDataInTheLog: boolean
  includeHttpResponseDataInTheLog: boolean
  logCallback?: (logLevel: MgmLoggerLevel, msg: string) => void
  logBaseFileName: string
  logFileName: string
  logLevel: MgmLoggerLevel
  maxFiles: number
  maxSize: number
  rotateBaseFileName: string
  showConsole: boolean
  suffixDatePattern: string
}

/** Handles all forms of logging from Console logging, File Logging and context.log logging using the callback facility. */
export class MgmLogger {
  logger: Logger

  componentName: string
  includeHttpRequestDataInTheLog?: boolean
  includeHttpResponseDataInTheLog?: boolean
  logCallback?: (logLevel: MgmLoggerLevel, msg: string) => void
  logLevel: MgmLoggerLevel

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
  }: MgmLoggerOptions) {
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
      throw new GrayArrowException(
        'You must provide a logBaseFileName, an explicit logFileName or a rotateBaseFileName.',
        'MgmLogger'
      )
    }

    const logLineFormat = winston.format.printf(({ level, message }) => {
      const msg = (message as any)
        .map((e: unknown) =>
          ObjectTypesToString(
            e,
            includeHttpResponseDataInTheLog,
            includeHttpRequestDataInTheLog
          )
        )
        .join(' ')

      return `${DateHelper.FormatDateTimeWithMillis()}: [${
        this.componentName
      }] [${level}] ${msg}`
    })

    const transports: transport[] = MgmLogger.WinstonLogTransports(
      logLevel,
      logFileName,
      logBaseFileName,
      rotateBaseFileName,
      suffixDatePattern,
      maxFiles,
      maxSize,
      showConsole,
      logLineFormat
    )

    this.logger = winston.createLogger({
      level: logLevel,
      transports,
    })
  }

  static ConsoleLogger(logLineFormat: winston.Logform.Format) {
    // If we're not in production then **ALSO** log to the `console`
    // with the colorized simple format.
    // if (safestrLowercase(process.env.NODE_ENV) !== 'production') {
    const consoleTransport = new transports.Console({
      format: format.combine(format.colorize(), logLineFormat),
    })

    return consoleTransport
    // }
  }

  /**
   * Used to create an MgmLogger instance.
   * Do not use new MgmLogger() directly.
   * @param options Object containing the options for the logger
   * @returns A new MgmLogger instance
   */
  static createInstance(options?: Partial<MgmLoggerOptions>) {
    return new MgmLogger(MgmLogger.MgmLoggerDefaultOptions(options))
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
      // localTime: true,
      maxFiles,
      maxSize,
      zippedArchive: false,
    }

    return new DailyRotateFile(fileOptions)
  }

  static MgmLoggerDefaultOptions(overrides?: Partial<MgmLoggerOptions>) {
    const defaultOptions: MgmLoggerOptions = {
      componentName: 'MgmLogger',
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

    return defaultOptions
  }

  static TransportFileLogger(
    logFileName: string | undefined,
    logBaseFileName: string | undefined,
    suffixDatePattern: string | undefined,
    maxFiles: number | undefined,
    maxsize: number | undefined,
    logLineFormat: winston.Logform.Format
  ) {
    const logfileTransportOptions = new transports.File({
      level: 'info',

      filename: safestr(
        safestrTrim(logFileName),
        `./logs/${safestrTrim(logBaseFileName)}-${DateHelper.FormatDateTime(
          suffixDatePattern
        )}.log`
      ),

      format: logLineFormat,
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
      const logfileTransportOptions = MgmLogger.TransportFileLogger(
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
      const dailyRotateFile = MgmLogger.DailyRotateFileLogger(
        logLevel,
        rotateBaseFileName,
        suffixDatePattern,
        maxFiles,
        maxSize,
        logLineFormat
      )

      if (dailyRotateFile) {
        tports.push(dailyRotateFile)
      }
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
