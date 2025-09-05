import { describe, expect, it } from '@jest/globals'
import {
  getBoolean,
  getBooleanAsNumber,
  getBooleanUndefined,
} from './boolean-helper.mjs'

describe('getBoolean', () => {
  it('false', () => {
    expect.assertions(10)
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
  })

  it('true', () => {
    expect.assertions(5)

    expect(getBoolean(true)).toBe(true)
    expect(getBoolean(1)).toBe(true)
    expect(getBoolean('1')).toBe(true)
    expect(getBoolean('true')).toBe(true)
    expect(getBoolean('hello')).toBe(true)
  })
})

describe('getBooleanAsNumber', () => {
  it('0', () => {
    expect.assertions(11)

    expect(getBooleanAsNumber(undefined)).toBe(0)
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
  })

  it('1', () => {
    expect.assertions(5)

    expect(getBooleanAsNumber(true)).toBe(1)
    expect(getBooleanAsNumber(1)).toBe(1)
    expect(getBooleanAsNumber('1')).toBe(1)
    expect(getBooleanAsNumber('true')).toBe(1)
    expect(getBooleanAsNumber('hello')).toBe(1)
  })
})

describe('getBooleanUndefined', () => {
  it('undefined', () => {
    expect.assertions(10)

    expect(getBooleanUndefined(undefined)).toBeUndefined()
    expect(getBooleanUndefined(null)).toBeUndefined()
    expect(getBooleanUndefined(false)).toBeUndefined()
    expect(getBooleanUndefined(0)).toBeUndefined()
    expect(getBooleanUndefined('')).toBeUndefined()
    expect(getBooleanUndefined([])).toBeUndefined()

    expect(getBooleanUndefined('FALSE')).toBeUndefined()
    expect(getBooleanUndefined('f')).toBeUndefined()
    expect(getBooleanUndefined('no')).toBeUndefined()
    expect(getBooleanUndefined('0')).toBeUndefined()
  })

  it('true', () => {
    expect.assertions(5)

    expect(getBooleanUndefined(true)).toBe(true)
    expect(getBooleanUndefined(1)).toBe(true)
    expect(getBooleanUndefined('1')).toBe(true)
    expect(getBooleanUndefined('true')).toBe(true)
    expect(getBooleanUndefined('hello')).toBe(true)
  })
})
