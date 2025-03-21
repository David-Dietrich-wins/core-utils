import { AppException } from '../models/AppException.mjs'
import { ArrayOrSingle, StringOrStringArray } from '../models/types.mjs'
import { arrayElement, ToSafeArray } from './array-helper.mjs'

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
  listObjects = safeArray(listObjects)

  if (!isNullOrUndefined(obj)) {
    for (let i = 0; arrayElement(obj, i); ++i) {
      const objCurrent = arrayElement(obj, i)
      if (objCurrent) {
        listObjects.push(objCurrent)
      }
    }
  }

  return listObjects
}

/**
 * Deep clones an object using the JSON.parse(JSON.stringify(obj)) method.
 * Suppresses any exceptions, but still writes to the console.log.
 * @param obj The object to copy.
 * @param fname The function name of the caller. Not required.
 * @returns A JSON stringify and parsed copy of the obj.
 */
export function deepCloneJson<T extends object | Array<T>>(
  obj: T,
  fname?: string
) {
  fname = fname || 'deepCloneJson'

  return safestrToJson<T>(safeJsonToString(obj, fname), fname)
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
    VALUE_UPDATED: 'updated',
    VALUE_DELETED: 'deleted',
    VALUE_UNCHANGED: 'unchanged',

    /**
     * Checks if there are any changes between two objects.
     * @param obj1 First object to compare.
     * @param obj2 Second object to compare.
     * @returns True if any changes between the objects.
     */
    anyChanges(obj1: unknown, obj2: unknown) {
      const changed = this.getChanges(obj1, obj2)

      // console.log('skky.deepDiffMapper.anyChanges: changed:', changed, ', isNullOrUndefined:', isNullOrUndefined(changed));
      return !isNullOrUndefined(changed)
      // return Object.values(objChanges).filter(x => isNullOrUndefined(x) || ('unchanged' !== x)).length > 0;
    },
    /**
     * Checks if there are any changes between two objects and returns the changes.
     * @param obj1 First object to compare.
     * @param obj2 Second object to compare.
     * @returns The changed items between the two objects.
     */
    getChanges(obj1: unknown, obj2: unknown) {
      const objChanges = this.map(obj1, obj2)
      const changeEntries = Object.entries(objChanges)

      // console.log('hasType:', this.isObject(objChanges, 'type'),
      //             ', objChanges:', objChanges,
      //             ', values:', Object.values(objChanges),
      //             ', obj1:', obj1,
      //             ', obj2:', obj2);

      // Are we dealing with a simple value comparison?
      if (
        2 === changeEntries.length &&
        isObject(objChanges, 'type') &&
        isObject(objChanges, 'data')
      ) {
        return 'unchanged' !== (objChanges as { type: string }).type
      }

      // We are dealing with a larger object or array comparison.
      return changeEntries.find(this.findTypeData, this)
    },

    findFunction(value: unknown) {
      const found =
        isObject(value, 'type') &&
        isObject(value, 'data') &&
        2 === Object.entries(value).length &&
        'unchanged' !== (value as { type: string }).type

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
        // const foundItems = Object.values(value).find(this.findFunction)
        const foundItems = Object.entries(value).find(this.findTypeData, this)

        if (foundItems) {
          return true
        }
      }

      return false
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
        throw new Error('Invalid argument. Function given, object expected.')
      }
      // console.log('skky.deepDiff:', this.isValue(obj1), this.isValue(obj2), ', obj1:', obj1, ', obj2:', obj2);
      if (this.isValue(obj1) || this.isValue(obj2)) {
        return {
          type: this.compareValues(obj1, obj2),
          data: obj1 === undefined ? obj2 : obj1,
        }
      }

      let diff: Record<string, unknown> = {}
      for (const key in obj1) {
        if (this.isFunction(obj1[key])) {
          continue
        }

        let value2 = undefined
        if (obj2[key] !== undefined) {
          value2 = obj2[key]
        }

        diff = { ...diff, [key]: this.map(obj1[key], value2) }
      }

      for (const key in obj2) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isFunction(obj2[key]) || (diff as any)[key] !== undefined) {
          continue
        }

        diff = { ...diff, [key]: this.map(undefined, obj2[key]) }
      }

      return diff
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
    isFunction(x: unknown) {
      return Object.prototype.toString.call(x) === '[object Function]'
    },
    isArray(x: unknown): x is Array<unknown> {
      return Object.prototype.toString.call(x) === '[object Array]'
    },
    isDate(x: unknown): x is Date {
      return Object.prototype.toString.call(x) === '[object Date]'
    },
    isObject(x: unknown): x is object {
      return Object.prototype.toString.call(x) === '[object Object]'
    },
    isValue(x: unknown) {
      return !this.isObject(x) && !this.isArray(x)
    },
  }
}

