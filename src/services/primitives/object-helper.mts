/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { DateHelper, isDateObject } from './date-helper.mjs'
import { hasData, isNullOrUndefined } from '../general.mjs'
import { isArray, safeArray } from './array-helper.mjs'
import { isString, safestrLowercase } from './string-helper.mjs'
import { AppException } from '../../models/AppException.mjs'
import { StringOrStringArray } from '../../models/types.mjs'
import { isFunction } from './function-helper.mjs'
import { isNumber } from './number-helper.mjs'
import util from 'util'

export const ARRAY_KeysToAlwaysRemove = ['password', 'pwd', 'secret']

const CONST_JsonDepth = 5

/**
 * Searches an object's keys for a specific key and returns the value
 * Best for ensuring that a field exists in an object
 * @param obj The object to search all keys
 * @param keyToFind Key to match in the object's keys
 * @param mustExist If true, throws an exception if the key is not found
 * @param exactMatch If true, the key must match exactly and is not trimmed or lowercase matched
 */
export function ObjectFindKeyAndReturnValue<T = string>(
  obj: Readonly<Record<string, T>>,
  keyToFind: string,
  matchLowercaseAndTrimKey = true
) {
  const safekey = matchLowercaseAndTrimKey
    ? safestrLowercase(keyToFind, true)
    : keyToFind
  if (hasData(safekey)) {
    const keyValuePairs = Object.entries(obj)
    for (const [key, value] of keyValuePairs) {
      const objkey = matchLowercaseAndTrimKey
        ? safestrLowercase(key, true)
        : key

      if (objkey === safekey) {
        return value
      }
    }
  }
}

export function ObjectMustHaveKeyAndReturnValue<T = string>(
  fname: string,
  obj: Readonly<Record<string, T>>,
  keyToFind: string,
  matchLowercaseAndTrimKey = true
) {
  const ret = ObjectFindKeyAndReturnValue(
    obj,
    keyToFind,
    matchLowercaseAndTrimKey
  )

  if (ret) {
    return ret
  }

  throw new AppException(
    `Key ${keyToFind} not found in ${fname} object: `,
    fname
  )
}

export function ObjectTypesToString(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  e: any
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const etoString: string = isNullOrUndefined(e) ? '' : e.toString()

  if (Array.isArray(e)) {
    return util.inspect(e, true, CONST_JsonDepth)
  } else if (e instanceof Error) {
    const jerr = {
      message: e.message,
      name: e.name,
      stack: e.stack,
      type: 'Exception',
    }

    return util.inspect(jerr, true, CONST_JsonDepth)
  } else if (etoString === '[object Object]') {
    return util.inspect(e, true, CONST_JsonDepth)
    // } else if (etoString === '[object FileList]') {
    //   return util.inspect(e.toArray(), true, CONST_JsonDepth)
    // } else if (etoString === '[object File]') {
    //   return util.inspect(e.toObject(), true, CONST_JsonDepth)
  }

  return etoString
}

export function BuildLogFriendlyMessage({
  componentName,
  level,
  message,
}: {
  componentName: string
  level: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any
}) {
  const msg = safeArray(message)
    .map((e: unknown) => ObjectTypesToString(e))
    .join(' ')

  return `${DateHelper.FormatDateTimeWithMillis()}: [${componentName}] [${level}] ${msg}`
}

export function GetErrorMessage(err: unknown) {
  if (!isNullOrUndefined(err)) {
    switch (typeof err) {
      case 'object':
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (err && 'message' in err) {
          const message = (err as { message: string }).message
          if (message) {
            return message
          }
        }
        break

      case 'string':
        if (err) {
          return err
        }
        break

      case 'number':
        return err.toString()

      case 'boolean':
        return err ? 'true' : 'false'

      default:
        break
    }
  }

  return 'Unknown error'
}

/**
 * Checks if the variable passed in is a JavaScript object that is not an array.
 * Optionally can test for a minimum number of member objects, or if a member of the object is a named by the minLengthOrContainsField parameter.
 * @param obj The object to test if it is indeed a JavaScript object.
 * @param minLengthOrContainsField The minimum number of items that must be in the object. Or if a string, the object must contain a member named the string provided.
 * @returns True if the obj variable is a JavaScript object, and meets an optional minimum length or contains a member with the given name.
 */
