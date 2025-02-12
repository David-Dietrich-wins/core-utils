/* eslint-disable quotes */
// import { HttpResponse, http } from 'msw'
// import { mockServer } from '../jest.setup.mjs'
import {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import {
  ObjectFindKeyAndReturnValue,
  ObjectMustHaveKeyAndReturnValue,
  ObjectTypesToString,
} from './object-helper.mjs'

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
