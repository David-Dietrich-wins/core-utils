/* eslint-disable jest/no-conditional-in-test */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  type ArrayOrSingle,
  type StringOrStringArray,
} from '../models/types.mjs'
import { type IIdName, type IIdNameValue, IdName } from '../models/id-name.mjs'
import {
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
  arrayFindIndexOf,
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
  mapINamesToNames,
  safeArray,
  safeArrayUnique,
  shuffleArray,
  splitIntoArray,
  splitToArray,
  splitToArrayOfIntegers,
  splitToArrayOfNumbers,
  splitToArrayOrStringIfOnlyOne,
  splitToArrayOrStringIfOnlyOneToUpper,
  toIIdNameArray,
  toSafeArray,
  toSafeArray2d,
} from './array-helper.mjs'
import { describe, expect, it } from '@jest/globals'
import { AppException } from '../models/AppException.mjs'

function get3IIdNames(): IIdName<number>[] {
  return [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]
}

describe('safeArray', () => {
  it('good', () => {
    expect.assertions(4)

    expect(safeArray()).toStrictEqual([])
    expect(safeArray(1)).toStrictEqual([1])
    expect(safeArray([1])).toStrictEqual([1])
    expect(safeArray(undefined, [1])).toStrictEqual([1])
  })

  it('safeArrayUnique', () => {
    expect.assertions(5)

    expect(safeArrayUnique()).toStrictEqual([])
    expect(safeArrayUnique(1)).toStrictEqual([1])
    expect(safeArrayUnique([1])).toStrictEqual([1])
    expect(safeArrayUnique(undefined, [1])).toStrictEqual([1])

    expect(safeArrayUnique([1, 2, 3, 1, 2])).toStrictEqual([1, 2, 3])
  })
})

describe('addObjectToList', () => {
  it('good', () => {
    expect.assertions(6)

    expect(addObjectToList([], [{ a: 'a' }])).toStrictEqual([{ a: 'a' }])
    expect(addObjectToList([], [1, 2])).toStrictEqual([1, 2])
    expect(addObjectToList(null as any, [1, 2])).toStrictEqual([1, 2])
    expect(addObjectToList(undefined as any, [1, 2])).toStrictEqual([1, 2])
    expect(addObjectToList(undefined as any, [1, undefined, 3])).toStrictEqual([
      1, 3,
    ])
    expect(addObjectToList([], undefined as any)).toStrictEqual([])
  })
})

