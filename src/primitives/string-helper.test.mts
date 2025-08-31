import {
  CONST_CharsNumbers,
  FirstCharCapitalFormatter,
  StringHelper,
  capitalizeFirstLetter,
  capitalizeWords,
  exceedsMaxNumberOfCharacters,
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
  safestrLowercase,
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

test(stringWrapSingleQuote.name, () => {
  const str = stringWrapSingleQuote('test')

  expect(str).toBe("'test'")
})

test(stringWrapParen.name, () => {
  const str = stringWrapParen('test')

  expect(str).toBe('(test)')
})

test(stringWrapDoubleQuote.name, () => {
  const str = stringWrapDoubleQuote('test')

  expect(str).toBe('"test"')
})

describe(stringEquals.name, () => {
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

describe(stringEqualsQuoted.name, () => {
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

test(exceedsMaxNumberOfCharacters.name, () => {
  expect(exceedsMaxNumberOfCharacters('123456', 5)).toBe(true)
  expect(exceedsMaxNumberOfCharacters('12345', 5)).toBe(false)
})

test(safestrToJson.name, () => {
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

test(isEmptyString.name, () => {
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

test(strTrimIfNotNullish.name, () => {
  expect(strTrimIfNotNullish(undefined)).toBeUndefined()
  expect(strTrimIfNotNullish(null)).toBeUndefined()
  expect(strTrimIfNotNullish('')).toBe('')
  expect(strTrimIfNotNullish(' ')).toBe('')
  expect(strTrimIfNotNullish(' a ')).toBe('a')
  expect(strTrimIfNotNullish(' a b ')).toBe('a b')
})

test(safestrLowercase.name, () => {
  expect(safestrLowercase('A')).toBe('a')
  expect(safestrLowercase('A ')).toBe('a')
  expect(safestrLowercase(' A ', false)).toBe(' a ')
})

test(safestrUppercase.name, () => {
  expect(safestrUppercase('a')).toBe('A')
  expect(safestrUppercase('a ')).toBe('A')
  expect(safestrUppercase(' a ', false)).toBe(' A ')
})

describe(randomStringGenerate.name, () => {
  test('no params', () => {
    const lengthForRandomString = 4
    const ranstr = randomStringGenerate()

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
  test('proper length', () => {
    const lengthForRandomString = 4
    const ranstr = randomStringGenerate(lengthForRandomString)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
  test('using chars and numbers', () => {
    const lengthForRandomString = 4
    const ranstr = randomStringGenerate(
      lengthForRandomString,
      CONST_CharsNumbers
    )

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
})

describe(isStringish.name, () => {
  test.each(['', 'abc', () => '123', () => 'a;dlkfja;lkdjfa;slkjf'])(
    'True: %p',
    (input) => {
      expect(isStringish(input)).toBe(true)
    }
  )

  test.each([
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

test(maxNumberOfAnyOneCharacter.name, () => {
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

test(matchesRegex.name, () => {
  expect(matchesRegex('', /^[a-z]+$/u)).toBe(true)
  expect(matchesRegex('', /^[a-z]+$/u, false)).toBe(false)

  expect(matchesRegex('abc', /^[a-z]+$/u)).toBe(true)
  expect(matchesRegex('ABC', /^[a-z]+$/u)).toBe(false)
  expect(matchesRegex('123', /^[a-z]+$/u)).toBe(false)

  expect(matchesRegex('abc', /^[a-z]+$/u)).toBe(true)
})

test(hasNumbersOnly.name, () => {
  expect(hasNumbersOnly('')).toBe(true)
  expect(hasNumbersOnly('', true)).toBe(true)
  expect(hasNumbersOnly('', false)).toBe(false)
  expect(hasNumbersOnly('abc')).toBe(false)
  expect(hasNumbersOnly('123')).toBe(true)
  expect(hasNumbersOnly('a1b2c3')).toBe(false)
  expect(hasNumbersOnly('abc123')).toBe(false)
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

test(StringHelper.GenerateRandomString.name, () => {
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

describe(randomStringGenerate.name, () => {
  test('no params', () => {
    const lengthForRandomString = 4,
      ranstr = randomStringGenerate()

    expect(ranstr).toHaveLength(lengthForRandomString)
  })

  test('proper length', () => {
    const lengthForRandomString = 4,
      ranstr = randomStringGenerate(lengthForRandomString)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })

  test('using chars and numbers', () => {
    const lengthForRandomString = 4,
      ranstr = randomStringGenerate(lengthForRandomString, CONST_CharsNumbers)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
})
test(getCommaUpperList.name, () => {
  expect(getCommaUpperList('')).toBe('')
  expect(getCommaUpperList('a,b,c')).toBe('A,B,C')
  expect(getCommaUpperList(['a', 'b', 'c'])).toBe('A,B,C')
  expect(getCommaUpperList('a ,   b,c   ')).toBe('A ,   B,C')
})

test(hasConsecutiveNumbers.name, () => {
  expect(hasConsecutiveNumbers('123')).toBe(true)
  expect(hasConsecutiveNumbers('abc')).toBe(false)
  expect(hasConsecutiveNumbers('1a2b3c')).toBe(false)
  expect(hasConsecutiveNumbers('7890')).toBe(true)
  expect(hasConsecutiveNumbers('0987')).toBe(true)
})

test(maxRepeatedCharCount.name, () => {
  expect(maxRepeatedCharCount('')).toBe(0)
  expect(maxRepeatedCharCount('a')).toBe(1)
  expect(maxRepeatedCharCount('aa')).toBe(2)
  expect(maxRepeatedCharCount('ab')).toBe(1)
  expect(maxRepeatedCharCount('aabb')).toBe(2)
  expect(maxRepeatedCharCount('aaabbb')).toBe(3)
})
