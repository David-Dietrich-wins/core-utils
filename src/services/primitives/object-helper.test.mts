/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BuildLogFriendlyMessage,
  GetErrorMessage,
  ObjectFindKeyAndReturnValue,
  ObjectMustHaveKeyAndReturnValue,
  ObjectPrepareForJson,
  ObjectTypesToString,
  getObjectValue,
  isObject,
  renameProperty,
  runOnAllMembers,
  searchObjectForArray,
} from './object-helper.mjs'
import { safestr } from '../string-helper.mts'

// type PostExceptionAxiosResponseData = {
//   response: {
//     status: number
//     statusText: string
//     data: {
//       testing: string
//     }
//   }
// }

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

    expect(ret).toBe("[ 'hello', 'world', [length]: 2 ]")
  })

  test('null', () => {
    const ret = ObjectTypesToString(null)

    expect(ret).toBe('')
  })

  test('JS Error response', () => {
    const e = new Error('test error')

    const ret = ObjectTypesToString(e)
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
    const e = new File('', 'test.txt')

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual("File { data: '', name: 'test.txt' }")
  })

  test('FileList object', () => {
    const e = new FileList('', 'test.txt')

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual("FileList { data: '', name: 'test.txt' }")
  })

  test('Object generic', () => {
    const e = { data: '', name: 'test.txt' }

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual("{ data: '', name: 'test.txt' }")
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
    const e = new File('', 'test.txt')

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual("File { data: '', name: 'test.txt' }")
  })

  test('FileList object', () => {
    const e = new FileList('', 'test.txt')

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual("FileList { data: '', name: 'test.txt' }")
  })

  test('Object generic', () => {
    const e = { data: '', name: 'test.txt' }

    const ret = ObjectTypesToString(e)
    expect(ret).toEqual("{ data: '', name: 'test.txt' }")
  })
})

describe('GetErrorMessage', () => {
  test('Objects', () => {
    const e = new Error()

    e.message = undefined as unknown as string

    const ret = GetErrorMessage(e)
    expect(ret).toBe('Unknown error')

    expect(GetErrorMessage(new Error('test error'))).toBe('test error')
    expect(GetErrorMessage({})).toBe('Unknown error')
    expect(GetErrorMessage({ a: 'a' })).toBe('Unknown error')
    expect(GetErrorMessage({ message: 'test object error' })).toBe(
      'test object error'
    )
  })

  test('Strings', () => {
    expect(GetErrorMessage('')).toBe('Unknown error')
    expect(GetErrorMessage('test string error')).toBe('test string error')
  })

  test('boolean', () => {
    expect(GetErrorMessage(true)).toBe('true')
    expect(GetErrorMessage(false)).toBe('false')
  })

  test('unknown', () => {
    expect(GetErrorMessage(undefined)).toBe('Unknown error')
    expect(GetErrorMessage(null)).toBe('Unknown error')
    expect(GetErrorMessage(new Date())).toBe('Unknown error')
    // This is the default case for unknown types
    expect(GetErrorMessage(BigInt(5))).toBe('Unknown error')
  })

  test('number', () => {
    expect(GetErrorMessage(0)).toBe('0')
    expect(GetErrorMessage(-1000.246)).toBe('-1000.246')
    expect(GetErrorMessage(42)).toBe('42')
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(isObject({ a: 'a' }, new Date() as any)).toBe(true)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runOnAllMembers(1 as any, (key: string, value: unknown) => key + value)
  ).toThrow('runOnAllMembers() received an empty object.')

  expect(() =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runOnAllMembers({ a: 'a' }, null as any)
  ).toThrow('runOnAllMembers() received an empty function operator.')

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let oldKey: any = 'a'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
