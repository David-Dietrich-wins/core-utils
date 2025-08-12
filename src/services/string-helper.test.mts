import {
  FirstCharCapitalFormatter,
  StringHelper,
  capitalizeFirstLetter,
  capitalizeWords,
  getCommaUpperList,
  isEmptyString,
  pluralSuffix,
  pluralize,
  plusMinus,
  prefixIfHasData,
  safeHtmlAttribute,
  safestr,
  safestrLowercase,
  safestrToJson,
  safestrUppercase,
  splitIntoArray,
  splitToArray,
  splitToArrayOfIntegers,
  splitToArrayOrStringIfOnlyOne,
  splitToArrayOrStringIfOnlyOneToUpper,
  stringEquals,
  stringEqualsQuoted,
  stringIf,
  stringWrapDoubleQuote,
  stringWrapParen,
  stringWrapSingleQuote,
} from './string-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import { StringOrStringArray } from '../models/types.mjs'
import { jest } from '@jest/globals'

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
  expect(safestr('', null, undefined, '', 'test', undefined)).toBe('test')

  expect(safestr({})).toBe('')
  expect(safestr([])).toBe('')
  expect(safestr([1])).toBe('[1]')

  expect(safestr({ a: 'a', b: 'b' })).toBe('{"a":"a","b":"b"}')
  expect(safestr(['a', 'b'])).toBe('["a","b"]')
  expect(safestr(24)).toBe('24')
  expect(safestr(24000000000000000n)).toBe('24000000000000000')
  expect(safestr(true)).toBe('true')
  expect(safestr([{ a: 'a', b: 'b' }])).toBe('[{"a":"a","b":"b"}]')
  expect(safestr([{ a: 'a', b: 'b' }, { c: 'c' }])).toBe(
    '[{"a":"a","b":"b"},{"c":"c"}]'
  )

  const symbol1 = Symbol('description'),
    symbolUnique: unique symbol = Symbol('any description')

  expect(safestr(symbol1)).toBe('Symbol(description)')
  // Symbols do not contain values for JSON serialization
  expect(safestr({ [symbol1]: 'abc' })).toBe('')
  // Symbols do not contain values for JSON serialization
  expect(safestr(JSON.stringify({ [symbol1]: 'abc' }))).toBe('{}')
  // Symbols do not contain values for JSON serialization
  expect(safestr(JSON.parse(JSON.stringify({ [symbol1]: 'abc' })))).toBe('')
  expect(safestr({ symbol1: 'abc' })).toBe('{"symbol1":"abc"}')
  expect(safestr([symbol1])).toBe('[null]')

  expect(safestr(symbolUnique)).toBe('Symbol(any description)')
  // Unique symbols cannot be serialized
  expect(safestr({ [symbolUnique]: 'abc' })).toBe('')
  expect(safestr({ symbolUnique: 'abc' })).toBe('{"symbolUnique":"abc"}')
  expect(safestr([symbolUnique])).toBe('[null]')
  expect(safestr([Symbol('test')])).toBe('[null]')
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
  const stringIfFalse = 'string if false',
    stringIfTrue = 'string if true'

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

test('safestrUppercase', () => {
  expect(safestrUppercase('aaaa')).toBe('AAAA')
  expect(safestrUppercase('')).toBe('')
  expect(safestrUppercase(null)).toBe('')
  expect(safestrUppercase(undefined)).toBe('')
  expect(safestrUppercase('123')).toBe('123')
  expect(safestrUppercase('HEllo world')).toBe('HELLO WORLD')
  expect(safestrUppercase('Hello World')).toBe('HELLO WORLD')
  expect(safestrUppercase('hello World')).toBe('HELLO WORLD')
  expect(safestrUppercase(' hello World ')).toBe('HELLO WORLD')
  expect(safestrUppercase(' hello World ', false)).toBe(' HELLO WORLD ')
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
  const emptyStr = '',
    nullStr = null,
    prefix = 'prefix',
    str = 'string',
    undefinedStr = undefined

  expect(prefixIfHasData(str, prefix)).toBe(prefix)
  expect(prefixIfHasData(' ', prefix)).toBe(prefix)
  expect(prefixIfHasData(emptyStr, prefix)).toBe('')
  expect(prefixIfHasData(nullStr, prefix)).toBe('')
  expect(prefixIfHasData(undefinedStr, prefix)).toBe('')
})

