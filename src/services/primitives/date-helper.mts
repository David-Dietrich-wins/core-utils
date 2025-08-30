import { prefixIfHasData, safestr } from './string-helper.mjs'
import { Stringish } from '../../models/types.mjs'
import { getBoolean } from './boolean-helper.mjs'
import moment from 'moment'
import { pluralSuffix } from '../general.mjs'
import { typishValue } from './function-helper.mjs'

export const REGEX_Iso8601Full =
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?<temp3>\.\d+)?(?<temp2>(?<temp1>[+-]\d\d:\d\d)|Z)?$/iu

export const DEFAULT_DateTimeFormatSeconds = 'YYYY/MM/DD HH:mm:ss'
export const DEFAULT_DateTimeFormatWithMillis = 'YYYY/MM/DD HH:mm:ss.SSS'
export const DEFAULT_DateTimeFormatLocalWithoutTimezone =
  'YYYY-MM-DDTHH:mm:ss.SSS'
export const DEFAULT_DateTimeFormatForFiles = 'YYMMDD_HHmmss'

export class DateHelper {
  /**
   * Adds (or subtracts if millisToAdd is negative) any number of seconds to a Date.
   * If no Date is provided, the current Date now is used.
   * @param millisToAdd The number of milliseconds to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in. If a number is provided, it is assumed to be in Date epoch milliseconds.
   * @returns A new Date object with the number of seconds added.
   */
  static addMillisToDate(millisToAdd: number, date?: Date | number | string) {
    const d = date ? new Date(date) : new Date()

    return new Date(d.getTime() + millisToAdd)
  }

  /**
   * Adds (or subtracts if secondsToAdd is negative) any number of seconds to a Date.
   * If no Date is provided, the current Date now is used.
   * @param millisToAdd The number of seconds to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in.
   * @returns A new Date object with the number of seconds added.
   */
  static addSecondsToDate(secondsToAdd: number, date?: Date | number | string) {
    return DateHelper.addMillisToDate(secondsToAdd * 1000, date)
  }

  /**
   * Adds (or subtracts if minutesToAdd is negative) any number of minutes to a Date.
   * If no Date is provided, the current Date now is used.
   * @param minutesToAdd The number of minutes to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in.
   * @returns A new Date object with the number of minutes added.
   */
  static addMinutesToDate(minutesToAdd: number, date?: Date | number | string) {
    return DateHelper.addMillisToDate(minutesToAdd * 60 * 1000, date)
  }

  /**
   * Adds (or subtracts if hoursToAdd is negative) any number of hours to a Date.
   * If no Date is provided, the current Date now is used.
   * @param hoursToAdd The number of hours to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in.
   * @returns A new Date object with the number of hours added.
   */
  static addHoursToDate(hoursToAdd: number, date?: Date | number | string) {
    return DateHelper.addMillisToDate(hoursToAdd * 60 * 60 * 1000, date)
  }

  /**
   * Adds (or subtracts if daysToAdd is negative) any number of days to a Date.
   * If no Date is provided, the current Date now is used.
   * @param daysToAdd The number of days to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in.
   * @returns A new Date object with the number of days added.
   */
  static addDaysToDate(daysToAdd: number, date?: Date | number | string) {
    return DateHelper.addMillisToDate(daysToAdd * 24 * 60 * 60 * 1000, date)
  }

  static FormatDateTime(
    format?: string,
    dateToFormat?: Date | number | string
  ) {
    return (dateToFormat ? moment(dateToFormat) : moment())
      .format(safestr(format, DEFAULT_DateTimeFormatSeconds))
      .trim()
  }

  static FormatDateTimeWithMillis(dateToFormat?: Date | number | string) {
    return DateHelper.FormatDateTime(
      DEFAULT_DateTimeFormatWithMillis,
      dateToFormat
    )
  }

  /**
   * Converts a Date object to a string in ISO format.
   * If there is no date provided, undefined is returned.
   * @param date Any format of date that can be converted to a Date object.
   * @returns A string in ISO format if a Date object is provided, otherwise undefined.
   */
  static toIsoString(date?: Date | number | string) {
    if (date) {
      return new Date(date).toISOString()
    }
  }

  /**
   * Takes a SQL date and time string and converts it to a UTC string. No translation is done.
   *  2022-10-30 22:09:00.000 to 2022-10-30T22:09:00.000Z or 2022-10-30T22:09:000Z is stripMilliseconds is true
   * @param sqlDateString The SQL date string in 2022-10-30 22:09:20.875 format
   * @param stripMilliseconds If true, the milliseconds are removed from the string.
   */
  static SqlUtcToUtcString(sqlDateString: string, stripMilliseconds = true) {
    let strToConvert = safestr(sqlDateString)
    if (stripMilliseconds) {
      strToConvert = strToConvert.replace(/\.\d{3}/u, '')
    }

    strToConvert = strToConvert.replace(' ', 'T')

    if (strToConvert.length >= 19 && strToConvert.includes('T')) {
      strToConvert += 'Z'
    }

    return strToConvert
  }

  /**
   * Converts a Date object to a string in ISO format.
   * If there is no date provided, undefined is returned.
   * @param date Any format of date that can be converted to a Date object.
   * @returns A string formatted to example - '2023-09-06T14:52:01.690'
.
   */
  static toLocalStringWithoutTimezone(date?: Date | number | string) {
    return DateHelper.FormatDateTime(
      DEFAULT_DateTimeFormatLocalWithoutTimezone,
      date
    )
  }

