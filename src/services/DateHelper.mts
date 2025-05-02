import moment, { DurationInputArg1, Moment, unitOfTime } from 'moment'
import { pluralSuffix, prefixIfHasData, safestr } from './string-helper.mjs'
import { isString } from './string-helper.mjs'
import { AppException } from '../models/AppException.mjs'

export class DateHelper {
  static readonly FormatSeconds = 'YYYY/MM/DD HH:mm:ss'
  static readonly FormatWithMillis = 'YYYY/MM/DD HH:mm:ss.SSS'
  static readonly FormatLocalWithoutTimezone = 'YYYY-MM-DDTHH:mm:ss.SSS'
  static readonly FormatForFiles = 'YYMMDD_HHmmss'
  static readonly FormatForApiCalls = 'YYYY-MM-DD'
  static readonly FormatForUi = 'M/D/YYYY'
  static readonly FormatForUiWithYear = 'M/D/YYYY h:mm:ss a'
  static readonly FormatForUi2DigitYear = 'M/D/YY'
  static readonly FormatForUi2DigitYearWithTime = 'M/D/YY h:mm:ss a'

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
    dateToFormat?: Moment | Date | number | string,
    isUtc = false
  ) {
    let m = dateToFormat ? moment(dateToFormat) : moment()
    if (isUtc) {
      m = m.utc()
    }

    return m.format(safestr(format, DateHelper.FormatSeconds)).trim()
  }

  static FormatDateTimeWithMillis(
    dateToFormat?: Moment | Date | number | string,
    isUtc = false
  ) {
    return DateHelper.FormatDateTime(
      DateHelper.FormatWithMillis,
      dateToFormat,
      isUtc
    )
  }

  static Midnight(date: Date | string | null | undefined) {
    if (date) {
      if (isString(date)) {
        const num = Date.parse(date)
        if (!isNaN(num)) {
          const d = new Date(num)

          d.setUTCHours(0, 0, 0, 0)
          return d
        }
      } else {
        const d = Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate()
        )

        return new Date(d)
      }
    }
  }
  static MidnightSafe(date: Date | string | null | undefined) {
    const d = DateHelper.Midnight(date)
    if (!d) {
      throw new AppException(
        'Invalid date passed in',
        'DateHelper.getMidnightSafe'
      )
    }

    return d
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
      strToConvert = strToConvert.replace(/\.\d{3}/, '')
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
  static toLocalStringWithoutTimezone(date?: Moment | Date | number | string) {
    return DateHelper.FormatDateTime(
      DateHelper.FormatLocalWithoutTimezone,
      date
    )
  }

  /**
   * Converts a Date object to a string in ISO format.
   * If there is no date provided, undefined is returned.
   * @param date Any format of date that can be converted to a Date object.
   * @returns A string formatted to example - '230906_145201'
   */
  static fileDateTime(date?: Moment | Date | number | string, isUtc = false) {
    return DateHelper.FormatDateTime(DateHelper.FormatForFiles, date, isUtc)
  }

  /**
   * Converts a Date object to a string in ISO format.
   * If there is no date provided, undefined is returned.
   * @param date Any format of date that can be converted to a Date object.
   * @returns A string formatted to example - '230906_145201'
   */
  static DateFormatForApiCalls(
    date?: Moment | Date | number | string,
    isUtc = false
  ) {
    return DateHelper.FormatDateTime(DateHelper.FormatForApiCalls, date, isUtc)
  }

  /**
   * Converts a Date object to a string in ISO format.
   * If there is no date provided, undefined is returned.
   * @param date Any format of date that can be converted to a Date object.
   * @returns A string formatted to example - '230906_145201'
   */
  static DateFormatForUi(
    date?: Moment | Date | number | string,
    showFullYear = false,
    isUtc = false
  ) {
    return DateHelper.FormatDateTime(
      showFullYear ? DateHelper.FormatForUi : DateHelper.FormatForUi2DigitYear,
      date,
      isUtc
    )
  }

  /**
   * Converts a Date object to a string in ISO format.
   * If there is no date provided, undefined is returned.
   * @param date Any format of date that can be converted to a Date object.
   * @returns A string formatted to example - '230906_145201'
   */
  static DateFormatForUiWithTime(
    date?: Moment | Date | number | string,
    showFullYear = false,
    isUtc = false
  ) {
    return DateHelper.FormatDateTime(
      showFullYear
        ? DateHelper.FormatForUiWithYear
        : DateHelper.FormatForUi2DigitYearWithTime,
      date,
      isUtc
    )
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

  // static getFormattedTime(
  //   units: DurationInputArg1,
  //   timeframe: DurationInputArg2,
  //   isUtc = false
  // ) {
  //   const mom = isUtc ? moment().utc() : moment()
  //   if (units && timeframe) {
  //     mom.add(units, timeframe)
  //   }

  //   return mom.format('dddd, MMMM Do YYYY, h:mm:ss a')
  // }

  static FormattedUnixTime(unixtime: number) {
    const mom = moment.unix(unixtime)

    return mom.format('dddd, MMMM Do YYYY, h:mm:ss a')
  }

  static TimezoneOffsetInMinutes() {
    return 0 - new Date().getTimezoneOffset()
  }

  static UnixTimeFormat(val: number) {
    return moment(val).format('MMM D, YYYY LT')
  }

  static UnixTimeFormatForTheDow(val: number) {
    return moment(val).format('dddd, MMMM Do YYYY, LTS')
  }

  static TimeframeToStartOf(timeframe: string) {
    switch (timeframe) {
      case 'd':
        return 'day'
      case 'h':
        return 'hour'
      case 'm':
        return 'minute'
      case 's':
        return 'second'
      case 'w':
        return 'week'
      case 'M':
        return 'month'
      case 'y':
        return 'year'
    }

    return timeframe
    // throw new AppException(
    //   `Invalid timeframe: ${timeframe}`,
    //   'DateHelper.NextBoundaryUp'
    // )
  }

  static LocalToUtc(date: Date | string | number | null | undefined) {
    date = date ? new Date(date) : new Date()

    const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000)

    return utc
  }

  static NextBoundaryUp(
    date: Readonly<Date | string | number>,
    unit: DurationInputArg1,
    units: number = 1
  ) {
    const mom = moment.utc(date)

    const timeframe = DateHelper.TimeframeToStartOf(unit as string)
    const smom = mom.utc().startOf(timeframe as moment.unitOfTime.StartOf)

    const newmom = smom
      .utc()
      .add(units, timeframe as unitOfTime.DurationConstructor)
    return newmom.utc().toDate()
  }
}

/**
 * Checks the date value passed in to see if the variable is a valid Date object.
 * @param date Any value to test if it is a valid date.
 * @returns true if the date is valid. false otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDateObject(date: any) {
  return date &&
    Object.prototype.toString.call(date) === '[object Date]' &&
    !isNaN(date)
    ? true
    : false
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
    throw new Error(fname + 'You must have a start time.')
  }

  if (!endTime) {
    endTime = new Date()
  }

  return Math.abs(endTime.getTime() - startTime.getTime())
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
