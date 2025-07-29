import { StringHelper, isString, safestr, stringIf } from './string-helper.mjs'
import { hasData, isNullOrUndefined } from './general.mjs'
import { isArray } from './array-helper.mjs'
import { runOnAllMembers } from './object-helper.mjs'

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
  if (isNullOrUndefined(obj) || typeof obj !== 'number') {
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

// Export function numberWithCommas(x) {
//   Return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
// }
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class NumberHelper {
  static FormatPrefixSuffixZero(
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
      const str = NumberHelper.NumberToString(
        num,
        showZeroValues,
        toFixedLength
      )

      return `${prefix}${str}${suffix}`
    }

    return ''
  }

  /**
   * Gets a formatted number based on a specified number of decimal places.
   * @param num A number or string representing a number.
   * @param maxDecimalPlaces The maximum number of decimal places to show.
   * @param minDecimalPlaces The minimum number of required decimal places to show.
   * @returns A number with the given decimal places. Or 0 if num was null or undefined.
   */
  static getNumberFormatted(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    numToFormat?: any,
    showZeroValues = true,
    maxDecimalPlaces?: number,
    minDecimalPlaces?: number
  ) {
    let num = numToFormat

    if (isString(num, 1)) {
      const newnum = num.replace(/,/gu, '')

      if (isString(newnum, 1)) {
        num = Number(newnum)
      }
    }

    if (
      !isNullOrUndefined(num) &&
      isNumber(num) &&
      (!isNullOrUndefined(maxDecimalPlaces) ||
        !isNullOrUndefined(minDecimalPlaces))
    ) {
      const mystr = NumberHelper.NumberToString(
        num,
        showZeroValues,
        maxDecimalPlaces,
        minDecimalPlaces
      )
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
  static NumberToString(
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
   * Returns a number used for stock prices.
   * This includes a minimum of 2 decimal places (if there is a mantissa).
   * Will go 4 digits max on the mantissa.
   * @param price The price or number to get a formatted stock price for.
   * @return The formatted stock price.
   */
  static NumberWithDecimalPlaces(price: number, maxDecimalPlaces?: number) {
    const defaultReturn = '0'

    // Const priceret = ''

    if (!isNaN(price)) {
      // If (price < 0) {
      //   Console.log('priceOriginalStr: price:', price, ', plus price:', +price, ', toFixed(4):', (+price).toFixed(4));
      // }

      const maxDecimals = maxDecimalPlaces ?? 4,
        priceOriginal = Number(price)

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
  static AddNumbers<T extends object>(objLeft: T, objRight: T) {
    return runOnAllMembers(
      objLeft,
      (key, val) => {
        const lval = isNumber(val)
            ? val
            : isString(val)
            ? parseFloat(val)
            : NaN,
          robjval: any = (objRight as any)[key],
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
  static DivideByNumbers<T extends object = any>(obj: T, divideBy: number) {
    return runOnAllMembers(obj, (_, val) => {
      let newval = val
      if (isString(val)) {
        newval = parseFloat(val)
      }

      return isNumber(newval) && !isNaN(newval) ? newval / divideBy : val
    })
  }

  /**
   * Returns the mantissa as a whole number.
   * @param num The decimal number to get the mantissa for.
   * @returns The whole number value of the mantissa.
   */
  static getMantissa(num: number) {
    if (!num) {
      return 0
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const str = `${num}`,
      strArray = str.split('.')
    if (isArray(strArray, 2) && hasData(strArray[1])) {
      return Number(strArray[1])
    }

    return 0
  }

  static toFixedPrefixed(
    val: string | number | null | undefined,
    showZeroValues = true,
    toFixedLength = 2,
    prefix = '$'
  ) {
    const s = NumberHelper.NumberToString(val, showZeroValues, toFixedLength)

    return !showZeroValues && !hasData(s)
      ? ''
      : StringHelper.safePrefix(s, prefix)
  }

  static toFixedSuffixed(
    val: string | number | null | undefined,
    showZeroValues = true,
    toFixedLength = 2,
    suffix = '%'
  ) {
    const s = NumberHelper.NumberToString(val, showZeroValues, toFixedLength)

    return !showZeroValues && !hasData(s)
      ? ''
      : StringHelper.safeSuffix(s, suffix)
  }

  static FirstNumberInString(str: string | null | undefined) {
    if (!str) {
      return 0
    }

    const match = str.match(/^\s*(?:-?\d+(?:\.\d+)?)/u)
    return match ? parseFloat(match[0]) : 0
  }
}

/**
 * Returns a number from a string. A number is allowed too in case you don't know if the value is a number already.
 * If a null or undefined value is passed in, 0 is returned.
 * @param stringOrNumber The string or number to return as a number.
 * @returns The number representation of the stringOrNumber. If it is a number, just returns the number.
 */
export function getAsNumber(stringOrNumber?: string | number | bigint | null) {
  return NumberHelper.getNumberFormatted(stringOrNumber)
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
    return NumberHelper.getNumberFormatted(
      stringOrNumber,
      true,
      maxDecimalPlaces,
      minDecimalPlaces
    )
  }
}

export function NumberFormatter(
  val?: string | number | null,
  showZeroValues = true,
  numDecimalPlaces = 2
) {
  return NumberHelper.FormatPrefixSuffixZero(
    val,
    showZeroValues,
    numDecimalPlaces
  )
}
export function NumberFormatterNoDecimal(
  val?: string | number | null,
  showZeroValues = true
) {
  return NumberHelper.FormatPrefixSuffixZero(val, showZeroValues, 0)
}

export function XFormatter(
  val: string | number | null | undefined,
  showZeroValues = true,
  numDecimalPlaces = 2
) {
  return NumberHelper.toFixedSuffixed(
    val,
    showZeroValues,
    numDecimalPlaces,
    'x'
  )
}

export function DollarFormatter(
  val: string | number | null | undefined = 0,
  showZeroValues = true,
  numDecimalPlaces = 2
) {
  return NumberHelper.toFixedPrefixed(val, showZeroValues, numDecimalPlaces)
}

export function StockPriceFormatter(
  price: string | number | null | undefined,
  showZeroValues = false,
  numDecimalPlaces?: number
) {
  if (price || showZeroValues) {
    return NumberHelper.toFixedPrefixed(
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
  return NumberHelper.toFixedSuffixed(
    val,
    showZeroValues,
    numDecimalPlaces,
    '%'
  )
}

export function PercentTimes100Formatter(
  val: number | bigint | string | null | undefined,
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
    element = element.offsetParent
  } while (element)

  return {
    left,
    top,
  }
}