test('FirstCharCapitalFormatter', () => {
  const str = 'hello world',
    str2 = 'Hello world',
    str3 = 'HELLO WORLD',
    str4 = 'hELLO WORLD',
    str5 = 'hELLO wORLD'

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

  expect(
    StringHelper.safestr(' ab ', {
      suffix: '-test',
      trimStart: true,
      uppercase: true,
    })
  ).toBe('AB -test')
  expect(
    StringHelper.safestr(' Ab ', {
      lowercase: true,
      suffix: '-test',
      trimStart: true,
    })
  ).toBe('ab -test')
  expect(() =>
    StringHelper.safestr(' Ab ', {
      lowercase: true,
      suffix: '-test',
      trimStart: true,
      uppercase: true,
    })
  ).toThrow(AppException)
})

test('ReplaceTwoOrMoreSpacesWithSingleSpace', () => {
  const expected = 'This is a test string'

  expect(
    StringHelper.ReplaceTwoOrMoreSpacesWithSingleSpace(
      'This  is   a    test   string'
    )
  ).toBe(expected)
  expect(
    StringHelper.ReplaceTwoOrMoreSpacesWithSingleSpace(
      'This  is \t\r \n  a    test   string'
    )
  ).toBe(expected)
  expect(
    StringHelper.ReplaceTwoOrMoreSpacesWithSingleSpace(
      'This  is \n  a  \t  test \r  string'
    )
  ).toBe(expected)

  expect(StringHelper.ReplaceTwoOrMoreSpacesWithSingleSpace('')).toBe('')
  expect(StringHelper.ReplaceTwoOrMoreSpacesWithSingleSpace(' ')).toBe(' ')
  expect(StringHelper.ReplaceTwoOrMoreSpacesWithSingleSpace('  ')).toBe(' ')
  expect(StringHelper.ReplaceTwoOrMoreSpacesWithSingleSpace('   \n\r\t')).toBe(
    ' '
  )
  expect(StringHelper.ReplaceTwoOrMoreSpacesWithSingleSpace(null)).toBe('')
  expect(StringHelper.ReplaceTwoOrMoreSpacesWithSingleSpace(undefined)).toBe('')
})

test('StringHelper.safePrefix', () => {
  const prefix = 'prefix-',
    str = 'test'

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
  const str = 'test',
    suffix = '-suffix'

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

describe('splitToArray', () => {
  test(splitToArray.name, () => {
    let aastrOrArray: StringOrStringArray = 'a,b , c,',
      arr = splitToArray(aastrOrArray)
    const removeEmpties = true,
      splitter = ',',
      trimStrings = true

    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(aastrOrArray, splitter)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(aastrOrArray, splitter, removeEmpties)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(aastrOrArray, splitter, removeEmpties, trimStrings)
    expect(arr).toEqual(['a', 'b', 'c'])

    aastrOrArray = 'a'
    arr = splitToArray(aastrOrArray)
    expect(arr).toEqual(['a'])

    arr = splitToArray(aastrOrArray, splitter)
    expect(arr).toEqual(['a'])

    arr = splitToArray(aastrOrArray, splitter, removeEmpties)
    expect(arr).toEqual(['a'])

    arr = splitToArray(aastrOrArray, splitter, removeEmpties, trimStrings)
    expect(arr).toEqual(['a'])

    // StrOrArray as Array
    aastrOrArray = ['a', 'b ', ' c', '']
    arr = splitToArray(aastrOrArray)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(aastrOrArray, splitter)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(aastrOrArray, splitter, removeEmpties)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(aastrOrArray, splitter, removeEmpties, trimStrings)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(undefined)
    expect(arr).toEqual([])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    expect(splitToArray(2 as any)).toStrictEqual(['2'])
  })

  describe(splitToArrayOrStringIfOnlyOne.name, () => {
    test('default', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b , c',
        trimStrings = true
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no remove empties', () => {
      const removeEmpties = false,
        splitter = ',',
        strOrArray = 'a,b   , c,',
        trimStrings = false
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c', ''])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c', ''])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no trim strings', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b   , c',
        trimStrings = false
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')

      arr = splitToArrayOrStringIfOnlyOne(
        '',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('')
    })
  })

  describe(splitToArrayOrStringIfOnlyOneToUpper.name, () => {
    test('default', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b , c',
        trimStrings = true
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        'A',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no remove empties', () => {
      const removeEmpties = false,
        splitter = ',',
        strOrArray = 'a,b   , c,',
        trimStrings = false
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C', ''])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C', ''])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no trim strings', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b   , c',
        trimStrings = false
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })
  })

  test(splitToArrayOfIntegers.name, () => {
    let arr = splitToArrayOfIntegers('1,2,3,4,5,6,7,8,9,10')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers('[1,2,3,4,5,6,7,8,9,10]')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '     [   1,2 , 3, 4,    5, 6     ,7,8,9,10    ]  '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '[        1,2 , 3, 4,    5, 6     ,7,8,9,10      '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '        1,2 , 3, 4,    5, 6     ,7,8,9,10  ]    '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})

