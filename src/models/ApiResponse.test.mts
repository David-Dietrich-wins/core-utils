import { jest } from '@jest/globals'
import { ApiResponse, IApiResponse } from './ApiResponse.mjs'
import {
  AppException,
  AppExceptionHttp,
  AppExceptionHttpNotFound,
} from './AppException.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { IPagedResponse, PagedResponse } from './PagedResponse.mjs'

const CONST_DefaultError = 'Error'
const CONST_DefaultErrorResponseCode = -1
const CONST_ErrorNotFound = 'Not Found'
const CONST_success = 'success'

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
  const result = CONST_success
  const apiResponse = new ApiResponse('')
  apiResponse.result = result + 'extra'

  expect(apiResponse.message).toBe('')
  expect(apiResponse.result).toBe(result + 'extra')
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(0)

  expect(apiResponse.data).toBe('')
})

test('message good', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiResponse = new ApiResponse(obj, result, message, responseCode)

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
    const result = CONST_success
    const responseCode = 200
    const message = CONST_success
    const obj = { message: 'Found' }
    const apiResponse = new ApiResponse(obj, result, message, responseCode)

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
    const result = CONST_success
    const responseCode = 200
    const message = CONST_success
    const obj = { message: 'Found' }
    const apiResponse = new ApiResponse(obj, result, message, responseCode)

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
    const result = CONST_success
    const responseCode = 200
    const message = CONST_success
    const obj = { message: 'Found' }
    const apiResponse = new ApiResponse(obj, result, message, responseCode)
    const ge = new AppExceptionHttp('setError exception', 'not found')

    apiResponse.setError(ge)
    expect(apiResponse.message.indexOf('setError exception')).toBe(0)
    expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(apiResponse.data).toStrictEqual(obj)
  })

  test('error number', () => {
    const result = CONST_success
    const responseCode = 200
    const message = CONST_success
    const obj = 123
    const apiResponse = new ApiResponse(obj, result, message, responseCode)

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
    const result = CONST_success
    const responseCode = 200
    const message = CONST_success
    const obj = 'error string'
    const apiResponse = new ApiResponse(obj, result, message, responseCode)

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
    const result = CONST_success
    const responseCode = 200
    const message = CONST_success
    const obj = { message: 'Found' }
    const apiResponse = new ApiResponse(obj, result, message, responseCode)

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
    const result = CONST_success
    const responseCode = 200
    const message = CONST_success
    const obj = { message: 'Found' }
    const apiResponse = new ApiResponse(obj, result, message, responseCode)

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
    const result = CONST_success
    const responseCode = 200
    const message = CONST_success
    const obj = { message: 'Found' }
    const apiResponse = new ApiResponse(obj, result, message, responseCode)

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
    const result = CONST_success
    const responseCode = 200
    const message = CONST_success
    const obj = { message: 'Found' }
    const apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(result)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(responseCode)

    expect(apiResponse.data.message.indexOf('Found')).toBe(0)
    expect(apiResponse.data).toBe(obj)

    const exceptionObject = { responseCode: 500, message: 'Not Found' }
    const errorObj = new AppExceptionHttpNotFound(
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
    const result = CONST_success
    const responseCode = 200
    const message = CONST_success
    const obj = { message: 'Found' }
    const apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.message.indexOf(message)).toBe(0)
    expect(apiResponse.result.indexOf(result)).toBe(0)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(responseCode)

    expect(apiResponse.data.message.indexOf('Found')).toBe(0)
    expect(apiResponse.data).toBe(obj)

    const exceptionObject = { message: 'No responseCode' }
    const errorObj = new AppExceptionHttpNotFound(
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
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found', responseCode: 1 }
  const apiResponse = new ApiResponse(obj, result, message, responseCode)

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
    const result = CONST_success
    const responseCode = 200
    const message = CONST_success
    const obj = { message: 'Found', responseCode: 1 }
    const apiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(apiResponse.isGood).toBe(true)
    expect(apiResponse.isSuccess).toBe(true)
    expect(apiResponse.isError).toBe(false)
    expect(apiResponse.isErrorSignedOut).toBe(false)
  })

  test('isError', () => {
    const result = CONST_success
    const responseCode = 401
    const message = CONST_success
    const obj = { message: 'Found', responseCode: 1 }
    const apiResponse = new ApiResponse(obj, result, message, responseCode)

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
  }

  const ret = ApiResponse.CreateFromIApiResponse<{ some: string }>(iapi)

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
  const fname = 'test-ErrorHandler'

  const location = {
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
  const fname = 'test-VerifySuccess'
  const ret = new ApiResponse('data', CONST_success, 'message', 200)

  const data = ApiResponse.VerifySuccess(fname, ret)
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
  const fname = 'test-VerifySuccessPagedResponse'
  const ret = new ApiResponse<IPagedResponse<string>>(
    { dataPage: [], totalCount: 0 },
    CONST_success,
    'message',
    200
  )

  const data = ApiResponse.VerifySuccessPagedResponse(fname, ret)
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
