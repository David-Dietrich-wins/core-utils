import { DateHelper } from './DateHelper.mjs'

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

test('DateFormatForUi', () => {
  const ret = DateHelper.DateFormatForUi()

  expect(ret).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
})
