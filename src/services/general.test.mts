/* eslint-disable quotes */
import { jest } from '@jest/globals'
import {
  addObjectToList,
  deepCloneJson,
  deepDiffMapper,
  getAsNumber,
  getAsNumberOrUndefined,
  getBody,
  getBoolean,
  getCommaUpperList,
  getMantissa,
  getNullObject,
  getNumberFormatted,
  getNumberString,
  getObjectValue,
  getPercentChange,
  getPercentChangeString,
  hasData,
  isArray,
  isDateObject,
  isEmptyString,
  isNumber,
  isNumeric,
  isObject,
  newGuid,
  pluralize,
  plusMinus,
  renameProperty,
  runOnAllMembers,
  safeArray,
  safeJsonToString,
  safeObject,
  safestr,
  safestrToJson,
  searchObjectForArray,
  sortFunction,
  stringEquals,
  stringEqualsQuoted,
  stringWrapDoubleQuote,
  stringWrapParen,
  stringWrapSingleQuote,
  timeDifference,
  timeDifferenceString,
  timeDifferenceStringFromMillis,
  toHex,
  urlJoin,
} from './general.mjs'
import { getCurrentDate } from '../jest.setup.mjs'

test('safestr', () => {
  expect(safestr(undefined)).toBe('')
  expect(safestr(null)).toBe('')
  expect(safestr('')).toBe('')
  expect(safestr('', 'test')).toBe('test')
  expect(safestr('test')).toBe('test')
})

