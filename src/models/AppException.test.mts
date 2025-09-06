import {
  AppException,
  AppExceptionHttp,
  AppExceptionHttpForbidden,
  AppExceptionHttpNotAcceptable,
  AppExceptionHttpNotAllowed,
  AppExceptionHttpNotFound,
  AppExceptionHttpUnauthorized,
  AppExceptionSecurity,
  getErrorMessage,
  isErrorMessage,
} from './AppException.mjs'
import { describe, expect, it } from '@jest/globals'

describe('appException', () => {
  it('good', () => {
    expect.assertions(2)

    const ie = new AppException('Test', 'test')

    expect(ie.message).toBe('Test')
    expect(ie.functionNameSource).toBe('test')
  })

  it('no function name source', () => {
    expect.assertions(3)

    const ie = new AppException('Test')

    expect(ie.message).toBe('Test')
    expect(ie.functionNameSource).toBe('AppException')

    expect(new AppException('test', '').functionNameSource).toBe(
      AppException.name
    )
  })
})

describe('security exceptions', () => {
  it('good', () => {
    expect.assertions(3)

    const ie = new AppExceptionSecurity('Test', 'test')

    expect(ie.message).toBe('Test')
    expect(ie.functionNameSource).toBe('test')

    expect(new AppExceptionSecurity('Test').functionNameSource).toBe(
      'AppExceptionSecurity'
    )
  })
})

describe('http exceptions', () => {
  it('appExceptionHttp good', () => {
    expect.assertions(3)

    const hex = new AppExceptionHttp('Test', 'AppExceptionHttp good')

    expect(hex.message).toBe('Test')
    expect(hex.functionNameSource).toBe('AppExceptionHttp good')
    expect(hex.httpStatusCode).toBe(500)
  })

  it('appExceptionHttp default', () => {
    expect.assertions(4)

    const hex = new AppExceptionHttp('Test', '')

    expect(hex.message).toBe('Test')
    expect(hex.functionNameSource).toBe('AppExceptionHttp')
    expect(hex.httpStatusCode).toBe(500)

    expect(new AppExceptionHttp('Test').functionNameSource).toBe(
      'AppExceptionHttp'
    )
  })

  it('httpUnauthorized default', () => {
    expect.assertions(5)

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

  it('unauthorized', () => {
    expect.assertions(6)

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

  it('forbidden default', () => {
    expect.assertions(5)

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

  it('forbidden', () => {
    expect.assertions(6)

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

  it('notAcceptable default', () => {
    expect.assertions(5)

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

  it('notAllowed default', () => {
    expect.assertions(5)

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

  it('notFound default', () => {
    expect.assertions(5)

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
})

describe('misc', () => {
  it('isErrorMessage', () => {
    expect.assertions(6)

    expect(isErrorMessage('Test')).toBe(false)
    expect(isErrorMessage(new Error('Test'))).toBe(true)
    expect(isErrorMessage(new AppException('Test'))).toBe(true)
    expect(isErrorMessage({})).toBe(false)
    expect(isErrorMessage(null)).toBe(false)
    expect(isErrorMessage(undefined)).toBe(false)
  })
})

describe('getErrorMessage', () => {
  it('getErrorMessage', () => {
    expect.assertions(6)

    expect(getErrorMessage('Test')).toBe('Test')
    expect(getErrorMessage(new Error('Test'))).toBe('Test')
    expect(getErrorMessage(new AppException('Test'))).toBe('Test')
    expect(getErrorMessage({})).toBe('Unknown error')
    expect(getErrorMessage(null)).toBe('Unknown error')
    expect(getErrorMessage(undefined)).toBe('Unknown error')
  })

  it('objects', () => {
    expect.assertions(5)

    const e = new Error()

    e.message = undefined as unknown as string

    const ret = getErrorMessage(e)

    expect(ret).toBe('Unknown error')

    expect(getErrorMessage(new Error('test error'))).toBe('test error')
    expect(getErrorMessage({})).toBe('Unknown error')
    expect(getErrorMessage({ a: 'a' })).toBe('Unknown error')
    expect(getErrorMessage({ message: 'test object error' })).toBe(
      'test object error'
    )
  })

  it('strings', () => {
    expect.assertions(2)

    expect(getErrorMessage('')).toBe('Unknown error')
    expect(getErrorMessage('test string error')).toBe('test string error')
  })

  it('boolean', () => {
    expect.assertions(2)

    expect(getErrorMessage(true)).toBe('true')
    expect(getErrorMessage(false)).toBe('false')
  })

  it('unknown', () => {
    expect.assertions(4)

    expect(getErrorMessage(undefined)).toBe('Unknown error')
    expect(getErrorMessage(null)).toBe('Unknown error')
    expect(getErrorMessage(new Date())).toBe('Unknown error')
    // This is the default case for unknown types
    expect(getErrorMessage(BigInt(5))).toBe('Unknown error')
  })

  it('number', () => {
    expect.assertions(3)

    expect(getErrorMessage(0)).toBe('0')
    expect(getErrorMessage(-1000.246)).toBe('-1000.246')
    expect(getErrorMessage(42)).toBe('42')
  })
})
