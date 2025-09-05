import {
  CONST_CharsNumbers,
  GenerateRandomString,
  RemoveLeadingNumbersAndWhitespace,
  ReplaceTwoOrMoreSpacesWithSingleSpace,
  capitalizeFirstLetter,
  capitalizeWords,
  exceedsMaxNumberOfCharacters,
  firstCharCapitalFormatter,
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
import { AppException } from '../models/AppException.mjs'
import { jest } from '@jest/globals'

it('capitalizeFirstLetter', () => {
  expect(capitalizeFirstLetter('hello')).toBe('Hello')
  expect(capitalizeFirstLetter('')).toBe('')
  expect(capitalizeFirstLetter(null)).toBe('')
  expect(capitalizeFirstLetter(undefined)).toBe('')
  expect(capitalizeFirstLetter('123')).toBe('123')
  expect(capitalizeFirstLetter('hello world')).toBe('Hello world')
  expect(capitalizeFirstLetter('hello world!')).toBe('Hello world!')
})

it('capitalizeWords', () => {
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

it(stringWrapSingleQuote.name, () => {
  const str = stringWrapSingleQuote('test')

  expect(str).toBe("'test'")
})

it(stringWrapParen.name, () => {
  const str = stringWrapParen('test')

  expect(str).toBe('(test)')
})

it(stringWrapDoubleQuote.name, () => {
  const str = stringWrapDoubleQuote('test')

  expect(str).toBe('"test"')
})

describe(stringEquals.name, () => {
  it('nothing', () => {
    const str = stringEquals('', '')

    expect(str).toBe('')
  })

  it('not wrapped', () => {
    const str = stringEquals('name', 'value')

    expect(str).toBe('name=value')
  })

  it('wrapped', () => {
    const str = stringEquals('name', 'value', 'ab')

    expect(str).toBe('name=abvalueab')
  })
})

describe(stringEqualsQuoted.name, () => {
  it('nothing', () => {
    expect(stringEqualsQuoted('', '', true)).toBe('')

    expect(stringEqualsQuoted('', '', false)).toBe('')
  })

  it('name/value', () => {
    expect(stringEqualsQuoted('name', '', false)).toBe('name=""')
    expect(stringEqualsQuoted('name', 'value', false)).toBe('name="value"')

    expect(stringEqualsQuoted('name', '')).toBe("name=''")
    expect(stringEqualsQuoted('name', 'value')).toBe("name='value'")

    expect(stringEqualsQuoted('name', '', true)).toBe("name=''")
    expect(stringEqualsQuoted('name', 'value', true)).toBe("name='value'")
  })

  it('single quoted', () => {
    const str = stringEqualsQuoted('name', 'value', true)

    expect(str).toBe("name='value'")
  })

  it('double quoted', () => {
    const str = stringEqualsQuoted('name', 'value', false)

    expect(str).toBe('name="value"')
  })
})

it(exceedsMaxNumberOfCharacters.name, () => {
  expect(exceedsMaxNumberOfCharacters('123456', 5)).toBe(true)
  expect(exceedsMaxNumberOfCharacters('12345', 5)).toBe(false)
})

it(safestrToJson.name, () => {
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

it('stringIf', () => {
  const stringIfFalse = 'string if false',
    stringIfTrue = 'string if true'

  expect(stringIf(true, stringIfTrue)).toBe(stringIfTrue)
  expect(stringIf(false, stringIfTrue)).toBe('')
  expect(stringIf(false, stringIfFalse)).toBe('')
  expect(stringIf(true, stringIfTrue, stringIfFalse)).toBe(stringIfTrue)
  expect(stringIf(false, stringIfTrue, stringIfFalse)).toBe(stringIfFalse)
})

it(isEmptyString.name, () => {
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

it('pluralize', () => {
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
  expect(plusMinus(0)).toBe('')
  expect(plusMinus(1)).toBe('+')
  expect(plusMinus(-1)).toBe('-')
})

it(strTrimIfNotNullish.name, () => {
  expect(strTrimIfNotNullish(undefined)).toBeUndefined()
  expect(strTrimIfNotNullish(null)).toBeUndefined()
  expect(strTrimIfNotNullish('')).toBe('')
  expect(strTrimIfNotNullish(' ')).toBe('')
  expect(strTrimIfNotNullish(' a ')).toBe('a')
  expect(strTrimIfNotNullish(' a b ')).toBe('a b')
})

it(safestrLowercase.name, () => {
  expect(safestrLowercase('A')).toBe('a')
  expect(safestrLowercase('A ')).toBe('a')
  expect(safestrLowercase(' A ', false)).toBe(' a ')
})

it(safestrUppercase.name, () => {
  expect(safestrUppercase('a')).toBe('A')
  expect(safestrUppercase('a ')).toBe('A')
  expect(safestrUppercase(' a ', false)).toBe(' A ')
})

describe(randomStringGenerate.name, () => {
  it('no params', () => {
    const lengthForRandomString = 4
    const ranstr = randomStringGenerate()

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
  it('proper length', () => {
    const lengthForRandomString = 4
    const ranstr = randomStringGenerate(lengthForRandomString)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
  it('using chars and numbers', () => {
    const lengthForRandomString = 4
    const ranstr = randomStringGenerate(
      lengthForRandomString,
      CONST_CharsNumbers
    )

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
})

describe(isStringish.name, () => {
  it.each(['', 'abc', () => '123', () => 'a;dlkfja;lkdjfa;slkjf'])(
    'True: %p',
    (input) => {
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
  ])('False: %p', (input) => {
    expect(isStringish(input)).toBe(false)
  })
})

it(maxNumberOfAnyOneCharacter.name, () => {
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

it(matchesRegex.name, () => {
  expect(matchesRegex('', /^[a-z]+$/u)).toBe(true)
  expect(matchesRegex('', /^[a-z]+$/u, false)).toBe(false)

  expect(matchesRegex('abc', /^[a-z]+$/u)).toBe(true)
  expect(matchesRegex('ABC', /^[a-z]+$/u)).toBe(false)
  expect(matchesRegex('123', /^[a-z]+$/u)).toBe(false)

  expect(matchesRegex('abc', /^[a-z]+$/u)).toBe(true)
})

it(hasNumbersOnly.name, () => {
  expect(hasNumbersOnly('')).toBe(true)
  expect(hasNumbersOnly('', true)).toBe(true)
  expect(hasNumbersOnly('', false)).toBe(false)
  expect(hasNumbersOnly('abc')).toBe(false)
  expect(hasNumbersOnly('123')).toBe(true)
  expect(hasNumbersOnly('a1b2c3')).toBe(false)
  expect(hasNumbersOnly('abc123')).toBe(false)
})

it('firstCharCapitalFormatter', () => {
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

it(safestrPlus.name, () => {
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

it(ReplaceTwoOrMoreSpacesWithSingleSpace.name, () => {
  const expected = 'This is a test string'

  expect(
    ReplaceTwoOrMoreSpacesWithSingleSpace('This  is   a    test   string')
  ).toBe(expected)
  expect(
    ReplaceTwoOrMoreSpacesWithSingleSpace(
      'This  is \t\r \n  a    test   string'
    )
  ).toBe(expected)
  expect(
    ReplaceTwoOrMoreSpacesWithSingleSpace('This  is \n  a  \t  test \r  string')
  ).toBe(expected)

  expect(ReplaceTwoOrMoreSpacesWithSingleSpace('')).toBe('')
  expect(ReplaceTwoOrMoreSpacesWithSingleSpace(' ')).toBe(' ')
  expect(ReplaceTwoOrMoreSpacesWithSingleSpace('  ')).toBe(' ')
  expect(ReplaceTwoOrMoreSpacesWithSingleSpace('   \n\r\t')).toBe(' ')
  expect(ReplaceTwoOrMoreSpacesWithSingleSpace(null)).toBe('')
  expect(ReplaceTwoOrMoreSpacesWithSingleSpace(undefined)).toBe('')
})

it(safePrefix.name, () => {
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

it(safeSuffix.name, () => {
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

it(safeHtmlAttribute.name, () => {
  expect(safeHtmlAttribute('')).toBe('')
  expect(safeHtmlAttribute(null)).toBe('')
  expect(safeHtmlAttribute(undefined)).toBe('')
  expect(safeHtmlAttribute('test')).toBe('test')
  expect(safeHtmlAttribute(['test'])).toBe('test')
  expect(safeHtmlAttribute(['test', 'test2'])).toBe('test-test2')
  expect(safeHtmlAttribute(['tes,t', 'test2'])).toBe('tes-t-test2')
  expect(safeHtmlAttribute(['tes,t', 'test2'], 'abc')).toBe('tesabctabctest2')
})

it(GenerateRandomString.name, () => {
  const length = 10,
    randomString = GenerateRandomString(length),
    randomString2 = GenerateRandomString(length, 'abcde')

  expect(randomString).toHaveLength(length)
  expect(randomString).toMatch(/^[a-zA-Z0-9]{1,10}$/u)

  expect(randomString2).toHaveLength(length)
  expect(randomString2).toMatch(/^[abcde]{1,10}$/u)
})

it(RemoveLeadingNumbersAndWhitespace.name, () => {
  expect(RemoveLeadingNumbersAndWhitespace('123abc')).toBe('abc')
  expect(RemoveLeadingNumbersAndWhitespace('   123abc')).toBe('abc')
  expect(RemoveLeadingNumbersAndWhitespace('   abc')).toBe('abc')
  expect(RemoveLeadingNumbersAndWhitespace('123   abc')).toBe('abc')
  expect(RemoveLeadingNumbersAndWhitespace('123   ')).toBe('')
  expect(RemoveLeadingNumbersAndWhitespace('   ')).toBe('')
})

describe(randomStringGenerate.name, () => {
  it('no params', () => {
    const lengthForRandomString = 4,
      ranstr = randomStringGenerate()

    expect(ranstr).toHaveLength(lengthForRandomString)
  })

  it('proper length', () => {
    const lengthForRandomString = 4,
      ranstr = randomStringGenerate(lengthForRandomString)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })

  it('using chars and numbers', () => {
    const lengthForRandomString = 4,
      ranstr = randomStringGenerate(lengthForRandomString, CONST_CharsNumbers)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
})
it(getCommaUpperList.name, () => {
  expect(getCommaUpperList('')).toBe('')
  expect(getCommaUpperList('a,b,c')).toBe('A,B,C')
  expect(getCommaUpperList(['a', 'b', 'c'])).toBe('A,B,C')
  expect(getCommaUpperList('a ,   b,c   ')).toBe('A ,   B,C')
})

it(hasConsecutiveNumbers.name, () => {
  expect(hasConsecutiveNumbers('123')).toBe(true)
  expect(hasConsecutiveNumbers('abc')).toBe(false)
  expect(hasConsecutiveNumbers('1a2b3c')).toBe(false)
  expect(hasConsecutiveNumbers('7890')).toBe(true)
  expect(hasConsecutiveNumbers('0987')).toBe(true)
})

it(maxRepeatedCharCount.name, () => {
  expect(maxRepeatedCharCount('')).toBe(0)
  expect(maxRepeatedCharCount('a')).toBe(1)
  expect(maxRepeatedCharCount('aa')).toBe(2)
  expect(maxRepeatedCharCount('ab')).toBe(1)
  expect(maxRepeatedCharCount('aabb')).toBe(2)
  expect(maxRepeatedCharCount('aaabbb')).toBe(3)
})
