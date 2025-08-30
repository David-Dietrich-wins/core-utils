/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ArrayOrSingle, StringOrStringArray } from '../../models/types.mjs'
import {
  type IIdName,
  type IIdNameValue,
  IdName,
} from '../../models/id-name.mjs'
import {
  MapINamesToNames,
  ToIIdNameArray,
  ToSafeArray,
  ToSafeArray2d,
  addObjectToList,
  arrayAdd,
  arrayElement,
  arrayElementNonEmpty,
  arrayFilter,
  arrayFilterMap,
  arrayFind,
  arrayFindById,
  arrayFindByIds,
  arrayFindByName,
  arrayFindByNotIds,
  arrayFindNameById,
  arrayFirst,
  arrayFirstNonEmpty,
  arrayForEachReturns,
  arrayGetIdNames,
  arrayGetIds,
  arrayGetNames,
  arrayLast,
  arrayLastNonEmpty,
  arrayMoveElement,
  arrayMustFind,
  arrayMustFindByName,
  arrayMustFindFunc,
  arrayOfIds,
  arrayOfNames,
  arrayReduceArrayReturns,
  arrayRemove,
  arrayRemoveById,
  arraySwapItems,
  arraySwapItemsById,
  arrayUnique,
  arrayUpdateOrAdd,
  getObject,
  isArray,
  safeArray,
  safeArrayUnique,
  shuffleArray,
  splitIntoArray,
  splitToArray,
  splitToArrayOfIntegers,
  splitToArrayOfNumbers,
  splitToArrayOrStringIfOnlyOne,
  splitToArrayOrStringIfOnlyOneToUpper,
} from './array-helper.mjs'
import { AppException } from '../../models/AppException.mjs'

test(safeArray.name, () => {
  expect(safeArray()).toStrictEqual([])
  expect(safeArray(1)).toStrictEqual([1])
  expect(safeArray([1])).toStrictEqual([1])
  expect(safeArray(undefined, [1])).toStrictEqual([1])
})

test(safeArrayUnique.name, () => {
  expect(safeArrayUnique()).toStrictEqual([])
  expect(safeArrayUnique(1)).toStrictEqual([1])
  expect(safeArrayUnique([1])).toStrictEqual([1])
  expect(safeArrayUnique(undefined, [1])).toStrictEqual([1])

  expect(safeArrayUnique([1, 2, 3, 1, 2])).toStrictEqual([1, 2, 3])
})

test(isArray.name, () => {
  expect(isArray(undefined)).toBe(false)
  expect(isArray(null)).toBe(false)
  expect(isArray([])).toBe(true)
  expect(isArray([], 0)).toBe(true)
  expect(isArray([], 1)).toBe(false)
  expect(isArray([1, 2], 1)).toBe(true)
  expect(isArray(['a', 'b'], 'd')).toBe(false)
  expect(isArray(['a', 'b'], 'a')).toBe(true)
  expect(isArray(['a', 'b'], 'a')).toBe(true)
  expect(isArray(['a', 'b'], 'b')).toBe(true)
})

test('arrayGetIds', () => {
  const arr: IdName<number>[] = [new IdName(1, 'name1'), new IdName(2, 'name2')]

  expect(arrayGetIds(arr)).toStrictEqual([1, 2])

  expect(
    arrayGetIds(arr, (item: IdName<number>) => {
      if (item.id === 1) {
        return 3
      }

      return item.id
    })
  ).toStrictEqual([3, 2])
})

test('arrayGetIdNames', () => {
  const arr: IdName<number>[] = [new IdName(1, 'name1'), new IdName(2, 'name2')]

  expect(arrayGetIdNames(arr)).toStrictEqual([
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
  ])

  expect(
    arrayGetIdNames(arr, (item: IdName<number>) => {
      if (item.id === 1) {
        return new IdName(3, item.name)
      }

      return item
    })
  ).toStrictEqual([new IdName(3, 'name1'), new IdName(2, 'name2')])
})

