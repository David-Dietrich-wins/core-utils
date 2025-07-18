import { jest } from '@jest/globals'
import { ApiResponse, IApiResponse, type IStatus } from './ApiResponse.mjs'
import {
  AppException,
  AppExceptionHttp,
  AppExceptionHttpNotFound,
} from './AppException.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { IPagedResponse, PagedResponse } from './PagedResponse.mjs'

const CONST_DefaultError = 'Error',
 CONST_DefaultErrorResponseCode = -1,
 CONST_ErrorNotFound = 'Not Found',
 CONST_success = 'success'

test('Constructor empty', () => {
  const apiResponse = new ApiResponse('')

  expect(apiResponse.message).toBe('')
  expect(apiResponse.result).toBe('')
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(0)

  expect(apiResponse.data).toBe('')
})

test('Constructor one param', () => {
  const result = CONST_success,
   apiResponse = new ApiResponse('')
  apiResponse.result = `${result  }extra`

  expect(apiResponse.message).toBe('')
  expect(apiResponse.result).toBe(`${result  }extra`)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(0)

  expect(apiResponse.data).toBe('')
})

test('message good', () => {
  const result = CONST_success,
   responseCode = 200,
   message = CONST_success,
   obj = { message: 'Found' },
   apiResponse = new ApiResponse(obj, result, message, responseCode)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.data.message.indexOf('Found')).toBe(0)
  expect(apiResponse.data).toBe(obj)
})

