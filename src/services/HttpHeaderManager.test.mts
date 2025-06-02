import { StringOrStringArrayObject } from '../models/types.mjs'
import {
  HttpHeaderManager,
  HttpHeaderManagerBase,
  HttpHeaderNamesAllowed,
} from './HttpHeaderManager.mjs'
import { GenerateSignedJwtToken, TEST_Parameters_DEV } from '../jest.setup.mjs'
import { JwtTokenWithUserId } from './jwt.mjs'

test('getHeaderString', () => {
  const init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.Authorization]: TEST_Parameters_DEV.jwt,
  }
  const hm = new HttpHeaderManagerBase(init)

  const headerString = hm.getHeaderString(HttpHeaderNamesAllowed.Authorization)
  expect(headerString).toBe(TEST_Parameters_DEV.jwt)
})

test('bearerToken', () => {
  const val = TEST_Parameters_DEV.jwt

  const init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.Authorization]: val,
  }
  const hm = new HttpHeaderManagerBase(init)

  const bt = hm.bearerToken
  expect(bt).toBeDefined()
})

test('uppercase header name', () => {
  const init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.Authorization.toUpperCase()]:
      TEST_Parameters_DEV.jwt,
  }
  const hm = new HttpHeaderManagerBase(init)

  const bt = hm.bearerToken
  expect(bt).toBeDefined()
})

test('jwtTokenMustExistAndBeValid', () => {
  const val = TEST_Parameters_DEV.jwt

  const init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.Authorization]: val,
  }
  const hm = new HttpHeaderManagerBase(init)

  expect(() => hm.jwtTokenMustExistAndBeValid).toThrow(
    'Invalid security token when attempting to decode the JWT.'
  )
})

test('jwtToken', () => {
  const init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.Authorization]: `Bearer ${TEST_Parameters_DEV.jwt}`,
  }
  const hm = new HttpHeaderManagerBase(init)

  const jwt = hm.jwtToken
  expect(jwt?.email).toBe(TEST_Parameters_DEV.userIdGoodEmail)

  init.authorization = ''
  expect(new HttpHeaderManagerBase(init).jwtToken).toBeUndefined()
})

describe('userIdFromJwt', () => {
  test('raw header for JWT', () => {
    const val = JwtTokenWithUserId(
      TEST_Parameters_DEV.userIdGood.toString(),
      TEST_Parameters_DEV.rsaPassPhrase
    )

    const init: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowed.Authorization]: `Bearer ${val}`,
    }
    const hm = new HttpHeaderManagerBase(init)

    const userid = hm.userId
    expect(userid).toBe(TEST_Parameters_DEV.userIdGood.toString())
  })

  test('userId is 0', () => {
    const jwt = GenerateSignedJwtToken('')
    const init: StringOrStringArrayObject = {
      [HttpHeaderNamesAllowed.Authorization]: `Bearer ${jwt}`,
    }
    const hm = new HttpHeaderManagerBase(init)

    expect(() => hm.userId).toThrow()
  })
})

describe('HttpHeaderManager', () => {
  test('Constructor', () => {
    const req = {
      body: { 'my-test': 'my-test' },
      headers: { 'my-test': 'my-test', 'my2': undefined },
    }

    const ab = new HttpHeaderManager(req.headers)

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

  const val = 'true'

  const init: StringOrStringArrayObject = {
    [HttpHeaderNamesAllowed.ShowDebug]: val,
  }
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
    headers: { referer: 'anything.com' },
  }

  const ab = new HttpHeaderManager(req.headers)

  expect(ab).toBeInstanceOf(HttpHeaderManager)
  expect(ab.referrer).toBe('anything.com')
})
