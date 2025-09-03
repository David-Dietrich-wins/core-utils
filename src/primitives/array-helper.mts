import type {
  ArrayOrSingle,
  ArrayOrSingleBasicTypes,
  StringOrStringArray,
} from '../models/types.mjs'
import {
  ReplaceNonPrintable,
  isString,
  safestr,
  safestrTrim,
  safestrUppercase,
} from './string-helper.mjs'
import { hasData, isNullOrUndefined } from './object-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import type { IId } from '../models/IdManager.mjs'
import { type IIdName } from '../models/id-name.mjs'
import { type IName } from '../models/interfaces.mjs'
import { isNumber } from './number-helper.mjs'

/**
 * Checks an object if it is an array. If so, then tests if there is an optional minimum number of items.
 * If minLengthOrIncludes is not a number, checks that the array includes the item.
 * @param arr Any object to test if it is an array.
 * @param minLengthOrIncludes If a number, specifies the minimum number of items to be in the array. If not a number, the array must include the item.
 * @returns True if arr is an array and meets any minimum requirements.
 */
export function isArray<T = unknown>(
  arr: ArrayOrSingle<T> | null | undefined,
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
 * Tests if the passed in arr is in fact an array that is not undefined or null.
 * If it is, the ifEmpty value is used. If there is no ifEmpty passed in, an empty array is returned.
 * @param arr An array to test for not being null or undefined. If it is an object, it is wrapped in an array.
 * @param ifEmpty If the array is null or undefined, return this value. Defaults to [].
 * @returns A guaranteed array to be nonNull. Returns ifEmpty when the array does not have data. Or [] if ifEmpty is not declared.
 */
export function safeArray<T>(
  arr?: T | T[] | null,
  ifEmpty?: ArrayOrSingle<T> | null
) {
  if (isNullOrUndefined(arr)) {
    return ifEmpty && isArray(ifEmpty) ? ifEmpty : []
  }

  return isArray(arr) ? arr : [arr]
}

export function safeArrayUnique<T>(
  arr?: ArrayOrSingle<T> | null,
  ifEmpty?: ArrayOrSingle<T> | null
) {
  return Array.from(new Set(safeArray(arr, ifEmpty)))
}

export function ToSafeArray<T = unknown>(arrOrT?: Readonly<ArrayOrSingle<T>>) {
  if (arrOrT) {
    return Array.isArray(arrOrT) ? (arrOrT as T[]) : [arrOrT as T]
  }

  return []
}
export function ToSafeArray2d<T = unknown>(
  arrOrT?: Readonly<ArrayOrSingle<T>>
) {
  if (arrOrT) {
    const arr = Array.isArray(arrOrT) ? (arrOrT as T[]) : [arrOrT as T]
    return arr.every((x) => Array.isArray(x)) ? (arrOrT as T[]) : [arrOrT as T]
  }

  return []
}

export function arrayGetIds<T extends Required<IId<Tid>>, Tid = T['id']>(
  arr?: Readonly<T>[],
  callback?: (_item: T) => Tid
) {
  return safeArray(arr).map((x) => (callback ? callback(x) : x.id))
}
export function arrayGetIdNames<
  T extends IIdName<Tid, Tname>,
  Tid = T['id'],
  Tname = T['name']
>(arr?: Readonly<T>[], callback?: (_item: T) => IIdName<Tid, Tname>) {
  return safeArray(arr).map((x) => {
    if (callback) {
      return callback(x)
    }

    const idname: IIdName<Tid, Tname> = { id: x.id, name: x.name }

    return idname
  })
}
export function arrayGetNames<T extends IName<Tname>, Tname = T['name']>(
  arr?: Readonly<T>[],
  callback?: (_item: T) => Tname
) {
  return safeArray(arr).map((x) => (callback ? callback(x) : x.name))
}

/**
 * Return the object with the given id from the array.
 * @param arrItems The array to search for the ids.
 * @param id id to search for in the arrItems list.
 * @returns The object with the given name. If not found, undefined is returned.
 */
export function arrayFindById<T extends IId<Tid>, Tid = T['id']>(
  arrItems?: T[],
  id?: Tid
) {
  return id && safeArray(arrItems).find((x) => id === x.id)
}

/**
 * Return the object with the given id from the array.
 * @param arrItems The array to search for the ids.
 * @param id id to search for in the arrItems list.
 * @returns The name of the found item. If not found, undefined is returned.
 */
export function arrayFindNameById<
  T extends IIdName<Tid, Tname>,
  Tid = T['id'],
  Tname = T['name']
>(arrItems?: T[], id?: Tid) {
  return arrayFindById(arrItems, id)?.name
}

/**
 * Return the objects that contain the given ids.
 * @param arrItems The array to search for the ids.
 * @param ids The array of ids to find in arrItems.
 * @returns The object with the given name. If not found, an empty Array is returned.
 */
export function arrayFindByIds<T extends Required<IId<Tid>>, Tid = T['id']>(
  arrItems?: T[],
  ids?: Tid[]
) {
  if (!ids || !ids.length) {
    return []
  }

  return safeArray(arrItems).filter((arrItem) => ids.includes(arrItem.id))
}
/**
 * Return the objects that do NOT match any of the given ids.
 * @param arrItems The array to search for the ids.
 * @param ids The array of ids to NOT find in arrItems.
 * @returns The object with the given name. If not found, and exception is thrown.
 */
export function arrayFindByNotIds<T extends Required<IId<Tid>>, Tid = T['id']>(
  arrItems?: T[],
  ids?: Tid[]
) {
  if (!ids || !ids.length) {
    return safeArray(arrItems)
  }

  return safeArray(arrItems).filter((x) => !ids.includes(x.id))
}

export function arrayMustFind<T extends IId<Tid>, Tid = T['id']>(
  arrItems: T[] | undefined,
  id: Tid,
  functionSourceName?: string
) {
  const foundItem = arrayFindById<T>(arrItems, id)
  if (!foundItem) {
    throw new AppException(
      `Unable to find ${safestr(
        functionSourceName,
        arrayFindById.name
      )} id: ${id}.`,
      arrayFindById.name,
      arrItems
    )
  }

  return foundItem
}

export function arrayFind<T>(
  arrItems: T[] | undefined,
  findFunc: (_item: T) => boolean
) {
  return safeArray(arrItems).find(findFunc)
}

/**
 * Return the object with the given name from the array.
 * @param arrItems The array of items to search for the name. Null checks are taken into account.
 * @param name Name to search for in the IName
 * @returns The object with the given name. If not found, and exception is thrown.
 */
export function arrayFindByName<T extends IName<Tname>, Tname = T['name']>(
  arrItems?: T[],
  name?: Tname
) {
  return arrayFind(arrItems, (x) => x.name === name)
}

export function arrayFilter<T>(
  arrItems: T[] | undefined,
  filterFunc: (_item: T) => boolean
) {
  return safeArray(arrItems).filter(filterFunc)
}

export function arrayMustFindFunc<T>(
  arrItems: T[],
  findFunc: (_item: T) => boolean,
  functionSourceName?: string,
  exceptionSuffix?: () => string
) {
  const foundItem = arrayFind<T>(arrItems, findFunc)

  if (!foundItem) {
    throw new AppException(
      `Unable to find ${safestr(functionSourceName, arrayMustFindFunc.name)}${
        exceptionSuffix ? ` ${exceptionSuffix()}` : ''
      }.`,
      arrayFindByName.name,
      arrItems
    )
  }

  return foundItem
}

export function arrayMustFindByName<T extends IName<Tname>, Tname = T['name']>(
  arrItems: T[],
  name: Tname,
  functionSourceName?: string
) {
  return arrayMustFindFunc(
    arrItems,
    (x) => x.name === name,
    functionSourceName,
    () => `name: ${name}`
  )
}

/**
 * Helper function to reduce an array of objects or arrays.
 * Takes care of handling undefined, objects and/or arrays and returns a guaranteed flattened array of type TreturnType.
 * Keep in mind, this is only for when you want to return an array of IId<T> type derived objects.
 * @param arr The array or single item to iterate over. ToSafeArray is called.
 * @param funcArrayResults Callback that returns undefined or an object or array of TreturnType.
 * @returns The reduced array of all objects and arrays returned funcArrayResults. Will be [] if all returns were undefined or the calling array is undefined.
 */
export function arrayReduceArrayReturns<T, TreturnType = T>(
  arr: Readonly<ArrayOrSingle<T>> | undefined,
  funcArrayResults: (
    _item: T,
    _index: number
  ) => ArrayOrSingle<TreturnType> | undefined
) {
  return ToSafeArray(arr).reduce((acc: TreturnType[], cur, index) => {
    const res = funcArrayResults(cur, index)
    if (res) {
      if (Array.isArray(res)) {
        return acc.concat(res)
      }

      acc.push(res)
    }

    return acc
  }, [])
}

export function arrayOfIds<T extends IId<Tid>, Tid = T['id']>(
  arr?: Readonly<T>[]
) {
  return arrayReduceArrayReturns(arr, (cur) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (cur?.id) {
      return cur.id
    }
  })
}

