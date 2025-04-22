import { IdName, IIdName } from '../models/id-name.mjs'
import { ArrayOrSingle, StringOrStringArray } from '../models/types.mjs'
import {
  arrayElement,
  arrayElementNonEmpty,
  arrayFilter,
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
  arrayMustFind,
  arrayMustFindByName,
  arrayMustFindFunc,
  arrayOfIds,
  arrayOfNames,
  arrayReduceArrayReturns,
  arraySwapItems,
  arraySwapItemsById,
  isArray,
  safeArray,
  shuffleArray,
  splitToArray,
  splitToArrayOfIntegers,
  splitToArrayOrStringIfOnlyOne,
  splitToArrayOrStringIfOnlyOneToUpper,
  ToSafeArray,
  ToSafeArray2d,
} from './array-helper.mjs'

test('arrayGetIds', () => {
  const arr: IdName<number, string>[] = [
    new IdName(1, 'name1'),
    new IdName(2, 'name2'),
  ]

  expect(arrayGetIds(arr)).toStrictEqual([1, 2])

  expect(
    arrayGetIds(arr, (item: IdName<number, string>) => {
      if (item.id === 1) {
        return 3
      }

      return item.id
    })
  ).toStrictEqual([3, 2])
})

test('arrayGetIdNames', () => {
  const arr: IdName<number, string>[] = [
    new IdName(1, 'name1'),
    new IdName(2, 'name2'),
  ]

  expect(arrayGetIdNames(arr)).toStrictEqual([
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
  ])

  expect(
    arrayGetIdNames(arr, (item: IdName<number, string>) => {
      if (item.id === 1) {
        return new IdName(3, item.name)
      }

      return item
    })
  ).toStrictEqual([new IdName(3, 'name1'), new IdName(2, 'name2')])
})

test('arrayGetNames', () => {
  const arr: IdName<number, string>[] = [
    new IdName(1, 'name1'),
    new IdName(2, 'name2'),
  ]

  expect(arrayGetNames(arr)).toStrictEqual(['name1', 'name2'])

  expect(
    arrayGetNames<IdName<number, string>>(
      arr,
      (item: IdName<number, string>) => {
        if (item.name === 'name1') {
          return 'test-rename'
        }

        return item.name
      }
    )
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
  const filterFunc = (item: IdName<number, string>) => item.id === 1

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
  const filterFunc = (item: IdName<number, string>) => item.id === 1

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
  const filterFunc = (item: IdName<number, string>) => item.id === 1

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(arr[1] as any).id = undefined
  expect(arrayOfIds(arr)).toStrictEqual([1, 3])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

test('arrayElement', () => {
  expect(arrayElement(undefined)).toBeUndefined()
  expect(arrayElement(null)).toBeUndefined()
  expect(arrayElement({})).toStrictEqual({})
  expect(arrayElement({ a: 'a' })).toStrictEqual({ a: 'a' })

  expect(arrayElement(['a', 'b'], 0)).toBe('a')
  expect(arrayElement(['a', 'b'], 1)).toBe('b')
  expect(arrayElement(['a', 'b'], -1)).toBe('b')
  expect(arrayElement(['a', 'b'], 2)).toBeUndefined()
})

test('arrayElementNonEmpty', () => {
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

test('arrayFirstNonEmpty and arrayLastNonEmpty', () => {
  const fname = 'arrayFirstNonEmpty and arrayLastNonEmpty'

  const arr = [
    { id: 1, name: 'name1' },
    { id: 2, name: 'name2' },
    { id: 3, name: 'name3' },
  ]

  expect(() => arrayFirstNonEmpty()).toThrow()
  expect(() => arrayFirstNonEmpty([])).toThrow()
  expect(() => arrayFirstNonEmpty([], fname)).toThrow()
  expect(() => arrayFirstNonEmpty([], fname, 'my custom message')).toThrow()
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

describe('splitToArray', () => {
  test('splitToArray', () => {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => splitToArray(2 as any)).toThrow()
  })

  describe('splitToArrayOrStringIfOnlyOne no remove empties', () => {
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

  describe('splitToArrayOrStringIfOnlyOneToUpper no remove empties', () => {
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

  test('splitToArrayOfIntegers', () => {
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
test('safeArray', () => {
  expect(safeArray()).toStrictEqual([])
  expect(safeArray(1)).toStrictEqual([1])
  expect(safeArray([1])).toStrictEqual([1])
  expect(safeArray(undefined, [1])).toStrictEqual([1])
})
test('isArray', () => {
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
