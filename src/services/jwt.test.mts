/* eslint-disable @typescript-eslint/no-misused-spread */
import {
  FromBearerToken,
  FromHeaders,
  IJwtFusionAuthIdToken,
  IJwtWithUserId,
  JwtAccessToken,
  JwtBase,
  JwtDecode,
  JwtFusionAuthClientCredentials,
  JwtFusionAuthIdToken,
  JwtRetrieveUserId,
  JwtSign,
  JwtTokenWithUserId,
  JwtVerify,
  JwtWithSubject,
} from './jwt.mjs'
import { GenerateSignedJwtToken, TEST_Settings } from '../jest.setup.mjs'
import { JwtHeader, JwtPayload, Secret, SignOptions } from 'jsonwebtoken'
import { CONST_AppNameTradePlotter } from './HttpHeaderManager.mjs'

describe('JwtDecode', () => {
  let jwt = ''
  beforeAll(() => {
    jwt = JwtSign(
      { userId: TEST_Settings.userIdGood },
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase
    )
  })

  test('good', () => {
    const jwtdata = JwtDecode<IJwtWithUserId>(jwt)

    expect(jwtdata.userId).toBe(TEST_Settings.userIdGood)
  })

  test('bad', () => {
    try {
      JwtDecode('bad')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      if (e instanceof Error) {
        expect(e.message).toBe(
          'Invalid security token when attempting to decode the JWT.'
        )
        expect(e.stack).toMatch(
          /^Error: Invalid security token when attempting to decode the JWT./u
        )
      }
    }

    expect.assertions(3)
  })

  test('JwtRetrieveUserId', () => {
    const jwtdata = JwtRetrieveUserId(jwt)

    expect(jwtdata).toBe(TEST_Settings.userIdGood)
  })

  test('JwtDecode', () => {
    const jwtdata: string | JwtPayload | null = JwtDecode(jwt)

    expect(jwtdata.userId).toBe(TEST_Settings.userIdGood)
  })
})

test('JwtSign', () => {
  const header: JwtHeader = {
      alg: 'HS256',
      typ: 'JWT',
    },
    payload = {
      userId: TEST_Settings.userIdGood,
    },
    signOptions: SignOptions = {
      header,
    },
    zjwtToken = JwtSign(
      payload,
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      signOptions
    )
  expect(zjwtToken.length).toBeGreaterThan(10)

  const jwtdata = JwtDecode<IJwtWithUserId>(zjwtToken)

  expect(jwtdata.userId).toBe(TEST_Settings.userIdGood)
})

test('JwtVerify bad', () => {
  const secretOrPublicKey: Secret = 'anything'

  expect(() => JwtVerify(TEST_Settings.jwt, secretOrPublicKey)).toThrow()
})

test('JwtVerify good', () => {
  const header: JwtHeader = {
      alg: 'RS256',
      typ: 'JWT',
    },
    payload = {
      userId: TEST_Settings.userIdGood,
    },
    signOptions: SignOptions = {
      header,
    },
    zjwtToken = JwtSign(
      payload,
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      signOptions
    )

  expect(zjwtToken.length).toBeGreaterThan(10)

  const jwtdata = JwtDecode<IJwtWithUserId>(zjwtToken)

  expect(jwtdata.userId).toBe(TEST_Settings.userIdGood)

  const secretOrPublicKey: Secret = TEST_Settings.rsaPassPhrase,
    verified = JwtVerify(zjwtToken, secretOrPublicKey)
  expect((verified as IJwtWithUserId).userId).toBe(TEST_Settings.userIdGood)
})

