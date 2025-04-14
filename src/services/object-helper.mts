import util from 'util'
import Axios, { AxiosError } from 'axios'
import {
  hasData,
  isArray,
  isNullOrUndefined,
  isObject,
  safeJsonToString,
  safestr,
  safestrLowercase,
} from './general.mjs'
import { AppException } from '../models/AppException.mjs'
import { AnyRecord, IConstructor } from '../models/types.mjs'
import { arrayElement, arrayFirst } from './array-helper.mjs'
import { IId } from '../models/IdManager.mjs'

export function CloneObjectWithExtras<T extends IId>(
  objectWithId: Readonly<T>,
  overridesAndExtras?: AnyRecord
) {
  const newq: T = { ...objectWithId, ...overridesAndExtras }

  return newq
}

export function UpdateFieldValue<T extends IId>(
  parentObject: Readonly<T>,
  fieldName: string,
  fieldValue: unknown
) {
  return CloneObjectWithExtras(parentObject, { [fieldName]: fieldValue })
}

const CONST_JsonDepth = 5

type AxiosErrorWrapper = {
  code?: string
  lastRequestTime?: number
  message: string
  method?: string
  name: string
  requestData?: string
  responseData?: string
  retryCount?: number
  stack?: string
  status?: number
  statusText?: string
  type: string
  url?: string
}

export function DefaultWithOverrides<T extends AnyRecord>(
  defaultObject: Readonly<T>,
  overrides?: Partial<T> | null
) {
  const ret: T = { ...defaultObject, ...overrides }

  return ret
}

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
  e: any,
  saveHttpResponseData = false,
  saveHttpRequestData = false
) {
  const etoString: string = isNullOrUndefined(e) ? '' : e.toString()

  if (Array.isArray(e)) {
    return util.inspect(e, true, CONST_JsonDepth)
  } else if (Axios.isAxiosError(e)) {
    const axerr: AxiosError = e
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axRetry = (axerr.config as any)?.['axios-retry']

    const axiosJsonError: AxiosErrorWrapper = {
      type: 'AxiosError',
      name: axerr.name,
      code: axerr.code,
      method: axerr.config?.method,
      url: axerr.config?.url,
      message: axerr.message,
      lastRequestTime: axRetry?.lastRequestTime,
      retryCount: axRetry?.retryCount,
      stack: axerr.stack,
    }

    if (axerr.response?.status) {
      axiosJsonError.status = axerr.response.status
    }
    if (axerr.response?.statusText) {
      axiosJsonError.statusText = axerr.response.statusText
    }

    if (saveHttpRequestData && axerr.config?.data) {
      axiosJsonError.requestData = axerr.config.data
    }
    if (saveHttpResponseData && axerr.response?.data) {
      axiosJsonError.responseData = safeJsonToString(axerr.response.data)
    }

    return util.inspect(axiosJsonError, true, CONST_JsonDepth)
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

export function getFirstNewWithException<T>(
  theClass: IConstructor<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any[],
  exceptionTextIfEmpty = ''
) {
  const first = getInstance(theClass, arrayFirst(obj))
  if (!first) {
    throw new Error(
      safestr(exceptionTextIfEmpty, 'Error getting first new object')
    )
  }

  return first
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getInstance<T>(theClass: IConstructor<T>, ...args: any[]) {
  return new theClass(...args)
}

export function getNewObject<T>(
  theClass: IConstructor<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructorArgs: any[],
  index = 0
): T {
  return (
    getInstance(theClass, constructorArgs), arrayElement(constructorArgs, index)
  )
}

export function FindObjectWithField(
  obj: object,
  fieldName: string,
  value: string | number | boolean,
  depth = 0
): object | undefined {
  let found: object | undefined = undefined

  if (depth > 100) {
    return found
  }

  for (const key in obj) {
    if (isObject(obj[key])) {
      found = FindObjectWithField(obj[key], fieldName, value, depth + 1)
    } else if (isArray(obj[key])) {
      const arr: unknown[] = obj[key]
      if (arr.length && isObject(arr[0])) {
        const arrobj = arr as object[]
        for (let i = 0; i < arrobj.length; ++i) {
          found = FindObjectWithField(arrobj[i], fieldName, value, depth + 1)
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
