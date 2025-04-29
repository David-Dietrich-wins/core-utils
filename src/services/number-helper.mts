import { AppException } from '../models/AppException.mjs'
import { isArray, safeArray } from './array-helper.mjs'
import { hasData, isNullOrUndefined } from './general.mjs'
import { isObject, runOnAllMembers } from './object-helper.mjs'
import { isString, stringIf } from './string-helper.mjs'

export type NumberFormattingBreakpoints = {
  value: number | bigint | string
  minDecimalPlaces?: number
  maxDecimalPlaces?: number
  showZeroValues?: boolean
  prefix?: string
  suffix?: string
  formatFunction?: FormatFunction
}
export type NumberFormattingOptions = Omit<
  NumberFormattingBreakpoints,
  'value'
> & {
  breakPoints?: NumberFormattingBreakpoints[]
  differentForNegative?: boolean
}

/**
 * Individually adds all same member names who are number together.
 * Returns a new object with every number member added together.
 * @param objLeft Adds all number members to the right.
 * @param objRight Adds all number members to the right.
 */
export function addNumbers<T extends object>(objLeft: T, objRight: T) {
  return runOnAllMembers(
    objLeft,
    (key, val) => {
      const lval = isNumber(val) ? val : isString(val) ? parseFloat(val) : NaN
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const robjval: any = (objRight as any)[key]
      const rval = isNumber(robjval)
        ? robjval
        : isString(robjval)
        ? parseFloat(robjval)
        : NaN

      if (isNaN(lval)) {
        return isNaN(rval) ? val : rval
      }

      return isNaN(rval) ? lval : lval + rval
    },
    false
  )
}

/**
 * Takes an object and divides every member by divideBy.
 * @param obj Object to divide all members.
 * @param divideBy The number to divide all members by.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function divideByNumbers<T extends object = any>(
  obj: T,
  divideBy: number
) {
  return runOnAllMembers(obj, (_, val) => {
    let newval = val
    if (isString(val)) {
      newval = parseFloat(val)
    }

    return isNumber(newval) && !isNaN(newval) ? newval / divideBy : val
  })
}

export function setMaxDecimalPlaces(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  maxDecimalPlaces = 2,
  ignoreKeys: string[] = []
) {
  if (isNullOrUndefined(maxDecimalPlaces)) {
    throw new Error('Invalid number of decimal places.')
  }

  const formatter = (num: number): string => {
    return Math.round((num * 100) / 100).toFixed(maxDecimalPlaces)
  }

  if (isNumber(obj)) {
    return formatter(obj)
  }

  if (isString(obj)) {
    if (isNumeric(obj)) {
      return formatter(parseFloat(obj))
    } else {
      throw new AppException(
        'Invalid number format. Expected a number or numeric string.',
        'NumberFormatterError'
      )
    }
  }

  // Go through the whole array.
  if (isArray(obj)) {
    return safeArray(obj).reduce((acc, cur) => {
      acc.push(setMaxDecimalPlaces(cur))

      return acc
    }, [])
  }

  ignoreKeys = safeArray(ignoreKeys)
  if (isObject(obj)) {
    Object.entries(obj).forEach(([key, val]) => {
      if (!ignoreKeys.includes(key) && isNumeric(val)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(obj as any)[key] = formatter(val as number)
      }
    })
  }

  return obj
}

export type FormatFunction = (val: unknown) => string

export function toFixedPrefixed(
  val: number | string,
  showZeroValues = true,
  toFixedLength = 2,
  prefix = '$'
) {
  const s = getNumberString(val, showZeroValues, toFixedLength)

  return !showZeroValues && !hasData(s) ? '' : prefix + s
}

export function toFixedSuffixed(
  val: number | string,
  showZeroValues = true,
  toFixedLength = 2,
  suffix = '%'
) {
  const s = getNumberString(val, showZeroValues, toFixedLength)

  return !showZeroValues && !hasData(s) ? '' : s + suffix
}

export function formattedNumber(
  val?: number | bigint | string,
  showZeroValues = true,
  toFixedLength = 2,
  prefix = '',
  suffix = ''
) {
  if (isNullOrUndefined(val)) {
    return ''
  }

  const num = isString(val) ? parseFloat(val) : val

  if (num) {
    const str = getNumberString(num, showZeroValues, toFixedLength)

    return `${prefix}${str}${suffix}`
  }

  return ''
}

export function NumberFormatter(
  val?: number | bigint | string,
  showZeroValues = true,
  numDecimalPlaces = 2
) {
  return formattedNumber(val, showZeroValues, numDecimalPlaces)
}
export function NumberFormatterNoDecimal(
  val?: number | bigint | string,
  showZeroValues = true
) {
  return formattedNumber(val, showZeroValues, 0)
}

export function XFormatter(
  val: number | string,
  showZeroValues = true,
  numDecimalPlaces = 2
) {
  return toFixedSuffixed(val, showZeroValues, numDecimalPlaces, 'x')
}

export function DollarFormatter(
  val: number | string = 0,
  showZeroValues = true,
  numDecimalPlaces = 2
) {
  return toFixedPrefixed(val, showZeroValues, numDecimalPlaces)
}

export function StockPriceFormatter(
  price: number | string | null | undefined = 0,
  showZeroValues = false,
  numDecimalPlaces?: number
) {
  if (price || showZeroValues) {
    return toFixedPrefixed(
      price ?? 0,
      showZeroValues,
      isNullOrUndefined(numDecimalPlaces)
        ? Math.abs(getAsNumber(price)) < 1
          ? 4
          : 2
        : numDecimalPlaces
    )
  }
}

export function PercentFormatter(
  val: number | string,
  showZeroValues = false,
  numDecimalPlaces = 2
) {
  return toFixedSuffixed(val, showZeroValues, numDecimalPlaces, '%')
}

export function PercentTimes100Formatter(
  val: number | string,
  showZeroValues = false,
  numDecimalPlaces = 2
) {
  return PercentFormatter(
    getAsNumber(val) * 100,
    showZeroValues,
    numDecimalPlaces
  )
}

export function StockVolumeFormatter(
  volume?: number | string | null,
  showZeroValues = false,
  numDecimalPlaces = 0
) {
  if (volume || showZeroValues) {
    const num = NumberFormatter(
      isNullOrUndefined(volume) ? 0 : volume,
      showZeroValues,
      numDecimalPlaces ?? 0
    )
    if (num || showZeroValues) {
      return num
    }
  }
}

/**
 * Gets the top and left coordinates of the element passed in.
 * Since there is no way to easily get the top and left,
 * you need to add up all of the offsets to the top of the parent element chain.
 * @param element An HTML or NativeElement to get top and left coordinates.
 * @returns The top and left coordinates of element.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function elementTopLeftCoords(element: any): {
  top: number
  left: number
} {
  let top = 0
  let left = 0
  do {
    top += element.offsetTop || 0
    left += element.offsetLeft || 0
    element = element.offsetParent
  } while (element)

  return {
    top,
    left,
  }
}

/**
 * Returns a number from a string. A number is allowed too in case you don't know if the value is a number already.
 * If a null or undefined value is passed in, 0 is returned.
 * @param stringOrNumber The string or number to return as a number.
 * @returns The number representation of the stringOrNumber. If it is a number, just returns the number.
 */
