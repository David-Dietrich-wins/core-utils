import moment from 'moment'
import { getCurrentDate, TEST_Parameters_DEV } from '../jest.setup.mjs'
import { DateHelper } from './DateHelper.mjs'
import { safestr } from './string-helper.mjs'
import { AppException } from '../models/AppException.mjs'

test('VerifyDateOrNowIfEmpty', () => {
  let date = DateHelper.VerifyDateOrNowIfEmpty(
    TEST_Parameters_DEV.currentDateString
  )
  expect(date.getTime()).toEqual(TEST_Parameters_DEV.currentDateInMilliseconds)

  date = DateHelper.VerifyDateOrNowIfEmpty('2025-12-01T00:00:00.000Z')
  expect(date.getTime()).toEqual(new Date('2025-12-01T00:00:00.000Z').getTime())

  date = DateHelper.VerifyDateOrNowIfEmpty(345427200000) // AAPL IPO date
  expect(date.getTime()).toEqual(new Date('1980-12-12T00:00:00.000Z').getTime())

  date = DateHelper.VerifyDateOrNowIfEmpty('1980-12-12') // AAPL IPO date
  expect(date.getTime()).toEqual(new Date('1980-12-12T00:00:00.000Z').getTime())

  expect(DateHelper.VerifyDateOrNowIfEmpty(1740481297461)).toEqual(
    new Date('2025-02-25T11:01:37.461Z')
  )

  expect(DateHelper.VerifyDateOrNowIfEmpty(undefined)).toEqual(
    TEST_Parameters_DEV.currentDate
  )
  expect(DateHelper.VerifyDateOrNowIfEmpty(0)).toEqual(
    new Date('1970-01-01T00:00:00.000Z')
  )
  expect(DateHelper.VerifyDateOrNowIfEmpty(null)).toEqual(
    TEST_Parameters_DEV.currentDate
  )
  expect(() =>
    DateHelper.VerifyDateOrNowIfEmpty('2025-13-01T00:00:00.000Z')
  ).toThrow(AppException)
})

test('Add Milliseconds', () => {
  const numToAdd = 2456
  const newDate = DateHelper.addMillisToDate(
    numToAdd,
    TEST_Parameters_DEV.currentDate
  )

  expect(
    newDate.getTime() - TEST_Parameters_DEV.currentDateInMilliseconds
  ).toEqual(numToAdd)
})

test('Add Seconds', () => {
  const numToAdd = 2456
  const newDate = DateHelper.addSecondsToDate(
    numToAdd,
    TEST_Parameters_DEV.currentDate
  )

  expect(
    newDate.getTime() - TEST_Parameters_DEV.currentDateInMilliseconds
  ).toEqual(numToAdd * 1000)
})

test('Add Minutes', () => {
  const numToAdd = 2456
  const newDate = DateHelper.addMinutesToDate(
    numToAdd,
    TEST_Parameters_DEV.currentDate
  )

  expect(
    newDate.getTime() - TEST_Parameters_DEV.currentDateInMilliseconds
  ).toEqual(numToAdd * 1000 * 60)
})

test('Add Hours', () => {
  const numToAdd = 2456
  const newDate = DateHelper.addHoursToDate(
    numToAdd,
    TEST_Parameters_DEV.currentDate
  )

  expect(
    newDate.getTime() - TEST_Parameters_DEV.currentDateInMilliseconds
  ).toEqual(numToAdd * 1000 * 60 * 60)
})

test('Add Days', () => {
  const numToAdd = 26
  const newDate = DateHelper.addDaysToDate(
    numToAdd,
    TEST_Parameters_DEV.currentDate
  )

  expect(
    newDate.getTime() - TEST_Parameters_DEV.currentDateInMilliseconds
  ).toEqual(numToAdd * 1000 * 60 * 60 * 24)
})

