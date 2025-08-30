/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-spread */
import {
  CONST_JwtErrorDecode,
  CONST_JwtErrorRetrieveUserId,
  CONST_JwtErrorUserIdRequired,
  FromBearerToken,
  FromHeaders,
  type IJwt,
  type IJwtAccessToken,
  IJwtFusionAuthIdToken,
  JwtAccessToken,
  JwtBase,
  JwtBusinessRules,
  JwtDecode,
  JwtDecodeComplete,
  JwtFusionAuthClientCredentials,
  JwtFusionAuthIdToken,
  JwtRetrieveUserId,
  JwtSign,
  JwtTokenWithEmail,
  JwtWithSubject,
  jwtDecodeDigi,
  jwtHeader,
  jwtVerify,
} from './jwt.mjs'
import { GenerateSignedJwtToken, TEST_Settings } from '../jest.setup.mjs'
import {
  type JwtHeader,
  JwtPayload,
  Secret,
  type SignOptions,
} from 'jsonwebtoken'
import { AppException } from '../models/AppException.mjs'
import { CONST_AppNameTradePlotter } from './HttpHeaderManager.mjs'

describe('JwtDecode', () => {
  let jwt = ''

  beforeEach(() => {
    jwt = JwtSign(
      { email: TEST_Settings.userIdGoodEmail },
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase
    )
  })

  test('good', () => {
    const jwtdata = JwtDecode<IJwtAccessToken>(jwt)

    expect(jwtdata.email).toBe(TEST_Settings.userIdGoodEmail)
  })

  test('bad', () => {
    try {
      JwtDecode('bad')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      if (e instanceof Error) {
        expect(e.message).toBe(CONST_JwtErrorDecode)
        expect(e.stack).toMatch(
          new RegExp(`^Error: ${CONST_JwtErrorDecode}`, 'u')
        )
      }
    }

    expect.assertions(3)
  })

  test('JwtRetrieveUserId', () => {
    const jwtdata = JwtRetrieveUserId(jwt)

    expect(jwtdata).toBe(TEST_Settings.userIdGoodEmail)
  })

  test('JwtDecode', () => {
    const jwtdata: string | JwtPayload | null = JwtDecode(jwt)

    expect(jwtdata.email).toBe(TEST_Settings.userIdGoodEmail)
  })
})

test('JwtSign', () => {
  const payload = {
      email: TEST_Settings.userIdGoodEmail,
    },
    zjwtToken = JwtSign(
      payload,
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      jwtHeader()
    )
  expect(zjwtToken.length).toBeGreaterThan(10)

  const jwtdata = JwtDecode<IJwtAccessToken>(zjwtToken)

  expect(jwtdata.email).toBe(TEST_Settings.userIdGoodEmail)
})

test('JwtVerify bad', () => {
  const secretOrPublicKey: Secret = 'anything'

  expect(() => jwtVerify(TEST_Settings.jwt, secretOrPublicKey)).toThrow()
})

