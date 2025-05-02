import {
  DollarFormatter,
  formattedNumber,
  getAsNumber,
  getAsNumberOrUndefined,
  getMantissa,
  isNumber,
  isNumeric,
  NumberFormatter,
  NumberFormatterNoDecimal,
  NumberHelper,
  PercentFormatter,
  PercentTimes100Formatter,
  setMaxDecimalPlaces,
  StockPriceFormatter,
  StockVolumeFormatter,
  toFixedPrefixed,
  toFixedSuffixed,
  XFormatter,
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
  expect(NumberHelper.NumberToString(0, false)).toBe('')
  expect(NumberHelper.NumberToString(0.0, false)).toBe('')
  expect(NumberHelper.NumberToString('', false)).toBe('')
  expect(NumberHelper.NumberToString('', true)).toBe('0')
  expect(NumberHelper.NumberToString('', true, 2)).toBe('0.00')
  expect(NumberHelper.NumberToString('0', false)).toBe('')
  expect(NumberHelper.NumberToString('0.00', false)).toBe('')
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

test('toFixedPrefixed', () => {
  expect(toFixedPrefixed('', true, 2)).toBe('$0.00')
  expect(toFixedPrefixed('', false, 2)).toBe('')
  expect(toFixedPrefixed(0, true, 2)).toBe('$0.00')
  expect(toFixedPrefixed(1, true, 2)).toBe('$1.00')
  expect(toFixedPrefixed(1.1, true, 2)).toBe('$1.10')
  expect(toFixedPrefixed(1.11, true, 2)).toBe('$1.11')
  expect(toFixedPrefixed(1.111, true, 2)).toBe('$1.11')
})

test('toFixedSuffixed', () => {
  expect(toFixedSuffixed('', true, 2)).toBe('0.00%')
  expect(toFixedSuffixed('', false, 2)).toBe('')
  expect(toFixedSuffixed(0, true, 2)).toBe('0.00%')
  expect(toFixedSuffixed(1, true, 2)).toBe('1.00%')
  expect(toFixedSuffixed(1.1, true, 2)).toBe('1.10%')
  expect(toFixedSuffixed(1.11, true, 2)).toBe('1.11%')
  expect(toFixedSuffixed(1.111, true, 2)).toBe('1.11%')
})

test('formattedNumber', () => {
  expect(formattedNumber(null)).toBe('')
  expect(formattedNumber(undefined)).toBe('')
  expect(formattedNumber('')).toBe('0.00')
  expect(formattedNumber('', false)).toBe('')
  expect(formattedNumber(0)).toBe('0.00')
  expect(formattedNumber(1)).toBe('1.00')
  expect(formattedNumber(1.1)).toBe('1.10')
  expect(formattedNumber(1.11)).toBe('1.11')
  expect(formattedNumber(1.111)).toBe('1.11')
  expect(formattedNumber(1000)).toBe('1,000.00')
  expect(formattedNumber('1000')).toBe('1,000.00')
  expect(formattedNumber(1000.1)).toBe('1,000.10')
  expect(formattedNumber(1000000.1, false, 3)).toBe('1,000,000.100')
  expect(formattedNumber(1000000.1, false, 3, 'prefix-', '-suffix')).toBe(
    'prefix-1,000,000.100-suffix'
  )
})

test('NumberFormatter', () => {
  expect(NumberFormatter(null)).toBe('')
  expect(NumberFormatter(undefined)).toBe('')
  expect(NumberFormatter('')).toBe('0.00')
  expect(NumberFormatter('', false)).toBe('')
  expect(NumberFormatter(0)).toBe('0.00')
  expect(NumberFormatter(1)).toBe('1.00')
  expect(NumberFormatter(1.1)).toBe('1.10')
  expect(NumberFormatter(1.11)).toBe('1.11')
  expect(NumberFormatter(1.111)).toBe('1.11')
  expect(NumberFormatter(1000)).toBe('1,000.00')
  expect(NumberFormatter('1000', false, 3)).toBe('1,000.000')
  expect(NumberFormatter(1000.1)).toBe('1,000.10')
  expect(NumberFormatter(1000000.1, false, 3)).toBe('1,000,000.100')
})

test('NumberFormatterNoDecimal', () => {
  expect(NumberFormatterNoDecimal(null)).toBe('')
  expect(NumberFormatterNoDecimal(undefined)).toBe('')
  expect(NumberFormatterNoDecimal('')).toBe('0')
  expect(NumberFormatterNoDecimal('', false)).toBe('')
  expect(NumberFormatterNoDecimal(0)).toBe('0')
  expect(NumberFormatterNoDecimal(1)).toBe('1')
  expect(NumberFormatterNoDecimal(1.1)).toBe('1')
  expect(NumberFormatterNoDecimal(1.11)).toBe('1')
  expect(NumberFormatterNoDecimal(1.49999999)).toBe('1')
  expect(NumberFormatterNoDecimal(1.5)).toBe('2')
  expect(NumberFormatterNoDecimal(1.999)).toBe('2')
  expect(NumberFormatterNoDecimal(1000)).toBe('1,000')
  expect(NumberFormatterNoDecimal('1000', false)).toBe('1,000')
  expect(NumberFormatterNoDecimal(1000.1)).toBe('1,000')
  expect(NumberFormatterNoDecimal(1000000.5, false)).toBe('1,000,001')
})

test('XFormatter', () => {
  expect(XFormatter(null)).toBe('')
  expect(XFormatter(undefined)).toBe('')
  expect(XFormatter('')).toBe('0.00x')
  expect(XFormatter('', false)).toBe('')
  expect(XFormatter(0)).toBe('0.00x')
  expect(XFormatter(1)).toBe('1.00x')
  expect(XFormatter(9999999, false, 0)).toBe('9,999,999x')
  expect(XFormatter(1.1)).toBe('1.10x')
  expect(XFormatter(1.11)).toBe('1.11x')
  expect(XFormatter(1.111)).toBe('1.11x')
  expect(XFormatter(1000)).toBe('1,000.00x')
  expect(XFormatter('1000', false, 3)).toBe('1,000.000x')
  expect(XFormatter(1000.1)).toBe('1,000.10x')
  expect(XFormatter(1000000.1, false, 3)).toBe('1,000,000.100x')
})

test('DollarFormatter', () => {
  expect(DollarFormatter(null)).toBe('')
  expect(DollarFormatter(undefined)).toBe('$0.00')
  expect(DollarFormatter('')).toBe('$0.00')
  expect(DollarFormatter('', false)).toBe('')
  expect(DollarFormatter(0)).toBe('$0.00')
  expect(DollarFormatter(1)).toBe('$1.00')
  expect(DollarFormatter(9999999, false, 0)).toBe('$9,999,999')
  expect(DollarFormatter(1.1)).toBe('$1.10')
  expect(DollarFormatter(1.11)).toBe('$1.11')
  expect(DollarFormatter(1.111)).toBe('$1.11')
  expect(DollarFormatter(1000)).toBe('$1,000.00')
  expect(DollarFormatter('1000', false, 3)).toBe('$1,000.000')
  expect(DollarFormatter('1000.000499999', false, 3)).toBe('$1,000.000')
  expect(DollarFormatter('1000.0005', false, 3)).toBe('$1,000.001')
  expect(DollarFormatter(1000.1)).toBe('$1,000.10')
  expect(DollarFormatter(1000000.1, false, 3)).toBe('$1,000,000.100')
})

test('StockPriceFormatter', () => {
  expect(StockPriceFormatter(null)).toBeUndefined()
  expect(StockPriceFormatter(undefined)).toBeUndefined()
  expect(StockPriceFormatter('')).toBeUndefined()
  expect(StockPriceFormatter('', false)).toBeUndefined()
  expect(StockPriceFormatter(0)).toBeUndefined()
  expect(StockPriceFormatter(0, true)).toBe('$0.0000')
  expect(StockPriceFormatter(1)).toBe('$1.00')
  expect(StockPriceFormatter(9999999, false, 0)).toBe('$9,999,999')
  expect(StockPriceFormatter(1.1)).toBe('$1.10')
  expect(StockPriceFormatter(1.11)).toBe('$1.11')
  expect(StockPriceFormatter(1.111)).toBe('$1.11')
  expect(StockPriceFormatter(1000)).toBe('$1,000.00')
  expect(StockPriceFormatter('1000', false, 3)).toBe('$1,000.000')
  expect(StockPriceFormatter('1000.000499999', false, 3)).toBe('$1,000.000')
  expect(StockPriceFormatter('1000.0005', false, 3)).toBe('$1,000.001')
  expect(StockPriceFormatter(1000.1)).toBe('$1,000.10')
  expect(StockPriceFormatter(1000000.1, false, 3)).toBe('$1,000,000.100')
})

test('PercentFormatter', () => {
  expect(PercentFormatter(null)).toBe('')
  expect(PercentFormatter(undefined)).toBe('')
  expect(PercentFormatter('')).toBe('')
  expect(PercentFormatter('', false)).toBe('')
  expect(PercentFormatter(0)).toBe('')
  expect(PercentFormatter(0, true)).toBe('0.00%')
  expect(PercentFormatter(1)).toBe('1.00%')
  expect(PercentFormatter(9999999, false, 0)).toBe('9,999,999%')
  expect(PercentFormatter(1.1)).toBe('1.10%')
  expect(PercentFormatter(1.11)).toBe('1.11%')
  expect(PercentFormatter(1.111)).toBe('1.11%')
  expect(PercentFormatter(1000)).toBe('1,000.00%')
  expect(PercentFormatter('1000', false, 3)).toBe('1,000.000%')
  expect(PercentFormatter(1000.1)).toBe('1,000.10%')
  expect(PercentFormatter(1000000.1, false, 3)).toBe('1,000,000.100%')
})

test('PercentTimes100Formatter', () => {
  expect(PercentTimes100Formatter(null)).toBe('')
  expect(PercentTimes100Formatter(undefined)).toBe('')
  expect(PercentTimes100Formatter('')).toBe('')
  expect(PercentTimes100Formatter('', false)).toBe('')
  expect(PercentTimes100Formatter(0)).toBe('')
  expect(PercentTimes100Formatter(0, true)).toBe('0.00%')
  expect(PercentTimes100Formatter(0.24)).toBe('24.00%')
  expect(PercentTimes100Formatter(0.9999999, false, 0)).toBe('100%')
  expect(PercentTimes100Formatter(0.11)).toBe('11.00%')
  expect(PercentTimes100Formatter(0.1149)).toBe('11.49%')
  expect(PercentTimes100Formatter(0.115)).toBe('11.50%')
  expect(PercentTimes100Formatter(0.11111)).toBe('11.11%')
  expect(PercentTimes100Formatter(1000)).toBe('100,000.00%')
  expect(PercentTimes100Formatter('1000', false, 3)).toBe('100,000.000%')
  expect(PercentTimes100Formatter(1000.1)).toBe('100,010.00%')
  expect(PercentTimes100Formatter(1000000.1, false, 3)).toBe('100,000,010.000%')
})

test('StockVolumeFormatter', () => {
  expect(StockVolumeFormatter(null)).toBeUndefined()
  expect(StockVolumeFormatter(undefined)).toBeUndefined()
  expect(StockVolumeFormatter('')).toBeUndefined()
  expect(StockVolumeFormatter('', false)).toBeUndefined()
  expect(StockVolumeFormatter(0)).toBeUndefined()
  expect(StockVolumeFormatter(0, true)).toBe('0')
  expect(StockVolumeFormatter(1)).toBe('1')
  expect(StockVolumeFormatter(1.1)).toBe('1')
  expect(StockVolumeFormatter(1.11)).toBe('1')
  expect(StockVolumeFormatter(1.111)).toBe('1')
  expect(StockVolumeFormatter(1000)).toBe('1,000')
  expect(StockVolumeFormatter('1000', false, 3)).toBe('1,000.000')
  expect(StockVolumeFormatter(1000.1)).toBe('1,000')
  expect(StockVolumeFormatter(1000000.1, false, 3)).toBe('1,000,000.100')
})
