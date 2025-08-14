import {
  ArrayOrSingle,
  type FunctionOrType,
  SortOrder,
  SortOrderAsBoolean,
} from '../models/types.mjs'
import { isArray, safeArray } from './array-helper.mjs'
import { isString, safestr, safestrLowercase } from './string-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import { DateHelper } from './DateHelper.mjs'
import { isNumber } from './number-helper.mjs'
import { isObject } from './object-helper.mjs'

/**
 * Tests an object to determine if it is a type boolean.
 * @param obj Any object to test if it is a boolean value.
 * @returns True if the object is a boolean.
 */
export function isBoolean(obj: unknown): obj is boolean {
  return typeof obj === 'boolean'
}

/**
 * Tests an object to determine if it is a function.
 * @param obj Any object to test if it is a function.
 * @returns True if the object is a function.
 */
export function isFunction(obj: unknown) {
  return typeof obj === 'function'
}

/**
 * Tests if a variable is null or undefined.
 * @param obj Any variable to test if it is null or undefined.
 * @returns True if the object passed in is null or undefined.
 */
export function isNullOrUndefined(obj: unknown): obj is undefined | null {
  return typeof obj === 'undefined' || obj === null
}

export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}

/**
 * When getting form data from a UI, the textbox data is always a string.
 * Use this method to convert any string, number or boolean to its boolean value;
 * @param b Any object to test if it can be converted to a boolean.
 */
export function getBoolean(b: unknown) {
  if (!b) {
    return false
  }

  if (isBoolean(b)) {
    return b
  }

  if (isString(b)) {
    const s = safestrLowercase(b).trim()
    switch (s) {
      case 'false':
      case 'f':
      case 'n':
      case 'no':
      case '0':
      case '':
        return false
      // Case 'true':
      // Case 't':
      // Case 'y':
      // Case 'yes':
      default:
        return true
    }
  }

  if (isNumber(b)) {
    return b !== 0
  }

  return false
}
export function getBooleanUndefined(b: unknown) {
  const bret = getBoolean(b)

  return bret ? true : undefined
}

/**
 * Gets the percentage change from two numbers.
 * Can be negative if there is a drop from the previous to the current number.
 * @param prev The previous number.
 * @param cur The new current number.
 * @returns The percentage number from -100 to 100.
 */
export function getPercentChange(prev: number, cur: number) {
  let percent = 0
  if (cur) {
    if (prev) {
      percent = ((cur - prev) * 100) / prev
    } else {
      percent = cur * 100
    }
  } else if (prev) {
    percent = -(prev * 100)
  }

  return percent
}

/**
 * Gets the percentage change from two numbers as a string with the % sign appended if desired.
 * Can be negative if there is a drop from the previous to the current number.
 * @param prev The previous number.
 * @param cur The new current number.
 * @param showPercent Set to true if you want the % sign appended.
 * @param decimalPlaces The number of decimal places to show. Defaults to 2.
 * @returns The percentage number from -100 to 100.
 */
export function getPercentChangeString(
  prev: number,
  cur: number,
  showPercent = true,
  decimalPlaces = 2
) {
  const percent = getPercentChange(prev, cur)

  // Return Math.floor(percent)
  let ret = percent.toFixed(decimalPlaces < 0 ? 0 : decimalPlaces)
  if (showPercent) {
    ret += '%'
  }

  return (percent > 0 ? '+' : '') + ret
}

/**
 * Checks any object, string or array if it has any data.
 * The minlength is for requiring more items to be in the object, string or array.
 * You can pass in a function that must return an object, string or array to be tested as well.
 * @param o Any object, string or array. If it is a function, the function will be called to get the object, string or array before testing.
 * @param minlength The required minimum length to consider to have data. If not supplied, defaults to 1.
 * @returns True if the object meets the minimum length requirements.
 */
export function hasData(o: unknown, minlength = 1): boolean {
  // Console.log('minlength: ' + minlength + ', o: ' + o)
  try {
    if (!o) {
      return false
    }

    if (isNullOrUndefined(minlength)) {
      throw new AppException('Minimum length cannot be null or undefined.')
    }

    if (isFunction(o)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return hasData(o(), minlength)
    }

    if (isString(o)) {
      if (minlength < 1) {
        throw new AppException(
          'Minimum length for string comparisons must be greater than 0.',
          'hasData',
          o
        )
      }

      return o.length >= minlength
    }

    if (isArray(o)) {
      if (minlength < 1) {
        throw new AppException(
          'Minimum length for array comparisons must be greater than 0.',
          'hasData',
          o
        )
      }

      return o.length >= minlength
    }

    // Primitives cannot have more than 1 by definition of not being an array or object.
    if (!isObject(o)) {
      if (isSymbol(o)) {
        return minlength === 1
      }

      if (isNumber(o)) {
        return o >= minlength
      }

      return Boolean(o)
    }

    if (DateHelper.isDateObject(o)) {
      return o.getTime() >= minlength
    }

    if (minlength < 1) {
      throw new AppException(
        'Minimum length for object comparisons must be greater than 0.',
        'hasData',
        o
      )
    }

    return isArray(Object.keys(o), minlength)
  } catch (ex) {
    console.error(hasData.name, ex)
  }

  return false
}

