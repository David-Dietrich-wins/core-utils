import {
  DateHelper,
  FormatSeconds,
  dateConvertToObject,
  dateGetTime,
  dateIsValid,
  dateNowIsPastExpiry,
  dateTimeFormat,
  dateTimeFormatForUiWithTime,
  dateTimeFormatLocaleDateString,
  dateTimeFormatWithMillis,
  isDateObject,
} from './date-helper.mjs'
import { TEST_Settings, getCurrentDate } from '../jest.setup.mjs'
import { describe, expect, it } from '@jest/globals'
import { AppException } from '../models/AppException.mjs'
import moment from 'moment'
import { safestr } from './string-helper.mjs'

const AAPL_IPO = '1980-12-12',
  AAPL_IPO_AND_TIMEZONE = `${AAPL_IPO}T00:00:00.000Z`,
  AAPL_IPO_DATE = new Date(AAPL_IPO),
  AAPL_IPO_DATE_MILLISECONDS = AAPL_IPO_DATE.getTime(),
  AAPL_IPO_MOMENT = moment(AAPL_IPO_AND_TIMEZONE)

describe('dateGetTime', () => {
  it('should return the correct timestamp', () => {
    expect.assertions(2)

    expect(dateGetTime(TEST_Settings.currentDateInMilliseconds)).toStrictEqual(
      TEST_Settings.currentDateInMilliseconds
    )

    expect(dateGetTime(TEST_Settings.currentDateString)).toStrictEqual(
      TEST_Settings.currentDateInMilliseconds
    )
  })

  it('should return 0 for null/undefined when setToNowIfEmpty is false', () => {
    expect.assertions(2)

    expect(dateGetTime(null, false)).toBe(0)
    expect(dateGetTime(undefined, false)).toBe(0)
  })

  it('should return current time for null/undefined when setToNowIfEmpty is true', () => {
    expect.assertions(2)

    expect(dateGetTime(null, true)).toBe(
      TEST_Settings.currentDateInMilliseconds
    )
    expect(dateGetTime(undefined, true)).toBe(
      TEST_Settings.currentDateInMilliseconds
    )
  })

  it('should throw an error for invalid date strings', () => {
    expect.assertions(2)

    expect(() => dateGetTime('invalid-date-string')).toThrow(AppException)
    expect(() => dateGetTime('2025-13-01T00:00:00.000Z')).toThrow(AppException)
  })
})

describe('dateConvertToObject', () => {
  it('should convert various date formats to Date objects', () => {
    expect.assertions(14)

    let date = dateConvertToObject(TEST_Settings.currentDateString)

    expect(date.getTime()).toStrictEqual(
      TEST_Settings.currentDateInMilliseconds
    )

    // Test for epoch 0
    expect(dateConvertToObject(0)).toStrictEqual(
      new Date('1970-01-01T00:00:00.000Z')
    )
    expect(dateConvertToObject('1970-01-01T00:00:00.000Z')).toStrictEqual(
      new Date('1970-01-01T00:00:00.000Z')
    )

    date = dateConvertToObject('2025-12-01T00:00:00.000Z')

    expect(date.getTime()).toStrictEqual(
      new Date('2025-12-01T00:00:00.000Z').getTime()
    )

    // AAPL IPO date
    date = dateConvertToObject(AAPL_IPO_DATE_MILLISECONDS)

    expect(date.getTime()).toStrictEqual(
      new Date('1980-12-12T00:00:00.000Z').getTime()
    )

    date = dateConvertToObject(AAPL_IPO)

    expect(date.getTime()).toStrictEqual(
      new Date(AAPL_IPO_AND_TIMEZONE).getTime()
    )

    expect(dateConvertToObject(AAPL_IPO_MOMENT)).toStrictEqual(
      new Date(AAPL_IPO_AND_TIMEZONE)
    )
    expect(dateConvertToObject(1740481297461)).toStrictEqual(
      new Date('2025-02-25T11:01:37.461Z')
    )

    expect(dateConvertToObject(undefined)).toStrictEqual(
      TEST_Settings.currentDate
    )
    expect(dateConvertToObject(0)).toStrictEqual(
      new Date('1970-01-01T00:00:00.000Z')
    )
    expect(dateConvertToObject(null)).toStrictEqual(TEST_Settings.currentDate)
    expect(() => dateConvertToObject('2025-13-01T00:00:00.000Z')).toThrow(
      AppException
    )
    expect(() => dateConvertToObject(null, false)).toThrow(AppException)
    expect(() => dateConvertToObject(undefined, false)).toThrow(AppException)
  })
})

