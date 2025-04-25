import { StringOrStringArray } from '../models/types.mjs'
import { hasData, isFunction } from './general.mjs'
import { isNumber } from './number-helper.mjs'

export function capitalizeFirstLetter(str?: string | null) {
  return str && hasData(str) ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

export function capitalizeWords(str?: string | null) {
  return safestr(str).split(' ').map(capitalizeFirstLetter).join(' ')
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
/**
 * Checks a variable to see if it is empty.
 * If it is a string, then checks for "".
 * @param s A variable to test if it is a string and is empty.
 * @param allowFunction True if s is a function and you want to call the function to get s.
 * @returns True if the object s is an empty string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmptyString(s: any, allowFunction = true) {
  const testString = (str: unknown) => {
    return !str || (isString(str) && '' === str)
  }

  return testString(s) || (allowFunction && isFunction(s) && testString(s()))
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
/**
 * Tests if a string has data (is not undefined, null or empty string).
 * If the string is empty, then the ifEmpty value is returned.
 * @param s A string to check for data.
 * @param ifEmpty If the string is empty(including ""), return this value. Defaults to "".
 * @returns A guaranteed string. Returns ifEmpty if the string does not have data, or "" if an ifEmpty value is not provided.
 */

export function safestr(s?: string | null, ifEmpty = '') {
  if (hasData(s) && s) {
    return s
  }

  return hasData(ifEmpty) ? ifEmpty : ''
}
/**
 * Returns a guaranteed valid string to be lowercase.
 * @param s A string to set to lowercase. If null or undefined, empty string is returned.
 * @param trim Optionally trim the string also.
 * @returns A guaranteed string to be nonnull and lowercase.
 */

export function safestrLowercase(s?: string | null, trim = true) {
  if (trim) {
    s = safestrTrim(s)
  }

  return safestr(s).toLowerCase()
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
    return JSON.parse(safestr(strjson))
  } catch (ex) {
    console.log(fname ? fname : 'safestrToJson', ex)
  }
}
/**
 * Returns a guaranteed valid string to be trimmed.
 * @param s A string to set to lowercase. If null or undefined, empty string is returned.
 * @returns A guaranteed string to be nonnull and trimmed.
 */

export function safestrTrim(s?: string | null, ifEmpty = '') {
  return safestr(s, ifEmpty).trim()
}
/**
 * Returns a guaranteed valid string to be uppercase.
 * @param s A string to set to uppercase. If null or undefined, empty string is returned.
 * @param trim Optionally trim the string also.
 * @returns A guaranteed string to be nonnull and uppercase.
 */

export function safestrUppercase(s?: string | null, trim = true) {
  if (trim) {
    s = safestrTrim(s)
  }

  return safestr(s).toUpperCase()
}
/**
 * Returns an s if the number passed in should be pluralized.
 * @param isPlural A number that is used to determine if the plural suffix is added.
 * @param suffix The suffix to add if the number should be pluralized.
 * @returns The suffix string if the number is not 1.
 */

export const pluralSuffix = (num: number, suffix = 's') =>
  pluralize(num, '', suffix)
/**
 * Returns an s if the number passed in should be pluralized.
 * @param num A number that is used to determine if the plural suffix is added.
 * @param suffix The suffix to add if the number should be pluralized.
 * @returns The suffix string if the number is not 1.
 */

export function pluralize(num: number, textIfSingle = '', textIfPlural = 's') {
  if (isNumber(num) && 1 === num) {
    return safestr(textIfSingle)
  }

  return safestr(textIfPlural)
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

export function prefixIfHasData(s: string | null | undefined, prefix = ', ') {
  return hasData(s) ? safestr(prefix) : ''
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
    return (
      name +
      '=' +
      (hasData(valueWrapper)
        ? stringWrap(valueWrapper, value, valueWrapper)
        : safestr(value))
    )
  }

  return ''
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
    return (
      name +
      '=' +
      (useSingleQuote || false
        ? stringWrapSingleQuote(value)
        : stringWrapDoubleQuote(value))
    )
  }

  return ''
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
  // eslint-disable-next-line quotes
  return stringWrap("'", str, "'")
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
