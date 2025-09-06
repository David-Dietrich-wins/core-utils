import { ApiResponse, type IApiResponse, type IStatus } from './ApiResponse.mjs'
import {
  AppException,
  AppExceptionHttp,
  AppExceptionHttpNotFound,
} from './AppException.mjs'
import { type IPagedResponse, PagedResponse } from './PagedResponse.mjs'
import { describe, expect, it, jest } from '@jest/globals'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

const CONST_DefaultError = 'Error',
  CONST_DefaultErrorResponseCode = -1,
  CONST_ErrorNotFound = 'Not Found',
  CONST_success = 'success'

describe('api response exports', () => {
  it('constructor empty', () => {
    expect.assertions(6)

    const apiResponse = new ApiResponse('')

    expect(apiResponse.message).toBe('')
    expect(apiResponse.result).toBe('')
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(0)

    expect(apiResponse.data).toBe('')
  })

  it('constructor one param', () => {
    expect.assertions(6)

    const aaresult = CONST_success,
      apiResponse = new ApiResponse('')
    apiResponse.result = `${aaresult}extra`

    expect(apiResponse.message).toBe('')
    expect(apiResponse.result).toBe(`${aaresult}extra`)
    expect(apiResponse.id).toBeGreaterThan(0)
    expect(apiResponse.ts).toBeGreaterThan(0)
    expect(apiResponse.responseCode).toBe(0)

    expect(apiResponse.data).toBe('')
  })

  it('message good', () => {
    expect.assertions(7)

    const message = CONST_success,
      obj = { message: 'Found' },
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(result)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)
  })
})

describe('setError', () => {
  it('no params', () => {
    expect.assertions(14)

    const message = CONST_success,
      obj = { message: 'Found' },
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(result)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)

    zapiResponse.setError()

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)
  })

  it('error object', () => {
    expect.assertions(21)

    const message = CONST_success,
      obj = { message: 'Found' },
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(result)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)

    zapiResponse.setError(obj)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)

    zapiResponse.setError(new AppExceptionHttpNotFound('', 'test', obj))

    expect(zapiResponse.message.indexOf(CONST_ErrorNotFound)).toBe(-1)
    expect(zapiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)
    expect(zapiResponse.data.message.indexOf(CONST_ErrorNotFound)).toBe(-1)
    expect(zapiResponse.data).toStrictEqual({
      message: 'Found',
    })
  })

  it('exception', () => {
    expect.assertions(6)

    const ge = new AppExceptionHttp('setError exception', 'not found'),
      message = CONST_success,
      obj = { message: 'Found' },
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    zapiResponse.setError(ge)

    expect(zapiResponse.message.indexOf('setError exception')).toBe(0)
    expect(zapiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(zapiResponse.data).toStrictEqual(obj)
  })

  it('error number', () => {
    expect.assertions(13)

    const message = CONST_success,
      obj = 123,
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(result)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data).toBe(obj)
    expect(zapiResponse.data).toBe(obj)

    zapiResponse.setError(obj)

    expect(zapiResponse.data).toBe(123)
    expect(zapiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(123)

    expect(zapiResponse.data).toBe(obj)
  })

  it('error string', () => {
    expect.assertions(14)

    const message = CONST_success,
      obj = 'error string',
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(result)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data.indexOf('error string')).toBe(0)
    expect(zapiResponse.data).toBe(obj)

    zapiResponse.setError(obj)

    expect(zapiResponse.message.indexOf(obj)).toBe(0)
    expect(zapiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(zapiResponse.data.indexOf('error string')).toBe(0)
    expect(zapiResponse.data).toBe(obj)
  })

  it('error object with response code', () => {
    expect.assertions(14)

    const errorObj = new AppExceptionHttp(
        'Not Found',
        'test',
        CONST_DefaultErrorResponseCode,
        {
          message: 'test Not Found',
          responseCode: 404,
        }
      ),
      message = CONST_success,
      obj = { message: 'Found' },
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(result)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)

    errorObj.responseCode = -21
    zapiResponse.setError(errorObj)

    expect(zapiResponse.message.indexOf('Not Found')).toBe(0)
    expect(zapiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(-21)

    expect(zapiResponse.data.message.indexOf('test Not Found')).toBe(0)
    expect(zapiResponse.data).toStrictEqual({
      message: 'test Not Found',
      responseCode: 404,
    })
  })

  it('error object with AppException', () => {
    expect.assertions(13)

    const errorObj = new AppExceptionHttpNotFound(
        'setError error object with AppExceptionHttpNotFound',
        'test'
      ),
      message = CONST_success,
      obj = { message: 'Found' },
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(result)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)

    zapiResponse.setError(errorObj)

    expect(
      zapiResponse.message.indexOf(
        'setError error object with AppExceptionHttpNotFound'
      )
    ).toBe(0)
    expect(zapiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(zapiResponse.data).toStrictEqual(obj)
  })

  it('error object with AppException no object', () => {
    expect.assertions(13)

    const errorObj = new AppExceptionHttp(
        CONST_ErrorNotFound,
        'setError error object with AppException'
      ),
      message = CONST_success,
      obj = { message: 'Found' },
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(result)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)

    zapiResponse.setError(errorObj)

    expect(zapiResponse.message.indexOf(CONST_ErrorNotFound)).toBe(0)
    expect(zapiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(zapiResponse.data).toBe(obj)
  })

  it('error AppException with response code', () => {
    expect.assertions(13)

    const eexceptionObject = {
        message: 'Not Found',
        responseCode: 500,
      },
      errorObj = new AppExceptionHttpNotFound(
        'setError error object with AppExceptionHttpNotFound',
        'test',
        eexceptionObject
      ),
      message = CONST_success,
      obj = { message: 'Found' },
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(result)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)

    zapiResponse.setError(errorObj)

    expect(
      zapiResponse.message.indexOf(
        'setError error object with AppExceptionHttpNotFound'
      )
    ).toBe(0)
    expect(zapiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(-1)

    expect(zapiResponse.data).toBe(eexceptionObject)
  })

  it('error AppException without response code', () => {
    expect.assertions(13)

    const eexceptionObject = { message: 'No responseCode' },
      errorObj = new AppExceptionHttpNotFound(
        'setError error object with AppExceptionHttpNotFound',
        'test',
        eexceptionObject
      ),
      message = CONST_success,
      obj = { message: 'Found' },
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(result)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)

    zapiResponse.setError(errorObj)

    expect(
      zapiResponse.message.indexOf(
        'setError error object with AppExceptionHttpNotFound'
      )
    ).toBe(0)
    expect(zapiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

    expect(zapiResponse.data).toBe(eexceptionObject)
  })
})

