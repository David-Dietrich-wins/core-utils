import {
  AppException,
  AppExceptionHttp,
  AppExceptionHttpForbidden,
  AppExceptionHttpNotAcceptable,
  AppExceptionHttpNotAllowed,
  AppExceptionHttpNotFound,
  AppExceptionHttpUnauthorized,
  AppExceptionSecurity,
  GetErrorMessage,
  IsErrorMessage,
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

  expect(new AppExceptionSecurity('Test').functionNameSource).toBe(
    'AppExceptionSecurity'
  )
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

  expect(new AppExceptionHttp('Test').functionNameSource).toBe(
    'AppExceptionHttp'
  )
})

test('HttpUnauthorized default', () => {
  const hex = new AppExceptionHttpUnauthorized('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttpUnauthorized')
  expect(hex.httpStatusCode).toBe(401)

  expect(new AppExceptionHttpUnauthorized('Test').functionNameSource).toBe(
    'AppExceptionHttpUnauthorized'
  )
  expect(new AppExceptionHttpUnauthorized().functionNameSource).toBe(
    'AppExceptionHttpUnauthorized'
  )
})
test('HttpUnauthorized', () => {
  const hex = new AppExceptionHttpUnauthorized('Test', 'myFunction', 'abc')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('myFunction')
  expect(hex.httpStatusCode).toBe(401)
  expect(hex.obj).toBe('abc')

  expect(new AppExceptionHttpUnauthorized('Test').functionNameSource).toBe(
    'AppExceptionHttpUnauthorized'
  )
  expect(new AppExceptionHttpUnauthorized().functionNameSource).toBe(
    'AppExceptionHttpUnauthorized'
  )
})

test('AppExceptionHttpForbidden default', () => {
  const hex = new AppExceptionHttpForbidden('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttpForbidden')
  expect(hex.httpStatusCode).toBe(403)

  expect(new AppExceptionHttpForbidden('Test').functionNameSource).toBe(
    'AppExceptionHttpForbidden'
  )
  expect(new AppExceptionHttpForbidden().functionNameSource).toBe(
    'AppExceptionHttpForbidden'
  )
})
test('AppExceptionHttpForbidden', () => {
  const hex = new AppExceptionHttpForbidden('Test', 'myFunction', 'abc')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('myFunction')
  expect(hex.httpStatusCode).toBe(403)
  expect(hex.obj).toBe('abc')

  expect(new AppExceptionHttpForbidden('Test').functionNameSource).toBe(
    'AppExceptionHttpForbidden'
  )
  expect(new AppExceptionHttpForbidden().functionNameSource).toBe(
    'AppExceptionHttpForbidden'
  )
})

test('AppExceptionHttpNotAcceptable default', () => {
  const hex = new AppExceptionHttpNotAcceptable('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttpNotAcceptable')
  expect(hex.httpStatusCode).toBe(406)

  expect(new AppExceptionHttpNotAcceptable('Test').functionNameSource).toBe(
    'AppExceptionHttpNotAcceptable'
  )
  expect(new AppExceptionHttpNotAcceptable().functionNameSource).toBe(
    'AppExceptionHttpNotAcceptable'
  )
})

test('AppExceptionHttpNotAllowed default', () => {
  const hex = new AppExceptionHttpNotAllowed('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttpNotAllowed')
  expect(hex.httpStatusCode).toBe(405)

  expect(new AppExceptionHttpNotAllowed('Test').functionNameSource).toBe(
    'AppExceptionHttpNotAllowed'
  )
  expect(new AppExceptionHttpNotAllowed().functionNameSource).toBe(
    'AppExceptionHttpNotAllowed'
  )
})

test('AppExceptionHttpNotFound default', () => {
  const hex = new AppExceptionHttpNotFound('Test', '')
  expect(hex.message).toBe('Test')
  expect(hex.functionNameSource).toBe('AppExceptionHttpNotFound')
  expect(hex.httpStatusCode).toBe(404)

  expect(new AppExceptionHttpNotFound('Test').functionNameSource).toBe(
    'AppExceptionHttpNotFound'
  )
  expect(new AppExceptionHttpNotFound().functionNameSource).toBe(
    'AppExceptionHttpNotFound'
  )
})

test('IsErrorMessage', () => {
  expect(IsErrorMessage('Test')).toBe(false)
  expect(IsErrorMessage(new Error('Test'))).toBe(true)
  expect(IsErrorMessage(new AppException('Test'))).toBe(true)
  expect(IsErrorMessage({})).toBe(false)
  expect(IsErrorMessage(null)).toBe(false)
  expect(IsErrorMessage(undefined)).toBe(false)
})

test('GetErrorMessage', () => {
  expect(GetErrorMessage('Test')).toBe('Test')
  expect(GetErrorMessage(new Error('Test'))).toBe('Test')
  expect(GetErrorMessage(new AppException('Test'))).toBe('Test')
  expect(GetErrorMessage({})).toBe('Unknown error')
  expect(GetErrorMessage(null)).toBe('Unknown error')
  expect(GetErrorMessage(undefined)).toBe('Unknown error')
})

describe(GetErrorMessage.name, () => {
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
