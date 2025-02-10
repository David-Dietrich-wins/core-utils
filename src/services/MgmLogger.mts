/* eslint-disable @typescript-eslint/no-explicit-any */
import winston, { format, Logger, transport, transports } from 'winston'
import DailyRotateFile, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file'
import { hasData, safestrLowercase } from './general.mjs'
import { DateHelper } from './DateHelper.mjs'
import { ObjectTypesToString } from './object-helper.mjs'

export type MgmLoggerLevel = 'all' | 'debug' | 'info' | 'warn' | 'error'

/** Handles all forms of logging from Console logging, File Logging and context.log logging using the callback facility. */
export class MgmLogger {
  logger: Logger

  constructor(
    public componentName: string,
    public logFileName = '',
    public logLevel: MgmLoggerLevel = 'info',
    public includeHttpResponseDataInTheLog = false,
    public includeHttpRequestDataInTheLog = false,
    public logCallback?: (logLevel: MgmLoggerLevel, msg: string) => void
  ) {
    const logLineFormat = winston.format.printf(({ level, message }) => {
      const msg = (message as any)
        .map((e: unknown) =>
          ObjectTypesToString(e, includeHttpResponseDataInTheLog, includeHttpRequestDataInTheLog)
        )
        .join(' ')

      return `${DateHelper.FormatDateTimeWithMillis()}: [${this.componentName}] [${level}] ${msg}`
    })

    const tports: transport[] = []

    // If we're not in production then **ALSO** log to the `console`
    // with the colorized simple format.
    if (safestrLowercase(process.env.NODE_ENV) !== 'production') {
      tports.push(
        new transports.Console({
          format: format.combine(format.colorize(), logLineFormat),
        })
      )
    }

    if (hasData(logFileName)) {
      const drftOptions: DailyRotateFileTransportOptions = {
        filename: `./logs/${this.logFileName}-%DATE%.log`,
        // filename: `./logs/${this.componentName}-${this.logFileName}-%DATE%.log`,
        // localTime: true,
        datePattern: 'YYYY-MM-DD-HH',
        level: logLevel,
        zippedArchive: false,
        maxSize: '100m',
        maxFiles: '60d',
        format: logLineFormat,
      }

      tports.push(new DailyRotateFile(drftOptions))
    }

    this.logger = winston.createLogger({
      level: logLevel,
      transports: tports,
    })
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

  logToFile(...message: any[]) {
    return this.logger.info(message)
  }

  silly(...message: any[]) {
    return this.logger.info(message)
  }

  warn(...message: any[]) {
    return this.logger.warn(message)
  }
}