describe('success', () => {
  it('setSuccess with object', () => {
    expect.assertions(14)

    const message = CONST_success,
      obj = { message: 'Found', responseCode: 1 },
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(result)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)

    zapiResponse.setSuccess(obj)

    expect(zapiResponse.message.indexOf(message)).toBe(0)
    expect(zapiResponse.result.indexOf(CONST_success)).toBe(0)
    expect(zapiResponse.id).toBeGreaterThan(0)
    expect(zapiResponse.ts).toBeGreaterThan(0)
    expect(zapiResponse.responseCode).toBe(responseCode)

    expect(zapiResponse.data.message.indexOf('Found')).toBe(0)
    expect(zapiResponse.data).toBe(obj)
  })
})

describe('responseCodeIsGood', () => {
  it('object true', () => {
    expect.assertions(1)

    const ret = ApiResponse.responseCodeIsGood({ responseCode: 200 })

    expect(ret).toBe(true)
  })

  it('object false', () => {
    expect.assertions(1)

    const ret = ApiResponse.responseCodeIsGood({ responseCode: 700 })

    expect(ret).toBe(false)
  })

  it('bad object', () => {
    expect.assertions(1)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret = ApiResponse.responseCodeIsGood({ code: 700 } as any)

    expect(ret).toBe(false)
  })

  it('false', () => {
    expect.assertions(1)

    const ret = ApiResponse.responseCodeIsGood({ responseCode: 0 })

    expect(ret).toBe(false)
  })
})

