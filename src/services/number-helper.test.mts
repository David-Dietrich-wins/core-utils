import {
  getAsNumber,
  getAsNumberOrUndefined,
  getMantissa,
  isNumber,
  isNumeric,
  NumberHelper,
  setMaxDecimalPlaces,
} from './number-helper.mjs'

test('addNumbers', () => {
  const io = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: 'b' }

  const objRet = NumberHelper.AddNumbers(io, {
    a: 3,
    b: 4,
    c: '5',
    d: '6',
    e: 'c',
    f: 'd',
  })
  expect(objRet).toEqual({ a: 5, b: 7, c: 9, d: 11, e: 'a', f: 'b' })

  const io2 = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: { a: 2 } }
  const objret2 = NumberHelper.AddNumbers(io2, {
    a: 3,
    b: 4,
    c: '5',
    d: '6',
    e: 'c',
    f: { a: 2 },
  })
  expect(objret2).toEqual({ a: 5, b: 7, c: 9, d: 11, e: 'a', f: { a: 2 } })

  const io3 = { a: [2], b: 3, c: '4', d: '5', e: 'a', f: { a: 2 } }
  const objret3 = NumberHelper.AddNumbers(io3, {
    a: [3],
    b: 4,
    c: '5',
    d: '6',
    e: 'c',
    f: { a: 2 },
  })
  expect(objret3).toEqual({ a: [2], b: 7, c: 9, d: 11, e: 'a', f: { a: 2 } })

  const io4 = { a: 2, b: 3, c: '4', d: ['5'], e: ['e'], f: { a: 2 } }
  const objret4 = NumberHelper.AddNumbers(io4, {
    a: [3],
    b: 4,
    c: [9],
    d: '6',
    e: ['c'],
    f: { a: 2 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
  expect(objret4).toEqual({ a: 2, b: 7, c: 4, d: 6, e: ['e'], f: { a: 2 } })
})

test('divideByNumbers', () => {
  const io = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: 'b' }

  const objRet = NumberHelper.DivideByNumbers(io, 2)

  expect(objRet).toEqual({ a: 1, b: 1.5, c: 2, d: 2.5, e: 'a', f: 'b' })
})

describe('maxDecimalPlaces', () => {
  test('good', () => {
    expect(setMaxDecimalPlaces(2.12, 2)).toEqual('2.00')
    expect(setMaxDecimalPlaces(34.9912, 2)).toEqual('35.00')
    expect(setMaxDecimalPlaces(234.499999912, 2)).toEqual('234.00')
    expect(setMaxDecimalPlaces(234.5000001, 2)).toEqual('235.00')
  })

  test('good obj', () => {
    const io = {
      a: 2.123456,
      b: 3.123456,
      c: '4.123456',
    }

    expect(setMaxDecimalPlaces(io, 2)).toEqual({
      a: '2.00',
      b: '3.00',
      c: '4.00',
    })
  })

  test('array', () => {
    expect(setMaxDecimalPlaces([2.12], 2)).toEqual(['2.00'])
  })

  test('string', () => {
    expect(setMaxDecimalPlaces('2.12', 2)).toEqual('2.00')
  })

  test('exception', () => {
    try {
      expect(setMaxDecimalPlaces(2.12, undefined)).toBe('2.00')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setMaxDecimalPlaces(2.12, null as any)
    } catch (e) {
      expect(e).toEqual(new Error('Invalid number of decimal places.'))
    }

    expect.assertions(2)
  })
})
describe('Number formatting', () => {
  test('String from a number with commas added', () => {
    const num = 123456789
    const str = NumberHelper.NumberToString(num)

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
test('getNumberString', () => {
  expect(NumberHelper.NumberToString(0)).toBe('0')
  expect(NumberHelper.NumberToString('1,249')).toBe('1,249')

  expect(NumberHelper.NumberToString('1,249', true, 2)).toBe('1,249.00')
  expect(NumberHelper.NumberToString('1,249.999', true, 2)).toBe('1,250.00')
  expect(NumberHelper.NumberToString('1,249.9', true, 2)).toBe('1,249.90')

  expect(NumberHelper.NumberToString('38,459,238,231,249.999', true, 2)).toBe(
    '38,459,238,231,250.00'
  )
})
test('getNumberFormatted', () => {
  expect(NumberHelper.getNumberFormatted(0)).toBe(0)

  expect(NumberHelper.getNumberFormatted('1,249', true, 2)).toBe(1249)
  expect(NumberHelper.getNumberFormatted('1,249.999', true, 2)).toBe(1250)
  expect(NumberHelper.getNumberFormatted('1,249.9', true, 2)).toBe(1249.9)
  expect(NumberHelper.getNumberFormatted(1249.9, true, 2)).toBe(1249.9)
  expect(NumberHelper.getNumberFormatted(undefined, true, 2)).toBe(0)
})
test('getMantissa', () => {
  expect(getMantissa(0)).toBe(0)
  expect(getMantissa(1000)).toBe(0)
  expect(getMantissa(0.1)).toBe(1)
  expect(getMantissa(-4234.99)).toBe(99)
  expect(getMantissa(34.012)).toBe(12)

  expect(getMantissa(34)).toBe(0)
})