export function arrayOfNames<T extends IName<Tname>, Tname = T['name']>(
  arr?: Readonly<T>[]
) {
  return safeArray(arr).reduce((acc: Tname[], cur) => {
    acc.push(cur.name)

    return acc
  }, [])
}

/**
 * Gets an object from an array at the given index.
 * Or if it is not an array, just returns the object.
 * Protects from empty objects and indexes that are out of bounds.
 * @param arr An object array to get the index item of.
 * @param index The index of the object array to return. Use negative numbers to start from the end of the array. -1 returns the last item.
 * @returns The given object at arr[index], or undefined if it does not exist.
 */
export function getObject<T>(arr: T | T[], index = 0) {
  if (!isNullOrUndefined(arr)) {
    // eslint-disable-next-line no-param-reassign
    index ||= 0

    if (isArray(arr)) {
      if (index >= 0 && arr.length > index) {
        return arr[index]
      } else if (index < 0 && arr.length >= Math.abs(index)) {
        return arr[arr.length - Math.abs(index)]
      }
    } else if (index === 0) {
      return arr
    }
  }
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
  if (isNullOrUndefined(obj)) {
    return []
  }

  // eslint-disable-next-line no-param-reassign
  listObjects = safeArray(listObjects)

  const arrobj = safeArray(obj)
  const len = arrobj.length

  for (let i = 0; i < len; ++i) {
    const objCurrent = getObject(obj, i)
    if (objCurrent) {
      listObjects.push(objCurrent)
    }
  }

  return listObjects
}

