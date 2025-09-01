import {
  getBoolean,
  getBooleanAsNumber,
  getBooleanUndefined,
} from './boolean-helper.mjs'

test(getBoolean.name, () => {
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

test(getBooleanAsNumber.name, () => {
  expect(getBooleanAsNumber(undefined)).toBe(0)
  expect(getBooleanAsNumber(null)).toBe(0)
  expect(getBooleanAsNumber(false)).toBe(0)
  expect(getBooleanAsNumber(0)).toBe(0)
  expect(getBooleanAsNumber('')).toBe(0)
  expect(getBooleanAsNumber([])).toBe(0)

  expect(getBooleanAsNumber('FALSE')).toBe(0)
  expect(getBooleanAsNumber('f')).toBe(0)
  expect(getBooleanAsNumber('no')).toBe(0)
  expect(getBooleanAsNumber('0')).toBe(0)

  expect(getBooleanAsNumber(true)).toBe(1)
  expect(getBooleanAsNumber(1)).toBe(1)
  expect(getBooleanAsNumber('1')).toBe(1)
  expect(getBooleanAsNumber('true')).toBe(1)
  expect(getBooleanAsNumber('hello')).toBe(1)
})

test(getBooleanUndefined.name, () => {
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
