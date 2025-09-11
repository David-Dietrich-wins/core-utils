import {
  CONST_CharsNumbers,
  capitalizeFirstLetter,
  capitalizeWords,
  exceedsMaxNumberOfCharacters,
  firstCharCapitalFormatter,
  generateRandomString,
  getCommaUpperList,
  hasConsecutiveNumbers,
  hasNumbersOnly,
  isEmptyString,
  isStringish,
  matchesRegex,
  maxNumberOfAnyOneCharacter,
  maxRepeatedCharCount,
  pluralSuffix,
  pluralize,
  plusMinus,
  randomStringGenerate,
  removeLeadingNumbersAndWhitespace,
  replaceTwoOrMoreSpacesWithSingleSpace,
  safeHtmlAttribute,
  safePrefix,
  safeSuffix,
  safestrLowercase,
  safestrPlus,
  safestrToJson,
  safestrUppercase,
  strTrimIfNotNullish,
  stringEquals,
  stringEqualsQuoted,
  stringIf,
  stringWrapDoubleQuote,
  stringWrapParen,
  stringWrapSingleQuote,
} from './string-helper.mjs'
import { describe, expect, it } from '@jest/globals'
import { AppException } from '../models/AppException.mjs'
import { mockConsoleLog } from '../jest.setup.mjs'