  /**
   * Converts a Date object to a string in ISO format.
   * If there is no date provided, undefined is returned.
   * @param date Any format of date that can be converted to a Date object.
   * @returns A string formatted to example - '230906_145201'
   */
  static fileDateTime(date?: Date | number | string) {
    return DateHelper.FormatDateTime(DEFAULT_DateTimeFormatForFiles, date)
  }

  /**
   * Converts a Date object to a string in ISO format.
   * If there is no date provided, an empty string is returned.
   * @param date Any format of date that can be converted to a Date object.
   * @returns A string in ISO format if a Date object is provided, otherwise an empty string.
   */
  static toIsoStringSafe(date?: Date | number | string) {
    return safestr(DateHelper.toIsoString(date))
  }
}

export function isCurrentYear(str: Stringish) {
  const year = new Date().getFullYear().toString()

  return year === typishValue(str)
}

/**
 * Checks the date value passed in to see if the variable is a valid Date object.
 * @param date Any value to test if it is a valid date.
 * @returns true if the date is valid. false otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDateObject(date: any) {
  return getBoolean(
    date &&
      Object.prototype.toString.call(date) === '[object Date]' &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      !isNaN(date)
  )
}

/**
 * Returns the number of milliseconds between two times.
 * @param startTime The time to begin the diff with.
 * @param endTime The ending time for the diff. If none provided, the current time is used.
 * @returns The absolute value of milliseconds difference between the two times.
 */
export function timeDifference(startTime: Date, endTime?: Date) {
  const fname = 'timeDifference: '
  if (!startTime) {
    throw new Error(`${fname}You must have a start time.`)
  }

  return Math.abs((endTime ?? new Date()).getTime() - startTime.getTime())
}
/**
 * Returns the number of seconds between two times.
 * @param startTime The time to begin the diff with.
 * @param endTime The ending time for the diff. If none provided, the current time is used.
 * @returns The absolute value of seconds difference between the two times rounded down (even if milliseconds is > 500)
 */
export function timeDifferenceInSeconds(startTime: Date, endTime?: Date) {
  return Math.floor(timeDifference(startTime, endTime) / 1000)
}
/**
 * Returns the number of seconds or optionally milliseconds, between two times as a string representation.
 * i.e., 5 days 21 hours 59 minutes 35 seconds 889ms, or 5d 21h 59m 35s 889ms. Used mostly for log messages.
 * @param millis The time in milliseconds. Usually from new Date().getTime()
 * @param longFormat True if you want day, hour, minute, and second to be spelled out. False if you want the dhms abbreviations only.
 * @param showMilliseconds True if you want the milliseconds included in the time difference.
 * @returns The absolute value of seconds or milliseconds difference between the two times as a string.
 */
export function timeDifferenceStringFromMillis(
  millis: number,
  longFormat = false,
  showMilliseconds = false,
  showMillisecondsIfUnderASecond = true
) {
  const totalSeconds = Math.floor(millis / 1000)
  const seconds = totalSeconds % 60

  const totalMinutes = Math.floor(millis / 60000)
  const minutes = totalMinutes % 60
  const totalHours = Math.floor(totalSeconds / 3600)
  const hours = totalHours % 24
  const days = Math.floor(totalHours / 24)

  let s = ''
  if (days > 0) {
    s += longFormat ? `${days} day${pluralSuffix(days)}` : `${days}d`
  }

  if (hours > 0) {
    s += longFormat
      ? `${prefixIfHasData(s)}${hours} hour${pluralSuffix(hours)}`
      : `${prefixIfHasData(s, ' ')}${hours}h`
  }

  if (minutes > 0) {
    s += longFormat
      ? `${prefixIfHasData(s)}${minutes} minute${pluralSuffix(minutes)}`
      : `${prefixIfHasData(s, ' ')}${minutes}m`
  }

  const secondsModulo = seconds % 60
  if (secondsModulo > 0) {
    s += longFormat
      ? `${prefixIfHasData(s)}${secondsModulo} second${pluralSuffix(
          secondsModulo
        )}`
      : `${prefixIfHasData(s, ' ')}${secondsModulo}s`
  }

  if (showMilliseconds || (showMillisecondsIfUnderASecond && millis < 1000)) {
    const micros = millis % 1000
    if (micros > 0) {
      s += `${prefixIfHasData(s, longFormat ? ', ' : ' ')}${micros % 1000}ms`
    }
  }

  return safestr(s, longFormat ? '0 seconds' : '0s')
}

/**
 * Returns the number of seconds or optionally milliseconds, between two times as a string representation.
 * i.e., 5 days 21 hours 59 minutes 35 seconds 889ms, or 5d 21h 59m 35s 889ms. Used mostly for log messages.
 * @param startTime The time to begin the diff with. Usually from a new Date()
 * @param endTime The ending time for the diff. If none provided, the current time is used.
 * @param longFormat True if you want day, hour, minute, and second to be spelled out. False if you want the dhms abbreviations only.
 * @param showMilliseconds True if you want the milliseconds included in the time difference.
 * @returns The absolute value of seconds or milliseconds difference between the two times as a string.
 */
export function timeDifferenceString(
  startTime: Date,
  endTime?: Date,
  longFormat = false,
  showMilliseconds = false
) {
  return timeDifferenceStringFromMillis(
    timeDifference(startTime, endTime),
    longFormat,
    showMilliseconds
  )
}
