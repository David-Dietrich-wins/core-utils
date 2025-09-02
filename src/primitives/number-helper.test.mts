import {
  addNumbers,
  divideByNumbers,
  DollarFormatter,
  DownUpOrEqual,
  FirstNumberInString,
  FormatPrefixSuffixZero,
  NumberFormatter,
  NumberFormatterNoDecimal,
  NumberToString,
  NumberWithDecimalPlaces,
  PercentFormatter,
  PercentTimes100Formatter,
  priceInDollars,
  StockPriceFormatter,
  StockVolumeFormatter,
  XFormatter,
  elementTopLeftCoords,
  getAsNumberOrUndefined,
  getMantissa,
  getNumberFormatted,
  getNumberString,
  getPercentChange,
  getPercentChangeString,
  isNumber,
  isNumeric,
  toFixedPrefixed,
  toFixedSuffixed,
} from './number-helper.mjs'

test(getMantissa.name, () => {
  expect(getMantissa(0)).toBe(0)
  expect(getMantissa(1000)).toBe(0)
  expect(getMantissa(0.1)).toBe(1)
  expect(getMantissa(-4234.99)).toBe(99)
  expect(getMantissa(34.012)).toBe(12)

  expect(getMantissa(34)).toBe(0)
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

test(getNumberString.name, () => {
  expect(getNumberString(0)).toBe('0')
  expect(getNumberString('1,249')).toBe('1,249')

  expect(getNumberString('1,249', 2)).toBe('1,249.00')
  expect(getNumberString('1,249.999', 2)).toBe('1,250.00')
  expect(getNumberString('1,249.9', 2)).toBe('1,249.90')

  expect(getNumberString('38,459,238,231,249.999', 2)).toBe(
    '38,459,238,231,250.00'
  )
})

test(getNumberFormatted.name, () => {
  expect(getNumberFormatted(0)).toBe(0)

  expect(getNumberFormatted('1,249', 2)).toBe(1249)
  expect(getNumberFormatted('1,249.999', 2)).toBe(1250)
  expect(getNumberFormatted('1,249.9', 2)).toBe(1249.9)
  expect(getNumberFormatted(1249.9, 2)).toBe(1249.9)
  expect(getNumberFormatted(undefined, 2)).toBe(0)
  expect(getNumberFormatted(',,', 2)).toBe(0)
})

test(getNumberString.name, () => {
  expect(getNumberString(123456789)).toBe('123,456,789')
  expect(getNumberString('123,456,789')).toBe('123,456,789')
  expect(getNumberString(',,')).toBe('NaN')
})

test(getAsNumberOrUndefined.name, () => {
  expect(getAsNumberOrUndefined('123,456,789')).toBe(123456789)
  expect(getAsNumberOrUndefined(123456789)).toBe(123456789)
  expect(getAsNumberOrUndefined(null)).toBeUndefined()
  expect(getAsNumberOrUndefined(undefined)).toBeUndefined()
  expect(getAsNumberOrUndefined(0)).toBeUndefined()
  expect(getAsNumberOrUndefined('')).toBeUndefined()
})
test(NumberToString.name, () => {
  expect(NumberToString(0)).toBe('0')
  expect(NumberToString(0, false)).toBe('')
  expect(NumberToString(0.0, false)).toBe('')
  expect(NumberToString('', false)).toBe('')
  expect(NumberToString('', true)).toBe('0')
  expect(NumberToString('', true, 2)).toBe('0.00')
  expect(NumberToString('0', false)).toBe('')
  expect(NumberToString('0.00', false)).toBe('')
  expect(NumberToString('1,249')).toBe('1,249')

  expect(NumberToString('1,249', true, 2)).toBe('1,249.00')
  expect(NumberToString('1,249.999', true, 2)).toBe('1,250.00')
  expect(NumberToString('1,249.9', true, 2)).toBe('1,249.90')

  expect(NumberToString('38,459,238,231,249.999', true, 2)).toBe(
    '38,459,238,231,250.00'
  )
})
test(getNumberFormatted.name, () => {
  expect(getNumberFormatted(0)).toBe(0)

  expect(getNumberFormatted(',', 2)).toBe(0)
  expect(getNumberFormatted('1,249', 2)).toBe(1249)
  expect(getNumberFormatted('1,249.999', 2)).toBe(1250)
  expect(getNumberFormatted('1,249.9', 2)).toBe(1249.9)
  expect(getNumberFormatted(1249.9, 2)).toBe(1249.9)
  expect(getNumberFormatted(undefined, 2)).toBe(0)
})

test(getMantissa.name, () => {
  expect(getMantissa(0)).toBe(0)
  expect(getMantissa(1000)).toBe(0)
  expect(getMantissa(0.1)).toBe(1)
  expect(getMantissa(-4234.99)).toBe(99)
  expect(getMantissa(34.012)).toBe(12)

  expect(getMantissa(34)).toBe(0)
})

test(toFixedPrefixed.name, () => {
  expect(toFixedPrefixed('')).toBe('$0.00')
  expect(toFixedPrefixed(undefined)).toBe('')
  expect(toFixedPrefixed(null)).toBe('')
  expect(toFixedPrefixed('', true, 2)).toBe('$0.00')
  expect(toFixedPrefixed(2.4, true, 2, '€')).toBe('€2.40')
  expect(toFixedPrefixed('', false, 2)).toBe('')
  expect(toFixedPrefixed(0, true, 2)).toBe('$0.00')
  expect(toFixedPrefixed(1, true, 2)).toBe('$1.00')
  expect(toFixedPrefixed(1.1, true, 2)).toBe('$1.10')
  expect(toFixedPrefixed(1.11, true, 2)).toBe('$1.11')
  expect(toFixedPrefixed(1.111, true, 2)).toBe('$1.11')
})

test(toFixedSuffixed.name, () => {
  expect(toFixedSuffixed('', true, 2)).toBe('0.00%')
  expect(toFixedSuffixed('', false, 2)).toBe('')
  expect(toFixedSuffixed(undefined)).toBe('')
  expect(toFixedSuffixed(null)).toBe('')
  expect(toFixedSuffixed('', true, 2)).toBe('0.00%')
  expect(toFixedSuffixed(2.4, true, 2, '€')).toBe('2.40€')
  expect(toFixedSuffixed(0, true, 2)).toBe('0.00%')
  expect(toFixedSuffixed(1, true, 2)).toBe('1.00%')
  expect(toFixedSuffixed(1.1, true, 2)).toBe('1.10%')
  expect(toFixedSuffixed(1.11, true, 2)).toBe('1.11%')
  expect(toFixedSuffixed(1.111, true, 2)).toBe('1.11%')
})

test(FormatPrefixSuffixZero.name, () => {
  expect(FormatPrefixSuffixZero(null)).toBe('')
  expect(FormatPrefixSuffixZero(undefined)).toBe('')
  expect(FormatPrefixSuffixZero('')).toBe('0.00')
  expect(FormatPrefixSuffixZero('', false)).toBe('')
  expect(FormatPrefixSuffixZero(0)).toBe('0.00')
  expect(FormatPrefixSuffixZero(0, true, 0)).toBe('0')
  expect(FormatPrefixSuffixZero(1)).toBe('1.00')
  expect(FormatPrefixSuffixZero(1.1)).toBe('1.10')
  expect(FormatPrefixSuffixZero(1.11)).toBe('1.11')
  expect(FormatPrefixSuffixZero(1.111)).toBe('1.11')
  expect(FormatPrefixSuffixZero(1000)).toBe('1,000.00')
  expect(FormatPrefixSuffixZero('1000')).toBe('1,000.00')
  expect(FormatPrefixSuffixZero(1000.1)).toBe('1,000.10')
  expect(FormatPrefixSuffixZero(1000000.1, false, 3)).toBe('1,000,000.100')
  expect(
    FormatPrefixSuffixZero(1000000.1, false, 3, 'prefix-', '-suffix')
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

test(NumberWithDecimalPlaces.name, () => {
  expect(NumberWithDecimalPlaces(NaN)).toBe('0')
  expect(NumberWithDecimalPlaces(0)).toBe('0.00')
  expect(NumberWithDecimalPlaces(1)).toBe('1.00')
  expect(NumberWithDecimalPlaces(1.1)).toBe('1.10')
  expect(NumberWithDecimalPlaces(1.11)).toBe('1.11')
  expect(NumberWithDecimalPlaces(1.111)).toBe('1.111')
  expect(NumberWithDecimalPlaces(1000)).toBe('1,000.00')
  expect(NumberWithDecimalPlaces(1000, 3)).toBe('1,000.00')
  expect(NumberWithDecimalPlaces(1000.1)).toBe('1,000.10')
  expect(NumberWithDecimalPlaces(1000000.1, 3)).toBe('1,000,000.10')
})

test(priceInDollars.name, () => {
  expect(priceInDollars(0)).toBe('$0.00')
  expect(priceInDollars(1)).toBe('$1.00')
  expect(priceInDollars(9999999, false, 0)).toBe('9,999,999')
  expect(priceInDollars(1.1)).toBe('$1.10')
  expect(priceInDollars(1.11)).toBe('$1.11')
  expect(priceInDollars(1.111)).toBe('$1.111')
  expect(priceInDollars(1000)).toBe('$1,000.00')
  expect(priceInDollars(1000.1)).toBe('$1,000.10')
  expect(priceInDollars(1000000.1, false, 3)).toBe('1,000,000.10')
})

test(DownUpOrEqual.name, () => {
  expect(DownUpOrEqual(-10, undefined)).toBe(0)
  expect(DownUpOrEqual(0, undefined)).toBe(0)
  expect(DownUpOrEqual(10, undefined)).toBe(0)

  expect(DownUpOrEqual(0, 0)).toBe(0)
  expect(DownUpOrEqual(1, 0)).toBe(-1)
  expect(DownUpOrEqual(0, 1)).toBe(1)
  expect(DownUpOrEqual(1, 1)).toBe(0)
  expect(DownUpOrEqual(1.1, 1)).toBe(-1)
  expect(DownUpOrEqual(1.11, 1)).toBe(-1)

  expect(DownUpOrEqual(0, 0, true)).toBe(0)
  expect(DownUpOrEqual(1, 0, true)).toBe(1)
  expect(DownUpOrEqual(0, 1, true)).toBe(-1)
  expect(DownUpOrEqual(1, 1, true)).toBe(0)
  expect(DownUpOrEqual(1.1, 1, true)).toBe(1)
  expect(DownUpOrEqual(1.11, 1, true)).toBe(1)
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

test(FirstNumberInString.name, () => {
  expect(FirstNumberInString('')).toBe(0)
  expect(FirstNumberInString(null)).toBe(0)
  expect(FirstNumberInString(undefined)).toBe(0)
  expect(FirstNumberInString('   ')).toBe(0)
  expect(FirstNumberInString('abc 123')).toBe(0)
  expect(FirstNumberInString('abc -123.45')).toBe(0)
  expect(FirstNumberInString(' 123')).toBe(123)
  expect(FirstNumberInString(' -123.45')).toBe(-123.45)
})

test(addNumbers.name, () => {
  const io1 = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: 'b' },
    io1ret = addNumbers(io1, {
      a: 3,
      b: 4,
      c: '5',
      d: '6',
      e: 'c',
      f: 'd',
    }),
    io2 = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: { a: 2 } },
    io2ret = addNumbers(io2, {
      a: 3,
      b: 4,
      c: '5',
      d: '6',
      e: 'c',
      f: { a: 2 },
    }),
    io3 = { a: [2], b: 3, c: '4', d: '5', e: 'a', f: { a: 2 } },
    io3ret = addNumbers(io3, {
      a: [3],
      b: 4,
      c: '5',
      d: '6',
      e: 'c',
      f: { a: 2 },
    }),
    io4 = { a: 2, b: 3, c: '4', d: ['5'], e: ['e'], f: { a: 2 } },
    io4ret = addNumbers(io4, {
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

test(divideByNumbers.name, () => {
  const io = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: 'b' },
    objRet = divideByNumbers(io, 2)

  expect(objRet).toEqual({ a: 1, b: 1.5, c: 2, d: 2.5, e: 'a', f: 'b' })
})

test(getPercentChange.name, () => {
  expect(getPercentChange(0, 0)).toBe(0)
  expect(getPercentChange(0, 50)).toBe(5000)
  expect(getPercentChange(50, 0)).toBe(-5000)
  expect(getPercentChange(100, 200)).toBe(100)
  expect(getPercentChange(200, 100)).toBe(-50)
})

test(getPercentChangeString.name, () => {
  expect(getPercentChangeString(0, 0)).toBe('0.00%')
  expect(getPercentChangeString(100, 200)).toBe('+100.00%')
  expect(getPercentChangeString(100, 200, false, -1)).toBe('+100')
  expect(getPercentChangeString(100, 200, false, 0)).toBe('+100')
  expect(getPercentChangeString(100, 200, true, 0)).toBe('+100%')
  expect(getPercentChangeString(100, 200, true, 2)).toBe('+100.00%')
})