/**
 * Looks for a ret.body object to return.
 * Throws an Error if the body is not found or not an object.
 * @param ret The object to get the ret.body object.
 * @returns The existing ret.body object of the ret object..
 */
export function getBody(ret: unknown) {
  if (!isObject(ret, 'body')) {
    throw new Error('Object body not found')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (ret as { body: any }).body
}

/**
 * Gets a comma separated list of unique items.
 * @param stringOrArray The {@link StringOrStringArray} to flatten then separate by commas.
 * @returns The flattened, comma-separated string.
 */
export function getCommaSeparatedList(stringOrArray: StringOrStringArray) {
  if (isString(stringOrArray)) {
    return stringOrArray
  }

  const myset = new Set(stringOrArray)
  return [...myset].join(',')
}

/**
 * Gets a comma separated list of unique items in uppercase.
 * @param stringOrArray The {@link StringOrStringArray} to uppercase and separate by commas.
 * @returns The flattened, comma-separated string in uppercase.
 */
export function getCommaUpperList(stringOrArray: StringOrStringArray) {
  return safestrUppercase(getCommaSeparatedList(stringOrArray))
}

/**
 * Returns a number from a string. A number is allowed too in case you don't know if the value is a number already.
 * If a null or undefined value is passed in, 0 is returned.
 * @param stringOrNumber The string or number to return as a number.
 * @returns The number representation of the stringOrNumber. If it is a number, just returns the number.
 */
export function getAsNumber(stringOrNumber?: string | number | null) {
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
  stringOrNumber?: string | number | null,
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
    const mystr = getNumberString(num, maxDecimalPlaces, minDecimalPlaces)
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
  maxDecimalPlaces?: number,
  minDecimalPlaces?: number
) {
  if (isString(num, 1)) {
    const newnum = num.replace(/,/g, '')

    if (isString(newnum, 1)) {
      num = +newnum
    }
  }

  maxDecimalPlaces = maxDecimalPlaces || 0
  minDecimalPlaces = minDecimalPlaces || maxDecimalPlaces

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimalPlaces,
    minimumFractionDigits: minDecimalPlaces,
  }).format(num)
}

/**
 * Gets from the object the value from the key that matches find string.
 * @param obj The object to search for the key.
 * @param keyToFind The property to look for in the object.
 * @returns The value from the obj[keyToFind]. undefined if not found.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getObjectValue(obj: any, keyToFind: string) {
  if (safeArray(Object.keys(obj)).find((x) => x === keyToFind)) {
    return obj[keyToFind]
  }

  return undefined
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

  // return Math.floor(percent)
  let ret = percent.toFixed(decimalPlaces < 0 ? 0 : decimalPlaces)
  if (showPercent) {
    ret += '%'
  }

  return (percent > 0 ? '+' : '') + ret
}

/**
 * Checks any object, string or array if it has any data.
 * The minlength is for requiring more items to be in the object, string or array.
 * You can pass in a function that must return an object, string or array to be tested as well.
 * @param o Any object, string or array. If it is a function, the function will be called to get the object, string or array before testing.
 * @param minlength The required minimum length to consider to have data. If not supplied, defaults to 1.
 * @returns True if the object meets the minimum length requirements.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasData(o?: any | null, minlength = 1) {
  // console.log('minlength: ' + minlength + ', o: ' + o)
  try {
    if (!o) {
      return false
    }

    if (!minlength) {
      minlength = 1
    }

    if (isFunction(o)) {
      return hasData(o(), minlength)
    }

    if (isString(o)) {
      return o.length >= minlength
    }

    if (isArray(o)) {
      return o.length >= minlength
    }

    // Primitives cannot have more than 1 by definition of not being an array or object.
    if (!isObject(o)) {
      return o >= minlength
    }

    return isArray(Object.keys(o), minlength)
  } catch (ex) {
    console.error(hasData.name, ex)
  }

  return false
}

/**
 * Checks an object if it is an array. If so, then tests if there is an optional minimum number of items.
 * If minLengthOrIncludes is not a number, checks that the array includes the item.
 * @param arr Any object to test if it is an array.
 * @param minLengthOrIncludes If a number, specifies the minimum number of items to be in the array. If not a number, the array must include the item.
 * @returns True if arr is an array and meets any minimum requirements.
 */
