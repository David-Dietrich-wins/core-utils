import type {
  ArrayOrSingle,
  StringOrStringArray,
  WithoutFunctions,
} from './types.mjs'
import { ToSafeArray, isArray, safeArray } from '../primitives/array-helper.mjs'
import {
  hasData,
  isNullOrUndefined,
  isObject,
} from '../primitives/object-helper.mjs'
import {
  isString,
  pluralSuffix,
  pluralize,
  prefixIfHasData,
  safestr,
} from '../primitives/string-helper.mjs'
import { AppException } from './AppException.mjs'
import { DateHelper } from '../primitives/date-helper.mjs'
import { numberToString } from '../primitives/number-helper.mjs'

export class InstrumentationStatistics {
  skipped = 0

  update = 0
  upsert = 0
  add = 0
  delete = 0

  msg: string[] = []

  startTime = new Date()
  finishTime?: Date

  suffixWhenSingle = ''
  suffixWhenPlural = 's'
  totalProcessed = 0
  successes = 0
  failures = 0

  constructor(
    suffixWhenSingle = '',
    suffixWhenPlural = 's',
    totalProcessed = 0,
    successes = 0,
    failures = 0
  ) {
    this.suffixWhenSingle = suffixWhenSingle
    this.suffixWhenPlural = suffixWhenPlural
    this.totalProcessed = totalProcessed
    this.successes = successes
    this.failures = failures
  }