describe('adders', () => {
  it('empty', () => {
    expect.assertions(3)

    const retDate = DateHelper.addMillisToDate(5000),
      retTimeMillis = Number(retDate),
      startDate = new Date(),
      startTimeMillis = startDate.getTime(),
      startTimeMillisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(startTimeMillisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })

  it('good Date', () => {
    expect.assertions(3)

    const astartDate = new Date(),
      retDate = DateHelper.addMillisToDate(5000, astartDate),
      retTimeMillis = retDate.getTime(),
      startTimeMillis = astartDate.getTime(),
      startTimeMillisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(startTimeMillisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })

  it('good number', () => {
    expect.assertions(3)

    const astartDate = new Date(),
      retDate = DateHelper.addMillisToDate(5000, astartDate),
      retTimeMillis = retDate.getTime(),
      startTimeMillis = astartDate.getTime(),
      startTimeMillisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(startTimeMillisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })

  it('good string', () => {
    expect.assertions(3)

    const astartDate = new Date(),
      retDate = DateHelper.addMillisToDate(5000, astartDate.toISOString()),
      retTimeMillis = retDate.getTime(),
      startTimeMillis = astartDate.getTime(),
      startTimeMillisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(startTimeMillisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })

  it('addMillisToDate', () => {
    expect.assertions(1)

    const anumToAdd = 2456,
      newDate = DateHelper.addMillisToDate(anumToAdd, TEST_Settings.currentDate)

    expect(
      newDate.getTime() - TEST_Settings.currentDateInMilliseconds
    ).toStrictEqual(anumToAdd)
  })

  it('addSecondsToDate', () => {
    expect.assertions(1)

    const anumToAdd = 2456,
      newDate = DateHelper.addSecondsToDate(
        anumToAdd,
        TEST_Settings.currentDate
      )

    expect(
      newDate.getTime() - TEST_Settings.currentDateInMilliseconds
    ).toStrictEqual(anumToAdd * 1000)
  })

  it('addMinutesToDate', () => {
    expect.assertions(1)

    const anumToAdd = 2456,
      newDate = DateHelper.addMinutesToDate(
        anumToAdd,
        TEST_Settings.currentDate
      )

    expect(
      newDate.getTime() - TEST_Settings.currentDateInMilliseconds
    ).toStrictEqual(anumToAdd * 1000 * 60)
  })

  it('addMonthsToDate', () => {
    expect.assertions(1)

    const anumToAdd = 24,
      newDate = DateHelper.addMonthsToDate(
        anumToAdd,
        new Date(TEST_Settings.currentDateInMilliseconds)
      )

    expect(newDate).toStrictEqual(
      new Date(TEST_Settings.currentDateString.replace(/2025/u, '2027'))
    )
  })

  it('addYearsToDate', () => {
    expect.assertions(1)

    const anumToAdd = 2,
      newDate = DateHelper.addYearsToDate(
        anumToAdd,
        new Date(TEST_Settings.currentDateInMilliseconds)
      )

    expect(newDate).toStrictEqual(
      new Date(TEST_Settings.currentDateString.replace(/2025/u, '2027'))
    )
  })

  it('addHoursToDate', () => {
    expect.assertions(1)

    const anumToAdd = 2456,
      newDate = DateHelper.addHoursToDate(anumToAdd, TEST_Settings.currentDate)

    expect(
      newDate.getTime() - TEST_Settings.currentDateInMilliseconds
    ).toStrictEqual(anumToAdd * 1000 * 60 * 60)
  })

  it('addDaysToDate', () => {
    expect.assertions(1)

    const anumToAdd = 26,
      newDate = DateHelper.addDaysToDate(anumToAdd, TEST_Settings.currentDate)

    expect(
      newDate.getTime() - TEST_Settings.currentDateInMilliseconds
    ).toStrictEqual(anumToAdd * 1000 * 60 * 60 * 24)
  })
})

describe('toIsoString', () => {
  it('empty undefined', () => {
    expect.assertions(1)

    const ret = DateHelper.toIsoString()

    expect(ret).toBeUndefined()
  })

  it('good Date', () => {
    expect.assertions(1)

    const ret = DateHelper.toIsoString(new Date())

    expect(ret).toContain('T')
  })

  it('good number', () => {
    expect.assertions(1)

    const ret = DateHelper.toIsoString(Date.now())

    expect(ret).toContain('T')
  })

  it('good string', () => {
    expect.assertions(1)

    const ret = DateHelper.toIsoString(new Date().toISOString())

    expect(ret).toContain('T')
  })

  it('sql date', () => {
    expect.assertions(1)

    const astrSqlDate = '2022-10-30 22:09:00.000',
      ret = DateHelper.toIsoString(astrSqlDate)

    expect(ret).toBe('2022-10-31T02:09:00.000Z')
  })

  it('safe empty', () => {
    expect.assertions(1)

    const ret = DateHelper.toIsoStringSafe()

    expect(ret).toBe('')
  })

  it('safe good Date', () => {
    expect.assertions(1)

    const ret = DateHelper.toIsoStringSafe(new Date())

    expect(ret).toContain('T')
  })

  it('safe good number', () => {
    expect.assertions(1)

    const ret = DateHelper.toIsoStringSafe(Date.now())

    expect(ret).toContain('T')
  })

  it('safe good string', () => {
    expect.assertions(1)

    const ret = DateHelper.toIsoStringSafe(new Date().toISOString())

    expect(ret).toContain('T')
  })
})

describe('sqlUtcToUtcString', () => {
  it('empty', () => {
    expect.assertions(1)

    const ret = DateHelper.sqlUtcToUtcString('')

    expect(ret).toBe('')
  })

  it('null', () => {
    expect.assertions(1)

    const ret = DateHelper.sqlUtcToUtcString(null as unknown as string)

    expect(ret).toBe('')
  })

  it('undefined', () => {
    expect.assertions(1)

    const ret = DateHelper.sqlUtcToUtcString(undefined as unknown as string)

    expect(ret).toBe('')
  })

  it('milliseconds', () => {
    expect.assertions(1)

    const astrSqlDate = '2022-11-31 22:09:00.000',
      ret = DateHelper.sqlUtcToUtcString(astrSqlDate, false)

    expect(ret).toBe('2022-11-31T22:09:00.000Z')
  })

  it('no milliseconds', () => {
    expect.assertions(1)

    const astrSqlDate = '2022-11-31 22:09:00.000',
      ret = DateHelper.sqlUtcToUtcString(astrSqlDate)

    expect(ret).toBe('2022-11-31T22:09:00Z')
  })
})

describe('formatDateTime', () => {
  it('empty', () => {
    expect.assertions(2)

    // Const startDate = new Date()

    const retDate = dateTimeFormat(FormatSeconds)

    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })

  it('good Date', () => {
    expect.assertions(2)

    const astartDate = new Date(),
      retDate = dateTimeFormat(FormatSeconds, astartDate)

    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })

  it('good number', () => {
    expect.assertions(2)

    const astartDate = new Date(),
      retDate = dateTimeFormat(FormatSeconds, astartDate.getTime())

    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })

  it('good string', () => {
    expect.assertions(2)

    const astartDate = new Date(),
      retDate = dateTimeFormat(FormatSeconds, astartDate.toISOString())

    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })
})

describe('file date times', () => {
  it.each([undefined, null, new Date(), Date.now()])('fileDateTime %s', () => {
    expect.assertions(1)

    const retDate = DateHelper.fileDateTime()

    expect(retDate).toMatch(/\d{6}_\d{6}/iu)
  })

  it.each([
    undefined,
    '',
    new Date(),
    Date.now(),
    '2024-01-01',
    '2024-10-31 12:31',
    '2024-10-31 12:31:45',
    '2024-10-31 12:31:45.999',
    '2024-10-31 23:31:45.000',
  ])(`${dateTimeFormatWithMillis.name} %s`, (dateToTest) => {
    expect.assertions(1)

    const ret = dateTimeFormatWithMillis(dateToTest)

    expect(ret).toMatch(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/u)
  })
})

describe('toLocalStringWithoutTimezone', () => {
  it('toLocalStringWithoutTimezone', () => {
    expect.assertions(1)

    const ret = DateHelper.toLocalStringWithoutTimezone()

    expect(ret).toMatch(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}/u)
  })
})

describe('dateFormatForUi', () => {
  it('default', () => {
    expect.assertions(1)

    const ret = DateHelper.dateFormatForUi()

    expect(ret).toMatch(/\d{1,2}\/\d{1,2}\/\d{2}/u)
  })

  it('show full year', () => {
    expect.assertions(1)

    const ret = DateHelper.dateFormatForUi(undefined, true)

    expect(ret).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/u)
  })

  it('utc', () => {
    expect.assertions(1)

    const ret = DateHelper.dateFormatForUi(Date.now(), true, true)

    expect(ret).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/u)
  })
})

describe('timeDifference', () => {
  it('startTime', () => {
    expect.assertions(1)

    const astartDate = new Date(Date.now() - 2000),
      millis = DateHelper.timeDifference(astartDate)

    expect(millis).toBeGreaterThanOrEqual(2000)
  })

  it('startTime null', () => {
    expect.assertions(1)

    expect(() => DateHelper.timeDifference(null as unknown as Date)).toThrow(
      'DateHelper.timeDifference: You must have a start time.'
    )
  })
})

describe('timeDifferenceString', () => {
  it('2s', () => {
    expect.assertions(2)

    const astartDate = new Date(),
      endDate = new Date(Number(astartDate) + 2000),
      str = DateHelper.timeDifferenceString(astartDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2s')
  })

  it('4h', () => {
    expect.assertions(2)

    const astartDate = new Date(),
      endDate = new Date(astartDate.getTime() + 4 * 60 * 60 * 1000),
      str = DateHelper.timeDifferenceString(astartDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('4h')
  })

  it('21d', () => {
    expect.assertions(2)

    const astartDate = getCurrentDate(),
      endDate = DateHelper.addDaysToDate(21, new Date(astartDate)),
      str = DateHelper.timeDifferenceString(astartDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toMatch(/21d(?<temp1> 1h)?/u)
  })

  it('long format', () => {
    expect.assertions(2)

    const astartDate = new Date(),
      endDate = new Date(Number(astartDate) + 2000),
      str = DateHelper.timeDifferenceString(astartDate, endDate, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2 seconds')
  })

  it('long format with millis', () => {
    expect.assertions(2)

    const astartDate = new Date(),
      endDate = new Date(Number(astartDate) + 2123),
      str = DateHelper.timeDifferenceString(astartDate, endDate, true, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2 seconds, 123ms')
  })
})

describe('timeDifferenceStringFromMillis', () => {
  it('2s', () => {
    expect.assertions(2)

    const str = DateHelper.timeDifferenceStringFromMillis(2000)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2s')
  })

  it('2s long format', () => {
    expect.assertions(2)

    const str = DateHelper.timeDifferenceStringFromMillis(2000, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2 seconds')
  })

  it('189ms', () => {
    expect.assertions(2)

    const str = DateHelper.timeDifferenceStringFromMillis(189)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('189ms')
  })

  it('189ms long format', () => {
    expect.assertions(2)

    const str = DateHelper.timeDifferenceStringFromMillis(189, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('189ms')
  })

  it('58m', () => {
    expect.assertions(2)

    const str = DateHelper.timeDifferenceStringFromMillis(1000 * 60 * 58)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('58m')
  })

  it('58m long format', () => {
    expect.assertions(2)

    const str = DateHelper.timeDifferenceStringFromMillis(1000 * 60 * 58, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('58 minutes')
  })

  it('4h', () => {
    expect.assertions(2)

    const str = DateHelper.timeDifferenceStringFromMillis(1000 * 60 * 60 * 4)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('4h')
  })

  it('4h long format', () => {
    expect.assertions(2)

    const str = DateHelper.timeDifferenceStringFromMillis(
      1000 * 60 * 60 * 4,
      true
    )

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('4 hours')
  })

  it('21d', () => {
    expect.assertions(2)

    const str = DateHelper.timeDifferenceStringFromMillis(
      1000 * 60 * 60 * 24 * 21
    )

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('21d')
  })

  it('21d long format', () => {
    expect.assertions(2)

    const str = DateHelper.timeDifferenceStringFromMillis(
      1000 * 60 * 60 * 24 * 21,
      true
    )

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('21 days')
  })
})

describe('isDateObject', () => {
  it('should return true for date objects', () => {
    expect.assertions(11)

    expect(isDateObject(new Date())).toBe(true)
    expect(isDateObject(1)).toBe(false)
    expect(isDateObject(0)).toBe(false)
    expect(isDateObject('')).toBe(false)
    expect(isDateObject(new Date('2022'))).toBe(true)
    expect(isDateObject('2022-10-24')).toBe(false)
    expect(isDateObject(new Date('2022-10-24'))).toBe(true)
    expect(isDateObject(new Date('20'))).toBe(false)
    expect(isDateObject(new Date(20))).toBe(true)
    expect(isDateObject(moment('2022-10-24T00:00:00.000Z'))).toBe(false)
    expect(isDateObject(moment('2022-10-24T00:00:00.000Z').toDate())).toBe(true)
  })

  it('dateIsValid', () => {
    expect.assertions(16)

    expect(dateIsValid(new Date())).toBe(true)
    expect(dateIsValid(1)).toBe(true)
    expect(dateIsValid(0)).toBe(true)
    expect(dateIsValid('')).toBe(false)
    expect(dateIsValid(new Date('2022'))).toBe(true)
    expect(dateIsValid('1970-01-01')).toBe(true)
    expect(dateIsValid('1960-01-01')).toBe(true)
    expect(dateIsValid('2022-10-24')).toBe(true)
    expect(dateIsValid('2022-10-24')).toBe(true)
    expect(dateIsValid(new Date('20'))).toBe(false)
    expect(dateIsValid(new Date(20))).toBe(true)
    expect(dateIsValid(moment('2022-10-24T00:00:00.000Z'))).toBe(true)
    expect(dateIsValid(moment('2022-10-24T00:00:00.000Z').toDate())).toBe(true)
    expect(dateIsValid('-24z')).toBe(false)
    expect(dateIsValid(null)).toBe(false)
    expect(dateIsValid(undefined)).toBe(false)
  })
})

describe('periodType', () => {
  it.each(['day', '2d', '  DAYS of our lives'])('%s', (timeframe) => {
    expect.assertions(1)

    expect(DateHelper.PeriodType(timeframe)).toBe('day')
  })

  it.each(['hour', '2h', '  HOURS of our lives'])('%s', (timeframe) => {
    expect.assertions(1)

    expect(DateHelper.PeriodType(timeframe)).toBe('hour')
  })

  it.each(['minute', '2m', '  MINUTES of our lives'])('%s', (timeframe) => {
    expect.assertions(1)

    expect(DateHelper.PeriodType(timeframe)).toBe('minute')
  })

  it.each(['second', '2s', '  SECONDS of our lives'])('%s', (timeframe) => {
    expect.assertions(1)

    expect(DateHelper.PeriodType(timeframe)).toBe('second')
  })

  it.each(['week', '2w', '  WEEKS of our lives'])('%s', (timeframe) => {
    expect.assertions(1)

    expect(DateHelper.PeriodType(timeframe)).toBe('week')
  })

  it.each(['month', '2MONTH', '  MONTHS of our lives'])('%s', (timeframe) => {
    expect.assertions(1)

    expect(DateHelper.PeriodType(timeframe)).toBe('month')
  })

  it.each(['year', '2y', '  YEARS of our lives'])('%s', (timeframe) => {
    expect.assertions(1)

    expect(DateHelper.PeriodType(timeframe)).toBe('year')
  })

  it.each(['quarter', '2q', '  QUARTERS of our lives'])('%s', (timeframe) => {
    expect.assertions(1)

    expect(DateHelper.PeriodType(timeframe)).toBe('quarter')
  })

  it.each(['', '  ', ' 3  y'])('%s', (timeframe) => {
    expect.assertions(1)

    expect(DateHelper.PeriodType(timeframe)).toBe('year')
  })

  it('invalid timeframe', () => {
    expect.assertions(2)

    expect(DateHelper.PeriodType('v')).toBe('v')
    expect(DateHelper.PeriodType('invalid')).toBe('invalid')
  })
})

describe('other formatters', () => {
  it('localToUtc', () => {
    expect.assertions(3)

    const localDate = new Date('2024-01-01T00:00:00.000Z'),
      utcDate = DateHelper.LocalToUtc(localDate)

    expect(utcDate).toBeInstanceOf(Date)
    expect(utcDate.toISOString()).toBe('2024-01-01T05:00:00.000Z')

    expect(DateHelper.LocalToUtc(undefined)).toStrictEqual(
      new Date('2025-12-01T17:00:00.000Z')
    )
  })

  // i t('getFormattedTime', () => {
  //   Const localDate = new Date('2024-01-01T00:00:00.000Z')
  //   Const utcDate = DateHelper.getFormattedTime(+localDate)

  //   Expect(utcDate).toBeInstanceOf(Date)
  //   Expect(utcDate.toISOString()).toBe('2024-01-01T05:00:00.000Z')

  //   Expect(DateHelper.LocalToUtc(undefined)).toStrictEqual(
  //     New Date('2025-12-01T17:00:00.000Z')
  //   )
  // })

  it('formattedUnixTime', () => {
    expect.assertions(1)

    const localDate = new Date('2024-01-01T00:00:00.000Z'),
      utcDate = DateHelper.FormattedUnixTime(localDate.getTime())

    expect(utcDate).toBe('Saturday, September 27th 55969, 8:00:00 pm')
  })

  it('timezoneOffsetInMinutes', () => {
    expect.assertions(1)

    const utcDate = DateHelper.TimezoneOffsetInMinutes()

    expect(utcDate).toBe(-300)
  })

  it('unixTimeFormat', () => {
    expect.assertions(1)

    const utcDate = DateHelper.UnixTimeFormat(new Date().getTime())

    expect(utcDate).toBe('Dec 1, 2025 7:00 AM')
  })

  it('unixTimeFormatForTheDow', () => {
    expect.assertions(1)

    const utcDate = DateHelper.UnixTimeFormatForTheDow(new Date().getTime())

    expect(utcDate).toBe('Monday, December 1st 2025, 7:00:00 AM')
  })

  it('dateTimeFormatForUiWithTime', () => {
    expect.assertions(4)

    expect(dateTimeFormatForUiWithTime(new Date().getTime())).toBe(
      '12/1/25 7:00 am'
    )
    expect(dateTimeFormatForUiWithTime(new Date().getTime(), true)).toBe(
      '12/1/2025 7:00 am'
    )
    expect(dateTimeFormatForUiWithTime(new Date().getTime(), false, true)).toBe(
      '12/1/25 7:00:00 am'
    )
    expect(dateTimeFormatForUiWithTime(new Date().getTime(), true, true)).toBe(
      '12/1/2025 7:00:00 am'
    )
  })

  it('dateFormatForApiCalls', () => {
    expect.assertions(1)

    const utcDate = DateHelper.dateFormatForApiCalls(new Date().getTime())

    expect(utcDate).toBe('2025-12-01')
  })

  it('midnight', () => {
    expect.assertions(2)

    const utcDate = DateHelper.Midnight(new Date())

    expect(utcDate).toStrictEqual(new Date('2025-12-01T00:00:00.000Z'))
    expect(DateHelper.Midnight('2025-12-01T00:00:00.000Z')).toStrictEqual(
      new Date('2025-12-01T00:00:00.000Z')
    )
  })

  it('midnight bad date', () => {
    expect.assertions(1)

    const utcDate = DateHelper.Midnight('invalid date')

    expect(utcDate).toBeUndefined()
  })

  it('midnightSafe', () => {
    expect.assertions(2)

    const utcDate = DateHelper.midnightSafe(new Date())

    expect(utcDate).toStrictEqual(new Date('2025-12-01T00:00:00.000Z'))

    expect(() => DateHelper.midnightSafe(undefined)).toThrow(
      new AppException('Invalid date passed in')
    )
  })
})

describe('nextBoundaryUp', () => {
  it('good', () => {
    expect.assertions(12)

    expect(DateHelper.NextBoundaryUp(new Date(), 'year')).toStrictEqual(
      new Date('2026-01-01T00:00:00.000Z')
    )
    expect(DateHelper.NextBoundaryUp(new Date(), 'year', 3)).toStrictEqual(
      new Date('2028-01-01T00:00:00.000Z')
    )
    expect(DateHelper.NextBoundaryUp(new Date(), 'month')).toStrictEqual(
      new Date('2026-01-01T00:00:00.000Z')
    )
    expect(DateHelper.NextBoundaryUp(new Date(), 'month', 3)).toStrictEqual(
      new Date('2026-03-01T00:00:00.000Z')
    )
    expect(DateHelper.NextBoundaryUp(new Date(), 'day')).toStrictEqual(
      new Date('2025-12-02T00:00:00.000Z')
    )
    expect(DateHelper.NextBoundaryUp(new Date(), 'day', 3)).toStrictEqual(
      new Date('2025-12-04T00:00:00.000Z')
    )
    expect(DateHelper.NextBoundaryUp(new Date(), 'hour')).toStrictEqual(
      new Date('2025-12-01T13:00:00.000Z')
    )
    expect(DateHelper.NextBoundaryUp(new Date(), 'hour', 3)).toStrictEqual(
      new Date('2025-12-01T15:00:00.000Z')
    )
    expect(DateHelper.NextBoundaryUp(new Date(), 'minute')).toStrictEqual(
      new Date('2025-12-01T12:01:00.000Z')
    )
    expect(DateHelper.NextBoundaryUp(new Date(), 'minute', 3)).toStrictEqual(
      new Date('2025-12-01T12:03:00.000Z')
    )
    expect(DateHelper.NextBoundaryUp(new Date(), 'second')).toStrictEqual(
      new Date('2025-12-01T12:00:01.000Z')
    )
    expect(DateHelper.NextBoundaryUp(new Date(), 'second', 3)).toStrictEqual(
      new Date('2025-12-01T12:00:03.000Z')
    )
  })
})

describe('misc', () => {
  it('dateTimeFormatLocaleDateString', () => {
    expect.assertions(12)

    expect(dateTimeFormatLocaleDateString()).toBe('December 1, 2025')
    expect(dateTimeFormatLocaleDateString(null)).toBe('December 1, 2025')
    expect(dateTimeFormatLocaleDateString(undefined)).toBe('December 1, 2025')
    expect(dateTimeFormatLocaleDateString(TEST_Settings.currentDate)).toBe(
      'December 1, 2025'
    )
    expect(
      dateTimeFormatLocaleDateString(TEST_Settings.currentDateString)
    ).toBe('December 1, 2025')
    expect(
      dateTimeFormatLocaleDateString(new Date(TEST_Settings.currentDateString))
    ).toBe('December 1, 2025')
    expect(
      dateTimeFormatLocaleDateString(TEST_Settings.currentDateInMilliseconds)
    ).toBe('December 1, 2025')

    expect(
      dateTimeFormatLocaleDateString(TEST_Settings.currentDate, 'es-ES')
    ).toBe('1 de diciembre de 2025')

    expect(dateTimeFormatLocaleDateString('1980-12-12')).toBe(
      'December 11, 1980'
    )

    expect(dateTimeFormatLocaleDateString(new Date('1980-12-12'))).toBe(
      'December 11, 1980'
    )

    expect(dateTimeFormatLocaleDateString(1740481297461)).toBe(
      'February 25, 2025'
    )

    // AAPL IPO date
    expect(dateTimeFormatLocaleDateString(345427200000)).toBe(
      'December 11, 1980'
    )
  })

  it('fromTo', () => {
    expect.assertions(2)

    const dateEnd = new Date('2025-12-01T00:00:00.000Z'),
      dateStart = new Date('2025-12-02T00:00:00.000Z'),
      periods = DateHelper.FromTo(dateStart, dateEnd)

    // Should be reversed
    expect(periods.from).toBe(dateEnd.getTime())
    expect(periods.to).toBe(dateStart.getTime())
  })

  it('fromToPeriodsFromStartDate', () => {
    expect.assertions(2)

    const beginDate = '2025-12-01T00:00:00.000Z',
      periods = DateHelper.FromToPeriodsFromStartDate(beginDate, 'day', 1)

    expect(periods.from).toBe(
      // 1764460800000
      new Date('2025-11-30T00:00:00.000Z').getTime()
    )
    expect(periods.to).toBe(new Date('2025-12-02T00:00:00.000Z').getTime())
  })

  it('fromToPeriodsFromStartDateAsDates', () => {
    expect.assertions(2)

    const beginDate = '2025-12-01T00:00:00.000Z',
      periods = DateHelper.FromToPeriodsFromStartDateAsDates(
        beginDate,
        'day',
        1
      )

    expect(periods.from).toStrictEqual(new Date('2025-11-30T00:00:00.000Z'))
    expect(periods.to).toStrictEqual(new Date('2025-12-02T00:00:00.000Z'))
  })

  it('fromToPeriodsFromEndDate', () => {
    expect.assertions(2)

    const endDate = '2025-12-01T00:00:00.000Z',
      periods = DateHelper.FromToPeriodsFromEndDate(endDate, 'day', 1)

    expect(periods.from).toBe(
      // 1764460800000
      new Date('2025-11-30T00:00:00.000Z').getTime()
    )
    expect(periods.to).toBe(new Date('2025-12-02T00:00:00.000Z').getTime())
  })

  it('fromToPeriodsFromEndDateAsDates', () => {
    expect.assertions(2)

    const endDate = '2025-12-01T00:00:00.000Z',
      periods = DateHelper.FromToPeriodsFromEndDateAsDates(endDate, 'day', 1)

    expect(periods.from).toStrictEqual(new Date('2025-11-30T00:00:00.000Z'))
    expect(periods.to).toStrictEqual(new Date('2025-12-02T00:00:00.000Z'))
  })

  it('addTimeToDate', () => {
    expect.assertions(15)

    const addDate = new Date('2025-12-01T00:00:00.000Z')

    expect(() => DateHelper.AddTimeToDate(addDate, 'invalid', 1)).toThrow(
      'Invalid period type: invalid'
    )
    expect(addDate.toISOString()).toBe('2025-12-01T00:00:00.000Z')
    expect(DateHelper.AddTimeToDate(addDate, '1d', 1).toISOString()).toBe(
      '2025-12-02T00:00:00.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, '1d').toISOString()).toBe(
      '2025-12-02T00:00:00.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, 'minute', 2).toISOString()).toBe(
      '2025-12-01T00:02:00.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, 'hour', 2).toISOString()).toBe(
      '2025-12-01T02:00:00.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, 'hour', 48).toISOString()).toBe(
      '2025-12-03T00:00:00.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, 'day', 1).toISOString()).toBe(
      '2025-12-02T00:00:00.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, 'week', 1).toISOString()).toBe(
      '2025-12-08T00:00:00.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, 'second', 1).toISOString()).toBe(
      '2025-12-01T00:00:01.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, 'second', 120).toISOString()).toBe(
      '2025-12-01T00:02:00.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, 'year', 2).toISOString()).toBe(
      '2027-12-01T00:00:00.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, 'quarter', 2).toISOString()).toBe(
      '2026-05-30T23:00:00.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, 'month', 1).toISOString()).toBe(
      '2025-12-31T00:00:00.000Z'
    )
    expect(DateHelper.AddTimeToDate(addDate, 'month', 12).toISOString()).toBe(
      '2026-12-01T00:00:00.000Z'
    )
  })

  it('dateNowIsPastExpiry', () => {
    expect.assertions(4)

    const anow = Date.now(),
      // 1 day in the future
      futureDate = new Date(anow + 1000 * 60 * 60 * 24),
      // 1 day ago
      pastDate = new Date(anow - 1000 * 60 * 60 * 24)

    expect(dateNowIsPastExpiry(undefined)).toBe(true)
    expect(dateNowIsPastExpiry(pastDate)).toBe(true)
    expect(dateNowIsPastExpiry(futureDate)).toBe(false)
    expect(dateNowIsPastExpiry(new Date())).toBe(false)
  })
})
