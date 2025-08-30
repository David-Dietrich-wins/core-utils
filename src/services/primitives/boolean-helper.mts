import { isString, safestrLowercase } from './string-helper.mjs'
import { isNumber } from './number-helper.mjs'

/**
 * Tests an object to determine if it is a type boolean.
 * @param obj Any object to test if it is a boolean value.
 * @returns True if the object is a boolean.
 */
export function isBoolean(obj: unknown): obj is boolean {
  return 'boolean' === typeof obj
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
      // case 'true':
      // case 't':
      // case 'y':
      // case 'yes':
      default:
        return true
    }
  }

  if (isNumber(b)) {
    return 0 !== b
  }

  return false
}

export function getBooleanAsNumber(b: unknown) {
  return getBoolean(b) ? 1 : 0
}
