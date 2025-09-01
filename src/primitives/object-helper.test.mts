/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BuildLogFriendlyMessage,
  DeepCloneJsonWithUndefined,
  FindObjectWithField,
  ObjectFindKeyAndReturnValue,
  ObjectHelper,
  ObjectMustHaveKeyAndReturnValue,
  ObjectPrepareForJson,
  ObjectTypesToString,
  UpdateFieldValue,
  coalesce,
  deepCloneJson,
  deepDiffMapper,
  getBody,
  getObjectValue,
  hasData,
  isEmptyObject,
  isObject,
  objectCloneAlphabetizingKeys,
  objectDecodeFromBase64,
  objectEncodeToBase64,
  objectGetFirstNewWithException,
  objectGetNew,
  removeFields,
  renameProperty,
  runOnAllMembers,
  safeJsonToString,
  safeObject,
  searchObjectForArray,
  sortFunction,
} from './object-helper.mjs'
import { CONST_ListMustBeAnArray, type IId } from '../models/IdManager.mjs'
import { AppException } from '../models/AppException.mjs'
import { IdValueManager } from '../models/IdValueManager.mjs'
import { jest } from '@jest/globals'
import { safestr } from './string-helper.mjs'

describe('ObjectFindKeyAndReturnValue', () => {
  test('default', () => {
    const obj = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    }

    const keyToFind = 'key1'
    let result = ObjectFindKeyAndReturnValue(obj, keyToFind)
    expect(result).toBe('value1')

    result = ObjectFindKeyAndReturnValue(obj, '')
    expect(result).toBeUndefined()
  })

  test('match lower and trim key', () => {
    const obj = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    }

    const keyToFind = 'key1'
    const matchLowercaseAndTrimKey = true
    const result = ObjectFindKeyAndReturnValue(
      obj,
      keyToFind,
      matchLowercaseAndTrimKey
    )

    expect(result).toBe('value1')
  })

  test('match key case fail', () => {
    const obj = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    }

    const keyToFind = 'kEy1'
    const matchLowercaseAndTrimKey = false
    const result = ObjectFindKeyAndReturnValue(
      obj,
      keyToFind,
      matchLowercaseAndTrimKey
    )

    expect(result).toBeUndefined()
  })

  test('match key in object case fail', () => {
    const obj = {
      kEy1: 'value1',
      key2: 'value2',
      key3: 'value3',
    }

    const keyToFind = 'key1'
    const matchLowercaseAndTrimKey = false
    const result = ObjectFindKeyAndReturnValue(
      obj,
      keyToFind,
      matchLowercaseAndTrimKey
    )

    expect(result).toBeUndefined()
  })

  test('do not match key case', () => {
    const obj = {
      kEY1: 'value1',
      key2: 'value2',
      key3: 'value3',
    }

    const keyToFind = 'KEy1'
    const matchLowercaseAndTrimKey = true
    const result = ObjectFindKeyAndReturnValue(
      obj,
      keyToFind,
      matchLowercaseAndTrimKey
    )

    expect(result).toBe('value1')
  })
})

describe('ObjectMustHaveKeyAndReturnValue', () => {
  test('default', () => {
    const obj = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    }

    const keyToFind = 'key1'

    const result = ObjectMustHaveKeyAndReturnValue('test', obj, keyToFind)
    expect(result).toBe('value1')

    expect(() => ObjectMustHaveKeyAndReturnValue('test', obj, 'key4')).toThrow()
  })

  test('match lower key', () => {
    const obj = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    }

    const keyToFind = 'key1'
    const matchLowercaseAndTrimKey = true

    const result = ObjectMustHaveKeyAndReturnValue(
      'test',
      obj,
      keyToFind,
      matchLowercaseAndTrimKey
    )
    expect(result).toBe('value1')

    expect(() =>
      ObjectMustHaveKeyAndReturnValue(
        'test',
        obj,
        'key4',
        matchLowercaseAndTrimKey
      )
    ).toThrow()
  })
})