test('arrayGetNames', () => {
  const arr: IdName<number>[] = [new IdName(1, 'name1'), new IdName(2, 'name2')]

  expect(arrayGetNames(arr)).toStrictEqual(['name1', 'name2'])

  expect(
    arrayGetNames<IdName<number>>(arr, (item: IdName<number>) => {
      if (item.name === 'name1') {
        return 'test-rename'
      }

      return item.name
    })
  ).toStrictEqual(['test-rename', 'name2'])
})

test('arrayFindById', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
  ]

  expect(arrayFindById(arr, 2)).toStrictEqual({ id: 2, name: 'name2' })

  expect(arrayFindById()).toBeUndefined()
  expect(arrayFindById(arr)).toBeUndefined()

  expect(arrayFindById(arr, 1)).toStrictEqual({ id: 1, name: 'name1' })
})

test('arrayFindByIds', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  expect(arrayFindByIds(arr, [2])).toStrictEqual([{ id: 2, name: 'name2' }])

  expect(arrayFindByIds()).toStrictEqual([])
  expect(arrayFindByIds(arr)).toStrictEqual([])

  expect(arrayFindByIds(arr, [1, 3])).toStrictEqual([
    { id: 1, name: 'name1' },
    { id: 3, name: 'name3' },
  ])
})

test('arrayFindByNotIds', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  expect(arrayFindByNotIds(arr, [1, 3])).toStrictEqual([
    { id: 2, name: 'name2' },
  ])

  expect(arrayFindByNotIds()).toStrictEqual([])
  expect(arrayFindByNotIds(arr)).toStrictEqual(arr)

  expect(arrayFindByNotIds(arr, [2])).toStrictEqual([
    { id: 1, name: 'name1' },
    { id: 3, name: 'name3' },
  ])
})

test('arrayFindNameById', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
  ]

  expect(arrayFindNameById(arr, 2)).toStrictEqual('name2')

  expect(arrayFindNameById()).toBeUndefined()
  expect(arrayFindNameById(arr)).toBeUndefined()

  expect(arrayFindNameById(arr, 1)).toStrictEqual('name1')
})

test('arrayMustFind', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
  ]

  expect(arrayMustFind(arr, 2)).toStrictEqual({ id: 2, name: 'name2' })
  expect(arrayMustFind(arr, 1)).toStrictEqual({ id: 1, name: 'name1' })

  expect(() => arrayMustFind(arr, 4)).toThrow()
})

test('arrayFindByName', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
  ]

  expect(arrayFindByName()).toBeUndefined()
  expect(arrayFindByName(arr)).toBeUndefined()
  expect(arrayFindByName(arr, 'hello')).toBeUndefined()

  expect(arrayFindByName(arr, 'name1')).toStrictEqual(arr[0])
  expect(arrayFindByName(arr, 'name2')).toStrictEqual(arr[1])
})

test('arrayMustFindByName', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
  ]

  expect(() => arrayMustFindByName(arr, 'hello')).toThrow()

  expect(arrayMustFindByName(arr, 'name1')).toStrictEqual(arr[0])
  expect(arrayMustFindByName(arr, 'name2')).toStrictEqual(arr[1])
})

test('arrayFilter', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]
  const filterFunc = (item: IdName<number>) => item.id === 1

  expect(arrayFilter([], filterFunc)).toStrictEqual([])
  expect(arrayFilter(undefined, filterFunc)).toStrictEqual([])
  expect(arrayFilter(arr, filterFunc)).toStrictEqual([arr[0]])
})

test('arrayFind', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]
  const filterFunc = (item: IdName<number>) => item.id === 1

  expect(arrayFind([], filterFunc)).toBeUndefined()
  expect(arrayFind(undefined, filterFunc)).toBeUndefined()
  expect(arrayFind(arr, filterFunc)).toStrictEqual(arr[0])
})

test('arrayMustFindFunc', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]
  const filterFunc = (item: IdName<number>) => item.id === 1

  expect(() => arrayMustFindFunc([], filterFunc)).toThrow(
    'Unable to find arrayMustFindFunc.'
  )
  expect(arrayMustFindFunc(arr, filterFunc)).toStrictEqual(arr[0])
})

