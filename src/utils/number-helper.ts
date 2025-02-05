import {
  runOnAllMembers,
  isString,
  isNumber,
  isNullOrUndefined,
  isArray,
  isObject,
  safeArray,
} from './skky.js'

/**
 * Individually adds all same member names who are number together.
 * Returns a new object with every number member added together.
 * @param objLeft Adds all number members to the right.
 * @param objRight Adds all number members to the right.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addNumbers<T extends object = any>(objLeft: T, objRight: T) {
  return runOnAllMembers(
    objLeft,
    (key, val) => {
      const lval = parseFloat(val)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rval: any = (objRight as any)[key] ? parseFloat((objRight as any)[key]) : NaN

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
<<<<<<< HEAD
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function divideByNumbers<T extends object = any>(obj: T, divideBy: number) {
  return runOnAllMembers(obj, (_, val) => {
=======
export function divideByNumbers<T extends object = object>(obj: T, divideBy: number) {
  return runOnAllMembers(obj, (key, val) => {
>>>>>>> 5ed179635b17d3454802648186c6b4d535190e23
    if (isString(val)) {
      val = parseFloat(val)
    }

<<<<<<< HEAD
    return isNumber(val) && !isNaN(val) ? val / divideBy : val
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setMaxDecimalPlaces(obj: any, maxDecimalPlaces = 2, ignoreKeys: string[] = []) {
=======
    return isNumber(val) ? val / divideBy : val
  })
}

export function setMaxDecimalPlaces(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  maxDecimalPlaces = 2,
  ignoreKeys: string[] = []
) {
>>>>>>> 5ed179635b17d3454802648186c6b4d535190e23
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
    // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    // ...and ensure strings of whitespace fail
    if (!isNaN(parseFloat(obj))) {
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
      if (!ignoreKeys.includes(key) && isNumber(val) && !isNaN(val as number)) {
        obj[key] = formatter(val as number)
      }
    })
  }

  return obj
}