describe(ObjectTypesToString.name, () => {
  test('return string from array', () => {
    const ret = ObjectTypesToString(['hello', 'world'])

    expect(ret).toBe('["hello","world"]')
  })

  test('null', () => {
    const ret = ObjectTypesToString(null)

    expect(ret).toBe('')
  })

  test('JS Error response', () => {
    const e = new Error('test error')

    const ret = ObjectTypesToString(e)
    expect(ret).toContain('Error')
    expect(ret).toContain('{"message":"test error","name":"Error"')
  })

  // Mock HTTP objects
  class File {
    data: string
    name: string
    constructor(data: string, name: string) {
      this.data = data
      this.name = name
    }

    toArray() {
      return [this.data, this.name]
    }

    toObject() {
      return { data: this.data, name: this.name }
    }
  }

  class FileList {
    data: string
    name: string
    constructor(data: string, name: string) {
      this.data = data
      this.name = name
    }

    toObject() {
      return { data: this.data, name: this.name }
    }
  }

  test('File object', () => {
    const e = new File('', 'test.txt')

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual('{"data":"","name":"test.txt"}')
  })

  test('FileList object', () => {
    const e = new FileList('', 'test.txt')

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual('{"data":"","name":"test.txt"}')
  })

  test('Object generic', () => {
    const e = { data: '', name: 'test.txt' }

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual('{"data":"","name":"test.txt"}')
  })
})

describe(BuildLogFriendlyMessage.name, () => {
  const componentName = 'test'
  const level = 'info'
  const regex = (suffix: string) =>
    new RegExp(
      `^\\d{4}\\/\\d{2}\\/\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}: \\[${componentName}\\] \\[${level}\\] ${suffix}$`,
      'u'
    )

  test('return string from array', () => {
    const ret = BuildLogFriendlyMessage({
      componentName,
      level,
      message: ['hello', 'world'],
    })

    expect(ret).toMatch(regex('hello world'))
  })

  test.each([null, undefined, ''])('empty: %s', (message) => {
    const ret = BuildLogFriendlyMessage({
      componentName,
      level,
      message,
    })

    expect(ret).toMatch(regex(''))
  })

  test('JS Error response', () => {
    const e = new Error('test error')

    const ret = BuildLogFriendlyMessage({
      componentName,
      level,
      message: e,
    })
    expect(ret).toContain('Error')
    expect(ret).toContain('"message":"test error"')
  })

  // Mock HTTP objects
  class File {
    data: string
    name: string

    constructor(data: string, name: string) {
      this.data = data
      this.name = name
    }

    toArray() {
      return [this.data, this.name]
    }

    toObject() {
      return { data: this.data, name: this.name }
    }
  }

  class FileList {
    readonly data: string
    readonly name: string

    constructor(data: string, name: string) {
      this.data = data
      this.name = name
    }

    toArray() {
      return [this.data, this.name]
    }

    toObject() {
      return { data: this.data, name: this.name }
    }
  }

  test('File object', () => {
    const e = new File('', 'test.txt')

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual('{"data":"","name":"test.txt"}')
  })

  test('FileList object', () => {
    const e = new FileList('', 'test.txt')

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual('{"data":"","name":"test.txt"}')
  })

  test('Object generic', () => {
    const e = { data: '', name: 'test.txt' }

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual('{"data":"","name":"test.txt"}')
  })
})

test(getObjectValue.name, () => {
  expect(getObjectValue({ a: 'a' }, 'a')).toBe('a')
  expect(getObjectValue({ a: 'a' }, 'b')).toBeUndefined()
})

test(isObject.name, () => {
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
  expect(isObject({ a: 'a' }, new Date() as any)).toBe(true)
})

test(isEmptyObject.name, () => {
  expect(isEmptyObject({})).toBe(true)
  expect(isEmptyObject({ a: 'a' })).toBe(false)
})

