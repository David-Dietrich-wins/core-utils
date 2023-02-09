/* eslint-disable @typescript-eslint/no-explicit-any */
// require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l')
// import colors from 'colors'
import winston, { format, Logform, Logger, transport } from 'winston'
import DailyRotateFile, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file'
import moment from 'moment'
import { safestrLowercase, isObject, safeJsonToString } from './skky.js'

class FileLogger {
  logLevel = 2
  componentName = ''
  logFileName = ''
  outputFormat: Logform.Format
  myFormat: Logform.Format

  fileTransport: DailyRotateFile | null
  consoleTransport: transport | null
  fileLogger: Logger | null
  consoleLogger: Logger | null

  tsFormat = () => moment().format('YYYY-MM-DD HH:mm:ss.SSS').trim()

  constructor(logLevel: string | number, componentName: string, logFileName: string) {
    this.logLevel = 2 //info default
    this.componentName = componentName
    this.logFileName = logFileName
    this.setLevel(logLevel)
    this.outputFormat = this.myFormat = winston.format.printf(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ level, message, label, timestamp }) => {
        return `[${this.tsFormat()}] [${this.componentName}] ${message}`
      }
    )

    //require("console-stamp")(console, "yyyy-mm-dd HH:MM:ss.l - x");

    const drftOptions: DailyRotateFileTransportOptions = {
      filename: `./logs/${this.logFileName}-%DATE%.log`,
      // filename: `./logs/${this.componentName}-${this.logFileName}-%DATE%.log`,
      // localTime: true,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '100m',
      maxFiles: '60d',
      format: this.myFormat,
    }

    this.fileTransport = new DailyRotateFile(drftOptions)
    // this.transport.filename = `./logs/${this.componentName}-${this.logFileName}-%DATE%.log`

    this.consoleTransport = new winston.transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })

    this.fileLogger = winston.createLogger({
      transports: [this.fileTransport],
    })

    this.consoleLogger = winston.createLogger({
      transports: [this.consoleTransport],
    })
  }

  close() {
    this.fileLogger = null
    this.consoleLogger = null
    this.consoleTransport = null
    this.fileTransport = null
  }

  static logLevels = {
    error: 4,
    warn: 3,
    info: 2,
    debug: 1,
  }

  formattedTime() {
    return moment().format('YYYY-MM-DD hh:mm:ss.SSS').trim()
  }

  setLevel(logLevel: string | number) {
    if (logLevel) {
      if ('string' === typeof logLevel) {
        const levelLower = safestrLowercase(logLevel)

        if ('debug' === levelLower) {
          this.logLevel = 1
        } else if ('warn' === levelLower) {
          this.logLevel = 3
        } else if ('error' === levelLower) {
          this.logLevel = 4
        } else {
          // default to 'info'
          this.logLevel = 2
        }
      } else {
        this.logLevel = logLevel
      }
    }
  }

  logToFile(message: any) {
    this.fileLogger?.info(message)
  }

  error(message: any) {
    let cleanMsg
    const objType = Object.prototype.toString.call(message)
    if (objType === '[object Error]') {
      cleanMsg = this.getCleanStackTrace(message.stack)
    } else {
      cleanMsg = '[ERROR] ' + this.getCleanMsg(message)
    }

    if (this.logLevel <= 4) {
      // this.consoleloger?.error(cleanMsg.red)
      this.consoleLogger?.error(cleanMsg)
      this.fileLogger?.error(cleanMsg) //(cleanMsg);
    }
  }

  warn(message: any) {
    let cleanMsg
    const objType = Object.prototype.toString.call(message)
    if (objType === '[object Error]') {
      cleanMsg = this.getCleanStackTrace(message.stack)
    } else {
      cleanMsg = '[WARNING] ' + this.getCleanMsg(message)
    }

    if (this.logLevel <= 3) {
      this.consoleLogger?.warn(cleanMsg)
      // this.consoleloger?.warn(cleanMsg.yellow)
      this.fileLogger?.warn(cleanMsg)
    }
  }

  info(message: any) {
    const cleanMsg = this.getCleanMsg(message)
    if (this.logLevel <= 2) {
      this.consoleLogger?.info(cleanMsg.green)
      this.fileLogger?.info(cleanMsg) //(cleanMsg);(cleanMsg);
    }
  }

  debug(message: any) {
    const cleanMsg = this.getCleanMsg(message)
    if (this.logLevel <= 1) {
      this.consoleLogger?.info(cleanMsg.blue)
      this.fileLogger?.info(cleanMsg)
    }
  }

  // appEvent(message, type) {
  //   try {
  //     const appEvent = new AppEvent({
  //       name: message,
  //       etype: type,
  //     })

  //     appEvent.save()
  //   }

  //   catch (err) {
  //     this.error(err)
  //   }
  // }

  getCleanMsg(message: any) {
    if (isObject(message) || Array.isArray(message)) {
      return safeJsonToString(message, this.getCleanMsg.name, undefined, 4) + '\n'
    }

    return message
  }

  getCleanStackTrace(stack: object) {
    if (stack) {
      return stack
        .toString()
        .replace(/\r?\n|\r/g, '')
        .replace(/\s\s+/g, ' ')
    }

    return ''
  }
}

export default FileLogger
