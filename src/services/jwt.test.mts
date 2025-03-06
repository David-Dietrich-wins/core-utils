import { JwtHeader, JwtPayload, Secret, SignOptions } from 'jsonwebtoken'
import {
  IJwtAccessClient,
  JwtDecode,
  JwtHelper,
  JwtRetrieveUserId,
  JwtSign,
  JwtVerify,
} from './jwt.mjs'
import { safestr } from './general.mjs'
import { GenerateSignedJwtToken, TEST_Parameters_DEV } from '../jest.setup.mjs'

describe('JwtDecode', () => {
  test('good', () => {
    const jwtdata = JwtDecode(TEST_Parameters_DEV.jwt)

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

  const jwtdata = JwtDecode(jwtToken)

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

  const jwtdata = JwtDecode(jwtToken)

  expect(jwtdata.userId).toBe(TEST_Parameters_DEV.userIdGood)

  const secretOrPublicKey: Secret = safestr(TEST_Parameters_DEV.rsaPassPhrase)

  const verified = JwtVerify(jwtToken, secretOrPublicKey)
  expect((verified as IJwtAccessClient).userId).toBe(
    TEST_Parameters_DEV.userIdGood
  )
})

describe('JwtHelper', () => {
  test('Constructor from token', () => {
    const jwtdata = JwtDecode(TEST_Parameters_DEV.jwt)

    const jwt = new JwtHelper(jwtdata)

    expect(jwt.userId).toBe(TEST_Parameters_DEV.userIdGood)
  })
  test('Constructor from string', () => {
    const jwt = new JwtHelper(TEST_Parameters_DEV.jwt)

    expect(jwt.userId).toBe(TEST_Parameters_DEV.userIdGood)
  })
  test('Constructor from null', () => {
    const jwt = new JwtHelper(null)

    expect(jwt.uid).toBe('')
  })
  test('Constructor default', () => {
    const jwt = new JwtHelper()

    expect(jwt.uid).toBe('')
  })

  test('FromHeaders', () => {
    const headers = {
      authorization: `Bearer ${TEST_Parameters_DEV.jwt}`,
    }

    const jwt = JwtHelper.FromHeaders(headers)

    expect(jwt.userId).toBe(TEST_Parameters_DEV.userIdGood)
  })

  test('FromHeaders Headers object', () => {
    const headers = {
      authorization: `Bearer ${TEST_Parameters_DEV.jwt}`,
      get: (key: string) => {
        return headers[key]
      },
    } as unknown as Headers

    const jwt = JwtHelper.FromHeaders(headers)

    expect(jwt.userId).toBe(TEST_Parameters_DEV.userIdGood)
  })

  test('FromString', () => {
    const jwt = JwtHelper.FromString(`Bearer ${TEST_Parameters_DEV.jwt}`)

    expect(jwt.userId).toBe(TEST_Parameters_DEV.userIdGood)
  })

  test('issuer', () => {
    const jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGood, {
      iss: 'anything.com',
    })
    const jhelper = new JwtHelper(jwt)

    expect(jhelper.userId).toBe(TEST_Parameters_DEV.userIdGood)
    expect(jhelper.issuer).toBe('anything')
  })

  test('Application Roles', () => {
    let jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGood, {
      roles: ['admin', 'user'],
    })
    let jhelper = new JwtHelper(jwt)
    expect(jhelper.ApplicationRoles).toEqual(['admin', 'user'])

    jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGood, {
      roles: ['admin'],
    })
    jhelper = new JwtHelper(jwt)
    expect(jhelper.ApplicationRoles).toEqual(['admin', 'user'])

    jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGood, {
      roles: ['user'],
    })
    jhelper = new JwtHelper(jwt)
    expect(jhelper.ApplicationRoles).toEqual(['user'])
  })

  test('others', () => {
    const jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGood, {
      aud: 'anything',
      auth_time: 123,
      iat: 2048,
      sid: 'refresh',
      sub: 'my FusionAuthUserId',
      tid: 'tenant',
    })
    const jhelper = new JwtHelper(jwt)

    expect(jhelper.audience).toBe('anything')
    expect(jhelper.authenticationTime).toBe(123)
    expect(jhelper.userId).toBe(TEST_Parameters_DEV.userIdGood)
    expect(jhelper.FusionAuthUserId).toBe('my FusionAuthUserId')
    expect(jhelper.issuedTime).toBe(2048)
    expect(jhelper.refreshToken).toBe('refresh')
    expect(jhelper.tenantId).toBe('tenant')
  })
})
