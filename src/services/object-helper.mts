import { AnyObject, ArrayOrSingle, IConstructor } from '../models/types.mjs'
import {
  arrayElement,
  arrayFirst,
  isArray,
  safeArray,
} from './array-helper.mjs'
import { hasData, isFunction, isNullOrUndefined } from './general.mjs'
import {
  isString,
  safestr,
  safestrLowercase,
  safestrToJson,
} from './string-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import { IId } from '../models/IdManager.mjs'
import { isNumber } from './number-helper.mjs'
import util from 'util'

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
  const isok = obj && typeof obj === 'object' && !isArray(obj)
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
    const keys = Object.keys(obj),
      zincs = safeArray(keys).includes(minLengthOrContainsField)

    return zincs
  }

  return true
}

export function UpdateFieldValue<T extends IId>(
  parentObject: Readonly<T>,
  fieldName: string,
  fieldValue: unknown
) {
  const ret: T = {
    ...parentObject,
    [fieldName]: fieldValue,
  }

  return ret
}

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

export function ObjectTypesToString(e: unknown): string {
  if (isNullOrUndefined(e)) {
    return ''
  } else if (Array.isArray(e)) {
    return util.inspect(e, true, CONST_JsonDepth)
  } else if (e instanceof Error) {
    const jerr = {
      message: e.message,
      name: e.name,
      stack: e.stack,
      type: 'Exception',
    }

    return util.inspect(jerr, true, CONST_JsonDepth)
  } else if (isObject(e)) {
    return util.inspect(e, true, CONST_JsonDepth)
  }

  return safestr(e)
}

/**
 * Tests if the passed in obj is in fact an object that is not undefined or null.
 * If it is, the ifEmpty value is used. If there is no ifEmpty passed in, an empty object with no members is returned.
 * @param obj An object to test for not being null or undefined.
 * @param ifEmpty If the object is null or undefined, return this value. Defaults to {}.
 * @returns A guaranteed object to be nonnull. Returns ifEmpty if the object does not have data.
 */
export function safeObject(obj?: object, ifEmpty?: object) {
  if (obj && isObject(obj)) {
    return obj
  }

  return isObject(ifEmpty) ? ifEmpty : {}
}
/**
 * Wraps JSON.stringify in a try/catch so that exceptions are not bubbled up.
 * @param json The JSON object to convert to a string.
 * @param fname The optional function name that is the source of the operation. Used for exception logging.
 * @returns A the JSON.stringify(ed) string or empty string if there was an exception.
 */
export function safeJsonToString<T extends object | Array<T>>(
  json: T,
  fname?: string,
  replacer?: (number | string)[],
  space?: string | number
) {
  try {
    return JSON.stringify(
      isArray(json) ? safeArray(json) : safeObject(json),
      replacer,
      space
    )
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.log(fname ? fname : 'safeJsonToString', ex)
  }

  return ''
}

export function FindObjectWithField(
  obj: object,
  fieldName: string,
  value: string | number | boolean,
  depth = 0
): object | undefined {
  let found: object | undefined

  if (depth > 100) {
    return found
  }

  // eslint-disable-next-line guard-for-in
  for (const key in obj) {
    if (isObject(obj[key])) {
      found = FindObjectWithField(obj[key], fieldName, value, depth + 1)
    } else if (isArray(obj[key])) {
      const arr: unknown[] = obj[key]
      if (arr.length && isObject(arr[0])) {
        const arrobj = arr as object[]
        for (let i = 0; i < arrobj.length; ++i) {
          found = FindObjectWithField(arrobj[i], fieldName, value, depth + 1)
          // eslint-disable-next-line max-depth
          if (found) {
            break
          }
        }
      }
    } else if (fieldName === key && obj[fieldName] === value) {
      found = obj
    }

    if (found) {
      break
    }
  }

  return found
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ObjectHelper {
  static CloneObjectAlphabetizingKeys<T>(obj: Readonly<T>): T {
    const sortedObj = Object.fromEntries(
      Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    )

    return sortedObj as T
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  static DecodeBase64ToObject<T = object>(base64String: string) {
    const decodedString = Buffer.from(base64String, 'base64')

    return safestrToJson<T>(decodedString.toString())
  }
  static EncodeObjectToBase64(obj: object) {
    const jsonString = JSON.stringify(
        ObjectHelper.CloneObjectAlphabetizingKeys(obj)
      ),
      zencodedString = Buffer.from(jsonString)

    return zencodedString.toString('base64')
  }

  /**
   * Deep clones an object using the JSON.parse(JSON.stringify(obj)) method.
   * Suppresses any exceptions, but still writes to the console.log.
   * @param obj The object to copy.
   * @param fname The function name of the caller. Not required.
   * @returns A JSON stringify and parsed copy of the obj.
   */
  static DeepCloneJsonWithUndefined<T extends object | Array<T>>(
    obj: T,
    fname?: string
  ) {
    const funcname = safestr(fname, 'deepCloneJsonWithUndefined')

    return safestrToJson<T>(safeJsonToString(obj, funcname), funcname)
  }

  static getFirstNewWithException<T>(
    theClass: IConstructor<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: any[],
    exceptionTextIfEmpty = ''
  ) {
    const first = ObjectHelper.getInstance(theClass, arrayFirst(obj))
    if (!first) {
      throw new AppException(
        safestr(exceptionTextIfEmpty, 'Error getting first new object'),
        ObjectHelper.getFirstNewWithException.name
      )
    }

    return first
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getInstance<T>(theClass: IConstructor<T>, ...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return new theClass(...args)
  }

  static getNewObject<T>(
    theClass: IConstructor<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructorArgs: any[],
    index = 0
  ): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (
      ObjectHelper.getInstance(theClass, constructorArgs),
      arrayElement(constructorArgs, index)
    )
  }
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
    throw new AppException('runOnAllMembers() received an empty object.')
  }
  if (!isFunction(func)) {
    throw new AppException(
      'runOnAllMembers() received an empty function operator.'
    )
  }

  const objAsRecord = obj as Record<string, unknown>
  Object.entries(obj).forEach(([key, value]) => {
    if (!mustHaveValue || value) {
      objAsRecord[key] = func(key, value)
    }
    // Console.log(`${key}: ${value}`)
  })

  return obj
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
    throw new AppException('Cannot renameProperty. Invalid settings.')
  }

  const propdesc = Object.getOwnPropertyDescriptor(obj, oldKey)
  if (!propdesc) {
    throw new AppException(
      `Cannot renameProperty. Property: ${oldKey} not found.`
    )
  }

  Object.defineProperty(obj, newKey, propdesc)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-dynamic-delete
  delete (obj as any)[oldKey]

  return obj
}
/**
 * Method to wrap deep object comparison. The changes are mapped and returned.
 * Generally used for checking in real-time form data changes.
 * i.e., isDirty = deepDiffMapper().anyChanges(formOriginalValues, formCurrentValues);
 * @returns An object that wraps varying levels of comparison information.
 */