describe('toIsoString', () => {
  test('empty undefined', () => {
    const ret = DateHelper.toIsoString()

    expect(ret).toBeUndefined()
  })

  test('good Date', () => {
    const ret = DateHelper.toIsoString(new Date())

    expect(ret).toContain('T')
  })

  test('good number', () => {
    const ret = DateHelper.toIsoString(Date.now())

    expect(ret).toContain('T')
  })

  test('good string', () => {
    const ret = DateHelper.toIsoString(new Date().toISOString())

    expect(ret).toContain('T')
  })

  test('SQL date', () => {
    const strSqlDate = '2022-10-30 22:09:00.000'
    const ret = DateHelper.toIsoString(strSqlDate)

    expect(ret).toBe('2022-10-31T02:09:00.000Z')
  })
})

describe('SqlUtcToUtcString', () => {
  test('empty', () => {
    const ret = DateHelper.SqlUtcToUtcString('')

    expect(ret).toBe('')
  })

  test('null', () => {
    const ret = DateHelper.SqlUtcToUtcString(null as unknown as string)

    expect(ret).toBe('')
  })

  test('undefined', () => {
    const ret = DateHelper.SqlUtcToUtcString(undefined as unknown as string)

    expect(ret).toBe('')
  })

  test('milliseconds', () => {
    const strSqlDate = '2022-11-31 22:09:00.000'

    const ret = DateHelper.SqlUtcToUtcString(strSqlDate, false)

    expect(ret).toBe('2022-11-31T22:09:00.000Z')
  })

  test('no milliseconds', () => {
    const strSqlDate = '2022-11-31 22:09:00.000'

    const ret = DateHelper.SqlUtcToUtcString(strSqlDate)

    expect(ret).toBe('2022-11-31T22:09:00Z')
  })
})

describe('toIsoStringSafe', () => {
  test('empty', () => {
    const ret = DateHelper.toIsoStringSafe()

    expect(ret).toBe('')
  })

  test('good Date', () => {
    const ret = DateHelper.toIsoStringSafe(new Date())

    expect(ret).toContain('T')
  })

  test('good number', () => {
    const ret = DateHelper.toIsoStringSafe(Date.now())

    expect(ret).toContain('T')
  })

  test('good string', () => {
    const ret = DateHelper.toIsoStringSafe(new Date().toISOString())

    expect(ret).toContain('T')
  })
})

