import { GrayArrowException } from '../models/GrayArrowException.mjs'
import { IIdName } from '../models/id-name.mjs'
import { IId, IName } from '../models/interfaces.mjs'
import { ArrayOrSingle } from '../models/types.mjs'
import { getObject, isArray, safeArray, safestr } from './general.mjs'

export function arrayGetIds<T extends Required<Iid<Tid>>, Tid = T['id']>(
  arr?: Readonly<T>[],
  callback?: (item: T) => Tid
) {
  return safeArray(arr).map((x) => (callback ? callback(x) : x.id))
}
export function arrayGetIdNames<T extends IIdName<Tid, Tname>, Tid = T['id'], Tname = T['name']>(
  arr?: Readonly<T>[],
  callback?: (item: T) => IIdName<Tid, Tname>
) {
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
  callback?: (item: T) => Tname
) {
  return safeArray(arr).map((x) => (callback ? callback(x) : x.name))
}

/**
 * Return the object with the given id from the array.
 * @param arrItems The array to search for the ids.
 * @param id id to search for in the arrItems list.
 * @returns The object with the given name. If not found, undefined is returned.
 */
export function arrayFindById<T extends Iid<Tid>, Tid = T['id']>(arrItems?: T[], id?: Tid) {
export function arrayFindById<T extends Iid<Tid>, Tid = T['id']>(arrItems?: T[], id?: Tid) {
  return id && safeArray(arrItems).find((x) => id === x.id)
}

/**
 * Return the object with the given id from the array.
 * @param arrItems The array to search for the ids.
 * @param id id to search for in the arrItems list.
 * @returns The name of the found item. If not found, undefined is returned.
 */
export function arrayFindNameById<T extends IIdName<Tid, Tname>, Tid = T['id'], Tname = T['name']>(
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
export function arrayFindByIds<T extends Required<Iid<Tid>>, Tid = T['id']>(
export function arrayFindByIds<T extends Required<Iid<Tid>>, Tid = T['id']>(
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
export function arrayFindByNotIds<T extends Required<Iid<Tid>>, Tid = T['id']>(
export function arrayFindByNotIds<T extends Required<Iid<Tid>>, Tid = T['id']>(
  arrItems?: T[],
  ids?: Tid[]
) {
  if (!ids || !ids.length) {
    return safeArray(arrItems)
  }

  return safeArray(arrItems).filter((x) => !ids.includes(x.id))
}

export function arrayMustFind<T extends Iid<Tid>, Tid = T['id']>(
export function arrayMustFind<T extends Iid<Tid>, Tid = T['id']>(
  arrItems: T[] | undefined,
  id: Tid,
  functionSourceName?: string
) {
  const foundItem = arrayFindById<T>(arrItems, id)
  if (!foundItem) {
    throw new GrayArrowException(
      `Unable to find ${safestr(functionSourceName, arrayFindById.name)} id: ${id}.`,
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
export function arrayFindByName<T extends IName<Tname>, Tname = T['name']>(
  arrItems?: T[],
  name?: Tname
) {
  return arrayFind(arrItems, (x) => x.name === name)
}

export function arrayFilter<T>(arrItems: T[] | undefined, filterFunc: (item: T) => boolean) {
  return safeArray(arrItems).filter(filterFunc)
}

export function arrayFind<T>(arrItems: T[] | undefined, findFunc: (item: T) => boolean) {
  return safeArray(arrItems).find(findFunc)
}

export function arrayMustFindFunc<T>(
  arrItems: T[],
  findFunc: (item: T) => boolean,
  functionSourceName?: string,
  exceptionSuffix?: () => string
) {
  const foundItem = arrayFind<T>(arrItems, findFunc)

  if (!foundItem) {
    throw new GrayArrowException(
      `Unable to find ${safestr(functionSourceName, arrayFind.name)}${
        exceptionSuffix ? ' ' + exceptionSuffix() : ''
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

export function arrayOfIds<T extends Iid<Tid>, Tid = T['id']>(arr?: Readonly<T>[]) {
export function arrayOfIds<T extends Iid<Tid>, Tid = T['id']>(arr?: Readonly<T>[]) {
  return arrayReduceArrayReturns(arr, (cur) => {
    if (cur?.id) {
      return cur.id
    }
  })
}

export function arrayOfNames<T extends IName<Tname>, Tname = T['name']>(arr?: Readonly<T>[]) {
  return safeArray(arr).reduce((acc: Tname[], cur) => {
    acc.push(cur.name)

    return acc
  }, [])
}

export function arrayElementNonEmpty<T>(
  arr?: T[],
  index = 0,
  functionSourceName?: string,
  customMessage?: string
) {
  const item = getObject(arr, index)
  if (item) {
    return item
  }

  throw new GrayArrowException(
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
export function arrayFirst<T>(tArray?: T[], defaultIfNone?: T) {
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

  throw new GrayArrowException(
    'Array has no items.',
    functionSourceName ?? arrayLastNonEmpty.name,
    customMessage
  )
}

export function arrayForEachReturns<T>(arr: T[] | undefined, funcArrayResults: (item: T) => void) {
export function arrayForEachReturns<T>(arr: T[] | undefined, funcArrayResults: (item: T) => void) {
  safeArray(arr).forEach((cur) => funcArrayResults(cur))
}

export function ToSafeArray<T = unknown>(arrOrT?: Readonly<ArrayOrSingle<T>>) {
  if (arrOrT) {
    return Array.isArray(arrOrT) ? (arrOrT as T[]) : [arrOrT as T]
  }

  return []
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
  funcArrayResults: (item: T, index: number) => ArrayOrSingle<TreturnType> | undefined
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

export function arraySwapItemsById<T extends Iid<Tid>, Tid = T['id']>(
export function arraySwapItemsById<T extends Iid<Tid>, Tid = T['id']>(
  arrItems: T[],
  sourceId: Tid,
  destId: Tid
) {
  if (!arrItems || sourceId === destId) {
    return []
  }

  const source = arrayFindById(arrItems, sourceId)
  if (!source || !source.id) {
    throw new GrayArrowException(
      `Invalid source id of ${sourceId} when swapping array elements.`,
      arraySwapItems.name,
      arrItems
    )
  }

  const dest = arrayFindById(arrItems, destId)
  if (!dest || !dest.id) {
    throw new GrayArrowException(
      `Invalid destination index of ${destId} when swapping array elements.`,
      arraySwapItems.name,
      arrItems
    )
  }

  const sourceIndex = arrItems.findIndex((x) => sourceId === x.id)
  const destIndex = arrItems.findIndex((x) => destId === x.id)

  return arraySwapItems(arrItems, sourceIndex, destIndex)
}

export function arraySwapItems<T>(arrItems: T[], sourceIndex: number, destIndex: number) {
  if (!arrItems || sourceIndex === destIndex) {
    return []
  }

  if (sourceIndex < 0 || sourceIndex >= arrItems.length) {
    throw new GrayArrowException(
      `Invalid source index of ${sourceIndex} when swapping array elements.`,
      arraySwapItems.name,
      arrItems
    )
  }
  if (destIndex < 0 || destIndex >= arrItems.length) {
    throw new GrayArrowException(
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
