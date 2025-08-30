import { hasData, isNullOrUndefined } from '../general.mjs'
import { isArray } from './array-helper.mjs'
import { isString } from './string-helper.mjs'

/**
 * Tests an object to determine if it is a number.
 * Additionally, will test if the number is greater than or equal to a minimum value and/or less than or equal to a maximum value.
 * @param obj Any object to test if it is a number.
 * @param minValue The minimum value the number must be.
 * @param maxValue The maximum value the number can be.
 * @returns True if the object is a number and if provided, >= to the minValue and/or <= to the maxValue.
 */
export function isNumber(
  obj: unknown,
  minValue: number | null = null,
  maxValue: number | null = null
): obj is number {
  if (isNullOrUndefined(obj) || 'number' !== typeof obj) {
    return false
  }

  let bret = true
  if (minValue) {
    bret = obj >= minValue
  }

  if (bret && maxValue) {
    bret = obj <= maxValue
  }

  return bret
}

export function isNumeric(value?: string | number): boolean {
  return (
    !isNullOrUndefined(value) &&
    value !== '' &&
    !isNaN(Number(value.toString()))
  )
}

/**
 * Returns the mantissa as a whole number.
 * @param num The decimal number to get the mantissa for.
 * @returns The whole number value of the mantissa.
 */
export function getMantissa(num: number) {
  if (!num) {
    return 0
  }

  const str = num.toString()
  const arr = str.split('.')
  if (isArray(arr, 2) && hasData(arr[1])) {
    return Number(arr[1])
  }

  return 0
}

/**
 * Gets a formatted number based on a specified number of decimal places.
 * @param num A number or string representing a number.
 * @param maxDecimalPlaces The maximum number of decimal places to show.
 * @param minDecimalPlaces The minimum number of required decimal places to show.
 * @returns A string of the passed in num with the given decimal places.
 */
export function getNumberString(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  num: any,
  maxDecimalPlaces?: number,
  minDecimalPlaces?: number
) {
  if (isString(num, 1)) {
    const newnum = num.replace(/,/gu, '')

    if (isString(newnum, 1)) {
      // eslint-disable-next-line no-param-reassign
      num = Number(newnum)
    }
  }

  // eslint-disable-next-line no-param-reassign
  maxDecimalPlaces ||= 0
  // eslint-disable-next-line no-param-reassign
  minDecimalPlaces ||= maxDecimalPlaces

  return new Intl.NumberFormat('en', {
    maximumFractionDigits: maxDecimalPlaces,
    minimumFractionDigits: minDecimalPlaces,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  }).format(num)
}

/**
 * Gets a formatted number based on a specified number of decimal places.
 * @param num A number or string representing a number.
 * @param maxDecimalPlaces The maximum number of decimal places to show.
 * @param minDecimalPlaces The minimum number of required decimal places to show.
 * @returns A number with the given decimal places. Or 0 if num was null or undefined.
 */
export function getNumberFormatted(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  num: any,
  maxDecimalPlaces?: number,
  minDecimalPlaces?: number
) {
  if (isString(num, 1)) {
    const newnum = num.replace(/,/gu, '')

    if (isString(newnum, 1)) {
      // eslint-disable-next-line no-param-reassign
      num = Number(newnum)
    }
  }

  if (
    !isNullOrUndefined(num) &&
    isNumber(num) &&
    (!isNullOrUndefined(maxDecimalPlaces) ||
      !isNullOrUndefined(minDecimalPlaces))
  ) {
    const mystr = getNumberString(num, maxDecimalPlaces, minDecimalPlaces)
    return parseFloat(mystr.replace(/,/gu, ''))
  }

  return isNumber(num) ? num : 0
}

/**
 * Returns a number from a string. A number is allowed too in case you don't know if the value is a number already.
 * If a null or undefined value is passed in, 0 is returned.
 * @param stringOrNumber The string or number to return as a number.
 * @returns The number representation of the stringOrNumber. If it is a number, just returns the number.
 */
export function getAsNumber(
  stringOrNumber: string | number | null | undefined
) {
  return getNumberFormatted(stringOrNumber)
}

/**
 * Returns a number from a string. A number is allowed too in case you don't know if the value is a number already.
 * If a null or undefined is passed in, then undefined is returned.
 * @param stringOrNumber The string or number to return as a number. Or undefined if a null or undefined is passed in.
 * @param maxDecimalPlaces The maximum number of decimal places to show.
 * @param minDecimalPlaces The minimum number of required decimal places to show.
 * @returns The number representation of the stringOrNumber. If it is a number, just returns the number.
 */
export function getAsNumberOrUndefined(
  stringOrNumber: string | number | null | undefined,
  maxDecimalPlaces?: number,
  minDecimalPlaces?: number
) {
  if (hasData(stringOrNumber)) {
    return getNumberFormatted(
      stringOrNumber,
      maxDecimalPlaces,
      minDecimalPlaces
    )
  }
}
