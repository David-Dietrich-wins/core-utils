import { AppException } from '../models/AppException.mjs'
import { IIdName } from '../models/id-name.mjs'
import { IId, IIdRequired } from '../models/IdManager.mjs'
import { IName } from '../models/interfaces.mjs'
import { ArrayOrSingle, StringOrStringArray } from '../models/types.mjs'
import {
  isArray,
  isNullOrUndefined,
  isString,
  safeArray,
  safestr,
  safestrTrim,
  safestrUppercase,
} from './general.mjs'

export function arrayGetIds<T extends IIdRequired<Tid>, Tid = T['id']>(
  arr?: ArrayOrSingle<T> | null,
  callback?: (item: T) => Tid
) {
  return safeArray(arr).map((x) => (callback ? callback(x) : x.id))
}
export function arrayGetIdNames<
  T extends IIdName<Tid, Tname>,
  Tid = T['id'],
  Tname = T['name']
>(arr?: Readonly<T>[], callback?: (item: T) => IIdName<Tid, Tname>) {
  return safeArray(arr).map((x) => {
    if (callback) {
      return callback(x)
    }

    const idname: IIdName<Tid, Tname> = { id: x.id, name: x.name }

    return idname
  })
}
export function arrayGetNames<T extends IName<Tname>, Tname = T['name']>(
  arr?: ArrayOrSingle<T> | null,
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
export function arrayFindByName<T extends IName<Tname>, Tname = T['name']>(
  arrItems?: ArrayOrSingle<T> | null,
  name?: Tname
) {
  return arrayFind(arrItems, (x) => x.name === name)
}

export function arrayFilter<T>(
  arrItems: ArrayOrSingle<T> | null | undefined,
  filterFunc: (item: T) => boolean
) {
  return safeArray(arrItems).filter(filterFunc)
}

export function arrayFind<T>(
  arrItems: ArrayOrSingle<T> | null | undefined,
  findFunc: (item: T) => boolean
) {
  return safeArray(arrItems).find(findFunc)
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
        exceptionSuffix ? ' ' + exceptionSuffix() : ''
      }.`,
      arrayFindByName.name,
      arrItems
    )
  }

  return foundItem
}

export function arrayMustFindByName<T extends IName<Tname>, Tname = T['name']>(
  arrItems: ArrayOrSingle<T> | null | undefined,
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

export function arrayOfIds<T extends IId<Tid>, Tid = T['id']>(
  arr?: Readonly<T>[]
) {
  return arrayReduceArrayReturns(arr, (cur) => {
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
export function arrayElement<T>(arr?: ArrayOrSingle<T> | null, index = 0) {
  const safearr = safeArray(arr)
  if (safearr.length) {
    index = index || 0

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
      `Invalid source id of ${sourceId} when swapping array elements.`,
      arraySwapItems.name,
      arrItems
    )
  }

  const dest = arrayFindById(arrItems, destId)
  if (!dest || !dest.id) {
    throw new AppException(
      `Invalid destination index of ${destId} when swapping array elements.`,
      arraySwapItems.name,
      arrItems
    )
  }

  const sourceIndex = arrItems.findIndex((x) => sourceId === x.id)
  const destIndex = arrItems.findIndex((x) => destId === x.id)

  return arraySwapItems(arrItems, sourceIndex, destIndex)
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

export function arrayAdd<T extends IId>(
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

export function arrayRemove<T extends IId>(
  arrItems: T[] | null | undefined,
  item: T
) {
  return arrayRemoveById(arrItems, item.id)
}
export function arrayRemoveById<T extends IId>(
  arrItems: T[] | null | undefined,
  id: T['id']
) {
  arrItems = safeArray(arrItems).filter((x) => x.id !== id)

  return arrItems
}

export function arrayUpdateOrAdd<T extends IId>(
  arrItems: T[],
  item: T,
  insertAtFront = false
) {
  const foundIndex = arrItems.findIndex((x) => item.id === x.id)

  // If the index is out of bounds, just push the item to the end of the array.
  if (!insertAtFront || arrItems.length === 0 || foundIndex === -1) {
    arrItems.push(item)
  } else {
    arrItems.splice(foundIndex, 1, item) // Remove the existing item from the array if it exists.
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
  strOrArray?: StringOrStringArray,
  splitter = ',',
  removeEmpties = true,
  trimStrings = true
) {
  let splitted: string[] = []
  if (isNullOrUndefined(strOrArray)) {
    return splitted
  }

  if (isString(strOrArray)) {
    let str = safestrTrim(strOrArray)
    if (str.startsWith('[')) {
      str = safestrTrim(str.substring(1))
    }
    if (str.endsWith(']')) {
      str = safestrTrim(str.substring(0, str.length - 1))
    }

    splitted = str.split(splitter)
  } else if (isArray(strOrArray)) {
    strOrArray.map((x) => (splitted = splitted.concat(x.split(splitter))))
  } else {
    throw 'Invalid type passed to splitToArray'
  }

  if (trimStrings) {
    splitted = splitted.map((x) => safestrTrim(x))
  }

  if (removeEmpties) {
    return splitted.filter(function (e) {
      if (e) {
        return e
      }
    })
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
  const trimmed = splitToArray(commaDelimitedString)

  return trimmed.map((item) => parseInt(item, 10))
}

export function ToIIdNameArray<T extends IIdName<string, string>>(
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