/**
 * Returns a new global unique identifier (GUID).
 * @returns A global unique identifier as a 16 character string.
 */
export function newGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/gu, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0,
      // eslint-disable-next-line no-bitwise
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Compares two objects and returns a value for use in the JavaScript sort() method.
 * @param a The first object to compare with.
 * @param b The second object to compare with.
 * @param isAsc True if you want to sort ascending.
 * @param compareStringsLowercase True if you want to do a lowercase compare on strings.
 * @returns -1, 0 or 1 depending on the sort direction.
 */
export function sortFunction(
  a: unknown,
  b: unknown,
  sortOrder: SortOrder = true,
  compareStringsLowercase = true
) {
  const aEmpty = isNullOrUndefined(a),
    bEmpty = isNullOrUndefined(b),
    isAsc = SortOrderAsBoolean(sortOrder)

  if (aEmpty && bEmpty) {
    return 0
  }
  // Null and undefined sort after anything else
  else if (aEmpty) {
    return 1
  } else if (bEmpty) {
    return -1
  }
  // Equal items sort equally
  else if (a === b) {
    return 0
  } else if (compareStringsLowercase && isString(a) && isString(b)) {
    // A little recursive, but we will not come back here a second time.
    return sortFunction(safestrLowercase(a), safestrLowercase(b), isAsc, false)
  }
  // Otherwise, if we're ascending, lowest sorts first
  else if (isAsc) {
    return a < b ? -1 : 1
  }
  // If descending, highest sorts first

  return a < b ? 1 : -1

  // Return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
}

/**
 * Takes a number and converts to its uppercase hexadecimal string value.
 * @param decimal The number to convert to hexadecimal.
 * @param chars Number of chars to pad for leading zeros.
 * @returns
 */
export function toHex(decimal?: number, chars = 2) {
  if (isNullOrUndefined(chars)) {
    // eslint-disable-next-line no-param-reassign
    chars = 2
  }

  return ((decimal || 0) + 16 ** chars).toString(16).slice(-chars).toUpperCase()
}

/**
 * Joins two strings to make a full URL. This method guards against trailing and leading /'s and always well forms the URL.
 * If a trailing / is desired, urlJoin checks to ensure there is not already trailing / and variables have not already been added to the URL.
 * @param baseUrl The URL base path to start the joining by /.
 * @param relativePath The URL's relative path to be joined.
 * @param addTrailingSlash Set to true to append a trailing / if this is a pure URL without variables.
 * @returns A safely constructed URL joined with a /.
 */
export function urlJoin(
  baseUrl?: string | null,
  relativePath?: ArrayOrSingle<string | number | null | undefined> | null,
  addTrailingSlash = true
) {
  let pathname = safeArray(relativePath)
      .map((x) => {
        if (isNullOrUndefined(x)) {
          throw new AppException(
            'urlJoin() relativePath cannot contain null or undefined values.',
            'urlJoin',
            safeArray(relativePath)
          )
        }

        return isNumber(x) ? x.toString() : x
      })
      .join('/'),
    url = safestr(baseUrl)

  // Remove any trailing slashes before adding a trailing slash.
  while (url.endsWith('/')) {
    url = url.slice(0, -1)
  }

  // Strip front and end slashes, if any.
  while (pathname.startsWith('/')) {
    pathname = pathname.slice(1)
  }
  while (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }

  if (pathname.length) {
    url += `/${pathname}`
  }

  let trailingSlash = addTrailingSlash
  if (
    url.includes('?') ||
    url.includes('&') ||
    url.includes('#') ||
    url.includes('=')
  ) {
    trailingSlash = false
  }

  if (trailingSlash && !url.endsWith('/')) {
    url += '/'
  }

  return url
}

export function FunctionOrTypeValue<T = unknown>(
  val: FunctionOrType<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
): T {
  if (isFunction(val)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return val(...args)
  }

  return val
}