export function getAsNumber(stringOrNumber?: string | number | bigint | null) {
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
  stringOrNumber?: string | number | bigint | null,
  maxDecimalPlaces?: number,
  minDecimalPlaces?: number
) {
  if (hasData(stringOrNumber)) {
    return getNumberFormatted(
      stringOrNumber,
      true,
      maxDecimalPlaces,
      minDecimalPlaces
    )
  }
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

  const str = '' + num
  const arr = str.split('.')
  if (isArray(arr, 2) && hasData(arr[1])) {
    return +arr[1]
  }

  return 0
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
  num?: any | null,
  showZeroValues = true,
  maxDecimalPlaces?: number,
  minDecimalPlaces?: number
) {
  if (isString(num, 1)) {
    const newnum = num.replace(/,/g, '')

    if (isString(newnum, 1)) {
      num = +newnum
    }
  }

  if (
    !isNullOrUndefined(num) &&
    isNumber(num) &&
    (!isNullOrUndefined(maxDecimalPlaces) ||
      !isNullOrUndefined(minDecimalPlaces))
  ) {
    const mystr = getNumberString(
      num,
      showZeroValues,
      maxDecimalPlaces,
      minDecimalPlaces
    )
    return parseFloat(mystr.replace(/,/g, ''))
  }

  return isNumber(num) ? num : 0
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
  showZeroValues = true,
  maxDecimalPlaces?: number,
  minDecimalPlaces?: number
) {
  if (isString(num, 1)) {
    const newnum = num.replace(/,/g, '')

    if (isString(newnum, 1)) {
      num = +newnum
    }
  }

  if (!showZeroValues && num === 0) {
    return ''
  }

  maxDecimalPlaces = maxDecimalPlaces || 0
  minDecimalPlaces = minDecimalPlaces || maxDecimalPlaces

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimalPlaces,
    minimumFractionDigits: minDecimalPlaces,
  }).format(num)
}
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
  minValue: number | null | undefined = null,
  maxValue: number | null | undefined = null
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

export function isNumeric(value?: string | number | bigint): boolean {
  return (
    !isNullOrUndefined(value) &&
    value !== '' &&
    !isNaN(Number(value.toString()))
  )
}