export function isArray<T = unknown>(
  arr?: ArrayOrSingle<T> | null,
  minLengthOrIncludes?: T | number
): arr is Array<T> {
  if (!arr || !Array.isArray(arr)) {
    return false
  }

  if (isNullOrUndefined(minLengthOrIncludes)) {
    return true
  }

  if (isNumber(minLengthOrIncludes)) {
    return arr.length >= minLengthOrIncludes
  }

  return arr.includes(minLengthOrIncludes)
}

/**
 * Tests an object to determine if it is a type boolean.
 * @param obj Any object to test if it is a boolean value.
 * @returns True if the object is a boolean.
 */
export function isBoolean(obj: unknown): obj is boolean {
  return 'boolean' === typeof obj
}

/**
 * Checks the date value passed in to see if the variable is a valid Date object.
 * @param date Any value to test if it is a valid date.
 * @returns true if the date is valid. false otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDateObject(date: any) {
  return date &&
    Object.prototype.toString.call(date) === '[object Date]' &&
    !isNaN(date)
    ? true
    : false
}

export function isEmptyObject(obj: unknown) {
  return (
    null == obj ||
    (isObject(obj) &&
      safeArray(Object.keys(obj)).length === 0 &&
      obj.constructor === Object)
  )
}

/**
 * Checks a variable to see if it is empty.
 * If it is a string, then checks for "".
 * @param s A variable to test if it is a string and is empty.
 * @param allowFunction True if s is a function and you want to call the function to get s.
 * @returns True if the object s is an empty string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmptyString(s: any, allowFunction = true) {
  const testString = (str: unknown) => {
    return !str || (isString(str) && '' === str)
  }

  return testString(s) || (allowFunction && isFunction(s) && testString(s()))
}

/**
 * Tests an object to determine if it is a function.
 * @param obj Any object to test if it is a function.
 * @returns True if the object is a function.
 */
export function isFunction(obj: unknown) {
  return 'function' === typeof obj
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
 * Tests if a variable is null or undefined.
 * @param obj Any variable to test if it is null or undefined.
 * @returns True if the object passed in is null or undefined.
 */
export function isNullOrUndefined(obj: unknown): obj is undefined | null {
  return 'undefined' === typeof obj || null == obj
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
    const keys = Object.keys(obj)
    const incs = safeArray(keys).includes(minLengthOrContainsField)

    return incs
  }

  return true
}

/**
 * Tests an object to determine if it is a string.
 * Additionally, will test if the string if it has a minimum length.
 * @param obj Any object to test if it is a string.
 * @param minlength The minimum length the string must be.
 * @returns True if the object is a string and meets an optional minimum length if provided.
 */
export function isString(obj: unknown, minlength = 0): obj is string {
  return (
    ('string' === typeof obj || obj instanceof String) &&
    obj.length >= minlength
  )
}

/**
 * Returns a new global unique identifier (GUID).
 * @returns A global unique identifier as a 16 character string.
 */
export function newGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
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
 * Tests if the passed in arr is in fact an array that is not undefined or null.
 * If it is, the ifEmpty value is used. If there is no ifEmpty passed in, an empty array is returned.
 * @param arr An array to test for not being null or undefined. If it is an object, it is wrapped in an array.
 * @param ifEmpty If the array is null or undefined, return this value. Defaults to [].
 * @returns A guaranteed array to be nonNull. Returns ifEmpty when the array does not have data. Or [] if ifEmpty is not declared.
 */
export function safeArray<T>(
  arr?: ArrayOrSingle<T> | null,
  ifEmpty?: ArrayOrSingle<T> | null
) {
  if (isNullOrUndefined(arr)) {
    return ifEmpty ? ToSafeArray(ifEmpty) : []
  }

  return isArray(arr) ? arr : [arr]
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
    console.log(fname ? fname : 'safeJsonToString', ex)
  }

  return ''
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
 * Tests if a string has data (is not undefined, null or empty string).
 * If the string is empty, then the ifEmpty value is returned.
 * @param s A string to check for data.
 * @param ifEmpty If the string is empty(including ""), return this value. Defaults to "".
 * @returns A guaranteed string. Returns ifEmpty if the string does not have data, or "" if an ifEmpty value is not provided.
 */
export function safestr(s?: string | null, ifEmpty = '') {
  if (hasData(s) && s) {
    return s
  }

  return hasData(ifEmpty) ? ifEmpty : ''
}