export function arrayAdd<T extends IId<Tid>, Tid = T['id']>(
  arrItems: T[],
  item: T,
  index?: number
) {
  const len = arrItems.length
  if (isNullOrUndefined(index) || index < 0 || !len || index >= len) {
    arrItems.push(item)
  } else {
    arrItems.splice(index, 0, item)
  }

  return arrItems
}

/**
 * Gets an object from an array at the given index.
 * Or if it is not an array, just returns the object.
 * Protects from empty objects and indexes that are out of bounds.
 * @param arr An object array to get the index item of.
 * @param index The index of the object array to return. Use negative numbers to start from the end of the array. -1 returns the last item.
 * @returns The given object at arr[index], or undefined if it does not exist.
 */
export function arrayElement<T>(arr?: ArrayOrSingle<T> | null, index = 0) {
  const safearr = safeArray(arr)
  if (safearr.length) {
    // eslint-disable-next-line no-param-reassign
    index ||= 0

    if (index >= 0 && safearr.length > index) {
      return safearr[index]
    } else if (index < 0 && safearr.length >= Math.abs(index)) {
      return safearr[safearr.length - Math.abs(index)]
    }
  }
}

export function arrayElementNonEmpty<T>(
  arr?: ArrayOrSingle<T> | null,
  index = 0,
  functionSourceName?: string,
  customMessage?: string
) {
  const item = arrayElement(arr, index)
  if (item) {
    return item
  }

  throw new AppException(
    'Array has no items.',
    functionSourceName ?? arrayElementNonEmpty.name,
    customMessage
  )
}

