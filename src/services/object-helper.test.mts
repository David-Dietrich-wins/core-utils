/* eslint-disable quotes */
import { jest } from '@jest/globals'
import {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { IId } from '../models/IdManager.mjs'
import { IdValueManager } from '../models/IdValueManager.mjs'
import { IConstructor } from '../models/types.mjs'
import {
  addObjectToList,
  CloneObjectWithExtras,
  deepCloneJson,
  deepDiffMapper,
  FindObjectWithField,
  getNullObject,
  getObjectValue,
  isObject,
  ObjectFindKeyAndReturnValue,
  ObjectHelper,
  ObjectMustHaveKeyAndReturnValue,
  ObjectTypesToString,
  renameProperty,
  runOnAllMembers,
  safeJsonToString,
  safeObject,
  searchObjectForArray,
  UpdateFieldValue,
} from './object-helper.mjs'
import { pluralize, plusMinus } from './string-helper.mjs'

type PostExceptionAxiosResponseData = {
  response: {
    status: number
    statusText: string
    data: {
      testing: string
    }
  }
}

const CONST_TestRestBaseUrl = 'http://localhost:3000'

describe('ObjectFindKeyAndReturnValue', () => {
  test('default', () => {
    const obj = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    }

    const keyToFind = 'key1'
    const result = ObjectFindKeyAndReturnValue(obj, keyToFind)

    expect(result).toBe('value1')
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

describe('ObjectTypesToString', () => {
  test('return string from array', () => {
    const ret = ObjectTypesToString(['hello', 'world'])

    expect(ret).toBe("[ 'hello', 'world', [length]: 2 ]")
  })

  test('null', () => {
    const ret = ObjectTypesToString(null)

    expect(ret).toBe('')
  })

  // test('http fetch get good', async () => {
  //   const url = `${CONST_AceRestBaseUrl}/Patrons/`

  //   const retjson = {
  //     testing: 'testing',
  //   }

  //   mockServer.use(
  //     http.get(url, () => {
  //       // const anyIdNumber = req.url.searchParams.get('AnyIdNumber')
  //       // const siteId = req.url.searchParams.get('SiteId')

  //       return HttpResponse.json(retjson)
  //     })
  //   )

  //   const abc = await fetch(url)

  //   const ret = ObjectTypesToString(abc)
  //   expect(ret).toBe('[object Response]')
  //   const body = await abc.json()
  //   expect(body).toEqual(retjson)
  // })

  test('AxiosError', () => {
    const ae = new AxiosError('test', '777')
    const ret = ObjectTypesToString(ae)

    const retstr = ret?.toString()

    expect(ret).toBe(retstr)
  })

  test('AxiosError response status with data', async () => {
    const url = `${CONST_TestRestBaseUrl}/Patrons/`

    const mockRequestData: PostExceptionAxiosResponseData = {
      response: {
        status: 500,
        statusText: 'Unhandled Exception',
        data: {
          testing: 'testing',
        },
      },
    }

    const myHeaders = {
      'Content-Type': 'application/json',
    }

    const mockRequestHeaders = new AxiosHeaders(myHeaders)
    const mockResponseHeaders = new AxiosHeaders(myHeaders)

    const requestData = {
      hello: 'world',
    }
    const mockRequestConfig: InternalAxiosRequestConfig<typeof requestData> = {
      method: 'post',
      url,
      data: requestData,
      headers: mockRequestHeaders,
    }

    const res: AxiosResponse<
      PostExceptionAxiosResponseData,
      typeof requestData
    > = {
      data: mockRequestData,
      status: 401,
      statusText: 'Unauthorized',
      headers: mockResponseHeaders,
      config: mockRequestConfig,
      request: { hello: 'world' },
    }

    expect(res.data).toEqual(mockRequestData)

    const ae = new AxiosError<
      PostExceptionAxiosResponseData,
      typeof requestData
    >('Unauthorized', '401', mockRequestConfig, mockRequestHeaders, res)
    ae.response = res
    ae.config = mockRequestConfig

    const ret = ObjectTypesToString(ae)

    const retstr = ret?.toString()

    expect(ret).toBe(retstr)
  })

  test('AxiosError response status with config with data', async () => {
    const url = `${CONST_TestRestBaseUrl}/Patrons/`

    const myHeaders = {
      'Content-Type': 'application/json',
    }

    const mockRequestHeaders = new AxiosHeaders(myHeaders)
    const mockResponseHeaders = new AxiosHeaders(myHeaders)

    const requestData = {
      hello: 'world',
    }
    const mockRequestConfig: InternalAxiosRequestConfig = {
      method: 'post',
      url,
      data: requestData,
      headers: mockRequestHeaders,
    }

    const res: AxiosResponse = {
      data: { hello: 'world' },
      status: 401,
      statusText: 'Unauthorized',
      headers: mockResponseHeaders,
      config: mockRequestConfig,
      request: { hello: 'world' },
    }

    const ae = new AxiosError<PostExceptionAxiosResponseData>(
      'Unauthorized',
      '401',
      mockRequestConfig,
      mockRequestHeaders,
      res
    )
    ae.response = res
    ae.config = mockRequestConfig

    const ret = ObjectTypesToString(ae, true, true)

    const retstr = ret?.toString()

    expect(ret).toBe(retstr)
  })

  test('AxiosError response status with config with data do not show', async () => {
    const url = `${CONST_TestRestBaseUrl}/Patrons/`

    const myHeaders = {
      'Content-Type': 'application/json',
    }

    const mockRequestHeaders = new AxiosHeaders(myHeaders)
    const mockResponseHeaders = new AxiosHeaders(myHeaders)

    const requestData = {
      hello: 'world',
    }
    const mockRequestConfig: InternalAxiosRequestConfig = {
      method: 'post',
      url,
      data: requestData,
      headers: mockRequestHeaders,
    }

    const res: AxiosResponse = {
      data: { hello: 'world' },
      status: 401,
      statusText: 'Unauthorized',
      headers: mockResponseHeaders,
      config: mockRequestConfig,
      request: { hello: 'world' },
    }

    const ae = new AxiosError<PostExceptionAxiosResponseData>(
      'Unauthorized',
      '401',
      mockRequestConfig,
      mockRequestHeaders,
      res
    )
    ae.response = res
    ae.config = mockRequestConfig

    const ret = ObjectTypesToString(ae, false, false)

    const retstr = ret?.toString()

    expect(ret).toBe(retstr)
  })

  test('AxiosError response status with no config', async () => {
    const url = `${CONST_TestRestBaseUrl}/Patrons/`

    const myHeaders = {
      'Content-Type': 'application/json',
    }

    const mockRequestHeaders = new AxiosHeaders(myHeaders)
    const mockResponseHeaders = new AxiosHeaders(myHeaders)

    const requestData = {
      hello: 'world',
    }
    const mockRequestConfig: InternalAxiosRequestConfig = {
      method: 'post',
      url,
      data: requestData,
      headers: mockRequestHeaders,
    }

    const res: AxiosResponse = {
      data: { hello: 'world' },
      status: 401,
      statusText: 'Unauthorized',
      headers: mockResponseHeaders,
      config: mockRequestConfig,
      request: { hello: 'world' },
    }

    const ae = new AxiosError<PostExceptionAxiosResponseData>(
      'Unauthorized',
      '401',
      undefined,
      mockRequestHeaders,
      res
    )
    ae.response = undefined
    ae.config = undefined

    const ret = ObjectTypesToString(ae, true, true)

    const retstr = ret?.toString()

    expect(ret).toBe(retstr)

    ae.response = res

    const ret2 = ObjectTypesToString(ae, true, true)

    const retstr2 = ret2?.toString()

    expect(ret2).toBe(retstr2)
  })

  test('AxiosError response status with config no data', async () => {
    const url = `${CONST_TestRestBaseUrl}/Patrons/`

    const myHeaders = {
      'Content-Type': 'application/json',
    }

    const mockRequestHeaders = new AxiosHeaders(myHeaders)
    const mockResponseHeaders = new AxiosHeaders(myHeaders)

    const mockRequestConfig: InternalAxiosRequestConfig = {
      method: 'post',
      url,
      // data: requestData,
      headers: mockRequestHeaders,
    }

    const res: AxiosResponse = {
      data: undefined,
      status: 401,
      statusText: 'Unauthorized',
      headers: mockResponseHeaders,
      config: mockRequestConfig,
      request: { hello: 'world' },
    }

    expect(res.data).toBeUndefined()

    const ae = new AxiosError<PostExceptionAxiosResponseData>(
      'Unauthorized',
      '401',
      mockRequestConfig,
      mockRequestHeaders,
      res
    )
    ae.response = res
    ae.config = mockRequestConfig

    const ret = ObjectTypesToString(ae, true, true)

    const retstr = ret?.toString()

    expect(ret).toBe(retstr)
  })

  test('AxiosError response status AxiosRetry', () => {
    const url = `${CONST_TestRestBaseUrl}/Patrons/`

    const mockRequestData: PostExceptionAxiosResponseData = {
      response: {
        status: 500,
        statusText: 'Unhandled Exception',
        data: {
          testing: 'testing',
        },
      },
    }

    const myHeaders = {
      'Content-Type': 'application/json',
    }

    const mockRequestHeaders = new AxiosHeaders(myHeaders)
    const mockResponseHeaders = new AxiosHeaders(myHeaders)

    const requestData = {
      hello: 'world',
    }
    const mockRequestConfig: InternalAxiosRequestConfig<typeof requestData> & {
      'axios-retry': { lastRequestTime?: number; retryCount?: number }
    } = {
      'axios-retry': {
        lastRequestTime: Date.now(),
        retryCount: 1,
      },
      'method': 'post',
      url,
      'data': requestData,
      'headers': mockRequestHeaders,
    }

    const res: AxiosResponse<
      PostExceptionAxiosResponseData,
      typeof requestData
    > = {
      data: mockRequestData,
      status: 401,
      statusText: 'Unauthorized',
      headers: mockResponseHeaders,
      config: mockRequestConfig,
      request: { hello: 'world' },
    }

    expect(res.data).toEqual(mockRequestData)

    const ae = new AxiosError<
      PostExceptionAxiosResponseData,
      typeof requestData
    >('Unauthorized', '401', mockRequestConfig, mockRequestHeaders, res)
    ae.response = res
    ae.config = mockRequestConfig

    const ret = ObjectTypesToString(ae, true, true)

    const retstr = ret?.toString()

    expect(ret).toBe(retstr)
    expect(ret).toContain('lastRequestTime')
    expect(ret).toContain('retryCount')
  })

  test('JS Error response', async () => {
    const e = new Error('test error')

    const ret = ObjectTypesToString(e, true, true)
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

  test('File object', async () => {
    const e = new File('', 'test.txt')

    const ret = ObjectTypesToString(e, true, true)
    expect(ret).toEqual("File { data: '', name: 'test.txt' }")
  })

  test('FileList object', async () => {
    const e = new FileList('', 'test.txt')

    const ret = ObjectTypesToString(e, true, true)
    expect(ret).toEqual("FileList { data: '', name: 'test.txt' }")
  })

  test('Object generic', async () => {
    const e = { data: '', name: 'test.txt' }

    const ret = ObjectTypesToString(e, true, true)
    expect(ret).toEqual("{ data: '', name: 'test.txt' }")
  })
})

test('CloneObjectWithExtras', () => {
  const obj: IId = {
    id: 'abc1',
  }

  expect(CloneObjectWithExtras(obj)).toEqual(obj)
})

test('UpdateFieldValue', () => {
  const obj: IId & { field: string } = {
    id: 'abc1',
    field: 'value',
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
})
test('runOnAllMembers', () => {
  expect(() =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runOnAllMembers(1 as any, (key: string, value: unknown) => {
      return key + value
    })
  ).toThrow('runOnAllMembers() received an empty object.')

  expect(() =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runOnAllMembers({ a: 'a' }, null as any)
  ).toThrow('runOnAllMembers() received an empty function operator.')

  const funcToRunOnAllMembers = (key: string, value: unknown) => {
    return key + value
  }

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
    `Cannot renameProperty. Property: ${oldKey} not found.`
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(isObject({ a: 'a' }, new Date() as any)).toBe(true)
})
test('getObjectValue', () => {
  expect(getObjectValue({ a: 'a' }, 'a')).toBe('a')
  expect(getObjectValue({ a: 'a' }, 'b')).toBeUndefined()
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
})
describe('deepDiffMapper', () => {
  test('compareValues', () => {
    const anum = 1
    const bnum = 1

    const astr = 'a'
    const bstr = 'a'

    const aDate = new Date()
    const bDate = new Date(aDate)

    let a: Record<string, unknown> = { a: 'a' }
    let b: Record<string, unknown> = { b: 'b' }

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
    expect(deepDiffMapper().compareValues(astr, bstr + 'a')).toStrictEqual(
      'updated'
    )

    expect(deepDiffMapper().compareValues(aDate, bDate)).toStrictEqual(
      'unchanged'
    )
    expect(
      deepDiffMapper().compareValues(aDate, new Date(+bDate + 1))
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
    ]
    const b = [
      { name: 'climate', value: 90 },
      { name: 'freeSpeech', value: 80 },
      { name: 'religion', value: 82 },
    ]

    expect(deepDiffMapper().anyChanges(a, b)).toBe(true)

    const c = [
      {
        a: { name: 'climate', value: 90 },
        b: { name: 'freeSpeech', value: 80 },
        c: { name: 'religion', value: 81 },
      },
    ]

    const d = [
      {
        a: { name: 'climate', value: 90 },
        b: { name: 'freeSpeech', value: 80 },
        c: { name: 'religion', value: 83 },
      },
    ]

    expect(deepDiffMapper().anyChanges(c, d)).toBe(true)
  })

  test('findTypeData', () => {
    let b: Record<string, unknown> = { b: 'b' }

    expect(deepDiffMapper().findTypeData(['a', 'a'])).toBe(false)

    expect(deepDiffMapper().findTypeData(['a', b])).toStrictEqual(false)

    b = {
      type: 'not-unchanged',
      data: 'a',
    }
    expect(deepDiffMapper().findTypeData(['a', b])).toStrictEqual(true)

    b = {
      type: 'unchanged',
      data: 'a',
    }
    expect(deepDiffMapper().findTypeData(['a', b])).toStrictEqual(false)

    const ddm = deepDiffMapper()
    expect(ddm.findTypeData(['a', ddm])).toStrictEqual(false)

    expect(
      ddm.findTypeData(['a', { type: 'changed', data: 'a' }])
    ).toStrictEqual(true)
  })

  test('getChanges', () => {
    const anum = 1
    const bnum = 1

    const astr = 'a'
    const bstr = 'a'

    const aDate = new Date()
    const bDate = new Date(aDate)

    const a: Record<string, unknown> = { a: 'a' }
    const b: Record<string, unknown> = { b: 'b' }

    expect(deepDiffMapper().getChanges(anum, bnum)).toBe(false)
    expect(deepDiffMapper().getChanges(anum, bnum + 1)).toBe(true)

    expect(deepDiffMapper().getChanges(astr, bstr)).toBe(false)
    expect(deepDiffMapper().getChanges(astr, bstr + 'a')).toBe(true)

    expect(deepDiffMapper().getChanges(aDate, bDate)).toBe(false)
    expect(deepDiffMapper().getChanges(aDate, new Date(+bDate + 1))).toBe(true)

    expect(deepDiffMapper().getChanges(a, b)).toStrictEqual([
      'a',
      { data: 'a', type: 'deleted' },
    ])
  })

  test('various tests', () => {
    let a: Record<string, unknown> = { a: 'a' }
    let b: Record<string, unknown> = { b: 'b' }

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
    expect(ddMap).toStrictEqual({ a: { type: 'created', data: 'a' } })
  })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createDeepObject(depth: number, value: any) {
  return { item: depth > 0 ? createDeepObject(--depth, value) : value }
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

test('getFirstNewWithException', () => {
  expect(() =>
    ObjectHelper.getFirstNewWithException(IdValueManager, [])
  ).not.toThrow()
  expect(() =>
    ObjectHelper.getFirstNewWithException(IdValueManager, [234, 20])
  ).toThrow(new Error('list must be an array'))

  let fnOrig = ObjectHelper.getInstance
  ObjectHelper.getInstance = <T, Tid>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _theClass: IConstructor<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    ..._args: any[]
  ) => {
    return undefined as Tid as unknown as T
  }

  expect(() =>
    ObjectHelper.getFirstNewWithException(
      IdValueManager,
      undefined as unknown as string[]
    )
  ).toThrow(new Error('Error getting first new object'))
  ObjectHelper.getInstance = fnOrig

  fnOrig = ObjectHelper.getInstance
  ObjectHelper.getInstance = <T, Tid>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _theClass: IConstructor<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    ..._args: any[]
  ) => {
    return undefined as Tid as unknown as T
  }
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
    const obj = {
      b: 'b',
      a: 'a',
      c: 'c',
    }

    const clonedObj = ObjectHelper.CloneObjectAlphabetizingKeys(obj)

    expect(clonedObj).toEqual({ a: 'a', b: 'b', c: 'c' })
  })

  test('DecodeBase64ToObject', () => {
    const base64String = btoa(JSON.stringify({ a: 'a', b: 'b' }))
    const decodedObj = ObjectHelper.DecodeBase64ToObject(base64String)

    expect(decodedObj).toEqual({ a: 'a', b: 'b' })
  })

  test('EncodeObjectToBase64', () => {
    const obj = { a: 'a', b: 'b' }
    const encodedString = ObjectHelper.EncodeObjectToBase64(obj)

    expect(encodedString).toBe(btoa(JSON.stringify(obj)))
  })

  test('DeepCloneJsonWithUndefined', () => {
    const obj = {
      a: 'a',
      b: undefined,
      c: {
        d: 'd',
        e: undefined,
      },
    }

    const clonedObj = ObjectHelper.DeepCloneJsonWithUndefined(obj)

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
    const obj = {
      a: 'a',
      b: undefined,
      c: {
        d: 'd',
        e: undefined,
      },
    }

    const clonedObj = ObjectHelper.DeepCloneJsonWithUndefined(obj)

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
