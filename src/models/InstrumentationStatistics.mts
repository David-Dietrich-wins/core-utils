import { hasData, isNullOrUndefined } from '../services/general.mjs'
import {
  timeDifference,
  timeDifferenceInSeconds,
  timeDifferenceString,
  timeDifferenceStringFromMillis,
} from '../services/DateHelper.mjs'
import {
  pluralize,
  pluralSuffix,
  prefixIfHasData,
  safestr,
} from '../services/string-helper.mjs'
import { isString } from '../services/string-helper.mjs'
import { isObject } from '../services/object-helper.mjs'
import { isArray } from '../services/array-helper.mjs'
import { NumberHelper } from '../services/number-helper.mjs'
import {
  ArrayOrSingle,
  StringOrStringArray,
  WithoutFunctions,
} from './types.mjs'
import { safeArray, ToSafeArray } from '../services/array-helper.mjs'
import { AppException } from './AppException.mjs'

export class InstrumentationStatistics {
  skipped = 0

  update = 0
  upsert = 0
  add = 0
  delete = 0

  msg: string[] = []

  startTime = new Date()
  finishTime?: Date

  constructor(
    public suffixWhenSingle = '',
    public suffixWhenPlural = 's',
    public totalProcessed = 0,
    public successes = 0,
    public failures = 0
  ) {}

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
    throw new AppException(
      'Message is not a string or set of strings.',
      this.addMessage.name,
      '' + msg
    )
  }

  addFailure(msg?: StringOrStringArray | object) {
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

  addProcessed(msg?: StringOrStringArray | object) {
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
    return timeDifference(this.startTime, this.finishTime || new Date())
  }
  /** Gets the total processing time in seconds. */
  get processingTimeInSeconds() {
    return timeDifferenceInSeconds(
      this.startTime,
      this.finishTime ?? new Date()
    )
  }
  processingTimeString(longFormat: boolean) {
    return timeDifferenceString(
      this.startTime,
      this.finishTime ?? new Date(),
      longFormat
    )
  }

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
    let msg = `${NumberHelper.NumberToString(this.totalProcessed)} ${safestr(
      recordsName
    )}${pluralize(
      this.totalProcessed,
      this.suffixWhenSingle,
      this.suffixWhenPlural
    )}`

    if (showSuccessFailIf0 || this.successes || this.failures || showSkipped) {
      let successFailMsg = ''

      if (this.successes || showSuccessFailIf0) {
        successFailMsg += `Success: ${NumberHelper.NumberToString(
          this.successes
        )}`
      }

      if (this.failures || showSuccessFailIf0) {
        successFailMsg += `${prefixIfHasData(
          successFailMsg
        )}Fail: ${NumberHelper.NumberToString(this.failures)}`
      }

      if (showSkipped && this.skipped) {
        successFailMsg += `${prefixIfHasData(
          successFailMsg
        )}Skipped: ${NumberHelper.NumberToString(this.skipped)}`
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
    let msg = hasData(prefix) ? prefix + ' ' : ''

    const allStats = ToSafeArray(this).concat(...ToSafeArray(individualStats))
    const allStatsCount = allStats.length
    msg += allStats.reduce((prev, cur, index) => {
      if (index > 0 && index < allStatsCount - 1) {
        prev += ', '
      } else if (index && index === allStatsCount - 1) {
        prev += ' and '
      }

      prev += cur.messageTotalProcessedWithSuccessFail(
        showSuccessFailIf0,
        showSkipped
      )

      return prev
    }, '')

    msg += ` in ${timeDifferenceStringFromMillis(
      this.processingTime,
      true
    )}${suffix}`

    return msg
  }

  messageString(isOneLine?: boolean) {
    let s = `Processed ${NumberHelper.NumberToString(
      this.totalProcessed
    )} item${pluralSuffix(this.totalProcessed)} in ${this.processingTimeString(
      true
    )}${isOneLine ? '' : '.'}`
    if (this.add) {
      s += `${this.lineSeparator(
        isOneLine
      )}Added: ${NumberHelper.NumberToString(this.add)}${isOneLine ? '' : '.'}`
    }
    if (this.update) {
      s += `${this.lineSeparator(
        isOneLine
      )}Updated: ${NumberHelper.NumberToString(this.update)}${
        isOneLine ? '' : '.'
      }`
    }
    if (this.upsert) {
      s += `${this.lineSeparator(
        isOneLine
      )}Upserted: ${NumberHelper.NumberToString(this.upsert)}${
        isOneLine ? '' : '.'
      }`
    }
    if (this.delete) {
      s += `${this.lineSeparator(
        isOneLine
      )}Deleted: ${NumberHelper.NumberToString(this.delete)}${
        isOneLine ? '' : '.'
      }`
    }
    if (this.skipped) {
      s += `${this.lineSeparator(
        isOneLine
      )}Skipped: ${NumberHelper.NumberToString(this.skipped)}${
        isOneLine ? '' : '.'
      }`
    }
    if (this.successes) {
      s += `${this.lineSeparator(
        isOneLine
      )}Successes: ${NumberHelper.NumberToString(this.successes)}${
        isOneLine ? '' : '.'
      }`
    }
    if (this.failures) {
      s += `${this.lineSeparator(
        isOneLine
      )}Failures: ${NumberHelper.NumberToString(this.failures)}${
        isOneLine ? '' : '.'
      }`
    }

    if (isOneLine) {
      s += '.'
    } else if (this.msg.length) {
      s += '\n\nMessages:'

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
      NumberHelper.NumberToString(this.totalProcessed),
      recordsPerSecond.toFixed(1),
      timeDifferenceStringFromMillis(this.processingTime, true),
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
      update: this.update,
      upsert: this.upsert,
      msg: this.msg,
      skipped: this.skipped,
      startTime: this.startTime,
      finishTime: this.finishTime,
      processingTime: this.processingTime,
      processingTimeInSeconds: this.processingTimeInSeconds,
      suffixWhenSingle: this.suffixWhenSingle,
      suffixWhenPlural: this.suffixWhenPlural,
      totalProcessed: this.totalProcessed,
      successes: this.successes,
      failures: this.failures,
    }

    return statswf
  }
}
