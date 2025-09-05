import {
  addNumbers,
  divideByNumbers,
  dollarFormatter,
  downUpOrEqual,
  elementTopLeftCoords,
  firstNumberInString,
  formatPrefixSuffixZero,
  getAsNumberOrUndefined,
  getMantissa,
  getNumberFormatted,
  getNumberString,
  getPercentChange,
  getPercentChangeString,
  isNumber,
  isNumeric,
  numberFormatter,
  numberFormatterNoDecimal,
  numberToString,
  numberWithDecimalPlaces,
  percentFormatter,
  percentTimes100Formatter,
  priceInDollars,
  stockPriceFormatter,
  stockVolumeFormatter,
  toFixedPrefixed,
  toFixedSuffixed,
  xFormatter,
} from './number-helper.mjs'

it(getMantissa.name, () => {
  expect(getMantissa(0)).toBe(0)
  expect(getMantissa(1000)).toBe(0)
  expect(getMantissa(0.1)).toBe(1)
  expect(getMantissa(-4234.99)).toBe(99)
  expect(getMantissa(34.012)).toBe(12)

  expect(getMantissa(34)).toBe(0)
})

it(isNumeric.name, () => {
  expect(isNumeric()).toBe(false)
  expect(isNumeric(1)).toBe(true)
  expect(isNumeric('1')).toBe(true)
  expect(isNumeric('1.11')).toBe(true)
  expect(isNumeric('1.11.1')).toBe(false)
  expect(isNumeric('12q')).toBe(false)
  expect(isNumeric('a2q')).toBe(false)
})

