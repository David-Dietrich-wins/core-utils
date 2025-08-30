/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  DEFAULT_DateTimeFormatSeconds,
  DateHelper,
  isCurrentYear,
  isDateObject,
  timeDifference,
  timeDifferenceString,
  timeDifferenceStringFromMillis,
} from './date-helper.mjs'
import { safestr } from './string-helper.mjs'

const dateToTest = new Date()
const dateInMillis = dateToTest.getTime()

test('Add Milliseconds', () => {
  const numToAdd = 2456
  const newDate = DateHelper.addMillisToDate(numToAdd, dateToTest)

  expect(newDate.getTime() - dateInMillis).toEqual(numToAdd)
})

test('Add Seconds', () => {
  const numToAdd = 2456
  const newDate = DateHelper.addSecondsToDate(numToAdd, dateToTest)

  expect(newDate.getTime() - dateInMillis).toEqual(numToAdd * 1000)
})

test('Add Minutes', () => {
  const numToAdd = 2456
  const newDate = DateHelper.addMinutesToDate(numToAdd, dateToTest)

  expect(newDate.getTime() - dateInMillis).toEqual(numToAdd * 1000 * 60)
})

test('Add Hours', () => {
  const numToAdd = 2456
  const newDate = DateHelper.addHoursToDate(numToAdd, dateToTest)

  expect(newDate.getTime() - dateInMillis).toEqual(numToAdd * 1000 * 60 * 60)
})

test('Add Days', () => {
  const numToAdd = 26
  const newDate = DateHelper.addDaysToDate(numToAdd, dateToTest)

  expect(newDate.getTime() - dateInMillis).toEqual(
    numToAdd * 1000 * 60 * 60 * 24
  )
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
    const startTimeMillis = startDate.getTime()

    const retDate = DateHelper.addMillisToDate(5000)
    const retTimeMillis = retDate.getTime()

    const millisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(millisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })

  test('good Date', () => {
    const startDate = new Date()
    const startTimeMillis = startDate.getTime()

    const retDate = DateHelper.addMillisToDate(5000, startDate)
    const retTimeMillis = retDate.getTime()

    const millisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(millisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })

  test('good number', () => {
    const startDate = new Date()
    const startTimeMillis = startDate.getTime()

    const retDate = DateHelper.addMillisToDate(5000, startDate.getTime())
    const retTimeMillis = retDate.getTime()

    const millisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(millisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })

  test('good string', () => {
    const startDate = new Date()
    const startTimeMillis = startDate.getTime()

    const retDate = DateHelper.addMillisToDate(5000, startDate.toISOString())
    const retTimeMillis = new Date(retDate).getTime()

    const millisElapsed = retTimeMillis - startTimeMillis

    expect(retTimeMillis).toBeGreaterThan(0)
    expect(millisElapsed).toBeGreaterThanOrEqual(5000)
    expect(new Date(retTimeMillis).toISOString()).toContain('T')
  })
})

describe('FormatDateTime', () => {
  test('empty', () => {
    // const startDate = new Date()

    const retDate = DateHelper.FormatDateTime(DEFAULT_DateTimeFormatSeconds)
    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })

  test('good Date', () => {
    const startDate = new Date()

    const retDate = DateHelper.FormatDateTime(
      DEFAULT_DateTimeFormatSeconds,
      startDate
    )
    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })

  test('good number', () => {
    const startDate = new Date()

    const retDate = DateHelper.FormatDateTime(
      DEFAULT_DateTimeFormatSeconds,
      startDate.getTime()
    )
    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })

  test('good string', () => {
    const startDate = new Date()

    const retDate = DateHelper.FormatDateTime(
      DEFAULT_DateTimeFormatSeconds,
      startDate.toISOString()
    )
    expect(retDate).toContain('/')
    expect(retDate).toContain(':')
  })
})

test.each([undefined, null, new Date(), Date.now()])('fileDateTime %s', () => {
  const retDate = DateHelper.fileDateTime()

  expect(retDate).toMatch(/\d{6}_\d{6}/iu)
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
])('FormatDateTimeWithMillis %s', (dTest) => {
  const ret = DateHelper.FormatDateTimeWithMillis(dTest)

  expect(ret).toMatch(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/u)
})

test('toLocalStringWithoutTimezone', () => {
  const ret = DateHelper.toLocalStringWithoutTimezone()

  expect(ret).toMatch(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}/u)
})

