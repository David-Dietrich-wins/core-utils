import { JwtHeader, JwtPayload, Secret, SignOptions } from 'jsonwebtoken'
import {
  JwtDecode,
  JwtAccessToken,
  JwtRetrieveUserId,
  JwtSign,
  JwtVerify,
  IJwtWithUserId,
  IJwtAccessToken,
  FromHeaders,
  FromBearerToken,
} from './jwt.mjs'
import { safestr } from './general.mjs'
import { GenerateSignedJwtToken, TEST_Parameters_DEV } from '../jest.setup.mjs'

describe('JwtDecode', () => {
  test('good', () => {
    const jwtdata = JwtDecode<IJwtWithUserId>(TEST_Parameters_DEV.jwt)

    expect(jwtdata.userId).toBe(TEST_Parameters_DEV.userIdGood)
  })

  test('bad', () => {
    try {
      JwtDecode('bad')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toBe(
        'Invalid security token when attempting to decode the JWT.'
      )
      expect(e.stack).toMatch(
        /^Error: Invalid security token when attempting to decode the JWT./
      )
    }

    expect.assertions(3)
  })
})

test('JwtRetrieveUserId', () => {
  const jwtdata = JwtRetrieveUserId(TEST_Parameters_DEV.jwt)

  expect(jwtdata).toBe(TEST_Parameters_DEV.userIdGood)
})

test('JwtDecode', () => {
  const jwtdata: string | JwtPayload | null = JwtDecode(TEST_Parameters_DEV.jwt)

  expect(jwtdata.userId).toBe(TEST_Parameters_DEV.userIdGood)
})

test('JwtSign', () => {
  const header: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const signOptions: SignOptions = {
    header,
  }

  const payload = {
    userId: TEST_Parameters_DEV.userIdGood,
  }

  const jwtToken = JwtSign(
    payload,
    safestr(TEST_Parameters_DEV.rsaPassPhrase),
    signOptions
  )
  expect(jwtToken.length).toBeGreaterThan(10)

  const jwtdata = JwtDecode<IJwtWithUserId>(jwtToken)

  expect(jwtdata.userId).toBe(TEST_Parameters_DEV.userIdGood)
})

test('JwtVerify bad', () => {
  const secretOrPublicKey: Secret = 'anything'

  expect(() => JwtVerify(TEST_Parameters_DEV.jwt, secretOrPublicKey)).toThrow()
})

test('JwtVerify good', () => {
  const header: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const signOptions: SignOptions = {
    header,
  }

  const payload = {
    userId: TEST_Parameters_DEV.userIdGood,
  }

  const jwtToken = JwtSign(
    payload,
    safestr(TEST_Parameters_DEV.rsaPassPhrase),
    signOptions
  )
  expect(jwtToken.length).toBeGreaterThan(10)

  const jwtdata = JwtDecode<IJwtWithUserId>(jwtToken)

  expect(jwtdata.userId).toBe(TEST_Parameters_DEV.userIdGood)

  const secretOrPublicKey: Secret = safestr(TEST_Parameters_DEV.rsaPassPhrase)

  const verified = JwtVerify(jwtToken, secretOrPublicKey)
  expect((verified as IJwtWithUserId).userId).toBe(
    TEST_Parameters_DEV.userIdGood
  )
})

describe('JwtAccessClient', () => {
  test('Constructor from token', () => {
    const jwtdata = JwtDecode<IJwtAccessToken>(TEST_Parameters_DEV.jwt)

    const jwt = new JwtAccessToken(jwtdata)

    expect(jwt.FusionAuthUserId).toBe(TEST_Parameters_DEV.userIdGood)
  })
  test('Constructor from string', () => {
    const jwt = JwtAccessToken.Create(TEST_Parameters_DEV.jwt)

    expect(jwt.email).toBe(TEST_Parameters_DEV.userIdGoodEmail)
  })
  test('Constructor from null', () => {
    expect(JwtAccessToken.Create('')).toThrow(
      'Invalid security token when attempting to decode the JWT.'
    )
  })

  test('FromHeaders', () => {
    const headers = {
      authorization: `Bearer ${TEST_Parameters_DEV.jwt}`,
    }

    const jwt = FromHeaders(JwtAccessToken, headers)

    expect(jwt.email).toBe(TEST_Parameters_DEV.userIdGoodEmail)
  })

  test('FromHeaders Headers object', () => {
    const headers = {
      authorization: `Bearer ${TEST_Parameters_DEV.jwt}`,
      get: (key: string) => {
        return headers[key]
      },
    } as unknown as Headers

    expect(FromHeaders(JwtAccessToken, headers)).toThrow(
      'Invalid security token when attempting to decode the JWT.'
    )
  })

  test('FromString', () => {
    expect(
      FromBearerToken(JwtAccessToken, `Bearer ${TEST_Parameters_DEV.jwt}`).email
    ).toBe(TEST_Parameters_DEV.userIdGoodEmail)
  })

  test('issuer', () => {
    const jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGoodEmail, {
      iss: 'anything.com',
    })
    const jhelper = FromBearerToken(JwtAccessToken, jwt)

    expect(jhelper.email).toBe(TEST_Parameters_DEV.userIdGoodEmail)
    expect(jhelper.issuer).toBe('anything')
  })

  test('Application Roles', () => {
    let jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGoodEmail, {
      iss: 'anything.com',
      roles: ['admin', 'user'],
    })
    let jhelper = JwtAccessToken.Create(jwt)
    expect(jhelper.ApplicationRoles).toEqual(['admin', 'user'])
    expect(jhelper.isAdmin).toBeTruthy()

    jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGoodEmail, {
      roles: ['admin'],
    })
    jhelper = JwtAccessToken.Create(jwt)
    expect(jhelper.ApplicationRoles).toEqual(['admin', 'user'])
    expect(jhelper.isAdmin).toBeTruthy()

    jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGoodEmail, {
      roles: ['user'],
    })
    jhelper = JwtAccessToken.Create(jwt)
    expect(jhelper.ApplicationRoles).toEqual(['user'])
    expect(jhelper.isAdmin).toBeFalsy()
  })

  test('others', () => {
    const jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGoodEmail, {
      aud: 'anything',
      auth_time: 123,
      iat: 2048,
      sid: 'refresh',
      sub: 'my FusionAuthUserId',
      tid: 'tenant',
    })
    const jhelper = FromBearerToken(JwtAccessToken, jwt)

    expect(jhelper.audience).toBe('anything')
    expect(jhelper.authenticationTime).toBe(123)
    expect(jhelper.email).toBe(TEST_Parameters_DEV.userIdGoodEmail)
    expect(jhelper.FusionAuthUserId).toBe('my FusionAuthUserId')
    expect(jhelper.issuedTime).toBe(2048)
    expect(jhelper.refreshToken).toBe('refresh')
    expect(jhelper.tenantId).toBe('tenant')
  })
})