it(isNumber.name, () => {
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

it(getNumberString.name, () => {
  expect(getNumberString(0)).toBe('0')
  expect(getNumberString('1,249')).toBe('1,249')

  expect(getNumberString('1,249', 2)).toBe('1,249.00')
  expect(getNumberString('1,249.999', 2)).toBe('1,250.00')
  expect(getNumberString('1,249.9', 2)).toBe('1,249.90')

  expect(getNumberString('38,459,238,231,249.999', 2)).toBe(
    '38,459,238,231,250.00'
  )
})

it(getNumberFormatted.name, () => {
  expect(getNumberFormatted(0)).toBe(0)

  expect(getNumberFormatted('1,249', 2)).toBe(1249)
  expect(getNumberFormatted('1,249.999', 2)).toBe(1250)
  expect(getNumberFormatted('1,249.9', 2)).toBe(1249.9)
  expect(getNumberFormatted(1249.9, 2)).toBe(1249.9)
  expect(getNumberFormatted(undefined, 2)).toBe(0)
  expect(getNumberFormatted(',,', 2)).toBe(0)
})

it(getNumberString.name, () => {
  expect(getNumberString(123456789)).toBe('123,456,789')
  expect(getNumberString('123,456,789')).toBe('123,456,789')
  expect(getNumberString(',,')).toBe('NaN')
})

it(getAsNumberOrUndefined.name, () => {
  expect(getAsNumberOrUndefined('123,456,789')).toBe(123456789)
  expect(getAsNumberOrUndefined(123456789)).toBe(123456789)
  expect(getAsNumberOrUndefined(null)).toBeUndefined()
  expect(getAsNumberOrUndefined(undefined)).toBeUndefined()
  expect(getAsNumberOrUndefined(0)).toBeUndefined()
  expect(getAsNumberOrUndefined('')).toBeUndefined()
})
it(numberToString.name, () => {
  expect(numberToString(0)).toBe('0')
  expect(numberToString(0, false)).toBe('')
  expect(numberToString(0.0, false)).toBe('')
  expect(numberToString('', false)).toBe('')
  expect(numberToString('', true)).toBe('0')
  expect(numberToString('', true, 2)).toBe('0.00')
  expect(numberToString('0', false)).toBe('')
  expect(numberToString('0.00', false)).toBe('')
  expect(numberToString('1,249')).toBe('1,249')

  expect(numberToString('1,249', true, 2)).toBe('1,249.00')
  expect(numberToString('1,249.999', true, 2)).toBe('1,250.00')
  expect(numberToString('1,249.9', true, 2)).toBe('1,249.90')

  expect(numberToString('38,459,238,231,249.999', true, 2)).toBe(
    '38,459,238,231,250.00'
  )
})
it(getNumberFormatted.name, () => {
  expect(getNumberFormatted(0)).toBe(0)

  expect(getNumberFormatted(',', 2)).toBe(0)
  expect(getNumberFormatted('1,249', 2)).toBe(1249)
  expect(getNumberFormatted('1,249.999', 2)).toBe(1250)
  expect(getNumberFormatted('1,249.9', 2)).toBe(1249.9)
  expect(getNumberFormatted(1249.9, 2)).toBe(1249.9)
  expect(getNumberFormatted(undefined, 2)).toBe(0)
})

it(getMantissa.name, () => {
  expect(getMantissa(0)).toBe(0)
  expect(getMantissa(1000)).toBe(0)
  expect(getMantissa(0.1)).toBe(1)
  expect(getMantissa(-4234.99)).toBe(99)
  expect(getMantissa(34.012)).toBe(12)

  expect(getMantissa(34)).toBe(0)
})

it(toFixedPrefixed.name, () => {
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

it(toFixedSuffixed.name, () => {
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

it(formatPrefixSuffixZero.name, () => {
  expect(formatPrefixSuffixZero(null)).toBe('')
  expect(formatPrefixSuffixZero(undefined)).toBe('')
  expect(formatPrefixSuffixZero('')).toBe('0.00')
  expect(formatPrefixSuffixZero('', false)).toBe('')
  expect(formatPrefixSuffixZero(0)).toBe('0.00')
  expect(formatPrefixSuffixZero(0, true, 0)).toBe('0')
  expect(formatPrefixSuffixZero(1)).toBe('1.00')
  expect(formatPrefixSuffixZero(1.1)).toBe('1.10')
  expect(formatPrefixSuffixZero(1.11)).toBe('1.11')
  expect(formatPrefixSuffixZero(1.111)).toBe('1.11')
  expect(formatPrefixSuffixZero(1000)).toBe('1,000.00')
  expect(formatPrefixSuffixZero('1000')).toBe('1,000.00')
  expect(formatPrefixSuffixZero(1000.1)).toBe('1,000.10')
  expect(formatPrefixSuffixZero(1000000.1, false, 3)).toBe('1,000,000.100')
  expect(
    formatPrefixSuffixZero(1000000.1, false, 3, 'prefix-', '-suffix')
  ).toBe('prefix-1,000,000.100-suffix')
})

it(numberFormatter.name, () => {
  expect(numberFormatter(null)).toBe('')
  expect(numberFormatter(undefined)).toBe('')
  expect(numberFormatter('')).toBe('0.00')
  expect(numberFormatter('', false)).toBe('')
  expect(numberFormatter(0)).toBe('0.00')
  expect(numberFormatter(0, true, 0)).toBe('0')
  expect(numberFormatter(0, false, 0)).toBe('')
  expect(numberFormatter(',', false, 0)).toBe('')
  expect(numberFormatter(',', true, 0)).toBe('')
  expect(numberFormatter(',##,44', true, 0)).toBe('')
  expect(numberFormatter(',##,44', false, 0)).toBe('')
  expect(numberFormatter('88,##,44', true, 0)).toBe('88')
  expect(numberFormatter('88,##,44', false, 0)).toBe('88')
  expect(numberFormatter('00,##,44', false, 0)).toBe('')
  expect(numberFormatter('0,##,44', false, 0)).toBe('')
  expect(numberFormatter(1)).toBe('1.00')
  expect(numberFormatter(1.1)).toBe('1.10')
  expect(numberFormatter(1.11)).toBe('1.11')
  expect(numberFormatter(1.111)).toBe('1.11')
  expect(numberFormatter(1000)).toBe('1,000.00')
  expect(numberFormatter('1000', false, 3)).toBe('1,000.000')
  expect(numberFormatter(1000.1)).toBe('1,000.10')
  expect(numberFormatter(1000000.1, false, 3)).toBe('1,000,000.100')
})

it(numberFormatterNoDecimal.name, () => {
  expect(numberFormatterNoDecimal(null)).toBe('')
  expect(numberFormatterNoDecimal(undefined)).toBe('')
  expect(numberFormatterNoDecimal('')).toBe('0')
  expect(numberFormatterNoDecimal('', false)).toBe('')
  expect(numberFormatterNoDecimal(0)).toBe('0')
  expect(numberFormatterNoDecimal(1)).toBe('1')
  expect(numberFormatterNoDecimal(1.1)).toBe('1')
  expect(numberFormatterNoDecimal(1.11)).toBe('1')
  expect(numberFormatterNoDecimal(1.49999999)).toBe('1')
  expect(numberFormatterNoDecimal(1.5)).toBe('2')
  expect(numberFormatterNoDecimal(1.999)).toBe('2')
  expect(numberFormatterNoDecimal(1000)).toBe('1,000')
  expect(numberFormatterNoDecimal('1000', false)).toBe('1,000')
  expect(numberFormatterNoDecimal(1000.1)).toBe('1,000')
  expect(numberFormatterNoDecimal(1000000.5, false)).toBe('1,000,001')
})

it(xFormatter.name, () => {
  expect(xFormatter(null)).toBe('')
  expect(xFormatter(undefined)).toBe('')
  expect(xFormatter('')).toBe('0.00x')
  expect(xFormatter('', false)).toBe('')
  expect(xFormatter(0)).toBe('0.00x')
  expect(xFormatter(1)).toBe('1.00x')
  expect(xFormatter(9999999, false, 0)).toBe('9,999,999x')
  expect(xFormatter(1.1)).toBe('1.10x')
  expect(xFormatter(1.11)).toBe('1.11x')
  expect(xFormatter(1.111)).toBe('1.11x')
  expect(xFormatter(1000)).toBe('1,000.00x')
  expect(xFormatter('1000', false, 3)).toBe('1,000.000x')
  expect(xFormatter(1000.1)).toBe('1,000.10x')
  expect(xFormatter(1000000.1, false, 3)).toBe('1,000,000.100x')
})

it(dollarFormatter.name, () => {
  expect(dollarFormatter(null)).toBe('')
  expect(dollarFormatter(undefined)).toBe('$0.00')
  expect(dollarFormatter('')).toBe('$0.00')
  expect(dollarFormatter('', false)).toBe('')
  expect(dollarFormatter(0)).toBe('$0.00')
  expect(dollarFormatter(1)).toBe('$1.00')
  expect(dollarFormatter(9999999, false, 0)).toBe('$9,999,999')
  expect(dollarFormatter(1.1)).toBe('$1.10')
  expect(dollarFormatter(1.11)).toBe('$1.11')
  expect(dollarFormatter(1.111)).toBe('$1.11')
  expect(dollarFormatter(1000)).toBe('$1,000.00')
  expect(dollarFormatter('1000', false, 3)).toBe('$1,000.000')
  expect(dollarFormatter('1000.000499999', false, 3)).toBe('$1,000.000')
  expect(dollarFormatter('1000.0005', false, 3)).toBe('$1,000.001')
  expect(dollarFormatter(1000.1)).toBe('$1,000.10')
  expect(dollarFormatter(1000000.1, false, 3)).toBe('$1,000,000.100')
})

it(stockPriceFormatter.name, () => {
  expect(stockPriceFormatter(null)).toBeUndefined()
  expect(stockPriceFormatter(undefined)).toBeUndefined()
  expect(stockPriceFormatter(null, true)).toBe('$0.0000')
  expect(stockPriceFormatter(undefined, true)).toBe('$0.0000')
  expect(stockPriceFormatter('')).toBeUndefined()
  expect(stockPriceFormatter('', false)).toBeUndefined()
  expect(stockPriceFormatter(0)).toBeUndefined()
  expect(stockPriceFormatter(0, true)).toBe('$0.0000')
  expect(stockPriceFormatter(1)).toBe('$1.00')
  expect(stockPriceFormatter(9999999, false, 0)).toBe('$9,999,999')
  expect(stockPriceFormatter(1.1)).toBe('$1.10')
  expect(stockPriceFormatter(1.11)).toBe('$1.11')
  expect(stockPriceFormatter(1.111)).toBe('$1.11')
  expect(stockPriceFormatter(1000)).toBe('$1,000.00')
  expect(stockPriceFormatter('1000', false, 3)).toBe('$1,000.000')
  expect(stockPriceFormatter('1000.000499999', false, 3)).toBe('$1,000.000')
  expect(stockPriceFormatter('1000.0005', false, 3)).toBe('$1,000.001')
  expect(stockPriceFormatter(1000.1)).toBe('$1,000.10')
  expect(stockPriceFormatter(1000000.1, false, 3)).toBe('$1,000,000.100')
})

it(percentFormatter.name, () => {
  expect(percentFormatter(null)).toBe('')
  expect(percentFormatter(undefined)).toBe('')
  expect(percentFormatter('')).toBe('')
  expect(percentFormatter('', false)).toBe('')
  expect(percentFormatter(0)).toBe('')
  expect(percentFormatter(0, true)).toBe('0.00%')
  expect(percentFormatter(1)).toBe('1.00%')
  expect(percentFormatter(9999999, false, 0)).toBe('9,999,999%')
  expect(percentFormatter(1.1)).toBe('1.10%')
  expect(percentFormatter(1.11)).toBe('1.11%')
  expect(percentFormatter(1.111)).toBe('1.11%')
  expect(percentFormatter(1000)).toBe('1,000.00%')
  expect(percentFormatter('1000', false, 3)).toBe('1,000.000%')
  expect(percentFormatter(1000.1)).toBe('1,000.10%')
  expect(percentFormatter(1000000.1, false, 3)).toBe('1,000,000.100%')
})

it(percentTimes100Formatter.name, () => {
  expect(percentTimes100Formatter(null)).toBe('')
  expect(percentTimes100Formatter(undefined)).toBe('')
  expect(percentTimes100Formatter('')).toBe('')
  expect(percentTimes100Formatter('', false)).toBe('')
  expect(percentTimes100Formatter(0)).toBe('')
  expect(percentTimes100Formatter(0, true)).toBe('0.00%')
  expect(percentTimes100Formatter(0.24)).toBe('24.00%')
  expect(percentTimes100Formatter(0.9999999, false, 0)).toBe('100%')
  expect(percentTimes100Formatter(0.11)).toBe('11.00%')
  expect(percentTimes100Formatter(0.1149)).toBe('11.49%')
  expect(percentTimes100Formatter(0.115)).toBe('11.50%')
  expect(percentTimes100Formatter(0.11111)).toBe('11.11%')
  expect(percentTimes100Formatter(1000)).toBe('100,000.00%')
  expect(percentTimes100Formatter('1000', false, 3)).toBe('100,000.000%')
  expect(percentTimes100Formatter(1000.1)).toBe('100,010.00%')
  expect(percentTimes100Formatter(1000000.1, false, 3)).toBe('100,000,010.000%')
})

it(stockVolumeFormatter.name, () => {
  expect(stockVolumeFormatter(null)).toBeUndefined()
  expect(stockVolumeFormatter(undefined)).toBeUndefined()
  expect(stockVolumeFormatter(null, true)).toBe('0')
  expect(stockVolumeFormatter(undefined, false, 2)).toBeUndefined()
  expect(stockVolumeFormatter(undefined, true)).toBe('0')
  expect(stockVolumeFormatter(undefined, true, null as unknown as number)).toBe(
    '0'
  )
  expect(stockVolumeFormatter(undefined, true, 3)).toBe('0.000')
  expect(stockVolumeFormatter('')).toBeUndefined()
  expect(stockVolumeFormatter('', false)).toBeUndefined()
  expect(stockVolumeFormatter(0)).toBeUndefined()
  expect(stockVolumeFormatter(undefined, true)).toBe('0')
  expect(stockVolumeFormatter('', true)).toBe('0')
  expect(stockVolumeFormatter(0, true)).toBe('0')
  expect(stockVolumeFormatter(5, true)).toBe('5')
  expect(stockVolumeFormatter(1)).toBe('1')
  expect(stockVolumeFormatter(1.1)).toBe('1')
  expect(stockVolumeFormatter(1.11)).toBe('1')
  expect(stockVolumeFormatter(1.111)).toBe('1')
  expect(stockVolumeFormatter(1000)).toBe('1,000')
  expect(stockVolumeFormatter('1000', false, 3)).toBe('1,000.000')
  expect(stockVolumeFormatter(1000.1)).toBe('1,000')
  expect(stockVolumeFormatter(1000000.1, false, 3)).toBe('1,000,000.100')

  expect(stockVolumeFormatter(0, true)).toBe('0')
  expect(stockVolumeFormatter(0, false)).toBeUndefined()
  expect(stockVolumeFormatter(',,')).toBeUndefined()
  expect(stockVolumeFormatter(',,', true, 0)).toBe('')
  expect(stockVolumeFormatter('0.00', false, 0)).toBeUndefined()
  expect(stockVolumeFormatter('0.0', false, 0)).toBeUndefined()
  expect(stockVolumeFormatter('0.', false, 0)).toBeUndefined()
  expect(stockVolumeFormatter('.00', false, 0)).toBeUndefined()
  expect(stockVolumeFormatter('0', false, 2)).toBeUndefined()
  expect(stockVolumeFormatter('1', true)).toBe('1')
  expect(stockVolumeFormatter('1', false)).toBe('1')

  expect(stockVolumeFormatter(0, false, 0)).toBeUndefined()
  expect(stockVolumeFormatter(0, true, 0)).toBe('0')

  expect(stockVolumeFormatter(',,')).toBeUndefined()
  expect(stockVolumeFormatter(',,', true, 0)).toBe('')
})

it(numberWithDecimalPlaces.name, () => {
  expect(numberWithDecimalPlaces(NaN)).toBe('0')
  expect(numberWithDecimalPlaces(0)).toBe('0.00')
  expect(numberWithDecimalPlaces(1)).toBe('1.00')
  expect(numberWithDecimalPlaces(1.1)).toBe('1.10')
  expect(numberWithDecimalPlaces(1.11)).toBe('1.11')
  expect(numberWithDecimalPlaces(1.111)).toBe('1.111')
  expect(numberWithDecimalPlaces(1000)).toBe('1,000.00')
  expect(numberWithDecimalPlaces(1000, 3)).toBe('1,000.00')
  expect(numberWithDecimalPlaces(1000.1)).toBe('1,000.10')
  expect(numberWithDecimalPlaces(1000000.1, 3)).toBe('1,000,000.10')
})

it(priceInDollars.name, () => {
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

it(downUpOrEqual.name, () => {
  expect(downUpOrEqual(-10, undefined)).toBe(0)
  expect(downUpOrEqual(0, undefined)).toBe(0)
  expect(downUpOrEqual(10, undefined)).toBe(0)

  expect(downUpOrEqual(0, 0)).toBe(0)
  expect(downUpOrEqual(1, 0)).toBe(-1)
  expect(downUpOrEqual(0, 1)).toBe(1)
  expect(downUpOrEqual(1, 1)).toBe(0)
  expect(downUpOrEqual(1.1, 1)).toBe(-1)
  expect(downUpOrEqual(1.11, 1)).toBe(-1)

  expect(downUpOrEqual(0, 0, true)).toBe(0)
  expect(downUpOrEqual(1, 0, true)).toBe(1)
  expect(downUpOrEqual(0, 1, true)).toBe(-1)
  expect(downUpOrEqual(1, 1, true)).toBe(0)
  expect(downUpOrEqual(1.1, 1, true)).toBe(1)
  expect(downUpOrEqual(1.11, 1, true)).toBe(1)
})

it(elementTopLeftCoords.name, () => {
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

  expect(elementTopLeftCoords(coords)).toStrictEqual({
    left: 20,
    top: 10,
  })

  expect(elementTopLeftCoords(coordsWithParent)).toStrictEqual({
    left: 25,
    top: 15,
  })

  expect(elementTopLeftCoords(coordsWithoutValues)).toStrictEqual({
    left: 7,
    top: 5,
  })
})

it(firstNumberInString.name, () => {
  expect(firstNumberInString('')).toBe(0)
  expect(firstNumberInString(null)).toBe(0)
  expect(firstNumberInString(undefined)).toBe(0)
  expect(firstNumberInString('   ')).toBe(0)
  expect(firstNumberInString('abc 123')).toBe(0)
  expect(firstNumberInString('abc -123.45')).toBe(0)
  expect(firstNumberInString(' 123')).toBe(123)
  expect(firstNumberInString(' -123.45')).toBe(-123.45)
})

it(addNumbers.name, () => {
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

  expect(io1ret).toStrictEqual({ a: 5, b: 7, c: 9, d: 11, e: 'a', f: 'b' })
  expect(io2ret).toStrictEqual({ a: 5, b: 7, c: 9, d: 11, e: 'a', f: { a: 2 } })
  expect(io3ret).toStrictEqual({
    a: [2],
    b: 7,
    c: 9,
    d: 11,
    e: 'a',
    f: { a: 2 },
  })
  expect(io4ret).toStrictEqual({
    a: 2,
    b: 7,
    c: 4,
    d: 6,
    e: ['e'],
    f: { a: 2 },
  })
})

it(divideByNumbers.name, () => {
  const io = { a: 2, b: 3, c: '4', d: '5', e: 'a', f: 'b' },
    objRet = divideByNumbers(io, 2)

  expect(objRet).toStrictEqual({ a: 1, b: 1.5, c: 2, d: 2.5, e: 'a', f: 'b' })
})

it(getPercentChange.name, () => {
  expect(getPercentChange(0, 0)).toBe(0)
  expect(getPercentChange(0, 50)).toBe(5000)
  expect(getPercentChange(50, 0)).toBe(-5000)
  expect(getPercentChange(100, 200)).toBe(100)
  expect(getPercentChange(200, 100)).toBe(-50)
})

it(getPercentChangeString.name, () => {
  expect(getPercentChangeString(0, 0)).toBe('0.00%')
  expect(getPercentChangeString(100, 200)).toBe('+100.00%')
  expect(getPercentChangeString(100, 200, false, -1)).toBe('+100')
  expect(getPercentChangeString(100, 200, false, 0)).toBe('+100')
  expect(getPercentChangeString(100, 200, true, 0)).toBe('+100%')
  expect(getPercentChangeString(100, 200, true, 2)).toBe('+100.00%')
})
