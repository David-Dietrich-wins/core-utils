import { GrayArrowException } from "./exception-types"
import { GrayArrowObject } from "./GrayArrowObject"
import { isObject, isArray, isString, timeDifference, timeDifferenceInSeconds, timeDifferenceString, safestr, getNumberString, safeArray, hasData } from "./skky"
import { StringOrStringArray } from "./types"

export class InstrumentationStatistics extends GrayArrowObject {
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
    super()

    this.totalProcessed = (totalProcessed || 0)
    this.successes = (numSuccesses || 0)
    this.failures = (numFailures || 0)
  }

  get className() {
    return 'InstrumentationStatistics'
  }

  addStats(stats?: InstrumentationStatistics): void {
    if (isObject(stats)) {
      this.successes += (stats!.successes || 0)
      this.failures += (stats!.failures || 0)
      this.totalProcessed += (stats!.totalProcessed || 0)

      this.skipped += (stats!.skipped || 0)

      this.add += (stats!.add || 0)
      this.delete += (stats!.delete || 0)
      this.update += (stats!.update || 0)
      this.upsert += (stats!.upsert || 0)

      this.msg = this.msg.concat(safeArray(stats!.msg))
    }
  }

  addMessage(msg?: StringOrStringArray | object): number {
    const fname = 'addMessage'

    if (isArray(msg)) {
      this.msg = this.msg.concat(msg as string[])

      return this.msg.length
    }
    else if (isObject(msg)) {
      this.msg.push(JSON.stringify(msg))

      return this.msg.length
    }
    else if (isString(msg)) {
      this.msg.push(msg as string)

      return this.msg.length
    }
    // else if (msg) {
    //   const s = String(msg)
    //   this.msg.push(s)
    // }

    // return 0
    throw new GrayArrowException('Message is not a string or set of strings.', this.classMethodString(fname), '' + msg)
  }

  addFailure(msg?: string): number {
    ++this.failures
    this.addProcessed(msg)

    return this.failures
  }

  addSuccess(msg?: string): number {
    ++this.successes
    this.addProcessed(msg)

    return this.successes
  }

  addSkip(msg?: string): number {
    ++this.skipped
    this.addProcessed(msg)

    return this.skipped
  }
  added(msg?: string): number {
    ++this.add

    this.addMessage(msg)
    return this.add
  }
  deleted(msg?: string): number {
    ++this.delete

    this.addMessage(msg)
    return this.delete
  }
  updated(msg?: string): number {
    ++this.update

    this.addMessage(msg)
    return this.update
  }
  upserted(msg?: string): number {
    ++this.upsert

    this.addMessage(msg)
    return this.upsert
  }

  addProcessed(msg?: string): number {
    ++this.totalProcessed

    if (hasData(msg)) {
      this.addMessage(msg)
    }

    return this.totalProcessed
  }

  finished(): void {
    this.finishTime = new Date()
  }

  get processingTime(): number {
    return timeDifference(this.startTime, this.finishTime || new Date())
  }
  /** Gets the total processing time in seconds. */
  get processingTimeInSeconds(): number {
    return timeDifferenceInSeconds(this.startTime, this.finishTime || new Date())
  }
  processingTimeString(longFormat: boolean): string {
    return timeDifferenceString(this.startTime, this.finishTime || new Date(), longFormat)
  }

  lineSeparator(isOneLine = false, multilineSeparator?: string): string {
    if (isOneLine) {
      return ', '
    }

    return safestr(multilineSeparator || '\n', '\n')
  }

  getNumberString(num: number): string {
    return getNumberString(num, 0)
  }
  messageString(isOneLine?: boolean): string {
    let s = `Processed ${this.getNumberString(this.totalProcessed)} items in ${this.processingTimeString(true)}${isOneLine ? '' : '.'}`
    if (this.add) {
      s += `${this.lineSeparator(isOneLine)}Added: ${this.getNumberString(this.add)}${isOneLine ? '' : '.'}`
    }
    if (this.update) {
      s += `${this.lineSeparator(isOneLine)}Updated: ${this.getNumberString(this.update)}${isOneLine ? '' : '.'}`
    }
    if (this.upsert) {
      s += `${this.lineSeparator(isOneLine)}Upserted: ${this.getNumberString(this.upsert)}${isOneLine ? '' : '.'}`
    }
    if (this.delete) {
      s += `${this.lineSeparator(isOneLine)}Deleted: ${this.getNumberString(this.delete)}${isOneLine ? '' : '.'}`
    }
    if (this.skipped) {
      s += `${this.lineSeparator(isOneLine)}Skipped: ${this.getNumberString(this.skipped)}${isOneLine ? '' : '.'}`
    }
    if (this.successes) {
      s += `${this.lineSeparator(isOneLine)}Successes: ${this.getNumberString(this.successes)}${isOneLine ? '' : '.'}`
    }
    if (this.failures) {
      s += `${this.lineSeparator(isOneLine)}Failures: ${this.getNumberString(this.failures)}${isOneLine ? '' : '.'}`
    }

    if (isOneLine) {
      s += '.'
    } else if (this.msg.length) {
      s += '\n\nMessages:'

      this.msg.forEach(m => {
        s += `\n${m}`
      })
    }

    return s
  }
}