test('arrayOfIds', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  expect(arrayOfIds([])).toStrictEqual([])
  expect(arrayOfIds(undefined)).toStrictEqual([])
  expect(arrayOfIds(arr)).toStrictEqual([1, 2, 3])

  arr[1].id = 0
  expect(arrayOfIds(arr)).toStrictEqual([1, 3])
  ;(arr[1] as any).id = undefined
  expect(arrayOfIds(arr)).toStrictEqual([1, 3])

  arr.push(undefined as any)
  expect(arrayOfIds(arr)).toStrictEqual([1, 3])
})

test('arrayOfNames', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  expect(arrayOfNames([])).toStrictEqual([])
  expect(arrayOfNames(undefined)).toStrictEqual([])
  expect(arrayOfNames(arr)).toStrictEqual(['name1', 'name2', 'name3'])
})

test(arrayElement.name, () => {
  expect(arrayElement(undefined)).toBeUndefined()
  expect(arrayElement(null)).toBeUndefined()
  expect(arrayElement({})).toStrictEqual({})
  expect(arrayElement({ a: 'a' })).toStrictEqual({ a: 'a' })

  expect(arrayElement(['a', 'b'], 0)).toBe('a')
  expect(arrayElement(['a', 'b'], 1)).toBe('b')
  expect(arrayElement(['a', 'b'], -1)).toBe('b')
  expect(arrayElement(['a', 'b'], 2)).toBeUndefined()
})

test(arrayElementNonEmpty.name, () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  expect(() => arrayElementNonEmpty()).toThrow('Array has no items.')
  expect(() => arrayElementNonEmpty([])).toThrow('Array has no items.')

  expect(arrayElementNonEmpty(arr, 1)).toStrictEqual(arr[1])
  expect(() => arrayElementNonEmpty(arr, 4)).toThrow('Array has no items.')
})

test('arrayFirst and arrayLast', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  expect(arrayFirst()).toBeUndefined()
  expect(arrayLast()).toBeUndefined()

  expect(arrayFirst(arr)).toStrictEqual(arr[0])
  expect(arrayLast(arr)).toStrictEqual(arr[2])
})

test(arrayFirstNonEmpty.name, () => {
  const fname = arrayFirstNonEmpty.name

  expect(() => arrayFirstNonEmpty()).toThrow()
  expect(() => arrayFirstNonEmpty([])).toThrow()
  expect(() => arrayFirstNonEmpty([], fname)).toThrow()
  expect(() => arrayFirstNonEmpty([], fname, 'my custom message')).toThrow()
})

test(arrayLastNonEmpty.name, () => {
  const fname = arrayLastNonEmpty.name

  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  expect(() => arrayLastNonEmpty()).toThrow()
  expect(() => arrayLastNonEmpty([])).toThrow()
  expect(() => arrayLastNonEmpty([], fname)).toThrow()
  expect(() => arrayLastNonEmpty([], fname, 'my custom message')).toThrow()

  expect(arrayFirstNonEmpty(arr)).toStrictEqual(arr[0])
  expect(arrayLastNonEmpty(arr)).toStrictEqual(arr[2])
})

test('arrayForEachReturns', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  arrayForEachReturns(arr, (item) => {
    item.id = 4
  })

  expect(arr).toStrictEqual([
    { id: 4, name: 'name1' },
    { id: 4, name: 'name2' },
    { id: 4, name: 'name3' },
  ])
})

test('ToSafeArray', () => {
  expect(ToSafeArray(undefined)).toStrictEqual([])
  expect(ToSafeArray([])).toStrictEqual([])
  expect(ToSafeArray({ x: 1 })).toStrictEqual([{ x: 1 }])
})

test('ToSafeArray2d', () => {
  expect(ToSafeArray2d(undefined)).toStrictEqual([])
  expect(ToSafeArray2d([])).toStrictEqual([])
  expect(ToSafeArray2d({ x: 1 })).toStrictEqual([{ x: 1 }])
  expect(ToSafeArray2d([{ x: 1 }])).toStrictEqual([[{ x: 1 }]])
})