describe('setError', () => {
  test('no params', () => {
    const result = CONST_success,
     responseCode = 200,
     message = CONST_success,
     obj = { message: 'Found' },
     apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(result)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(responseCode)

    expect(apiResponse.data.message.indexOf('Found')).toBe(0)
    expect(apiResponse.data).toBe(obj)

    apiResponse.setError()
    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(apiResponse.data?.message.indexOf('Found')).toBe(0)
    expect(apiResponse.data).toBe(obj)
  })

  test('error object', () => {
    const result = CONST_success,
     responseCode = 200,
     message = CONST_success,
     obj = { message: 'Found' },
     apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(result)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(responseCode)

    expect(apiResponse.data?.message.indexOf('Found')).toBe(0)
    expect(apiResponse.data).toBe(obj)

    apiResponse.setError(obj)
    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(apiResponse.data.message.indexOf('Found')).toBe(0)
    expect(apiResponse.data).toBe(obj)

    apiResponse.setError(new AppExceptionHttpNotFound('', 'test', obj))
    expect(apiResponse.message.indexOf(CONST_ErrorNotFound)).toBe(-1)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)
    expect(apiResponse.data.message.indexOf(CONST_ErrorNotFound)).toBe(-1)
    expect(apiResponse.data).toStrictEqual({
      message: 'Found',
    })
  })

  test('exception', () => {
    const result = CONST_success,
     responseCode = 200,
     message = CONST_success,
     obj = { message: 'Found' },
     apiResponse = new ApiResponse(obj, result, message, responseCode),
     ge = new AppExceptionHttp('setError exception', 'not found')

    apiResponse.setError(ge)
    expect(apiResponse.message.indexOf('setError exception')).toBe(0)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(apiResponse.data).toStrictEqual(obj)
  })

  test('error number', () => {
    const result = CONST_success,
     responseCode = 200,
     message = CONST_success,
     obj = 123,
     apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(result)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(responseCode)

    expect(apiResponse.data).toBe(obj)
    expect(apiResponse.data).toBe(obj)

    apiResponse.setError(obj)
    expect(apiResponse.data).toBe(123)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(123)

    expect(apiResponse.data).toBe(obj)
  })

  test('error string', () => {
    const result = CONST_success,
     responseCode = 200,
     message = CONST_success,
     obj = 'error string',
     apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(result)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(responseCode)

    expect(apiResponse.data?.indexOf('error string')).toBe(0)
    expect(apiResponse.data).toBe(obj)

    apiResponse.setError(obj)
    expect(apiResponse.message.indexOf(obj)).toBe(0)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(apiResponse.data?.indexOf('error string')).toBe(0)
    expect(apiResponse.data).toBe(obj)
  })

  test('error object with response code', () => {
    const result = CONST_success,
     responseCode = 200,
     message = CONST_success,
     obj = { message: 'Found' },
     apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(result)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(responseCode)

    expect(apiResponse.data.message.indexOf('Found')).toBe(0)
    expect(apiResponse.data).toBe(obj)

    const errorObj = new AppExceptionHttp(
      'Not Found',
      'test',
      CONST_DefaultErrorResponseCode,
      {
        message: 'test Not Found',
        responseCode: 404,
      }
    )
    errorObj.responseCode = -21
    apiResponse.setError(errorObj)
    expect(apiResponse.message.indexOf('Not Found')).toBe(0)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(-21)

    expect(apiResponse.data?.message.indexOf('test Not Found')).toBe(0)
    expect(apiResponse.data).toStrictEqual({
      message: 'test Not Found',
      responseCode: 404,
    })
  })

  test('error object with AppException', () => {
    const result = CONST_success,
     responseCode = 200,
     message = CONST_success,
     obj = { message: 'Found' },
     apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(result)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(responseCode)

    expect(apiResponse.data.message.indexOf('Found')).toBe(0)
    expect(apiResponse.data).toBe(obj)

    const errorObj = new AppExceptionHttpNotFound(
      'setError error object with AppExceptionHttpNotFound',
      'test'
    )
    apiResponse.setError(errorObj)
    expect(
      apiResponse.message.indexOf(
        'setError error object with AppExceptionHttpNotFound'
      )
    ).toBe(0)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(apiResponse.data).toStrictEqual(obj)
  })

  test('error object with AppException no object', () => {
    const result = CONST_success,
     responseCode = 200,
     message = CONST_success,
     obj = { message: 'Found' },
     apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(result)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(responseCode)

    expect(apiResponse.data?.message.indexOf('Found')).toBe(0)
    expect(apiResponse.data).toBe(obj)

    const errorObj = new AppExceptionHttp(
      CONST_ErrorNotFound,
      'setError error object with AppException'
    )
    apiResponse.setError(errorObj)
    expect(apiResponse.message.indexOf(CONST_ErrorNotFound)).toBe(0)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(apiResponse.data).toBe(obj)
  })

  test('error AppException with response code', () => {
    const result = CONST_success,
     responseCode = 200,
     message = CONST_success,
     obj = { message: 'Found' },
     apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(result)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(responseCode)

    expect(apiResponse.data.message.indexOf('Found')).toBe(0)
    expect(apiResponse.data).toBe(obj)

    const exceptionObject = { responseCode: 500, message: 'Not Found' },
     errorObj = new AppExceptionHttpNotFound(
      'setError error object with AppExceptionHttpNotFound',
      'test',
      exceptionObject
    )
    apiResponse.setError(errorObj)
    expect(
      apiResponse.message.indexOf(
        'setError error object with AppExceptionHttpNotFound'
      )
    ).toBe(0)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(-1)

    expect(apiResponse.data).toBe(exceptionObject)
  })

  test('error AppException without response code', () => {
    const result = CONST_success,
     responseCode = 200,
     message = CONST_success,
     obj = { message: 'Found' },
     apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(result)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(responseCode)

    expect(apiResponse.data.message.indexOf('Found')).toBe(0)
    expect(apiResponse.data).toBe(obj)

    const exceptionObject = { message: 'No responseCode' },
     errorObj = new AppExceptionHttpNotFound(
      'setError error object with AppExceptionHttpNotFound',
      'test',
      exceptionObject
    )
    apiResponse.setError(errorObj)
    expect(
      apiResponse.message.indexOf(
        'setError error object with AppExceptionHttpNotFound'
      )
    ).toBe(0)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(apiResponse.data).toBe(exceptionObject)
  })
})

test('setSuccess with object', () => {
  const result = CONST_success,
   responseCode = 200,
   message = CONST_success,
   obj = { message: 'Found', responseCode: 1 },
   apiResponse = new ApiResponse(obj, result, message, responseCode)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.data.message.indexOf('Found')).toBe(0)
  expect(apiResponse.data).toBe(obj)

  apiResponse.setSuccess(obj)
  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(CONST_success)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.data.message.indexOf('Found')).toBe(0)
  expect(apiResponse.data).toBe(obj)
})

describe('responseCodeIsGood', () => {
  test('object true', () => {
    const ret = ApiResponse.responseCodeIsGood({ responseCode: 200 })

    expect(ret).toBe(true)
  })

  test('object false', () => {
    const ret = ApiResponse.responseCodeIsGood({ responseCode: 700 })

    expect(ret).toBe(false)
  })

  test('bad object', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret = ApiResponse.responseCodeIsGood({ code: 700 } as any)

    expect(ret).toBe(false)
  })

  test('false', () => {
    const ret = ApiResponse.responseCodeIsGood({ responseCode: 0 })

    expect(ret).toBe(false)
  })
})

