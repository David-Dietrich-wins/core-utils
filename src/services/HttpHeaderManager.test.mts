/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CONST_JwtErrorDecode,
  CONST_JwtErrorRetrieveUserId,
  JwtTokenWithEmail,
} from './jwt.mjs'
import { GenerateSignedJwtToken, TEST_Settings } from '../jest.setup.mjs'
import {
  HttpHeaderManager,
  HttpHeaderManagerBase,
  HttpHeaderNamesAllowedKeys,
} from './HttpHeaderManager.mjs'
import { AppException } from '../models/AppException.mjs'
import { IncomingHttpHeaders } from 'node:http'
import { StringOrStringArrayObject } from '../models/types.mjs'

test('getHeaderString', () => {
  const ainit: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowedKeys.Authorization]: TEST_Settings.jwt,
    },
    ham = new HttpHeaderManagerBase(ainit),
    headerString = ham.getHeaderString(HttpHeaderNamesAllowedKeys.Authorization)
  expect(headerString).toBe(TEST_Settings.jwt)
})

test('bearerToken', () => {
  const aaval = TEST_Settings.jwt,
    ainit: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowedKeys.Authorization]: aaval,
    },
    hm = new HttpHeaderManagerBase(ainit),
    hmbt = hm.bearerToken

  expect(hmbt).toBeDefined()
})

test('uppercase header name', () => {
  const ainit: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowedKeys.Authorization.toUpperCase()]:
        TEST_Settings.jwt,
    },
    hm = new HttpHeaderManagerBase(ainit),
    hmbt = hm.bearerToken

  expect(hmbt).toBeDefined()
})

test('jwtTokenMustExistAndBeValid', () => {
  const aaval = TEST_Settings.jwt,
    ainit: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowedKeys.Authorization]: aaval,
    },
    hm = new HttpHeaderManagerBase(ainit)

  expect(() => hm.jwtTokenMustExistAndBeValid).toThrow(CONST_JwtErrorDecode)
})

test('jwtToken', () => {
  const ainit: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowedKeys.Authorization]: `Bearer ${TEST_Settings.jwt}`,
    },
    hm = new HttpHeaderManagerBase(ainit),
    jwt = hm.jwtToken
  expect(jwt?.email).toBe(TEST_Settings.userIdGoodEmail)

  ainit.authorization = ''
  expect(new HttpHeaderManagerBase(ainit).jwtToken).toBeUndefined()
})

describe('userIdFromJwt', () => {
  test('raw header for JWT', () => {
    const aaval = JwtTokenWithEmail(
        TEST_Settings.userIdGoodEmail,
        TEST_Settings.rsaPrivateKey,
        TEST_Settings.rsaPassPhrase
      ),
      ainit: StringOrStringArrayObject = {
        [HttpHeaderNamesAllowedKeys.Authorization]: `Bearer ${aaval}`,
      },
      hm = new HttpHeaderManagerBase(ainit),
      userid = hm.userId

    expect(userid).toBe(TEST_Settings.userIdGoodEmail)
  })

  test('userId is 0', () => {
    const ajwt = GenerateSignedJwtToken(''),
      binit: StringOrStringArrayObject = {
        [HttpHeaderNamesAllowedKeys.Authorization]: `Bearer ${ajwt}`,
      }

    expect(() => new HttpHeaderManagerBase(binit).userId).toThrow(
      new AppException(CONST_JwtErrorRetrieveUserId, 'userIdFromJwt')
    )
  })
})

describe('HttpHeaderManager', () => {
  test('Constructor', () => {
    const req = {
        body: { 'my-test': 'my-test' },
        headers: { 'my-test': 'my-test', 'my2': undefined },
      },
      zab = new HttpHeaderManager(req.headers)

    expect(zab).toBeInstanceOf(HttpHeaderManager)
    expect(zab.headers).toEqual({ 'my-test': 'my-test', 'my2': '' })
  })

  test('Constructor with raw Headers', () => {
    const req = {
      body: { 'my-test': 'my-test' },
      headers: { 'my-test': 'my-test', 'my2': undefined },
    }

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

  const aaval = 'true',
    ainit: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowedKeys.ShowDebug]: aaval,
    },
    hm = new HttpHeaderManagerBase(ainit)

  expect(hm.showDebug).toBe(true)
})

test('BearerTokenParse', () => {
  const val = TEST_Settings.jwt

  let bt = HttpHeaderManagerBase.BearerTokenParse(val)
  expect(bt).toBe(val)

  bt = HttpHeaderManagerBase.BearerTokenParse(`Bearer ${val}`)
  expect(bt).toBe(val)
})

test('referrer', () => {
  const req = {
      body: { 'my-test': 'my-test' },
      headers: { referer: 'anything.com' },
    },
    zab = new HttpHeaderManager(req.headers)

  expect(zab).toBeInstanceOf(HttpHeaderManager)
  expect(zab.referrer).toBe('anything.com')
})

test('applicationName', () => {
  const req = {
      body: { 'my-test': 'my-test' },
      headers: { [HttpHeaderNamesAllowedKeys.ApplicationName]: 'TestApp' },
    },
    zab = new HttpHeaderManager(req.headers)
  expect(zab).toBeInstanceOf(HttpHeaderManager)
  expect(zab.applicationName).toBe('TestApp')
})

test('HeadersToStringOrStringObject', () => {
  const req = {
      body: { 'my-test': 'my-test' },
      headers: {
        [HttpHeaderNamesAllowedKeys.ApplicationName]: 'TestApp',
        [HttpHeaderNamesAllowedKeys.Authorization]: TEST_Settings.jwt,
        [HttpHeaderNamesAllowedKeys.ShowDebug]: 'true',
      },
    },
    zab = new HttpHeaderManager(req.headers)

  expect(zab).toBeInstanceOf(HttpHeaderManager)
  expect(zab.headers).toEqual({
    [HttpHeaderNamesAllowedKeys.ApplicationName]: 'TestApp',
    [HttpHeaderNamesAllowedKeys.Authorization]: TEST_Settings.jwt,
    [HttpHeaderNamesAllowedKeys.ShowDebug]: 'true',
  })
  expect(HttpHeaderManager.HeadersToStringOrStringObject(zab.headers)).toEqual({
    [HttpHeaderNamesAllowedKeys.ApplicationName]: 'TestApp',
    [HttpHeaderNamesAllowedKeys.Authorization]: TEST_Settings.jwt,
    [HttpHeaderNamesAllowedKeys.ShowDebug]: 'true',
  })
  expect(
    HttpHeaderManager.HeadersToStringOrStringObject(
      true as unknown as IncomingHttpHeaders
    )
  ).toEqual({})
})
