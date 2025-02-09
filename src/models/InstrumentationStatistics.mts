import {
  isObject,
  isArray,
  isString,
  timeDifference,
  timeDifferenceInSeconds,
  timeDifferenceString,
  safestr,
  getNumberString,
  safeArray,
  isNullOrUndefined,
  timeDifferenceStringFromMillis,
  pluralSuffix,
  pluralize,
} from '../services/general.mjs'
import { GrayArrowException } from './GrayArrowException.mjs'
import { StringOrStringArray } from './types.mjs'

export class InstrumentationStatistics {
  successes = 0
  failures = 0
  totalProcessed = 0
  skipped = 0

  update = 0
  upsert = 0
  add = 0
  delete = 0

  msg: string[] = []

  startTime = new Date()
  finishTime?: Date

  constructor(totalProcessed?: number, numSuccesses?: number, numFailures?: number) {
    this.totalProcessed = totalProcessed || 0
    this.successes = numSuccesses || 0
    this.failures = numFailures || 0
  }

  get className() {
    return 'InstrumentationStatistics'
  }

  addStats(stats?: Readonly<InstrumentationStatistics>, concatMsg = true) {
    if (stats && isObject(stats)) {
      this.successes += stats.successes
      this.failures += stats.failures
      this.totalProcessed += stats.totalProcessed

      this.skipped += stats.skipped

      this.add += stats.add
      this.delete += stats.delete
      this.update += stats.update
      this.upsert += stats.upsert

      if (concatMsg) {
        this.msg = this.msg.concat(safeArray(stats.msg))
      }
    }
  }

  addMessage(msg?: StringOrStringArray | object) {
    if (isArray(msg)) {
      this.msg = this.msg.concat(msg as string[])

      return this.msg.length
    } else if (isObject(msg)) {
      this.msg.push(JSON.stringify(msg))

      return this.msg.length
    } else if (isString(msg)) {
      this.msg.push(msg as string)

      return this.msg.length
    }
    // else if (msg) {
    //   const s = String(msg)
    //   this.msg.push(s)
    // }

    // return 0
    throw new GrayArrowException(
      'Message is not a string or set of strings.',
      this.addMessage.name,
      '' + msg
    )
  }

  addFailure(msg?: string) {
    ++this.failures
    this.addProcessed(msg)

    return this.failures
  }

  addSuccess(msg?: string) {
    ++this.successes
    this.addProcessed(msg)

    return this.successes
  }

  addSkip(msg?: string) {
    ++this.skipped
    this.addProcessed(msg)

    return this.skipped
  }
  added(msg?: string) {
    ++this.add

    this.addMessage(msg)
    return this.add
  }
  deleted(msg?: string) {
    ++this.delete

    this.addMessage(msg)
    return this.delete
  }
  updated(msg?: string) {
    ++this.update

    this.addMessage(msg)
    return this.update
  }
  upserted(msg?: string) {
    ++this.upsert

    this.addMessage(msg)
    return this.upsert
  }

  addProcessed(msg?: StringOrStringArray | object) {
    ++this.totalProcessed

    if (!isNullOrUndefined(msg)) {
      this.addMessage(msg)
    }

    return this.totalProcessed
  }

  finished() {
    this.finishTime = new Date()
  }

  get processingTime() {
    return timeDifference(this.startTime, this.finishTime || new Date())
  }
  /** Gets the total processing time in seconds. */
  get processingTimeInSeconds() {
    return timeDifferenceInSeconds(this.startTime, this.finishTime || new Date())
  }
  processingTimeString(longFormat: boolean) {
    return timeDifferenceString(this.startTime, this.finishTime || new Date(), longFormat)
  }

  lineSeparator(isOneLine = false, multilineSeparator?: string) {
    if (isOneLine) {
      return ', '
    }

    return safestr(multilineSeparator || '\n', '\n')
  }

  messageSuccessFail({
    recordsName = 'record',
    prefix = 'Sent',
    suffix = '.',
    recordsSuffixIfSingle = '',
    recordsSuffixIfPlural = 's',
  }: {
    recordsName?: string
    prefix?: string
    suffix?: string
    recordsSuffixIfSingle?: string
    recordsSuffixIfPlural?: string
  }) {
    return `${prefix} ${this.totalProcessed} ${recordsName}${pluralize(this.totalProcessed, recordsSuffixIfSingle, recordsSuffixIfPlural)} (Success: ${this.successes}, Fail: ${this.failures}) in ${timeDifferenceStringFromMillis(
      this.processingTime,
      true
    )}${suffix}`
  }

  messageString(isOneLine?: boolean) {
    let s = `Processed ${getNumberString(
      this.totalProcessed
    )} item${pluralSuffix(this.totalProcessed)} in ${this.processingTimeString(true)}${isOneLine ? '' : '.'}`
    if (this.add) {
      s += `${this.lineSeparator(isOneLine)}Added: ${getNumberString(
        this.add
      )}${isOneLine ? '' : '.'}`
    }
    if (this.update) {
      s += `${this.lineSeparator(isOneLine)}Updated: ${getNumberString(
        this.update
      )}${isOneLine ? '' : '.'}`
    }
    if (this.upsert) {
      s += `${this.lineSeparator(isOneLine)}Upserted: ${getNumberString(
        this.upsert
      )}${isOneLine ? '' : '.'}`
    }
    if (this.delete) {
      s += `${this.lineSeparator(isOneLine)}Deleted: ${getNumberString(
        this.delete
      )}${isOneLine ? '' : '.'}`
    }
    if (this.skipped) {
      s += `${this.lineSeparator(isOneLine)}Skipped: ${getNumberString(
        this.skipped
      )}${isOneLine ? '' : '.'}`
    }
    if (this.successes) {
      s += `${this.lineSeparator(isOneLine)}Successes: ${getNumberString(
        this.successes
      )}${isOneLine ? '' : '.'}`
    }
    if (this.failures) {
      s += `${this.lineSeparator(isOneLine)}Failures: ${getNumberString(
        this.failures
      )}${isOneLine ? '' : '.'}`
    }

    if (isOneLine) {
      s += '.'
    } else if (this.msg.length) {
      s += '\n\nMessages:'

      s += this.msg.reduce((acc: string, cur: string) => (acc += `\n${cur}`), '')
    }

    return s
  }
}
