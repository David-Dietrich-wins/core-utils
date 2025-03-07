import { Request } from 'express'
import { StringOrStringArrayObject } from '../models/types.mjs'
import {
  CONST_HttpHeaderAuthorization,
  CONST_HttpHeaderShowDebug,
  HttpHeaderManager,
  HttpHeaderManagerBase,
} from './HttpHeaderManager.mjs'
import { GenerateSignedJwtToken, TEST_Parameters_DEV } from '../jest.setup.mjs'

test('getHeaderString', () => {
  const init: StringOrStringArrayObject = {
    [CONST_HttpHeaderAuthorization]: TEST_Parameters_DEV.jwt,
  }
  const hm = new HttpHeaderManagerBase(init)

  const headerString = hm.getHeaderString(CONST_HttpHeaderAuthorization)
  expect(headerString).toBe(TEST_Parameters_DEV.jwt)
})

test('bearerToken', () => {
  const val = TEST_Parameters_DEV.jwt

  const init: StringOrStringArrayObject = {
    [CONST_HttpHeaderAuthorization]: val,
  }
  const hm = new HttpHeaderManagerBase(init)

  const bt = hm.bearerToken
  expect(bt).toBeDefined()
})

test('uppercase header name', () => {
  const init: StringOrStringArrayObject = {
    [CONST_HttpHeaderAuthorization.toUpperCase()]: TEST_Parameters_DEV.jwt,
  }
  const hm = new HttpHeaderManagerBase(init)

  const bt = hm.bearerToken
  expect(bt).toBeDefined()
})

test('jwtTokenMustExistAndBeValid', () => {
  const val = TEST_Parameters_DEV.jwt

  const init: StringOrStringArrayObject = {
    [CONST_HttpHeaderAuthorization]: val,
  }
  const hm = new HttpHeaderManagerBase(init)

  expect(() => hm.jwtTokenMustExistAndBeValid).toThrow(
    'Invalid security token when attempting to decode the JWT.'
  )
})

test('jwtToken', () => {
  const init: StringOrStringArrayObject = {
    [CONST_HttpHeaderAuthorization]: `Bearer ${TEST_Parameters_DEV.jwt}`,
  }
  const hm = new HttpHeaderManagerBase(init)

  const jwt = hm.jwtToken
  expect(jwt?.userId).toBe(TEST_Parameters_DEV.userIdGood)

  init.authorization = ''
  expect(new HttpHeaderManagerBase(init).jwtToken).toBeUndefined()
})

describe('userIdFromJwt', () => {
  test('raw header for JWT', () => {
    const val = TEST_Parameters_DEV.jwt

    const init: StringOrStringArrayObject = {
      [CONST_HttpHeaderAuthorization]: `Bearer ${val}`,
    }
    const hm = new HttpHeaderManagerBase(init)

    const userid = hm.userId
    expect(userid).toBe(TEST_Parameters_DEV.userIdGood)
  })

  test('userId is 0', () => {
    const jwt = GenerateSignedJwtToken(0)
    const init: StringOrStringArrayObject = {
      [CONST_HttpHeaderAuthorization]: `Bearer ${jwt}`,
    }
    const hm = new HttpHeaderManagerBase(init)

    expect(() => hm.userId).toThrow()
  })
})

describe('HttpHeaderManager', () => {
  test('Constructor', () => {
    const req = {
      body: { 'my-test': 'my-test' },
    } as Request

    req.headers = { 'my-test': 'my-test', 'my2': undefined }

    const ab = new HttpHeaderManager(req.headers)

    expect(ab).toBeInstanceOf(HttpHeaderManager)
    expect(ab.headers).toEqual({ 'my-test': 'my-test', 'my2': '' })
  })

  test('Constructor with raw Headers', () => {
    const req = {
      body: { 'my-test': 'my-test' },
    } as Request

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(req as any).rawHeaders = [
      'my-test',
      'my-test',
      'my-test2',
      'my-test2',
      'my-test3',
      'my-test3',
    ]
    const ab = new HttpHeaderManager(req.headers)
    expect(ab).toBeInstanceOf(HttpHeaderManager)
  })
})

test('showDebug', () => {
  const hmno = new HttpHeaderManagerBase({})
  expect(hmno.showDebugExists).toBe(false)

  const val = 'true'

  const init: StringOrStringArrayObject = { [CONST_HttpHeaderShowDebug]: val }
  const hm = new HttpHeaderManagerBase(init)

  expect(hm.showDebug).toBe(true)
})

test('BearerTokenParse', () => {
  const val = TEST_Parameters_DEV.jwt

  let bt = HttpHeaderManagerBase.BearerTokenParse(val)
  expect(bt).toBe(val)

  bt = HttpHeaderManagerBase.BearerTokenParse(`Bearer ${val}`)
  expect(bt).toBe(val)
})

test('referrer', () => {
  const req = {
    body: { 'my-test': 'my-test' },
  } as Request

  req.headers = { referer: 'anything.com' }

  const ab = new HttpHeaderManager(req.headers)

  expect(ab).toBeInstanceOf(HttpHeaderManager)
  expect(ab.referrer).toBe('anything.com')
})