describe('isSuccess', () => {
  test('object true', () => {
    const ret = ApiResponse.isSuccess({ result: CONST_success })

    expect(ret).toBe(true)
  })

  test('object false', () => {
    const ret = ApiResponse.isSuccess({ result: CONST_ErrorNotFound })

    expect(ret).toBe(false)
  })

  test('bad object', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret = ApiResponse.isSuccess({ code: 700 } as any)

    expect(ret).toBe(false)
  })

  test('false', () => {
    const ret = ApiResponse.isSuccess({ result: 'error' })

    expect(ret).toBe(false)
  })

  test('isGood', () => {
    const result = CONST_success,
     responseCode = 200,
     message = CONST_success,
     obj = { message: 'Found', responseCode: 1 },
     apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.isGood).toBe(true)
    expect(apiResponse.isSuccess).toBe(true)
    expect(apiResponse.isError).toBe(false)
    expect(apiResponse.isErrorSignedOut).toBe(false)
  })

  test('isError', () => {
    const result = CONST_success,
     responseCode = 401,
     message = CONST_success,
     obj = { message: 'Found', responseCode: 1 },
     apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.isGood).toBe(false)
    expect(apiResponse.isSuccess).toBe(false)
    expect(apiResponse.isError).toBe(true)
    expect(apiResponse.isErrorSignedOut).toBe(true)
  })
})

test('CreateFromErrorMessage', () => {
  const ret = ApiResponse.CreateFromErrorMessage(
    'error message',
    { some: 'data' },
    new InstrumentationStatistics()
  )

  expect(ret).toBeInstanceOf(ApiResponse)
  expect(ret.message).toBe('error message')
  expect(ret.result).toBe(CONST_DefaultError)
  expect(ret.id).toBeGreaterThan(0)
  expect(ret.ts).toBeGreaterThan(0)
  expect(ret.responseCode).toBe(200)
  expect(ret.data).toStrictEqual({ some: 'data' })
  expect(ret.stats).toBeInstanceOf(InstrumentationStatistics)
  expect(ret.stats.failures).toBe(0)
  expect(ret.stats.successes).toBe(0)
  expect(ret.stats.totalProcessed).toBe(0)
})

test('CreateFromIApiResponse', () => {
  const iapi: IApiResponse<{ some: string }> = {
    message: 'error message',
    result: CONST_DefaultError,
    id: 123,
    ts: 123456789,
    responseCode: 200,
    data: { some: 'data' },
    stats: new InstrumentationStatistics(),
  },

   ret = ApiResponse.CreateFromIApiResponse<{ some: string }>(iapi)

  expect(ret).toBeInstanceOf(ApiResponse)
  expect(ret.message).toBe('error message')
  expect(ret.result).toBe(CONST_DefaultError)
  expect(ret.id).toBeGreaterThan(0)
  expect(ret.ts).toBeGreaterThan(0)
  expect(ret.responseCode).toBe(200)
  expect(ret.data).toStrictEqual({ some: 'data' })
  expect(ret.stats).toBeInstanceOf(InstrumentationStatistics)
  expect(ret.stats.failures).toBe(0)
  expect(ret.stats.successes).toBe(0)
  expect(ret.stats.totalProcessed).toBe(0)
})

test('ErrorHandler', async () => {
  const fname = 'test-ErrorHandler',

   location = {
    href: 'http://localhost',
    pathname: '/test',
    search: '?query=1',
  }

  let ret = ApiResponse.ErrorHandler(
    fname,
    new Error('error message'),
    location
  )
  expect(ret).toBe(false)

  ret = ApiResponse.ErrorHandler(
    fname,
    new AppExceptionHttp('error message', 'test', 402),
    location
  )
  expect(ret).toBe(false)

  ret = ApiResponse.ErrorHandler(
    fname,
    new AppExceptionHttp('error message', 'test', 403),
    location
  )
  expect(ret).toBe(true)

  ret = ApiResponse.ErrorHandler(
    fname,
    new AppExceptionHttp('error message', 'test', 403),
    location
  )
  jest.advanceTimersByTime(200)
  expect(ret).toBe(true)
  expect(location).toMatchObject({
    href: '/login?callbackUrl=%2Ftest%3Fquery%3D1',
    pathname: '/test',
    search: '?query=1',
  })
})

