import moment, { DurationInputArg1, DurationInputArg2 } from 'moment'
import { isNullOrUndefined, safestr } from './general.mjs'

export const DEFAULT_DateTimeFormatSeconds = 'YYYY/MM/DD HH:mm:ss'
export const DEFAULT_DateTimeFormatWithMillis = 'YYYY/MM/DD HH:mm:ss.SSS'
export const DEFAULT_DateTimeFormatLocalWithoutTimezone =
  'YYYY-MM-DDTHH:mm:ss.SSS'
export const DEFAULT_DateTimeFormatForFiles = 'YYMMDD_HHmmss'
export const DEFAULT_DateFormatForApiCalls = 'YYYY-MM-DD'
export const DEFAULT_DateFormatForUi = 'M/D/YYYY'
export const DEFAULT_DateFormatForUi2DigitYear = 'M/D/YY'

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
   * If there is no date provided, undefined is returned.
   * @param date Any format of date that can be converted to a Date object.
   * @returns A string formatted to example - '230906_145201'
   */
  static DateFormatForApiCalls(date?: Date | number | string) {
    return DateHelper.FormatDateTime(DEFAULT_DateFormatForApiCalls, date)
  }
  /**
   * Converts a Date object to a string in ISO format.
   * If there is no date provided, undefined is returned.
   * @param date Any format of date that can be converted to a Date object.
   * @returns A string formatted to example - '230906_145201'
   */
  static DateFormatForUi(date?: Date | number | string, showFullYear = false) {
    return DateHelper.FormatDateTime(
      showFullYear
        ? DEFAULT_DateFormatForUi
        : DEFAULT_DateFormatForUi2DigitYear,
      date
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

  static getFormattedTime(
    units: DurationInputArg1,
    timeframe: DurationInputArg2
  ) {
    const mom = moment()
    if (units && timeframe) {
      mom.add(units, timeframe)
    }

    return mom.format('dddd, MMMM Do YYYY, h:mm:ss a')
  }

  static FormattedUnixTime(unixtime: number) {
    const mom = moment.unix(unixtime)

    return mom.format('dddd, MMMM Do YYYY, h:mm:ss a')
  }

  static TimezoneOffsetInMinutes() {
    return 0 - new Date().getTimezoneOffset()
  }

  static UnixTimeFormat(val: number) {
    if (!isNullOrUndefined(val)) {
      return moment(val).format('MMM D, YYYY LT')
    }

    return ''
  }

  static UnixTimeFormatForTheDow(val: number) {
    return moment(val).format('dddd, MMMM Do YYYY, LTS')
  }
}