test('hasData', () => {
  expect(hasData(undefined)).toBe(false)
  expect(hasData(null)).toBe(false)
  expect(hasData('')).toBe(false)
  expect(hasData('a')).toBe(true)
  expect(hasData('a', 0)).toBe(false)
  expect(hasData([])).toBe(false)
  expect(hasData([], 0)).toBe(false)
  expect(hasData([], -1)).toBe(false)
  // Must be greater than 0
  expect(hasData([1], -1)).toBe(false)
  expect(hasData({})).toBe(false)
  expect(hasData({}, undefined)).toBe(false)
  expect(hasData({}, null as unknown as number)).toBe(false)
  expect(hasData({ a: -1 }, -1)).toBe(false)
  expect(hasData({ a: -1 }, 0)).toBe(false)
  expect(hasData({ a: -1 }, 1)).toBe(true)
  expect(hasData({ a: -1 }, 2)).toBe(false)
  expect(hasData(0)).toBe(false)
  expect(hasData(-1)).toBe(false)
  expect(hasData(-10, -20)).toBe(true)
  expect(hasData(1)).toBe(true)

  expect(hasData(['a'], -1)).toBe(false)
  expect(hasData(['a'], 0)).toBe(false)
  expect(hasData(['a'], 1)).toBe(true)
  expect(hasData(['a'], 2)).toBe(false)

  const myfunc = () => ['a'],
    sym = Symbol('test'),
    symbol1 = Symbol('description'),
    // eslint-disable-next-line symbol-description
    symbolUnique: unique symbol = Symbol()

  expect(hasData(myfunc, 1)).toBe(true)
  expect(hasData(myfunc, 2)).toBe(false)

  expect(hasData(23456, 23457)).toBe(false)
  expect(
    hasData(() => {
      throw new AppException('test error')
    }, 1)
  ).toBe(false)

  expect(hasData(new Date(), 0)).toBe(true)
  expect(hasData(new Date(), 1)).toBe(true)
  expect(hasData(new Date(), -1)).toBe(true)

  expect(hasData(sym, 0)).toBe(false)
  expect(hasData(sym, 1)).toBe(true)
  expect(hasData(sym, 2)).toBe(false)
  expect(hasData(symbol1)).toBe(true)
  // Symbols do not contain values for JSON serialization
  expect(hasData({ [symbol1]: 'abc' })).toBe(false)
  expect(hasData({ symbol1: 'abc' })).toBe(true)
  expect(hasData([symbol1])).toBe(true)
  // Symbols do not contain values for JSON serialization
  expect(hasData(JSON.stringify({ [symbol1]: 'abc' }))).toBe(true)
  // Symbols do not contain values for JSON serialization
  expect(hasData(JSON.parse(JSON.stringify({ [symbol1]: 'abc' })))).toBe(false)

  expect(hasData(symbolUnique)).toBe(true)
  expect(hasData([symbolUnique])).toBe(true)
  expect(hasData(Symbol('test'))).toBe(true)
  expect(hasData([Symbol('test')])).toBe(true)
  expect(hasData({ [symbolUnique]: 'abc' })).toBe(false)
  expect(hasData({ symbolUnique: 'abc' })).toBe(true)
})

test(searchObjectForArray.name, () => {
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

  expect(searchObjectForArray(3 as unknown as object)).toEqual([])
})