describe('capitalizeFirstLetter', () => {
  it('capitalizes first letter of a string', () => {
    expect.assertions(7)
    expect(capitalizeFirstLetter('hello')).toBe('Hello')
    expect(capitalizeFirstLetter('')).toBe('')
    expect(capitalizeFirstLetter(null)).toBe('')
    expect(capitalizeFirstLetter(undefined)).toBe('')
    expect(capitalizeFirstLetter('123')).toBe('123')
    expect(capitalizeFirstLetter('hello world')).toBe('Hello world')
    expect(capitalizeFirstLetter('hello world!')).toBe('Hello world!')
  })

  it('capitalizeWords', () => {
    expect.assertions(9)

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
})

describe('string wrappers', () => {
  it('wraps a string in single quotes', () => {
    expect.assertions(1)

    const str = stringWrapSingleQuote('test')

    expect(str).toBe("'test'")
  })

  it('stringWrapParen', () => {
    expect.assertions(1)

    const str = stringWrapParen('test')

    expect(str).toBe('(test)')
  })

  it('stringWrapDoubleQuote', () => {
    expect.assertions(1)

    const str = stringWrapDoubleQuote('test')

    expect(str).toBe('"test"')
  })

  it('nothing', () => {
    expect.assertions(1)

    const str = stringEquals('', '')

    expect(str).toBe('')
  })

  it('not wrapped', () => {
    expect.assertions(1)

    const str = stringEquals('name', 'value')

    expect(str).toBe('name=value')
  })

  it('wrapped', () => {
    expect.assertions(1)

    const str = stringEquals('name', 'value', 'ab')

    expect(str).toBe('name=abvalueab')
  })
})

describe('stringEqualsQuoted', () => {
  it('nothing', () => {
    expect.assertions(2)

    expect(stringEqualsQuoted('', '', true)).toBe('')

    expect(stringEqualsQuoted('', '', false)).toBe('')
  })

  it('name/value', () => {
    expect.assertions(6)

    expect(stringEqualsQuoted('name', '', false)).toBe('name=""')
    expect(stringEqualsQuoted('name', 'value', false)).toBe('name="value"')

    expect(stringEqualsQuoted('name', '')).toBe("name=''")
    expect(stringEqualsQuoted('name', 'value')).toBe("name='value'")

    expect(stringEqualsQuoted('name', '', true)).toBe("name=''")
    expect(stringEqualsQuoted('name', 'value', true)).toBe("name='value'")
  })

  it('single quoted', () => {
    expect.assertions(1)

    const str = stringEqualsQuoted('name', 'value', true)

    expect(str).toBe("name='value'")
  })

  it('double quoted', () => {
    expect.assertions(1)

    const str = stringEqualsQuoted('name', 'value', false)

    expect(str).toBe('name="value"')
  })
})

describe('string tests', () => {
  it('exceedsMaxNumberOfCharacters', () => {
    expect.assertions(2)

    expect(exceedsMaxNumberOfCharacters('123456', 5)).toBe(true)
    expect(exceedsMaxNumberOfCharacters('12345', 5)).toBe(false)
  })

  it('safestrToJson', () => {
    expect.assertions(11)

    expect(safestrToJson()).toBeUndefined()
    expect(safestrToJson(undefined)).toBeUndefined()
    expect(safestrToJson(null)).toBeUndefined()
    expect(safestrToJson('abc')).toBeUndefined()
    expect(safestrToJson('{"a":1}')).toStrictEqual({ a: 1 })

    mockConsoleLog.mockClear()

    expect(safestrToJson('{a:1')).toBeUndefined()
    expect(mockConsoleLog).toHaveBeenCalledTimes(1)
    expect(mockConsoleLog.mock.calls).toStrictEqual([
      expect.arrayContaining([
        'safestrToJson',
        new SyntaxError(
          "Expected property name or '}' in JSON at position 1 (line 1 column 2)"
        ),
      ]),
    ])
    // expect(mockConsoleLog.mock.calls[0][0]).toBe('safestrToJson')
    // expect(mockConsoleLog.mock.calls[0][1]).toStrictEqual(
    //   new SyntaxError(
    //     "Expected property name or '}' in JSON at position 1 (line 1 column 2)"
    //   )
    // )

    mockConsoleLog.mockClear()

    const testFunctionName = 'test-functionName: '

    expect(safestrToJson('{a:1', testFunctionName)).toBeUndefined()
    expect(mockConsoleLog).toHaveBeenCalledTimes(1)
    expect(mockConsoleLog.mock.calls).toStrictEqual([
      expect.arrayContaining([
        testFunctionName,
        new SyntaxError(
          "Expected property name or '}' in JSON at position 1 (line 1 column 2)"
        ),
      ]),
    ])
  })

  it('stringIf', () => {
    expect.assertions(5)

    const stringIfFalse = 'string if false',
      stringIfTrue = 'string if true'

    expect(stringIf(true, stringIfTrue)).toBe(stringIfTrue)
    expect(stringIf(false, stringIfTrue)).toBe('')
    expect(stringIf(false, stringIfFalse)).toBe('')
    expect(stringIf(true, stringIfTrue, stringIfFalse)).toBe(stringIfTrue)
    expect(stringIf(false, stringIfTrue, stringIfFalse)).toBe(stringIfFalse)
  })

  it('isEmptyString', () => {
    expect.assertions(10)

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

  it('maxNumberOfAnyOneCharacter', () => {
    expect.assertions(26)

    expect(maxNumberOfAnyOneCharacter('', -1)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('', 0)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('a', -1)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('a', 0)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('a', 1)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('aa', -1)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('aa', 0)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('aa', 1)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('aa', 2)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('ab', -1)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('ab', 0)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('ab', 1)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('ab', 2)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('abc', 0)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('abc', 1)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('abc', 2)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('aabbcc', 0)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('aabbcc', 1)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('aabbcc', 2)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('aabbcc', 3)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('aaabbbccc', 0)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('aaabbbccc', 1)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('aaabbbccc', 2)).toBe(true)
    expect(maxNumberOfAnyOneCharacter('aaabbbccc', 3)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('aaabbbccc', 4)).toBe(false)
    expect(maxNumberOfAnyOneCharacter('aaabbbccc', 1000)).toBe(false)
  })

  it('matchesRegex', () => {
    expect.assertions(6)

    expect(matchesRegex('', /^[a-z]+$/u)).toBe(true)
    expect(matchesRegex('', /^[a-z]+$/u, false)).toBe(false)

    expect(matchesRegex('abc', /^[a-z]+$/u)).toBe(true)
    expect(matchesRegex('ABC', /^[a-z]+$/u)).toBe(false)
    expect(matchesRegex('123', /^[a-z]+$/u)).toBe(false)

    expect(matchesRegex('abc', /^[a-z]+$/u)).toBe(true)
  })

  it('hasNumbersOnly', () => {
    expect.assertions(7)

    expect(hasNumbersOnly('')).toBe(true)
    expect(hasNumbersOnly('', true)).toBe(true)
    expect(hasNumbersOnly('', false)).toBe(false)
    expect(hasNumbersOnly('abc')).toBe(false)
    expect(hasNumbersOnly('123')).toBe(true)
    expect(hasNumbersOnly('a1b2c3')).toBe(false)
    expect(hasNumbersOnly('abc123')).toBe(false)
  })

  it('getCommaUpperList', () => {
    expect.assertions(4)

    expect(getCommaUpperList('')).toBe('')
    expect(getCommaUpperList('a,b,c')).toBe('A,B,C')
    expect(getCommaUpperList(['a', 'b', 'c'])).toBe('A,B,C')
    expect(getCommaUpperList('a ,   b,c   ')).toBe('A ,   B,C')
  })

  it('hasConsecutiveNumbers', () => {
    expect.assertions(5)

    expect(hasConsecutiveNumbers('123')).toBe(true)
    expect(hasConsecutiveNumbers('abc')).toBe(false)
    expect(hasConsecutiveNumbers('1a2b3c')).toBe(false)
    expect(hasConsecutiveNumbers('7890')).toBe(true)
    expect(hasConsecutiveNumbers('0987')).toBe(true)
  })

  it('maxRepeatedCharCount', () => {
    expect.assertions(6)

    expect(maxRepeatedCharCount('')).toBe(0)
    expect(maxRepeatedCharCount('a')).toBe(1)
    expect(maxRepeatedCharCount('aa')).toBe(2)
    expect(maxRepeatedCharCount('ab')).toBe(1)
    expect(maxRepeatedCharCount('aabb')).toBe(2)
    expect(maxRepeatedCharCount('aaabbb')).toBe(3)
  })
})

describe('utilities', () => {
  it('pluralize', () => {
    expect.assertions(8)

    expect(pluralize(1)).toBe('')
    expect(pluralize(2)).toBe('s')
    expect(pluralize(0)).toBe('s')
    expect(pluralize(-1)).toBe('s')
    expect(pluralize(1, 'item', 'items')).toBe('item')
    expect(pluralize(2, 'item', 'items')).toBe('items')
    expect(pluralize(0, 'item', 'items')).toBe('items')
    expect(pluralize(-1, 'item', 'items')).toBe('items')
  })

  it('pluralSuffix', () => {
    expect.assertions(8)

    expect(pluralSuffix(1)).toBe('')
    expect(pluralSuffix(2)).toBe('s')
    expect(pluralSuffix(0)).toBe('s')
    expect(pluralSuffix(-1)).toBe('s')
    expect(pluralSuffix(1, 'item')).toBe('')
    expect(pluralSuffix(2, 'items')).toBe('items')
    expect(pluralSuffix(0, 'items')).toBe('items')
    expect(pluralSuffix(-1, 'items')).toBe('items')
  })

  it('plusMinus', () => {
    expect.assertions(3)

    expect(plusMinus(0)).toBe('')
    expect(plusMinus(1)).toBe('+')
    expect(plusMinus(-1)).toBe('-')
  })

  it('strTrimIfNotNullish', () => {
    expect.assertions(6)

    expect(strTrimIfNotNullish(undefined)).toBeUndefined()
    expect(strTrimIfNotNullish(null)).toBeUndefined()
    expect(strTrimIfNotNullish('')).toBe('')
    expect(strTrimIfNotNullish(' ')).toBe('')
    expect(strTrimIfNotNullish(' a ')).toBe('a')
    expect(strTrimIfNotNullish(' a b ')).toBe('a b')
  })

  it('safestrLowercase', () => {
    expect.assertions(3)

    expect(safestrLowercase('A')).toBe('a')
    expect(safestrLowercase('A ')).toBe('a')
    expect(safestrLowercase(' A ', false)).toBe(' a ')
  })

  it('safestrUppercase', () => {
    expect.assertions(3)

    expect(safestrUppercase('a')).toBe('A')
    expect(safestrUppercase('a ')).toBe('A')
    expect(safestrUppercase(' a ', false)).toBe(' A ')
  })
})

describe('randomStringGenerate', () => {
  it('no params', () => {
    expect.assertions(1)

    const lengthForRandomString = 4,
      ranstr = randomStringGenerate()

    expect(ranstr).toHaveLength(lengthForRandomString)
  })

  it('proper length', () => {
    expect.assertions(1)

    const lengthForRandomString = 4,
      ranstr = randomStringGenerate(lengthForRandomString)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })

  it('using chars and numbers', () => {
    expect.assertions(1)

    const lengthForRandomString = 4,
      ranstr = randomStringGenerate(lengthForRandomString, CONST_CharsNumbers)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
})

describe('isStringish', () => {
  it.each(['', 'abc', () => '123', () => 'a;dlkfja;lkdjfa;slkjf'])(
    'true: %p',
    (input) => {
      expect.assertions(1)

      expect(isStringish(input)).toBe(true)
    }
  )

  it.each([
    null,
    undefined,
    true,
    false,
    1,
    [],
    5n,
    {},
    () => null,
    () => undefined,
    () => true,
    () => false,
    () => 4000n,
    () => 2342343,
    () => ['abc'],
    () => {},
  ])('false: %p', (input) => {
    expect.assertions(1)

    expect(isStringish(input)).toBe(false)
  })
})

describe('formatters', () => {
  it('firstCharCapitalFormatter', () => {
    expect.assertions(5)

    const str = 'hello world',
      str2 = 'Hello world',
      str3 = 'HELLO WORLD',
      str4 = 'hELLO WORLD',
      str5 = 'hELLO wORLD'

    expect(firstCharCapitalFormatter(str)).toBe('Hello world')
    expect(firstCharCapitalFormatter(str2)).toBe('Hello world')
    expect(firstCharCapitalFormatter(str3)).toBe('HELLO WORLD')
    expect(firstCharCapitalFormatter(str4)).toBe('HELLO WORLD')
    expect(firstCharCapitalFormatter(str5)).toBe('HELLO wORLD')
  })

  it('safestrPlus', () => {
    expect.assertions(19)

    expect(safestrPlus(null)).toBe('')
    expect(safestrPlus(undefined)).toBe('')
    expect(safestrPlus('')).toBe('')
    expect(safestrPlus('null')).toBe('null')

    expect(safestrPlus('', { ifEmpty: 'test' })).toBe('test')
    expect(
      safestrPlus('', {
        ifEmpty: 'test',
        prefix: 'prefix-',
        suffix: '-suffix',
      })
    ).toBe('test')
    expect(
      safestrPlus('ab', {
        ifEmpty: 'test',
        prefix: 'prefix-',
        suffix: '-suffix',
      })
    ).toBe('prefix-ab-suffix')

    expect(safestrPlus('', { prefix: 'test-' })).toBe('')
    expect(safestrPlus('ab', { prefix: 'test-' })).toBe('test-ab')

    expect(safestrPlus('', { suffix: '-test' })).toBe('')
    expect(safestrPlus('ab', { suffix: '-test' })).toBe('ab-test')

    expect(safestrPlus(' ab ', { suffix: '-test', trimEnd: true })).toBe(
      ' ab-test'
    )
    expect(safestrPlus(' ab ', { suffix: '-test', trimStart: true })).toBe(
      'ab -test'
    )

    expect(safestrPlus('', '')).toBe('')
    expect(safestrPlus('', undefined)).toBe('')
    expect(safestrPlus('', null)).toBe('')

    expect(
      safestrPlus(' ab ', {
        suffix: '-test',
        trimStart: true,
        uppercase: true,
      })
    ).toBe('AB -test')
    expect(
      safestrPlus(' Ab ', {
        lowercase: true,
        suffix: '-test',
        trimStart: true,
      })
    ).toBe('ab -test')
    expect(() =>
      safestrPlus(' Ab ', {
        lowercase: true,
        suffix: '-test',
        trimStart: true,
        uppercase: true,
      })
    ).toThrow(AppException)
  })

  it('replaceTwoOrMoreSpacesWithSingleSpace', () => {
    expect.assertions(9)

    const expected = 'This is a test string'

    expect(
      replaceTwoOrMoreSpacesWithSingleSpace('This  is   a    test   string')
    ).toBe(expected)
    expect(
      replaceTwoOrMoreSpacesWithSingleSpace(
        'This  is \t\r \n  a    test   string'
      )
    ).toBe(expected)
    expect(
      replaceTwoOrMoreSpacesWithSingleSpace(
        'This  is \n  a  \t  test \r  string'
      )
    ).toBe(expected)

    expect(replaceTwoOrMoreSpacesWithSingleSpace('')).toBe('')
    expect(replaceTwoOrMoreSpacesWithSingleSpace(' ')).toBe(' ')
    expect(replaceTwoOrMoreSpacesWithSingleSpace('  ')).toBe(' ')
    expect(replaceTwoOrMoreSpacesWithSingleSpace('   \n\r\t')).toBe(' ')
    expect(replaceTwoOrMoreSpacesWithSingleSpace(null)).toBe('')
    expect(replaceTwoOrMoreSpacesWithSingleSpace(undefined)).toBe('')
  })

  it('safePrefix', () => {
    expect.assertions(12)

    const prefix = 'prefix-',
      str = 'test'

    expect(safePrefix(str, prefix)).toBe('prefix-test')
    expect(safePrefix(str, prefix)).toBe('prefix-test')
    expect(safePrefix('', prefix)).toBe('')
    expect(safePrefix(null, prefix)).toBe('')
    expect(safePrefix(undefined, prefix)).toBe('')
    expect(safePrefix(0)).toBe(' 0')
    expect(safePrefix(0, prefix)).toBe('prefix-0')
    expect(safePrefix(-1, prefix)).toBe('prefix--1')
    expect(safePrefix(5, prefix)).toBe('prefix-5')
    expect(safePrefix(true, prefix)).toBe('prefix-true')
    expect(safePrefix(false, prefix)).toBe('prefix-false')
    expect(safePrefix(false)).toBe(' false')
  })

  it('safeSuffix', () => {
    expect.assertions(12)

    const str = 'test',
      suffix = '-suffix'

    expect(safeSuffix(str, suffix)).toBe('test-suffix')
    expect(safeSuffix(str, suffix)).toBe('test-suffix')
    expect(safeSuffix('', suffix)).toBe('')
    expect(safeSuffix(null, suffix)).toBe('')
    expect(safeSuffix(undefined, suffix)).toBe('')
    expect(safeSuffix(0, suffix)).toBe('0-suffix')
    expect(safeSuffix(0)).toBe('0 ')
    expect(safeSuffix(-1, suffix)).toBe('-1-suffix')
    expect(safeSuffix(5, suffix)).toBe('5-suffix')
    expect(safeSuffix(true, suffix)).toBe('true-suffix')
    expect(safeSuffix(false, suffix)).toBe('false-suffix')
    expect(safeSuffix(false)).toBe('false ')
  })

  it('safeHtmlAttribute', () => {
    expect.assertions(8)

    expect(safeHtmlAttribute('')).toBe('')
    expect(safeHtmlAttribute(null)).toBe('')
    expect(safeHtmlAttribute(undefined)).toBe('')
    expect(safeHtmlAttribute('test')).toBe('test')
    expect(safeHtmlAttribute(['test'])).toBe('test')
    expect(safeHtmlAttribute(['test', 'test2'])).toBe('test-test2')
    expect(safeHtmlAttribute(['tes,t', 'test2'])).toBe('tes-t-test2')
    expect(safeHtmlAttribute(['tes,t', 'test2'], 'abc')).toBe('tesabctabctest2')
  })

  it('generateRandomString', () => {
    expect.assertions(4)

    const length = 10,
      randomString = generateRandomString(length),
      randomString2 = generateRandomString(length, 'abcde')

    expect(randomString).toHaveLength(length)
    expect(randomString).toMatch(/^[a-zA-Z0-9]{1,10}$/u)

    expect(randomString2).toHaveLength(length)
    expect(randomString2).toMatch(/^[abcde]{1,10}$/u)
  })

  it('removeLeadingNumbersAndWhitespace', () => {
    expect.assertions(6)

    expect(removeLeadingNumbersAndWhitespace('123abc')).toBe('abc')
    expect(removeLeadingNumbersAndWhitespace('   123abc')).toBe('abc')
    expect(removeLeadingNumbersAndWhitespace('   abc')).toBe('abc')
    expect(removeLeadingNumbersAndWhitespace('123   abc')).toBe('abc')
    expect(removeLeadingNumbersAndWhitespace('123   ')).toBe('')
    expect(removeLeadingNumbersAndWhitespace('   ')).toBe('')
  })
})
