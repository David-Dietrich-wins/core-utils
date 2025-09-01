/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import {
  copyArrayToTypishFunction,
  copyToTypishFunction,
  typishValue,
} from './function-helper.mjs'
import { Typish } from '../models/types.mjs'

test(typishValue.name, () => {
  expect(typishValue(undefined)).toBe(undefined)
  expect(typishValue(null)).toBe(null)
  expect(typishValue('')).toBe('')
  expect(typishValue('test')).toBe('test')
  expect(typishValue(123)).toBe(123)
  expect(typishValue(() => 123)).toBe(123)

  let t: Typish<string> = () => 'test-func-string'
  expect(typishValue(t)).toBe('test-func-string')
  t = 'test-string'
  expect(typishValue(t)).toBe('test-string')
})

test(copyToTypishFunction.name, () => {
  expect(copyToTypishFunction(undefined)).toBeInstanceOf(Function)
  expect(copyToTypishFunction(null)).toBeInstanceOf(Function)
  expect(copyToTypishFunction('')).toBeInstanceOf(Function)
  expect(copyToTypishFunction('test')).toBeInstanceOf(Function)
  expect(copyToTypishFunction(123)).toBeInstanceOf(Function)
  expect(copyToTypishFunction(() => 123)).toBeInstanceOf(Function)

  let t: Typish<string> = () => 'test-func-string'
  expect(copyToTypishFunction(t)()).toBe('test-func-string')
  t = 'test-string'
  expect(copyToTypishFunction(t)()).toBe('test-string')
})

test(copyArrayToTypishFunction.name, () => {
  expect(copyArrayToTypishFunction([])).toStrictEqual([])
  expect(copyArrayToTypishFunction([null]).map((x) => x())).toStrictEqual([
    null,
  ])
  expect(copyArrayToTypishFunction(['']).map((x) => x())).toStrictEqual([''])
  expect(copyArrayToTypishFunction(['test']).map((x) => x())).toStrictEqual([
    'test',
  ])
  expect(copyArrayToTypishFunction([123]).map((x) => x())).toStrictEqual([123])
  expect(
    copyArrayToTypishFunction([123, 'abc', 5n, new Date()]).map((x) => x())
  ).toStrictEqual([123, 'abc', 5n, expect.any(Date)])

  const t = ['test-string']
  expect(copyArrayToTypishFunction(t).map((x) => x())).toStrictEqual([
    'test-string',
  ])
})
