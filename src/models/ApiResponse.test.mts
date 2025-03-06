import { ApiResponse } from './ApiResponse.mjs'
import { AppExceptionHttp, AppExceptionHttpNotFound } from './AppException.mjs'

const CONST_DefaultError = 'Error'
const CONST_DefaultErrorResponseCode = -1
const CONST_ErrorNotFound = 'Not Found'
const CONST_success = 'success'

test('Constructor empty', () => {
  const apiResponse = new ApiResponse()

  expect(apiResponse.message).toBe('')
  expect(apiResponse.result).toBe('')
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(0)

  expect(apiResponse.obj).toBeUndefined()
})

test('Constructor one param', () => {
  const result = CONST_success
  const apiResponse = new ApiResponse()
  apiResponse.result = result + 'extra'

  expect(apiResponse.message).toBe('')
  expect(apiResponse.result).toBe(result + 'extra')
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(0)

  expect(apiResponse.obj).toBeUndefined()
})

test('message good', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiResponse = new ApiResponse(result, message, responseCode, obj)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)
})

test('setError no params', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiResponse = new ApiResponse(result, message, responseCode, obj)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)

  apiResponse.setError()
  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)
})

test('setError error object', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiResponse = new ApiResponse(result, message, responseCode, obj)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)

  apiResponse.setError(obj)
  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)
})

test('setError exception', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiResponse = new ApiResponse(result, message, responseCode, obj)
  const ge = new AppExceptionHttp('setError exception', 'not found')

  apiResponse.setError(ge)
  expect(apiResponse.message.indexOf('setError exception')).toBe(0)
  expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiResponse.obj).toStrictEqual(obj)
})

test('setError error number', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = 123
  const apiResponse = new ApiResponse(result, message, responseCode, obj)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj).toBe(obj)
  expect(apiResponse.obj).toBe(obj)

  apiResponse.setError(obj)
  expect(apiResponse.obj).toBe(123)
  expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(123)

  expect(apiResponse.obj).toBe(obj)
})

test('setError error string', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = 'error string'
  const apiResponse = new ApiResponse(result, message, responseCode, obj)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj?.indexOf('error string')).toBe(0)
  expect(apiResponse.obj).toBe(obj)

  apiResponse.setError(obj)
  expect(apiResponse.message.indexOf(obj)).toBe(0)
  expect(apiResponse.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiResponse.obj?.indexOf('error string')).toBe(0)
  expect(apiResponse.obj).toBe(obj)
})

test('setError error object with response code', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiResponse = new ApiResponse(result, message, responseCode, obj)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)

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

  expect(apiResponse.obj?.message.indexOf('test Not Found')).toBe(0)
  expect(apiResponse.obj).toStrictEqual({
    message: 'test Not Found',
    responseCode: 404,
  })
})

test('setError error object with AppException', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiResponse = new ApiResponse(result, message, responseCode, obj)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)

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

  expect(apiResponse.obj).toStrictEqual(obj)
})

test('setError error object with AppException no object', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiResponse = new ApiResponse(result, message, responseCode, obj)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)

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

  expect(apiResponse.obj).toBe(obj)
})

test('setError error AppException with response code', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiResponse = new ApiResponse(result, message, responseCode, obj)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)

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

  expect(apiResponse.obj).toBe(exceptionObject)
})

test('setError error AppException without response code', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiResponse = new ApiResponse(result, message, responseCode, obj)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)

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

  expect(apiResponse.obj).toBe(exceptionObject)
})

test('setSuccess with object', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found', responseCode: 1 }
  const apiResponse = new ApiResponse(result, message, responseCode, obj)

  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(result)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)

  apiResponse.setSuccess(obj)
  expect(apiResponse.message.indexOf(message)).toBe(0)
  expect(apiResponse.result.indexOf(CONST_success)).toBe(0)
  expect(apiResponse.id).toBeGreaterThan(0)
  expect(apiResponse.ts).toBeGreaterThan(0)
  expect(apiResponse.responseCode).toBe(responseCode)

  expect(apiResponse.obj?.message.indexOf('Found')).toBe(0)
  expect(apiResponse.obj).toBe(obj)
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
})