test('arrayRemoveById', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  expect(arrayRemoveById(arr, 2)).toStrictEqual([
    { id: 1, name: 'name1' },
    { id: 3, name: 'name3' },
  ])
  expect(arrayRemoveById(arr, 4)).toStrictEqual([
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ])
})

test('arrayUnique', () => {
  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
    { id: 1, name: 'name1' },
  ]

  expect(arrayUnique(arr)).toStrictEqual([
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
    { id: 1, name: 'name1' },
  ])

  arr.push(arr[0])
  expect(arrayUnique(arr)).toStrictEqual([
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
    { id: 1, name: 'name1' },
  ])
})

test('arrayAdd', () => {
  const addItem = { id: 4, name: 'name4' },
    arr = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
      { id: 3, name: 'name3' },
    ]

  expect(arrayAdd(arr, addItem)).toStrictEqual([
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
    { id: 4, name: 'name4' },
  ])
  expect(arrayAdd(arr, addItem, 1)).toStrictEqual([
    { id: 1, name: 'name1' },
    addItem,
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
    addItem,
  ])

  expect(arrayAdd(arr, addItem)).toStrictEqual([
    { id: 1, name: 'name1' },
    addItem,
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
    addItem,
    addItem,
  ])
})

test('arrayRemove', () => {
  const arr = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
      { id: 3, name: 'name3' },
    ],
    removeItem = { id: 2, name: 'name2' }

  expect(arrayRemove(arr, removeItem)).toStrictEqual([
    { id: 1, name: 'name1' },
    { id: 3, name: 'name3' },
  ])
})

test('arrayUpdateOrAdd', () => {
  const addItem = { id: 4, name: 'name4' },
    arr = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
      { id: 3, name: 'name3' },
    ],
    updateItem = { id: 2, name: 'name2-updated' }

  expect(arrayUpdateOrAdd(arr, updateItem)).toStrictEqual([
    { id: 1, name: 'name1' },
    updateItem,
    { id: 3, name: 'name3' },
  ])

  expect(arrayUpdateOrAdd(arr, addItem, true)).toStrictEqual([
    addItem,
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2-updated' },
    { id: 3, name: 'name3' },
  ])

  expect(arrayUpdateOrAdd(arr, arr[2], true)).toStrictEqual([
    { id: 2, name: 'name2-updated' },
    addItem,
    { id: 1, name: 'name1' },
    { id: 3, name: 'name3' },
  ])

  expect(arrayUpdateOrAdd([], arr[2], false)).toStrictEqual([arr[2]])
  expect(arrayUpdateOrAdd(arr, arr[2], false)).toStrictEqual([
    addItem,
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2-updated' },
    { id: 3, name: 'name3' },
  ])
})

test('ToIIdNameArray', () => {
  const arr: IIdNameValue[] = [
    { id: '1', name: 'name1', value: 'value1' },
    { id: '2', name: 'name2', value: 'value2' },
    { id: '3', name: 'name3', value: 'value3' },
  ]

  expect(ToIIdNameArray(arr)).toStrictEqual(arr)

  expect(ToIIdNameArray(undefined)).toStrictEqual([])

  const arrString = ['2', '4', '6']
  expect(ToIIdNameArray(arrString)).toStrictEqual([
    { id: '2', name: '2' },
    { id: '4', name: '4' },
    { id: '6', name: '6' },
  ])
})

test('MapINamesToNames', () => {
  const arr: IIdNameValue[] = [
    { id: '1', name: 'name1', value: 'value1' },
    { id: '2', name: 'name2', value: 'value2' },
    { id: '3', name: 'name3', value: 'value3' },
  ]

  expect(MapINamesToNames(arr)).toStrictEqual(['name1', 'name2', 'name3'])

  expect(MapINamesToNames(undefined)).toStrictEqual([])
})

