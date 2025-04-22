import jwt, {
  DecodeOptions,
  JwtHeader,
  JwtPayload,
  Secret,
  SignOptions,
  VerifyOptions,
} from 'jsonwebtoken'
import { isFunction } from './general.mjs'
import { safestr } from './string-helper.mjs'
import { isString } from './string-helper.mjs'
import { safeArray } from './array-helper.mjs'
import { IncomingHttpHeaders } from 'node:http'
import { HttpHeaderManagerBase } from './HttpHeaderManager.mjs'
import { AppException } from '../models/AppException.mjs'
import { DefaultWithOverrides } from './object-helper.mjs'

// Info source: https://fusionauth.io/docs/lifecycle/authenticate-users/oauth/tokens

interface IJwtConstructor<TInterface extends IJwtBase, T extends JwtBase> {
  new (arg: TInterface): T

  // Or enforce default constructor
  // new (): T;
}

function JwtCreate<TInterface extends IJwtBase, T extends JwtBase>(
  type: IJwtConstructor<TInterface, T>,
  token: string | TInterface,
  options?: DecodeOptions
): T {
  const decoded = isString(token)
    ? JwtDecode<TInterface>(token as string, options)
    : token

  return new type(decoded)
}

// function activator<T extends JwtBase>(type: IConstructor<T>): T {
//   return new type()
// }

export type WebRoles = 'user' | 'admin'

export const CONST_IssuerTradePlotter = 'tradeplotter.com'
export const CONST_IssuerPolitagree = 'politagree.com'

export interface IJwtHeader {
  /**
   * The list of grants in the order the grant occurred.
   *
   * For example, if the token was the result of an authorization_code grant,
   *  the value will be [authorization_code].
   *
   * If the token was generated using a refresh token using the refresh_token grant,
   *  the value will be [authorization_code, refresh_token]
   *  if the initial grant used to obtain the refresh token was the authorization_code grant.
   */
  gty: string[]
  // The unique key identifier that represents the key used to build the signature.
  kid: string
  //The type of token, this value is always JWT.
  typ: string
}

export interface IJwtBase {
  aud: string
  // Expiration time expressed as UNIX time which is the number of seconds since Epoch
  exp: number
  // The instant that the JWT was issued, expressed as UNIX time which is the number of seconds since Epoch.
  iat: number
  // The issuer of the JWT. For FusionAuth, this is always the value defined in the tenant JWT configuration
  iss: string
  // The unique identifier for this JWT
  jti: string
  // The roles assigned to the User in the authenticated Application. This claim is only present if the User has a registration to the Application.
  roles: string[]
  // Contains the validated and consented OAuth scopes from the initial authentication request
  scope: string
  // UUID: The FusionAuth Tenant unique Id.
  tid: string
}

export interface IJwtWithUserId extends IJwtBase {
  userId: string
}

export interface IJwtWithSubject extends IJwtBase {
  // UUID The subject of the access token.
  // This value is equal to the recipient Entity’s unique Id in FusionAuth.
  sub: string
}

export interface IJwtFusionAuthClientCredentials extends IJwtWithSubject {
  permissions: string[]
}

/**
 * Interface for the extended JWT token.
 * This is the decoded token and it follows FusionAuth's JWT token format.
 * https://fusionauth.io/docs/lifecycle/authenticate-users/oauth/tokens
 */
export interface IJwtAccessToken extends IJwtWithSubject {
  applicationId: string
  // Always JWT
  authenticationType: string
  auth_time: number
  email: string
  email_verified: boolean
  preferred_username: string
  // refresh_token
  sid: string
}

export interface IJwtFusionAuthIdToken extends IJwtAccessToken {
  active: boolean
  at_hash: string
  authenticationType: string
  birthdate: string
  c_hash: string
  family_name: string
  given_name: string
  middle_name: string
  name: string
  nonce: string
  phone_number: string
  picture: string
}