/**
 * Returns a guaranteed valid string to be lowercase.
 * @param s A string to set to lowercase. If null or undefined, empty string is returned.
 * @param trim Optionally trim the string also.
 * @returns A guaranteed string to be nonnull and lowercase.
 */
export function safestrLowercase(s?: string | null, trim = true) {
  if (trim) {
    s = safestrTrim(s)
  }

  return safestr(s).toLowerCase()
}

/**
 * Wraps JSON.parse in a try/catch so that exceptions are not bubbled up.
 * @param strjson The string converted to be converted to a JSON object.
 * @param fname The optional function name that is the source of the operation. Used for exception logging.
 * @returns A the JSON.parsed object or undefined if there was an exception.
 */
export function safestrToJson<T>(
  strjson?: string | null,
  fname?: string
): T | undefined {
  try {
    return JSON.parse(safestr(strjson))
  } catch (ex) {
    console.log(fname ? fname : 'safestrToJson', ex)
  }
}

/**
 * Returns a guaranteed valid string to be trimmed.
 * @param s A string to set to lowercase. If null or undefined, empty string is returned.
 * @returns A guaranteed string to be nonnull and trimmed.
 */
export function safestrTrim(s?: string | null, ifEmpty = '') {
  return safestr(s, ifEmpty).trim()
}

/**
 * Returns a guaranteed valid string to be uppercase.
 * @param s A string to set to uppercase. If null or undefined, empty string is returned.
 * @param trim Optionally trim the string also.
 * @returns A guaranteed string to be nonnull and uppercase.
 */
export function safestrUppercase(s?: string | null, trim = true) {
  if (trim) {
    s = safestrTrim(s)
  }

  return safestr(s).toUpperCase()
}

/**
 * Returns an s if the number passed in should be pluralized.
 * @param isPlural A number that is used to determine if the plural suffix is added.
 * @param suffix The suffix to add if the number should be pluralized.
 * @returns The suffix string if the number is not 1.
 */
export const pluralSuffix = (num: number, suffix = 's') =>
  pluralize(num, '', suffix)

/**
 * Returns an s if the number passed in should be pluralized.
 * @param num A number that is used to determine if the plural suffix is added.
 * @param suffix The suffix to add if the number should be pluralized.
 * @returns The suffix string if the number is not 1.
 */
export function pluralize(
  num: number,
  textIfSingle = '',
  textIfPlural = 's'
): string {
  if (isNumber(num) && 1 === num) {
    return safestr(textIfSingle)
  }

  return safestr(textIfPlural)
}

/**
 * Returns the prefix for a number if it positive + or negative -.
 * @param num The number to check for negative or positive.
 * @returns Empty string is num is 0, + if positive, or - if negative.
 */
export function plusMinus(num: number) {
  if (!num) {
    return ''
  }

  return num > 0 ? '+' : '-'
}

/**
 * Returns the prefix if the given string s has a value (not empty).
 * Generally used in loops so that the prefix is not prepended on the first pass.
 * @param s A string to prefix with a value if the string has data.
 * @param prefix The prefix if the string is not empty.
 * @returns The prefix if the string is not empty.
 */
export function prefixIfHasData(s: string, prefix = ', ') {
  return hasData(s) ? safestr(prefix) : ''
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const found = Object.values(obj).find((x) => isArray<T>(x))
    if (found) {
      return found as T[]
    }
  }

  return []
}

/**
 * Compares two objects and returns a value for use in the JavaScript sort() method.
 * @param a The first object to compare with.
 * @param b The second object to compare with.
 * @param isAsc True if you want to sort ascending.
 * @param compareStringsLowercase True if you want to do a lowercase compare on strings.
 * @returns -1, 0 or 1 depending on the sort direction.
 */
export function sortFunction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  a: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  b: any,
  isAsc: string | boolean = true,
  compareStringsLowercase = true
) {
  if (isString(isAsc)) {
    isAsc = 'desc' !== safestrLowercase(isAsc)
  }
  const aEmpty = isNullOrUndefined(a)
  const bEmpty = isNullOrUndefined(b)
  if (aEmpty && bEmpty) {
    return 0
  }
  // null and undefined sort after anything else
  else if (aEmpty) {
    return 1
  } else if (bEmpty) {
    return -1
  }
  // equal items sort equally
  else if (a === b) {
    return 0
  } else if (compareStringsLowercase && isString(a) && isString(b)) {
    // A little recursive, but we will not come back here a second time.
    return sortFunction(safestrLowercase(a), safestrLowercase(b), isAsc, false)
  }
  // otherwise, if we're ascending, lowest sorts first
  else if (isAsc) {
    return a < b ? -1 : 1
  }
  // if descending, highest sorts first
  else {
    return a < b ? 1 : -1
  }

  // return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
}