// export function numberWithCommas(x) {
//   return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
// }
export class NumberHelper {
  /**
   * Returns a number used for stock prices.
   * This includes a minimum of 2 decimal places (if there is a mantissa).
   * Will go 4 digits max on the mantissa.
   * @param price The price or number to get a formatted stock price for.
   * @return The formatted stock price.
   */
  static NumberWithDecimalPlaces(price: number, maxDecimalPlaces?: number) {
    const defaultReturn = '0'

    // const priceret = ''

    if (!isNaN(price)) {
      // if (price < 0) {
      //   console.log('priceOriginalStr: price:', price, ', plus price:', +price, ', toFixed(4):', (+price).toFixed(4));
      // }

      maxDecimalPlaces = maxDecimalPlaces ?? 4
      const priceOriginal = +price

      return new Intl.NumberFormat('en', {
        maximumFractionDigits: maxDecimalPlaces,
        minimumFractionDigits: maxDecimalPlaces > 1 ? 2 : maxDecimalPlaces,
      }).format(priceOriginal)
      // // Make sure we have something.
      // const priceOriginalStr = priceOriginal.toFixed(maxDecimalPlaces);
      // // if (price < 0) {
      // //   console.log('priceOriginalStr: price:', priceOriginalStr, ',
      // // original number price:', priceOriginal, ', toFixed(4):', (+price).toFixed(4));
      // // }
      // if (priceOriginalStr && priceOriginalStr.length) {
      //   // split to get the mantissa.
      //   let pricearr = priceOriginalStr.split('.');
      //   // if (price < 0) {
      //   //   console.log('pricearr:', pricearr, ', original number price:', priceOriginal, ', toFixed(4):', (+price).toFixed(4));
      //   // }
      //   if (isArray(pricearr, 1)) {
      //     // if (price < 0) {
      //     //   console.log('pricearr:', pricearr, ', original number price:', priceOriginal, ', toFixed(4):', (+price).toFixed(4));
      //     // }
      //     let mantissa = isArray(pricearr, 2) && hasData(pricearr[1]) ? pricearr[1] : '';
      //     let mantissalen = mantissa.length;

      //     // Lop off any unneeded 0s.
      //     if (mantissalen) {
      //       // if (price < 0 && price > -1) {
      //       //   console.log('pricearr:', pricearr, ', original number price:', priceOriginal, ', toFixed(4):', (+price).toFixed(4));
      //       // }
      //       let lastchar = mantissa.charAt(mantissa.length - 1);
      //       while ('0' === lastchar && mantissalen > 2) {
      //         mantissa = mantissa.slice(0, -1);
      //         mantissalen = mantissa.length;
      //       }

      //       if (hasData(mantissa) && mantissalen) {
      //         // if (price < 0 && price > -1) {
      //         //   console.log('priceOriginalStr end:', priceOriginalStr, ', number:', priceOriginal, ', pricearr:', pricearr);
      //         // }
      //         priceret = priceOriginal.toFixed(mantissalen);
      //       }
      //     }

      //     if (!priceret && hasData(pricearr[0])) {
      //       priceret = priceOriginalStr;
      //     }
      //   }
      // }
    }

    // if (priceret) {
    //   // priceret = numberWithCommas(priceret);
    //   // Lop off the .00 for now.
    //   if (priceret.length > 3 && '.00' === priceret.substr(-3)) {
    //     return priceret.substr(0, priceret.length - 3)
    //   }

    //   return priceret
    // }

    return defaultReturn
  }

  static PriceInDollars(
    price: number,
    showDollarSign = true,
    maxDecimalPlaces = 4
  ) {
    const dollar =
      stringIf(showDollarSign, '$') +
      NumberHelper.NumberWithDecimalPlaces(price, maxDecimalPlaces)

    return dollar.replace('$-', '-$')
  }

  static DownUpOrEqual(
    currentValue: number,
    priceChange: number | null | undefined,
    isShort = false
  ) {
    let up: boolean | undefined = undefined

    if (isNullOrUndefined(priceChange)) {
      if (isShort) {
        if (currentValue < 0) {
          up = true
        } else if (currentValue > 0) {
          up = false
        }
      } else {
        if (currentValue < 0) {
          up = false
        } else if (currentValue > 0) {
          up = true
        }
      }
      // } else if (isShort) {
      //   if (priceChange > 0) {
      //     cn += 'tp-number-down '
      //   } else if (priceChange < 0) {
      //     cn += 'tp-number-up '
      //   }
    } else {
      // priceChange already accounts for isShort
      if (priceChange < 0) {
        up = false
      } else if (priceChange > 0) {
        up = true
      }
    }

    return isNullOrUndefined(up) ? 0 : up ? 1 : -1
  }
}