export function isObject(
  obj: unknown,
  minLengthOrContainsField: number | string = 0
): obj is object {
  const isok = obj && 'object' === typeof obj && !isArray(obj)
  if (!isok) {
    return false
  }

  if (isNumber(minLengthOrContainsField)) {
    if (minLengthOrContainsField <= 0) {
      return true
    }

    return safeArray(Object.keys(obj)).length >= minLengthOrContainsField
  }

  if (isString(minLengthOrContainsField)) {
    return safeArray(Object.keys(obj)).includes(minLengthOrContainsField)
  }

  return true
}

export function isEmptyObject(obj: unknown) {
  return (
    null === obj ||
    (isObject(obj) &&
      safeArray(Object.keys(obj)).length === 0 &&
      obj.constructor === Object)
  )
}

/**
 * Gets from the object the value from the key that matches find string.
 * @param obj The object to search for the key.
 * @param keyToFind The property to look for in the object.
 * @returns The value from the obj[keyToFind]. undefined if not found.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getObjectValue(obj: any, keyToFind: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (safeArray(Object.keys(obj)).find((x) => x === keyToFind)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return obj[keyToFind]
  }

  return undefined
}

/**
 * Renames a property of an object with a new key name.
 * @param obj The object to rename the key.
 * @param oldKey The original key to rename.
 * @param newKey The new name of the key.
 * @returns The original object with the renamed key.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renameProperty(obj: any, oldKey: any, newKey: any): object {
  if (
    !isObject(obj) ||
    !isString(oldKey, 1) ||
    !isString(newKey, 1) ||
    oldKey === newKey
  ) {
    throw new Error('Cannot renameProperty. Invalid settings.')
  }

  const propdesc = Object.getOwnPropertyDescriptor(obj, oldKey)
  if (!propdesc) {
    throw new Error(`Cannot renameProperty. Property: ${oldKey} not found.`)
  }

  Object.defineProperty(obj, newKey, propdesc)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-dynamic-delete
  delete (obj as any)[oldKey]

  return obj
}

/**
 * Runs a given function on all members of an object.
 * @param obj The object to run func() on all members.
 * @param func A function that receives each string property key and its value
 * @param mustHaveValue If true, the property must have a value in order for func() to be called.
 * @returns The original object with function having been run on each property.
 */
export function runOnAllMembers<T extends object = object>(
  obj: T,
  func: (key: string, value: unknown) => unknown,
  mustHaveValue = true
) {
  if (!isObject(obj)) {
    throw new Error('runOnAllMembers() received an empty object.')
  }
  if (!isFunction(func)) {
    throw new Error('runOnAllMembers() received an empty function operator.')
  }

  const objAsRecord = obj as Record<string, unknown>
  Object.entries(obj).forEach(([key, value]) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!mustHaveValue || (mustHaveValue && value)) {
      objAsRecord[key] = func(key, value)
    }
    // console.log(`${key}: ${value}`)
  })

  return obj
}

/**
 * Searches the object looking for the first array it finds.
 * If the object passed in is already an array, it is returned.
 * @param obj The object to look for the array.
 * @returns Returns obj if it is an array, or if obj is an object, the first array found is returned. [] if none found.
 */
export function searchObjectForArray<T = unknown>(obj: object) {
  if (isArray(obj)) {
    return obj as T[]
  }

  if (isObject(obj)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const found = Object.values(obj).find((x) => isArray<T>(x))
    if (found) {
      return found
    }
  }

  return []
}

export function ObjectPrepareForJson(
  obj?: object | null,
  removeKeys: StringOrStringArray = []
) {
  const objClean = isNullOrUndefined(obj) || !isObject(obj) ? {} : obj

  const keysToRemove = safeArray(removeKeys).concat(ARRAY_KeysToAlwaysRemove)

  return Object.entries(objClean).reduce((acc, [key, value]) => {
    if (!keysToRemove.includes(key) && !isFunction(value)) {
      acc[key] =
        isObject(value) && !isDateObject(value)
          ? ObjectPrepareForJson(value, keysToRemove)
          : value
    }

    return acc
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
  }, {} as Record<string, unknown>)
}