describe('isSuccess', () => {
  it('object true', () => {
    expect.assertions(1)

    const ret = ApiResponse.isSuccess({ result: CONST_success })

    expect(ret).toBe(true)
  })

  it('object false', () => {
    expect.assertions(1)

    const ret = ApiResponse.isSuccess({ result: CONST_ErrorNotFound })

    expect(ret).toBe(false)
  })

  it('bad object', () => {
    expect.assertions(1)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret = ApiResponse.isSuccess({ code: 700 } as any)

    expect(ret).toBe(false)
  })

  it('false', () => {
    expect.assertions(1)

    const ret = ApiResponse.isSuccess({ result: 'error' })

    expect(ret).toBe(false)
  })

  it('isGood', () => {
    expect.assertions(4)

    const message = CONST_success,
      obj = { message: 'Found', responseCode: 1 },
      responseCode = 200,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.isGood).toBe(true)
    expect(zapiResponse.isSuccess).toBe(true)
    expect(zapiResponse.isError).toBe(false)
    expect(zapiResponse.isErrorSignedOut).toBe(false)
  })

  it('isError', () => {
    expect.assertions(4)

    const message = CONST_success,
      obj = { message: 'Found', responseCode: 1 },
      responseCode = 401,
      result = CONST_success,
      zapiResponse = new ApiResponse(obj, result, message, responseCode)

    expect(zapiResponse.isGood).toBe(false)
    expect(zapiResponse.isSuccess).toBe(false)
    expect(zapiResponse.isError).toBe(true)
    expect(zapiResponse.isErrorSignedOut).toBe(true)
  })
})