/**
 * Creates a string with a name=value. Optional wrapping of the value is provided.
 * @param name The name.
 * @param value The value to set the name.
 * @param valueWrapper An optional wrapper around the value. Usually a quote or double quote.
 * @returns The name=value string.
 */
export function stringEquals(name: string, value: string, valueWrapper = '') {
  if (hasData(name)) {
    return (
      name +
      '=' +
      (hasData(valueWrapper)
        ? stringWrap(valueWrapper, value, valueWrapper)
        : safestr(value))
    )
  }

  return ''
}
/**
 * Creates a string with a name='value' or name="value" depending on useSingleQuote.
 * @param name The name.
 * @param value The value to set the name.
 * @param useSingleQuote True if you want to use a single quote, otherwise a double quote is used.
 * @returns The name="value" or name='value' string.
 */
export function stringEqualsQuoted(
  name: string,
  value: string,
  useSingleQuote = true
) {
  if (hasData(name)) {
    return (
      name +
      '=' +
      (useSingleQuote || false
        ? stringWrapSingleQuote(value)
        : stringWrapDoubleQuote(value))
    )
  }

  return ''
}

/**
 * Wraps a given string str with a prefix and suffix.
 * @param left The prefix to put in front of the str.
 * @param str The string to be wrapped.
 * @param right The suffix to put after str.
 * @returns A string of left + str + right. Guaranteed to be a safe string.
 */
export function stringWrap(left: string, str: string, right: string) {
  return safestr(left) + safestr(str) + safestr(right)
}
/**
 * Creates a string as "str".
 * @param str The string to wrap in double quotes.
 * @returns The "str" wrapped string.
 */
export function stringWrapDoubleQuote(str: string) {
  return stringWrap('"', str, '"')
}
/**
 * Creates a string as (str) wrapped in parentheses.
 * @param str The string to wrap in parentheses.
 * @returns The (str) wrapped string.
 */
export function stringWrapParen(str: string) {
  return stringWrap('(', str, ')')
}
/**
 * Creates a string as 'str'.
 * @param str The string to wrap in single quotes.
 * @returns The 'str' wrapped string.
 */
export function stringWrapSingleQuote(str: string) {
  // eslint-disable-next-line quotes
  return stringWrap("'", str, "'")
}

/**
 * Returns the number of milliseconds between two times.
 * @param startTime The time to begin the diff with.
 * @param endTime The ending time for the diff. If none provided, the current time is used.
 * @returns The absolute value of milliseconds difference between the two times.
 */
export function timeDifference(startTime: Date, endTime?: Date) {
  const fname = 'timeDifference: '
  if (!startTime) {
    throw new Error(fname + 'You must have a start time.')
  }

  if (!endTime) {
    endTime = new Date()
  }

  return Math.abs(endTime.getTime() - startTime.getTime())
}
/**
 * Returns the number of seconds between two times.
 * @param startTime The time to begin the diff with.
 * @param endTime The ending time for the diff. If none provided, the current time is used.
 * @returns The absolute value of seconds difference between the two times rounded down (even if milliseconds is > 500)
 */
export function timeDifferenceInSeconds(startTime: Date, endTime?: Date) {
  return Math.floor(timeDifference(startTime, endTime) / 1000)
}
/**
 * Returns the number of seconds or optionally milliseconds, between two times as a string representation.
 * i.e., 5 days 21 hours 59 minutes 35 seconds 889ms, or 5d 21h 59m 35s 889ms. Used mostly for log messages.
 * @param startTime The time to begin the diff with. Usually from a new Date()
 * @param endTime The ending time for the diff. If none provided, the current time is used.
 * @param longFormat True if you want day, hour, minute, and second to be spelled out. False if you want the dhms abbreviations only.
 * @param showMilliseconds True if you want the milliseconds included in the time difference.
 * @returns The absolute value of seconds or milliseconds difference between the two times as a string.
 */
