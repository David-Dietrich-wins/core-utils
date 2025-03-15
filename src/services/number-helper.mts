import {
  getAsNumber,
  getNumberString,
  isArray,
  isNullOrUndefined,
  isNumber,
  isNumeric,
  isObject,
  isString,
  runOnAllMembers,
  safeArray,
} from './general.mjs'
import { capitalizeFirstLetter } from './string-helper.mjs'

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

  const formatter = (num: number) => {
    return Math.round((num * 100) / 100).toFixed(maxDecimalPlaces)
  }

  if (isNumber(obj)) {
    return formatter(obj)
  }

  if (isString(obj)) {
    if (isNumeric(obj)) {
      return formatter(parseFloat(obj)).toString()
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
  toFixedLength = 2,
  prefix = '$'
) {
  return prefix + getNumberString(val, toFixedLength)
}

export function toFixedSuffixed(
  val: number | string,
  toFixedLength = 2,
  suffix = '%'
) {
  return getNumberString(val, toFixedLength) + suffix
}

export function FirstCharCapitalFormatter(s: string) {
  return capitalizeFirstLetter(s)
}

export function formattedNumber(
  val?: number | string,
  toFixedLength = 2,
  prefix = '',
  suffix = ''
) {
  if (isNullOrUndefined(val)) {
    return ''
  }

  const num = isString(val) ? parseFloat(val) : val

  if (num) {
    const str = getNumberString(num, toFixedLength)

    return `${prefix}${str}${suffix}`
  }

  return ''
}

export function NumberFormatter(val?: number | string, numDecimalPlaces = 2) {
  return formattedNumber(val, numDecimalPlaces)
}
export function NumberFormatterNoDecimal(val?: number | string) {
  return formattedNumber(val, 0)
}

export function XFormatter(val: number | string, numDecimalPlaces = 2) {
  return toFixedSuffixed(val, numDecimalPlaces, 'x')
}

export function DollarFormatter(
  val: number | string = 0,
  numDecimalPlaces = 2
) {
  return toFixedPrefixed(val, numDecimalPlaces)
}

export function StockPriceFormatter(
  price: number | string | null | undefined = 0,
  showZeroValues = false,
  numDecimalPlaces?: number
) {
  if (price || showZeroValues) {
    return toFixedPrefixed(
      price ?? 0,
      isNullOrUndefined(numDecimalPlaces)
        ? Math.abs(getAsNumber(price)) < 1
          ? 4
          : 2
        : numDecimalPlaces
    )
  }
}

export function PercentFormatter(val: number | string, numDecimalPlaces = 2) {
  return toFixedSuffixed(val, numDecimalPlaces, '%')
}

export function PercentTimes100Formatter(
  val: number | string,
  numDecimalPlaces = 2
) {
  return PercentFormatter(getAsNumber(val) * 100, numDecimalPlaces)
}

export function StockVolumeFormatter(
  volume?: number | string,
  showZeroValues = false,
  numDecimalPlaces = 0
) {
  if (volume || showZeroValues) {
    const num = NumberFormatter(
      isNullOrUndefined(volume) ? 0 : volume,
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
 * Returns a number used for stock prices.
 * This includes a minimum of 2 decimal places (if there is a mantissa).
 * Will go 4 digits max on the mantissa.
 * @param price The price or number to get a formatted stock price for.
 * @return The formatted stock price.
 */
export function getStockPrice(price: number, maxDecimalPlaces?: number) {
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

export function getStockPriceInDollars(price: number, maxDecimalPlaces = 4) {
  const dollar = '$' + getStockPrice(price, maxDecimalPlaces)

  return dollar.replace('$-', '-$')
}

// export function numberWithCommas(x) {
//   return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
// }