describe('creators', () => {
  it('createFromErrorMessage', () => {
    expect.assertions(11)

    const ret = ApiResponse.createFromErrorMessage(
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

  it('createFromIApiResponse', () => {
    expect.assertions(11)

    const iapi: IApiResponse<{ some: string }> = {
        data: { some: 'data' },
        id: 123,
        message: 'error message',
        responseCode: 200,
        result: CONST_DefaultError,
        stats: new InstrumentationStatistics(),
        ts: 123456789,
      },
      ret = ApiResponse.createFromIApiResponse<{ some: string }>(iapi)

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

  it('errorHandler', () => {
    expect.assertions(5)

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

  it('verifySuccess', () => {
    expect.assertions(4)

    const fname = 'test-verifySuccess',
      ret = new ApiResponse('data', CONST_success, 'message', 200),
      zdata = ApiResponse.verifySuccess(fname, ret)

    expect(zdata).toBe('data')

    expect(() => {
      ApiResponse.verifySuccess(fname, new ApiResponse('', 'error', '', 500))
    }).toThrow(new Error('Bad result from API call: error.'))

    expect(() => {
      ApiResponse.verifySuccess(
        fname,
        new ApiResponse('', CONST_success, '', 200),
        true
      )
    }).not.toThrow()

    expect(() => {
      ApiResponse.verifySuccess(
        fname,
        new ApiResponse('', 'success', '', 200),
        false
      )
    }).toThrow(new AppException('No data returned', fname))
  })

  it('verifySuccessPagedResponse', () => {
    expect.assertions(6)

    const fname = 'test-verifySuccessPagedResponse',
      ret = new ApiResponse<IPagedResponse<string>>(
        { dataPage: [], totalCount: 0 },
        CONST_success,
        'message',
        200
      ),
      zdata = ApiResponse.verifySuccessPagedResponse(fname, ret)

    expect(zdata).toBeInstanceOf(PagedResponse)
    expect(zdata.dataPage).toStrictEqual([])
    expect(zdata.totalCount).toBe(0)

    expect(() => {
      ApiResponse.verifySuccessPagedResponse(
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
      ApiResponse.verifySuccessPagedResponse(
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
      ApiResponse.verifySuccessPagedResponse(
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

  it('isStatus', () => {
    expect.assertions(6)

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

  it('isApiResponse', () => {
    expect.assertions(21)

    expect(ApiResponse.IsApiResponse({})).toBe(false)
    expect(ApiResponse.IsApiResponse(null)).toBe(false)
    expect(ApiResponse.IsApiResponse(undefined)).toBe(false)
    expect(ApiResponse.IsApiResponse('')).toBe(false)
    expect(ApiResponse.IsApiResponse(123)).toBe(false)
    expect(ApiResponse.IsApiResponse([])).toBe(false)
    expect(ApiResponse.IsApiResponse({ id: 123 })).toBe(false)
    expect(ApiResponse.IsApiResponse({ id: 123, ts: Date.now() })).toBe(false)
    expect(
      ApiResponse.IsApiResponse({
        id: 123,
        result: '',
        ts: Date.now(),
      })
    ).toBe(false)
    expect(
      ApiResponse.IsApiResponse({
        id: 123,
        message: '',
        result: '',
        ts: Date.now(),
      })
    ).toBe(false)
    expect(
      ApiResponse.IsApiResponse({
        id: 123,
        message: '',
        responseCode: 0,
        result: '',
        ts: Date.now(),
      })
    ).toBe(false)
    expect(
      ApiResponse.IsApiResponse({
        data: '',
        id: 123,
        message: '',
        responseCode: 0,
        result: '',
        ts: Date.now(),
      })
    ).toBe(false)
    expect(
      ApiResponse.IsApiResponse({
        data: '',
        id: 123,
        message: '',
        responseCode: 0,
        result: '',
        stats: new InstrumentationStatistics(),
        ts: Date.now(),
      })
    ).toBe(true)

    const obj: IApiResponse = {
      data: '',
      id: 123,
      message: '',
      responseCode: 0,
      result: '',
      stats: new InstrumentationStatistics(),
      ts: Date.now(),
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

  it('isApiResponseError', () => {
    expect.assertions(18)

    expect(ApiResponse.IsApiResponseError({})).toBe(true)
    expect(ApiResponse.IsApiResponseError(null)).toBe(false)
    expect(ApiResponse.IsApiResponseError(undefined)).toBe(false)
    expect(ApiResponse.IsApiResponseError('')).toBe(false)
    expect(ApiResponse.IsApiResponseError(123)).toBe(false)
    expect(ApiResponse.IsApiResponseError([])).toBe(false)
    expect(ApiResponse.IsApiResponseError({ id: 123 })).toBe(true)
    expect(ApiResponse.IsApiResponseError({ id: 123, ts: Date.now() })).toBe(
      true
    )
    expect(
      ApiResponse.IsApiResponseError({
        id: 123,
        result: '',
        ts: Date.now(),
      })
    ).toBe(true)
    expect(
      ApiResponse.IsApiResponseError({
        id: 123,
        message: '',
        result: '',
        ts: Date.now(),
      })
    ).toBe(true)

    const obj: IApiResponse = {
      data: '',
      id: 123,
      message: '',
      responseCode: 0,
      result: '',
      stats: new InstrumentationStatistics(),
      ts: Date.now(),
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

  it('hasObj', () => {
    expect.assertions(4)

    const obj: { obj: unknown } = { obj: {} }

    expect(ApiResponse.HasObj(obj)).toBe(true)

    obj.obj = null

    expect(ApiResponse.HasObj(obj)).toBe(true)

    obj.obj = undefined

    expect(ApiResponse.HasObj(obj)).toBe(true)

    delete obj.obj

    expect(ApiResponse.HasObj(obj)).toBe(false)
  })

  it('isCaptureResponse', () => {
    expect.assertions(10)

    const newobj = { captureResponse: {} },
      noobj = {},
      obj: { captureResponse: IApiResponse } = {
        captureResponse: {
          data: '',
          id: 123,
          message: '',
          responseCode: 0,
          result: '',
          stats: new InstrumentationStatistics(),
          ts: Date.now(),
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

    expect(ApiResponse.IsCaptureResponse(newobj)).toBe(true)

    expect(ApiResponse.IsCaptureResponse(noobj)).toBe(false)
  })

  it('isWrappedCaptureResponse', () => {
    expect.assertions(10)

    const newobj = { obj: { captureResponse: {} } },
      noobj = {},
      obj: { obj: { captureResponse: IApiResponse } } = {
        obj: {
          captureResponse: {
            data: '',
            id: 123,
            message: '',
            responseCode: 0,
            result: '',
            stats: new InstrumentationStatistics(),
            ts: Date.now(),
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

    expect(ApiResponse.IsWrappedCaptureResponse(newobj)).toBe(true)

    expect(ApiResponse.IsWrappedCaptureResponse(noobj)).toBe(false)
  })

  it('isWrappedCaptureResponseWithMsg', () => {
    expect.assertions(10)

    const newobj = { obj: { captureResponse: {} } },
      noobj = {},
      obj: { obj: { captureResponse: IApiResponse } } = {
        obj: {
          captureResponse: {
            data: '',
            id: 123,
            message: '',
            responseCode: 0,
            result: '',
            stats: new InstrumentationStatistics(),
            ts: Date.now(),
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
    expect(ApiResponse.IsWrappedCaptureResponseWithMessage(newobj)).toBe(false)
    expect(ApiResponse.IsWrappedCaptureResponseWithMessage(noobj)).toBe(false)
  })
})
