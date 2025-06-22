import { JwtHeader, JwtPayload, Secret, SignOptions } from 'jsonwebtoken'
import {
  JwtDecode,
  JwtAccessToken,
  JwtRetrieveUserId,
  JwtSign,
  JwtVerify,
  IJwtWithUserId,
  FromHeaders,
  FromBearerToken,
  JwtBase,
  JwtWithSubject,
  JwtFusionAuthClientCredentials,
  JwtFusionAuthIdToken,
  IJwtFusionAuthIdToken,
  JwtTokenWithUserId,
} from './jwt.mjs'
import { safestr } from './string-helper.mjs'
import { GenerateSignedJwtToken, TEST_Parameters_DEV } from '../jest.setup.mjs'
import { CONST_AppNameTradePlotter } from './HttpHeaderManager.mjs'

describe('JwtDecode', () => {
  let jwt = ''
  beforeAll(() => {
    jwt = JwtSign(
      { userId: TEST_Parameters_DEV.userIdGood },
      safestr(TEST_Parameters_DEV.rsaPassPhrase)
    )
  })

  test('good', () => {
    const jwtdata = JwtDecode<IJwtWithUserId>(jwt)

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

  test('JwtRetrieveUserId', () => {
    const jwtdata = JwtRetrieveUserId(jwt)

    expect(jwtdata).toBe(TEST_Parameters_DEV.userIdGood)
  })

  test('JwtDecode', () => {
    const jwtdata: string | JwtPayload | null = JwtDecode(jwt)

    expect(jwtdata.userId).toBe(TEST_Parameters_DEV.userIdGood)
  })
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
    expect(JwtAccessToken.Create(TEST_Parameters_DEV.jwt).email).toBe(
      TEST_Parameters_DEV.userIdGoodEmail
    )
  })
  test('Constructor from string', () => {
    const jwt = JwtAccessToken.Create(TEST_Parameters_DEV.jwt)

    expect(jwt.email).toBe(TEST_Parameters_DEV.userIdGoodEmail)
  })
  test('Constructor from null', () => {
    expect(() => JwtAccessToken.Create('')).toThrow(
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

    const jwt = FromHeaders(JwtAccessToken, headers)

    expect(jwt.email).toBe(TEST_Parameters_DEV.userIdGoodEmail)
  })

  test('FromHeaders fail no Bearer', () => {
    const headers = {
      authorization: `${TEST_Parameters_DEV.jwt}`,
      get: (key: string) => {
        return headers[key]
      },
    } as unknown as Headers

    expect(() => FromHeaders(JwtAccessToken, headers)).toThrow(
      'Invalid security token when attempting to decode the JWT.'
    )
  })

  test('FromHeaders no data', () => {
    expect(() => FromHeaders(JwtAccessToken)).toThrow(
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
    expect(jhelper.isManager).toBeTruthy()
    expect(jhelper.isUser).toBeTruthy()

    jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGoodEmail, {
      roles: ['admin'],
    })
    jhelper = JwtAccessToken.Create(jwt)
    expect(jhelper.ApplicationRoles).toEqual(['admin'])
    expect(jhelper.isAdmin).toBeTruthy()
    expect(jhelper.isManager).toBeTruthy()
    expect(jhelper.isUser).toBeTruthy()

    jhelper = JwtAccessToken.Create({ ...jhelper, roles: ['user'] })
    expect(jhelper.ApplicationRoles).toEqual(['user'])
    expect(jhelper.isAdmin).toBeFalsy()
    expect(jhelper.isManager).toBeFalsy()
    expect(jhelper.isUser).toBeTruthy()

    jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGoodEmail, {
      roles: ['manager'],
    })
    jhelper = JwtAccessToken.Create(jwt)
    expect(jhelper.ApplicationRoles).toEqual(['manager'])
    expect(jhelper.isAdmin).toBeFalsy()
    expect(jhelper.isManager).toBeTruthy()
    expect(jhelper.isUser).toBeTruthy()

    jwt = GenerateSignedJwtToken(TEST_Parameters_DEV.userIdGoodEmail, {
      roles: ['user'],
    })
    jhelper = JwtAccessToken.Create(jwt)
    expect(jhelper.ApplicationRoles).toEqual(['user'])
    expect(jhelper.isAdmin).toBeFalsy()
    expect(jhelper.isManager).toBeFalsy()
    expect(jhelper.isUser).toBeTruthy()
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

test('JwtBase create', () => {
  const jwtPayload = {
    aud: 'audience',
    exp: 123,
    iat: 456,
    iss: 'issuer',
    jti: 'jti',
    roles: ['user'],
    scope: 'scope',
    tid: 'tenant',
  }

  let jwt = JwtSign(jwtPayload, safestr(TEST_Parameters_DEV.rsaPassPhrase))

  let jhelper = JwtBase.Create(jwt)
  expect(jhelper.audience).toBe('audience')
  expect(jhelper.exp).toBe(123)
  expect(jhelper.iat).toBe(456)
  expect(jhelper.issuer).toBe('issuer')
  expect(jhelper.jti).toBe('jti')
  expect(jhelper.roles).toEqual(['user'])
  expect(jhelper.scope).toBe('scope')
  expect(jhelper.tenantId).toBe('tenant')

  expect(jhelper.isAdmin).toBeFalsy()
  expect(jhelper.isUser).toBeTruthy()

  jwtPayload.iss = 'tradeplotter.com'
  jwt = JwtSign(jwtPayload, safestr(TEST_Parameters_DEV.rsaPassPhrase))
  jhelper = JwtBase.Create(jwt)

  expect(jhelper.isAdmin).toBeFalsy()
  expect(jhelper.isUser).toBeTruthy()
  expect(jhelper.isTradePlotterAdmin).toBeFalsy()
  expect(jhelper.isTradePlotterManager).toBeFalsy()
  expect(jhelper.isTradePlotterUser).toBeTruthy()
  expect(jhelper.isPolitagreeAdmin).toBeFalsy()
  expect(jhelper.isPolitagreeManager).toBeFalsy()
  expect(jhelper.isPolitagreeUser).toBeFalsy()

  jwtPayload.roles = ['admin']
  jwt = JwtSign(jwtPayload, safestr(TEST_Parameters_DEV.rsaPassPhrase))
  jhelper = JwtBase.Create(jwt)

  expect(jhelper.isAdmin).toBeTruthy()
  expect(jhelper.isUser).toBeTruthy()
  expect(jhelper.isTradePlotterAdmin).toBeTruthy()
  expect(jhelper.isTradePlotterManager).toBeTruthy()
  expect(jhelper.isTradePlotterUser).toBeTruthy()
  expect(jhelper.isPolitagreeAdmin).toBeFalsy()
  expect(jhelper.isPolitagreeManager).toBeFalsy()
  expect(jhelper.isPolitagreeUser).toBeFalsy()

  jwtPayload.iss = 'politagree.com'
  jwtPayload.roles = ['user']
  jwt = JwtSign(jwtPayload, safestr(TEST_Parameters_DEV.rsaPassPhrase))
  jhelper = JwtBase.Create(jwt)

  expect(jhelper.isAdmin).toBeFalsy()
  expect(jhelper.isUser).toBeTruthy()
  expect(jhelper.isTradePlotterAdmin).toBeFalsy()
  expect(jhelper.isTradePlotterManager).toBeFalsy()
  expect(jhelper.isTradePlotterUser).toBeFalsy()
  expect(jhelper.isPolitagreeAdmin).toBeFalsy()
  expect(jhelper.isPolitagreeManager).toBeFalsy()
  expect(jhelper.isPolitagreeUser).toBeTruthy()

  jwtPayload.roles = ['admin']
  jwt = JwtSign(jwtPayload, safestr(TEST_Parameters_DEV.rsaPassPhrase))
  jhelper = JwtBase.Create(jwt)

  expect(jhelper.isAdmin).toBeTruthy()
  expect(jhelper.isUser).toBeTruthy()
  expect(jhelper.isTradePlotterAdmin).toBeFalsy()
  expect(jhelper.isTradePlotterManager).toBeFalsy()
  expect(jhelper.isTradePlotterUser).toBeFalsy()
  expect(jhelper.isPolitagreeAdmin).toBeTruthy()
  expect(jhelper.isPolitagreeManager).toBeTruthy()
  expect(jhelper.isPolitagreeUser).toBeTruthy()
})

test('JwtWithSubject', () => {
  const jwtPayload = {
    aud: 'audience',
    exp: 123,
    iat: 456,
    iss: 'issuer',
    jti: 'jti',
    roles: ['user'],
    scope: 'scope',
    tid: 'tenant',
    sub: 'subject',
  }

  let jwt = JwtSign(jwtPayload, safestr(TEST_Parameters_DEV.rsaPassPhrase))

  let jhelper = JwtWithSubject.Create(jwt)
  expect(jhelper.sub).toBe('subject')

  jwtPayload.sub = 'new subject'
  jwt = JwtSign(jwtPayload, safestr(TEST_Parameters_DEV.rsaPassPhrase))
  jhelper = JwtWithSubject.Create(jwt)

  expect(jhelper.sub).toBe('new subject')
})

test('JwtFusionAuthClientCredentials', () => {
  const jwtPayload = {
    aud: 'audience',
    exp: 123,
    iat: 456,
    iss: 'tradeplotter.com',
    jti: 'jti',
    roles: ['user'],
    permissions: ['user'],
    scope: 'scope',
    tid: 'tenant',
    sub: 'subject',
  }

  const jwtsign = JwtSign(
    jwtPayload,
    safestr(TEST_Parameters_DEV.rsaPassPhrase)
  )
  const jwt = JwtFusionAuthClientCredentials.Create(jwtsign)

  expect(jwt.permissions).toStrictEqual(['user'])
  expect(jwt.roles).toStrictEqual(['user'])
  expect(jwt.scope).toBe('scope')
  expect(jwt.tenantId).toBe('tenant')
  expect(jwt.sub).toBe('subject')
  expect(jwt.audience).toBe('audience')
  expect(jwt.exp).toBe(123)
  expect(jwt.iat).toBe(456)
  expect(jwt.iss).toBe('tradeplotter.com')
  expect(jwt.issuer).toBe(CONST_AppNameTradePlotter)
  expect(jwt.jti).toBe('jti')
  expect(jwt.isAdmin).toBeFalsy()
  expect(jwt.isUser).toBeTruthy()
  expect(jwt.isTradePlotter).toBeTruthy()
  expect(jwt.isTradePlotterAdmin).toBeFalsy()
  expect(jwt.isTradePlotterUser).toBeTruthy()
  expect(jwt.isPolitagree).toBeFalsy()
  expect(jwt.isPolitagreeAdmin).toBeFalsy()
  expect(jwt.isPolitagreeUser).toBeFalsy()
})

test('JwtFusionAuthIdToken with roles', () => {
  const jwtPayload: IJwtFusionAuthIdToken = {
    aud: 'audience',
    exp: 123,
    iat: 456,
    iss: 'tradeplotter.com',
    jti: 'jti',
    roles: ['user'],
    scope: 'scope',
    tid: 'tenant',
    sub: 'subject',

    applicationId: 'application',
    auth_time: 123,
    sid: 'refresh',

    active: true,
    at_hash: 'at_hash',
    authenticationType: 'JWT',
    birthdate: '123',
    c_hash: 'c_hash',
    email: 'email',
    email_verified: true,
    family_name: 'family',
    given_name: 'given',
    middle_name: 'middle',
    name: 'name',
    nonce: 'nonce',
    phone_number: 'phone',
    picture: 'picture',
    preferred_username: 'username',
  }

  const jwtsign = JwtSign(
    jwtPayload,
    safestr(TEST_Parameters_DEV.rsaPassPhrase)
  )
  const jwt = JwtFusionAuthIdToken.Create(jwtsign)
  expect(jwt.applicationId).toBe('application')
  expect(jwt.auth_time).toBe(123)
  expect(jwt.sid).toBe('refresh')
  expect(jwt.active).toBeTruthy()
  expect(jwt.at_hash).toBe('at_hash')
  expect(jwt.authenticationType).toBe('JWT')

  expect(jwt.birthdate).toBe('123')
  expect(jwt.c_hash).toBe('c_hash')
  expect(jwt.email).toBe('email')
  expect(jwt.email_verified).toBeTruthy()
  expect(jwt.family_name).toBe('family')
  expect(jwt.given_name).toBe('given')
  expect(jwt.middle_name).toBe('middle')
  expect(jwt.name).toBe('name')
  expect(jwt.nonce).toBe('nonce')
  expect(jwt.phone_number).toBe('phone')
  expect(jwt.picture).toBe('picture')
  expect(jwt.preferred_username).toBe('username')
  expect(jwt.roles).toStrictEqual(['user'])
  expect(jwt.scope).toBe('scope')
  expect(jwt.tenantId).toBe('tenant')
  expect(jwt.sub).toBe('subject')
  expect(jwt.audience).toBe('audience')
  expect(jwt.exp).toBe(123)
  expect(jwt.iat).toBe(456)
  expect(jwt.iss).toBe('tradeplotter.com')
  expect(jwt.issuer).toBe(CONST_AppNameTradePlotter)
  expect(jwt.jti).toBe('jti')
  expect(jwt.isAdmin).toBeFalsy()
  expect(jwt.isUser).toBeTruthy()
  expect(jwt.isTradePlotter).toBeTruthy()
  expect(jwt.isTradePlotterAdmin).toBeFalsy()
  expect(jwt.isTradePlotterUser).toBeTruthy()
  expect(jwt.isPolitagree).toBeFalsy()
  expect(jwt.isPolitagreeAdmin).toBeFalsy()
  expect(jwt.isPolitagreeUser).toBeFalsy()
})

test('JwtTokenWithUserId', () => {
  const jwtPayload = {
    aud: 'audience',
    exp: 123,
    iat: 456,
    iss: 'tradeplotter.com',
    jti: 'jti',
    roles: ['user'],
    scope: 'scope',
    tid: 'tenant',
  }

  const jwtToken = JwtTokenWithUserId(
    'myuserId',
    TEST_Parameters_DEV.rsaPassPhrase,
    jwtPayload
  )

  const jwt = JwtWithSubject.Create(jwtToken)

  expect(jwt.FusionAuthUserId).toBe('myuserId')
})
