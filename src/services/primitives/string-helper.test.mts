import {
  exceedsMaxNumberOfCharacters,
  hasNumbersOnly,
  isEmptyString,
  isStringish,
  matchesRegex,
  maxNumberOfAnyOneCharacter,
  pluralSuffix,
  pluralize,
  plusMinus,
  randomStringGenerate,
  safestrLowercase,
  safestrToJson,
  safestrUppercase,
  strTrimIfNotNullish,
  stringEquals,
  stringEqualsQuoted,
  stringWrapDoubleQuote,
  stringWrapParen,
  stringWrapSingleQuote,
} from './string-helper.mjs'
import { CONST_CharsNumbers } from '../../models/types.mjs'

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
