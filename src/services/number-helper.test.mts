import {
  DollarFormatter,
  NumberFormatter,
  NumberFormatterNoDecimal,
  NumberHelper,
  PercentFormatter,
  PercentTimes100Formatter,
  StockPriceFormatter,
  StockVolumeFormatter,
  XFormatter,
  elementTopLeftCoords,
  getAsNumber,
  getAsNumberOrUndefined,
  getMantissa,
  isNumber,
  isNumeric,
} from './number-helper.mjs'

test(NumberHelper.AddNumbers.name, () => {
  const io1 = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: 'b' },
    io1ret = NumberHelper.AddNumbers(io1, {
      a: 3,
      b: 4,
      c: '5',
      d: '6',
      e: 'c',
      f: 'd',
    }),
    io2 = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: { a: 2 } },
    io2ret = NumberHelper.AddNumbers(io2, {
      a: 3,
      b: 4,
      c: '5',
      d: '6',
      e: 'c',
      f: { a: 2 },
    }),
    io3 = { a: [2], b: 3, c: '4', d: '5', e: 'a', f: { a: 2 } },
    io3ret = NumberHelper.AddNumbers(io3, {
      a: [3],
      b: 4,
      c: '5',
      d: '6',
      e: 'c',
      f: { a: 2 },
    }),
    io4 = { a: 2, b: 3, c: '4', d: ['5'], e: ['e'], f: { a: 2 } },
    io4ret = NumberHelper.AddNumbers(io4, {
      a: [3],
      b: 4,
      c: [9],
      d: '6',
      e: ['c'],
      f: { a: 2 },
    } as unknown as object)

  expect(io1ret).toEqual({ a: 5, b: 7, c: 9, d: 11, e: 'a', f: 'b' })
  expect(io2ret).toEqual({ a: 5, b: 7, c: 9, d: 11, e: 'a', f: { a: 2 } })
  expect(io3ret).toEqual({ a: [2], b: 7, c: 9, d: 11, e: 'a', f: { a: 2 } })
  expect(io4ret).toEqual({ a: 2, b: 7, c: 4, d: 6, e: ['e'], f: { a: 2 } })
})

test(NumberHelper.DivideByNumbers.name, () => {
  const io = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: 'b' },
    objRet = NumberHelper.DivideByNumbers(io, 2)

  expect(objRet).toEqual({ a: 1, b: 1.5, c: 2, d: 2.5, e: 'a', f: 'b' })
})

describe('Number formatting', () => {
  test('String from a number with commas added', () => {
    const num = 123456789,
      str = NumberHelper.NumberToString(num)

    expect(str).toBe('123,456,789')
  })

  test('Number from string with commas', () => {
    const num = '123,456,789',
      str = getAsNumberOrUndefined(num)

    expect(str).toBe(123456789)
  })

  test(getAsNumber.name, () => {
    const num = '123,456,789',
      str = getAsNumber(num)

    expect(str).toBe(123456789)
  })
})