describe('JwtAccessClient', () => {
  test('Constructor from token', () => {
    expect(JwtAccessToken.Create(TEST_Settings.jwt).email).toBe(
      TEST_Settings.userIdGoodEmail
    )
  })
  test('Constructor from string', () => {
    const jwt = JwtAccessToken.Create(TEST_Settings.jwt)

    expect(jwt.email).toBe(TEST_Settings.userIdGoodEmail)
  })
  test('Constructor from null', () => {
    expect(() => JwtAccessToken.Create('')).toThrow(
      'Invalid security token when attempting to decode the JWT.'
    )
  })

  test('FromHeaders', () => {
    const headers = {
        authorization: `Bearer ${TEST_Settings.jwt}`,
      },
      jwt = FromHeaders(JwtAccessToken, headers)

    expect(jwt.email).toBe(TEST_Settings.userIdGoodEmail)
  })

  test('FromHeaders Headers object', () => {
    const headers = {
        authorization: `Bearer ${TEST_Settings.jwt}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        get: (key: string) => headers[key],
      } as unknown as Headers,
      jwt = FromHeaders(JwtAccessToken, headers)

    expect(jwt.email).toBe(TEST_Settings.userIdGoodEmail)
  })

  test('FromHeaders fail no Bearer', () => {
    const headers = {
      authorization: TEST_Settings.jwt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      get: (key: string) => headers[key],
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
      FromBearerToken(JwtAccessToken, `Bearer ${TEST_Settings.jwt}`).email
    ).toBe(TEST_Settings.userIdGoodEmail)
  })

  test('issuer', () => {
    const ajwt = GenerateSignedJwtToken(TEST_Settings.userIdGoodEmail, {
        iss: 'anything.com',
      }),
      jhelper = FromBearerToken(JwtAccessToken, ajwt)

    expect(jhelper.email).toBe(TEST_Settings.userIdGoodEmail)
    expect(jhelper.issuer).toBe('anything')
  })

  test('Application Roles', () => {
    let ajwt = GenerateSignedJwtToken(TEST_Settings.userIdGoodEmail, {
        iss: 'anything.com',
        roles: ['admin', 'user'],
      }),
      jhelper = JwtAccessToken.Create(ajwt)
    expect(jhelper.ApplicationRoles).toEqual(['admin', 'user'])
    expect(jhelper.isAdmin).toBeTruthy()
    expect(jhelper.isManager).toBeTruthy()
    expect(jhelper.isUser).toBeTruthy()

    ajwt = GenerateSignedJwtToken(TEST_Settings.userIdGoodEmail, {
      roles: ['admin'],
    })
    jhelper = JwtAccessToken.Create(ajwt)
    expect(jhelper.ApplicationRoles).toEqual(['admin'])
    expect(jhelper.isAdmin).toBeTruthy()
    expect(jhelper.isManager).toBeTruthy()
    expect(jhelper.isUser).toBeTruthy()

    jhelper = JwtAccessToken.Create({ ...jhelper, roles: ['user'] })
    expect(jhelper.ApplicationRoles).toEqual(['user'])
    expect(jhelper.isAdmin).toBeFalsy()
    expect(jhelper.isManager).toBeFalsy()
    expect(jhelper.isUser).toBeTruthy()

    ajwt = GenerateSignedJwtToken(TEST_Settings.userIdGoodEmail, {
      roles: ['manager'],
    })
    jhelper = JwtAccessToken.Create(ajwt)
    expect(jhelper.ApplicationRoles).toEqual(['manager'])
    expect(jhelper.isAdmin).toBeFalsy()
    expect(jhelper.isManager).toBeTruthy()
    expect(jhelper.isUser).toBeTruthy()

    ajwt = GenerateSignedJwtToken(TEST_Settings.userIdGoodEmail, {
      roles: ['user'],
    })
    jhelper = JwtAccessToken.Create(ajwt)
    expect(jhelper.ApplicationRoles).toEqual(['user'])
    expect(jhelper.isAdmin).toBeFalsy()
    expect(jhelper.isManager).toBeFalsy()
    expect(jhelper.isUser).toBeTruthy()
  })

  test('others', () => {
    const ajwt = GenerateSignedJwtToken(TEST_Settings.userIdGoodEmail, {
        aud: 'anything',
        auth_time: 123,
        iat: 2048,
        sid: 'refresh',
        sub: 'my FusionAuthUserId',
        tid: 'tenant',
      }),
      jhelper = FromBearerToken(JwtAccessToken, ajwt)

    expect(jhelper.audience).toBe('anything')
    expect(jhelper.authenticationTime).toBe(123)
    expect(jhelper.email).toBe(TEST_Settings.userIdGoodEmail)
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

  let ajwt = JwtSign(
      jwtPayload,
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase
    ),
    jhelper = JwtBase.Create(ajwt)

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
  ajwt = JwtSign(
    jwtPayload,
    TEST_Settings.rsaPrivateKey,
    TEST_Settings.rsaPassPhrase
  )
  jhelper = JwtBase.Create(ajwt)

  expect(jhelper.isAdmin).toBeFalsy()
  expect(jhelper.isUser).toBeTruthy()
  expect(jhelper.isTradePlotterAdmin).toBeFalsy()
  expect(jhelper.isTradePlotterManager).toBeFalsy()
  expect(jhelper.isTradePlotterUser).toBeTruthy()
  expect(jhelper.isPolitagreeAdmin).toBeFalsy()
  expect(jhelper.isPolitagreeManager).toBeFalsy()
  expect(jhelper.isPolitagreeUser).toBeFalsy()

  jwtPayload.roles = ['admin']
  ajwt = JwtSign(
    jwtPayload,
    TEST_Settings.rsaPrivateKey,
    TEST_Settings.rsaPassPhrase
  )
  jhelper = JwtBase.Create(ajwt)

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
  ajwt = JwtSign(
    jwtPayload,
    TEST_Settings.rsaPrivateKey,
    TEST_Settings.rsaPassPhrase
  )
  jhelper = JwtBase.Create(ajwt)

  expect(jhelper.isAdmin).toBeFalsy()
  expect(jhelper.isUser).toBeTruthy()
  expect(jhelper.isTradePlotterAdmin).toBeFalsy()
  expect(jhelper.isTradePlotterManager).toBeFalsy()
  expect(jhelper.isTradePlotterUser).toBeFalsy()
  expect(jhelper.isPolitagreeAdmin).toBeFalsy()
  expect(jhelper.isPolitagreeManager).toBeFalsy()
  expect(jhelper.isPolitagreeUser).toBeTruthy()

  jwtPayload.roles = ['admin']
  ajwt = JwtSign(
    jwtPayload,
    TEST_Settings.rsaPrivateKey,
    TEST_Settings.rsaPassPhrase
  )
  jhelper = JwtBase.Create(ajwt)

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
    sub: 'subject',
    tid: 'tenant',
  }

  let ajwt = JwtSign(
      jwtPayload,
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase
    ),
    jhelper = JwtWithSubject.Create(ajwt)
  expect(jhelper.sub).toBe('subject')

  jwtPayload.sub = 'new subject'
  ajwt = JwtSign(
    jwtPayload,
    TEST_Settings.rsaPrivateKey,
    TEST_Settings.rsaPassPhrase
  )
  jhelper = JwtWithSubject.Create(ajwt)

  expect(jhelper.sub).toBe('new subject')
})

test('JwtFusionAuthClientCredentials', () => {
  const jwtPayload = {
      aud: 'audience',
      exp: 123,
      iat: 456,
      iss: 'tradeplotter.com',
      jti: 'jti',
      permissions: ['user'],
      roles: ['user'],
      scope: 'scope',
      sub: 'subject',
      tid: 'tenant',
    },
    jwtsign = JwtSign(
      jwtPayload,
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase
    ),
    zjwt = JwtFusionAuthClientCredentials.Create(jwtsign)

  expect(zjwt.permissions).toStrictEqual(['user'])
  expect(zjwt.roles).toStrictEqual(['user'])
  expect(zjwt.scope).toBe('scope')
  expect(zjwt.tenantId).toBe('tenant')
  expect(zjwt.sub).toBe('subject')
  expect(zjwt.audience).toBe('audience')
  expect(zjwt.exp).toBe(123)
  expect(zjwt.iat).toBe(456)
  expect(zjwt.iss).toBe('tradeplotter.com')
  expect(zjwt.issuer).toBe(CONST_AppNameTradePlotter)
  expect(zjwt.jti).toBe('jti')
  expect(zjwt.isAdmin).toBeFalsy()
  expect(zjwt.isUser).toBeTruthy()
  expect(zjwt.isTradePlotter).toBeTruthy()
  expect(zjwt.isTradePlotterAdmin).toBeFalsy()
  expect(zjwt.isTradePlotterUser).toBeTruthy()
  expect(zjwt.isPolitagree).toBeFalsy()
  expect(zjwt.isPolitagreeAdmin).toBeFalsy()
  expect(zjwt.isPolitagreeUser).toBeFalsy()
})

test('JwtFusionAuthIdToken with roles', () => {
  const jwtPayload: IJwtFusionAuthIdToken = {
      active: true,
      applicationId: 'application',
      at_hash: 'at_hash',
      aud: 'audience',
      auth_time: 123,
      authenticationType: 'JWT',
      birthdate: '123',
      c_hash: 'c_hash',
      email: 'email',
      email_verified: true,
      exp: 123,
      family_name: 'family',
      given_name: 'given',
      iat: 456,
      iss: 'tradeplotter.com',
      jti: 'jti',
      middle_name: 'middle',
      name: 'name',
      nonce: 'nonce',
      phone_number: 'phone',
      picture: 'picture',
      preferred_username: 'username',
      roles: ['user'],
      scope: 'scope',
      sid: 'refresh',
      sub: 'subject',
      tid: 'tenant',
    },
    jwtsign = JwtSign(
      jwtPayload,
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase
    ),
    zjwt = JwtFusionAuthIdToken.Create(jwtsign)
  expect(zjwt.applicationId).toBe('application')
  expect(zjwt.auth_time).toBe(123)
  expect(zjwt.sid).toBe('refresh')
  expect(zjwt.active).toBeTruthy()
  expect(zjwt.at_hash).toBe('at_hash')
  expect(zjwt.authenticationType).toBe('JWT')

  expect(zjwt.birthdate).toBe('123')
  expect(zjwt.c_hash).toBe('c_hash')
  expect(zjwt.email).toBe('email')
  expect(zjwt.email_verified).toBeTruthy()
  expect(zjwt.family_name).toBe('family')
  expect(zjwt.given_name).toBe('given')
  expect(zjwt.middle_name).toBe('middle')
  expect(zjwt.name).toBe('name')
  expect(zjwt.nonce).toBe('nonce')
  expect(zjwt.phone_number).toBe('phone')
  expect(zjwt.picture).toBe('picture')
  expect(zjwt.preferred_username).toBe('username')
  expect(zjwt.roles).toStrictEqual(['user'])
  expect(zjwt.scope).toBe('scope')
  expect(zjwt.tenantId).toBe('tenant')
  expect(zjwt.sub).toBe('subject')
  expect(zjwt.audience).toBe('audience')
  expect(zjwt.exp).toBe(123)
  expect(zjwt.iat).toBe(456)
  expect(zjwt.iss).toBe('tradeplotter.com')
  expect(zjwt.issuer).toBe(CONST_AppNameTradePlotter)
  expect(zjwt.jti).toBe('jti')
  expect(zjwt.isAdmin).toBeFalsy()
  expect(zjwt.isUser).toBeTruthy()
  expect(zjwt.isTradePlotter).toBeTruthy()
  expect(zjwt.isTradePlotterAdmin).toBeFalsy()
  expect(zjwt.isTradePlotterUser).toBeTruthy()
  expect(zjwt.isPolitagree).toBeFalsy()
  expect(zjwt.isPolitagreeAdmin).toBeFalsy()
  expect(zjwt.isPolitagreeUser).toBeFalsy()
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
    },
    jwtToken = JwtTokenWithUserId(
      'myuserId',
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      jwtPayload
    ),
    zjwt = JwtWithSubject.Create(jwtToken)

  expect(zjwt.FusionAuthUserId).toBe('myuserId')
})
