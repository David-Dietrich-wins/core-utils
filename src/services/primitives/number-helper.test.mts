import {
  getAsNumberOrUndefined,
  getMantissa,
  getNumberFormatted,
  getNumberString,
  isNumber,
  isNumeric,
} from './number-helpers.mjs'

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
