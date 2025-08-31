import {
  type ArrayOrSingleBasicTypes,
  type StringOrStringArray,
  Typish,
} from '../models/types.mjs'
import { getAsNumber, isNumber } from './number-helper.mjs'
import { hasData, isNullOrUndefined, isObject } from './object-helper.mjs'
import { isArray, splitToArray } from './array-helper.mjs'
import { isFunction, typishValue } from './function-helper.mjs'
import { AppException } from '../models/AppException.mjs'

export const CONST_CharsAlphabetLower = 'abcdefghijklmnopqrstuvwxyz',
  CONST_CharsAlphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  CONST_CharsNumbers = '0123456789',
  CONST_CharsToUseForRandomString =
    CONST_CharsAlphabetLower + CONST_CharsAlphabetUpper + CONST_CharsNumbers

export function capitalizeFirstLetter(str?: string | null) {
  return str && hasData(str) ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

/**
 * Tests an object to determine if it is a string.
 * Additionally, will test if the string if it has a minimum length.
 * @param obj Any object to test if it is a string.
 * @param minlength The minimum length the string must be.
 * @returns True if the object is a string and meets an optional minimum length if provided.
 */
export function isString(obj: unknown, minlength = 0): obj is string {
  return (
    ('string' === typeof obj || obj instanceof String) &&
    obj.length >= minlength
  )
}
export function isStringish(obj: unknown): obj is Typish<string> {
  return isString(typishValue(obj))
}

/**
 * Tests if any of a variable argument list has data and returns the first truthy item (is not undefined, null or empty string, not 0, empty array, object, ...).
 * The first item that is truthy is returned as a string. If all arguments are empty, then an empty string is returned.
 * @param s Any variable number of data types to check for truthy data. The first data type that is not null, undefined or falsy is returned.
 * @returns A guaranteed string. Returns the first truthy value from the variable list of arguments as a string. If there are no truthy values, an empty string is returned.
 */
export function safestr(...args: unknown[]): string {
  for (const arg of args) {
    if (hasData(arg)) {
      const str = typishValue(arg)
      if (isString(str)) {
        return str
      }

      if (isObject(arg) || isArray(arg)) {
        return JSON.stringify(arg)
      }

      return String(arg)
    }
  }

  return ''
}

export function capitalizeWords(str?: string | null) {
  return safestr(str).split(' ').map(capitalizeFirstLetter).join(' ')
}

/**
 * Checks a variable to see if it is empty.
 * If it is a string, then checks for "".
 * @param s A variable to test if it is a string and is empty.
 * @param allowFunction True if s is a function and you want to call the function to get s.
 * @returns True if the object s is an empty string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmptyString(s: any, allowFunction = true) {
  const testString = (str: unknown) => !str || (isString(str) && '' === str)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return testString(s) || (allowFunction && isFunction(s) && testString(s()))
}

/**
 * Returns a guaranteed valid string to be trimmed.
 * @param s A string to set to lowercase. If null or undefined, empty string is returned.
 * @returns A guaranteed string to be nonnull and trimmed.
 */
export function safestrTrim(
  s?: string | null,
  ifEmpty: string | null | undefined = ''
) {
  return safestr(s, ifEmpty).trim()
}

/**
 * Cleans the input string by trimming whitespace.
 * If the input is null or undefined, it returns the fallback. This is Kinectify's convention.
 * If their is no fallback, it returns undefined.
 * If the input is a string, it returns the trimmed string.
 * @param str - The string to clean.
 * @returns The trimmed string or undefined if the input is null or undefined.
 */
export function strTrimIfNotNullish(
  str: string | null | undefined,
  fallBackIfEmpty?: string
) {
  if (isNullOrUndefined(str)) {
    return fallBackIfEmpty
  }

  return safestrTrim(str)
}

/**
 * Returns a guaranteed valid string to be lowercase.
 * @param s A string to set to lowercase. If null or undefined, empty string is returned.
 * @param trim Optionally trim the string also.
 * @returns A guaranteed string to be nonnull and lowercase.
 */
export function safestrLowercase(s?: string | null, trim = true) {
  const str = trim ? safestrTrim(s) : safestr(s)

  return safestr(str).toLowerCase()
}

/**
 * Returns a guaranteed valid string to be uppercase.
 * @param s A string to set to uppercase. If null or undefined, empty string is returned.
 * @param trim Optionally trim the string also.
 * @returns A guaranteed string to be nonnull and uppercase.
 */
export function safestrUppercase(s?: string | null, trim = true) {
  const str = trim ? safestrTrim(s) : safestr(s)

  return str.toUpperCase()
}

/**
 * Wraps JSON.parse in a try/catch so that exceptions are not bubbled up.
 * @param strjson The string converted to be converted to a JSON object.
 * @param fname The optional function name that is the source of the operation. Used for exception logging.
 * @returns A the JSON.parsed object or undefined if there was an exception.
 */
export function safestrToJson<T>(
  strjson?: string | null,
  fname?: string
): T | undefined {
  try {
    return JSON.parse(safestr(strjson)) as T
  } catch (ex) {
    console.log(fname ? fname : 'safestrToJson', ex)
  }
}

export function exceedsMaxNumberOfCharacters(
  str: string,
  maxNumberOfCharacters: number
) {
  return safestr(str).length > maxNumberOfCharacters
}

export function hasConsecutiveNumbers(strToSearch: string) {
  if ('7890' === strToSearch || '0987' === strToSearch) {
    return true
  }

  const plusOneCheck = (arrNumbers: number[]) =>
    arrNumbers.slice(1).map((n: number, i: number) => n - arrNumbers[i])

  const arr = safestr(strToSearch)
    .split('')
    .map((x) => getAsNumber(x))

  const differenceForward = plusOneCheck(arr)
  const differenceReverse = plusOneCheck(arr.slice().reverse())

  return (
    differenceForward.every((value) => value === 1) ||
    differenceReverse.every((value) => value === 1)
  )
}

export function maxNumberOfAnyOneCharacter(
  strToSearch: string,
  maxNumberOfCharacters: number
) {
  // eslint-disable-next-line @typescript-eslint/no-misused-spread
  const arrCharsWithCounts = [...safestr(strToSearch)].reduce(
    (a: Record<string, number>, e) => {
      a[e] = (a[e] || 0) + 1

      return a
    },
    {}
  )

  return !Object.values(arrCharsWithCounts).every(
    (cur) => cur <= maxNumberOfCharacters
  )
}

export function maxRepeatedCharCount(str: string): number {
  const charCounts: Map<string, number> = new Map()
  let maxCount = 0

  for (const char of str) {
    const currentCount = (charCounts.get(char) || 0) + 1
    charCounts.set(char, currentCount)

    if (currentCount > maxCount) {
      maxCount = currentCount
    }
  }

  return maxCount
}

export function matchesRegex(
  stringToTest: Typish<string>,
  regexPattern: string | RegExp,
  allowEmptyString = true
) {
  const str = safestr(stringToTest)
  if (allowEmptyString && !str) {
    return true
  }

  // eslint-disable-next-line require-unicode-regexp
  return new RegExp(regexPattern).test(str)
}

export function hasNumbersOnly(
  stringToTest: Typish<string>,
  allowEmptyString = true
) {
  return matchesRegex(stringToTest, /^\d+$/u, allowEmptyString)
}

/**
 * Returns an s if the number passed in should be pluralized.
 * @param num A number that is used to determine if the plural suffix is added.
 * @param suffix The suffix to add if the number should be pluralized.
 * @returns The suffix string if the number is not 1.
 */
export function pluralize(num: number, textIfSingle = '', textIfPlural = 's') {
  if (isNumber(num) && num === 1) {
    return safestr(textIfSingle)
  }

  return safestr(textIfPlural)
}

/**
 * Returns an s if the number passed in should be pluralized.
 * @param isPlural A number that is used to determine if the plural suffix is added.
 * @param suffix The suffix to add if the number should be pluralized.
 * @returns The suffix string if the number is not 1.
 */
export function pluralSuffix(num: number, suffix = 's') {
  return pluralize(num, '', suffix)
}

/**
 * Returns the prefix for a number if it positive + or negative -.
 * @param num The number to check for negative or positive.
 * @returns Empty string is num is 0, + if positive, or - if negative.
 */
export function plusMinus(num: number) {
  if (!num) {
    return ''
  }

  return num > 0 ? '+' : '-'
}

/**
 * Returns the prefix if the given string s has a value (not empty).
 * Generally used in loops so that the prefix is not prepended on the first pass.
 * @param s A string to prefix with a value if the string has data.
 * @param prefix The prefix if the string is not empty.
 * @returns The prefix if the string is not empty.
 */
export function prefixIfHasData(s: string, prefix = ', ') {
  return hasData(s) ? safestr(prefix) : ''
}

/**
 * Wraps a given string str with a prefix and suffix.
 * @param left The prefix to put in front of the str.
 * @param str The string to be wrapped.
 * @param right The suffix to put after str.
 * @returns A string of left + str + right. Guaranteed to be a safe string.
 */
export function stringWrap(left: string, str: string, right: string) {
  return safestr(left) + safestr(str) + safestr(right)
}

/**
 * Creates a string with a name=value. Optional wrapping of the value is provided.
 * @param name The name.
 * @param value The value to set the name.
 * @param valueWrapper An optional wrapper around the value. Usually a quote or double quote.
 * @returns The name=value string.
 */
export function stringEquals(name: string, value: string, valueWrapper = '') {
  if (hasData(name)) {
    return `${name}=${
      hasData(valueWrapper)
        ? stringWrap(valueWrapper, value, valueWrapper)
        : safestr(value)
    }`
  }

  return ''
}

/**
 * Creates a string as "str".
 * @param str The string to wrap in double quotes.
 * @returns The "str" wrapped string.
 */
export function stringWrapDoubleQuote(str: string) {
  return stringWrap('"', str, '"')
}
/**
 * Creates a string as (str) wrapped in parentheses.
 * @param str The string to wrap in parentheses.
 * @returns The (str) wrapped string.
 */
export function stringWrapParen(str: string) {
  return stringWrap('(', str, ')')
}
/**
 * Creates a string as 'str'.
 * @param str The string to wrap in single quotes.
 * @returns The 'str' wrapped string.
 */
export function stringWrapSingleQuote(str: string) {
  return stringWrap("'", str, "'")
}

/**
 * Creates a string with a name='value' or name="value" depending on useSingleQuote.
 * @param name The name.
 * @param value The value to set the name.
 * @param useSingleQuote True if you want to use a single quote, otherwise a double quote is used.
 * @returns The name="value" or name='value' string.
 */
export function stringEqualsQuoted(
  name: string,
  value: string,
  useSingleQuote = true
) {
  if (hasData(name)) {
    return `${name}=${
      useSingleQuote
        ? stringWrapSingleQuote(value)
        : stringWrapDoubleQuote(value)
    }`
  }

  return ''
}

export function randomStringGenerate(
  exactLength = 4,
  charsToUse = CONST_CharsToUseForRandomString
) {
  let result = ''
  const lenCharsToUse = charsToUse.length
  for (let i = 0; i < exactLength; ++i) {
    // Generate a random digit (0-9)
    result += charsToUse.charAt(Math.floor(Math.random() * lenCharsToUse))
  }

  return result
}

export function stringIf(
  ifTrue: boolean | null | undefined,
  strTrue: string | null | undefined,
  strFalse?: string | null
) {
  return ifTrue ? safestr(strTrue) : safestr(strFalse)
}
export function FirstCharCapitalFormatter(s: string) {
  return capitalizeFirstLetter(s)
}

// eslint-disable-next-line complexity
export function safestrPlus(
  str?: string | number | boolean | null,
  ifEmpty?:
    | string
    | {
        ifEmpty?: string
        prefix?: string
        suffix?: string
        trim?: boolean
        trimStart?: boolean
        trimEnd?: boolean
        lowercase?: boolean
        uppercase?: boolean
      }
    | null
): string {
  let s = str
  if (isNullOrUndefined(s)) {
    s = ''
  } else if (!isString(s)) {
    s = String(s)
  }

  if (
    !hasData(s) &&
    (!ifEmpty || !hasData(ifEmpty) || (hasData(ifEmpty) && isString(ifEmpty)))
  ) {
    return (ifEmpty as string) || ''
  }

  if (isObject(ifEmpty)) {
    const {
      ifEmpty: ifEmptyValue,
      prefix,
      suffix,
      trim,
      trimStart,
      trimEnd,
      lowercase,
      uppercase,
    } = ifEmpty

    if (!hasData(s) && ifEmptyValue) {
      return ifEmptyValue
    }

    if (trim) {
      s = s.trim()
    }
    if (trimStart) {
      s = s.trimStart()
    }
    if (trimEnd) {
      s = s.trimEnd()
    }

    if (lowercase && uppercase) {
      throw new AppException('Cannot set both lowercase and uppercase to true.')
    }
    if (lowercase) {
      s = s.toLowerCase()
    }
    if (uppercase) {
      s = s.toUpperCase()
    }

    if (!hasData(s)) {
      return ''
    }

    return (prefix ?? '') + s + (suffix ?? '')
  }

  return s
}

export function ReplaceAll(
  str: string,
  regex: RegExp,
  replaceWith = ''
): string {
  return safestr(str).replaceAll(regex, replaceWith)
}

export function RemoveLeadingNumbersAndWhitespace(str: string) {
  return ReplaceAll(str, /^\s*\d*\s*/gu)
}

export function GenerateRandomString(
  length: number,
  charactersToAllow?: string
) {
  let result = ''
  const characters =
      safestr(charactersToAllow) ||
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export function ReplaceNonPrintable(str: string | null | undefined) {
  return safestr(str).replaceAll(/[^\x20-\x7E]/gu, '')
}

export function ReplaceTwoOrMoreSpacesWithSingleSpace(
  str: string | null | undefined
) {
  return safestr(str).replaceAll(/[ \t\r\n]{2,}/gu, ' ')
}

/**
 * Returns a string with a prepended prefix if the string has data.
 * @param s The string to check for data, and if there is data, trim and prefix the string with prefix.
 * @param prefix The prefix to prepend if the string has data.
 * @returns Empty string if the string is empty, otherwise the prefix is prepended with the string.
 */
export function safePrefix(s?: string | number | boolean | null, prefix = ' ') {
  return safestrPlus(s, {
    prefix,
    trim: true,
  })
}

/**
 * Returns a string with a suffix if the string has data.
 * @param s The string to check for data, and if there is data, trim and add the suffix.
 * @param suffix The suffix to add if the string has data.
 * @returns Empty string if the string is empty, otherwise the string with the suffix.
 */
export function safeSuffix(s?: string | number | boolean | null, suffix = ' ') {
  return safestrPlus(s, {
    suffix,
    trim: true,
  })
}

export function IncludesAnyFromArray(
  mainString: string,
  substrings: string[]
): boolean {
  return substrings.some((substring) => mainString.includes(substring))
}

export function safeHtmlAttribute(
  items: ArrayOrSingleBasicTypes,
  separator = '-'
) {
  return splitToArray(items, ',', true, true, {
    removeNonPrintable: true,
  }).join(separator)
}

/**
 * Gets a comma separated list of unique items.
 * @param stringOrArray The {@link StringOrStringArray} to flatten then separate by commas.
 * @returns The flattened, comma-separated string.
 */

export function getCommaSeparatedList(stringOrArray: StringOrStringArray) {
  if (isString(stringOrArray)) {
    return stringOrArray
  }

  const myset = new Set(stringOrArray)
  return [...myset].join(',')
}

/**
 * Gets a comma separated list of unique items in uppercase.
 * @param stringOrArray The {@link StringOrStringArray} to uppercase and separate by commas.
 * @returns The flattened, comma-separated string in uppercase.
 */
export function getCommaUpperList(stringOrArray: StringOrStringArray) {
  return safestrUppercase(getCommaSeparatedList(stringOrArray))
}