test(isCurrentYear.name, () => {
  expect(isCurrentYear('2024')).toBe(false)
  expect(isCurrentYear('2023')).toBe(false)

  expect(isCurrentYear(new Date().getFullYear().toString())).toBe(true)
  expect(isCurrentYear(() => new Date().getFullYear().toString())).toBe(true)

  expect(isCurrentYear('a')).toBe(false)
  expect(isCurrentYear(new Date('2100-01-01').getFullYear().toString())).toBe(
    false
  )
})

test(isDateObject.name, () => {
  expect(isDateObject(new Date())).toBe(true)
  expect(isDateObject(1)).toBe(false)
  expect(isDateObject(0)).toBe(false)
  expect(isDateObject('')).toBe(false)
  expect(isDateObject(new Date('2022'))).toBe(true)
  expect(isDateObject('2022-10-24')).toBe(false)
  expect(isDateObject('2022-10-24')).toBe(false)
  expect(isDateObject(new Date('20'))).toBe(false)
  expect(isDateObject(new Date(20))).toBe(true)
})

describe(timeDifference.name, () => {
  test('startTime', () => {
    const startDate = new Date(Date.now() - 2000)

    const millis = timeDifference(startDate)
    expect(millis).toBeGreaterThanOrEqual(2000)
  })

  test('startTime null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => timeDifference(null as any)).toThrow(
      'timeDifference: You must have a start time.'
    )
  })
})

describe(timeDifferenceString.name, () => {
  test('2s', () => {
    const startDate = new Date()
    const endDate = new Date(Number(startDate))

    endDate.setSeconds(endDate.getSeconds() - 2)
    const str = timeDifferenceString(startDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2s')
  })

  test('4h', () => {
    const startDate = new Date()
    const endDate = new Date(Number(startDate))

    endDate.setHours(endDate.getHours() + 4)
    const str = timeDifferenceString(startDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('4h')
  })

  test('21d', () => {
    const startDate = new Date()
    const endDate = new Date(Number(startDate))

    endDate.setDate(endDate.getDate() + 21)
    const str = timeDifferenceString(startDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toMatch(/21d(?<temp1> 1h)?/u)
  })

  test('long format', () => {
    const startDate = new Date()
    const endDate = new Date(Number(startDate) + 2000)

    const str = timeDifferenceString(startDate, endDate, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2 seconds')
  })

  test('long format with millis', () => {
    const startDate = new Date()
    const endDate = new Date(Number(startDate) + 2123)

    const str = timeDifferenceString(startDate, endDate, true, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2 seconds, 123ms')
  })
})

describe(timeDifferenceStringFromMillis.name, () => {
  test('2s', () => {
    const str = timeDifferenceStringFromMillis(2000)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2s')
  })

  test('2s long format', () => {
    const str = timeDifferenceStringFromMillis(2000, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2 seconds')
  })

  test('58m', () => {
    const str = timeDifferenceStringFromMillis(1000 * 60 * 58)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('58m')
  })

  test('58m long format', () => {
    const str = timeDifferenceStringFromMillis(1000 * 60 * 58, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('58 minutes')
  })

  test('4h', () => {
    const str = timeDifferenceStringFromMillis(1000 * 60 * 60 * 4)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('4h')
  })

  test('4h long format', () => {
    const str = timeDifferenceStringFromMillis(1000 * 60 * 60 * 4, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('4 hours')
  })

  test('21d', () => {
    const str = timeDifferenceStringFromMillis(1000 * 60 * 60 * 24 * 21)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('21d')
  })

  test('21d long format', () => {
    const str = timeDifferenceStringFromMillis(1000 * 60 * 60 * 24 * 21, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('21 days')
  })
})