export function timeDifferenceString(
  startTime: Date,
  endTime?: Date,
  longFormat = false,
  showMilliseconds = false
) {
  return timeDifferenceStringFromMillis(
    timeDifference(startTime, endTime),
    longFormat,
    showMilliseconds
  )
}
/**
 * Returns the number of seconds or optionally milliseconds, between two times as a string representation.
 * i.e., 5 days 21 hours 59 minutes 35 seconds 889ms, or 5d 21h 59m 35s 889ms. Used mostly for log messages.
 * @param millis The time in milliseconds. Usually from new Date().getTime()
 * @param longFormat True if you want day, hour, minute, and second to be spelled out. False if you want the dhms abbreviations only.
 * @param showMilliseconds True if you want the milliseconds included in the time difference.
 * @returns The absolute value of seconds or milliseconds difference between the two times as a string.
 */
export function timeDifferenceStringFromMillis(
  millis: number,
  longFormat = false,
  showMilliseconds = false,
  showMillisecondsIfUnderASecond = true
) {
  const totalSeconds = Math.floor(millis / 1000)
  const seconds = totalSeconds % 60

  const totalMinutes = Math.floor(millis / 60000)
  const minutes = totalMinutes % 60
  const totalHours = Math.floor(totalSeconds / 3600)
  const hours = totalHours % 24
  const days = Math.floor(totalHours / 24)

  let s = ''
  if (days > 0) {
    s += longFormat ? `${days} day${pluralSuffix(days)}` : `${days}d`
  }

  if (hours > 0) {
    s += longFormat
      ? `${prefixIfHasData(s)}${hours} hour${pluralSuffix(hours)}`
      : `${prefixIfHasData(s, ' ')}${hours}h`
  }

  if (minutes > 0) {
    s += longFormat
      ? `${prefixIfHasData(s)}${minutes} minute${pluralSuffix(minutes)}`
      : `${prefixIfHasData(s, ' ')}${minutes}m`
  }

  const secondsModulo = seconds % 60
  if (secondsModulo > 0) {
    s += longFormat
      ? `${prefixIfHasData(s)}${secondsModulo} second${pluralSuffix(
          secondsModulo
        )}`
      : `${prefixIfHasData(s, ' ')}${secondsModulo}s`
  }

  if (showMilliseconds || (showMillisecondsIfUnderASecond && millis < 1000)) {
    const micros = millis % 1000
    if (micros > 0) {
      s += `${prefixIfHasData(s, longFormat ? ', ' : ' ')}${micros % 1000}ms`
    }
  }

  return safestr(s, longFormat ? '0 seconds' : '0s')
}

/**
 * Takes a number and converts to its uppercase hexadecimal string value.
 * @param decimal The number to convert to hexadecimal.
 * @param chars Number of chars to pad for leading zeros.
 * @returns
 */
export function toHex(decimal?: number, chars = 2) {
  if (isNullOrUndefined(chars)) {
    chars = 2
  }

  return ((decimal || 0) + Math.pow(16, chars))
    .toString(16)
    .slice(-chars)
    .toUpperCase()
}

/**
 * Joins two strings to make a full URL. This method guards against trailing and leading /'s and always well forms the URL.
 * If a trailing / is desired, urlJoin checks to ensure there is not already trailing / and variables have not already been added to the URL.
 * @param baseUrl The URL base path to start the joining by /.
 * @param relativePath The URL's relative path to be joined.
 * @param addTrailingSlash Set to true to append a trailing / if this is a pure URL without variables.
 * @returns A safely constructed URL joined with a /.
 */
export function urlJoin(
  baseUrl?: string | null,
  relativePath?: ArrayOrSingle<string | number | null | undefined> | null,
  addTrailingSlash = true
) {
  let url = safestr(baseUrl)
  let pathname = safeArray(relativePath)
    .map((x) => {
      if (isNullOrUndefined(x)) {
        throw new AppException(
          'urlJoin() relativePath cannot contain null or undefined values.',
          'urlJoin',
          safeArray(relativePath)
        )
      }

      return isNumber(x) ? x.toString() : x
    })
    .join('/')

  // Remove any trailing slashes before adding a trailing slash.
  while (url.endsWith('/')) {
    url = url.slice(0, -1)
  }

  // Strip front and end slashes, if any.
  while (pathname.startsWith('/')) {
    pathname = pathname.slice(1)
  }
  while (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }

  if (pathname.length) {
    url += '/' + pathname
  }

  if (
    url.includes('?') ||
    url.includes('&') ||
    url.includes('#') ||
    url.includes('=')
  ) {
    addTrailingSlash = false
  }

  if (addTrailingSlash && !url.endsWith('/')) {
    url += '/'
  }

  return url
}