test('VerifySuccess', () => {
  const fname = 'test-VerifySuccess',
   ret = new ApiResponse('data', CONST_success, 'message', 200),

   data = ApiResponse.VerifySuccess(fname, ret)
  expect(data).toBe('data')

  expect(() => {
    ApiResponse.VerifySuccess(fname, new ApiResponse('', 'error', '', 500))
  }).toThrow(new Error('Bad result from API call: error.'))

  expect(() => {
    ApiResponse.VerifySuccess(
      fname,
      new ApiResponse('', CONST_success, '', 200),
      true
    )
  }).not.toThrow()

  expect(() => {
    ApiResponse.VerifySuccess(
      fname,
      new ApiResponse('', 'success', '', 200),
      false
    )
  }).toThrow(new AppException('No data returned', fname))
})

test('VerifySuccessPagedResponse', () => {
  const fname = 'test-VerifySuccessPagedResponse',
   ret = new ApiResponse<IPagedResponse<string>>(
    { dataPage: [], totalCount: 0 },
    CONST_success,
    'message',
    200
  ),

   data = ApiResponse.VerifySuccessPagedResponse(fname, ret)
  expect(data).toBeInstanceOf(PagedResponse)
  expect(data.dataPage).toEqual([])
  expect(data.totalCount).toBe(0)

  expect(() => {
    ApiResponse.VerifySuccessPagedResponse(
      fname,
      new ApiResponse<IPagedResponse<string>>(
        {
          dataPage: [],
          totalCount: 0,
        },
        'error',
        '',
        500
      )
    )
  }).toThrow(new Error('Bad result from API call: error.'))

  expect(() => {
    ApiResponse.VerifySuccessPagedResponse(
      fname,
      new ApiResponse<IPagedResponse<string>>(
        undefined as unknown as IPagedResponse<string>,
        'error',
        '',
        500
      )
    )
  }).toThrow(new Error('Bad result from API call: error.'))

  expect(() => {
    ApiResponse.VerifySuccessPagedResponse(
      fname,
      new ApiResponse<IPagedResponse<string>>(
        undefined as unknown as IPagedResponse<string>,
        'success',
        '',
        200
      ),
      false
    )
  }).toThrow(new AppException('No data returned', fname))
})

test('IsStatus', () => {
  const obj: IStatus = {}

  expect(ApiResponse.IsStatus(obj)).toBe(false)

  obj.status = 500
  expect(ApiResponse.IsStatus(obj)).toBe(true)

  obj.statusText = 'Internal Server Error'
  expect(ApiResponse.IsStatus(obj)).toBe(true)

  obj.status = 0
  expect(ApiResponse.IsStatus(obj)).toBe(true)

  obj.status = undefined
  expect(ApiResponse.IsStatus(obj)).toBe(true)

  obj.statusText = undefined
  expect(ApiResponse.IsStatus(obj)).toBe(true)
})

test('IsApiResponse', () => {
  expect(ApiResponse.IsApiResponse({})).toBe(false)
  expect(ApiResponse.IsApiResponse(null)).toBe(false)
  expect(ApiResponse.IsApiResponse(undefined)).toBe(false)
  expect(ApiResponse.IsApiResponse('')).toBe(false)
  expect(ApiResponse.IsApiResponse(123)).toBe(false)
  expect(ApiResponse.IsApiResponse([])).toBe(false)
  expect(ApiResponse.IsApiResponse({ id: 123 })).toBe(false)
  expect(ApiResponse.IsApiResponse({ id: 123, ts: Date.now() })).toBe(false)
  expect(
    ApiResponse.IsApiResponse({ id: 123, ts: Date.now(), result: '' })
  ).toBe(false)
  expect(
    ApiResponse.IsApiResponse({
      id: 123,
      ts: Date.now(),
      result: '',
      message: '',
    })
  ).toBe(false)
  expect(
    ApiResponse.IsApiResponse({
      id: 123,
      ts: Date.now(),
      result: '',
      message: '',
      responseCode: 0,
    })
  ).toBe(false)
  expect(
    ApiResponse.IsApiResponse({
      id: 123,
      ts: Date.now(),
      result: '',
      message: '',
      responseCode: 0,
      data: '',
    })
  ).toBe(false)
  expect(
    ApiResponse.IsApiResponse({
      id: 123,
      ts: Date.now(),
      result: '',
      message: '',
      responseCode: 0,
      data: '',
      stats: new InstrumentationStatistics(),
    })
  ).toBe(true)

  const obj: IApiResponse = {
    id: 123,
    ts: Date.now(),
    result: '',
    message: '',
    responseCode: 0,
    data: '',
    stats: new InstrumentationStatistics(),
  }

  expect(ApiResponse.IsApiResponse(obj)).toBe(true)

  obj.result = 'success'
  expect(ApiResponse.IsApiResponse(obj)).toBe(true)

  obj.message = 'message'
  expect(ApiResponse.IsApiResponse(obj)).toBe(true)

  obj.result = CONST_DefaultError
  expect(ApiResponse.IsApiResponse(obj)).toBe(true)

  obj.ts = Date.now()
  expect(ApiResponse.IsApiResponse(obj)).toBe(true)

  obj.responseCode = 200
  expect(ApiResponse.IsApiResponse(obj)).toBe(true)

  obj.data = { some: 'data' }
  expect(ApiResponse.IsApiResponse(obj)).toBe(true)

  obj.result = CONST_success
  expect(ApiResponse.IsApiResponse(obj)).toBe(true)
})