export function JwtDecode<T extends IJwtBase>(
  token?: string,
  options?: DecodeOptions
) {
  const decoded = jwt.decode(
    HttpHeaderManagerBase.BearerTokenParse(token),
    options
  )
  if (!decoded || isString(decoded)) {
    throw new AppException(
      'Invalid security token when attempting to decode the JWT.',
      'JwtDecode'
    )
  }

  return decoded as T
}

// export function JwtDecodeObject<
//   Tnew extends JwtBase,
//   TInterface extends IJwtBase
// >(
//   theClass: { new (args: TInterface): Tnew },
//   token: string | TInterface,
//   options?: DecodeOptions
// ): Tnew {
//   return createInstanceWithParams<Tnew, TInterface>(theClass, token, options)
// }

export function JwtRetrieveUserId(token: string) {
  const jwtret = JwtDecode<IJwtWithUserId>(token)

  return jwtret.userId
}

/**
 * Synchronously sign the given payload into a JSON Web Token string
 * payload - Payload to sign, could be an literal, buffer or string
 * secretOrPrivateKey - Either the secret for HMAC algorithms, or the PEM encoded private key for RSA and ECDSA.
 * [options] - Options for the signature
 * returns - The JSON Web Token string
 */
export function JwtSign(
  payload: string | object | Buffer,
  secretOrPrivateKey: string,
  options?: SignOptions | undefined
) {
  const token = jwt.sign(payload, secretOrPrivateKey, options)

  return token
}

export function JwtTokenWithUserId(
  userId: string,
  secretOrPrivateKey: string,
  overrides?: Partial<JwtPayload>
) {
  const header: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const signOptions: SignOptions = {
    header,
  }

  const payload = DefaultWithOverrides<JwtPayload>(
    {
      ...{
        sub: userId,
      },
    },
    overrides
  )

  const jwtToken = JwtSign(payload, secretOrPrivateKey, signOptions)

  return jwtToken
}

export function JwtTokenWithEmail(
  email: string,
  secretOrPrivateKey: string,
  overrides?: Partial<JwtPayload>
) {
  const header: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const signOptions: SignOptions = {
    header,
  }

  const payload = DefaultWithOverrides<JwtPayload>(
    {
      ...{
        email,
      },
    },
    overrides
  )

  const jwtToken = JwtSign(payload, secretOrPrivateKey, signOptions)

  return jwtToken
}

/**
 * Synchronously verify given token using a secret or a public key to get a decoded token
 * token - JWT string to verify
 * secretOrPublicKey - Either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA.
 * [options] - Options for the verification
 * returns - The decoded token.
 */
export function JwtVerify(
  token: string,
  secretOrPublicKey: Secret,
  options?: VerifyOptions | undefined
) {
  const jwtret = jwt.verify(token, secretOrPublicKey, options)

  return jwtret
}

// const DEFAULT_JwtFusionAuthIdToken: IJwtFusionAuthIdToken = {
//   applicationId: '4b396955-2792-4c59-832f-b9a969dc9ff3',
//   email: 'grayarrow@gmail.com',
//   email_verified: true,
//   family_name: 'Dietrich',
//   given_name: 'David',
//   roles: ['admin'],
//   scope: 'openid offline_access email profile',
//   sid: '0ab2f927-4858-49da-952c-ada994c7a558',
//   sub: '73381ce2-f34c-4c9d-a1e4-8fdb4e286e9a',
//   tid: '67e40228-0e5d-4876-894b-fcebae483a8f',
// }

// const DEFAULT_JwtClient: IJwtFusionAuthIdToken = {
//   active: true,
//   applicationId: '4b396955-2792-4c59-832f-b9a969dc9ff3',
//   aud: '4b396955-2792-4c59-832f-b9a969dc9ff3',
//   auth_time: 1741349501,
//   authenticationType: 'PASSWORD',
//   email: 'grayarrow@gmail.com',
//   email_verified: true,
//   exp: 1741353101,
//   iat: 1741349501,
//   iss: 'tradeplotter.com',
//   jti: '7b47b2d8-0864-4163-939f-9a1d2ce9f946',
//   roles: ['admin'],
//   scope: 'openid offline_access email profile',
//   sid: '0ab2f927-4858-49da-952c-ada994c7a558',
//   sub: '73381ce2-f34c-4c9d-a1e4-8fdb4e286e9a',
//   tid: '67e40228-0e5d-4876-894b-fcebae483a8f',
// }

