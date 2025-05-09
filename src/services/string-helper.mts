import {
  ArrayOrSingleBasicTypes,
  StringOrStringArray,
} from '../models/types.mjs'
import { isArray, safeArray } from './array-helper.mjs'
import { hasData, isFunction, isNullOrUndefined } from './general.mjs'
import { isNumber } from './number-helper.mjs'
import { isObject } from './object-helper.mjs'

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

export class StringHelper {
  static safestr(
    s?: string | number | boolean | null,
    ifEmpty?:
      | string
      | {
          ifEmpty?: string
          prefix?: string
          suffix?: string
          trim?: boolean
          trimStart?: boolean
          trimEnd?: boolean
        }
      | null
  ): string {
    if (isNullOrUndefined(s)) {
      s = ''
    } else if (!isString(s)) {
      s = String(s)
    }

    if (
      !hasData(s) &&
      (!ifEmpty || !hasData(ifEmpty) || (hasData(ifEmpty) && isString(ifEmpty)))
    ) {
      return (ifEmpty as string) ?? ''
    }

    if (isObject(ifEmpty)) {
      const {
        ifEmpty: ifEmptyValue,
        prefix,
        suffix,
        trim,
        trimStart,
        trimEnd,
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

      if (!hasData(s)) {
        return ''
      }

      return (prefix ?? '') + s + (suffix ?? '')
    }

    return s
  }

  static GenerateRandomString(length: number) {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  static ReplaceNonPrintable(str: string) {
    return str.replaceAll(/[^\x20-\x7E]/g, '')
  }

  static safeHtmlAttribute(items: ArrayOrSingleBasicTypes, separator = '-') {
    return StringHelper.SplitToArray(items, ',', true, true, {
      removeNonPrintable: true,
    }).join(separator)
  }

  /**
   * Returns a string with a prepended prefix if the string has data.
   * @param s The string to check for data, and if there is data, trim and prefix the string with prefix.
   * @param prefix The prefix to prepend if the string has data.
   * @returns Empty string if the string is empty, otherwise the prefix is prepended with the string.
   */
  static safePrefix(s?: string | number | boolean | null, prefix = ' ') {
    return StringHelper.safestr(s, {
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
  static safeSuffix(s?: string | number | boolean | null, suffix = ' ') {
    return StringHelper.safestr(s, {
      suffix,
      trim: true,
    })
  }

  static SplitIntoArray(
    strToSplit: ArrayOrSingleBasicTypes,
    splitter = ',',
    replaceNonPrintable = true
  ) {
    let str = isString(strToSplit)
      ? safestrTrim(strToSplit)
      : String(strToSplit)

    if (replaceNonPrintable) {
      str = StringHelper.ReplaceNonPrintable(str)
    }

    if (str.startsWith('[')) {
      str = safestrTrim(str.substring(1))
    }
    if (str.endsWith(']')) {
      str = safestrTrim(str.substring(0, str.length - 1))
    }

    return str.split(splitter)
  }

  /**
   * Takes a string or array of strings, iterates over each string and splits them according to the splitter provided.
   * Each split string is then added to an array and the array of split strings is returned.
   * @param strOrArray A {@link StringOrStringArray} to push all items split with the splitter provided.
   * @param splitter A string of what to split every string by.
   * @param removeEmpties If true, remove all empty strings.
   * @param trimStrings True if you want to remove any surrounding spaces on every string.
   * @returns An array of every string split by splitter.
   */
  static SplitToArray(
    strOrArray?: ArrayOrSingleBasicTypes,
    splitter = ',',
    removeEmpties = true,
    trimStrings = true,
    extras: {
      removeNonPrintable?: boolean
    } = { removeNonPrintable: true }
  ) {
    let splitted = safeArray(strOrArray).reduce(
      (acc: string[], cur) =>
        acc.concat(
          StringHelper.SplitIntoArray(cur, splitter, extras.removeNonPrintable)
        ),
      []
    )

    if (removeEmpties) {
      splitted = splitted.filter((e) => hasData(e.trim()))
    }

    if (trimStrings) {
      splitted = splitted.map((x) => safestrTrim(x))
    }

    return splitted
  }

  /**
   * Calls splitToArray and if only one string is the array is returned, just that string is returned.
   * Otherwise the array returned from splitToArray is returned intact.
   * @param strOrArray A {@link StringOrStringArray} to push all items split with the splitter provided.
   * @param splitter A string of what to split every string by.
   * @param removeEmpties If true, remove all empty strings.
   * @param trimStrings True if you want to remove any surrounding spaces on every string.
   * @returns An array of every string split by splitter, of if only 1 string is the result of splitToArray, the string itself is returned.
   */
  static SplitToArrayOrStringIfOnlyOne(
    strOrArray: StringOrStringArray,
    splitter = ',',
    removeEmpties = true,
    trimStrings = true
  ): StringOrStringArray {
    const arr = StringHelper.SplitToArray(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )

    if (isArray(arr, 2)) {
      return arr
    }

    if (isArray(arr, 1)) {
      return arr[0]
    }

    return ''
  }

  /**
   * Calls splitToArray and if only one string is the array is returned, just that string is returned uppercase.
   * Otherwise the array returned from splitToArray is returned with each string uppercased.
   * @param strOrArray A {@link StringOrStringArray} to push all items split with the splitter provided.
   * @param splitter A string of what to split every string by.
   * @param removeEmpties If true, remove all empty strings.
   * @param trimStrings True if you want to remove any surrounding spaces on every string.
   * @returns An array of every string split by splitter, of if only 1 string is the result of splitToArray with every string uppercased, the string itself is returned uppercase.
   */
  static SplitToArrayOrStringIfOnlyOneToUpper(
    strOrArray: StringOrStringArray,
    splitter = ',',
    removeEmpties = true,
    trimStrings = true
  ): StringOrStringArray {
    const arr = StringHelper.SplitToArrayOrStringIfOnlyOne(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )

    if (isArray(arr)) {
      return arr.map((x) => x.toUpperCase())
    }

    return safestrUppercase(arr)
  }

  static SplitToArrayOfIntegers(commaDelimitedString?: string) {
    const trimmed = StringHelper.SplitToArray(commaDelimitedString)

    return trimmed.map((item) => parseInt(item, 10))
  }
}
