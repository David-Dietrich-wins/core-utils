import {
  runOnAllMembers,
  isString,
  isNumber,
  isNullOrUndefined,
  isArray,
  isObject,
  safeArray,
  isNumeric,
} from './general.mjs'

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