/**
 * Gets the first item from an array, or a default value if the array is empty. Undefined is returned if no default value provided.
 * Good for quick tests of objects to see if it is an array, and getting the first value.
 * @param tArray The array to get the first value from, if it is an array.
 * @param defaultIfNone An optional default value if the array is empty.
 * @returns The first item in the array, or undefined or defaultIfNone if the array has no values.
 */
export function arrayFirst<T>(
  tArray?: ArrayOrSingle<T> | null,
  defaultIfNone?: T
) {
  if (isArray(tArray, 1)) {
    return tArray[0]
  }

  return defaultIfNone
}

export function arrayFirstNonEmpty<T>(
  arr?: T[],
  functionSourceName?: string,
  customMessage?: string
) {
  return arrayElementNonEmpty(arr, 0, functionSourceName, customMessage)
}

/**
 * Gets the last item from an array, or a default value if the array is empty. Null is returned if no default value provided.
 * Good for quick tests of objects to see if it is an array, and getting the first value.
 * @param tArray The array to get the last value from, if it is an array.
 * @param defaultIfNone An optional default value if the array is empty.
 * @returns The last item in the array, or null or defaultIfNone if the array has no values.
 */
export function arrayLast<T>(tArray?: T[], defaultIfNone?: T) {
  if (isArray(tArray, 1)) {
    return getObject(tArray, -1)
  }

  return defaultIfNone
}

export function arrayLastNonEmpty<T>(
  arr?: T[],
  functionSourceName?: string,
  customMessage?: string
) {
  const item = arrayLast(arr)
  if (item) {
    return item
  }

  throw new AppException(
    'Array has no items.',
    functionSourceName ?? arrayLastNonEmpty.name,
    customMessage
  )
}

export function arrayForEachReturns<T>(
  arr: T[] | undefined,
  funcArrayResults: (_item: T) => void
) {
  safeArray(arr).forEach((cur) => {
    funcArrayResults(cur)
  })
}

export function arrayRemoveById<T extends IId<Tid>, Tid = T['id']>(
  arrItems: T[] | null | undefined,
  id: T['id']
) {
  return safeArray(arrItems).filter((x) => x.id !== id)
}
export function arrayRemove<T extends IId<Tid>, Tid = T['id']>(
  arrItems: T[] | null | undefined,
  item: T
) {
  return arrayRemoveById(arrItems, item.id)
}

export function arrayUnique<T>(arrItems: T[] | null | undefined) {
  return [...new Set(safeArray(arrItems))]
}

export function arrayUpdateOrAdd<T extends IId<Tid>, Tid = T['id']>(
  arrItems: T[],
  item: T,
  insertAtFront = false
) {
  const foundIndex = arrItems.findIndex((x) => item.id === x.id)

  // If the index is out of bounds, just push the item to the end of the array.
  if (insertAtFront) {
    if (foundIndex >= 0) {
      // Remove the existing item from the array if it exists.
      // eslint-disable-next-line no-param-reassign
      arrItems = arrayRemoveById(arrItems, item.id)
    }

    // Remove the existing item from the array if it exists.
    arrItems.splice(0, 0, item)
  } else if (arrItems.length === 0 || foundIndex === -1) {
    arrItems.push(item)
  } else {
    // Remove the existing item from the array if it exists.
    arrItems.splice(foundIndex, 1, item)
  }

  return arrItems
}

export function arraySwapItems<T>(
  arrItems: T[] | null | undefined,
  sourceIndex: number,
  destIndex: number
) {
  if (!arrItems || sourceIndex === destIndex) {
    return []
  }

  if (sourceIndex < 0 || sourceIndex >= arrItems.length) {
    throw new AppException(
      `Invalid source index of ${sourceIndex} when swapping array elements.`,
      arraySwapItems.name,
      arrItems
    )
  }
  if (destIndex < 0 || destIndex >= arrItems.length) {
    throw new AppException(
      `Invalid destination index of ${destIndex} when swapping array elements.`,
      arraySwapItems.name,
      arrItems
    )
  }

  const temp = arrItems[destIndex]
  arrItems[destIndex] = arrItems[sourceIndex]
  arrItems[sourceIndex] = temp

  return arrItems
}

