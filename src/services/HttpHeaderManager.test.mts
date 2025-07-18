import { StringOrStringArrayObject } from '../models/types.mjs'
import {
  HttpHeaderManager,
  HttpHeaderManagerBase,
  HttpHeaderNamesAllowed,
} from './HttpHeaderManager.mjs'
import { GenerateSignedJwtToken, TEST_Parameters_DEV } from '../jest.setup.mjs'
import { JwtTokenWithUserId } from './jwt.mjs'
import { IncomingHttpHeaders } from 'node:http'

test('getHeaderString', () => {
  const init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.Authorization]: TEST_Parameters_DEV.jwt,
  },
   hm = new HttpHeaderManagerBase(init),

   headerString = hm.getHeaderString(HttpHeaderNamesAllowed.Authorization)
  expect(headerString).toBe(TEST_Parameters_DEV.jwt)
})

test('bearerToken', () => {
  const val = TEST_Parameters_DEV.jwt,

   init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.Authorization]: val,
  },
   hm = new HttpHeaderManagerBase(init),

   bt = hm.bearerToken
  expect(bt).toBeDefined()
})

test('uppercase header name', () => {
  const init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.Authorization.toUpperCase()]:
      TEST_Parameters_DEV.jwt,
  },
   hm = new HttpHeaderManagerBase(init),

   bt = hm.bearerToken
  expect(bt).toBeDefined()
})

test('jwtTokenMustExistAndBeValid', () => {
  const val = TEST_Parameters_DEV.jwt,

   init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.Authorization]: val,
  },
   hm = new HttpHeaderManagerBase(init)

  expect(() => hm.jwtTokenMustExistAndBeValid).toThrow(
    'Invalid security token when attempting to decode the JWT.'
  )
})

test('jwtToken', () => {
  const init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.Authorization]: `Bearer ${TEST_Parameters_DEV.jwt}`,
  },
   hm = new HttpHeaderManagerBase(init),

   jwt = hm.jwtToken
  expect(jwt?.email).toBe(TEST_Parameters_DEV.userIdGoodEmail)

  init.authorization = ''
  expect(new HttpHeaderManagerBase(init).jwtToken).toBeUndefined()
})

describe('userIdFromJwt', () => {
  test('raw header for JWT', () => {
    const val = JwtTokenWithUserId(
      TEST_Parameters_DEV.userIdGood.toString(),
      TEST_Parameters_DEV.rsaPassPhrase
    ),

     init: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowed.Authorization]: `Bearer ${val}`,
    },
     hm = new HttpHeaderManagerBase(init),

     userid = hm.userId
    expect(userid).toBe(TEST_Parameters_DEV.userIdGood.toString())
  })

  test('userId is 0', () => {
    const jwt = GenerateSignedJwtToken(''),
     init: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowed.Authorization]: `Bearer ${jwt}`,
    },
     hm = new HttpHeaderManagerBase(init)

    expect(() => hm.userId).toThrow()
  })
})

describe('HttpHeaderManager', () => {
  test('Constructor', () => {
    const req = {
      body: { 'my-test': 'my-test' },
      headers: { 'my-test': 'my-test', 'my2': undefined },
    },

     ab = new HttpHeaderManager(req.headers)

    expect(ab).toBeInstanceOf(HttpHeaderManager)
    expect(ab.headers).toEqual({ 'my-test': 'my-test', 'my2': '' })
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

  const val = 'true',

   init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.ShowDebug]: val,
  },
   hm = new HttpHeaderManagerBase(init)

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
    headers: { referer: 'anything.com' },
  },

   ab = new HttpHeaderManager(req.headers)

  expect(ab).toBeInstanceOf(HttpHeaderManager)
  expect(ab.referrer).toBe('anything.com')
})

test('applicationName', () => {
  const req = {
    body: { 'my-test': 'my-test' },
    headers: { [HttpHeaderNamesAllowed.ApplicationName]: 'TestApp' },
  },
   ab = new HttpHeaderManager(req.headers)
  expect(ab).toBeInstanceOf(HttpHeaderManager)
  expect(ab.applicationName).toBe('TestApp')
})

test('HeadersToStringOrStringObject', () => {
  const req = {
    body: { 'my-test': 'my-test' },
    headers: {
      [HttpHeaderNamesAllowed.ApplicationName]: 'TestApp',
      [HttpHeaderNamesAllowed.Authorization]: TEST_Parameters_DEV.jwt,
      [HttpHeaderNamesAllowed.ShowDebug]: 'true',
    },
  },

   ab = new HttpHeaderManager(req.headers)
  expect(ab).toBeInstanceOf(HttpHeaderManager)
  expect(ab.headers).toEqual({
    [HttpHeaderNamesAllowed.ApplicationName]: 'TestApp',
    [HttpHeaderNamesAllowed.Authorization]: TEST_Parameters_DEV.jwt,
    [HttpHeaderNamesAllowed.ShowDebug]: 'true',
  })
  expect(HttpHeaderManager.HeadersToStringOrStringObject(ab.headers)).toEqual({
    [HttpHeaderNamesAllowed.ApplicationName]: 'TestApp',
    [HttpHeaderNamesAllowed.Authorization]: TEST_Parameters_DEV.jwt,
    [HttpHeaderNamesAllowed.ShowDebug]: 'true',
  })
  expect(
    HttpHeaderManager.HeadersToStringOrStringObject(
      true as unknown as IncomingHttpHeaders
    )
  ).toEqual({})
})
