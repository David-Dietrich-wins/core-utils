/* eslint-disable quotes */
import { jest } from '@jest/globals'
import {
  capitalizeFirstLetter,
  capitalizeWords,
  getCommaUpperList,
  isEmptyString,
  pluralize,
  pluralSuffix,
  plusMinus,
  prefixIfHasData,
  safestr,
  safestrLowercase,
  safestrToJson,
  stringEquals,
  stringEqualsQuoted,
  stringIf,
  stringWrapDoubleQuote,
  stringWrapParen,
  stringWrapSingleQuote,
} from './string-helper.mjs'

test('capitalizeFirstLetter', () => {
  expect(capitalizeFirstLetter('hello')).toBe('Hello')
  expect(capitalizeFirstLetter('')).toBe('')
  expect(capitalizeFirstLetter(null)).toBe('')
  expect(capitalizeFirstLetter(undefined)).toBe('')
  expect(capitalizeFirstLetter('123')).toBe('123')
  expect(capitalizeFirstLetter('hello world')).toBe('Hello world')
  expect(capitalizeFirstLetter('hello world!')).toBe('Hello world!')
})

test('capitalizeWords', () => {
  expect(capitalizeWords('hello world')).toBe('Hello World')
  expect(capitalizeWords('')).toBe('')
  expect(capitalizeWords(null)).toBe('')
  expect(capitalizeWords(undefined)).toBe('')
  expect(capitalizeWords('123')).toBe('123')
  expect(capitalizeWords('hello world!')).toBe('Hello World!')
  expect(capitalizeWords('hello world! how are you?')).toBe(
    'Hello World! How Are You?'
  )
  expect(capitalizeWords('hello world! how are you?')).toBe(
    'Hello World! How Are You?'
  )
  expect(capitalizeWords('hello world! how are you?')).toBe(
    'Hello World! How Are You?'
  )
})
test('safestr', () => {
  expect(safestr(undefined)).toBe('')
  expect(safestr(null)).toBe('')
  expect(safestr('')).toBe('')
  expect(safestr('', 'test')).toBe('test')
  expect(safestr('test')).toBe('test')
})

describe('strings', () => {
  test('stringWrapSingleQuote', () => {
    const str = stringWrapSingleQuote('test')

    expect(str).toBe("'test'")
  })

  test('stringWrapParen', () => {
    const str = stringWrapParen('test')

    expect(str).toBe('(test)')
  })

  test('stringWrapDoubleQuote', () => {
    const str = stringWrapDoubleQuote('test')

    expect(str).toBe('"test"')
  })

  describe('stringEquals', () => {
    test('nothing', () => {
      const str = stringEquals('', '')

      expect(str).toBe('')
    })

    test('not wrapped', () => {
      const str = stringEquals('name', 'value')

      expect(str).toBe('name=value')
    })

    test('wrapped', () => {
      const str = stringEquals('name', 'value', 'ab')

      expect(str).toBe('name=abvalueab')
    })
  })

  describe('stringEqualsQuoted', () => {
    test('nothing', () => {
      expect(stringEqualsQuoted('', '', true)).toBe('')

      expect(stringEqualsQuoted('', '', false)).toBe('')
    })

    test('name/value', () => {
      expect(stringEqualsQuoted('name', '', false)).toBe('name=""')
      expect(stringEqualsQuoted('name', 'value', false)).toBe('name="value"')

      expect(stringEqualsQuoted('name', '')).toBe("name=''")
      expect(stringEqualsQuoted('name', 'value')).toBe("name='value'")

      expect(stringEqualsQuoted('name', '', true)).toBe("name=''")
      expect(stringEqualsQuoted('name', 'value', true)).toBe("name='value'")
    })

    test('single quoted', () => {
      const str = stringEqualsQuoted('name', 'value', true)

      expect(str).toBe("name='value'")
    })

    test('double quoted', () => {
      const str = stringEqualsQuoted('name', 'value', false)

      expect(str).toBe('name="value"')
    })
  })
})
test('isEmptyString', () => {
  expect(isEmptyString(undefined)).toBe(true)
  expect(isEmptyString(null)).toBe(true)
  expect(isEmptyString('')).toBe(true)
  expect(isEmptyString('a')).toBe(false)
  expect(isEmptyString('0')).toBe(false)
  expect(isEmptyString('1')).toBe(false)

  expect(isEmptyString(() => undefined)).toBe(true)
  expect(isEmptyString(() => null)).toBe(true)
  expect(isEmptyString(() => null, false)).toBe(false)
  expect(isEmptyString(() => '1')).toBe(false)
})
test('getCommaUpperList', () => {
  expect(getCommaUpperList('')).toBe('')
  expect(getCommaUpperList('a,b,c')).toBe('A,B,C')
  expect(getCommaUpperList(['a', 'b', 'c'])).toBe('A,B,C')
  expect(getCommaUpperList('a ,   b,c   ')).toBe('A ,   B,C')
})