test('arrayReduceArrayReturns', () => {
  const arr: IIdName<number>[] = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  let funcReturns: (item: IIdName<number>) => ArrayOrSingle<IIdName<number>>
  funcReturns = (item: IIdName<number>) => {
    item.id = 4
    return item
  }

  expect(arrayReduceArrayReturns(undefined, funcReturns)).toStrictEqual([])
  let result = arrayReduceArrayReturns(arr, funcReturns)
  expect(result).toStrictEqual(arr)

  funcReturns = (item: IIdName<number>) => {
    const arrItem = [item]
    arrItem.push(item)

    return arrItem
  }

  result = arrayReduceArrayReturns(arr, funcReturns)

  const expected = [arr[0], arr[0], arr[1], arr[1], arr[2], arr[2]]
  expect(result).toStrictEqual(expected)
})

function get3IIdNames(): IIdName<number>[] {
  return [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]
}

test('arraySwapItemsById', () => {
  let arr = get3IIdNames()

  expect(() => arraySwapItemsById(arr, 1, 4)).toThrow()

  arr = get3IIdNames()
  expect(() => arraySwapItemsById(arr, -1, 0)).toThrow()

  arr = get3IIdNames()
  expect(arraySwapItemsById(arr, 0, 0)).toBeDefined()
  arr = get3IIdNames()
  expect(() => arraySwapItemsById(arr, 1, 0)).toThrow()

  arr = get3IIdNames()
  expect(arraySwapItemsById(arr, 1, 2)).toStrictEqual([
    { id: 2, name: 'name2' },
    { id: 1, name: 'name1' },
    { id: 3, name: 'name3' },
  ])

  arr = get3IIdNames()
  expect(arraySwapItemsById(arr, 3, 1)).toStrictEqual([
    { id: 3, name: 'name3' },
    { id: 2, name: 'name2' },
    { id: 1, name: 'name1' },
  ])
})

test('arraySwapItems', () => {
  let arr = get3IIdNames()

  expect(() => arraySwapItems(arr, 1, 4)).toThrow()

  arr = get3IIdNames()
  expect(() => arraySwapItems(arr, -1, 0)).toThrow()

  arr = get3IIdNames()
  expect(arraySwapItems(arr, 0, 0)).toBeDefined()

  arr = get3IIdNames()
  expect(arraySwapItems(arr, 1, 0)).toStrictEqual([
    { id: 2, name: 'name2' },
    { id: 1, name: 'name1' },
    { id: 3, name: 'name3' },
  ])

  arr = get3IIdNames()
  expect(arraySwapItems(arr, 1, 2)).toStrictEqual([
    { id: 1, name: 'name1' },
    { id: 3, name: 'name3' },
    { id: 2, name: 'name2' },
  ])

  arr = get3IIdNames()
  expect(arraySwapItems(arr, 2, 0)).toStrictEqual([
    { id: 3, name: 'name3' },
    { id: 2, name: 'name2' },
    { id: 1, name: 'name1' },
  ])

  arr = get3IIdNames()
  expect(arraySwapItems(arr, 0, 2)).toStrictEqual([
    { id: 3, name: 'name3' },
    { id: 2, name: 'name2' },
    { id: 1, name: 'name1' },
  ])
})

test('shuffleArray', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  let shuffled = shuffleArray(arr)
  expect(shuffled).not.toStrictEqual(arr)

  shuffled = shuffleArray(arr, 2)
  expect(shuffled.length).toBe(2)
})

