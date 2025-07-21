import { IId, IIdRequired } from '../models/IdManager.mjs'
import { isString, safestr } from './string-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import { ArrayOrSingle } from '../models/types.mjs'
import { IIdName } from '../models/id-name.mjs'
import { IName } from '../models/interfaces.mjs'
import { isNullOrUndefined } from './general.mjs'
import { isNumber } from './number-helper.mjs'

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

export function arrayGetIds<T extends IIdRequired<Tid>, Tid = T['id']>(
  arr?: ArrayOrSingle<T> | null,
  callback?: (item: T) => Tid
) {
  return safeArray(arr).map((x) => (callback ? callback(x) : x.id))
}

export function arrayGetIdNames<T extends IIdName<Tid>, Tid = T['id']>(
  arr?: Readonly<T>[],
  callback?: (item: T) => IIdName<Tid>
) {
  return safeArray(arr).map((x) => {
    if (callback) {
      return callback(x)
    }

    const idname: IIdName<Tid> = { id: x.id, name: x.name }

    return idname
  })
}

export function arrayGetNames<T extends IName, Tname = T['name']>(
  arr?: ArrayOrSingle<T> | null,
  callback?: (item: T) => Tname
) {
  return safeArray(arr).map((x) => (callback ? callback(x) : x.name))
}

export function arrayFind<T>(
  arrItems: ArrayOrSingle<T> | null | undefined,
  findFunc: (item: T) => boolean
) {
  return safeArray(arrItems).find(findFunc)
}

/**
 * Return the object with the given id from the array.
 * @param arrItems The array to search for the ids.
 * @param id id to search for in the arrItems list.
 * @returns The object with the given name. If not found, undefined is returned.
 */
export function arrayFindById<T extends IId<Tid>, Tid = T['id']>(
  arrItems?: ArrayOrSingle<T> | null,
  id?: Tid
) {
  return id && safeArray(arrItems).find((x) => id === x.id)
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

/**
 * Return the object with the given id from the array.
 * @param arrItems The array to search for the ids.
 * @param id id to search for in the arrItems list.
 * @returns The name of the found item. If not found, undefined is returned.
 */
export function arrayFindNameById<T extends IIdName<Tid>, Tid = T['id']>(
  arrItems?: T[],
  id?: Tid
) {
  return arrayFindById(arrItems, id)?.name
}

/**
 * Return the objects that contain the given ids.
 * @param arrItems The array to search for the ids.
 * @param ids The array of ids to find in arrItems.
 * @returns The object with the given name. If not found, an empty Array is returned.
 */
export function arrayFindByIds<T extends IIdRequired<Tid>, Tid = T['id']>(
  arrItems?: ArrayOrSingle<T> | null,
  ids?: Readonly<Tid[]>
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
export function arrayFindByNotIds<T extends IIdRequired<Tid>, Tid = T['id']>(
  arrItems?: ArrayOrSingle<T> | null,
  ids?: Tid[]
) {
  if (!ids || !ids.length) {
    return safeArray(arrItems)
  }

  return safeArray(arrItems).filter((x) => !ids.includes(x.id))
}

export function arrayMustFind<T extends IId<Tid>, Tid = T['id']>(
  arrItems: ArrayOrSingle<T> | null | undefined,
  id: Tid,
  functionSourceName?: string
) {
  const foundItem = arrayFindById<T>(arrItems, id)
  if (!foundItem) {
    throw new AppException(
      `Unable to find ${safestr(
        functionSourceName,
        arrayFindById.name
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      )} id: ${id}.`,
      arrayFindById.name,
      arrItems
    )
  }

  return foundItem
}

/**
 * Return the object with the given name from the array.
 * @param arrItems The array of items to search for the name. Null checks are taken into account.
 * @param name Name to search for in the IName
 * @returns The object with the given name. If not found, and exception is thrown.
 */
export function arrayFindByName<T extends IName>(
  arrItems?: ArrayOrSingle<T> | null,
  name?: string
) {
  return arrayFind(arrItems, (x) => x.name === name)
}

export function arrayFilter<T>(
  arrItems: ArrayOrSingle<T> | null | undefined,
  filterFunc: (item: T) => boolean
) {
  return safeArray(arrItems).filter(filterFunc)
}

export function arrayMustFindFunc<T>(
  arrItems: ArrayOrSingle<T> | null | undefined,
  findFunc: (item: T) => boolean,
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

export function arrayMustFindByName<T extends IName>(
  arrItems: ArrayOrSingle<T> | null | undefined,
  name: string,
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
    item: T,
    index: number
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
    if (cur?.id) {
      return cur.id
    }
  })
}

export function arrayOfNames<T extends IName>(arr?: Readonly<T>[]) {
  return safeArray(arr).reduce((acc: string[], cur) => {
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
  return arrayElement(tArray, 0) ?? defaultIfNone
}

export function arrayFirstNonEmpty<T>(
  arr?: ArrayOrSingle<T> | null,
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
export function arrayLast<T>(
  tArray?: ArrayOrSingle<T> | null,
  defaultIfNone?: T
) {
  return arrayElement(tArray, -1) ?? defaultIfNone
}

export function arrayLastNonEmpty<T>(
  arr?: ArrayOrSingle<T> | null,
  functionSourceName?: string,
  customMessage?: string
) {
  return arrayElementNonEmpty(arr, -1, functionSourceName, customMessage)
}

export function arrayForEachReturns<T>(
  arr: ArrayOrSingle<T> | null | undefined,
  funcArrayResults: (item: T) => void
) {
  safeArray(arr).forEach((cur) => funcArrayResults(cur))
}

export function arraySwapItems<T>(
  arrItems: T[],
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
  arrItems: T[],
  sourceId: Tid,
  destId: Tid
) {
  if (!arrItems || sourceId === destId) {
    return []
  }

  const source = arrayFindById(arrItems, sourceId)
  if (!source || !source.id) {
    throw new AppException(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Invalid source id of ${sourceId} when swapping array elements.`,
      arraySwapItemsById.name,
      arrItems
    )
  }

  const dest = arrayFindById(arrItems, destId)
  if (!dest || !dest.id) {
    throw new AppException(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Invalid destination index of ${destId} when swapping array elements.`,
      arraySwapItemsById.name,
      arrItems
    )
  }

  const destIndex = arrItems.findIndex((x) => destId === x.id),
    sourceIndex = arrItems.findIndex((x) => sourceId === x.id)

  return arraySwapItems(arrItems, sourceIndex, destIndex)
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

export function arrayMoveDown<T>(arrItems: T[], index: number) {
  return arraySwapItems(arrItems, index, index + 1)
}

export function arrayMoveUp<T>(arrItems: T[], index: number) {
  return arraySwapItems(arrItems, index - 1, index)
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

export function ToIIdNameArray<T extends IIdName<string>>(
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

export function arrayMoveFromTo<T>(
  arr: ArrayOrSingle<T>,
  from: number,
  to: number
) {
  const arrCopy = safeArray(arr),
    len = arrCopy.length

  if (from < 0 || from >= len || to < 0 || to >= len) {
    throw new AppException(
      `Invalid source index of ${from} or destination index of ${to} when moving array elements.`,
      arrayMoveFromTo.name,
      arrCopy
    )
  }

  if (from !== to) {
    const temp = arrCopy[to]
    arrCopy[to] = arrCopy[from]
    arrCopy[from] = temp
  }

  return arrCopy
}
