/* eslint-disable quotes */
import { jest } from '@jest/globals'
import { StringOrStringArray } from '../models/types.mjs'
import {
  capitalizeFirstLetter,
  capitalizeWords,
  FirstCharCapitalFormatter,
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
  StringHelper,
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

test('FirstCharCapitalFormatter', () => {
  const str = 'hello world'
  const str2 = 'Hello world'
  const str3 = 'HELLO WORLD'
  const str4 = 'hELLO WORLD'
  const str5 = 'hELLO wORLD'

  expect(FirstCharCapitalFormatter(str)).toBe('Hello world')
  expect(FirstCharCapitalFormatter(str2)).toBe('Hello world')
  expect(FirstCharCapitalFormatter(str3)).toBe('HELLO WORLD')
  expect(FirstCharCapitalFormatter(str4)).toBe('HELLO WORLD')
  expect(FirstCharCapitalFormatter(str5)).toBe('HELLO wORLD')
})

describe('StringHelper', () => {
  test('safestr', () => {
    expect(StringHelper.safestr(null)).toBe('')
    expect(StringHelper.safestr(undefined)).toBe('')
    expect(StringHelper.safestr('')).toBe('')
    expect(StringHelper.safestr('null')).toBe('null')

    expect(StringHelper.safestr('', { ifEmpty: 'test' })).toBe('test')
    expect(
      StringHelper.safestr('', {
        ifEmpty: 'test',
        prefix: 'prefix-',
        suffix: '-suffix',
      })
    ).toBe('test')
    expect(
      StringHelper.safestr('ab', {
        ifEmpty: 'test',
        prefix: 'prefix-',
        suffix: '-suffix',
      })
    ).toBe('prefix-ab-suffix')

    expect(StringHelper.safestr('', { prefix: 'test-' })).toBe('')
    expect(StringHelper.safestr('ab', { prefix: 'test-' })).toBe('test-ab')

    expect(StringHelper.safestr('', { suffix: '-test' })).toBe('')
    expect(StringHelper.safestr('ab', { suffix: '-test' })).toBe('ab-test')

    expect(
      StringHelper.safestr(' ab ', { suffix: '-test', trimEnd: true })
    ).toBe(' ab-test')
    expect(
      StringHelper.safestr(' ab ', { suffix: '-test', trimStart: true })
    ).toBe('ab -test')

    expect(StringHelper.safestr('', '')).toBe('')
    expect(StringHelper.safestr('', undefined)).toBe('')
    expect(StringHelper.safestr('', null)).toBe('')
  })
})

test('StringHelper.safePrefix', () => {
  const str = 'test'
  const prefix = 'prefix-'

  expect(StringHelper.safePrefix(str, prefix)).toBe('prefix-test')
  expect(StringHelper.safePrefix(str, prefix)).toBe('prefix-test')
  expect(StringHelper.safePrefix('', prefix)).toBe('')
  expect(StringHelper.safePrefix(null, prefix)).toBe('')
  expect(StringHelper.safePrefix(undefined, prefix)).toBe('')
  expect(StringHelper.safePrefix(0)).toBe(' 0')
  expect(StringHelper.safePrefix(0, prefix)).toBe('prefix-0')
  expect(StringHelper.safePrefix(-1, prefix)).toBe('prefix--1')
  expect(StringHelper.safePrefix(5, prefix)).toBe('prefix-5')
  expect(StringHelper.safePrefix(true, prefix)).toBe('prefix-true')
  expect(StringHelper.safePrefix(false, prefix)).toBe('prefix-false')
  expect(StringHelper.safePrefix(false)).toBe(' false')
})

test('StringHelper.safeSuffix', () => {
  const str = 'test'
  const suffix = '-suffix'

  expect(StringHelper.safeSuffix(str, suffix)).toBe('test-suffix')
  expect(StringHelper.safeSuffix(str, suffix)).toBe('test-suffix')
  expect(StringHelper.safeSuffix('', suffix)).toBe('')
  expect(StringHelper.safeSuffix(null, suffix)).toBe('')
  expect(StringHelper.safeSuffix(undefined, suffix)).toBe('')
  expect(StringHelper.safeSuffix(0, suffix)).toBe('0-suffix')
  expect(StringHelper.safeSuffix(0)).toBe('0 ')
  expect(StringHelper.safeSuffix(-1, suffix)).toBe('-1-suffix')
  expect(StringHelper.safeSuffix(5, suffix)).toBe('5-suffix')
  expect(StringHelper.safeSuffix(true, suffix)).toBe('true-suffix')
  expect(StringHelper.safeSuffix(false, suffix)).toBe('false-suffix')
  expect(StringHelper.safeSuffix(false)).toBe('false ')
})
describe('StringHelper.SplitToArray', () => {
  test('StringHelper.SplitToArray', () => {
    let strOrArray: StringOrStringArray = 'a,b , c,'
    const splitter = ','
    const removeEmpties = true
    const trimStrings = true
    let arr = StringHelper.SplitToArray(strOrArray)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = StringHelper.SplitToArray(strOrArray, splitter)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = StringHelper.SplitToArray(strOrArray, splitter, removeEmpties)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = StringHelper.SplitToArray(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )
    expect(arr).toEqual(['a', 'b', 'c'])

    strOrArray = 'a'
    arr = StringHelper.SplitToArray(strOrArray)
    expect(arr).toEqual(['a'])

    arr = StringHelper.SplitToArray(strOrArray, splitter)
    expect(arr).toEqual(['a'])

    arr = StringHelper.SplitToArray(strOrArray, splitter, removeEmpties)
    expect(arr).toEqual(['a'])

    arr = StringHelper.SplitToArray(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )
    expect(arr).toEqual(['a'])

    // strOrArray as Array
    strOrArray = ['a', 'b ', ' c', '']
    arr = StringHelper.SplitToArray(strOrArray)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = StringHelper.SplitToArray(strOrArray, splitter)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = StringHelper.SplitToArray(strOrArray, splitter, removeEmpties)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = StringHelper.SplitToArray(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = StringHelper.SplitToArray(undefined)
    expect(arr).toEqual([])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(StringHelper.SplitToArray(2 as any)).toStrictEqual(['2'])
  })

  describe('StringHelper.SplitToArrayOrStringIfOnlyOne no remove empties', () => {
    test('default', () => {
      const strOrArray = 'a,b , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = true
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no remove empties', () => {
      const strOrArray = 'a,b   , c,'
      const splitter = ','
      const removeEmpties = false
      const trimStrings = false
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['a', 'b', 'c', ''])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c', ''])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no trim strings', () => {
      const strOrArray = 'a,b   , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = false
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        '',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('')
    })
  })

  describe('StringHelper.SplitToArrayOrStringIfOnlyOneToUpper no remove empties', () => {
    test('default', () => {
      const strOrArray = 'a,b , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = true
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        'A',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no remove empties', () => {
      const strOrArray = 'a,b   , c,'
      const splitter = ','
      const removeEmpties = false
      const trimStrings = false
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C', ''])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C', ''])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no trim strings', () => {
      const strOrArray = 'a,b   , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = false
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })
  })

  test('StringHelper.SplitToArrayOfIntegers', () => {
    let arr = StringHelper.SplitToArrayOfIntegers('1,2,3,4,5,6,7,8,9,10')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = StringHelper.SplitToArrayOfIntegers('[1,2,3,4,5,6,7,8,9,10]')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = StringHelper.SplitToArrayOfIntegers(
      '     [   1,2 , 3, 4,    5, 6     ,7,8,9,10    ]  '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = StringHelper.SplitToArrayOfIntegers(
      '[        1,2 , 3, 4,    5, 6     ,7,8,9,10      '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = StringHelper.SplitToArrayOfIntegers(
      '        1,2 , 3, 4,    5, 6     ,7,8,9,10  ]    '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})

test('safeHtmlAttribute', () => {
  expect(StringHelper.safeHtmlAttribute('')).toBe('')
  expect(StringHelper.safeHtmlAttribute(null)).toBe('')
  expect(StringHelper.safeHtmlAttribute(undefined)).toBe('')
  expect(StringHelper.safeHtmlAttribute('test')).toBe('test')
  expect(StringHelper.safeHtmlAttribute(['test'])).toBe('test')
  expect(StringHelper.safeHtmlAttribute(['test', 'test2'])).toBe('test-test2')
  expect(StringHelper.safeHtmlAttribute(['tes,t', 'test2'])).toBe('tes-t-test2')
  expect(StringHelper.safeHtmlAttribute(['tes,t', 'test2'], 'abc')).toBe(
    'tesabctabctest2'
  )
})

describe('StringHelper.SplitIntoArray', () => {
  test('StringHelper.SplitIntoArray', () => {
    let strOrArray: StringOrStringArray = 'a,b \n, c,'
    const splitter = ','
    const replaceNonprintable = false

    let arr = StringHelper.SplitIntoArray(strOrArray)
    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = StringHelper.SplitIntoArray(strOrArray, splitter)
    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = StringHelper.SplitIntoArray(strOrArray, splitter, replaceNonprintable)
    expect(arr).toEqual(['a', 'b \n', ' c', ''])

    strOrArray = 'a'
    arr = StringHelper.SplitIntoArray(strOrArray)
    expect(arr).toEqual(['a'])

    arr = StringHelper.SplitIntoArray(strOrArray, splitter)
    expect(arr).toEqual(['a'])

    arr = StringHelper.SplitIntoArray(strOrArray, splitter, replaceNonprintable)
    expect(arr).toEqual(['a'])

    // strOrArray as Array
    strOrArray = ['a', 'b ', ' c\t\t', '']
    arr = StringHelper.SplitIntoArray(strOrArray)
    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = StringHelper.SplitIntoArray(strOrArray, splitter)
    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = StringHelper.SplitIntoArray(strOrArray, splitter, replaceNonprintable)
    expect(arr).toEqual(['a', 'b ', ' c\t\t', ''])

    arr = StringHelper.SplitIntoArray(undefined)
    expect(arr).toEqual(['undefined'])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(StringHelper.SplitIntoArray(2 as any)).toStrictEqual(['2'])
  })

  describe('StringHelper.SplitToArrayOrStringIfOnlyOne no remove empties', () => {
    test('default', () => {
      const strOrArray = 'a,b , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = true
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no remove empties', () => {
      const strOrArray = 'a,b   , c,'
      const splitter = ','
      const removeEmpties = false
      const trimStrings = false
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['a', 'b', 'c', ''])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c', ''])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no trim strings', () => {
      const strOrArray = 'a,b   , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = false
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        '',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('')
    })
  })

  describe('StringHelper.SplitToArrayOrStringIfOnlyOneToUpper no remove empties', () => {
    test('default', () => {
      const strOrArray = 'a,b , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = true
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        'A',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no remove empties', () => {
      const strOrArray = 'a,b   , c,'
      const splitter = ','
      const removeEmpties = false
      const trimStrings = false
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C', ''])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C', ''])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no trim strings', () => {
      const strOrArray = 'a,b   , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = false
      let arr: StringOrStringArray =
        StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C'])

      arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })
  })

  test('StringHelper.SplitToArrayOfIntegers', () => {
    let arr = StringHelper.SplitToArrayOfIntegers('1,2,3,4,5,6,7,8,9,10')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = StringHelper.SplitToArrayOfIntegers('[1,2,3,4,5,6,7,8,9,10]')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = StringHelper.SplitToArrayOfIntegers(
      '     [   1,2 , 3, 4,    5, 6     ,7,8,9,10    ]  '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = StringHelper.SplitToArrayOfIntegers(
      '[        1,2 , 3, 4,    5, 6     ,7,8,9,10      '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = StringHelper.SplitToArrayOfIntegers(
      '        1,2 , 3, 4,    5, 6     ,7,8,9,10  ]    '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})
