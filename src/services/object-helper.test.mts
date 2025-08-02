/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
import {
  FindObjectWithField,
  ObjectFindKeyAndReturnValue,
  ObjectHelper,
  ObjectMustHaveKeyAndReturnValue,
  ObjectTypesToString,
  UpdateFieldValue,
  addObjectToList,
  coalesce,
  deepCloneJson,
  deepDiffMapper,
  getNullObject,
  getObjectValue,
  isObject,
  renameProperty,
  runOnAllMembers,
  safeJsonToString,
  safeObject,
  searchObjectForArray,
} from './object-helper.mjs'
import { pluralize, plusMinus, safestr } from './string-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import { IConstructor } from '../models/types.mjs'
import { IId } from '../models/IdManager.mjs'
import { IdValueManager } from '../models/IdValueManager.mjs'
import { jest } from '@jest/globals'

describe('ObjectFindKeyAndReturnValue', () => {
  test('default', () => {
    const aobj = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
      keyToFind = 'key1',
      result = ObjectFindKeyAndReturnValue(aobj, keyToFind)

    expect(result).toBe('value1')
  })

  test('match lower and trim key', () => {
    const aobj = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
      keyToFind = 'key1',
      matchLowercaseAndTrimKey = true,
      result = ObjectFindKeyAndReturnValue(
        aobj,
        keyToFind,
        matchLowercaseAndTrimKey
      )

    expect(result).toBe('value1')
  })

  test('no keyToFind', () => {
    const aobj = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
      keyToFind = '',
      matchLowercaseAndTrimKey = false,
      result = ObjectFindKeyAndReturnValue(
        aobj,
        keyToFind,
        matchLowercaseAndTrimKey
      )

    expect(result).toBeUndefined()
  })

  test('match key case fail', () => {
    const aobj = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
      keyToFind = 'kEy1',
      matchLowercaseAndTrimKey = false,
      result = ObjectFindKeyAndReturnValue(
        aobj,
        keyToFind,
        matchLowercaseAndTrimKey
      )

    expect(result).toBeUndefined()
  })

  test('match key in object case fail', () => {
    const aobj = {
        kEy1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
      keyToFind = 'key1',
      matchLowercaseAndTrimKey = false,
      result = ObjectFindKeyAndReturnValue(
        aobj,
        keyToFind,
        matchLowercaseAndTrimKey
      )

    expect(result).toBeUndefined()
  })

  test('do not match key case', () => {
    const aobj = {
        kEY1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
      keyToFind = 'KEy1',
      matchLowercaseAndTrimKey = true,
      result = ObjectFindKeyAndReturnValue(
        aobj,
        keyToFind,
        matchLowercaseAndTrimKey
      )

    expect(result).toBe('value1')
  })
})

describe('ObjectMustHaveKeyAndReturnValue', () => {
  test('default', () => {
    const aobj = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
      keyToFind = 'key1',
      result = ObjectMustHaveKeyAndReturnValue('test', aobj, keyToFind)
    expect(result).toBe('value1')

    expect(() =>
      ObjectMustHaveKeyAndReturnValue('test', aobj, 'key4')
    ).toThrow()
  })

  test('match lower key', () => {
    const aobj = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      },
      keyToFind = 'key1',
      matchLowercaseAndTrimKey = true,
      result = ObjectMustHaveKeyAndReturnValue(
        'test',
        aobj,
        keyToFind,
        matchLowercaseAndTrimKey
      )
    expect(result).toBe('value1')

    expect(() =>
      ObjectMustHaveKeyAndReturnValue(
        'test',
        aobj,
        'key4',
        matchLowercaseAndTrimKey
      )
    ).toThrow()
  })
})

describe('ObjectTypesToString', () => {
  test('return string from array', () => {
    const ret = ObjectTypesToString(['hello', 'world'])

    expect(ret).toBe("[ 'hello', 'world', [length]: 2 ]")
  })

  test('null', () => {
    const ret = ObjectTypesToString(null)

    expect(ret).toBe('')
  })

  // Test('http fetch get good', async () => {
  //   Const url = `${CONST_AceRestBaseUrl}/Patrons/`

  //   Const retjson = {
  //     Testing: 'testing',
  //   }

  //   MockServer.use(
  //     Http.get(url, () => {
  //       // const anyIdNumber = req.url.searchParams.get('AnyIdNumber')
  //       // const siteId = req.url.searchParams.get('SiteId')

  //       Return HttpResponse.json(retjson)
  //     })
  //   )

  //   Const abc = await fetch(url)

  //   Const ret = ObjectTypesToString(abc)
  //   Expect(ret).toBe('[object Response]')
  //   Const body = await abc.json()
  //   Expect(body).toEqual(retjson)
  // })

  test('JS Error response', () => {
    const e = new Error('test error'),
      ret = ObjectTypesToString(e)
    expect(ret).toContain('Error')
    expect(ret).toContain("message: 'test error'")
  })

  // Mock HTTP objects
  class File {
    constructor(public readonly data: string, public readonly name: string) {}

    toArray() {
      return [this.data, this.name]
    }

    toObject() {
      return { data: this.data, name: this.name }
    }
  }

  class FileList {
    constructor(public readonly data: string, public readonly name: string) {}

    toArray() {
      return [this.data, this.name]
    }

    toObject() {
      return { data: this.data, name: this.name }
    }
  }

  test('File object', () => {
    const e = new File('', 'test.txt'),
      ret = ObjectTypesToString(e)
    expect(ret).toEqual("File { data: '', name: 'test.txt' }")
  })

  test('FileList object', () => {
    const e = new FileList('', 'test.txt'),
      ret = ObjectTypesToString(e)
    expect(ret).toEqual("FileList { data: '', name: 'test.txt' }")
  })

  test('Object generic', () => {
    const e = { data: '', name: 'test.txt' },
      ret = ObjectTypesToString(e)
    expect(ret).toEqual("{ data: '', name: 'test.txt' }")
  })

  test('Object with toString', () => {
    const e = {
      data: '',
      name: 'test.txt',
      toString: () => 'Custom toString',
    }
    const ret = ObjectTypesToString(e)
    expect(ret).toEqual(
      `{
  data: '',
  name: 'test.txt',
  toString: [Function: toString] { [length]: 0, [name]: 'toString' }
}`
    )
  })
})

test('UpdateFieldValue', () => {
  const obj: IId & { field: string } = {
    field: 'value',
    id: 'abc1',
  }

  expect(UpdateFieldValue(obj, 'field', 'newvalue')).toEqual({
    ...obj,
    field: 'newvalue',
  })
})

test('searchObjectForArray', () => {
  const obj: Record<string, unknown> = {
    a: 'a',
    b: 'b',
    c: 'c',
  }

  expect(searchObjectForArray(obj)).toEqual([])

  obj.anything = ['a', 'b', 'c']
  expect(searchObjectForArray(obj)).toEqual(['a', 'b', 'c'])

  obj.anythingElse = ['c', 'b', 'a']
  expect(searchObjectForArray(obj)).toEqual(['a', 'b', 'c'])

  obj.anything = 'a'
  expect(searchObjectForArray(obj)).toEqual(['c', 'b', 'a'])

  expect(searchObjectForArray(['c', 'b', 'a'])).toEqual(['c', 'b', 'a'])

  expect(searchObjectForArray('c' as unknown as object)).toEqual([])
})
test('runOnAllMembers', () => {
  expect(() =>
    runOnAllMembers(
      1 as unknown as object,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      (key: string, value: unknown) => key + value
    )
  ).toThrow('runOnAllMembers() received an empty object.')

  expect(() =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    runOnAllMembers({ a: 'a' }, null as any)
  ).toThrow('runOnAllMembers() received an empty function operator.')

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const funcToRunOnAllMembers = (key: string, value: unknown) => key + value

  expect(
    runOnAllMembers({ a: 'a', b: 'b' }, funcToRunOnAllMembers)
  ).toStrictEqual({
    a: 'aa',
    b: 'bb',
  })

  expect(
    runOnAllMembers(
      { a: 'a', b: 'b', c: undefined },
      funcToRunOnAllMembers,
      true
    )
  ).toStrictEqual({
    a: 'aa',
    b: 'bb',
    c: undefined,
  })

  expect(
    runOnAllMembers(
      { a: 'a', b: 'b', c: undefined },
      funcToRunOnAllMembers,
      false
    )
  ).toStrictEqual({
    a: 'aa',
    b: 'bb',
    c: 'cundefined',
  })
})
test('renameProperty', () => {
  let // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newKey: any = 'd',
    obj = { a: 'a', b: 'b', c: 'c' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    oldKey: any = 'a',
    retobj = { b: 'b', c: 'c', d: 'a' }

  renameProperty(obj, oldKey, newKey)
  expect(obj).toStrictEqual(retobj)

  oldKey = null
  newKey = null
  expect(() => renameProperty(obj, oldKey, newKey)).toThrow(
    'Cannot renameProperty. Invalid settings.'
  )

  oldKey = 'a'
  expect(() => renameProperty(obj, oldKey, newKey)).toThrow(
    'Cannot renameProperty. Invalid settings.'
  )

  oldKey = 'notToBeFound'
  newKey = 'd'
  expect(() => renameProperty(obj, oldKey, newKey)).toThrow(
    `Cannot renameProperty. Property: ${safestr(oldKey)} not found.`
  )

  obj = { a: 'a', b: 'b', c: 'c' }
  oldKey = 'a'
  newKey = 'd'
  retobj = { b: 'b', c: 'c', d: 'a' }
  expect(renameProperty(obj, oldKey, newKey)).toStrictEqual(retobj)
})
test('pluralize', () => {
  expect(pluralize(0)).toBe('s')
  expect(pluralize(1)).toBe('')
  expect(pluralize(2)).toBe('s')

  expect(pluralize(0, 'ab')).toBe('s')
  expect(pluralize(1, 'ab')).toBe('ab')
  expect(pluralize(2, 'ab')).toBe('s')

  expect(pluralize(0, 'activity', 'activities')).toBe('activities')
  expect(pluralize(1, 'activity', 'activities')).toBe('activity')
  expect(pluralize(2, 'activity', 'activities')).toBe('activities')
})
test('plusMinus', () => {
  expect(plusMinus(0)).toBe('')
  expect(plusMinus(1)).toBe('+')
  expect(plusMinus(-1)).toBe('-')
})

test('safeObject', () => {
  expect(safeObject()).toStrictEqual({})
  expect(safeObject({ a: 1 })).toStrictEqual({ a: 1 })
  expect(safeObject(undefined, { a: 1 })).toStrictEqual({ a: 1 })
})

test('safeJsonToString', () => {
  expect(safeJsonToString({ a: 'a' })).toBe('{"a":"a"}')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(safeJsonToString(4 as any)).toBe('{}')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(safeJsonToString(undefined as any)).toBe('{}')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(safeJsonToString(null as any)).toBe('{}')

  // Circular reference so JSON.stringify will fail
  const obj: Record<string, unknown> = {}
  obj.a = { b: obj }
  expect(safeJsonToString(obj)).toBe('')

  console.log = jest.fn()

  expect(safeJsonToString(obj, 'functionName:')).toBe('')
  expect(console.log).toHaveBeenCalledTimes(1)
})

test('getNullObject', () => {
  expect(getNullObject({})).toBeNull()
  expect(getNullObject({ a: 'a' })).toStrictEqual({ a: 'a' })
})
test('isObject', () => {
  expect(isObject({})).toBe(true)
  expect(isObject([])).toBe(false)
  expect(isObject(1)).toBe(false)
  expect(isObject('')).toBe(false)

  expect(isObject({}, 1)).toBe(false)
  expect(isObject({ a: 'a' }, -1)).toBe(true)
  expect(isObject({ a: 'a' }, 0)).toBe(true)
  expect(isObject({ a: 'a' }, 1)).toBe(true)
  expect(isObject({ a: 'a' }, 'a')).toBe(true)
  expect(isObject({ a: 'a' }, 'b')).toBe(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  expect(isObject({ a: 'a' }, new Date() as any)).toBe(true)
})
test('getObjectValue', () => {
  expect(getObjectValue({ a: 'a' }, 'a')).toBe('a')
  expect(getObjectValue({ a: 'a' }, 'b')).toBeUndefined()
})

describe('deepCloneJson empty JSON.parse', () => {
  let originalParse
  beforeEach(() => {
    // Store the original JSON.parse to restore it later
    originalParse = JSON.parse
  })

  afterEach(() => {
    // Restore JSON.parse after each test to prevent interference
    JSON.parse = originalParse
  })

  test('deepCloneJson', () => {
    JSON.parse = jest.fn(() => null)
    // console.log('deepCloneJson', safestrToJson('{"a": "a"}'))
    expect(() => deepCloneJson({ a: 'a' })).toThrow(AppException)

    expect(() => deepCloneJson({})).toThrow(AppException)
    expect(() => deepCloneJson([])).toThrow(AppException)

    expect(() => deepCloneJson(undefined as unknown as object)).toThrow(
      AppException
    )
    expect(() => deepCloneJson(null as unknown as object)).toThrow(AppException)
  })
})

test('deepCloneJson', () => {
  expect(deepCloneJson({ a: 'a' })).toStrictEqual({ a: 'a' })

  expect(deepCloneJson({})).toStrictEqual({})
  expect(deepCloneJson([])).toStrictEqual([])

  expect(deepCloneJson(undefined as unknown as object)).toStrictEqual({})
})

test('addObjectToList', () => {
  expect(addObjectToList([], [{ a: 'a' }])).toStrictEqual([{ a: 'a' }])
  expect(addObjectToList([], [1, 2])).toStrictEqual([1, 2])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(addObjectToList(null as any, [1, 2])).toStrictEqual([1, 2])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(addObjectToList(undefined as any, [1, 2])).toStrictEqual([1, 2])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(addObjectToList([], undefined as any)).toStrictEqual([])

  expect(addObjectToList([], [0])).toStrictEqual([0])
  expect(addObjectToList([], [undefined])).toStrictEqual([])
  expect(addObjectToList([], [null])).toStrictEqual([])
})

describe('deepDiffMapper', () => {
  test('compareValues', () => {
    const aDate = new Date(),
      anum = 1,
      astr = 'a',
      bDate = new Date(aDate),
      bnum = 1,
      bstr = 'a'

    let a: Record<string, unknown> = { a: 'a' },
      b: Record<string, unknown> = { b: 'b' }

    expect(deepDiffMapper().anyChanges(a, b)).toBe(true)
    expect(deepDiffMapper().compareValues(a, b)).toStrictEqual('updated')

    expect(deepDiffMapper().compareValues(anum, bnum)).toStrictEqual(
      'unchanged'
    )
    expect(deepDiffMapper().compareValues(anum, bnum + 1)).toStrictEqual(
      'updated'
    )

    expect(deepDiffMapper().compareValues(astr, bstr)).toStrictEqual(
      'unchanged'
    )
    expect(deepDiffMapper().compareValues(astr, `${bstr}a`)).toStrictEqual(
      'updated'
    )

    expect(deepDiffMapper().compareValues(aDate, bDate)).toStrictEqual(
      'unchanged'
    )
    expect(
      deepDiffMapper().compareValues(aDate, new Date(Number(bDate) + 1))
    ).toStrictEqual('updated')

    a = { a: 'a', b: 'b' }
    b = { a: 'a', b: 'b' }
    expect(deepDiffMapper().compareValues(a, b)).toStrictEqual('updated')
  })

  test('arrays', () => {
    const a = [
        { name: 'climate', value: 90 },
        { name: 'freeSpeech', value: 80 },
        { name: 'religion', value: 81 },
      ],
      b = [
        { name: 'climate', value: 90 },
        { name: 'freeSpeech', value: 80 },
        { name: 'religion', value: 82 },
      ],
      c = [
        {
          a: { name: 'climate', value: 90 },
          b: { name: 'freeSpeech', value: 80 },
          c: { name: 'religion', value: 81 },
        },
      ],
      d = [
        {
          a: { name: 'climate', value: 90 },
          b: { name: 'freeSpeech', value: 80 },
          c: { name: 'religion', value: 83 },
        },
      ]

    expect(deepDiffMapper().anyChanges(a, b)).toBe(true)
    expect(deepDiffMapper().anyChanges(c, d)).toBe(true)
  })

  test('findTypeData', () => {
    let b: Record<string, unknown> = { b: 'b' }

    expect(deepDiffMapper().findTypeData(['a', 'a'])).toBe(false)

    expect(deepDiffMapper().findTypeData(['a', b])).toStrictEqual(false)

    b = {
      data: 'a',
      type: 'not-unchanged',
    }
    expect(deepDiffMapper().findTypeData(['a', b])).toStrictEqual(true)

    b = {
      data: 'a',
      type: 'unchanged',
    }
    expect(deepDiffMapper().findTypeData(['a', b])).toStrictEqual(false)

    const ddm = deepDiffMapper()
    expect(ddm.findTypeData(['a', ddm])).toStrictEqual(false)

    expect(
      ddm.findTypeData([
        'a',
        {
          data: 'a',
          type: 'changed',
        },
      ])
    ).toStrictEqual(true)
  })

  test('getChanges', () => {
    const a: Record<string, unknown> = { a: 'a' },
      aDate = new Date(),
      anum = 1,
      astr = 'a',
      b: Record<string, unknown> = { b: 'b' },
      bDate = new Date(aDate),
      bnum = 1,
      bstr = 'a'

    expect(deepDiffMapper().getChanges(anum, bnum)).toBe(false)
    expect(deepDiffMapper().getChanges(anum, bnum + 1)).toBe(true)

    expect(deepDiffMapper().getChanges(astr, bstr)).toBe(false)
    expect(deepDiffMapper().getChanges(astr, `${bstr}a`)).toBe(true)

    expect(deepDiffMapper().getChanges(aDate, bDate)).toBe(false)
    expect(
      deepDiffMapper().getChanges(aDate, new Date(Number(bDate) + 1))
    ).toBe(true)

    expect(deepDiffMapper().getChanges(a, b)).toStrictEqual([
      'a',
      { data: 'a', type: 'deleted' },
    ])
  })

  test('various tests', () => {
    let a: Record<string, unknown> = { a: 'a' },
      b: Record<string, unknown> = { b: 'b' }

    expect(deepDiffMapper().anyChanges(a, b)).toBe(true)

    b = { a: 'a' }
    expect(deepDiffMapper().anyChanges(a, b)).toBe(false)

    a = { a: 'a', b: 'b' }
    b = { a: 'a', b: 'b' }
    expect(deepDiffMapper().anyChanges(a, b)).toBe(false)

    expect(deepDiffMapper().anyChanges([a, 1, 2], [a, 1, 2])).toBe(false)
    expect(deepDiffMapper().anyChanges([a, 1, 2], [b, 1, 2, ''])).toBe(true)

    expect(deepDiffMapper().getChanges(a, b)).toBeUndefined()

    b = { a: 'a', b: 'c' }
    expect(deepDiffMapper().getChanges(a, b)).toStrictEqual([
      'b',
      { data: 'b', type: 'updated' },
    ])

    b = {}
    expect(deepDiffMapper().getChanges(a, b)).toStrictEqual([
      'a',
      { data: 'a', type: 'deleted' },
    ])

    a = { a: 'a' }
    b = { a: 'a', b: 'b' }
    expect(deepDiffMapper().getChanges(a, b)).toStrictEqual([
      'b',
      { data: 'b', type: 'created' },
    ])

    a = { a: 'a' }
    b = { a: 'a' }
    expect(deepDiffMapper().getChanges(a, b)).toBeUndefined()

    a = { a: 'a' }
    b = { a: 'a' }
    expect(() => deepDiffMapper().getChanges(() => a, b)).toThrow(
      'Invalid argument. Function given, object expected.'
    )

    a = { a: () => 'a' }
    b = { a: 'a' }
    const ddMap = deepDiffMapper().map(a, b)
    expect(ddMap).toStrictEqual({
      a: {
        data: 'a',
        type: 'created',
      },
    })
  })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createDeepObject(depth: number, value: any) {
  return {
    // eslint-disable-next-line no-param-reassign, no-useless-assignment
    item: depth > 0 ? createDeepObject(--depth, value) : value,
  }
}

test('FindObjectWithField', () => {
  const obj = {
    a: 'a',
    b: 'b',
    c: 'c',
    d: {
      e: 'e',
      f: [{ f1: 'f1' }, { f2: 'f2' }],
      g: {
        h: 'h',
        i: 'i',
        j: {
          k: 'k',
          l: 'l',
        },
      },
    },
  }

  expect(FindObjectWithField({ b: ['a'] }, 'a', 'a')).toBeUndefined()

  expect(FindObjectWithField(obj, 'a', 'a')).toBe(obj)
  expect(FindObjectWithField(obj, 'b', 'c')).toBeUndefined()
  expect(FindObjectWithField(obj, 'e', 'e')).toBe(obj.d)
  expect(FindObjectWithField(obj, 'd', 'd')).toBeUndefined()
  expect(FindObjectWithField(obj, 'j', 'k')).toBeUndefined()
  expect(FindObjectWithField(obj, 'k', 'k')).toBe(obj.d.g.j)
  expect(FindObjectWithField(obj, 'f1', 'f1')).toStrictEqual({ f1: 'f1' })

  const deepObj = createDeepObject(101, 'value')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  expect(FindObjectWithField(deepObj, 'k', 'k')).toBeUndefined()
})

test('getFirstNewWithException', () => {
  expect(() =>
    ObjectHelper.getFirstNewWithException(IdValueManager, [])
  ).not.toThrow()
  expect(() =>
    ObjectHelper.getFirstNewWithException(IdValueManager, [234, 20])
  ).toThrow(new Error('list must be an array'))

  // eslint-disable-next-line @typescript-eslint/unbound-method
  let fnOrig = ObjectHelper.getInstance
  ObjectHelper.getInstance = <T, Tid>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _theClass: IConstructor<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    ..._args: any[]
  ) => undefined as Tid as unknown as T

  expect(() =>
    ObjectHelper.getFirstNewWithException(
      IdValueManager,
      undefined as unknown as string[]
    )
  ).toThrow(new Error('Error getting first new object'))
  ObjectHelper.getInstance = fnOrig

  // eslint-disable-next-line @typescript-eslint/unbound-method
  fnOrig = ObjectHelper.getInstance
  ObjectHelper.getInstance = <T, Tid>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _theClass: IConstructor<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    ..._args: any[]
  ) => undefined as Tid as unknown as T
  expect(() =>
    ObjectHelper.getFirstNewWithException(
      IdValueManager,
      undefined as unknown as string[],
      'generic exception text'
    )
  ).toThrow(new Error('generic exception text'))
  ObjectHelper.getInstance = fnOrig

  expect(() =>
    ObjectHelper.getFirstNewWithException(IdValueManager, [
      [{ id: 234, value: '234' }],
      [{ id: 20, value: '20' }],
    ])
  ).not.toThrow()
  expect(() =>
    ObjectHelper.getFirstNewWithException(IdValueManager, [
      { id: 234, value: '234' },
      { id: 20, value: '20' },
    ])
  ).toThrow()
})

test('getNewObject', () => {
  expect(() => ObjectHelper.getNewObject(IdValueManager, [])).not.toThrow()
  expect(() => ObjectHelper.getNewObject(IdValueManager, [234, 20])).toThrow()
  expect(() =>
    ObjectHelper.getNewObject(
      IdValueManager,
      [
        { id: 234, value: '234' },
        { id: 20, value: '20' },
      ],
      1
    )
  ).not.toThrow()
  expect(() =>
    ObjectHelper.getNewObject(IdValueManager, [
      { id: 234, value: '234' },
      { id: 20, value: '20' },
    ])
  ).not.toThrow()
})

test('getInstance', () => {
  const idvm = ObjectHelper.getInstance(IdValueManager, [
    { id: 'a', value: 'a' },
  ])

  expect(idvm).toBeInstanceOf(IdValueManager)
  expect(idvm.list).toEqual([{ id: 'a', value: 'a' }])
})

describe('ObjectHelper', () => {
  test('CloneObjectAlphabetizingKeys', () => {
    const aobj = {
        a: 'a',
        b: 'b',
        c: 'c',
      },
      clonedObj = ObjectHelper.CloneObjectAlphabetizingKeys(aobj)

    expect(clonedObj).toEqual({ a: 'a', b: 'b', c: 'c' })
  })

  test('DecodeBase64ToObject', () => {
    const base64String = btoa(JSON.stringify({ a: 'a', b: 'b' })),
      decodedObj = ObjectHelper.DecodeBase64ToObject(base64String)

    expect(decodedObj).toEqual({ a: 'a', b: 'b' })
  })

  test('EncodeObjectToBase64', () => {
    const aobj = { a: 'a', b: 'b' },
      encodedString = ObjectHelper.EncodeObjectToBase64(aobj)

    expect(encodedString).toBe(btoa(JSON.stringify(aobj)))
  })

  test('DeepCloneJsonWithUndefined', () => {
    const aobj = {
        a: 'a',
        b: undefined,
        c: {
          d: 'd',
          e: undefined,
        },
      },
      clonedObj = ObjectHelper.DeepCloneJsonWithUndefined(aobj)

    expect(clonedObj).toEqual({
      a: 'a',
      b: undefined,
      c: {
        d: 'd',
        e: undefined,
      },
    })
  })
  test('DeepCloneJsonWithUndefined exception', () => {
    const aobj = {
        a: 'a',
        b: undefined,
        c: {
          d: 'd',
          e: undefined,
        },
      },
      clonedObj = ObjectHelper.DeepCloneJsonWithUndefined(aobj)

    expect(clonedObj).toEqual({
      a: 'a',
      b: undefined,
      c: {
        d: 'd',
        e: undefined,
      },
    })
  })
})

test('coalesce', () => {
  expect(coalesce(undefined, null, 'value')).toBe('value')
  expect(coalesce(undefined, null, () => 'value')).toBe('value')
  expect(
    coalesce(
      undefined,
      () => undefined,
      () => 'value'
    )
  ).toBe('value')
  expect(coalesce(undefined, null, '')).toBe('')
  expect(coalesce(undefined, null, 0)).toBe(0)
  expect(coalesce(undefined, null, false)).toBe(false)
  expect(coalesce(undefined, null, true)).toBe(true)
  expect(coalesce(undefined, null, { a: 'a' })).toEqual({ a: 'a' })
  expect(coalesce(undefined, null, ['a', 'b'])).toEqual(['a', 'b'])
  expect(coalesce(undefined, null, new Date())).toBeInstanceOf(Date)
  expect(coalesce(undefined, null, new Map([['key', 'value']]))).toEqual(
    new Map([['key', 'value']])
  )

  expect(coalesce(undefined, null, new Set(['a', 'b']))).toEqual(
    new Set(['a', 'b'])
  )

  expect(coalesce(undefined, null, new Error('error'))).toBeInstanceOf(Error)
  expect(coalesce(undefined, null, /test/u)).toBeInstanceOf(RegExp)
  expect(coalesce(undefined, null, BigInt(123))).toBe(123n)
  expect(coalesce(undefined, null, new Uint8Array([1, 2, 3]))).toEqual(
    new Uint8Array([1, 2, 3])
  )
  expect(coalesce(undefined, null, new ArrayBuffer(8))).toBeInstanceOf(
    ArrayBuffer
  )
})