describe('addMillisToDate', () => {
  test('empty', () => {
    const startDate = new Date()
    const startTimeMillis = +startDate

    const retDate = DateHelper.addMillisToDate(5000)
    const retTimeMillis = +retDate

    const millisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(millisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })

  test('good Date', () => {
    const startDate = new Date()
    const startTimeMillis = +startDate

    const retDate = DateHelper.addMillisToDate(5000, startDate)
    const retTimeMillis = +retDate

    const millisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(millisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })

  test('good number', () => {
    const startDate = new Date()
    const startTimeMillis = +startDate

    const retDate = DateHelper.addMillisToDate(5000, +startDate)
    const retTimeMillis = +retDate

    const millisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(millisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })

  test('good string', () => {
    const startDate = new Date()
    const startTimeMillis = +startDate

    const retDate = DateHelper.addMillisToDate(5000, startDate.toISOString())
    const retTimeMillis = +retDate

    const millisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(millisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })
})

describe('FormatDateTime', () => {
  test('empty', () => {
    // const startDate = new Date()

    const retDate = DateHelper.FormatDateTime(DateHelper.FormatSeconds)
    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })

  test('good Date', () => {
    const startDate = new Date()

    const retDate = DateHelper.FormatDateTime(
      DateHelper.FormatSeconds,
      startDate
    )
    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })

  test('good number', () => {
    const startDate = new Date()

    const retDate = DateHelper.FormatDateTime(
      DateHelper.FormatSeconds,
      +startDate
    )
    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })

  test('good string', () => {
    const startDate = new Date()

    const retDate = DateHelper.FormatDateTime(
      DateHelper.FormatSeconds,
      startDate.toISOString()
    )
    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })
})

test.each([undefined, null, new Date(), Date.now()])('fileDateTime %s', () => {
  const retDate = DateHelper.fileDateTime()

  expect(retDate).toMatch(/\d{6}_\d{6}/i)
})

test.each([
  undefined,
  '',
  new Date(),
  Date.now(),
  '2024-01-01',
  '2024-10-31 12:31',
  '2024-10-31 12:31:45',
  '2024-10-31 12:31:45.999',
  '2024-10-31 23:31:45.000',
])('FormatDateTimeWithMillis %s', (dateToTest) => {
  const ret = DateHelper.FormatDateTimeWithMillis(dateToTest)

  expect(ret).toMatch(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/)
})

test('toLocalStringWithoutTimezone', () => {
  const ret = DateHelper.toLocalStringWithoutTimezone()

  expect(ret).toMatch(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}/)
})

describe('DateFormatForUi', () => {
  test('default', () => {
    const ret = DateHelper.DateFormatForUi()

    expect(ret).toMatch(/\d{1,2}\/\d{1,2}\/\d{2}/)
  })
  test('show full year', () => {
    const ret = DateHelper.DateFormatForUi(undefined, true)

    expect(ret).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
  })
  test('utc', () => {
    const ret = DateHelper.DateFormatForUi(Date.now(), true, true)

    expect(ret).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
  })
})
describe('DateHelper.timeDifference', () => {
  test('startTime', () => {
    const startDate = new Date(Date.now() - 2000)

    const millis = DateHelper.timeDifference(startDate)
    expect(millis).toBeGreaterThanOrEqual(2000)
  })

  test('startTime null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => DateHelper.timeDifference(null as any)).toThrow(
      'DateHelper.timeDifference: You must have a start time.'
    )
  })
})
describe('DateHelper.timeDifferenceString', () => {
  test('2s', () => {
    const startDate = new Date()
    const endDate = new Date(+startDate)

    endDate.setSeconds(endDate.getSeconds() - 2)
    const str = DateHelper.timeDifferenceString(startDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2s')
  })

  test('4h', () => {
    const startDate = new Date()
    const endDate = new Date(+startDate)

    endDate.setHours(endDate.getHours() + 4)
    const str = DateHelper.timeDifferenceString(startDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('4h')
  })

  test('21d', () => {
    const startDate = getCurrentDate()
    const endDate = new Date(startDate)

    endDate.setDate(endDate.getDate() + 21)
    const str = DateHelper.timeDifferenceString(startDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toMatch(new RegExp('21d( 1h)?'))
  })

  test('long format', () => {
    const startDate = new Date()
    const endDate = new Date(+startDate + 2000)

    const str = DateHelper.timeDifferenceString(startDate, endDate, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2 seconds')
  })

  test('long format with millis', () => {
    const startDate = new Date()
    const endDate = new Date(+startDate + 2123)

    const str = DateHelper.timeDifferenceString(startDate, endDate, true, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2 seconds, 123ms')
  })
})
describe('DateHelper.timeDifferenceStringFromMillis', () => {
  test('2s', () => {
    const str = DateHelper.timeDifferenceStringFromMillis(2000)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2s')
  })

  test('2s long format', () => {
    const str = DateHelper.timeDifferenceStringFromMillis(2000, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2 seconds')
  })

  test('189ms', () => {
    const str = DateHelper.timeDifferenceStringFromMillis(189)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('189ms')
  })

  test('189ms long format', () => {
    const str = DateHelper.timeDifferenceStringFromMillis(189, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('189ms')
  })

  test('58m', () => {
    const str = DateHelper.timeDifferenceStringFromMillis(1000 * 60 * 58)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('58m')
  })

  test('58m long format', () => {
    const str = DateHelper.timeDifferenceStringFromMillis(1000 * 60 * 58, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('58 minutes')
  })

  test('4h', () => {
    const str = DateHelper.timeDifferenceStringFromMillis(1000 * 60 * 60 * 4)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('4h')
  })

  test('4h long format', () => {
    const str = DateHelper.timeDifferenceStringFromMillis(
      1000 * 60 * 60 * 4,
      true
    )

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('4 hours')
  })

  test('21d', () => {
    const str = DateHelper.timeDifferenceStringFromMillis(
      1000 * 60 * 60 * 24 * 21
    )

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('21d')
  })

  test('21d long format', () => {
    const str = DateHelper.timeDifferenceStringFromMillis(
      1000 * 60 * 60 * 24 * 21,
      true
    )

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('21 days')
  })
})

test('isDateObject', () => {
  expect(DateHelper.isDateObject(new Date())).toBe(true)
  expect(DateHelper.isDateObject(1)).toBe(false)
  expect(DateHelper.isDateObject(0)).toBe(false)
  expect(DateHelper.isDateObject('')).toBe(false)
  expect(DateHelper.isDateObject(new Date('2022'))).toBe(true)
  expect(DateHelper.isDateObject('2022-10-24')).toBe(false)
  expect(DateHelper.isDateObject(new Date('2022-10-24'))).toBe(true)
  expect(DateHelper.isDateObject(new Date('20'))).toBe(false)
  expect(DateHelper.isDateObject(new Date(20))).toBe(true)
  expect(DateHelper.isDateObject(moment('2022-10-24T00:00:00.000Z'))).toBe(
    false
  )
  expect(
    DateHelper.isDateObject(moment('2022-10-24T00:00:00.000Z').toDate())
  ).toBe(true)
})

test('IsValidDate', () => {
  expect(DateHelper.IsValidDate(new Date())).toBe(true)
  expect(DateHelper.IsValidDate(1)).toBe(true)
  expect(DateHelper.IsValidDate(0)).toBe(false)
  expect(DateHelper.IsValidDate('')).toBe(false)
  expect(DateHelper.IsValidDate(new Date('2022'))).toBe(true)
  expect(DateHelper.IsValidDate('2022-10-24')).toBe(true)
  expect(DateHelper.IsValidDate('2022-10-24')).toBe(true)
  expect(DateHelper.IsValidDate(new Date('20'))).toBe(false)
  expect(DateHelper.IsValidDate(new Date(20))).toBe(true)
  expect(DateHelper.IsValidDate(moment('2022-10-24T00:00:00.000Z'))).toBe(true)
  expect(
    DateHelper.IsValidDate(moment('2022-10-24T00:00:00.000Z').toDate())
  ).toBe(true)
})

test('TimeframeToStartOf', () => {
  expect(DateHelper.TimeframeToStartOf('d')).toBe('day')
  expect(DateHelper.TimeframeToStartOf('h')).toBe('hour')
  expect(DateHelper.TimeframeToStartOf('m')).toBe('minute')
  expect(DateHelper.TimeframeToStartOf('s')).toBe('second')
  expect(DateHelper.TimeframeToStartOf('w')).toBe('week')
  expect(DateHelper.TimeframeToStartOf('M')).toBe('month')
  expect(DateHelper.TimeframeToStartOf('y')).toBe('year')
  expect(DateHelper.TimeframeToStartOf('v')).toBe('v')
})

test('LocalToUtc', () => {
  const localDate = new Date('2024-01-01T00:00:00.000Z')
  const utcDate = DateHelper.LocalToUtc(localDate)

  expect(utcDate).toBeInstanceOf(Date)
  expect(utcDate.toISOString()).toBe('2024-01-01T05:00:00.000Z')

  expect(DateHelper.LocalToUtc(undefined)).toStrictEqual(
    new Date('2025-12-01T17:00:00.000Z')
  )
})

// test('getFormattedTime', () => {
//   const localDate = new Date('2024-01-01T00:00:00.000Z')
//   const utcDate = DateHelper.getFormattedTime(+localDate)

//   expect(utcDate).toBeInstanceOf(Date)
//   expect(utcDate.toISOString()).toBe('2024-01-01T05:00:00.000Z')

//   expect(DateHelper.LocalToUtc(undefined)).toStrictEqual(
//     new Date('2025-12-01T17:00:00.000Z')
//   )
// })

test('FormattedUnixTime', () => {
  const localDate = new Date('2024-01-01T00:00:00.000Z')
  const utcDate = DateHelper.FormattedUnixTime(+localDate)

  expect(utcDate).toBe('Saturday, September 27th 55969, 8:00:00 pm')
})

test('TimezoneOffsetInMinutes', () => {
  const utcDate = DateHelper.TimezoneOffsetInMinutes()

  expect(utcDate).toBe(-300)
})

test('UnixTimeFormat', () => {
  const utcDate = DateHelper.UnixTimeFormat(+new Date())

  expect(utcDate).toBe('Dec 1, 2025 7:00 AM')
})

test('UnixTimeFormatForTheDow', () => {
  const utcDate = DateHelper.UnixTimeFormatForTheDow(+new Date())

  expect(utcDate).toBe('Monday, December 1st 2025, 7:00:00 AM')
})

test('DateFormatForUiWithTime', () => {
  expect(DateHelper.DateFormatForUiWithTime(+new Date())).toBe(
    '12/1/25 7:00 am'
  )
  expect(DateHelper.DateFormatForUiWithTime(+new Date(), true)).toBe(
    '12/1/2025 7:00 am'
  )
  expect(DateHelper.DateFormatForUiWithTime(+new Date(), false, true)).toBe(
    '12/1/25 7:00:00 am'
  )
  expect(DateHelper.DateFormatForUiWithTime(+new Date(), true, true)).toBe(
    '12/1/2025 7:00:00 am'
  )
})

test('DateFormatForApiCalls', () => {
  const utcDate = DateHelper.DateFormatForApiCalls(+new Date())

  expect(utcDate).toBe('2025-12-01')
})

test('Midnight', () => {
  const utcDate = DateHelper.Midnight(new Date())

  expect(utcDate).toStrictEqual(new Date('2025-12-01T00:00:00.000Z'))
  expect(DateHelper.Midnight('2025-12-01T00:00:00.000Z')).toStrictEqual(
    new Date('2025-12-01T00:00:00.000Z')
  )
})

test('Midnight bad date', () => {
  const utcDate = DateHelper.Midnight('invalid date')

  expect(utcDate).toBeUndefined()
})

test('MidnightSafe', () => {
  const utcDate = DateHelper.MidnightSafe(new Date())

  expect(utcDate).toStrictEqual(new Date('2025-12-01T00:00:00.000Z'))

  expect(() => DateHelper.MidnightSafe(undefined)).toThrow()
})

test('NextBoundaryUp', () => {
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

test('FormatLocaleDateString', () => {
  expect(DateHelper.FormatLocaleDateString()).toBe('December 1, 2025')
  expect(DateHelper.FormatLocaleDateString(null)).toBe('December 1, 2025')
  expect(DateHelper.FormatLocaleDateString(undefined)).toBe('December 1, 2025')
  expect(
    DateHelper.FormatLocaleDateString(TEST_Parameters_DEV.currentDate)
  ).toBe('December 1, 2025')
  expect(
    DateHelper.FormatLocaleDateString(TEST_Parameters_DEV.currentDateString)
  ).toBe('December 1, 2025')
  expect(
    DateHelper.FormatLocaleDateString(
      new Date(TEST_Parameters_DEV.currentDateString)
    )
  ).toBe('December 1, 2025')
  expect(
    DateHelper.FormatLocaleDateString(
      TEST_Parameters_DEV.currentDateInMilliseconds
    )
  ).toBe('December 1, 2025')

  expect(
    DateHelper.FormatLocaleDateString(TEST_Parameters_DEV.currentDate, 'es-ES')
  ).toBe('1 de diciembre de 2025')

  expect(DateHelper.VerifyDateOrNowIfEmpty('1980-12-12')).toEqual(
    new Date('1980-12-12T00:00:00.000Z')
  )

  expect(DateHelper.VerifyDateOrNowIfEmpty(1740481297461)).toEqual(
    new Date('2025-02-25T11:01:37.461Z')
  )
})
