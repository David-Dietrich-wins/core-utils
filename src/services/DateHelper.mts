import { NumberHelper, getAsNumber, isNumber } from './number-helper.mjs'
import {
  StringHelper,
  isString,
  pluralSuffix,
  prefixIfHasData,
  safestr,
} from './string-helper.mjs'
import moment, { DurationInputArg1, Moment, unitOfTime } from 'moment'
import { AppException } from '../models/AppException.mjs'
import type { FromTo } from '../models/types.mjs'
import { isNullOrUndefined } from './general.mjs'

export const MILLIS_PER_DAY = 86400000,
  MILLIS_PER_HOUR = 3600000,
  MILLIS_PER_MINUTE = 60000,
  MILLIS_PER_SECOND = 1000

export type DateTypeAcceptable =
  | Date
  | string
  | Moment
  | number
  | null
  | undefined

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class DateHelper {
  static readonly FormatSeconds = 'YYYY/MM/DD HH:mm:ss'
  static readonly FormatWithMillis = 'YYYY/MM/DD HH:mm:ss.SSS'
  static readonly FormatLocalWithoutTimezone = 'YYYY-MM-DDTHH:mm:ss.SSS'
  static readonly FormatForFiles = 'YYMMDD_HHmmss'
  static readonly FormatForApiCalls = 'YYYY-MM-DD'
  static readonly FormatForUi = 'M/D/YYYY'
  static readonly FormatForUiWithYear = 'M/D/YYYY h:mm:ss a'
  static readonly FormatForUiWithYearNoSeconds = 'M/D/YYYY h:mm a'
  static readonly FormatForUi2DigitYear = 'M/D/YY'
  static readonly FormatForUi2DigitYearWithTime = 'M/D/YY h:mm:ss a'
  static readonly FormatForUi2DigitYearWithTimeNoSeconds = 'M/D/YY h:mm a'

  static isDateObject(obj: unknown): obj is Date {
    if (obj && Object.prototype.toString.call(obj) === '[object Date]') {
      return !isNaN((obj as Date).getTime())
    }

    return false
  }

  /**
   * Checks the date value passed in to see if the variable is a valid Date object.
   * @param date Any value to test if it is a valid date.
   * @returns true if the date is valid. false otherwise.
   */
  static IsValidDate(date: DateTypeAcceptable) {
    try {
      DateHelper.ConvertToDateObject(date, false)

      return true
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`${DateHelper.name}.${DateHelper.IsValidDate.name}:`, e)
    }

    return false
  }

  static ConvertToDateObject(
    date: DateTypeAcceptable,
    setToNowIfEmpty = true
  ): Date {
    if (isNullOrUndefined(date)) {
      if (setToNowIfEmpty) {
        return new Date()
      }
    } else if (DateHelper.isDateObject(date)) {
      return new Date(date.getTime())
    } else if (moment.isMoment(date)) {
      return date.toDate()
    } else if (isNumber(date)) {
      return new Date(date)
    } else {
      // If it's a string, we can try to convert it to a Date object
      const d = new Date(date)
      if (!isNullOrUndefined(d) && !isNaN(d.getTime())) {
        return d
      }
    }

    // if (!isNullOrUndefined(msSinceEpoch) && !isNaN(msSinceEpoch)) {
    //   if (useUtc) {
    //     msSinceEpoch += new Date().getTimezoneOffset() * 60000
    //   }

    //   return new Date(msSinceEpoch)
    // }

    throw new AppException(
      `Invalid date: ${safestr(date)}`,
      `${DateHelper.name}.${DateHelper.ConvertToDateObject.name}`,
      date
    )
  }

  static GetTime(date: DateTypeAcceptable) {
    if (isNumber(date)) {
      return date
    }

    return DateHelper.ConvertToDateObject(date).getTime()
  }

  /**
   * Adds (or subtracts if millisToAdd is negative) any number of seconds to a Date.
   * If no Date is provided, the current Date now is used.
   * @param millisToAdd The number of milliseconds to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in. If a number is provided, it is assumed to be in Date epoch milliseconds.
   * @returns A new Date object with the number of seconds added.
   */
  static addMillisToDate(millisToAdd: number, date?: Date | number | string) {
    return new Date(DateHelper.GetTime(date) + millisToAdd)
  }

  /**
   * Adds (or subtracts if secondsToAdd is negative) any number of seconds to a Date.
   * If no Date is provided, the current Date now is used.
   * @param millisToAdd The number of seconds to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in.
   * @returns A new Date object with the number of seconds added.
   */
  static addMonthsToDate(monthsToAdd: number, date?: Date | number | string) {
    const d = DateHelper.ConvertToDateObject(date)
    d.setMonth(d.getMonth() + monthsToAdd)

    return d
  }

  /**
   * Adds (or subtracts if secondsToAdd is negative) any number of seconds to a Date.
   * If no Date is provided, the current Date now is used.
   * @param millisToAdd The number of seconds to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in.
   * @returns A new Date object with the number of seconds added.
   */
  static addYearsToDate(yearsToAdd: number, date?: Date | number | string) {
    const d = DateHelper.ConvertToDateObject(date)
    d.setFullYear(d.getFullYear() + yearsToAdd)

    return d
  }

  /**
   * Adds (or subtracts if secondsToAdd is negative) any number of seconds to a Date.
   * If no Date is provided, the current Date now is used.
   * @param millisToAdd The number of seconds to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in.
   * @returns A new Date object with the number of seconds added.
   */
  static addSecondsToDate(secondsToAdd: number, date?: Date | number | string) {
    return DateHelper.addMillisToDate(secondsToAdd * MILLIS_PER_SECOND, date)
  }

  /**
   * Adds (or subtracts if minutesToAdd is negative) any number of minutes to a Date.
   * If no Date is provided, the current Date now is used.
   * @param minutesToAdd The number of minutes to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in.
   * @returns A new Date object with the number of minutes added.
   */
  static addMinutesToDate(minutesToAdd: number, date?: Date | number | string) {
    return DateHelper.addMillisToDate(minutesToAdd * MILLIS_PER_MINUTE, date)
  }

  /**
   * Adds (or subtracts if hoursToAdd is negative) any number of hours to a Date.
   * If no Date is provided, the current Date now is used.
   * @param hoursToAdd The number of hours to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in.
   * @returns A new Date object with the number of hours added.
   */
  static addHoursToDate(hoursToAdd: number, date?: Date | number | string) {
    return DateHelper.addMillisToDate(hoursToAdd * MILLIS_PER_HOUR, date)
  }

  /**
   * Adds (or subtracts if daysToAdd is negative) any number of days to a Date.
   * If no Date is provided, the current Date now is used.
   * @param daysToAdd The number of days to add to the optional Date passed in.
   * @param date Optional Date. Will use new Date() if none passed in.
   * @returns A new Date object with the number of days added.
   */
  static addDaysToDate(daysToAdd: number, date?: Date | number | string) {
    return DateHelper.addMillisToDate(daysToAdd * MILLIS_PER_DAY, date)
  }

  static FormatDateTime(
    format?: string,
    dateToFormat?: DateTypeAcceptable,
    isUtc = false
  ) {
    let m = dateToFormat ? moment(dateToFormat) : moment()
    if (isUtc) {
      m = m.utc()
    }

    return m.format(safestr(format, DateHelper.FormatSeconds)).trim()
  }

  static FormatDateTimeWithMillis(
    dateToFormat?: DateTypeAcceptable,
    isUtc = false
  ) {
    return DateHelper.FormatDateTime(
      DateHelper.FormatWithMillis,
      dateToFormat,
      isUtc
    )
  }

  static FormatLocaleDateString(date?: DateTypeAcceptable, locale = 'en-US') {
    const intlOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      },
      now = DateHelper.ConvertToDateObject(date).toLocaleDateString(
        locale,
        intlOptions
      )

    return now
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
  static fileDateTime(date?: DateTypeAcceptable, isUtc = false) {
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
    showSeconds = false,
    isUtc = false
  ) {
    return DateHelper.FormatDateTime(
      showFullYear
        ? showSeconds
          ? DateHelper.FormatForUiWithYear
          : DateHelper.FormatForUiWithYearNoSeconds
        : showSeconds
        ? DateHelper.FormatForUi2DigitYearWithTime
        : DateHelper.FormatForUi2DigitYearWithTimeNoSeconds,
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

  // Static getFormattedTime(
  //   Units: DurationInputArg1,
  //   Timeframe: DurationInputArg2,
  //   IsUtc = false
  // ) {
  //   Const mom = isUtc ? moment().utc() : moment()
  //   If (units && timeframe) {
  //     Mom.add(units, timeframe)
  //   }

  //   Return mom.format('dddd, MMMM Do YYYY, h:mm:ss a')
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

  static PeriodType(period: string) {
    let speriodString = StringHelper.RemoveLeadingNumbersAndWhitespace(period)
    if (speriodString.length > 0) {
      if (speriodString.toLowerCase().startsWith('month')) {
        speriodString = 'M'
      } else {
        speriodString = speriodString[0].toLowerCase()
      }
    }

    switch (speriodString) {
      case 'd':
        return 'day'
      case 'h':
        return 'hour'
      case 'm':
        return 'minute'
      case 's':
        return 'second'
      case 'M':
        return 'month'
      case 'y':
      case '':
        return 'year'
      case 'q':
        return 'quarter'
      case 'w':
        return 'week'
      default:
        break
    }

    return period
    // Throw new AppException(
    //   `Invalid timeframe: ${timeframe}`,
    //   'DateHelper.NextBoundaryUp'
    // )
  }

  /**
   * Adds a specified amount of time to a date.
   * @param date The date to modify.
   * @param periodType The type of time period to add (e.g., 'day', 'hour'). You can also pass a number with the period type, like '1d' for 1 day.
   * If numberOfPeriods is not provided, it will use the first number in the periodType string.
   * @param numberOfPeriods The number of periods to add. If not provided, it will use the first number found in the periodType string.
   * If periodType is '1d', then numberOfPeriods will be 1.
   * If periodType is '2h', then numberOfPeriods will be 2.
   * @returns The new date with the added time.
   */
  static AddTimeToDate(
    date: Readonly<DateTypeAcceptable>,
    periodType: string,
    numberOfPeriods?: number | string | null
  ) {
    const dateClean = DateHelper.ConvertToDateObject(date),
      numPeriods = isNullOrUndefined(numberOfPeriods)
        ? NumberHelper.FirstNumberInString(periodType)
        : getAsNumber(numberOfPeriods),
      period = DateHelper.PeriodType(periodType)

    switch (period) {
      case 'day':
        return DateHelper.addDaysToDate(numPeriods, dateClean)
      case 'hour':
        return DateHelper.addHoursToDate(numPeriods, dateClean)
      case 'minute':
        return DateHelper.addMinutesToDate(numPeriods, dateClean)
      case 'second':
        return DateHelper.addSecondsToDate(numPeriods, dateClean)
      case 'month':
        return DateHelper.addMonthsToDate(numPeriods, dateClean)
      case 'year':
        return DateHelper.addYearsToDate(numPeriods, dateClean)
      case 'quarter':
        return DateHelper.addMonthsToDate(numPeriods * 3, dateClean)
      case 'week':
        return DateHelper.addDaysToDate(numPeriods * 7, dateClean)
      default:
        throw new AppException(
          `Invalid period type: ${periodType}`,
          'DateHelper.AddTimeToDate'
        )
    }
  }

  static FromTo(from: DateTypeAcceptable, to: DateTypeAcceptable) {
    const fromDate = DateHelper.ConvertToDateObject(from),
      fromTime = fromDate.getTime(),
      toDate = DateHelper.ConvertToDateObject(to),
      toTime = toDate.getTime(),
      zret: Required<FromTo> = {
        from: fromTime > toTime ? toTime : fromTime,
        to: toTime < fromTime ? fromTime : toTime,
      }

    return zret
  }

  static FromToPeriodsFromEndDate(
    endDate: DateTypeAcceptable,
    periodType: string,
    numberOfPeriods: number
  ) {
    const date = DateHelper.ConvertToDateObject(endDate),
      from = DateHelper.AddTimeToDate(
        date,
        DateHelper.PeriodType(periodType),
        -1
      ),
      to = DateHelper.AddTimeToDate(
        date,
        DateHelper.PeriodType(periodType),
        numberOfPeriods
      )

    return DateHelper.FromTo(from, to)
  }
  static FromToPeriodsFromEndDateAsDates(
    startDate: DateTypeAcceptable,
    periodType: string,
    numberOfPeriods: number
  ) {
    const ft = DateHelper.FromToPeriodsFromEndDate(
        startDate,
        periodType,
        numberOfPeriods
      ),
      ret: Required<FromTo<Date>> = {
        from: DateHelper.ConvertToDateObject(ft.from),
        to: DateHelper.ConvertToDateObject(ft.to),
      }

    return ret
  }

  static FromToPeriodsFromStartDate(
    startDate: DateTypeAcceptable,
    periodType: string,
    numberOfPeriods: number
  ) {
    const date = DateHelper.ConvertToDateObject(startDate),
      from = DateHelper.AddTimeToDate(
        date,
        DateHelper.PeriodType(periodType),
        -1
      ),
      to = DateHelper.AddTimeToDate(
        date,
        DateHelper.PeriodType(periodType),
        numberOfPeriods
      )

    return DateHelper.FromTo(from, to)
  }
  static FromToPeriodsFromStartDateAsDates(
    startDate: DateTypeAcceptable,
    periodType: string,
    numberOfPeriods: number
  ) {
    const ft = DateHelper.FromToPeriodsFromStartDate(
        startDate,
        periodType,
        numberOfPeriods
      ),
      ret: Required<FromTo<Date>> = {
        from: DateHelper.ConvertToDateObject(ft.from),
        to: DateHelper.ConvertToDateObject(ft.to),
      }

    return ret
  }

  static LocalToUtc(date: DateTypeAcceptable) {
    const dateNonEmpty = DateHelper.ConvertToDateObject(date),
      utc = new Date(
        dateNonEmpty.getTime() + dateNonEmpty.getTimezoneOffset() * 60000
      )

    return utc
  }

  static NextBoundaryUp(
    date: Readonly<Date | string | number>,
    unit: DurationInputArg1,
    units: number = 1
  ) {
    const mom = moment.utc(date),
      momTimeframe = DateHelper.PeriodType(unit as string),
      momUtcStart = mom
        .utc()
        .startOf(momTimeframe as moment.unitOfTime.StartOf),
      newmom = momUtcStart
        .utc()
        .add(units, momTimeframe as unitOfTime.DurationConstructor)

    return newmom.utc().toDate()
  }

  /**
   * Returns the number of milliseconds between two times.
   * @param startTime The time to begin the diff with.
   * @param endTime The ending time for the diff. If none provided, the current time is used.
   * @returns The absolute value of milliseconds difference between the two times.
   */

  static timeDifference(
    startTime: DateTypeAcceptable,
    endTime?: DateTypeAcceptable
  ) {
    if (!startTime) {
      throw new AppException(
        `${DateHelper.name}.${DateHelper.timeDifference.name}: You must have a start time.`
      )
    }

    const endTimeNotEmpty = DateHelper.ConvertToDateObject(endTime)

    return Math.abs(
      endTimeNotEmpty.getTime() -
        DateHelper.ConvertToDateObject(startTime).getTime()
    )
  }
  /**
   * Returns the number of seconds between two times.
   * @param startTime The time to begin the diff with.
   * @param endTime The ending time for the diff. If none provided, the current time is used.
   * @returns The absolute value of seconds difference between the two times rounded down (even if milliseconds is > 500)
   */
  static timeDifferenceInSeconds(
    startTime: DateTypeAcceptable,
    endTime?: DateTypeAcceptable
  ) {
    return Math.floor(DateHelper.timeDifference(startTime, endTime) / 1000)
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
  static timeDifferenceString(
    startTime: DateTypeAcceptable,
    endTime?: DateTypeAcceptable,
    longFormat = false,
    showMilliseconds = false
  ) {
    return DateHelper.timeDifferenceStringFromMillis(
      DateHelper.timeDifference(startTime, endTime),
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
  static timeDifferenceStringFromMillis(
    millis: number,
    longFormat = false,
    showMilliseconds = false,
    showMillisecondsIfUnderASecond = true
  ) {
    const aMinutes = Math.floor(millis / MILLIS_PER_MINUTE),
      aSeconds = Math.floor(millis / MILLIS_PER_SECOND),
      asHours = Math.floor(millis / MILLIS_PER_HOUR),
      numDays = Math.floor(millis / MILLIS_PER_DAY),
      numHours = asHours % 24,
      numMinutes = aMinutes % 60,
      numSeconds = aSeconds % 60,
      secondsModulo = numSeconds % 60

    let s = ''
    if (numDays > 0) {
      s += longFormat
        ? `${NumberHelper.NumberToString(numDays)} day${pluralSuffix(numDays)}`
        : `${NumberHelper.NumberToString(numDays)}d`
    }

    if (numHours > 0) {
      s += longFormat
        ? `${prefixIfHasData(s)}${NumberHelper.NumberToString(
            numHours
          )} hour${pluralSuffix(numHours)}`
        : `${prefixIfHasData(s, ' ')}${NumberHelper.NumberToString(numHours)}h`
    }

    if (numMinutes > 0) {
      s += longFormat
        ? `${prefixIfHasData(s)}${NumberHelper.NumberToString(
            numMinutes
          )} minute${pluralSuffix(numMinutes)}`
        : `${prefixIfHasData(s, ' ')}${NumberHelper.NumberToString(
            numMinutes
          )}m`
    }

    if (secondsModulo > 0) {
      s += longFormat
        ? `${prefixIfHasData(s)}${NumberHelper.NumberToString(
            secondsModulo
          )} second${pluralSuffix(secondsModulo)}`
        : `${prefixIfHasData(s, ' ')}${NumberHelper.NumberToString(
            secondsModulo
          )}s`
    }

    if (showMilliseconds || (showMillisecondsIfUnderASecond && millis < 1000)) {
      const micros = millis % 1000
      if (micros > 0) {
        s += `${prefixIfHasData(
          s,
          longFormat ? ', ' : ' '
        )}${NumberHelper.NumberToString(micros % 1000)}ms`
      }
    }

    return safestr(s, longFormat ? '0 seconds' : '0s')
  }
}

export function DateNowIsPastExpiry(expiryDate: DateTypeAcceptable) {
  if (!expiryDate) {
    return true
  }

  const expiry = DateHelper.ConvertToDateObject(expiryDate)

  return Date.now() > expiry.getTime()
}
