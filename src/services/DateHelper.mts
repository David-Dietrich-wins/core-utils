import moment from 'moment'
import { safestr } from './general.mjs'

export const DEFAULT_DateTimeFormatSeconds = 'YYYY/MM/DD HH:mm:ss'
export const DEFAULT_DateTimeFormatWithMillis = 'YYYY/MM/DD HH:mm:ss.SSS'
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

  static FormatDateTime(format?: string, dateToFormat?: Date | number | string) {
    return (dateToFormat ? moment(dateToFormat) : moment())
      .format(safestr(format, DEFAULT_DateTimeFormatSeconds))
      .trim()
  }

  static FormatDateTimeWithMillis(dateToFormat?: Date | number | string) {
    return DateHelper.FormatDateTime(DEFAULT_DateTimeFormatWithMillis, dateToFormat)
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
   * Converts a Date object to a string in ISO format.
   * If there is no date provided, an empty string is returned.
   * @param date Any format of date that can be converted to a Date object.
   * @returns A string in ISO format if a Date object is provided, otherwise an empty string.
   */
  static toIsoStringSafe(date?: Date | number | string) {
    return safestr(DateHelper.toIsoString(date))
  }
}
