import {
  AppExceptionHttp,
  AppExceptionHttpForbidden,
  AppExceptionHttpNotAcceptable,
  AppExceptionHttpNotAllowed,
  AppExceptionHttpNotFound,
  AppExceptionHttpUnauthorized,
  AppException,
  AppExceptionSecurity,
} from './AppException.mjs'

test('AppException good', () => {
  const ie = new AppException('Test', 'test')
  expect(ie.message).toBe('Test')
  expect(ie.functionNameSource).toBe('test')
})

test('AppException no function name source', () => {
  const ie = new AppException('Test')
  expect(ie.message).toBe('Test')
  expect(ie.functionNameSource).toBe('AppException')

  expect(new AppException('test', '').functionNameSource).toBe(
    AppException.name
  )
})

test('AppExceptionSecurity good', () => {
  const ie = new AppExceptionSecurity('Test', 'test')
  expect(ie.message).toBe('Test')
  expect(ie.functionNameSource).toBe('test')
})

test('AppExceptionHttp good', () => {
  const hex = new AppExceptionHttp('Test', 'AppExceptionHttp good')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttp good')
  expect(hex.httpStatusCode).toBe(500)
})

test('AppExceptionHttp default', () => {
  const hex = new AppExceptionHttp('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttp')
  expect(hex.httpStatusCode).toBe(500)
})

test('HttpUnauthorized default', () => {
  const hex = new AppExceptionHttpUnauthorized('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttp')
  expect(hex.httpStatusCode).toBe(401)
})

test('AppExceptionHttpForbidden default', () => {
  const hex = new AppExceptionHttpForbidden('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttp')
  expect(hex.httpStatusCode).toBe(403)
})

test('AppExceptionHttpNotAcceptable default', () => {
  const hex = new AppExceptionHttpNotAcceptable('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttp')
  expect(hex.httpStatusCode).toBe(406)
})

test('AppExceptionHttpNotAllowed default', () => {
  const hex = new AppExceptionHttpNotAllowed('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttp')
  expect(hex.httpStatusCode).toBe(405)
})

test('AppExceptionHttpNotFound default', () => {
  const hex = new AppExceptionHttpNotFound('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttp')
  expect(hex.httpStatusCode).toBe(404)
})
