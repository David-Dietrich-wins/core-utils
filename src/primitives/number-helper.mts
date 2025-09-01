import {
  hasData,
  isNullOrUndefined,
  runOnAllMembers,
} from './object-helper.mjs'
import {
  isString,
  safePrefix,
  safeSuffix,
  safestr,
  stringIf,
} from './string-helper.mjs'
import { isArray } from './array-helper.mjs'

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

  const str = num.toString(),
    strArray = str.split('.')
  if (isArray(strArray, 2) && hasData(strArray[1])) {
    return Number(strArray[1])
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
 * Gets a formatted number based on a specified number of decimal places.
 * @param num A number or string representing a number.
 * @param maxDecimalPlaces The maximum number of decimal places to show.
 * @param minDecimalPlaces The minimum number of required decimal places to show.
 * @returns A string of the passed in num with the given decimal places.
 */
export function NumberToString(
  num: string | number | null | undefined,
  showZeroValues = true,
  maxDecimalPlaces?: number,
  minDecimalPlaces?: number
) {
  if (isNullOrUndefined(num)) {
    return ''
  }

  if (isString(num)) {
    const newnum = num.replace(/,/gu, '')

    // eslint-disable-next-line no-param-reassign
    num = num.length === 0 ? 0 : Number(newnum)
  }

  if ((!showZeroValues && num === 0) || isNaN(num)) {
    return ''
  }

  const maxDecimals = maxDecimalPlaces || 0,
    minDecimals = minDecimalPlaces || maxDecimals

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: minDecimals,
  }).format(num)
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

export function FormatPrefixSuffixZero(
  val?: string | number | null,
  showZeroValues = true,
  toFixedLength = 2,
  prefix = '',
  suffix = ''
) {
  if (isNullOrUndefined(val)) {
    return ''
  }

  const num = isString(val) ? parseFloat(safestr(val, '0')) : val

  if (num || showZeroValues) {
    const str = NumberToString(num, showZeroValues, toFixedLength)

    return `${prefix}${str}${suffix}`
  }

  return ''
}

/**
 * Returns a number used for stock prices.
 * This includes a minimum of 2 decimal places (if there is a mantissa).
 * Will go 4 digits max on the mantissa.
 * @param price The price or number to get a formatted stock price for.
 * @return The formatted stock price.
 */
export function NumberWithDecimalPlaces(
  price: number,
  maxDecimalPlaces?: number
) {
  const defaultReturn = '0'

  // Const priceret = ''

  if (!isNaN(price)) {
    // If (price < 0) {
    //   Console.log('priceOriginalStr: price:', price, ', plus price:', +price, ', toFixed(4):', (+price).toFixed(4));
    // }

    const maxDecimals = maxDecimalPlaces ?? 4,
      priceOriginal = price

    return new Intl.NumberFormat('en', {
      maximumFractionDigits: maxDecimals,
      minimumFractionDigits: maxDecimals > 1 ? 2 : maxDecimals,
    }).format(priceOriginal)
    // // Make sure we have something.
    // Const priceOriginalStr = priceOriginal.toFixed(maxDecimalPlaces);
    // // if (price < 0) {
    // //   console.log('priceOriginalStr: price:', priceOriginalStr, ',
    // // original number price:', priceOriginal, ', toFixed(4):', (+price).toFixed(4));
    // // }
    // If (priceOriginalStr && priceOriginalStr.length) {
    //   // split to get the mantissa.
    //   Let pricearr = priceOriginalStr.split('.');
    //   // if (price < 0) {
    //   //   console.log('pricearr:', pricearr, ', original number price:', priceOriginal, ', toFixed(4):', (+price).toFixed(4));
    //   // }
    //   If (isArray(pricearr, 1)) {
    //     // if (price < 0) {
    //     //   console.log('pricearr:', pricearr, ', original number price:', priceOriginal, ', toFixed(4):', (+price).toFixed(4));
    //     // }
    //     Let mantissa = isArray(pricearr, 2) && hasData(pricearr[1]) ? pricearr[1] : '';
    //     Let mantissalen = mantissa.length;

    //     // Lop off any unneeded 0s.
    //     If (mantissalen) {
    //       // if (price < 0 && price > -1) {
    //       //   console.log('pricearr:', pricearr, ', original number price:', priceOriginal, ', toFixed(4):', (+price).toFixed(4));
    //       // }
    //       Let lastchar = mantissa.charAt(mantissa.length - 1);
    //       While ('0' === lastchar && mantissalen > 2) {
    //         Mantissa = mantissa.slice(0, -1);
    //         Mantissalen = mantissa.length;
    //       }

    //       If (hasData(mantissa) && mantissalen) {
    //         // if (price < 0 && price > -1) {
    //         //   console.log('priceOriginalStr end:', priceOriginalStr, ', number:', priceOriginal, ', pricearr:', pricearr);
    //         // }
    //         Priceret = priceOriginal.toFixed(mantissalen);
    //       }
    //     }

    //     If (!priceret && hasData(pricearr[0])) {
    //       Priceret = priceOriginalStr;
    //     }
    //   }
    // }
  }

  // If (priceret) {
  //   // priceret = numberWithCommas(priceret);
  //   // Lop off the .00 for now.
  //   If (priceret.length > 3 && '.00' === priceret.substr(-3)) {
  //     Return priceret.substr(0, priceret.length - 3)
  //   }

  //   Return priceret
  // }

  return defaultReturn
}