test(safeHtmlAttribute.name, () => {
  expect(safeHtmlAttribute('')).toBe('')
  expect(safeHtmlAttribute(null)).toBe('')
  expect(safeHtmlAttribute(undefined)).toBe('')
  expect(safeHtmlAttribute('test')).toBe('test')
  expect(safeHtmlAttribute(['test'])).toBe('test')
  expect(safeHtmlAttribute(['test', 'test2'])).toBe('test-test2')
  expect(safeHtmlAttribute(['tes,t', 'test2'])).toBe('tes-t-test2')
  expect(safeHtmlAttribute(['tes,t', 'test2'], 'abc')).toBe('tesabctabctest2')
})

describe(splitIntoArray.name, () => {
  test('splitIntoArray', () => {
    let aastrOrArray: StringOrStringArray = 'a,b \n, c,',
      arr = splitIntoArray(aastrOrArray)
    const replaceNonprintable = false,
      splitter = ','

    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter)
    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter, replaceNonprintable)
    expect(arr).toEqual(['a', 'b \n', ' c', ''])

    aastrOrArray = 'a'
    arr = splitIntoArray(aastrOrArray)
    expect(arr).toEqual(['a'])

    arr = splitIntoArray(aastrOrArray, splitter)
    expect(arr).toEqual(['a'])

    arr = splitIntoArray(aastrOrArray, splitter, replaceNonprintable)
    expect(arr).toEqual(['a'])

    // StrOrArray as Array
    aastrOrArray = ['a', 'b ', ' c\t\t', '']
    arr = splitIntoArray(aastrOrArray)
    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter)
    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter, replaceNonprintable)
    expect(arr).toEqual(['a', 'b ', ' c\t\t', ''])

    arr = splitIntoArray(undefined)
    expect(arr).toEqual(['undefined'])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    expect(splitIntoArray(2 as any)).toStrictEqual(['2'])
  })

  describe('splitToArrayOrStringIfOnlyOne no remove empties', () => {
    test('default', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b , c',
        trimStrings = true
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no remove empties', () => {
      const removeEmpties = false,
        splitter = ',',
        strOrArray = 'a,b   , c,',
        trimStrings = false
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c', ''])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c', ''])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no trim strings', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b   , c',
        trimStrings = false
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')

      arr = splitToArrayOrStringIfOnlyOne(
        '',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('')
    })
  })

  describe('splitToArrayOrStringIfOnlyOneToUpper no remove empties', () => {
    test('default', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b , c',
        trimStrings = true
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        'A',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no remove empties', () => {
      const removeEmpties = false,
        splitter = ',',
        strOrArray = 'a,b   , c,',
        trimStrings = false
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C', ''])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C', ''])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no trim strings', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b   , c',
        trimStrings = false
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })
  })

  test('splitToArrayOfIntegers', () => {
    let arr = splitToArrayOfIntegers('1,2,3,4,5,6,7,8,9,10')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers('[1,2,3,4,5,6,7,8,9,10]')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '     [   1,2 , 3, 4,    5, 6     ,7,8,9,10    ]  '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '[        1,2 , 3, 4,    5, 6     ,7,8,9,10      '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '        1,2 , 3, 4,    5, 6     ,7,8,9,10  ]    '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})

test('GenerateRandomString', () => {
  const length = 10,
    randomString = StringHelper.GenerateRandomString(length),
    randomString2 = StringHelper.GenerateRandomString(length, 'abcde')

  expect(randomString).toHaveLength(length)
  expect(randomString).toMatch(/^[a-zA-Z0-9]{1,10}$/u)

  expect(randomString2).toHaveLength(length)
  expect(randomString2).toMatch(/^[abcde]{1,10}$/u)
})

test(StringHelper.RemoveLeadingNumbersAndWhitespace.name, () => {
  expect(StringHelper.RemoveLeadingNumbersAndWhitespace('123abc')).toBe('abc')
  expect(StringHelper.RemoveLeadingNumbersAndWhitespace('   123abc')).toBe(
    'abc'
  )
  expect(StringHelper.RemoveLeadingNumbersAndWhitespace('   abc')).toBe('abc')
  expect(StringHelper.RemoveLeadingNumbersAndWhitespace('123   abc')).toBe(
    'abc'
  )
  expect(StringHelper.RemoveLeadingNumbersAndWhitespace('123   ')).toBe('')
  expect(StringHelper.RemoveLeadingNumbersAndWhitespace('   ')).toBe('')
})