test(isNumeric.name, () => {
  expect(isNumeric()).toBe(false)
  expect(isNumeric(1)).toBe(true)
  expect(isNumeric('1')).toBe(true)
  expect(isNumeric('1.11')).toBe(true)
  expect(isNumeric('1.11.1')).toBe(false)
  expect(isNumeric('12q')).toBe(false)
  expect(isNumeric('a2q')).toBe(false)
})
test(isNumber.name, () => {
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
test(NumberHelper.NumberToString.name, () => {
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
test(NumberHelper.getNumberFormatted.name, () => {
  expect(NumberHelper.getNumberFormatted(0)).toBe(0)

  expect(NumberHelper.getNumberFormatted(',', true, 2)).toBe(0)
  expect(NumberHelper.getNumberFormatted('1,249', true, 2)).toBe(1249)
  expect(NumberHelper.getNumberFormatted('1,249.999', true, 2)).toBe(1250)
  expect(NumberHelper.getNumberFormatted('1,249.9', true, 2)).toBe(1249.9)
  expect(NumberHelper.getNumberFormatted(1249.9, true, 2)).toBe(1249.9)
  expect(NumberHelper.getNumberFormatted(undefined, true, 2)).toBe(0)
})

test(getMantissa.name, () => {
  expect(getMantissa(0)).toBe(0)
  expect(getMantissa(1000)).toBe(0)
  expect(getMantissa(0.1)).toBe(1)
  expect(getMantissa(-4234.99)).toBe(99)
  expect(getMantissa(34.012)).toBe(12)

  expect(getMantissa(34)).toBe(0)
})

test(NumberHelper.toFixedPrefixed.name, () => {
  expect(NumberHelper.toFixedPrefixed('')).toBe('$0.00')
  expect(NumberHelper.toFixedPrefixed(undefined)).toBe('')
  expect(NumberHelper.toFixedPrefixed(null)).toBe('')
  expect(NumberHelper.toFixedPrefixed('', true, 2)).toBe('$0.00')
  expect(NumberHelper.toFixedPrefixed(2.4, true, 2, '€')).toBe('€2.40')
  expect(NumberHelper.toFixedPrefixed('', false, 2)).toBe('')
  expect(NumberHelper.toFixedPrefixed(0, true, 2)).toBe('$0.00')
  expect(NumberHelper.toFixedPrefixed(1, true, 2)).toBe('$1.00')
  expect(NumberHelper.toFixedPrefixed(1.1, true, 2)).toBe('$1.10')
  expect(NumberHelper.toFixedPrefixed(1.11, true, 2)).toBe('$1.11')
  expect(NumberHelper.toFixedPrefixed(1.111, true, 2)).toBe('$1.11')
})

test(NumberHelper.toFixedSuffixed.name, () => {
  expect(NumberHelper.toFixedSuffixed('', true, 2)).toBe('0.00%')
  expect(NumberHelper.toFixedSuffixed('', false, 2)).toBe('')
  expect(NumberHelper.toFixedSuffixed(undefined)).toBe('')
  expect(NumberHelper.toFixedSuffixed(null)).toBe('')
  expect(NumberHelper.toFixedSuffixed('', true, 2)).toBe('0.00%')
  expect(NumberHelper.toFixedSuffixed(2.4, true, 2, '€')).toBe('2.40€')
  expect(NumberHelper.toFixedSuffixed(0, true, 2)).toBe('0.00%')
  expect(NumberHelper.toFixedSuffixed(1, true, 2)).toBe('1.00%')
  expect(NumberHelper.toFixedSuffixed(1.1, true, 2)).toBe('1.10%')
  expect(NumberHelper.toFixedSuffixed(1.11, true, 2)).toBe('1.11%')
  expect(NumberHelper.toFixedSuffixed(1.111, true, 2)).toBe('1.11%')
})

test(NumberHelper.FormatPrefixSuffixZero.name, () => {
  expect(NumberHelper.FormatPrefixSuffixZero(null)).toBe('')
  expect(NumberHelper.FormatPrefixSuffixZero(undefined)).toBe('')
  expect(NumberHelper.FormatPrefixSuffixZero('')).toBe('0.00')
  expect(NumberHelper.FormatPrefixSuffixZero('', false)).toBe('')
  expect(NumberHelper.FormatPrefixSuffixZero(0)).toBe('0.00')
  expect(NumberHelper.FormatPrefixSuffixZero(0, true, 0)).toBe('0')
  expect(NumberHelper.FormatPrefixSuffixZero(1)).toBe('1.00')
  expect(NumberHelper.FormatPrefixSuffixZero(1.1)).toBe('1.10')
  expect(NumberHelper.FormatPrefixSuffixZero(1.11)).toBe('1.11')
  expect(NumberHelper.FormatPrefixSuffixZero(1.111)).toBe('1.11')
  expect(NumberHelper.FormatPrefixSuffixZero(1000)).toBe('1,000.00')
  expect(NumberHelper.FormatPrefixSuffixZero('1000')).toBe('1,000.00')
  expect(NumberHelper.FormatPrefixSuffixZero(1000.1)).toBe('1,000.10')
  expect(NumberHelper.FormatPrefixSuffixZero(1000000.1, false, 3)).toBe(
    '1,000,000.100'
  )
  expect(
    NumberHelper.FormatPrefixSuffixZero(
      1000000.1,
      false,
      3,
      'prefix-',
      '-suffix'
    )
  ).toBe('prefix-1,000,000.100-suffix')
})

test(NumberFormatter.name, () => {
  expect(NumberFormatter(null)).toBe('')
  expect(NumberFormatter(undefined)).toBe('')
  expect(NumberFormatter('')).toBe('0.00')
  expect(NumberFormatter('', false)).toBe('')
  expect(NumberFormatter(0)).toBe('0.00')
  expect(NumberFormatter(0, true, 0)).toBe('0')
  expect(NumberFormatter(0, false, 0)).toBe('')
  expect(NumberFormatter(',', false, 0)).toBe('')
  expect(NumberFormatter(',', true, 0)).toBe('')
  expect(NumberFormatter(',##,44', true, 0)).toBe('')
  expect(NumberFormatter(',##,44', false, 0)).toBe('')
  expect(NumberFormatter('88,##,44', true, 0)).toBe('88')
  expect(NumberFormatter('88,##,44', false, 0)).toBe('88')
  expect(NumberFormatter('00,##,44', false, 0)).toBe('')
  expect(NumberFormatter('0,##,44', false, 0)).toBe('')
  expect(NumberFormatter(1)).toBe('1.00')
  expect(NumberFormatter(1.1)).toBe('1.10')
  expect(NumberFormatter(1.11)).toBe('1.11')
  expect(NumberFormatter(1.111)).toBe('1.11')
  expect(NumberFormatter(1000)).toBe('1,000.00')
  expect(NumberFormatter('1000', false, 3)).toBe('1,000.000')
  expect(NumberFormatter(1000.1)).toBe('1,000.10')
  expect(NumberFormatter(1000000.1, false, 3)).toBe('1,000,000.100')
})

test(NumberFormatterNoDecimal.name, () => {
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

test(XFormatter.name, () => {
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

test(DollarFormatter.name, () => {
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

test(StockPriceFormatter.name, () => {
  expect(StockPriceFormatter(null)).toBeUndefined()
  expect(StockPriceFormatter(undefined)).toBeUndefined()
  expect(StockPriceFormatter(null, true)).toBe('$0.0000')
  expect(StockPriceFormatter(undefined, true)).toBe('$0.0000')
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

test(PercentFormatter.name, () => {
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

test(PercentTimes100Formatter.name, () => {
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

test(StockVolumeFormatter.name, () => {
  expect(StockVolumeFormatter(null)).toBeUndefined()
  expect(StockVolumeFormatter(undefined)).toBeUndefined()
  expect(StockVolumeFormatter(null, true)).toBe('0')
  expect(StockVolumeFormatter(undefined, false, 2)).toBeUndefined()
  expect(StockVolumeFormatter(undefined, true)).toBe('0')
  expect(StockVolumeFormatter(undefined, true, null as unknown as number)).toBe(
    '0'
  )
  expect(StockVolumeFormatter(undefined, true, 3)).toBe('0.000')
  expect(StockVolumeFormatter('')).toBeUndefined()
  expect(StockVolumeFormatter('', false)).toBeUndefined()
  expect(StockVolumeFormatter(0)).toBeUndefined()
  expect(StockVolumeFormatter(undefined, true)).toBe('0')
  expect(StockVolumeFormatter('', true)).toBe('0')
  expect(StockVolumeFormatter(0, true)).toBe('0')
  expect(StockVolumeFormatter(5, true)).toBe('5')
  expect(StockVolumeFormatter(1)).toBe('1')
  expect(StockVolumeFormatter(1.1)).toBe('1')
  expect(StockVolumeFormatter(1.11)).toBe('1')
  expect(StockVolumeFormatter(1.111)).toBe('1')
  expect(StockVolumeFormatter(1000)).toBe('1,000')
  expect(StockVolumeFormatter('1000', false, 3)).toBe('1,000.000')
  expect(StockVolumeFormatter(1000.1)).toBe('1,000')
  expect(StockVolumeFormatter(1000000.1, false, 3)).toBe('1,000,000.100')

  expect(StockVolumeFormatter(0, true)).toBe('0')
  expect(StockVolumeFormatter(0, false)).toBeUndefined()
  expect(StockVolumeFormatter(',,')).toBeUndefined()
  expect(StockVolumeFormatter(',,', true, 0)).toBe('')
  expect(StockVolumeFormatter('0.00', false, 0)).toBeUndefined()
  expect(StockVolumeFormatter('0.0', false, 0)).toBeUndefined()
  expect(StockVolumeFormatter('0.', false, 0)).toBeUndefined()
  expect(StockVolumeFormatter('.00', false, 0)).toBeUndefined()
  expect(StockVolumeFormatter('0', false, 2)).toBeUndefined()
  expect(StockVolumeFormatter('1', true)).toBe('1')
  expect(StockVolumeFormatter('1', false)).toBe('1')

  expect(StockVolumeFormatter(0, false, 0)).toBeUndefined()
  expect(StockVolumeFormatter(0, true, 0)).toBe('0')

  expect(StockVolumeFormatter(',,')).toBeUndefined()
  expect(StockVolumeFormatter(',,', true, 0)).toBe('')
})

test(NumberHelper.NumberWithDecimalPlaces.name, () => {
  expect(NumberHelper.NumberWithDecimalPlaces(NaN)).toBe('0')
  expect(NumberHelper.NumberWithDecimalPlaces(0)).toBe('0.00')
  expect(NumberHelper.NumberWithDecimalPlaces(1)).toBe('1.00')
  expect(NumberHelper.NumberWithDecimalPlaces(1.1)).toBe('1.10')
  expect(NumberHelper.NumberWithDecimalPlaces(1.11)).toBe('1.11')
  expect(NumberHelper.NumberWithDecimalPlaces(1.111)).toBe('1.111')
  expect(NumberHelper.NumberWithDecimalPlaces(1000)).toBe('1,000.00')
  expect(NumberHelper.NumberWithDecimalPlaces(1000, 3)).toBe('1,000.00')
  expect(NumberHelper.NumberWithDecimalPlaces(1000.1)).toBe('1,000.10')
  expect(NumberHelper.NumberWithDecimalPlaces(1000000.1, 3)).toBe(
    '1,000,000.10'
  )
})

test(NumberHelper.PriceInDollars.name, () => {
  expect(NumberHelper.PriceInDollars(0)).toBe('$0.00')
  expect(NumberHelper.PriceInDollars(1)).toBe('$1.00')
  expect(NumberHelper.PriceInDollars(9999999, false, 0)).toBe('9,999,999')
  expect(NumberHelper.PriceInDollars(1.1)).toBe('$1.10')
  expect(NumberHelper.PriceInDollars(1.11)).toBe('$1.11')
  expect(NumberHelper.PriceInDollars(1.111)).toBe('$1.111')
  expect(NumberHelper.PriceInDollars(1000)).toBe('$1,000.00')
  expect(NumberHelper.PriceInDollars(1000.1)).toBe('$1,000.10')
  expect(NumberHelper.PriceInDollars(1000000.1, false, 3)).toBe('1,000,000.10')
})

test(NumberHelper.DownUpOrEqual.name, () => {
  expect(NumberHelper.DownUpOrEqual(-10, undefined)).toBe(0)
  expect(NumberHelper.DownUpOrEqual(0, undefined)).toBe(0)
  expect(NumberHelper.DownUpOrEqual(10, undefined)).toBe(0)

  expect(NumberHelper.DownUpOrEqual(0, 0)).toBe(0)
  expect(NumberHelper.DownUpOrEqual(1, 0)).toBe(-1)
  expect(NumberHelper.DownUpOrEqual(0, 1)).toBe(1)
  expect(NumberHelper.DownUpOrEqual(1, 1)).toBe(0)
  expect(NumberHelper.DownUpOrEqual(1.1, 1)).toBe(-1)
  expect(NumberHelper.DownUpOrEqual(1.11, 1)).toBe(-1)

  expect(NumberHelper.DownUpOrEqual(0, 0, true)).toBe(0)
  expect(NumberHelper.DownUpOrEqual(1, 0, true)).toBe(1)
  expect(NumberHelper.DownUpOrEqual(0, 1, true)).toBe(-1)
  expect(NumberHelper.DownUpOrEqual(1, 1, true)).toBe(0)
  expect(NumberHelper.DownUpOrEqual(1.1, 1, true)).toBe(1)
  expect(NumberHelper.DownUpOrEqual(1.11, 1, true)).toBe(1)
})

test(elementTopLeftCoords.name, () => {
  const coords = {
      offsetLeft: 20,
      offsetTop: 10,
    },
    coordsWithParent = {
      offsetLeft: 20,
      offsetParent: {
        offsetLeft: 5,
        offsetTop: 5,
      },
      offsetTop: 10,
    },
    coordsWithoutValues = {
      offsetParent: {
        offsetLeft: 7,
        offsetTop: 5,
      },
    }

  expect(elementTopLeftCoords(coords)).toEqual({
    left: 20,
    top: 10,
  })

  expect(elementTopLeftCoords(coordsWithParent)).toEqual({
    left: 25,
    top: 15,
  })

  expect(elementTopLeftCoords(coordsWithoutValues)).toEqual({
    left: 7,
    top: 5,
  })
})