test('IsApiResponseError', () => {
  expect(ApiResponse.IsApiResponseError({})).toBe(true)
  expect(ApiResponse.IsApiResponseError(null)).toBe(false)
  expect(ApiResponse.IsApiResponseError(undefined)).toBe(false)
  expect(ApiResponse.IsApiResponseError('')).toBe(false)
  expect(ApiResponse.IsApiResponseError(123)).toBe(false)
  expect(ApiResponse.IsApiResponseError([])).toBe(false)
  expect(ApiResponse.IsApiResponseError({ id: 123 })).toBe(true)
  expect(ApiResponse.IsApiResponseError({ id: 123, ts: Date.now() })).toBe(true)
  expect(
    ApiResponse.IsApiResponseError({ id: 123, ts: Date.now(), result: '' })
  ).toBe(true)
  expect(
    ApiResponse.IsApiResponseError({
      id: 123,
      ts: Date.now(),
      result: '',
      message: '',
    })
  ).toBe(true)

  const obj: IApiResponse = {
    id: 123,
    ts: Date.now(),
    result: '',
    message: '',
    responseCode: 0,
    data: '',
    stats: new InstrumentationStatistics(),
  }

  expect(ApiResponse.IsApiResponseError(obj)).toBe(true)

  obj.result = 'success'
  expect(ApiResponse.IsApiResponseError(obj)).toBe(false)

  obj.message = 'message'
  expect(ApiResponse.IsApiResponseError(obj)).toBe(false)

  obj.result = CONST_DefaultError
  expect(ApiResponse.IsApiResponseError(obj)).toBe(true)

  obj.ts = Date.now()
  expect(ApiResponse.IsApiResponseError(obj)).toBe(true)

  obj.responseCode = 200
  expect(ApiResponse.IsApiResponseError(obj)).toBe(true)

  obj.data = { some: 'data' }
  expect(ApiResponse.IsApiResponseError(obj)).toBe(true)

  obj.result = CONST_success
  expect(ApiResponse.IsApiResponseError(obj)).toBe(false)
})

test('HasObj', () => {
  const obj: { obj: unknown } = { obj: {} }
  expect(ApiResponse.HasObj(obj)).toBe(true)

  obj.obj = null
  expect(ApiResponse.HasObj(obj)).toBe(true)

  obj.obj = undefined
  expect(ApiResponse.HasObj(obj)).toBe(true)

  delete obj.obj
  expect(ApiResponse.HasObj(obj)).toBe(false)
})

