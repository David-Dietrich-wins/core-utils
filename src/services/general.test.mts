import {
  getAsNumber,
  getNumberFormatted,
  getNumberString,
  isNumeric,
  safestr,
  timeDifferenceString,
  urlJoin,
} from './general.mjs'

describe('Time Difference', () => {
  test('2s', () => {
    const dtNow = new Date()
    const startDate = new Date(+dtNow)

    startDate.setSeconds(startDate.getSeconds() - 2)
    const str = timeDifferenceString(startDate)

    console.log('Time Difference:', str)
    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2s')
  })

  test('4h', () => {
    const dtNow = new Date()
    const startDate = new Date(+dtNow)

    startDate.setHours(startDate.getHours() + 4)
    const str = timeDifferenceString(startDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('4h')
  })

  test('21d', () => {
    const startDate = new Date()

    startDate.setDate(startDate.getDate() + 21)
    const str = timeDifferenceString(startDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('21d')
  })
})

describe('URL Join', () => {
  const baseUrl = 'http://localhost'

  test('Slash relative path', () => {
    const path = '/'
    const url = urlJoin(baseUrl, path)

    expect(url).not.toBe(`${baseUrl}//`)
    expect(url).not.toBe(`${baseUrl}`)
    expect(url).toBe(`${baseUrl}/`)
  })
  test('Extra slashes relative path', () => {
    const path = '/'
    const url = urlJoin(baseUrl + '/', path)

    expect(url).toBe(`${baseUrl}/`)
  })
  test('Many slashes relative path', () => {
    const path = '/'
    const url = urlJoin(baseUrl + '///', path)

    expect(url).toBe(`${baseUrl}/`)
  })
  test('Undefined relative path', () => {
    const path = undefined
    const url = urlJoin(baseUrl, path)

    expect(url).toBe(`${baseUrl}/`)
  })
  test('No relative path', () => {
    const path = undefined
    const url = urlJoin(baseUrl, path, false)

    expect(url).toBe(`${baseUrl}`)
  })
})

test('isNumeric true', () => {
  const str = '123,456,789.0123'

  expect(isNumeric(str)).toBe(true)
})

test('isNumeric false', () => {
  const str = '123,456,789.01abc'

  expect(isNumeric(str)).toBe(false)
})

test('getAsNumber true', () => {
  const str = '123,456,789.01'

  expect(getAsNumber(str)).toBe(123456789.01)
})

test('getAsWholeNumber true', () => {
  const str = '123,456,789'

  expect(getAsNumber(str)).toBe(123456789)
})

test('getNumberFormatted true', () => {
  const str = '123,456,789'

  expect(getNumberFormatted(str)).toBe(123456789)
})

test('getNumberFormatted true', () => {
  const num = '123456789.234'

  expect(getNumberFormatted(num, 1, 1)).toBe(123456789.2)
})

test('getNumberString true', () => {
  const num = 123456789.234

  expect(getNumberString(num)).toBe('123,456,789')
})
