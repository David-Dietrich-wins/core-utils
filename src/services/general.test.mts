/* eslint-disable quotes */
import {
  getBoolean,
  getBooleanUndefined,
  getPercentChange,
  getPercentChangeString,
  hasData,
  isSymbol,
  newGuid,
  sortFunction,
  toHex,
  urlJoin,
} from './general.mjs'
import { getBody } from './object-helper.mjs'

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
  test('number', () => {
    expect(urlJoin(baseUrl, 5, true)).toBe(`${baseUrl}/5/`)
  })
  test('exception', () => {
    expect(() => urlJoin(baseUrl, [undefined], true)).toThrow()
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

test('newGuid', () => {
  const newg = newGuid()

  expect(newg.length).toBe(36)
})

test('hasData', () => {
  expect(hasData(undefined)).toBe(false)
  expect(hasData(null)).toBe(false)
  expect(hasData('')).toBe(false)
  expect(hasData('a')).toBe(true)
  expect(hasData('a', 0)).toBe(false)
  expect(hasData([])).toBe(false)
  expect(hasData([], 0)).toBe(false)
  expect(hasData([], -1)).toBe(false)
  expect(hasData([1], -1)).toBe(false) // Must be greater than 0
  expect(hasData({})).toBe(false)
  expect(hasData({}, undefined)).toBe(false)
  expect(hasData({}, null as unknown as number)).toBe(false)
  expect(hasData({ a: -1 }, -1)).toBe(false)
  expect(hasData({ a: -1 }, 0)).toBe(false)
  expect(hasData({ a: -1 }, 1)).toBe(true)
  expect(hasData({ a: -1 }, 2)).toBe(false)
  expect(hasData(0)).toBe(false)
  expect(hasData(-1)).toBe(false)
  expect(hasData(-10, -20)).toBe(true)
  expect(hasData(1)).toBe(true)

  expect(hasData(['a'], -1)).toBe(false)
  expect(hasData(['a'], 0)).toBe(false)
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

  expect(hasData(new Date(), 0)).toBe(true)
  expect(hasData(new Date(), 1)).toBe(true)
  expect(hasData(new Date(), -1)).toBe(true)

  const sym = Symbol('test')
  expect(hasData(sym, 0)).toBe(false)
  expect(hasData(sym, 1)).toBe(true)
  expect(hasData(sym, 2)).toBe(false)
  const symbol1 = Symbol('description')
  expect(hasData(symbol1)).toBe(true)
  expect(hasData({ [symbol1]: 'abc' })).toBe(false) // Symbols do not contain values for JSON serialization
  expect(hasData({ symbol1: 'abc' })).toBe(true)
  expect(hasData([symbol1])).toBe(true)
  expect(hasData(JSON.stringify({ [symbol1]: 'abc' }))).toBe(true) // Symbols do not contain values for JSON serialization
  expect(hasData(JSON.parse(JSON.stringify({ [symbol1]: 'abc' })))).toBe(false) // Symbols do not contain values for JSON serialization

  const symbolUnique: unique symbol = Symbol()
  expect(hasData(symbolUnique)).toBe(true)
  expect(hasData([symbolUnique])).toBe(true)
  expect(hasData(Symbol('test'))).toBe(true)
  expect(hasData([Symbol('test')])).toBe(true)
  expect(hasData({ [symbolUnique]: 'abc' })).toBe(false) // Unique symbols cannot be serialized
  expect(hasData({ symbolUnique: 'abc' })).toBe(true)
})

test('isSymbol', () => {
  expect(isSymbol(Symbol('test'))).toBe(true)
  expect(isSymbol('test')).toBe(false)
  expect(isSymbol(123)).toBe(false)
  expect(isSymbol({})).toBe(false)
  expect(isSymbol([])).toBe(false)
  expect(isSymbol(undefined)).toBe(false)
  expect(isSymbol(null)).toBe(false)
  expect(isSymbol(new Date())).toBe(false)
  expect(isSymbol(() => {})).toBe(false)
  expect(isSymbol(Symbol.for('test'))).toBe(true)
  expect(isSymbol(Symbol.iterator)).toBe(true)
  expect(isSymbol(Symbol.asyncIterator)).toBe(true)
  expect(isSymbol(Symbol.hasInstance)).toBe(true)
  expect(isSymbol(Symbol.isConcatSpreadable)).toBe(true)
  expect(isSymbol(Symbol.match)).toBe(true)
  expect(isSymbol(Symbol.replace)).toBe(true)
  expect(isSymbol(Symbol.search)).toBe(true)
  expect(isSymbol(Symbol.species)).toBe(true)
  expect(isSymbol(Symbol.split)).toBe(true)
  expect(isSymbol(Symbol.toPrimitive)).toBe(true)
  expect(isSymbol(Symbol.toStringTag)).toBe(true)
  expect(isSymbol(Symbol.unscopables)).toBe(true)
  expect(isSymbol(Symbol.asyncDispose)).toBe(true)
  expect(isSymbol(Symbol.dispose)).toBe(true)
  expect(isSymbol(Symbol.metadata)).toBe(false)
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

test('getBooleanUndefined', () => {
  expect(getBooleanUndefined(undefined)).toBe(undefined)
  expect(getBooleanUndefined(null)).toBe(undefined)
  expect(getBooleanUndefined(false)).toBe(undefined)
  expect(getBooleanUndefined(0)).toBe(undefined)
  expect(getBooleanUndefined('')).toBe(undefined)
  expect(getBooleanUndefined([])).toBe(undefined)

  expect(getBooleanUndefined('FALSE')).toBe(undefined)
  expect(getBooleanUndefined('f')).toBe(undefined)
  expect(getBooleanUndefined('no')).toBe(undefined)
  expect(getBooleanUndefined('0')).toBe(undefined)

  expect(getBooleanUndefined(true)).toBe(true)
  expect(getBooleanUndefined(1)).toBe(true)
  expect(getBooleanUndefined('1')).toBe(true)
  expect(getBooleanUndefined('true')).toBe(true)
  expect(getBooleanUndefined('hello')).toBe(true)
})

test('getBody', () => {
  expect(() => getBody('')).toThrow('Object body not found')
  expect(
    getBody({
      body: 'test',
    })
  ).toBe('test')
})