test('IsCaptureResponse', () => {
  const obj: { captureResponse: IApiResponse } = {
    captureResponse: {
      id: 123,
      ts: Date.now(),
      result: '',
      message: '',
      responseCode: 0,
      data: '',
      stats: new InstrumentationStatistics(),
    },
  }

  expect(ApiResponse.IsCaptureResponse(obj)).toBe(true)

  obj.captureResponse.result = 'success'
  expect(ApiResponse.IsCaptureResponse(obj)).toBe(true)

  obj.captureResponse.message = 'message'
  expect(ApiResponse.IsCaptureResponse(obj)).toBe(true)

  obj.captureResponse.result = CONST_DefaultError
  expect(ApiResponse.IsCaptureResponse(obj)).toBe(true)

  obj.captureResponse.ts = Date.now()
  expect(ApiResponse.IsCaptureResponse(obj)).toBe(true)

  obj.captureResponse.responseCode = 200
  expect(ApiResponse.IsCaptureResponse(obj)).toBe(true)

  obj.captureResponse.data = { some: 'data' }
  expect(ApiResponse.IsCaptureResponse(obj)).toBe(true)

  obj.captureResponse.result = CONST_success
  expect(ApiResponse.IsCaptureResponse(obj)).toBe(true)

  const newobj = { captureResponse: {} }
  expect(ApiResponse.IsCaptureResponse(newobj)).toBe(true)

  const noobj = {}
  expect(ApiResponse.IsCaptureResponse(noobj)).toBe(false)
})

test('IsWrappedCaptureResponse', () => {
  const obj: { obj: { captureResponse: IApiResponse } } = {
    obj: {
      captureResponse: {
        id: 123,
        ts: Date.now(),
        result: '',
        message: '',
        responseCode: 0,
        data: '',
        stats: new InstrumentationStatistics(),
      },
    },
  }

  expect(ApiResponse.IsWrappedCaptureResponse(obj)).toBe(true)

  obj.obj.captureResponse.result = 'success'
  expect(ApiResponse.IsWrappedCaptureResponse(obj)).toBe(true)

  obj.obj.captureResponse.message = 'message'
  expect(ApiResponse.IsWrappedCaptureResponse(obj)).toBe(true)

  obj.obj.captureResponse.result = CONST_DefaultError
  expect(ApiResponse.IsWrappedCaptureResponse(obj)).toBe(true)

  obj.obj.captureResponse.ts = Date.now()
  expect(ApiResponse.IsWrappedCaptureResponse(obj)).toBe(true)

  obj.obj.captureResponse.responseCode = 200
  expect(ApiResponse.IsWrappedCaptureResponse(obj)).toBe(true)

  obj.obj.captureResponse.data = { some: 'data' }
  expect(ApiResponse.IsWrappedCaptureResponse(obj)).toBe(true)

  obj.obj.captureResponse.result = CONST_success
  expect(ApiResponse.IsWrappedCaptureResponse(obj)).toBe(true)

  const newobj = { obj: { captureResponse: {} } }
  expect(ApiResponse.IsWrappedCaptureResponse(newobj)).toBe(true)

  const noobj = {}
  expect(ApiResponse.IsWrappedCaptureResponse(noobj)).toBe(false)
})

test('IsWrappedCaptureResponseWithMsg', () => {
  const obj: { obj: { captureResponse: IApiResponse } } = {
    obj: {
      captureResponse: {
        id: 123,
        ts: Date.now(),
        result: '',
        message: '',
        responseCode: 0,
        data: '',
        stats: new InstrumentationStatistics(),
      },
    },
  }

  expect(ApiResponse.IsWrappedCaptureResponseWithMessage(obj)).toBe(true)

  obj.obj.captureResponse.result = 'success'
  expect(ApiResponse.IsWrappedCaptureResponseWithMessage(obj)).toBe(true)

  obj.obj.captureResponse.message = 'message'
  expect(ApiResponse.IsWrappedCaptureResponseWithMessage(obj)).toBe(true)

  obj.obj.captureResponse.result = CONST_DefaultError
  expect(ApiResponse.IsWrappedCaptureResponseWithMessage(obj)).toBe(true)

  obj.obj.captureResponse.ts = Date.now()
  expect(ApiResponse.IsWrappedCaptureResponseWithMessage(obj)).toBe(true)

  obj.obj.captureResponse.responseCode = 200
  expect(ApiResponse.IsWrappedCaptureResponseWithMessage(obj)).toBe(true)

  obj.obj.captureResponse.data = { some: 'data' }
  expect(ApiResponse.IsWrappedCaptureResponseWithMessage(obj)).toBe(true)

  obj.obj.captureResponse.result = CONST_success
  expect(ApiResponse.IsWrappedCaptureResponseWithMessage(obj)).toBe(true)

  const newobj = { obj: { captureResponse: {} } }
  expect(ApiResponse.IsWrappedCaptureResponseWithMessage(newobj)).toBe(false)

  const noobj = {}
  expect(ApiResponse.IsWrappedCaptureResponseWithMessage(noobj)).toBe(false)
})
