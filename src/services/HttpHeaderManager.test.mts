/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { GenerateSignedJwtToken, TEST_Settings } from '../jest.setup.mjs'
import {
  HttpHeaderManager,
  HttpHeaderManagerBase,
  HttpHeaderNamesAllowed,
} from './HttpHeaderManager.mjs'
import { IncomingHttpHeaders } from 'node:http'
import { JwtTokenWithUserId } from './jwt.mjs'
import { StringOrStringArrayObject } from '../models/types.mjs'

test('getHeaderString', () => {
  const ainit: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowed.Authorization]: TEST_Settings.jwt,
    },
    ham = new HttpHeaderManagerBase(ainit),
    headerString = ham.getHeaderString(HttpHeaderNamesAllowed.Authorization)
  expect(headerString).toBe(TEST_Settings.jwt)
})

test('bearerToken', () => {
  const aaval = TEST_Settings.jwt,
    ainit: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowed.Authorization]: aaval,
    },
    hm = new HttpHeaderManagerBase(ainit),
    hmbt = hm.bearerToken

  expect(hmbt).toBeDefined()
})

test('uppercase header name', () => {
  const ainit: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowed.Authorization.toUpperCase()]: TEST_Settings.jwt,
    },
    hm = new HttpHeaderManagerBase(ainit),
    hmbt = hm.bearerToken

  expect(hmbt).toBeDefined()
})

test('jwtTokenMustExistAndBeValid', () => {
  const aaval = TEST_Settings.jwt,
    ainit: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowed.Authorization]: aaval,
    },
    hm = new HttpHeaderManagerBase(ainit)

  expect(() => hm.jwtTokenMustExistAndBeValid).toThrow(
    'Invalid security token when attempting to decode the JWT.'
  )
})

test('jwtToken', () => {
  const ainit: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowed.Authorization]: `Bearer ${TEST_Settings.jwt}`,
    },
    hm = new HttpHeaderManagerBase(ainit),
    jwt = hm.jwtToken
  expect(jwt?.email).toBe(TEST_Settings.userIdGoodEmail)

  ainit.authorization = ''
  expect(new HttpHeaderManagerBase(ainit).jwtToken).toBeUndefined()
})

describe('userIdFromJwt', () => {
  test('raw header for JWT', () => {
    const aaval = JwtTokenWithUserId(
        TEST_Settings.userIdGood.toString(),
        TEST_Settings.rsaPassPhrase
      ),
      ainit: StringOrStringArrayObject = {
        [HttpHeaderNamesAllowed.Authorization]: `Bearer ${aaval}`,
      },
      hm = new HttpHeaderManagerBase(ainit),
      userid = hm.userId

    expect(userid).toBe(TEST_Settings.userIdGood.toString())
  })

  test('userId is 0', () => {
    const ajwt = GenerateSignedJwtToken(''),
      binit: StringOrStringArrayObject = {
        [HttpHeaderNamesAllowed.Authorization]: `Bearer ${ajwt}`,
      },
      hm = new HttpHeaderManagerBase(binit)

    expect(() => hm.userId).toThrow()
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
      [HttpHeaderNamesAllowed.ShowDebug]: aaval,
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
      headers: { [HttpHeaderNamesAllowed.ApplicationName]: 'TestApp' },
    },
    zab = new HttpHeaderManager(req.headers)
  expect(zab).toBeInstanceOf(HttpHeaderManager)
  expect(zab.applicationName).toBe('TestApp')
})

test('HeadersToStringOrStringObject', () => {
  const req = {
      body: { 'my-test': 'my-test' },
      headers: {
        [HttpHeaderNamesAllowed.ApplicationName]: 'TestApp',
        [HttpHeaderNamesAllowed.Authorization]: TEST_Settings.jwt,
        [HttpHeaderNamesAllowed.ShowDebug]: 'true',
      },
    },
    zab = new HttpHeaderManager(req.headers)

  expect(zab).toBeInstanceOf(HttpHeaderManager)
  expect(zab.headers).toEqual({
    [HttpHeaderNamesAllowed.ApplicationName]: 'TestApp',
    [HttpHeaderNamesAllowed.Authorization]: TEST_Settings.jwt,
    [HttpHeaderNamesAllowed.ShowDebug]: 'true',
  })
  expect(HttpHeaderManager.HeadersToStringOrStringObject(zab.headers)).toEqual({
    [HttpHeaderNamesAllowed.ApplicationName]: 'TestApp',
    [HttpHeaderNamesAllowed.Authorization]: TEST_Settings.jwt,
    [HttpHeaderNamesAllowed.ShowDebug]: 'true',
  })
  expect(
    HttpHeaderManager.HeadersToStringOrStringObject(
      true as unknown as IncomingHttpHeaders
    )
  ).toEqual({})
})