describe('getObject', () => {
  it('good', () => {
    expect.assertions(10)

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
})

describe('isArray', () => {
  it('good', () => {
    expect.assertions(10)

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
})

describe('getters', () => {
  it('good', () => {
    expect.assertions(2)

    const arr: IdName<number>[] = [
      new IdName(1, 'name1'),
      new IdName(2, 'name2'),
    ]

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

  it('arrayGetIdNames', () => {
    expect.assertions(2)

    const arr: IdName<number>[] = [
      new IdName(1, 'name1'),
      new IdName(2, 'name2'),
    ]

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

  it('arrayGetNames', () => {
    expect.assertions(2)

    const arr: IdName<number>[] = [
      new IdName(1, 'name1'),
      new IdName(2, 'name2'),
    ]

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
})

describe('finders', () => {
  it('arrayFindById', () => {
    expect.assertions(4)

    const arr = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
    ]

    expect(arrayFindById(arr, 2)).toStrictEqual({ id: 2, name: 'name2' })

    expect(arrayFindById()).toBeUndefined()
    expect(arrayFindById(arr)).toBeUndefined()

    expect(arrayFindById(arr, 1)).toStrictEqual({ id: 1, name: 'name1' })
  })

  it('arrayFindByIds', () => {
    expect.assertions(4)

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

  it('arrayFindByNotIds', () => {
    expect.assertions(4)

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

  it('arrayFindNameById', () => {
    expect.assertions(4)

    const arr = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
    ]

    expect(arrayFindNameById(arr, 2)).toBe('name2')

    expect(arrayFindNameById()).toBeUndefined()
    expect(arrayFindNameById(arr)).toBeUndefined()

    expect(arrayFindNameById(arr, 1)).toBe('name1')
  })

  it('arrayMustFind', () => {
    expect.assertions(3)

    const arr = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
    ]

    expect(arrayMustFind(arr, 2)).toStrictEqual({ id: 2, name: 'name2' })
    expect(arrayMustFind(arr, 1)).toStrictEqual({ id: 1, name: 'name1' })

    expect(() => arrayMustFind(arr, 4)).toThrow(
      new AppException('Unable to find arrayFindById id: 4.')
    )
  })

  it('arrayFindByName', () => {
    expect.assertions(5)

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

  it('arrayMustFindByName', () => {
    expect.assertions(3)

    const arr = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
    ]

    expect(() => arrayMustFindByName(arr, 'hello')).toThrow(
      new AppException('Unable to find arrayMustFindFunc name: hello.')
    )

    expect(arrayMustFindByName(arr, 'name1')).toStrictEqual(arr[0])
    expect(arrayMustFindByName(arr, 'name2')).toStrictEqual(arr[1])
  })

  it('arrayFilter', () => {
    expect.assertions(3)

    const arr = [
        { id: 1, name: 'name1' },
        { id: 2, name: 'name2' },
        { id: 3, name: 'name3' },
      ],
      filterFunc = (item: IdName<number>) => item.id === 1

    expect(arrayFilter([], filterFunc)).toStrictEqual([])
    expect(arrayFilter(undefined, filterFunc)).toStrictEqual([])
    expect(arrayFilter(arr, filterFunc)).toStrictEqual([arr[0]])
  })

  it('arrayFind', () => {
    expect.assertions(3)

    const arr = [
        { id: 1, name: 'name1' },
        { id: 2, name: 'name2' },
        { id: 3, name: 'name3' },
      ],
      filterFunc = (item: IdName<number>) => item.id === 1

    expect(arrayFind([], filterFunc)).toBeUndefined()
    expect(arrayFind(undefined, filterFunc)).toBeUndefined()
    expect(arrayFind(arr, filterFunc)).toStrictEqual(arr[0])
  })

  it('arrayMustFindFunc', () => {
    expect.assertions(2)

    const arr = [
        { id: 1, name: 'name1' },
        { id: 2, name: 'name2' },
        { id: 3, name: 'name3' },
      ],
      filterFunc = (item: IdName<number>) => item.id === 1

    expect(() => arrayMustFindFunc([], filterFunc)).toThrow(
      'Unable to find arrayMustFindFunc.'
    )
    expect(arrayMustFindFunc(arr, filterFunc)).toStrictEqual(arr[0])
  })

  it('arrayFindIndexOf', () => {
    expect.assertions(3)

    const arr = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
      { id: 3, name: 'name3' },
    ]

    expect(arrayFindIndexOf(arr, 2)).toBe(1)
    expect(arrayFindIndexOf(arr, 4)).toBeUndefined()
    expect(arrayFindIndexOf(arr)).toBeUndefined()
  })
})

describe('converters', () => {
  it('arrayOfIds', () => {
    expect.assertions(6)

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

    arr[1].id = undefined as any

    expect(arrayOfIds(arr)).toStrictEqual([1, 3])

    arr.push(undefined as any)

    expect(arrayOfIds(arr)).toStrictEqual([1, 3])
  })

  it('arrayOfNames', () => {
    expect.assertions(3)

    const arr = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
      { id: 3, name: 'name3' },
    ]

    expect(arrayOfNames([])).toStrictEqual([])
    expect(arrayOfNames(undefined)).toStrictEqual([])
    expect(arrayOfNames(arr)).toStrictEqual(['name1', 'name2', 'name3'])
  })

  it('arrayElement', () => {
    expect.assertions(8)

    expect(arrayElement(undefined)).toBeUndefined()
    expect(arrayElement(null)).toBeUndefined()
    expect(arrayElement({})).toStrictEqual({})
    expect(arrayElement({ a: 'a' })).toStrictEqual({ a: 'a' })

    expect(arrayElement(['a', 'b'], 0)).toBe('a')
    expect(arrayElement(['a', 'b'], 1)).toBe('b')
    expect(arrayElement(['a', 'b'], -1)).toBe('b')
    expect(arrayElement(['a', 'b'], 2)).toBeUndefined()
  })

  it('arrayElementNonEmpty', () => {
    expect.assertions(4)

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

  it('arrayFirst and arrayLast', () => {
    expect.assertions(4)

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

  it('arrayFirstNonEmpty', () => {
    expect.assertions(4)

    const fname = arrayFirstNonEmpty.name

    expect(() => arrayFirstNonEmpty()).toThrow(
      new AppException('Array has no items.')
    )
    expect(() => arrayFirstNonEmpty([])).toThrow(
      new AppException('Array has no items.')
    )
    expect(() => arrayFirstNonEmpty([], fname)).toThrow(
      new AppException('Array has no items.')
    )
    expect(() => arrayFirstNonEmpty([], fname, 'my custom message')).toThrow(
      new AppException('Array has no items.')
    )
  })

  it('arrayLastNonEmpty', () => {
    expect.assertions(6)

    const fname = arrayLastNonEmpty.name,
      zarr = [
        { id: 1, name: 'name1' },
        { id: 2, name: 'name2' },
        { id: 3, name: 'name3' },
      ]

    expect(() => arrayLastNonEmpty()).toThrow(
      new AppException('Array has no items.')
    )
    expect(() => arrayLastNonEmpty([])).toThrow(
      new AppException('Array has no items.')
    )
    expect(() => arrayLastNonEmpty([], fname)).toThrow(
      new AppException('Array has no items.')
    )
    expect(() => arrayLastNonEmpty([], fname, 'my custom message')).toThrow(
      new AppException('Array has no items.')
    )

    expect(arrayFirstNonEmpty(zarr)).toStrictEqual(zarr[0])
    expect(arrayLastNonEmpty(zarr)).toStrictEqual(zarr[2])
  })

  it('arrayForEachReturns', () => {
    expect.assertions(1)

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

  it('toSafeArray', () => {
    expect.assertions(3)

    expect(toSafeArray(undefined)).toStrictEqual([])
    expect(toSafeArray([])).toStrictEqual([])
    expect(toSafeArray({ x: 1 })).toStrictEqual([{ x: 1 }])
  })

  it('toSafeArray2d', () => {
    expect.assertions(4)

    expect(toSafeArray2d(undefined)).toStrictEqual([])
    expect(toSafeArray2d([])).toStrictEqual([])
    expect(toSafeArray2d({ x: 1 })).toStrictEqual([{ x: 1 }])
    expect(toSafeArray2d([{ x: 1 }])).toStrictEqual([[{ x: 1 }]])
  })

  it('arrayRemoveById', () => {
    expect.assertions(2)

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

  it('arrayUnique', () => {
    expect.assertions(2)

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

  it('arrayAdd', () => {
    expect.assertions(3)

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

  it('arrayRemove', () => {
    expect.assertions(1)

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

  it('arrayUpdateOrAdd', () => {
    expect.assertions(5)

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

  it('toIIdNameArray', () => {
    expect.assertions(3)

    const arr: IIdNameValue[] = [
        { id: '1', name: 'name1', value: 'value1' },
        { id: '2', name: 'name2', value: 'value2' },
        { id: '3', name: 'name3', value: 'value3' },
      ],
      arrString = ['2', '4', '6']

    expect(toIIdNameArray(arr)).toStrictEqual(arr)
    expect(toIIdNameArray(undefined)).toStrictEqual([])
    expect(toIIdNameArray(arrString)).toStrictEqual([
      { id: '2', name: '2' },
      { id: '4', name: '4' },
      { id: '6', name: '6' },
    ])
  })

  it('mapINamesToNames', () => {
    expect.assertions(2)

    const arr: IIdNameValue[] = [
      { id: '1', name: 'name1', value: 'value1' },
      { id: '2', name: 'name2', value: 'value2' },
      { id: '3', name: 'name3', value: 'value3' },
    ]

    expect(mapINamesToNames(arr)).toStrictEqual(['name1', 'name2', 'name3'])
    expect(mapINamesToNames(undefined)).toStrictEqual([])
  })

  it('arrayReduceArrayReturns', () => {
    expect.assertions(3)

    const arr: IIdName<number>[] = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
      { id: 3, name: 'name3' },
    ]

    let funcReturns: (_item: IIdName<number>) => ArrayOrSingle<IIdName<number>>
    funcReturns = (item: IIdName<number>) => {
      item.id = 4
      return item
    }

    expect(arrayReduceArrayReturns(undefined, funcReturns)).toStrictEqual([])

    // eslint-disable-next-line one-var
    let result = arrayReduceArrayReturns(arr, funcReturns)

    expect(result).toStrictEqual(arr)

    funcReturns = (item: IIdName<number>) => {
      const arrItem = [item]
      arrItem.push(item)

      return arrItem
    }

    result = arrayReduceArrayReturns(arr, funcReturns)

    // eslint-disable-next-line one-var
    const expected = [arr[0], arr[0], arr[1], arr[1], arr[2], arr[2]]

    expect(result).toStrictEqual(expected)
  })

  it('arraySwapItemsById', () => {
    expect.assertions(6)

    let arr = get3IIdNames()

    expect(() => arraySwapItemsById(arr, 1, 4)).toThrow(
      new AppException(
        'Invalid destination index of 4 when swapping array elements.'
      )
    )

    arr = get3IIdNames()

    expect(() => arraySwapItemsById(arr, -1, 0)).toThrow(
      new AppException('Invalid source id of -1 when swapping array elements.')
    )

    arr = get3IIdNames()

    expect(arraySwapItemsById(arr, 0, 0)).toBeDefined()

    arr = get3IIdNames()

    expect(() => arraySwapItemsById(arr, 1, 0)).toThrow(
      new AppException(
        'Invalid destination index of 0 when swapping array elements.'
      )
    )

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

  it('arraySwapItems', () => {
    expect.assertions(7)

    let arr = get3IIdNames()

    expect(() => arraySwapItems(arr, 1, 4)).toThrow(
      new AppException(
        'Invalid destination index of 4 when swapping array elements.'
      )
    )

    arr = get3IIdNames()

    expect(() => arraySwapItems(arr, -1, 0)).toThrow(
      new AppException(
        'Invalid source index of -1 when swapping array elements.'
      )
    )

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

  it('shuffleArray', () => {
    expect.assertions(2)

    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    let shuffled = shuffleArray(arr)

    expect(shuffled).not.toStrictEqual(arr)

    shuffled = shuffleArray(arr, 2)

    expect(shuffled).toHaveLength(2)
  })

  it('arrayMoveFromTo', () => {
    expect.assertions(12)

    const anotherArray = ['a', 'b', 'c', 'd'],
      arr = [0, 1, 2, 3, 4, 5, 6],
      myArray = [10, 20, 30, 40, 50]

    // Move element at index 0 (10) to index 2
    expect(arrayMoveElement([...myArray], 0, 2)).toStrictEqual([
      20, 30, 10, 40, 50,
    ])

    // Move element at index 3 ('d') to index 1
    expect(arrayMoveElement([...anotherArray], 3, 1)).toStrictEqual([
      'a',
      'd',
      'b',
      'c',
    ])
    expect(arrayMoveElement([...arr], 1, 1)).toStrictEqual([
      0, 1, 2, 3, 4, 5, 6,
    ])
    expect(arrayMoveElement([...arr], 6, 6)).toStrictEqual([
      0, 1, 2, 3, 4, 5, 6,
    ])
    expect(arrayMoveElement([...arr], 0, 1)).toStrictEqual([
      1, 0, 2, 3, 4, 5, 6,
    ])
    expect(arrayMoveElement([...arr], 1, 0)).toStrictEqual([
      1, 0, 2, 3, 4, 5, 6,
    ])
    expect(arrayMoveElement([...arr], 2, 0)).toStrictEqual([
      2, 0, 1, 3, 4, 5, 6,
    ])

    expect(arrayMoveElement([...arr], 5, 2)).toStrictEqual([
      0, 1, 5, 2, 3, 4, 6,
    ])
    expect(arrayMoveElement([...arr], 0, 6)).toStrictEqual([
      1, 2, 3, 4, 5, 6, 0,
    ])
    expect(arrayMoveElement([...arr], 6, 0)).toStrictEqual([
      6, 0, 1, 2, 3, 4, 5,
    ])

    expect(() => arrayMoveElement([...arr], 7, 0)).toThrow(AppException)
    expect(() => arrayMoveElement([...arr], -1, 0)).toThrow(AppException)
  })

  it('arrayFilterMap', () => {
    expect.assertions(2)

    const arr: IdName<number>[] = [
        { id: 1, name: 'name1' },
        { id: 2, name: 'name2' },
        { id: 3, name: 'name3' },
      ],
      filterFunc = (item: IdName<number>) => item.id !== 2,
      mapFunc = (item: IdName<number>) => {
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
})

describe(`${splitToArray.name} types`, () => {
  it('good', () => {
    expect.assertions(14)

    const removeEmpties = true,
      splitter = ',',
      trimStrings = true

    let arr: StringOrStringArray = 'a,b , c,',
      arrSplit = splitToArray(arr)

    expect(arrSplit).toStrictEqual(['a', 'b', 'c'])

    arrSplit = splitToArray(arr, splitter)

    expect(arrSplit).toStrictEqual(['a', 'b', 'c'])

    arrSplit = splitToArray(arr, splitter, removeEmpties)

    expect(arrSplit).toStrictEqual(['a', 'b', 'c'])

    arrSplit = splitToArray(arr, splitter, removeEmpties, trimStrings)

    expect(arrSplit).toStrictEqual(['a', 'b', 'c'])

    arr = 'a'
    arrSplit = splitToArray(arr)

    expect(arrSplit).toStrictEqual(['a'])

    arrSplit = splitToArray(arr, splitter)

    expect(arrSplit).toStrictEqual(['a'])

    arrSplit = splitToArray(arr, splitter, removeEmpties)

    expect(arrSplit).toStrictEqual(['a'])

    arrSplit = splitToArray(arr, splitter, removeEmpties, trimStrings)

    expect(arrSplit).toStrictEqual(['a'])

    // strOrArray as Array
    arr = ['a', 'b ', ' c', '']
    arrSplit = splitToArray(arr)

    expect(arrSplit).toStrictEqual(['a', 'b', 'c'])

    arrSplit = splitToArray(arr, splitter)

    expect(arrSplit).toStrictEqual(['a', 'b', 'c'])

    arrSplit = splitToArray(arr, splitter, removeEmpties)

    expect(arrSplit).toStrictEqual(['a', 'b', 'c'])

    arrSplit = splitToArray(arr, splitter, removeEmpties, trimStrings)

    expect(arrSplit).toStrictEqual(['a', 'b', 'c'])

    arrSplit = splitToArray(undefined)

    expect(arrSplit).toStrictEqual([])

    expect(splitToArray(2 as any)).toStrictEqual(['2'])
  })
})

describe('splitToArrayOrStringIfOnlyOne', () => {
  it('default', () => {
    expect.assertions(5)

    const removeEmpties = true,
      splitter = ',',
      strOrArray = 'a,b , c',
      trimStrings = true

    let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)

    expect(arr).toStrictEqual(['a', 'b', 'c'])

    arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)

    expect(arr).toStrictEqual(['a', 'b', 'c'])

    arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)

    expect(arr).toStrictEqual(['a', 'b', 'c'])

    arr = splitToArrayOrStringIfOnlyOne(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toStrictEqual(['a', 'b', 'c'])

    arr = splitToArrayOrStringIfOnlyOne(
      'a',
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toBe('a')
  })

  it('no remove empties', () => {
    expect.assertions(5)

    const removeEmpties = false,
      splitter = ',',
      strOrArray = 'a,b   , c,',
      trimStrings = false

    let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)

    expect(arr).toStrictEqual(['a', 'b', 'c'])

    arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)

    expect(arr).toStrictEqual(['a', 'b', 'c'])

    arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)

    expect(arr).toStrictEqual(['a', 'b', 'c', ''])

    arr = splitToArrayOrStringIfOnlyOne(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toStrictEqual(['a', 'b   ', ' c', ''])

    arr = splitToArrayOrStringIfOnlyOne(
      'a',
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toBe('a')
  })

  it('no trim strings', () => {
    expect.assertions(6)

    const removeEmpties = true,
      splitter = ',',
      strOrArray = 'a,b   , c',
      trimStrings = false

    let arr: StringOrStringArray = splitToArrayOrStringIfOnlyOne(strOrArray)

    expect(arr).toStrictEqual(['a', 'b', 'c'])

    arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter)

    expect(arr).toStrictEqual(['a', 'b', 'c'])

    arr = splitToArrayOrStringIfOnlyOne(strOrArray, splitter, removeEmpties)

    expect(arr).toStrictEqual(['a', 'b', 'c'])

    arr = splitToArrayOrStringIfOnlyOne(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toStrictEqual(['a', 'b   ', ' c'])

    arr = splitToArrayOrStringIfOnlyOne(
      'a',
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toBe('a')

    arr = splitToArrayOrStringIfOnlyOne(
      '',
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toBe('')
  })
})

describe('splitters', () => {
  it('default', () => {
    expect.assertions(5)

    const removeEmpties = true,
      splitter = ',',
      strOrArray = 'a,b , c',
      trimStrings = true

    let arr: StringOrStringArray =
      splitToArrayOrStringIfOnlyOneToUpper(strOrArray)

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(
      strOrArray,
      splitter,
      removeEmpties
    )

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(
      'A',
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toBe('A')
  })

  it('no remove empties', () => {
    expect.assertions(5)

    const removeEmpties = false,
      splitter = ',',
      strOrArray = 'a,b   , c,',
      trimStrings = false

    let arr: StringOrStringArray =
      splitToArrayOrStringIfOnlyOneToUpper(strOrArray)

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(
      strOrArray,
      splitter,
      removeEmpties
    )

    expect(arr).toStrictEqual(['A', 'B', 'C', ''])

    arr = splitToArrayOrStringIfOnlyOneToUpper(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toStrictEqual(['A', 'B   ', ' C', ''])

    arr = splitToArrayOrStringIfOnlyOneToUpper(
      'a',
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toBe('A')
  })

  it('no trim strings', () => {
    expect.assertions(5)

    const removeEmpties = true,
      splitter = ',',
      strOrArray = 'a,b   , c',
      trimStrings = false

    let arr: StringOrStringArray =
      splitToArrayOrStringIfOnlyOneToUpper(strOrArray)

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(
      strOrArray,
      splitter,
      removeEmpties
    )

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toStrictEqual(['A', 'B   ', ' C'])

    arr = splitToArrayOrStringIfOnlyOne(
      'a',
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toBe('a')
  })

  it('splitToArrayOfIntegers', () => {
    expect.assertions(5)

    let arr = splitToArrayOfIntegers('1,2,3,4,5,6,7,8,9,10')

    expect(arr).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers('[1,2,3,4,5,6,7,8,9,10]')

    expect(arr).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '     [   1,2 , 3, 4,    5, 6     ,7,8,9,10    ]  '
    )

    expect(arr).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '[        1,2 , 3, 4,    5, 6     ,7,8,9,10      '
    )

    expect(arr).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfIntegers(
      '        1,2 , 3, 4,    5, 6     ,7,8,9,10  ]    '
    )

    expect(arr).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('splitToArrayOfNumbers', () => {
    expect.assertions(5)

    let arr = splitToArrayOfNumbers('1.1,2,3,4,5,6,7.3487,8,9,10')

    expect(arr).toStrictEqual([1.1, 2, 3, 4, 5, 6, 7.3487, 8, 9, 10])

    arr = splitToArrayOfNumbers('[1,2,3.14,4,5.689421,6,7,8,9,10]')

    expect(arr).toStrictEqual([1, 2, 3.14, 4, 5.689421, 6, 7, 8, 9, 10])

    arr = splitToArrayOfNumbers(
      '     [   1,2 , 3, 4,    5.222233, 6     ,7,8,9,10    ]  '
    )

    expect(arr).toStrictEqual([1, 2, 3, 4, 5.222233, 6, 7, 8, 9, 10])

    arr = splitToArrayOfNumbers(
      '[   0.12,     1,2 , 3.43445, 4,    5, 6     ,7,8,9,10      '
    )

    expect(arr).toStrictEqual([0.12, 1, 2, 3.43445, 4, 5, 6, 7, 8, 9, 10])

    arr = splitToArrayOfNumbers(
      '        1,2.2201 , 3.14, 4,    5, 6     ,7,8,9.87,10, 0.2287  ]    '
    )

    expect(arr).toStrictEqual([
      1, 2.2201, 3.14, 4, 5, 6, 7, 8, 9.87, 10, 0.2287,
    ])
  })

  it('splitIntoArray', () => {
    expect.assertions(11)

    let aastrOrArray: StringOrStringArray = 'a,b \n, c,',
      arr = splitIntoArray(aastrOrArray)
    const replaceNonprintable = false,
      splitter = ','

    expect(arr).toStrictEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter)

    expect(arr).toStrictEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter, replaceNonprintable)

    expect(arr).toStrictEqual(['a', 'b \n', ' c', ''])

    aastrOrArray = 'a'
    arr = splitIntoArray(aastrOrArray)

    expect(arr).toStrictEqual(['a'])

    arr = splitIntoArray(aastrOrArray, splitter)

    expect(arr).toStrictEqual(['a'])

    arr = splitIntoArray(aastrOrArray, splitter, replaceNonprintable)

    expect(arr).toStrictEqual(['a'])

    // StrOrArray as Array
    aastrOrArray = ['a', 'b ', ' c\t\t', '']
    arr = splitIntoArray(aastrOrArray)

    expect(arr).toStrictEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter)

    expect(arr).toStrictEqual(['a', 'b ', ' c', ''])

    arr = splitIntoArray(aastrOrArray, splitter, replaceNonprintable)

    expect(arr).toStrictEqual(['a', 'b ', ' c\t\t', ''])

    arr = splitIntoArray(undefined)

    expect(arr).toStrictEqual(['undefined'])

    expect(splitIntoArray(2 as any)).toStrictEqual(['2'])
  })

  it('splitToArrayOrStringIfOnlyOneToUpper', () => {
    expect.assertions(5)

    const removeEmpties = true,
      splitter = ',',
      strOrArray = 'a,b , c',
      trimStrings = true
    let arr: StringOrStringArray =
      splitToArrayOrStringIfOnlyOneToUpper(strOrArray)

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(strOrArray, splitter)

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(
      strOrArray,
      splitter,
      removeEmpties
    )

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(
      strOrArray,
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toStrictEqual(['A', 'B', 'C'])

    arr = splitToArrayOrStringIfOnlyOneToUpper(
      'A',
      splitter,
      removeEmpties,
      trimStrings
    )

    expect(arr).toBe('A')
  })
})

// i t('arrayMoveFromTo', () => {
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