test(runOnAllMembers.name, () => {
  expect(() =>
    runOnAllMembers(1 as any, (key: string, value: unknown) => key + value)
  ).toThrow('runOnAllMembers() received an empty object.')

  expect(() => runOnAllMembers({ a: 'a' }, null as any)).toThrow(
    'runOnAllMembers() received an empty function operator.'
  )

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

test(renameProperty.name, () => {
  let obj = { a: 'a', b: 'b', c: 'c' }
  let retobj = { b: 'b', c: 'c', d: 'a' }
  let oldKey: any = 'a'
  let newKey: any = 'd'

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

test(ObjectPrepareForJson.name, () => {
  const obj = {
    createdAt: new Date(),
    id: 1,
    other: {
      nested: 'this should not be removed',
      secret: 'this should be removed too',
    },
    password: 'test-secret',
    pwd: 'test-secret',
    updatedAt: new Date(),
  }

  const result = ObjectPrepareForJson(obj)
  expect(result).toEqual({
    createdAt: expect.any(Date),
    id: 1,
    other: {
      nested: 'this should not be removed',
    },
    updatedAt: expect.any(Date),
  })

  expect(
    ObjectPrepareForJson({ anything: 'anything' }, 'anything')
  ).toStrictEqual({})
  expect(
    ObjectPrepareForJson(
      { anything: 'anything', something: 'something', where: 'good' },
      ['anything', 'something']
    )
  ).toStrictEqual({ where: 'good' })
  expect(ObjectPrepareForJson(undefined)).toStrictEqual({})
  expect(ObjectPrepareForJson(null)).toStrictEqual({})
  expect(ObjectPrepareForJson({})).toStrictEqual({})
})

test(safeObject.name, () => {
  expect(safeObject()).toStrictEqual({})
  expect(safeObject({ a: 1 })).toStrictEqual({ a: 1 })
  expect(safeObject(undefined, { a: 1 })).toStrictEqual({ a: 1 })
})

test(safeJsonToString.name, () => {
  expect(safeJsonToString({ a: 'a' })).toBe('{"a":"a"}')
  expect(safeJsonToString(4 as any)).toBe('[4]')
  expect(safeJsonToString(undefined as any)).toBe('[]')
  expect(safeJsonToString(null as any)).toBe('[]')

  // Circular reference so JSON.stringify will fail
  const obj: Record<string, unknown> = {}
  obj.a = { b: obj }
  expect(safeJsonToString(obj)).toBe('')

  console.log = jest.fn()

  expect(safeJsonToString(obj, 'functionName:')).toBe('')
  expect(console.log).toHaveBeenCalledTimes(1)
})

function createDeepObject(depth: number, value: any) {
  return {
    // eslint-disable-next-line no-param-reassign, no-useless-assignment
    item: depth > 0 ? createDeepObject(--depth, value) : value,
  }
}

test(FindObjectWithField.name, () => {
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

  expect(FindObjectWithField(deepObj, 'k', 'k')).toBeUndefined()
})

describe(removeFields.name, () => {
  test('remove from an object by fields array', () => {
    const obj = {
      a: 'a',
      b: 'b',
      c: 'c',
    }
    const props = {
      fields: ['b'],
      recursive: false,
    }

    removeFields(obj, props)

    expect(obj).toEqual({
      a: 'a',
      c: 'c',
    })
  })

  test('recursively remove from an object by fields array', () => {
    const obj = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: { a: 'a', b: 'b', c: 'c', d: { a: 'a', b: 'b' } },
      e: { a: 'a' },
      f: 12,
      g: { h: 'h' },
    }
    const props = {
      fields: ['b', 'e', 'h'],
      recursive: true,
    }

    removeFields(obj, props)

    expect(obj).toEqual({
      a: 'a',
      c: 'c',
      d: { a: 'a', c: 'c', d: { a: 'a' } },
      f: 12,
      g: {},
    })
  })

  test('recursively remove by fields object', () => {
    const obj = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: {
        a: 'a',
        b: 'b',
        c: 'c',
        d: { a: 'a', b: 'b' },
        e: null,
        h: undefined,
      },
      e: { a: 'a', b: '' },
      f: 12,
      g: { b: 'b', e: undefined, h: 'h' },
      h: { h: null, i: 'i', j: undefined },
      j: null,
    }
    const props = {
      fields: {
        b: { deleteIfHasData: true },
        e: {},
        h: { deleteIfUndefined: true },
        j: { deleteIfNull: true },
      },
      recursive: true,
    }

    removeFields(obj, props)

    expect(obj).toEqual({
      a: 'a',
      c: 'c',
      d: { a: 'a', c: 'c', d: { a: 'a' } },
      f: 12,
      g: { h: 'h' },
      h: { h: null, i: 'i', j: undefined },
    })
  })

  test('default id props', () => {
    const obj = {
      _id: 1,
      id: null,
      name: 'Test',
      x: {
        _id: 2,
        id: 3,
        name: 'Test X',
      },
    }

    removeFields(obj)

    expect(obj).toEqual({
      name: 'Test',
      x: {
        id: 3,
        name: 'Test X',
      },
    })
  })

  test('not an object', () => {
    const obj = 'not an object'
    const props = {
      fields: ['b', 'e', 'h'],
      recursive: true,
    }

    removeFields(obj, props)

    expect(obj).toEqual('not an object')
    expect(removeFields(6, props)).toEqual(6)
    expect(removeFields([1, 2, 3], props)).toEqual([1, 2, 3])
    expect(removeFields('string', props)).toEqual('string')
    expect(removeFields(null, props)).toBeNull()
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    expect(removeFields(undefined, props)).toBeUndefined()
    expect(removeFields(true, props)).toBe(true)
    expect(removeFields(false, props)).toBe(false)
    expect(removeFields(new Date(), props)).toBeInstanceOf(Date)
  })
})

test(UpdateFieldValue.name, () => {
  const obj: IId & { field: string } = {
    field: 'value',
    id: 'abc1',
  }

  expect(UpdateFieldValue(obj, 'field', 'newvalue')).toEqual({
    ...obj,
    field: 'newvalue',
  })
})

// test('searchObjectForArray', () => {
//   const obj: Record<string, unknown> = {
//     a: 'a',
//     b: 'b',
//     c: 'c',
//   }

//   expect(searchObjectForArray(obj)).toEqual([])

//   obj.anything = ['a', 'b', 'c']
//   expect(searchObjectForArray(obj)).toEqual(['a', 'b', 'c'])

//   obj.anythingElse = ['c', 'b', 'a']
//   expect(searchObjectForArray(obj)).toEqual(['a', 'b', 'c'])

//   obj.anything = 'a'
//   expect(searchObjectForArray(obj)).toEqual(['c', 'b', 'a'])

//   expect(searchObjectForArray(['c', 'b', 'a'])).toEqual(['c', 'b', 'a'])

//   expect(searchObjectForArray('c' as unknown as object)).toEqual([])
// })
// test('runOnAllMembers', () => {
//   expect(() =>
//     runOnAllMembers(
//       1 as unknown as object,
//       // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
//       (key: string, value: unknown) => key + value
//     )
//   ).toThrow('runOnAllMembers() received an empty object.')

//   expect(() =>
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
//     runOnAllMembers({ a: 'a' }, null as any)
//   ).toThrow('runOnAllMembers() received an empty function operator.')

//   // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
//   const funcToRunOnAllMembers = (key: string, value: unknown) => key + value

//   expect(
//     runOnAllMembers({ a: 'a', b: 'b' }, funcToRunOnAllMembers)
//   ).toStrictEqual({
//     a: 'aa',
//     b: 'bb',
//   })

//   expect(
//     runOnAllMembers(
//       { a: 'a', b: 'b', c: undefined },
//       funcToRunOnAllMembers,
//       true
//     )
//   ).toStrictEqual({
//     a: 'aa',
//     b: 'bb',
//     c: undefined,
//   })

//   expect(
//     runOnAllMembers(
//       { a: 'a', b: 'b', c: undefined },
//       funcToRunOnAllMembers,
//       false
//     )
//   ).toStrictEqual({
//     a: 'aa',
//     b: 'bb',
//     c: 'cundefined',
//   })
// })
// test('renameProperty', () => {
//   let // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     newKey: any = 'd',
//     obj = { a: 'a', b: 'b', c: 'c' },
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     oldKey: any = 'a',
//     retobj = { b: 'b', c: 'c', d: 'a' }

//   renameProperty(obj, oldKey, newKey)
//   expect(obj).toStrictEqual(retobj)

//   oldKey = null
//   newKey = null
//   expect(() => renameProperty(obj, oldKey, newKey)).toThrow(
//     'Cannot renameProperty. Invalid settings.'
//   )

//   oldKey = 'a'
//   expect(() => renameProperty(obj, oldKey, newKey)).toThrow(
//     'Cannot renameProperty. Invalid settings.'
//   )

//   oldKey = 'notToBeFound'
//   newKey = 'd'
//   expect(() => renameProperty(obj, oldKey, newKey)).toThrow(
//     `Cannot renameProperty. Property: ${safestr(oldKey)} not found.`
//   )

//   obj = { a: 'a', b: 'b', c: 'c' }
//   oldKey = 'a'
//   newKey = 'd'
//   retobj = { b: 'b', c: 'c', d: 'a' }
//   expect(renameProperty(obj, oldKey, newKey)).toStrictEqual(retobj)
// })
// test('pluralize', () => {
//   expect(pluralize(0)).toBe('s')
//   expect(pluralize(1)).toBe('')
//   expect(pluralize(2)).toBe('s')

//   expect(pluralize(0, 'ab')).toBe('s')
//   expect(pluralize(1, 'ab')).toBe('ab')
//   expect(pluralize(2, 'ab')).toBe('s')

//   expect(pluralize(0, 'activity', 'activities')).toBe('activities')
//   expect(pluralize(1, 'activity', 'activities')).toBe('activity')
//   expect(pluralize(2, 'activity', 'activities')).toBe('activities')
// })
// test('plusMinus', () => {
//   expect(plusMinus(0)).toBe('')
//   expect(plusMinus(1)).toBe('+')
//   expect(plusMinus(-1)).toBe('-')
// })

// test('safeObject', () => {
//   expect(safeObject()).toStrictEqual({})
//   expect(safeObject({ a: 1 })).toStrictEqual({ a: 1 })
//   expect(safeObject(undefined, { a: 1 })).toStrictEqual({ a: 1 })
// })

// test('safeJsonToString', () => {
//   expect(safeJsonToString({ a: 'a' })).toBe('{"a":"a"}')
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   expect(safeJsonToString(4 as any)).toBe('{}')
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   expect(safeJsonToString(undefined as any)).toBe('{}')
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   expect(safeJsonToString(null as any)).toBe('{}')

//   // Circular reference so JSON.stringify will fail
//   const obj: Record<string, unknown> = {}
//   obj.a = { b: obj }
//   expect(safeJsonToString(obj)).toBe('')

//   console.log = jest.fn()

//   expect(safeJsonToString(obj, 'functionName:')).toBe('')
//   expect(console.log).toHaveBeenCalledTimes(1)
// })

// test('isObject', () => {
//   expect(isObject({})).toBe(true)
//   expect(isObject([])).toBe(false)
//   expect(isObject(1)).toBe(false)
//   expect(isObject('')).toBe(false)

//   expect(isObject({}, 1)).toBe(false)
//   expect(isObject({ a: 'a' }, -1)).toBe(true)
//   expect(isObject({ a: 'a' }, 0)).toBe(true)
//   expect(isObject({ a: 'a' }, 1)).toBe(true)
//   expect(isObject({ a: 'a' }, 'a')).toBe(true)
//   expect(isObject({ a: 'a' }, 'b')).toBe(false)
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
//   expect(isObject({ a: 'a' }, new Date() as any)).toBe(true)
// })
// test('getObjectValue', () => {
//   expect(getObjectValue({ a: 'a' }, 'a')).toBe('a')
//   expect(getObjectValue({ a: 'a' }, 'b')).toBeUndefined()
// })

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

test(deepCloneJson.name, () => {
  expect(deepCloneJson({ a: 'a' })).toStrictEqual({ a: 'a' })

  expect(deepCloneJson({})).toStrictEqual({})
  expect(deepCloneJson([])).toStrictEqual([])

  expect(deepCloneJson(undefined as unknown as object)).toStrictEqual([])
})

// test('addObjectToList', () => {
//   expect(addObjectToList([], [{ a: 'a' }])).toStrictEqual([{ a: 'a' }])
//   expect(addObjectToList([], [1, 2])).toStrictEqual([1, 2])
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   expect(addObjectToList(null as any, [1, 2])).toStrictEqual([1, 2])
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   expect(addObjectToList(undefined as any, [1, 2])).toStrictEqual([1, 2])
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   expect(addObjectToList([], undefined as any)).toStrictEqual([])

//   expect(addObjectToList([], [0])).toStrictEqual([0])
//   expect(addObjectToList([], [undefined])).toStrictEqual([])
//   expect(addObjectToList([], [null])).toStrictEqual([])
// })

describe(deepDiffMapper.name, () => {
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

test('getFirstNewWithException', () => {
  expect(() => objectGetFirstNewWithException(IdValueManager, [])).not.toThrow()
  expect(() =>
    objectGetFirstNewWithException(IdValueManager, [234, 20])
  ).toThrow(new Error(CONST_ListMustBeAnArray))

  const fnOrig = ObjectHelper.objectGetInstance
  ObjectHelper.objectGetInstance = () => undefined as any

  expect(() =>
    objectGetFirstNewWithException(
      IdValueManager,
      undefined as unknown as string[]
    )
  ).toThrow(new Error('Error getting first new object'))

  expect(() =>
    objectGetFirstNewWithException(
      IdValueManager,
      undefined as unknown as string[],
      'generic exception text'
    )
  ).toThrow(new Error('generic exception text'))

  ObjectHelper.objectGetInstance = fnOrig

  expect(() =>
    objectGetFirstNewWithException(IdValueManager, [
      [{ id: 234, value: '234' }],
      [{ id: 20, value: '20' }],
    ])
  ).not.toThrow()
  expect(() =>
    objectGetFirstNewWithException(IdValueManager, [
      { id: 234, value: '234' },
      { id: 20, value: '20' },
    ])
  ).toThrow()
})

test('getNewObject', () => {
  expect(() => objectGetNew(IdValueManager, [])).not.toThrow()
  expect(() => objectGetNew(IdValueManager, [234, 20])).toThrow()
  expect(() =>
    objectGetNew(
      IdValueManager,
      [
        { id: 234, value: '234' },
        { id: 20, value: '20' },
      ],
      1
    )
  ).not.toThrow()
  expect(() =>
    objectGetNew(IdValueManager, [
      { id: 234, value: '234' },
      { id: 20, value: '20' },
    ])
  ).not.toThrow()
})

test('getInstance', () => {
  const idvm = ObjectHelper.objectGetInstance(IdValueManager, [
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
      clonedObj = objectCloneAlphabetizingKeys(aobj)

    expect(clonedObj).toEqual({ a: 'a', b: 'b', c: 'c' })
  })

  test('DecodeBase64ToObject', () => {
    const base64String = btoa(JSON.stringify({ a: 'a', b: 'b' })),
      decodedObj = objectDecodeFromBase64(base64String)

    expect(decodedObj).toEqual({ a: 'a', b: 'b' })
  })

  test('EncodeObjectToBase64', () => {
    const aobj = { a: 'a', b: 'b' },
      encodedString = objectEncodeToBase64(aobj)

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
      clonedObj = DeepCloneJsonWithUndefined(aobj)

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
      clonedObj = DeepCloneJsonWithUndefined(aobj)

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

test(getBody.name, () => {
  expect(() => getBody('')).toThrow('Object body not found')
  expect(
    getBody({
      body: 'test',
    })
  ).toBe('test')
})

// describe(removeFields.name, () => {
//   test('remove from an object by fields array', () => {
//     const obj = {
//       a: 'a',
//       b: 'b',
//       c: 'c',
//     }
//     const props = {
//       fields: ['b'],
//       recursive: false,
//     }

//     removeFields(obj, props)

//     expect(obj).toEqual({
//       a: 'a',
//       c: 'c',
//     })
//   })

//   test('recursively remove from an object by fields array', () => {
//     const obj = {
//       a: 'a',
//       b: 'b',
//       c: 'c',
//       d: { a: 'a', b: 'b', c: 'c', d: { a: 'a', b: 'b' } },
//       e: { a: 'a' },
//       f: 12,
//       g: { h: 'h' },
//     }
//     const props = {
//       fields: ['b', 'e', 'h'],
//       recursive: true,
//     }

//     removeFields(obj, props)

//     expect(obj).toEqual({
//       a: 'a',
//       c: 'c',
//       d: { a: 'a', c: 'c', d: { a: 'a' } },
//       f: 12,
//       g: {},
//     })
//   })

//   test('recursively remove by fields object', () => {
//     const obj = {
//       a: 'a',
//       b: 'b',
//       c: 'c',
//       d: {
//         a: 'a',
//         b: 'b',
//         c: 'c',
//         d: { a: 'a', b: 'b' },
//         e: null,
//         h: undefined,
//       },
//       e: { a: 'a', b: '' },
//       f: 12,
//       g: { b: 'b', e: undefined, h: 'h' },
//       h: { h: null, i: 'i', j: undefined },
//       j: null,
//     }
//     const props = {
//       fields: {
//         b: { deleteIfHasData: true },
//         e: {},
//         h: { deleteIfUndefined: true },
//         j: { deleteIfNull: true },
//       },
//       recursive: true,
//     }

//     removeFields(obj, props)

//     expect(obj).toEqual({
//       a: 'a',
//       c: 'c',
//       d: { a: 'a', c: 'c', d: { a: 'a' } },
//       f: 12,
//       g: { h: 'h' },
//       h: { h: null, i: 'i', j: undefined },
//     })
//   })

//   test('default id props', () => {
//     const obj = {
//       _id: 1,
//       id: null,
//       name: 'Test',
//       x: {
//         _id: 2,
//         id: 3,
//         name: 'Test X',
//       },
//     }

//     removeFields(obj)

//     expect(obj).toEqual({
//       name: 'Test',
//       x: {
//         id: 3,
//         name: 'Test X',
//       },
//     })
//   })

//   test('not an object', () => {
//     const obj = 'not an object'
//     const props = {
//       fields: ['b', 'e', 'h'],
//       recursive: true,
//     }

//     removeFields(obj, props)

//     expect(obj).toEqual('not an object')
//     expect(removeFields(6, props)).toEqual(6)
//     expect(removeFields([1, 2, 3], props)).toEqual([1, 2, 3])
//     expect(removeFields('string', props)).toEqual('string')
//     expect(removeFields(null, props)).toBeNull()
//     // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
//     expect(removeFields(undefined, props)).toBeUndefined()
//     expect(removeFields(true, props)).toBe(true)
//     expect(removeFields(false, props)).toBe(false)
//     expect(removeFields(new Date(), props)).toBeInstanceOf(Date)
//   })
// })

describe(sortFunction.name, () => {
  test('number', () => {
    const a = 0,
      b = 1

    expect(sortFunction(a, b)).toEqual(-1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(1)

    expect(sortFunction(a, b, false)).toEqual(1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(-1)
  })

  test('string', () => {
    const a = 'a',
      b = 'b'

    expect(sortFunction(a, b)).toEqual(-1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(1)

    expect(sortFunction(a, b, 'asc')).toEqual(-1)
    expect(sortFunction(a, a, 'asc')).toEqual(0)
    expect(sortFunction(b, a, 'asc')).toEqual(1)

    expect(sortFunction(a, b, false)).toEqual(1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(-1)

    expect(sortFunction(a, b, 'desc')).toEqual(1)
    expect(sortFunction(a, a, 'desc')).toEqual(0)
    expect(sortFunction(b, a, 'desc')).toEqual(-1)
  })

  test('empty', () => {
    let a: string | undefined = 'a',
      // eslint-disable-next-line prefer-const
      b: string | undefined

    expect(sortFunction(a, b)).toEqual(-1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(1)

    expect(sortFunction(a, b, false)).toEqual(-1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(1)

    a = undefined
    b = 'b'
    expect(sortFunction(a, b)).toEqual(1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(-1)

    expect(sortFunction(a, b, false)).toEqual(1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(-1)
  })

  test('date', () => {
    const a = new Date(),
      b = new Date(a.getTime() + 1000)

    expect(sortFunction(a, b)).toEqual(-1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(1)

    expect(sortFunction(a, b, false)).toEqual(1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(-1)
  })

  test('array', () => {
    const a = ['a', 'b'],
      b = ['a', 'c']

    expect(sortFunction(a, b)).toEqual(-1)
    expect(sortFunction(a, a)).toEqual(0)
    expect(sortFunction(b, a)).toEqual(1)

    expect(sortFunction(a, b, false)).toEqual(1)
    expect(sortFunction(a, a, false)).toEqual(0)
    expect(sortFunction(b, a, false)).toEqual(-1)
  })
})