export class JwtBase implements IJwtBase {
  aud: string
  exp: number
  iat: number
  iss: string
  jti: string
  roles: string[]
  scope: string
  tid: string

  constructor(token: IJwtBase) {
    this.aud = token.aud
    this.exp = token.exp
    this.iat = token.iat
    this.iss = token.iss
    this.jti = token.jti
    this.roles = safeArray(token.roles)
    this.scope = token.scope
    this.tid = token.tid
    Object.assign(this, JwtBase.DefaultJwt(token))
  }

  static Create(token: string | IJwtBase) {
    return JwtCreate(JwtBase, token)
  }

  static DefaultJwt(overrides?: Partial<IJwtBase> | null) {
    const jwt: IJwtBase = {
      aud: '',
      exp: 0,
      iat: 0,
      iss: '',
      jti: '',
      roles: [],
      scope: '',
      tid: '',
    }

    return DefaultWithOverrides(jwt, overrides)
  }

  get ApplicationRoles() {
    const arrRoles: WebRoles[] = []

    const safeRoles = safeArray<string>(this.roles)
    if (safeRoles.includes('admin')) {
      arrRoles.push('admin')
    }

    if (safeRoles.includes('user')) {
      arrRoles.push('user')
    }

    return arrRoles
  }

  get audience() {
    return this.aud
  }

  get issuedTime() {
    return this.iat
  }

  get isAdmin() {
    return this.ApplicationRoles.includes('admin')
  }

  get isUser() {
    return this.ApplicationRoles.includes('user') || this.isAdmin
  }

  get issuer() {
    return safestr(this.iss).replace(new RegExp('.com$'), '')
  }

  get isPolitagree() {
    return CONST_IssuerPolitagree === this.iss
  }
  get isPolitagreeAdmin() {
    return this.isAdmin && this.isPolitagree
  }
  get isPolitagreeUser() {
    return this.isUser && this.isPolitagree
  }

  get isTradePlotter() {
    return CONST_IssuerTradePlotter === this.iss
  }
  get isTradePlotterAdmin() {
    return this.isAdmin && this.isTradePlotter
  }
  get isTradePlotterUser() {
    return this.isUser && this.isTradePlotter
  }

  get tenantId() {
    return this.tid
  }
}

export class JwtWithSubject extends JwtBase implements IJwtWithSubject {
  sub: string

  constructor(token: IJwtWithSubject) {
    super(token)
    this.sub = token.sub
    JwtWithSubject.DefaultJwt(token)
  }

  static Create(token: string | IJwtWithSubject) {
    return JwtCreate(JwtWithSubject, token)
  }

  static DefaultJwt(overrides?: Partial<IJwtWithSubject> | null) {
    const jwt: IJwtWithSubject = {
      ...super.DefaultJwt(),
      ...{
        sub: '',
      },
    }

    return DefaultWithOverrides(jwt, overrides)
  }

  get FusionAuthUserId() {
    return this.sub
  }
}

export class JwtAccessToken extends JwtWithSubject implements IJwtAccessToken {
  applicationId: string
  auth_time: number
  authenticationType: string
  email: string
  email_verified: boolean
  preferred_username: string
  sid: string

  constructor(token: IJwtAccessToken) {
    super(token)
    this.applicationId = token.applicationId
    this.auth_time = token.auth_time
    this.authenticationType = token.authenticationType
    this.email = token.email
    this.email_verified = token.email_verified
    this.preferred_username = token.preferred_username
    this.sid = token.sid

    JwtAccessToken.DefaultJwt(token)
  }