test('JwtVerify good', () => {
  const payload = {
      email: TEST_Settings.userIdGoodEmail,
    },
    zjwtToken = JwtSign(
      payload,
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      jwtHeader()
    )

  expect(zjwtToken.length).toBeGreaterThan(10)

  const jwtdata = JwtDecode<IJwtAccessToken>(zjwtToken)

  expect(jwtdata.email).toBe(TEST_Settings.userIdGoodEmail)

  const secretOrPublicKey: Secret = TEST_Settings.rsaPublicKey,
    verified = jwtVerify(
      zjwtToken,
      secretOrPublicKey,
      TEST_Settings.rsaPassPhrase
    )
  expect((verified as IJwtAccessToken).email).toBe(
    TEST_Settings.userIdGoodEmail
  )
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
    expect(() => JwtAccessToken.Create('')).toThrow(CONST_JwtErrorDecode)
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
      CONST_JwtErrorDecode
    )
  })

  test('FromHeaders no data', () => {
    expect(() => FromHeaders(JwtAccessToken)).toThrow(CONST_JwtErrorDecode)
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
    expect(jhelper.sub).toBe('my FusionAuthUserId')
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

test(JwtTokenWithEmail.name, () => {
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
    jwtToken = JwtTokenWithEmail(
      TEST_Settings.userIdGoodEmail,
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      jwtPayload
    ),
    zjwt = JwtAccessToken.Create(jwtToken)

  expect(zjwt.email).toBe(TEST_Settings.userIdGoodEmail)
})

describe(jwtDecodeDigi.name, () => {
  test('good', () => {
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
      jwtToken = JwtTokenWithEmail(
        TEST_Settings.userIdGoodEmail,
        TEST_Settings.rsaPrivateKey,
        TEST_Settings.rsaPassPhrase,
        jwtPayload
      )
    // , zjwt = JwtWithSubject.Create(jwtToken)

    const result = jwtDecodeDigi(jwtToken)
    expect(result).toBeDefined()
  })

  test('bad', () => {
    const token = 'your.jwt.token.here'
    expect(() => jwtDecodeDigi(token)).toThrow(
      new AppException(CONST_JwtErrorRetrieveUserId, 'fname')
    )
  })
})

test(JwtDecodeComplete.name, () => {
  const jwt = JwtTokenWithEmail(
    TEST_Settings.userIdGoodEmail,
    TEST_Settings.rsaPrivateKey,
    TEST_Settings.rsaPassPhrase
  )

  const { payload, signature } = JwtDecodeComplete(jwt) as JwtPayload
  expect(signature.length).toBeGreaterThan(10)

  expect(payload.email).toBe(TEST_Settings.userIdGoodEmail)

  expect(() => JwtDecodeComplete(`1${jwt}`)).toThrow()
})

describe(JwtBusinessRules.name, () => {
  const jwtDefault: IJwt = {
    aud: 'https://api.resorts.com',
    email: 'test@test.com',
    exp: 1719551935,
    iat: 1719551775,
    iss: 'https://identity.resorts.com/oauth2/auzj02gi5cZ8h8NP1t7',
    jti: 'AT.EkfRHvtFRJm0Ycs_hqpsV62KdafbRn6TSojSvjrd0Zw',
    sub: '123456789',
  } as const

  test(JwtBusinessRules.apply.name, () => {
    expect(() =>
      JwtBusinessRules.apply({ ...jwtDefault, email: undefined })
    ).toThrow(
      new AppException(CONST_JwtErrorUserIdRequired, 'JwtBusinessRules.apply')
    )

    expect(() =>
      JwtBusinessRules.apply({
        ...jwtDefault,
        email: null as unknown as string,
      })
    ).toThrow(
      new AppException(CONST_JwtErrorUserIdRequired, 'JwtBusinessRules.apply')
    )

    expect(() => JwtBusinessRules.apply({ ...jwtDefault, email: '0' })).toThrow(
      new AppException(CONST_JwtErrorUserIdRequired, 'JwtBusinessRules.apply')
    )

    expect(() => JwtBusinessRules.apply({ ...jwtDefault, email: '' })).toThrow(
      new AppException(CONST_JwtErrorUserIdRequired, 'JwtBusinessRules.apply')
    )

    expect(() =>
      JwtBusinessRules.apply({
        ...jwtDefault,
        email: 0 as unknown as string,
      })
    ).toThrow(
      new AppException(CONST_JwtErrorUserIdRequired, 'JwtBusinessRules.apply')
    )

    expect(() =>
      JwtBusinessRules.apply({
        ...jwtDefault,
        email: {} as unknown as string,
      })
    ).toThrow(
      new AppException(CONST_JwtErrorUserIdRequired, 'JwtBusinessRules.apply')
    )

    expect(() =>
      JwtBusinessRules.apply({
        ...jwtDefault,
        email: { a: 'a' } as unknown as string,
      })
    ).toThrow(
      new AppException(CONST_JwtErrorUserIdRequired, 'JwtBusinessRules.apply')
    )

    expect(() =>
      JwtBusinessRules.apply({
        ...jwtDefault,
        email: new Date() as unknown as string,
      })
    ).toThrow(
      new AppException(CONST_JwtErrorUserIdRequired, 'JwtBusinessRules.apply')
    )
  })

  test.each([
    '-ab',
    'abcdef',
    '-123454..',
    // { description: 'null patron id', patronId: null },
  ])('Improper string: %s', (email) => {
    expect(() =>
      JwtBusinessRules.apply({
        ...jwtDefault,
        email,
      })
    ).toThrow(
      new AppException(CONST_JwtErrorUserIdRequired, 'JwtBusinessRules.apply')
    )
  })

  test.each([
    '-1',
    '-12.0',
    '-123454.',
    '-123454.56',
    // { description: 'null patron id', patronId: null },
  ])('Not positive: %s', (email) => {
    expect(() =>
      JwtBusinessRules.apply({
        ...jwtDefault,
        email,
      })
    ).toThrow(
      new AppException(CONST_JwtErrorUserIdRequired, 'JwtBusinessRules.apply')
    )
  })

  test('not expecting email', () => {
    const jwt = JwtBusinessRules.apply(jwtDefault, false)
    expect(jwt.email).toBe(jwtDefault.email)
  })

  test('no email and not expecting an email number', () => {
    const jwt = JwtBusinessRules.apply(
      { ...jwtDefault, email: undefined },
      false
    )

    expect(jwt.email).toBeUndefined()
    expect(
      JwtBusinessRules.apply(
        { ...jwtDefault, email: null as unknown as string },
        false
      ).email
    ).toBeNull()
    expect(
      () => JwtBusinessRules.apply({ ...jwtDefault, email: '' }, true).email
    ).toThrow(
      new AppException(
        CONST_JwtErrorUserIdRequired,
        `${JwtBusinessRules.name}.${JwtBusinessRules.apply.name}`
      )
    )
  })
})

test(JwtSign.name, () => {
  const header: JwtHeader = {
    alg: 'HS256',
    // expiresIn,
    typ: 'JWT',
  }

  const signOptions: SignOptions = {
    header,
  }

  const jwtToken = JwtSign(
    { email: TEST_Settings.userIdGoodEmail },
    TEST_Settings.rsaPrivateKey,
    '',
    signOptions
  )
  expect(jwtToken.length).toBeGreaterThan(10)

  const jwtdata = JwtDecode(jwtToken)

  expect((jwtdata as IJwtAccessToken).email).toBe(TEST_Settings.userIdGoodEmail)
})