export function PriceInDollars(
  price: number,
  showDollarSign = true,
  maxDecimalPlaces = 4
) {
  const dollar =
    stringIf(showDollarSign, '$') +
    NumberWithDecimalPlaces(price, maxDecimalPlaces)

  return dollar.replace('$-', '-$')
}

export function DownUpOrEqual(
  startValue: number,
  endValue: number | null | undefined,
  isShort = false
) {
  if (isNullOrUndefined(endValue) || startValue === endValue) {
    return 0
  }

  if (isShort) {
    return endValue > startValue ? -1 : 1
  }

  return endValue > startValue ? 1 : -1
}

/**
 * Individually adds all same member names who are number together.
 * Returns a new object with every number member added together.
 * @param objLeft Adds all number members to the right.
 * @param objRight Adds all number members to the right.
 */
export function AddNumbers<T extends object>(objLeft: T, objRight: T) {
  return runOnAllMembers(
    objLeft,
    (key, val) => {
      const lval = isNumber(val) ? val : isString(val) ? parseFloat(val) : NaN,
        robjval = (objRight as Record<string, unknown>)[key],
        rval = isNumber(robjval)
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
export function DivideByNumbers<T extends object = any>(
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

export function toFixedPrefixed(
  val: string | number | null | undefined,
  showZeroValues = true,
  toFixedLength = 2,
  prefix = '$'
) {
  const s = NumberToString(val, showZeroValues, toFixedLength)

  return !showZeroValues && !hasData(s) ? '' : safePrefix(s, prefix)
}

export function toFixedSuffixed(
  val: string | number | null | undefined,
  showZeroValues = true,
  toFixedLength = 2,
  suffix = '%'
) {
  const s = NumberToString(val, showZeroValues, toFixedLength)

  return !showZeroValues && !hasData(s) ? '' : safeSuffix(s, suffix)
}

export function FirstNumberInString(str: string | null | undefined) {
  if (!str) {
    return 0
  }

  const match = str.match(/^\s*(?:-?\d+(?:\.\d+)?)/u)
  return match ? parseFloat(match[0]) : 0
}

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

export type FormatFunction = (val: unknown) => string

// Export function numberWithCommas(x) {
//   Return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
// }

export function NumberFormatter(
  val?: string | number | null,
  showZeroValues = true,
  numDecimalPlaces = 2
) {
  return FormatPrefixSuffixZero(val, showZeroValues, numDecimalPlaces)
}
export function NumberFormatterNoDecimal(
  val?: string | number | null,
  showZeroValues = true
) {
  return FormatPrefixSuffixZero(val, showZeroValues, 0)
}

export function XFormatter(
  val: string | number | null | undefined,
  showZeroValues = true,
  numDecimalPlaces = 2
) {
  return toFixedSuffixed(val, showZeroValues, numDecimalPlaces, 'x')
}

export function DollarFormatter(
  val: string | number | null | undefined = 0,
  showZeroValues = true,
  numDecimalPlaces = 2
) {
  return toFixedPrefixed(val, showZeroValues, numDecimalPlaces)
}

export function StockPriceFormatter(
  price: string | number | null | undefined,
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
  val: string | number | null | undefined,
  showZeroValues = false,
  numDecimalPlaces = 2
) {
  return toFixedSuffixed(val, showZeroValues, numDecimalPlaces, '%')
}

export function PercentTimes100Formatter(
  val: number | string | null | undefined,
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
  volume: string | number | null | undefined,
  showZeroValues = false,
  numDecimalPlaces = 0
) {
  if (volume || showZeroValues) {
    const num = NumberFormatter(
      volume ?? 0,
      showZeroValues,
      numDecimalPlaces || 0
    )

    if (showZeroValues || !/^0*\.?0*$/u.test(num)) {
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
  let left = 0,
    top = 0
  do {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    top += getAsNumber(safestr(element.offsetTop))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    left += getAsNumber(safestr(element.offsetLeft))
    // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unsafe-member-access
    element = element.offsetParent
  } while (element)

  return {
    left,
    top,
  }
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
