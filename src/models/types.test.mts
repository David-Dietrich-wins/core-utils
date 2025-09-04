import {
  CreateClass,
  type SortOrder,
  SortOrderAsBoolean,
  SortOrderAsNumeric,
  SortOrderAsString,
} from './types.mjs'

it('SortOrderAsBoolean', () => {
  const soasc: SortOrder = 'asc',
    sodesc: SortOrder = 'desc'

  expect(SortOrderAsBoolean(soasc)).toBe(true)
  expect(SortOrderAsBoolean(sodesc)).toBe(false)
  expect(SortOrderAsBoolean(undefined)).toBe(true)
  expect(SortOrderAsBoolean(null)).toBe(true)
  expect(SortOrderAsBoolean(true)).toBe(true)
  expect(SortOrderAsBoolean(false)).toBe(false)
  expect(SortOrderAsBoolean(1)).toBe(true)
  expect(SortOrderAsBoolean(-1)).toBe(false)
})

it('SortOrderAsNumeric', () => {
  const soasc: SortOrder = 'asc',
    sodesc: SortOrder = 'desc'

  expect(SortOrderAsNumeric(soasc)).toBe(1)
  expect(SortOrderAsNumeric(sodesc)).toBe(-1)
  expect(SortOrderAsNumeric(undefined)).toBe(1)
  expect(SortOrderAsNumeric(null)).toBe(1)
  expect(SortOrderAsNumeric(true)).toBe(1)
  expect(SortOrderAsNumeric(false)).toBe(-1)
  expect(SortOrderAsNumeric(1)).toBe(1)
  expect(SortOrderAsNumeric(-1)).toBe(-1)
})

it('SortOrderAsString', () => {
  const soasc: SortOrder = 'asc',
    sodesc: SortOrder = 'desc'

  expect(SortOrderAsString(soasc)).toBe('asc')
  expect(SortOrderAsString(sodesc)).toBe('desc')
  expect(SortOrderAsString(undefined)).toBe('asc')
  expect(SortOrderAsString(null)).toBe('asc')
  expect(SortOrderAsString(true)).toBe('asc')
  expect(SortOrderAsString(false)).toBe('desc')
  expect(SortOrderAsString(1)).toBe('asc')
  expect(SortOrderAsString(-1)).toBe('desc')
})

it('CreateClass', () => {
  class TestClass {
    name: string

    constructor(name: string) {
      this.name = name
    }
  }
  const instance = CreateClass(TestClass, 'TestName')
  expect(instance).toBeInstanceOf(TestClass)
  expect(instance.name).toBe('TestName')
})