describe(`${splitToArray.name} types`, () => {
  test(splitToArray.name, () => {
    let strOrArray: StringOrStringArray = 'a,b , c,'
    const splitter = ','
    const removeEmpties = true
    const trimStrings = true
    let arr = splitToArray(strOrArray)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(strOrArray, splitter)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(strOrArray, splitter, removeEmpties)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(strOrArray, splitter, removeEmpties, trimStrings)
    expect(arr).toEqual(['a', 'b', 'c'])

    strOrArray = 'a'
    arr = splitToArray(strOrArray)
    expect(arr).toEqual(['a'])

    arr = splitToArray(strOrArray, splitter)
    expect(arr).toEqual(['a'])

    arr = splitToArray(strOrArray, splitter, removeEmpties)
    expect(arr).toEqual(['a'])

    arr = splitToArray(strOrArray, splitter, removeEmpties, trimStrings)
    expect(arr).toEqual(['a'])

    // strOrArray as Array
    strOrArray = ['a', 'b ', ' c', '']
    arr = splitToArray(strOrArray)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(strOrArray, splitter)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(strOrArray, splitter, removeEmpties)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(strOrArray, splitter, removeEmpties, trimStrings)
    expect(arr).toEqual(['a', 'b', 'c'])

    arr = splitToArray(undefined)
    expect(arr).toEqual([])

    expect(splitToArray(2 as any)).toStrictEqual(['2'])
  })

  describe(splitToArrayOrStringIfOnlyOne.name, () => {
    test('default', () => {
      const strOrArray = 'a,b , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = true
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no remove empties', () => {
      const strOrArray = 'a,b   , c,'
      const splitter = ','
      const removeEmpties = false
      const trimStrings = false
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c', ''])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c', ''])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no trim strings', () => {
      const strOrArray = 'a,b   , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = false
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')

      arr = splitToArrayOrStringIfOnlyOne(
        '',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('')
    })
  })

  describe(splitToArrayOrStringIfOnlyOneToUpper.name, () => {
    test('default', () => {
      const strOrArray = 'a,b , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = true
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        'A',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no remove empties', () => {
      const strOrArray = 'a,b   , c,'
      const splitter = ','
      const removeEmpties = false
      const trimStrings = false
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C', ''])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C', ''])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no trim strings', () => {
      const strOrArray = 'a,b   , c'
      const splitter = ','
      const removeEmpties = true
      const trimStrings = false
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })
  })

  test(splitToArrayOfIntegers.name, () => {
    let arr = splitToArrayOfIntegers('1,2,3,4,5,6,7,8,9,10')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers('[1,2,3,4,5,6,7,8,9,10]')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '     [   1,2 , 3, 4,    5, 6     ,7,8,9,10    ]  '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '[        1,2 , 3, 4,    5, 6     ,7,8,9,10      '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '        1,2 , 3, 4,    5, 6     ,7,8,9,10  ]    '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  test(splitToArrayOfNumbers.name, () => {
    let arr = splitToArrayOfNumbers('1.1,2,3,4,5,6,7.3487,8,9,10')

    expect(arr).toEqual([1.1, 2, 3, 4, 5, 6, 7.3487, 8, 9, 10])

    arr = splitToArrayOfNumbers('[1,2,3.14,4,5.689421,6,7,8,9,10]')

    expect(arr).toEqual([1, 2, 3.14, 4, 5.689421, 6, 7, 8, 9, 10])

    arr = splitToArrayOfNumbers(
      '     [   1,2 , 3, 4,    5.222233, 6     ,7,8,9,10    ]  '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5.222233, 6, 7, 8, 9, 10])

    arr = splitToArrayOfNumbers(
      '[   0.12,     1,2 , 3.43445, 4,    5, 6     ,7,8,9,10      '
    )

    expect(arr).toEqual([0.12, 1, 2, 3.43445, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfNumbers(
      '        1,2.2201 , 3.14, 4,    5, 6     ,7,8,9.87,10, 0.2287  ]    '
    )

    expect(arr).toEqual([1, 2.2201, 3.14, 4, 5, 6, 7, 8, 9.87, 10, 0.2287])
  })
})

test(getObject.name, () => {
  expect(getObject(undefined)).toBeUndefined()
  expect(getObject(null)).toBeUndefined()
  expect(getObject({})).toStrictEqual({})
  expect(getObject({ a: 'a' })).toStrictEqual({ a: 'a' })

  expect(getObject(['a', 'b'], 0)).toBe('a')
  expect(getObject(['a', 'b'], 1)).toBe('b')
  expect(getObject(['a', 'b'], -1)).toBe('b')
  expect(getObject(['a', 'b'], 2)).toBeUndefined()
  expect(getObject('a')).toBe('a')
  expect(getObject('a', 1)).toBeUndefined()
})

test(addObjectToList.name, () => {
  expect(addObjectToList([], [{ a: 'a' }])).toStrictEqual([{ a: 'a' }])
  expect(addObjectToList([], [1, 2])).toStrictEqual([1, 2])
  expect(addObjectToList(null as any, [1, 2])).toStrictEqual([1, 2])
  expect(addObjectToList(undefined as any, [1, 2])).toStrictEqual([1, 2])
  expect(addObjectToList(undefined as any, [1, undefined, 3])).toStrictEqual([
    1, 3,
  ])
  expect(addObjectToList([], undefined as any)).toStrictEqual([])
})

// Test('arrayMoveFromTo', () => {
//   Const arr: IIdNameValue<string, string>[] = [
//     { id: '1', name: 'name1', value: 'value1' },
//     { id: '2', name: 'name2', value: 'value2' },
//     { id: '3', name: 'name3', value: 'value3' },
//     { id: '4', name: 'name4', value: 'value4' },
//     { id: '5', name: 'name5', value: 'value5' },
//     { id: '6', name: 'name6', value: 'value6' },
//   ]

//   Expect(arrayMoveFromTo(arr, 0, 1)).toStrictEqual([
//     { id: '2', name: 'name2', value: 'value2' },
//     { id: '1', name: 'name1', value: 'value1' },
//     { id: '3', name: 'name3', value: 'value3' },
//     { id: '4', name: 'name4', value: 'value4' },
//     { id: '5', name: 'name5', value: 'value5' },
//     { id: '6', name: 'name6', value: 'value6' },
//   ])

//   Expect(arrayMoveFromTo(arr, 5, 2)).toStrictEqual([
//     { id: '1', name: 'name1', value: 'value1' },
//     { id: '6', name: 'name6', value: 'value6' },
//     { id: '3', name: 'name3', value: 'value3' },
//     { id: '4', name: 'name4', value: 'value4' },
//     { id: '5', name: 'name5', value: 'value5' },
//     { id: '2', name: 'name2', value: 'value2' },
//   ])
// })

test('arrayMoveFromTo', () => {
  const arr = [0, 1, 2, 3, 4, 5, 6]
  const myArray = [10, 20, 30, 40, 50]

  // Move element at index 0 (10) to index 2
  expect(arrayMoveElement([...myArray], 0, 2)).toStrictEqual([
    20, 30, 10, 40, 50,
  ])

  const anotherArray = ['a', 'b', 'c', 'd']

  // Move element at index 3 ('d') to index 1
  expect(arrayMoveElement([...anotherArray], 3, 1)).toStrictEqual([
    'a',
    'd',
    'b',
    'c',
  ])
  expect(arrayMoveElement([...arr], 1, 1)).toStrictEqual([0, 1, 2, 3, 4, 5, 6])
  expect(arrayMoveElement([...arr], 6, 6)).toStrictEqual([0, 1, 2, 3, 4, 5, 6])
  expect(arrayMoveElement([...arr], 0, 1)).toStrictEqual([1, 0, 2, 3, 4, 5, 6])
  expect(arrayMoveElement([...arr], 1, 0)).toStrictEqual([1, 0, 2, 3, 4, 5, 6])
  expect(arrayMoveElement([...arr], 2, 0)).toStrictEqual([2, 0, 1, 3, 4, 5, 6])

  expect(arrayMoveElement([...arr], 5, 2)).toStrictEqual([0, 1, 5, 2, 3, 4, 6])
  expect(arrayMoveElement([...arr], 0, 6)).toStrictEqual([1, 2, 3, 4, 5, 6, 0])
  expect(arrayMoveElement([...arr], 6, 0)).toStrictEqual([6, 0, 1, 2, 3, 4, 5])

  expect(() => arrayMoveElement([...arr], 7, 0)).toThrow(AppException)
  expect(() => arrayMoveElement([...arr], -1, 0)).toThrow(AppException)
})

test('arrayFilterMap', () => {
  const arr: IdName<number>[] = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  const filterFunc = (item: IdName<number>) => item.id !== 2
  const mapFunc = (item: IdName<number>) => {
    const ret: IdName<number> = {
      id: item.id,
      name: item.name.toUpperCase(),
    }

    return ret
  }

  expect(arrayFilterMap(arr, mapFunc)).toStrictEqual([
    { id: 1, name: 'NAME1' },
    { id: 2, name: 'NAME2' },
    { id: 3, name: 'NAME3' },
  ])

  expect(arrayFilterMap(arr, mapFunc, filterFunc)).toStrictEqual([
    { id: 1, name: 'NAME1' },
    { id: 3, name: 'NAME3' },
  ])
})

describe(splitIntoArray.name, () => {
  test('splitIntoArray', () => {
    let aastrOrArray: StringOrStringArray = 'a,b \n, c,',
      arr = splitIntoArray(aastrOrArray)
    const replaceNonprintable = false,
      splitter = ','

    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter)
    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter, replaceNonprintable)
    expect(arr).toEqual(['a', 'b \n', ' c', ''])

    aastrOrArray = 'a'
    arr = splitIntoArray(aastrOrArray)
    expect(arr).toEqual(['a'])

    arr = splitIntoArray(aastrOrArray, splitter)
    expect(arr).toEqual(['a'])

    arr = splitIntoArray(aastrOrArray, splitter, replaceNonprintable)
    expect(arr).toEqual(['a'])

    // StrOrArray as Array
    aastrOrArray = ['a', 'b ', ' c\t\t', '']
    arr = splitIntoArray(aastrOrArray)
    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter)
    expect(arr).toEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter, replaceNonprintable)
    expect(arr).toEqual(['a', 'b ', ' c\t\t', ''])

    arr = splitIntoArray(undefined)
    expect(arr).toEqual(['undefined'])

    expect(splitIntoArray(2 as any)).toStrictEqual(['2'])
  })

  describe('splitToArrayOrStringIfOnlyOne no remove empties', () => {
    test('default', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b , c',
        trimStrings = true
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no remove empties', () => {
      const removeEmpties = false,
        splitter = ',',
        strOrArray = 'a,b   , c,',
        trimStrings = false
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c', ''])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c', ''])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })

    test('no trim strings', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b   , c',
        trimStrings = false
      let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)
      expect(arr).toEqual(['a', 'b', 'c'])

      arr = splitToArrayOrStringIfOnlyOne(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['a', 'b   ', ' c'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')

      arr = splitToArrayOrStringIfOnlyOne(
        '',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('')
    })
  })

  describe('splitToArrayOrStringIfOnlyOneToUpper no remove empties', () => {
    test('default', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b , c',
        trimStrings = true
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        'A',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no remove empties', () => {
      const removeEmpties = false,
        splitter = ',',
        strOrArray = 'a,b   , c,',
        trimStrings = false
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C', ''])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C', ''])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('A')
    })

    test('no trim strings', () => {
      const removeEmpties = true,
        splitter = ',',
        strOrArray = 'a,b   , c',
        trimStrings = false
      let arr: StringOrStringArray =
        splitToArrayOrStringIfOnlyOneToUpper(strOrArray)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties
      )
      expect(arr).toEqual(['A', 'B', 'C'])

      arr = splitToArrayOrStringIfOnlyOneToUpper(
        strOrArray,
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual(['A', 'B   ', ' C'])

      arr = splitToArrayOrStringIfOnlyOne(
        'a',
        splitter,
        removeEmpties,
        trimStrings
      )
      expect(arr).toEqual('a')
    })
  })

  test(splitToArrayOfIntegers.name, () => {
    let arr = splitToArrayOfIntegers('1,2,3,4,5,6,7,8,9,10')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers('[1,2,3,4,5,6,7,8,9,10]')

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '     [   1,2 , 3, 4,    5, 6     ,7,8,9,10    ]  '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '[        1,2 , 3, 4,    5, 6     ,7,8,9,10      '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '        1,2 , 3, 4,    5, 6     ,7,8,9,10  ]    '
    )

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})