export function arraySwapItemsById<T extends IId<Tid>, Tid = T['id']>(
  arrItems: T[] | null | undefined,
  sourceId: Tid,
  destId: Tid
) {
  if (!arrItems || sourceId === destId) {
    return []
  }

  const source = arrayFindById(arrItems, sourceId)
  if (!source || !source.id) {
    throw new AppException(
      `Invalid source id of ${sourceId} when swapping array elements.`,
      arraySwapItemsById.name,
      arrItems
    )
  }

  const dest = arrayFindById(arrItems, destId)
  if (!dest || !dest.id) {
    throw new AppException(
      `Invalid destination index of ${destId} when swapping array elements.`,
      arrayFindById.name,
      arrItems
    )
  }

  const sourceIndex = arrItems.findIndex((x) => sourceId === x.id)
  const destIndex = arrItems.findIndex((x) => destId === x.id)

  return arraySwapItems(arrItems, sourceIndex, destIndex)
}

export function shuffleArray<T>(array: T[], maxItems?: number) {
  const shuffledArray = [...array]

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1))
    ;[shuffledArray[i], shuffledArray[rand]] = [
      shuffledArray[rand],
      shuffledArray[i],
    ]
  }

  return isNullOrUndefined(maxItems)
    ? shuffledArray
    : shuffledArray.slice(0, maxItems)
}

export function splitIntoArray(
  strToSplit: ArrayOrSingleBasicTypes,
  splitter = ',',
  replaceNonPrintable = true,
  preTrimString = false
) {
  let str = isString(strToSplit)
    ? preTrimString
      ? safestrTrim(strToSplit)
      : safestr(strToSplit)
    : String(strToSplit)

  if (replaceNonPrintable) {
    str = ReplaceNonPrintable(str)
  }

  if (str.startsWith('[')) {
    str = safestrTrim(str.substring(1))
  }
  if (str.endsWith(']')) {
    str = safestrTrim(str.substring(0, str.length - 1))
  }

  return str.split(splitter)
}

/**
 * Takes a string or array of strings, iterates over each string and splits them according to the splitter provided.
 * Each split string is then added to an array and the array of split strings is returned.
 * @param strOrArray A {@link StringOrStringArray} to push all items split with the splitter provided.
 * @param splitter A string of what to split every string by.
 * @param removeEmpties If true, remove all empty strings.
 * @param trimStrings True if you want to remove any surrounding spaces on every string.
 * @returns An array of every string split by splitter.
 */
export function splitToArray(
  strOrArray?: ArrayOrSingleBasicTypes,
  splitter = ',',
  removeEmpties = true,
  trimStrings = true,
  extras: {
    preTrimString?: boolean
    removeNonPrintable?: boolean
  } = { preTrimString: false, removeNonPrintable: true }
): string[] {
  let splitted = safeArray(strOrArray).reduce(
    (acc: string[], cur) =>
      acc.concat(
        splitIntoArray(
          cur,
          splitter,
          extras.removeNonPrintable,
          extras.preTrimString
        )
      ),
    []
  )

  if (removeEmpties) {
    splitted = splitted.filter((e) => hasData(e.trim()))
  }

  if (trimStrings) {
    splitted = splitted.map((x) => safestrTrim(x))
  }

  return splitted
}

/**
 * Calls splitToArray and if only one string is the array is returned, just that string is returned.
 * Otherwise the array returned from splitToArray is returned intact.
 * @param strOrArray A {@link StringOrStringArray} to push all items split with the splitter provided.
 * @param splitter A string of what to split every string by.
 * @param removeEmpties If true, remove all empty strings.
 * @param trimStrings True if you want to remove any surrounding spaces on every string.
 * @returns An array of every string split by splitter, of if only 1 string is the result of splitToArray, the string itself is returned.
 */
