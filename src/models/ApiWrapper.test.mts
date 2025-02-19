import { ApiWrapper } from './ApiWrapper.mjs'
import { IntecoreException } from './IntecoreException.mjs'

const CONST_DefaultError = 'Error'
const CONST_DefaultErrorResponseCode = -1
const CONST_ErrorNotFound = 'Not Found'
const CONST_success = 'success'

test('Constructor empty', () => {
  const apiWrapper = new ApiWrapper()

  expect(apiWrapper.message).toBe('')
  expect(apiWrapper.result).toBe('')
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(0)

  expect(apiWrapper.obj).toBeUndefined()
})

test('Constructor one param', () => {
  const result = CONST_success
  const apiWrapper = new ApiWrapper()
  apiWrapper.result = result + 'extra'

  expect(apiWrapper.message).toBe('')
  expect(apiWrapper.result).toBe(result + 'extra')
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(0)

  expect(apiWrapper.obj).toBeUndefined()
})

test('message good', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)

  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(result)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)
})

test('setError no params', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)

  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(result)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)

  apiWrapper.setError()
  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)
})

test('setError error object', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)

  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(result)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)

  apiWrapper.setError(obj)
  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)
})

test('setError exception', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)
  const ge = new IntecoreException(
    'setError exception',
    'not found',
    CONST_ErrorNotFound
  )

  apiWrapper.setError(ge)
  expect(apiWrapper.message.indexOf('setError exception')).toBe(0)
  expect(apiWrapper.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiWrapper.obj).toBe('Not Found')
})

test('setError error number', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = 123
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)

  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(result)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj).toBe(obj)
  expect(apiWrapper.obj).toBe(obj)

  apiWrapper.setError(obj)
  expect(apiWrapper.obj).toBe(123)
  expect(apiWrapper.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(123)

  expect(apiWrapper.obj).toBe(obj)
})

test('setError error string', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = 'error string'
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)

  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(result)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj?.indexOf('error string')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)

  apiWrapper.setError(obj)
  expect(apiWrapper.message.indexOf(obj)).toBe(0)
  expect(apiWrapper.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiWrapper.obj?.indexOf('error string')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)
})

test('setError error object with response code', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)

  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(result)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)

  const errorObj = { message: 'Not Found', responseCode: 500 }
  apiWrapper.setError(errorObj)
  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiWrapper.obj?.message.indexOf('Not Found')).toBe(0)
  expect(apiWrapper.obj).toBe(errorObj)
})

test('setError error object with IntecoreException', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)

  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(result)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)

  const errorObj = new IntecoreException(
    CONST_ErrorNotFound,
    'setError error object with IntecoreException',
    500
  )
  apiWrapper.setError(errorObj)
  expect(apiWrapper.message.indexOf(CONST_ErrorNotFound)).toBe(0)
  expect(apiWrapper.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiWrapper.obj).toBe(500)
})

test('setError error object with IntecoreException no object', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)

  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(result)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)

  const errorObj = new IntecoreException(
    CONST_ErrorNotFound,
    'setError error object with IntecoreException'
  )
  apiWrapper.setError(errorObj)
  expect(apiWrapper.message.indexOf(CONST_ErrorNotFound)).toBe(0)
  expect(apiWrapper.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiWrapper.obj).toBe(obj)
})

test('setError error IntecoreException with response code', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)

  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(result)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)

  const exceptionObject = { responseCode: 500, message: 'Not Found' }
  const errorObj = new IntecoreException(
    CONST_ErrorNotFound,
    'setError error object with IntecoreException',
    exceptionObject
  )
  apiWrapper.setError(errorObj)
  expect(apiWrapper.message.indexOf(CONST_ErrorNotFound)).toBe(0)
  expect(apiWrapper.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(-1)

  expect(apiWrapper.obj).toBe(exceptionObject)
})

test('setError error IntecoreException without response code', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found' }
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)

  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(result)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)

  const exceptionObject = { message: 'No responseCode' }
  const errorObj = new IntecoreException(
    CONST_ErrorNotFound,
    'setError error object with IntecoreException',
    exceptionObject
  )
  apiWrapper.setError(errorObj)
  expect(apiWrapper.message.indexOf(CONST_ErrorNotFound)).toBe(0)
  expect(apiWrapper.result.indexOf(CONST_DefaultError)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(CONST_DefaultErrorResponseCode)

  expect(apiWrapper.obj).toBe(exceptionObject)
})

test('setSuccess with object', () => {
  const result = CONST_success
  const responseCode = 200
  const message = CONST_success
  const obj = { message: 'Found', responseCode: 1 }
  const apiWrapper = new ApiWrapper(result, message, responseCode, obj)

  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(result)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)

  apiWrapper.setSuccess(obj)
  expect(apiWrapper.message.indexOf(message)).toBe(0)
  expect(apiWrapper.result.indexOf(CONST_success)).toBe(0)
  expect(apiWrapper.id).toBeGreaterThan(0)
  expect(apiWrapper.ts).toBeGreaterThan(0)
  expect(apiWrapper.responseCode).toBe(responseCode)

  expect(apiWrapper.obj?.message.indexOf('Found')).toBe(0)
  expect(apiWrapper.obj).toBe(obj)
})

test('responseCodeIsGood object true', () => {
  const ret = ApiWrapper.responseCodeIsGood({ responseCode: 200 })

  expect(ret).toBe(true)
})

test('responseCodeIsGood object false', () => {
  const ret = ApiWrapper.responseCodeIsGood({ responseCode: 700 })

  expect(ret).toBe(false)
})

test('responseCodeIsGood false', () => {
  const ret = ApiWrapper.responseCodeIsGood(5000)

  expect(ret).toBe(false)
})

test('isSuccess object true', () => {
  const ret = ApiWrapper.isSuccess({ result: CONST_success })

  expect(ret).toBe(true)
})

test('isSuccess object false', () => {
  const ret = ApiWrapper.isSuccess({ result: CONST_ErrorNotFound })

  expect(ret).toBe(false)
})

test('isSuccess false', () => {
  const ret = ApiWrapper.isSuccess(5000)

  expect(ret).toBe(false)
})