  static Create(token: string | IJwtAccessToken) {
    return JwtCreate(JwtAccessToken, token)
  }

  static DefaultJwt(overrides?: Partial<IJwtAccessToken> | null) {
    const jwt: IJwtAccessToken = {
      ...super.DefaultJwt(),
      ...{
        applicationId: '',
        auth_time: 0,
        authenticationType: '',
        email: '',
        email_verified: false,
        preferred_username: '',
        sid: '',
      },
    }

    return DefaultWithOverrides(jwt, overrides)
  }

  get authenticationTime() {
    return this.auth_time
  }

  get refreshToken() {
    return this.sid
  }
}

export class JwtFusionAuthClientCredentials
  extends JwtWithSubject
  implements IJwtFusionAuthClientCredentials
{
  permissions: string[]

  constructor(token: IJwtFusionAuthClientCredentials) {
    super(token)
    this.permissions = safeArray(token.permissions).map((x) => x.toLowerCase())
    JwtFusionAuthClientCredentials.DefaultJwt(token)
  }

  static Create(token: string | IJwtFusionAuthClientCredentials) {
    return JwtCreate(JwtFusionAuthClientCredentials, token)
  }

  static DefaultJwt(
    overrides?: Partial<IJwtFusionAuthClientCredentials> | null
  ) {
    const jwt: IJwtFusionAuthClientCredentials = {
      ...super.DefaultJwt(),
      ...{
        permissions: [],
      },
    }

    return DefaultWithOverrides(jwt, overrides)
  }
}

export function FromHeaders<TInterface extends IJwtBase, TNew extends JwtBase>(
  type: IJwtConstructor<TInterface, TNew>,
  headers?: Headers | IncomingHttpHeaders | null
) {
  let bearerToken = ''
  const hHeaders = headers as Headers
  const iHeaders = headers as IncomingHttpHeaders

  if (hHeaders && isFunction(hHeaders.get)) {
    bearerToken = HttpHeaderManagerBase.BearerTokenParseStrict(
      hHeaders.get('Authorization') ?? hHeaders.get('authorization')
    )
  } else if (iHeaders) {
    bearerToken = safestr(iHeaders.authorization)
  }

  return FromBearerToken(type, bearerToken)
}

export function FromBearerToken<
  TInterface extends IJwtBase,
  TNew extends JwtBase
>(type: IJwtConstructor<TInterface, TNew>, token: string) {
  return JwtCreate(type, token)
}

export class JwtFusionAuthIdToken
  extends JwtAccessToken
  implements IJwtFusionAuthIdToken
{
  active: boolean
  at_hash: string
  authenticationType: string
  birthdate: string
  c_hash: string
  family_name: string
  given_name: string
  middle_name: string
  name: string
  nonce: string
  phone_number: string
  picture: string

  constructor(token: IJwtFusionAuthIdToken) {
    super(token)
    this.active = token.active
    this.at_hash = token.at_hash
    this.authenticationType = token.authenticationType
    this.birthdate = token.birthdate
    this.c_hash = token.c_hash
    this.family_name = token.family_name
    this.given_name = token.given_name
    this.middle_name = token.middle_name
    this.name = token.name
    this.nonce = token.nonce
    this.phone_number = token.phone_number
    this.picture = token.picture

    JwtFusionAuthIdToken.DefaultJwt(token)
  }

  static Create(token: string | IJwtFusionAuthIdToken) {
    return JwtCreate(JwtFusionAuthIdToken, token)
  }

  static DefaultJwt(overrides?: Partial<IJwtFusionAuthIdToken> | null) {
    const jwt: IJwtFusionAuthIdToken = {
      ...super.DefaultJwt(),
      ...{
        active: false,
        at_hash: '',
        authenticationType: '',
        birthdate: '',
        c_hash: '',
        family_name: '',
        given_name: '',
        middle_name: '',
        name: '',
        nonce: '',
        phone_number: '',
        picture: '',
      },
    }

    return DefaultWithOverrides(jwt, overrides)
  }
}