test('safestrToJson', () => {
  expect(safestrToJson()).toBeUndefined()
  expect(safestrToJson(undefined)).toBeUndefined()
  expect(safestrToJson(null)).toBeUndefined()
  expect(safestrToJson('abc')).toBeUndefined()
  expect(safestrToJson('{"a":1}')).toStrictEqual({ a: 1 })

  console.log = jest.fn()

  expect(safestrToJson('{a:1')).toBeUndefined()
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(safestrToJson('{a:1', 'functionName:')).toBeUndefined()
  expect(console.log).toHaveBeenCalledTimes(2)
})

test('stringIf', () => {
  const stringIfTrue = 'string if true'
  const stringIfFalse = 'string if false'

  expect(stringIf(true, stringIfTrue)).toBe(stringIfTrue)
  expect(stringIf(false, stringIfTrue)).toBe('')
  expect(stringIf(false, stringIfFalse)).toBe('')
  expect(stringIf(true, stringIfTrue, stringIfFalse)).toBe(stringIfTrue)
  expect(stringIf(false, stringIfTrue, stringIfFalse)).toBe(stringIfFalse)
})

test('safestrLowercase', () => {
  expect(safestrLowercase('AAAA')).toBe('aaaa')
  expect(safestrLowercase('')).toBe('')
  expect(safestrLowercase(null)).toBe('')
  expect(safestrLowercase(undefined)).toBe('')
  expect(safestrLowercase('123')).toBe('123')
  expect(safestrLowercase('hello world')).toBe('hello world')
  expect(safestrLowercase('Hello World')).toBe('hello world')
  expect(safestrLowercase('hello World')).toBe('hello world')
})

test('pluralize', () => {
  expect(pluralize(1)).toBe('')
  expect(pluralize(2)).toBe('s')
  expect(pluralize(0)).toBe('s')
  expect(pluralize(-1)).toBe('s')
  expect(pluralize(1, 'item', 'items')).toBe('item')
  expect(pluralize(2, 'item', 'items')).toBe('items')
  expect(pluralize(0, 'item', 'items')).toBe('items')
  expect(pluralize(-1, 'item', 'items')).toBe('items')
})

test('pluralSuffix', () => {
  expect(pluralSuffix(1)).toBe('')
  expect(pluralSuffix(2)).toBe('s')
  expect(pluralSuffix(0)).toBe('s')
  expect(pluralSuffix(-1)).toBe('s')
  expect(pluralSuffix(1, 'item')).toBe('')
  expect(pluralSuffix(2, 'items')).toBe('items')
  expect(pluralSuffix(0, 'items')).toBe('items')
  expect(pluralSuffix(-1, 'items')).toBe('items')
})

test('plusMinus', () => {
  expect(plusMinus(0)).toBe('')
  expect(plusMinus(1)).toBe('+')
  expect(plusMinus(-1)).toBe('-')
})

test('prefixIfHasData', () => {
  const prefix = 'prefix'
  const str = 'string'
  const emptyStr = ''
  const nullStr = null
  const undefinedStr = undefined

  expect(prefixIfHasData(str, prefix)).toBe(prefix)
  expect(prefixIfHasData(' ', prefix)).toBe(prefix)
  expect(prefixIfHasData(emptyStr, prefix)).toBe('')
  expect(prefixIfHasData(nullStr, prefix)).toBe('')
  expect(prefixIfHasData(undefinedStr, prefix)).toBe('')
})
