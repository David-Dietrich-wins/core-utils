import {
  HttpException,
  HttpExceptionForbidden,
  HttpExceptionNotAcceptable,
  HttpExceptionNotAllowed,
  HttpExceptionNotFound,
  HttpExceptionUnauthorized,
  IntecoreException,
} from './IntecoreException.mjs'

test('IntecoreException good', () => {
  const ie = new IntecoreException('Test', 'test')
  expect(ie.message).toBe('Test')
  expect(ie.functionNameSource).toBe('test')
})

test('IntecoreException no function name source', () => {
  const ie = new IntecoreException('Test', '')
  expect(ie.message).toBe('Test')
  expect(ie.functionNameSource).toBe('IntecoreException')
})

test('HttpException good', () => {
  const hex = new HttpException('Test', 'HttpException good')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('HttpException good')
  expect(hex.httpStatusCode).toBe(500)
})

test('HttpException default', () => {
  const hex = new HttpException('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('HttpException')
  expect(hex.httpStatusCode).toBe(500)
})

test('HttpUnauthorized default', () => {
  const hex = new HttpExceptionUnauthorized('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('HttpException')
  expect(hex.httpStatusCode).toBe(401)
})

test('HttpExceptionForbidden default', () => {
  const hex = new HttpExceptionForbidden('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('HttpException')
  expect(hex.httpStatusCode).toBe(403)
})

test('HttpExceptionNotAcceptable default', () => {
  const hex = new HttpExceptionNotAcceptable('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('HttpException')
  expect(hex.httpStatusCode).toBe(406)
})

test('HttpExceptionNotAllowed default', () => {
  const hex = new HttpExceptionNotAllowed('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('HttpException')
  expect(hex.httpStatusCode).toBe(405)
})

test('HttpExceptionNotFound default', () => {
  const hex = new HttpExceptionNotFound('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('HttpException')
  expect(hex.httpStatusCode).toBe(404)
})
