import { safestr, timeDifferenceString, urlJoin } from './general.js'

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
    const dtNow = new Date()
    const startDate = new Date(+dtNow)

    startDate.setDate(startDate.getDate() + 21)
    const str = timeDifferenceString(startDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('21d')
  })
})

describe('URL Join', () => {
  const baseUrl = 'https://mgmresorts.com'

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
