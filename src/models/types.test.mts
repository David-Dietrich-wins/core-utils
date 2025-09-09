import {
  type SortOrder,
  createClass,
  sortOrderAsBoolean,
  sortOrderAsNumeric,
  sortOrderAsString,
} from './types.mjs'
import { describe, expect, it } from '@jest/globals'

describe('types', () => {
  it('sortOrderAsBoolean', () => {
    expect.assertions(8)

    const soasc: SortOrder = 'asc',
      sodesc: SortOrder = 'desc'

    expect(sortOrderAsBoolean(soasc)).toBe(true)
    expect(sortOrderAsBoolean(sodesc)).toBe(false)
    expect(sortOrderAsBoolean(undefined)).toBe(true)
    expect(sortOrderAsBoolean(null)).toBe(true)
    expect(sortOrderAsBoolean(true)).toBe(true)
    expect(sortOrderAsBoolean(false)).toBe(false)
    expect(sortOrderAsBoolean(1)).toBe(true)
    expect(sortOrderAsBoolean(-1)).toBe(false)
  })

  it('sortOrderAsNumeric', () => {
    expect.assertions(8)

    const soasc: SortOrder = 'asc',
      sodesc: SortOrder = 'desc'

    expect(sortOrderAsNumeric(soasc)).toBe(1)
    expect(sortOrderAsNumeric(sodesc)).toBe(-1)
    expect(sortOrderAsNumeric(undefined)).toBe(1)
    expect(sortOrderAsNumeric(null)).toBe(1)
    expect(sortOrderAsNumeric(true)).toBe(1)
    expect(sortOrderAsNumeric(false)).toBe(-1)
    expect(sortOrderAsNumeric(1)).toBe(1)
    expect(sortOrderAsNumeric(-1)).toBe(-1)
  })

  it('sortOrderAsString', () => {
    expect.assertions(8)

    const soasc: SortOrder = 'asc',
      sodesc: SortOrder = 'desc'

    expect(sortOrderAsString(soasc)).toBe('asc')
    expect(sortOrderAsString(sodesc)).toBe('desc')
    expect(sortOrderAsString(undefined)).toBe('asc')
    expect(sortOrderAsString(null)).toBe('asc')
    expect(sortOrderAsString(true)).toBe('asc')
    expect(sortOrderAsString(false)).toBe('desc')
    expect(sortOrderAsString(1)).toBe('asc')
    expect(sortOrderAsString(-1)).toBe('desc')
  })

  it('createClass', () => {
    expect.assertions(2)

    class TestClass {
      name: string

      constructor(name: string) {
        this.name = name
      }
    }
    const instance = createClass(TestClass, 'TestName')

    expect(instance).toBeInstanceOf(TestClass)
    expect(instance.name).toBe('TestName')
  })
})