  addStats(
    statsToAdd?: Readonly<ArrayOrSingle<InstrumentationStatistics>>,
    concatMsg = true
  ) {
    for (const stats of ToSafeArray(statsToAdd)) {
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

  addMessage(msg?: unknown) {
    if (isArray(msg)) {
      this.msg = this.msg.concat(msg as string[])

      return this.msg.length
    } else if (isObject(msg)) {
      this.msg.push(JSON.stringify(msg))

      return this.msg.length
    } else if (isString(msg)) {
      this.msg.push(msg)

      return this.msg.length
    }
    // Else if (msg) {
    //   Const s = String(msg)
    //   This.msg.push(s)
    // }

    // Return 0
    throw new AppException(
      'Message is not a string or set of strings.',
      this.addMessage.name,
      safestr(msg)
    )
  }

  addFailure(msg?: unknown) {
    ++this.failures
    this.addProcessed(msg)

    return this.failures
  }

  addSuccess(msg?: StringOrStringArray | object) {
    ++this.successes
    this.addProcessed(msg)

    return this.successes
  }

  addSkipped(msg?: StringOrStringArray | object) {
    ++this.skipped
    this.addProcessed(msg)

    return this.skipped
  }
  added(msg?: StringOrStringArray | object) {
    ++this.add

    this.addProcessed(msg)
    return this.add
  }

  clear(clearTimes = false) {
    this.add = 0
    this.delete = 0
    this.update = 0
    this.upsert = 0
    this.msg = []
    this.successes = 0
    this.failures = 0
    this.totalProcessed = 0
    this.skipped = 0

    if (clearTimes) {
      this.startTime = new Date()
      this.finishTime = undefined
    }
  }

  deleted(msg?: StringOrStringArray | object) {
    ++this.delete

    this.addProcessed(msg)
    return this.delete
  }
  updated(msg?: StringOrStringArray | object) {
    ++this.update

    this.addProcessed(msg)
    return this.update
  }
  upserted(msg?: StringOrStringArray | object) {
    ++this.upsert

    this.addProcessed(msg)
    return this.upsert
  }

  addProcessed(msg?: unknown) {
    ++this.totalProcessed

    if (!isNullOrUndefined(msg)) {
      this.addMessage(msg)
    }

    return this.totalProcessed
  }

  finished() {
    this.finishTime = new Date()

    return this.finishTime
  }

  get processingTime() {
    return DateHelper.timeDifference(
      this.startTime,
      this.finishTime || new Date()
    )
  }
  /** Gets the total processing time in seconds. */
  get processingTimeInSeconds() {
    return DateHelper.timeDifferenceInSeconds(
      this.startTime,
      this.finishTime ?? new Date()
    )
  }
  processingTimeString(longFormat: boolean) {
    return DateHelper.timeDifferenceString(
      this.startTime,
      this.finishTime ?? new Date(),
      longFormat
    )
  }

  // eslint-disable-next-line class-methods-use-this
  lineSeparator(isOneLine = false, multilineSeparator?: string) {
    if (isOneLine) {
      return ', '
    }

    return safestr(multilineSeparator || '\n', '\n')
  }

  /**
   * Returns a message string with the total processed, successes, and failures.
   * ex. 'Processed 24 records (Success: 20, Fail: 4)'
   * @param showSuccessFailIf0 If true, shows the success and fail counts even if they are 0.
   * @param recordsName An optional name for the records being processed.
   * @returns The message string.
   */
  messageTotalProcessedWithSuccessFail(
    showSuccessFailIf0 = false,
    showSkipped = false,
    recordsName = ''
  ) {
    let msg = `${numberToString(this.totalProcessed)} ${safestr(
      recordsName
    )}${pluralize(
      this.totalProcessed,
      this.suffixWhenSingle,
      this.suffixWhenPlural
    )}`

    if (showSuccessFailIf0 || this.successes || this.failures || showSkipped) {
      let successFailMsg = ''

      if (this.successes || showSuccessFailIf0) {
        successFailMsg += `Success: ${numberToString(this.successes)}`
      }

      if (this.failures || showSuccessFailIf0) {
        successFailMsg += `${prefixIfHasData(
          successFailMsg
        )}Fail: ${numberToString(this.failures)}`
      }

      if (showSkipped && this.skipped) {
        successFailMsg += `${prefixIfHasData(
          successFailMsg
        )}Skipped: ${numberToString(this.skipped)}`
      }

      msg += ` (${successFailMsg})`
    }

    return msg
  }

  /**
   * Returns a message string with the total processed, successes, and failures of all the stats provided.
   * ex. 'Sent 24 records (Success: 20, Fail: 4), 12 Activities (Success: 10, Fail: 2) and 6 Transactions (Success: 1, Fail: 5) in 4h 30m.'
   * @param prefix The prefix to start the message.
   * @param suffix The suffix to end the message.
   * @param individualStats One or more other stats for showing the individual stats that make up the total.
   * @returns The message string.
   */
  messageSuccessFail({
    prefix = 'Sent',
    suffix = '.',
    individualStats,
    showSuccessFailIf0,
    showSkipped,
  }: {
    recordsName?: string
    prefix?: string
    suffix?: string
    showSuccessFailIf0?: boolean
    showSkipped?: boolean
    individualStats?: ArrayOrSingle<InstrumentationStatistics>
  }) {
    let msg = hasData(prefix) ? `${prefix} ` : ''

    const allStats = ToSafeArray(this).concat(...ToSafeArray(individualStats)),
      allStatsCount = allStats.length
    msg += allStats.reduce((prev, cur, index) => {
      if (index > 0 && index < allStatsCount - 1) {
        // eslint-disable-next-line no-param-reassign
        prev += ', '
      } else if (index && index === allStatsCount - 1) {
        // eslint-disable-next-line no-param-reassign
        prev += ' and '
      }

      // eslint-disable-next-line no-param-reassign
      prev += cur.messageTotalProcessedWithSuccessFail(
        showSuccessFailIf0,
        showSkipped
      )

      return prev
    }, '')

    msg += ` in ${DateHelper.timeDifferenceStringFromMillis(
      this.processingTime,
      true
    )}${suffix}`

    return msg
  }

  messageString(isOneLine?: boolean) {
    let s = `Processed ${numberToString(
      this.totalProcessed
    )} item${pluralSuffix(this.totalProcessed)} in ${this.processingTimeString(
      true
    )}${isOneLine ? '' : '.'}`
    if (this.add) {
      s += `${this.lineSeparator(isOneLine)}Added: ${numberToString(this.add)}${
        isOneLine ? '' : '.'
      }`
    }
    if (this.update) {
      s += `${this.lineSeparator(isOneLine)}Updated: ${numberToString(
        this.update
      )}${isOneLine ? '' : '.'}`
    }
    if (this.upsert) {
      s += `${this.lineSeparator(isOneLine)}Upserted: ${numberToString(
        this.upsert
      )}${isOneLine ? '' : '.'}`
    }
    if (this.delete) {
      s += `${this.lineSeparator(isOneLine)}Deleted: ${numberToString(
        this.delete
      )}${isOneLine ? '' : '.'}`
    }
    if (this.skipped) {
      s += `${this.lineSeparator(isOneLine)}Skipped: ${numberToString(
        this.skipped
      )}${isOneLine ? '' : '.'}`
    }
    if (this.successes) {
      s += `${this.lineSeparator(isOneLine)}Successes: ${numberToString(
        this.successes
      )}${isOneLine ? '' : '.'}`
    }
    if (this.failures) {
      s += `${this.lineSeparator(isOneLine)}Failures: ${numberToString(
        this.failures
      )}${isOneLine ? '' : '.'}`
    }

    if (isOneLine) {
      s += '.'
    } else if (this.msg.length) {
      s += '\n\nMessages:'

      // eslint-disable-next-line no-param-reassign
      s += this.msg.reduce((acc, cur) => (acc += `\n${cur}`), '')
    }

    return s
  }

  /**
   * Gets an array of the total processed, records per second, and processing time string.
   * Saves having to call each one individually and the logic associated with calculating the time difference and records per second.
   * @returns  const [recordsProcessed, recordsPerSecond, processingTimeString] = stats.processedTimesArray()
   */
  processedTimesArray() {
    let recordsPerSecond = this.totalProcessed
    recordsPerSecond /= this.processingTimeInSeconds
      ? this.processingTimeInSeconds
      : 1

    return [
      numberToString(this.totalProcessed),
      recordsPerSecond.toFixed(1),
      DateHelper.timeDifferenceStringFromMillis(this.processingTime, true),
    ]
  }

  setSuffix(suffixWhenSingle: string, suffixWhenPlural: string) {
    this.suffixWhenSingle = suffixWhenSingle
    this.suffixWhenPlural = suffixWhenPlural
  }

  toJson() {
    const statswf: WithoutFunctions<InstrumentationStatistics> = {
      add: this.add,
      delete: this.delete,
      failures: this.failures,
      finishTime: this.finishTime,
      msg: this.msg,
      processingTime: this.processingTime,
      processingTimeInSeconds: this.processingTimeInSeconds,
      skipped: this.skipped,
      startTime: this.startTime,
      successes: this.successes,
      suffixWhenPlural: this.suffixWhenPlural,
      suffixWhenSingle: this.suffixWhenSingle,
      totalProcessed: this.totalProcessed,
      update: this.update,
      upsert: this.upsert,
    }

    return statswf
  }
}