describe('timeDifference', () => {
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

describe('timeDifferenceString', () => {
  test('2s', () => {
    const startDate = new Date()
    const endDate = new Date(+startDate)

    endDate.setSeconds(endDate.getSeconds() - 2)
    const str = timeDifferenceString(startDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2s')
  })

  test('4h', () => {
    const startDate = new Date()
    const endDate = new Date(+startDate)

    endDate.setHours(endDate.getHours() + 4)
    const str = timeDifferenceString(startDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('4h')
  })

  test('21d', () => {
    const startDate = getCurrentDate()
    const endDate = new Date(startDate)

    endDate.setDate(endDate.getDate() + 21)
    const str = timeDifferenceString(startDate, endDate)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toMatch(new RegExp('21d( 1h)?'))
  })

  test('long format', () => {
    const startDate = new Date()
    const endDate = new Date(+startDate + 2000)

    const str = timeDifferenceString(startDate, endDate, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2 seconds')
  })

  test('long format with millis', () => {
    const startDate = new Date()
    const endDate = new Date(+startDate + 2123)

    const str = timeDifferenceString(startDate, endDate, true, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('2 seconds, 123ms')
  })
})

describe('timeDifferenceStringFromMillis', () => {
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

  test('189ms', () => {
    const str = timeDifferenceStringFromMillis(189)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('189ms')
  })

  test('189ms long format', () => {
    const str = timeDifferenceStringFromMillis(189, true)

    expect(safestr(str).length).toBeGreaterThan(1)
    expect(str).toBe('189ms')
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

describe('URL Join', () => {
  const baseUrl = 'https://localhost:3000'

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
  test('No trailing slash', () => {
    expect(urlJoin(baseUrl, '?x=1', true)).toBe(`${baseUrl}/?x=1`)
    expect(urlJoin(baseUrl, '?x=1&y=2', true)).toBe(`${baseUrl}/?x=1&y=2`)
    expect(urlJoin(baseUrl, '?x=1&y=2#link', true)).toBe(
      `${baseUrl}/?x=1&y=2#link`
    )
  })
})

describe('Number formatting', () => {
  test('String from a number with commas added', () => {
    const num = 123456789
    const str = getNumberString(num)

    expect(str).toBe('123,456,789')
  })

  test('Number from string with commas', () => {
    const num = '123,456,789'
    const str = getAsNumberOrUndefined(num)

    expect(str).toBe(123456789)
  })

  test('getAsNumber', () => {
    const num = '123,456,789'
    const str = getAsNumber(num)

    expect(str).toBe(123456789)
  })
})

describe('URL Join', () => {
  test('add trailing slash', () => {
    const baseUrl = 'https://localhost:3000'
    const relativePath = '/test'
    const addTrailingSlash = true

    const url = urlJoin(baseUrl, relativePath, addTrailingSlash)
    expect(url).toBe(`https://localhost:3000/test/`)
  })

  test('no trailing slash', () => {
    const baseUrl = 'https://localhost:3000'
    const relativePath = '/test'
    const addTrailingSlash = false

    const url = urlJoin(baseUrl, relativePath, addTrailingSlash)
    expect(url).toBe('https://localhost:3000/test')
  })

  test('URL end in /', () => {
    const baseUrl = 'https://localhost:3000/'
    const relativePath = '/test'
    const addTrailingSlash = false

    const url = urlJoin(baseUrl, relativePath, addTrailingSlash)
    expect(url).toBe('https://localhost:3000/test')
  })

  test('relative path and url end in /', () => {
    const baseUrl = 'https://localhost:3000/'
    const relativePath = '/test/'
    const addTrailingSlash = false

    const url = urlJoin(baseUrl, relativePath, addTrailingSlash)
    expect(url).toBe('https://localhost:3000/test')
  })
})

describe('toHex', () => {
  test('0 should be 00', () => {
    const ret = toHex(0)

    expect(ret).toBe('00')
  })

  test('10 should a', () => {
    const ret = toHex(10)

    expect(ret).toBe('0A')
  })

  test('10 should a', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret = toHex(10, null as any)

    expect(ret).toBe('0A')
  })

  test('10 should a 4 chars', () => {
    const ret = toHex(10, 4)

    expect(ret).toBe('000A')
  })
})

describe('strings', () => {
  test('stringWrapSingleQuote', () => {
    const str = stringWrapSingleQuote('test')

    expect(str).toBe("'test'")
  })

  test('stringWrapParen', () => {
    const str = stringWrapParen('test')

    expect(str).toBe('(test)')
  })

  test('stringWrapDoubleQuote', () => {
    const str = stringWrapDoubleQuote('test')

    expect(str).toBe('"test"')
  })

  describe('stringEquals', () => {
    test('nothing', () => {
      const str = stringEquals('', '')

      expect(str).toBe('')
    })

    test('not wrapped', () => {
      const str = stringEquals('name', 'value')

      expect(str).toBe('name=value')
    })

    test('wrapped', () => {
      const str = stringEquals('name', 'value', 'ab')

      expect(str).toBe('name=abvalueab')
    })
  })

  describe('stringEqualsQuoted', () => {
    test('nothing', () => {
      expect(stringEqualsQuoted('', '', true)).toBe('')

      expect(stringEqualsQuoted('', '', false)).toBe('')
    })

    test('name/value', () => {
      expect(stringEqualsQuoted('name', '', false)).toBe('name=""')
      expect(stringEqualsQuoted('name', 'value', false)).toBe('name="value"')

      expect(stringEqualsQuoted('name', '')).toBe("name=''")
      expect(stringEqualsQuoted('name', 'value')).toBe("name='value'")

      expect(stringEqualsQuoted('name', '', true)).toBe("name=''")
      expect(stringEqualsQuoted('name', 'value', true)).toBe("name='value'")
    })

    test('single quoted', () => {
      const str = stringEqualsQuoted('name', 'value', true)

      expect(str).toBe("name='value'")
    })

    test('double quoted', () => {
      const str = stringEqualsQuoted('name', 'value', false)

      expect(str).toBe('name="value"')
    })
  })
})

describe('sortFunction', () => {
  test('number', () => {
    const a = 0
    const b = 1

    expect(sortFunction(a, b)).toEqual(-1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(1)

    expect(sortFunction(a, b, false)).toEqual(1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(-1)
  })

  test('string', () => {
    const a = 'a'
    const b = 'b'

    expect(sortFunction(a, b)).toEqual(-1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(1)

    expect(sortFunction(a, b, 'asc')).toEqual(-1)
    expect(sortFunction(a, a, 'asc')).toEqual(0)
    expect(sortFunction(b, a, 'asc')).toEqual(1)

    expect(sortFunction(a, b, false)).toEqual(1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(-1)

    expect(sortFunction(a, b, 'desc')).toEqual(1)
    expect(sortFunction(a, a, 'desc')).toEqual(0)
    expect(sortFunction(b, a, 'desc')).toEqual(-1)
  })

  test('empty', () => {
    let a: string | undefined = 'a'
    let b: string | undefined = undefined

    expect(sortFunction(a, b)).toEqual(-1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(1)

    expect(sortFunction(a, b, false)).toEqual(-1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(1)

    a = undefined
    b = 'b'
    expect(sortFunction(a, b)).toEqual(1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(-1)

    expect(sortFunction(a, b, false)).toEqual(1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(-1)
  })

  test('date', () => {
    const a = new Date()
    const b = new Date(+a + 1000)

    expect(sortFunction(a, b)).toEqual(-1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(1)

    expect(sortFunction(a, b, false)).toEqual(1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(-1)
  })

  test('array', () => {
    const a = ['a', 'b']
    const b = ['a', 'c']

    expect(sortFunction(a, b)).toEqual(-1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(1)

    expect(sortFunction(a, b, false)).toEqual(1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(-1)
  })
})

test('searchObjectForArray', () => {
  const obj: Record<string, unknown> = {
    a: 'a',
    b: 'b',
    c: 'c',
  }

  expect(searchObjectForArray(obj)).toEqual([])

  obj.anything = ['a', 'b', 'c']
  expect(searchObjectForArray(obj)).toEqual(['a', 'b', 'c'])

  obj.anythingElse = ['c', 'b', 'a']
  expect(searchObjectForArray(obj)).toEqual(['a', 'b', 'c'])

  obj.anything = 'a'
  expect(searchObjectForArray(obj)).toEqual(['c', 'b', 'a'])

  expect(searchObjectForArray(['c', 'b', 'a'])).toEqual(['c', 'b', 'a'])
})

test('runOnAllMembers', () => {
  expect(() =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runOnAllMembers(1 as any, (key: string, value: unknown) => {
      return key + value
    })
  ).toThrow('runOnAllMembers() received an empty object.')

  expect(() =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runOnAllMembers({ a: 'a' }, null as any)
  ).toThrow('runOnAllMembers() received an empty function operator.')

  const funcToRunOnAllMembers = (key: string, value: unknown) => {
    return key + value
  }

  expect(
    runOnAllMembers({ a: 'a', b: 'b' }, funcToRunOnAllMembers)
  ).toStrictEqual({
    a: 'aa',
    b: 'bb',
  })

  expect(
    runOnAllMembers(
      { a: 'a', b: 'b', c: undefined },
      funcToRunOnAllMembers,
      true
    )
  ).toStrictEqual({
    a: 'aa',
    b: 'bb',
    c: undefined,
  })

  expect(
    runOnAllMembers(
      { a: 'a', b: 'b', c: undefined },
      funcToRunOnAllMembers,
      false
    )
  ).toStrictEqual({
    a: 'aa',
    b: 'bb',
    c: 'cundefined',
  })
})

test('renameProperty', () => {
  let obj = { a: 'a', b: 'b', c: 'c' }
  let retobj = { b: 'b', c: 'c', d: 'a' }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let oldKey: any = 'a'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let newKey: any = 'd'

  renameProperty(obj, oldKey, newKey)
  expect(obj).toStrictEqual(retobj)

  oldKey = null
  newKey = null
  expect(() => renameProperty(obj, oldKey, newKey)).toThrow(
    'Cannot renameProperty. Invalid settings.'
  )

  oldKey = 'a'
  expect(() => renameProperty(obj, oldKey, newKey)).toThrow(
    'Cannot renameProperty. Invalid settings.'
  )

  oldKey = 'notToBeFound'
  newKey = 'd'
  expect(() => renameProperty(obj, oldKey, newKey)).toThrow(
    `Cannot renameProperty. Property: ${oldKey} not found.`
  )

  obj = { a: 'a', b: 'b', c: 'c' }
  oldKey = 'a'
  newKey = 'd'
  retobj = { b: 'b', c: 'c', d: 'a' }
  expect(renameProperty(obj, oldKey, newKey)).toStrictEqual(retobj)
})

test('pluralize', () => {
  expect(pluralize(0)).toBe('s')
  expect(pluralize(1)).toBe('')
  expect(pluralize(2)).toBe('s')

  expect(pluralize(0, 'ab')).toBe('s')
  expect(pluralize(1, 'ab')).toBe('ab')
  expect(pluralize(2, 'ab')).toBe('s')

  expect(pluralize(0, 'activity', 'activities')).toBe('activities')
  expect(pluralize(1, 'activity', 'activities')).toBe('activity')
  expect(pluralize(2, 'activity', 'activities')).toBe('activities')
})

test('plusMinus', () => {
  expect(plusMinus(0)).toBe('')
  expect(plusMinus(1)).toBe('+')
  expect(plusMinus(-1)).toBe('-')
})

test('safestrToJson', () => {
  expect(safestrToJson()).toBeUndefined()
  expect(safestrToJson(undefined)).toBeUndefined()
  expect(safestrToJson(null)).toBeUndefined()
  expect(safestrToJson('abc')).toBeUndefined()
  expect(safestrToJson('{"a":1}')).toStrictEqual({ a: 1 })

  console.log = jest.fn()

  expect(safestrToJson('{a:1')).toBeUndefined()
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(safestrToJson('{a:1', 'functionName:')).toBeUndefined()
  expect(console.log).toHaveBeenCalledTimes(2)
})

test('safeObject', () => {
  expect(safeObject()).toStrictEqual({})
  expect(safeObject({ a: 1 })).toStrictEqual({ a: 1 })
  expect(safeObject(undefined, { a: 1 })).toStrictEqual({ a: 1 })
})

test('safeJsonToString', () => {
  expect(safeJsonToString({ a: 'a' })).toBe('{"a":"a"}')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(safeJsonToString(4 as any)).toBe('{}')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(safeJsonToString(undefined as any)).toBe('{}')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(safeJsonToString(null as any)).toBe('{}')

  // Circular reference so JSON.stringify will fail
  const obj: Record<string, unknown> = {}
  obj.a = { b: obj }
  expect(safeJsonToString(obj)).toBe('')

  console.log = jest.fn()

  expect(safeJsonToString(obj, 'functionName:')).toBe('')
  expect(console.log).toHaveBeenCalledTimes(1)
})

test('safeArray', () => {
  expect(safeArray()).toStrictEqual([])
  expect(safeArray(1)).toStrictEqual([1])
  expect(safeArray([1])).toStrictEqual([1])
  expect(safeArray(undefined, [1])).toStrictEqual([1])
})

test('getNullObject', () => {
  expect(getNullObject({})).toBeNull()
  expect(getNullObject({ a: 'a' })).toStrictEqual({ a: 'a' })
})

test('newGuid', () => {
  const newg = newGuid()

  expect(newg.length).toBe(36)
})

test('isObject', () => {
  expect(isObject({})).toBe(true)
  expect(isObject([])).toBe(false)
  expect(isObject(1)).toBe(false)
  expect(isObject('')).toBe(false)

  expect(isObject({}, 1)).toBe(false)
  expect(isObject({ a: 'a' }, -1)).toBe(true)
  expect(isObject({ a: 'a' }, 0)).toBe(true)
  expect(isObject({ a: 'a' }, 1)).toBe(true)
  expect(isObject({ a: 'a' }, 'a')).toBe(true)
  expect(isObject({ a: 'a' }, 'b')).toBe(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(isObject({ a: 'a' }, new Date() as any)).toBe(true)
})

test('isNumeric', () => {
  expect(isNumeric()).toBe(false)
  expect(isNumeric(1)).toBe(true)
  expect(isNumeric('1')).toBe(true)
  expect(isNumeric('1.11')).toBe(true)
  expect(isNumeric('1.11.1')).toBe(false)
  expect(isNumeric('12q')).toBe(false)
  expect(isNumeric('a2q')).toBe(false)
})

test('isNumber', () => {
  expect(isNumber(undefined)).toBe(false)
  expect(isNumber(null)).toBe(false)
  expect(isNumber(-1)).toBe(true)
  expect(isNumber(0)).toBe(true)
  expect(isNumber(1)).toBe(true)
  expect(isNumber('1')).toBe(false)
  expect(isNumber([1])).toBe(false)
  expect(isNumber({ 1: 1 })).toBe(false)

  expect(isNumber(1000, 999)).toBe(true)
  expect(isNumber(1000, 1000)).toBe(true)
  expect(isNumber(1000, 1001)).toBe(false)

  expect(isNumber(1000, undefined, 999)).toBe(false)
  expect(isNumber(1000, undefined, 1000)).toBe(true)
  expect(isNumber(1000, undefined, 1001)).toBe(true)

  expect(isNumber(998, 999, 1001)).toBe(false)
  expect(isNumber(999, 999, 1001)).toBe(true)
  expect(isNumber(1000, 999, 1001)).toBe(true)
  expect(isNumber(1001, 999, 1001)).toBe(true)
  expect(isNumber(1002, 999, 1001)).toBe(false)

  expect(isNumber(998, 1001, 999)).toBe(false)
  expect(isNumber(999, 1001, 999)).toBe(false)
  expect(isNumber(1000, 1001, 999)).toBe(false)
  expect(isNumber(1001, 1001, 999)).toBe(false)
  expect(isNumber(1002, 1001, 999)).toBe(false)
})

test('isEmptyString', () => {
  expect(isEmptyString(undefined)).toBe(true)
  expect(isEmptyString(null)).toBe(true)
  expect(isEmptyString('')).toBe(true)
  expect(isEmptyString('a')).toBe(false)
  expect(isEmptyString('0')).toBe(false)
  expect(isEmptyString('1')).toBe(false)

  expect(isEmptyString(() => undefined)).toBe(true)
  expect(isEmptyString(() => null)).toBe(true)
  expect(isEmptyString(() => null, false)).toBe(false)
  expect(isEmptyString(() => '1')).toBe(false)
})

test('isArray', () => {
  expect(isArray(undefined)).toBe(false)
  expect(isArray(null)).toBe(false)
  expect(isArray([])).toBe(true)
  expect(isArray([], 0)).toBe(true)
  expect(isArray([], 1)).toBe(false)
  expect(isArray([1, 2], 1)).toBe(true)
  expect(isArray(['a', 'b'], 'd')).toBe(false)
  expect(isArray(['a', 'b'], 'a')).toBe(true)
  expect(isArray(['a', 'b'], 'a')).toBe(true)
  expect(isArray(['a', 'b'], 'b')).toBe(true)
})

test('hasData', () => {
  expect(hasData(undefined)).toBe(false)
  expect(hasData(null)).toBe(false)
  expect(hasData('')).toBe(false)
  expect(hasData([])).toBe(false)
  expect(hasData({})).toBe(false)

  expect(hasData(['a'], 0)).toBe(true)
  expect(hasData(['a'], 1)).toBe(true)
  expect(hasData(['a'], 2)).toBe(false)

  const myfunc = () => ['a']
  expect(hasData(myfunc, 1)).toBe(true)
  expect(hasData(myfunc, 2)).toBe(false)

  expect(hasData(23456, 23457)).toBe(false)
  expect(
    hasData(() => {
      throw new Error('test error')
    }, 1)
  ).toBe(false)
})

test('getPercentChangeString', () => {
  expect(getPercentChangeString(0, 0)).toBe('0.00%')
  expect(getPercentChangeString(100, 200)).toBe('+100.00%')
  expect(getPercentChangeString(100, 200, false, -1)).toBe('+100')
  expect(getPercentChangeString(100, 200, false, 0)).toBe('+100')
  expect(getPercentChangeString(100, 200, true, 0)).toBe('+100%')
  expect(getPercentChangeString(100, 200, true, 2)).toBe('+100.00%')
})

test('getPercentChange', () => {
  expect(getPercentChange(0, 0)).toBe(0)
  expect(getPercentChange(0, 50)).toBe(5000)
  expect(getPercentChange(50, 0)).toBe(-5000)
  expect(getPercentChange(100, 200)).toBe(100)
  expect(getPercentChange(200, 100)).toBe(-50)
})

test('getObjectValue', () => {
  expect(getObjectValue({ a: 'a' }, 'a')).toBe('a')
  expect(getObjectValue({ a: 'a' }, 'b')).toBeUndefined()
})

test('getNumberString', () => {
  expect(getNumberString(0)).toBe('0')
  expect(getNumberString('1,249')).toBe('1,249')

  expect(getNumberString('1,249', 2)).toBe('1,249.00')
  expect(getNumberString('1,249.999', 2)).toBe('1,250.00')
  expect(getNumberString('1,249.9', 2)).toBe('1,249.90')

  expect(getNumberString('38,459,238,231,249.999', 2)).toBe(
    '38,459,238,231,250.00'
  )
})

test('getNumberFormatted', () => {
  expect(getNumberFormatted(0)).toBe(0)

  expect(getNumberFormatted('1,249', 2)).toBe(1249)
  expect(getNumberFormatted('1,249.999', 2)).toBe(1250)
  expect(getNumberFormatted('1,249.9', 2)).toBe(1249.9)
  expect(getNumberFormatted(1249.9, 2)).toBe(1249.9)
  expect(getNumberFormatted(undefined, 2)).toBe(0)
})

test('getMantissa', () => {
  expect(getMantissa(0)).toBe(0)
  expect(getMantissa(1000)).toBe(0)
  expect(getMantissa(0.1)).toBe(1)
  expect(getMantissa(-4234.99)).toBe(99)
  expect(getMantissa(34.012)).toBe(12)

  expect(getMantissa(34)).toBe(0)
})

test('getBoolean', () => {
  expect(getBoolean(undefined)).toBe(false)
  expect(getBoolean(null)).toBe(false)
  expect(getBoolean(false)).toBe(false)
  expect(getBoolean(0)).toBe(false)
  expect(getBoolean('')).toBe(false)
  expect(getBoolean([])).toBe(false)

  expect(getBoolean('FALSE')).toBe(false)
  expect(getBoolean('f')).toBe(false)
  expect(getBoolean('no')).toBe(false)
  expect(getBoolean('0')).toBe(false)

  expect(getBoolean(true)).toBe(true)
  expect(getBoolean(1)).toBe(true)
  expect(getBoolean('1')).toBe(true)
  expect(getBoolean('true')).toBe(true)
  expect(getBoolean('hello')).toBe(true)
})

test('getCommaUpperList', () => {
  expect(getCommaUpperList('')).toBe('')
  expect(getCommaUpperList('a,b,c')).toBe('A,B,C')
  expect(getCommaUpperList(['a', 'b', 'c'])).toBe('A,B,C')
  expect(getCommaUpperList('a ,   b,c   ')).toBe('A ,   B,C')
})

test('getBody', () => {
  expect(() => getBody('')).toThrow('Object body not found')
  expect(
    getBody({
      body: 'test',
    })
  ).toBe('test')
})

test('deepCloneJson', () => {
  expect(deepCloneJson({ a: 'a' })).toStrictEqual({ a: 'a' })
})

test('addObjectToList', () => {
  expect(addObjectToList([], [{ a: 'a' }])).toStrictEqual([{ a: 'a' }])
  expect(addObjectToList([], [1, 2])).toStrictEqual([1, 2])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(addObjectToList(null as any, [1, 2])).toStrictEqual([1, 2])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(addObjectToList(undefined as any, [1, 2])).toStrictEqual([1, 2])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(addObjectToList([], undefined as any)).toStrictEqual([])
})

describe('deepDiffMapper', () => {
  test('compareValues', () => {
    const anum = 1
    const bnum = 1

    const astr = 'a'
    const bstr = 'a'

    const aDate = new Date()
    const bDate = new Date(aDate)

    let a: Record<string, unknown> = { a: 'a' }
    let b: Record<string, unknown> = { b: 'b' }

    expect(deepDiffMapper().anyChanges(a, b)).toBe(true)
    expect(deepDiffMapper().compareValues(a, b)).toStrictEqual('updated')

    expect(deepDiffMapper().compareValues(anum, bnum)).toStrictEqual(
      'unchanged'
    )
    expect(deepDiffMapper().compareValues(anum, bnum + 1)).toStrictEqual(
      'updated'
    )

    expect(deepDiffMapper().compareValues(astr, bstr)).toStrictEqual(
      'unchanged'
    )
    expect(deepDiffMapper().compareValues(astr, bstr + 'a')).toStrictEqual(
      'updated'
    )

    expect(deepDiffMapper().compareValues(aDate, bDate)).toStrictEqual(
      'unchanged'
    )
    expect(
      deepDiffMapper().compareValues(aDate, new Date(+bDate + 1))
    ).toStrictEqual('updated')

    a = { a: 'a', b: 'b' }
    b = { a: 'a', b: 'b' }
    expect(deepDiffMapper().compareValues(a, b)).toStrictEqual('updated')
  })

  test('arrays', () => {
    const a = [
      { name: 'climate', value: 90 },
      { name: 'freeSpeech', value: 80 },
      { name: 'religion', value: 81 },
    ]
    const b = [
      { name: 'climate', value: 90 },
      { name: 'freeSpeech', value: 80 },
      { name: 'religion', value: 82 },
    ]

    expect(deepDiffMapper().anyChanges(a, b)).toBe(true)

    const c = [
      {
        a: { name: 'climate', value: 90 },
        b: { name: 'freeSpeech', value: 80 },
        c: { name: 'religion', value: 81 },
      },
    ]

    const d = [
      {
        a: { name: 'climate', value: 90 },
        b: { name: 'freeSpeech', value: 80 },
        c: { name: 'religion', value: 83 },
      },
    ]

    expect(deepDiffMapper().anyChanges(c, d)).toBe(true)
  })

  test('findTypeData', () => {
    let b: Record<string, unknown> = { b: 'b' }

    expect(deepDiffMapper().findTypeData(['a', 'a'])).toBe(false)

    expect(deepDiffMapper().findTypeData(['a', b])).toStrictEqual(false)

    b = {
      type: 'not-unchanged',
      data: 'a',
    }
    expect(deepDiffMapper().findTypeData(['a', b])).toStrictEqual(true)

    b = {
      type: 'unchanged',
      data: 'a',
    }
    expect(deepDiffMapper().findTypeData(['a', b])).toStrictEqual(false)

    const ddm = deepDiffMapper()
    expect(ddm.findTypeData(['a', ddm])).toStrictEqual(false)

    expect(
      ddm.findTypeData(['a', { type: 'changed', data: 'a' }])
    ).toStrictEqual(true)
  })

  test('getChanges', () => {
    const anum = 1
    const bnum = 1

    const astr = 'a'
    const bstr = 'a'

    const aDate = new Date()
    const bDate = new Date(aDate)

    const a: Record<string, unknown> = { a: 'a' }
    const b: Record<string, unknown> = { b: 'b' }

    expect(deepDiffMapper().getChanges(anum, bnum)).toBe(false)
    expect(deepDiffMapper().getChanges(anum, bnum + 1)).toBe(true)

    expect(deepDiffMapper().getChanges(astr, bstr)).toBe(false)
    expect(deepDiffMapper().getChanges(astr, bstr + 'a')).toBe(true)

    expect(deepDiffMapper().getChanges(aDate, bDate)).toBe(false)
    expect(deepDiffMapper().getChanges(aDate, new Date(+bDate + 1))).toBe(true)

    expect(deepDiffMapper().getChanges(a, b)).toStrictEqual([
      'a',
      { data: 'a', type: 'deleted' },
    ])
  })

  test('various tests', () => {
    let a: Record<string, unknown> = { a: 'a' }
    let b: Record<string, unknown> = { b: 'b' }

    expect(deepDiffMapper().anyChanges(a, b)).toBe(true)

    b = { a: 'a' }
    expect(deepDiffMapper().anyChanges(a, b)).toBe(false)

    a = { a: 'a', b: 'b' }
    b = { a: 'a', b: 'b' }
    expect(deepDiffMapper().anyChanges(a, b)).toBe(false)

    expect(deepDiffMapper().anyChanges([a, 1, 2], [a, 1, 2])).toBe(false)
    expect(deepDiffMapper().anyChanges([a, 1, 2], [b, 1, 2, ''])).toBe(true)

    expect(deepDiffMapper().getChanges(a, b)).toBeUndefined()

    b = { a: 'a', b: 'c' }
    expect(deepDiffMapper().getChanges(a, b)).toStrictEqual([
      'b',
      { data: 'b', type: 'updated' },
    ])

    b = {}
    expect(deepDiffMapper().getChanges(a, b)).toStrictEqual([
      'a',
      { data: 'a', type: 'deleted' },
    ])

    a = { a: 'a' }
    b = { a: 'a', b: 'b' }
    expect(deepDiffMapper().getChanges(a, b)).toStrictEqual([
      'b',
      { data: 'b', type: 'created' },
    ])

    a = { a: 'a' }
    b = { a: 'a' }
    expect(deepDiffMapper().getChanges(a, b)).toBeUndefined()

    a = { a: 'a' }
    b = { a: 'a' }
    expect(() => deepDiffMapper().getChanges(() => a, b)).toThrow(
      'Invalid argument. Function given, object expected.'
    )

    a = { a: () => 'a' }
    b = { a: 'a' }
    const ddMap = deepDiffMapper().map(a, b)
    expect(ddMap).toStrictEqual({ a: { type: 'created', data: 'a' } })
  })
})

test('isDateObject', () => {
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