export function splitToArrayOrStringIfOnlyOne(
  strOrArray: StringOrStringArray,
  splitter = ',',
  removeEmpties = true,
  trimStrings = true
): StringOrStringArray {
  const arr = splitToArray(strOrArray, splitter, removeEmpties, trimStrings)

  if (isArray(arr, 2)) {
    return arr
  }

  if (isArray(arr, 1)) {
    return arr[0]
  }

  return ''
}

/**
 * Calls splitToArray and if only one string is the array is returned, just that string is returned uppercase.
 * Otherwise the array returned from splitToArray is returned with each string uppercased.
 * @param strOrArray A {@link StringOrStringArray} to push all items split with the splitter provided.
 * @param splitter A string of what to split every string by.
 * @param removeEmpties If true, remove all empty strings.
 * @param trimStrings True if you want to remove any surrounding spaces on every string.
 * @returns An array of every string split by splitter, of if only 1 string is the result of splitToArray with every string uppercased, the string itself is returned uppercase.
 */
export function splitToArrayOrStringIfOnlyOneToUpper(
  strOrArray: StringOrStringArray,
  splitter = ',',
  removeEmpties = true,
  trimStrings = true
): StringOrStringArray {
  const arr = splitToArrayOrStringIfOnlyOne(
    strOrArray,
    splitter,
    removeEmpties,
    trimStrings
  )

  if (isArray(arr)) {
    return arr.map((x) => x.toUpperCase())
  }

  return safestrUppercase(arr)
}

export function splitToArrayOfIntegers(commaDelimitedString?: string) {
  const trimmed = splitToArray(commaDelimitedString, ',', true, true, {
    preTrimString: true,
    removeNonPrintable: true,
  })

  return trimmed.map((item) => parseInt(item, 10))
}

export function splitToArrayOfNumbers(commaDelimitedString?: string) {
  const trimmed = splitToArray(commaDelimitedString, ',', true, true, {
    preTrimString: true,
    removeNonPrintable: true,
  })

  return trimmed.map((item) => parseFloat(item))
}

export function ToIIdNameArray<T extends IIdName>(
  arr: Readonly<T | string>[] | null | undefined
) {
  return safeArray(arr).map((x) => {
    let inv: IIdName
    if (isString(x)) {
      inv = {
        id: x,
        name: x,
      }
    } else {
      inv = x
    }

    return inv
  })
}

export function MapINamesToNames(arr: Readonly<IName>[] | null | undefined) {
  return safeArray(arr).map((x) => x.name)
}

export function arrayMoveElement<T>(
  arr: ArrayOrSingle<T>,
  fromIndex: number,
  toIndex: number
) {
  const arrCopy = safeArray(arr),
    len = arrCopy.length

  if (fromIndex < 0 || fromIndex >= len || toIndex < 0 || toIndex >= len) {
    throw new AppException(
      `Invalid source index of ${safestr(
        fromIndex
      )} or destination index of ${safestr(
        toIndex
      )} when moving array elements.`,
      arrayMoveElement.name,
      arrCopy
    )
  }

  if (fromIndex === toIndex) {
    return arrCopy
  }

  // Remove the element and store it
  const [element] = arrCopy.splice(fromIndex, 1)

  // Insert the element at the new position
  arrCopy.splice(toIndex, 0, element)

  return arrCopy
}

export function arrayFilterMap<T, R>(
  arr: ArrayOrSingle<T> | null | undefined,
  mapFunc: (_item: T) => R,
  filterFunc?: (_item: T) => boolean
): R[] {
  let myarr = safeArray(arr)

  if (filterFunc) {
    myarr = myarr.filter(filterFunc)
  }

  return myarr.map(mapFunc)
}

/**
 * Return the object with the given id from the array.
 * @param arrItems The array to search for the ids.
 * @param id id to search for in the arrItems list.
 * @returns The object with the given name. If not found, undefined is returned.
 */
export function arrayFindIndexOf<T extends IId<Tid>, Tid = T['id']>(
  arrItems?: ArrayOrSingle<T> | null,
  id?: Tid
) {
  if (id) {
    const index = safeArray(arrItems)
      .map((x) => x.id)
      .indexOf(id)

    return index === -1 ? undefined : index
  }
}