export function deepDiffMapper() {
  return {
    VALUE_CREATED: 'created',
    VALUE_DELETED: 'deleted',
    VALUE_UNCHANGED: 'unchanged',
    VALUE_UPDATED: 'updated',

    /**
     * Checks if there are any changes between two objects.
     * @param obj1 First object to compare.
     * @param obj2 Second object to compare.
     * @returns True if any changes between the objects.
     */
    anyChanges(obj1: unknown, obj2: unknown) {
      const changed = this.getChanges(obj1, obj2)

      // Console.log('skky.deepDiffMapper.anyChanges: changed:', changed, ', isNullOrUndefined:', isNullOrUndefined(changed));
      return !isNullOrUndefined(changed)
      // Return Object.values(objChanges).filter(x => isNullOrUndefined(x) || ('unchanged' !== x)).length > 0;
    },

    /**
     * Returns a comparison string defining the type of change, or unchanged.
     * @param value1 The first value to compare.
     * @param value2 The second value to compare.
     * @returns A this.VALUE_xxx string describing the change or unchanged.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    compareValues(value1: any, value2: any) {
      if (value1 === value2) {
        return this.VALUE_UNCHANGED
      }

      if (
        this.isDate(value1) &&
        this.isDate(value2) &&
        value1.getTime() === value2.getTime()
      ) {
        return this.VALUE_UNCHANGED
      }

      if (value1 === undefined) {
        return this.VALUE_CREATED
      }

      if (value2 === undefined) {
        return this.VALUE_DELETED
      }

      return this.VALUE_UPDATED
    },

    findFunction(value: unknown) {
      const found =
        isObject(value, 'type') &&
        isObject(value, 'data') &&
        Object.entries(value).length === 2 &&
        (value as { type: string }).type !== 'unchanged'

      return found
    },

    /**
     * Looks for an object with key value pairs and returns if it found changes.
     * @param param0 A key value pair to look for changes. Deep inspection
     * @returns True if an object with type and data is found with changes present.
     */
    findTypeData([, value]: [string, unknown]) {
      const found = this.findFunction(value)
      if (found) {
        return true
      }

      if (isObject(value)) {
        // Const foundItems = Object.values(value).find(this.findFunction)
        const foundItems = Object.entries(value).find((x) =>
          this.findTypeData(x)
        )

        if (foundItems) {
          return true
        }
      }

      return false
    },

    /**
     * Checks if there are any changes between two objects and returns the changes.
     * @param obj1 First object to compare.
     * @param obj2 Second object to compare.
     * @returns The changed items between the two objects.
     */
    getChanges(obj1: unknown, obj2: unknown) {
      const aobjChanges = this.map(obj1, obj2),
        changeEntries = Object.entries(aobjChanges)

      // Console.log('hasType:', this.isObject(objChanges, 'type'),
      //             ', objChanges:', objChanges,
      //             ', values:', Object.values(objChanges),
      //             ', obj1:', obj1,
      //             ', obj2:', obj2);
      // Are we dealing with a simple value comparison?
      if (
        changeEntries.length === 2 &&
        isObject(aobjChanges, 'type') &&
        isObject(aobjChanges, 'data')
      ) {
        return (aobjChanges as { type: string }).type !== 'unchanged'
      }

      // We are dealing with a larger object or array comparison.
      return changeEntries.find((x) => this.findTypeData(x))
    },

    isArray(x: unknown): x is Array<unknown> {
      return Object.prototype.toString.call(x) === '[object Array]'
    },
    isDate(x: unknown): x is Date {
      return Object.prototype.toString.call(x) === '[object Date]'
    },
    isFunction(x: unknown) {
      return Object.prototype.toString.call(x) === '[object Function]'
    },
    isObject(x: unknown): x is object {
      return Object.prototype.toString.call(x) === '[object Object]'
    },
    isValue(x: unknown) {
      return !this.isObject(x) && !this.isArray(x)
    },

    /**
     * Maps all changes between two objects.
     * @param obj1 The first object to compare.
     * @param obj2 The second object to compare.
     * @returns A {type: string, value: object} object with all changes.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map(obj1: any, obj2: any): object {
      if (this.isFunction(obj1) || this.isFunction(obj2)) {
        throw new AppException(
          'Invalid argument. Function given, object expected.'
        )
      }
      // Console.log('skky.deepDiff:', this.isValue(obj1), this.isValue(obj2), ', obj1:', obj1, ', obj2:', obj2);
      if (this.isValue(obj1) || this.isValue(obj2)) {
        return {
          data: obj1 === undefined ? obj2 : obj1,
          type: this.compareValues(obj1, obj2),
        }
      }

      let diff: Record<string, unknown> = {}
      for (const key in obj1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (this.isFunction(obj1[key])) {
          // eslint-disable-next-line no-continue
          continue
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value2: any
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (obj2[key] !== undefined) {
          value2 = obj2[key]
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        diff = { ...diff, [key]: this.map(obj1[key], value2) }
      }

      for (const key in obj2) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        if (this.isFunction(obj2[key]) || (diff as any)[key] !== undefined) {
          // eslint-disable-next-line no-continue
          continue
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        diff = { ...diff, [key]: this.map(undefined, obj2[key]) }
      }

      return diff
    },
  }
}
/**
 * Gets from the object the value from the key that matches find string.
 * @param obj The object to search for the key.
 * @param keyToFind The property to look for in the object.
 * @returns The value from the obj[keyToFind]. undefined if not found.
 */
export function getObjectValue(obj: AnyObject, keyToFind: string) {
  if (safeArray(Object.keys(obj)).find((x) => x === keyToFind)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return obj[keyToFind]
  }

  return undefined
}
export function isEmptyObject(obj: unknown) {
  return (
    obj === null ||
    (isObject(obj) &&
      safeArray(Object.keys(obj)).length === 0 &&
      obj.constructor === Object)
  )
}

/**
 * Tests an object to see if it is empty. If so returns null, otherwise just returns the object.
 * @param obj The object to test if it is empty.
 * @returns Null if the object is empty, otherwise the object is returned.
 */
export function getNullObject<T>(obj: T) {
  return isEmptyObject(obj) ? null : obj
}

/**
 * Adds obj to the list of objects, creating the list if it doesn't exist.
 * If obj is an array, loops through the array.
 * @param listObjects An array of objects.
 * @param obj Array of items to add to listObjects.
 * @returns listObjects. If null, was passed, it is a new array.
 */

export function addObjectToList<T>(
  listObjects: ArrayOrSingle<T>,
  obj: ArrayOrSingle<T>
) {
  const mylistObjects = safeArray(listObjects)

  if (!isNullOrUndefined(obj)) {
    const len = safeArray(obj).length
    for (let i = 0; i < len; ++i) {
      const objCurrent = arrayElement(obj, i)
      if (!isNullOrUndefined(objCurrent)) {
        mylistObjects.push(objCurrent)
      }
    }
  }

  return mylistObjects
}

export function deepCloneJson<T extends object | Array<T>>(
  obj: T,
  fname?: string
) {
  const funcname = safestr(fname, 'deepCloneJson')
  const ret = safestrToJson<T>(safeJsonToString(obj, funcname), funcname)
  if (!ret) {
    throw new AppException(
      `deepCloneJson() failed to clone object ${safestr(obj)}`,
      funcname
    )
  }

  return ret
}
/**
 * Looks for a ret.body object to return.
 * Throws an Error if the body is not found or not an object.
 * @param ret The object to get the ret.body object.
 * @returns The existing ret.body object of the ret object..
 */

export function getBody(ret: unknown) {
  if (!isObject(ret, 'body')) {
    throw new AppException('Object body not found')
  }

  return (ret as { body: unknown }).body
}

type CoalesceType<T> = T | (() => T) | undefined

export function coalesce<T>(...all: CoalesceType<T>[]): T | undefined {
  let retItem: T | undefined

  for (const item of all) {
    if (isFunction(item)) {
      retItem = item()
      if (!isNullOrUndefined(retItem)) {
        return retItem
      }
    } else if (!isNullOrUndefined(item)) {
      return item
    }
  }
}
