import * as z from 'zod/v4'
import { isString, safestr } from './string-helper.mjs'
import jsonWebToken, {
  DecodeOptions,
  JwtHeader,
  JwtPayload,
  Secret,
  SignOptions,
  VerifyOptions,
} from 'jsonwebtoken'
import { AppException } from '../models/AppException.mjs'
import { HttpHeaderManagerBase } from './HttpHeaderManager.mjs'
import { IConstructor } from '../models/types.mjs'
import { IncomingHttpHeaders } from 'node:http'
import { isFunction, newGuid } from './general.mjs'
import { safeArray } from './array-helper.mjs'

export const WebRoleKeys = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const
export type WebRoles = (typeof WebRoleKeys)[keyof typeof WebRoleKeys]

export const JWT_AcrDigi = 'urn:digi:acr:1.0'
export const JWT_AcrIdMe = 'urn:digi:loa:1fa:idver'

// export interface IJwt {
//   /**
//    * Authentication Context Class Reference:
//    *  String specifying an authentication context class reference value that identifies the
//    *  authentication context class that was satisfied by the user-authentication event performed.
//    */
//   acr?: string // myACR
//   /** Time (in seconds) the resource server (backend service) allows since the last auth_time */
//   /** A space-separated string listing the authentication context class reference values in order of preference.
//    *  The protected resource requires one of these values for the authentication event associated with the access token.
//    */
//   acr_values?: string
//   // aud(Audience): Identifies the recipients that the JWT is intended for.
//   aud: string
//   /** The time the user last authenticated (login, complete an IdP flow, etc) */
//   auth_time: number
//   birthdate: string
//   cid: string
//   'com.digi.emailVerified'?: boolean
//   'com.digi.gse.id'?: string
//   'com.digi.id'?: string
//   'com.digi.identity.verified'?: boolean
//   'com.digi.loyalty.freeplay_available'?: boolean
//   'com.digi.loyalty.perpetual_eligible'?: boolean
//   'com.digi.loyalty.perpetual_eligible_properties'?: string[]
//   'com.digi.mlife_number': string
//   email: string
//   // exp (Expiration Time): Defines the time on or after which the JWT must not be accepted for processing.
//   exp: number
//   family_name: string
//   given_name: string
//   groups: string[]
//   // iat (Issued At): Indicates the time at which the JWT was issued.
//   iat: number
//   // iss(Issuer): Identifies the principal that issued the JWT.
//   iss: string
//   // (JWT ID): Provides a unique identifier for the JWT.
//   jti: string
//   max_age?: number
//   digi_role: string
//   name: string
//   // nbf(Not Before): Specifies the time before which the JWT must not be accepted for processing.
//   nbf?: number
//   phone_number: string
//   scp: string[]
//   // sub (Subject): Identifies the principal that is the subject of the JWT.
//   sub: string
//   uid: string
//   userId: string
//   ver: number
// }

const CONST_ARRAY_MAX_LENGTH = 100
const CONST_STRING_MAX_LENGTH = 100

export const zJwtHeader = z.jwt({ alg: 'RS256' })

export const zJwtSchema = z.object({
  /**
   * Authentication Context Class Reference:
   *  String specifying an authentication context class reference value that identifies the
   *  authentication context class that was satisfied by the user-authentication event performed.
   */
  acr: z.string().max(CONST_STRING_MAX_LENGTH).optional(),
  /** Time (in seconds) the resource server (backend service) allows since the last auth_time */
  /** A space-separated string listing the authentication context class reference values in order of preference.
   *  The protected resource requires one of these values for the authentication event associated with the access token.
   */
  acr_values: z
    .string()
    .max(CONST_STRING_MAX_LENGTH)
    .or(
      z
        .array(z.string().max(CONST_STRING_MAX_LENGTH))
        .max(CONST_ARRAY_MAX_LENGTH)
    )
    .optional(),
  // Audience
  aud: z
    .string()
    .max(CONST_STRING_MAX_LENGTH)
    .or(
      z
        .array(z.string().max(CONST_STRING_MAX_LENGTH))
        .max(CONST_ARRAY_MAX_LENGTH)
    ),
  /** The time the user last authenticated (login, complete an IdP flow, etc) */
  auth_time: z.number().int().optional(),
  birthdate: z.string().max(CONST_STRING_MAX_LENGTH).optional(),
  cid: z.string().max(CONST_STRING_MAX_LENGTH).optional(),

  email: z.email().max(255).optional(),
  // exp (Expiration Time): Defines the time on or after which the JWT must not be accepted for processing.
  exp: z.number().int().optional(),
  family_name: z.string().max(CONST_STRING_MAX_LENGTH).optional(),
  given_name: z.string().max(CONST_STRING_MAX_LENGTH).optional(),
  groups: z
    .array(z.string().max(CONST_STRING_MAX_LENGTH))
    .max(CONST_ARRAY_MAX_LENGTH)
    .optional(),
  // iat (Issued At): Indicates the time at which the JWT was issued.
  iat: z.number().int().optional(),
  // iss(Issuer): Identifies the principal that issued the JWT.
  iss: z.string().max(CONST_STRING_MAX_LENGTH),
  // (JWT ID): Provides a unique identifier for the JWT.
  jti: z.string().max(CONST_STRING_MAX_LENGTH).optional(),
  max_age: z.number().min(0).optional(),
  name: z.string().max(CONST_STRING_MAX_LENGTH).optional(),
  // nbf(Not Before): Specifies the time before which the JWT must not be accepted for processing.
  nbf: z.number().optional(),
  phone_number: z.string().max(CONST_STRING_MAX_LENGTH).optional(),
  role: z.string().max(CONST_STRING_MAX_LENGTH).optional(),
  scp: z.array(z.string()).max(CONST_ARRAY_MAX_LENGTH).optional(),
  // sub (Subject): Identifies the principal that is the subject of the JWT.
  sub: z.string().max(CONST_STRING_MAX_LENGTH).optional(),
  uid: z.string().max(CONST_STRING_MAX_LENGTH).optional(),
  userId: z.string().max(CONST_STRING_MAX_LENGTH).optional(),
  ver: z.number().optional(),
})

export type IJwt = z.infer<typeof zJwtSchema>

export function JwtDecodeComplete(token: string): jsonWebToken.Jwt {
  const decoded = jsonWebToken.decode(token, { complete: true, json: true })
  if (!decoded) {
    throw new Error(
      'Invalid security token when attempting to retrieve the user id.'
    )
  }

  return decoded
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class JwtBusinessRules {
  static apply(jwtdata: IJwt, enforceUserId: boolean) {
    if (enforceUserId && !jwtdata.userId) {
      throw new Error('User ID is required')
    }

    return jwtdata
  }
}

export function JwtDecodeDigi(token: string, enforceUserId = true) {
  const decoded = jsonWebToken.decode(token)
  if (!decoded || isString(decoded)) {
    throw new Error(
      'Invalid security token when attempting to retrieve the user id.'
    )
  }

  const jwtdata = decoded as IJwt

  return JwtBusinessRules.apply(jwtdata, enforceUserId)
}

// Info source: https://fusionauth.io/docs/lifecycle/authenticate-users/oauth/tokens

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function JwtDecode<T extends IJwtBase>(
  token?: string,
  options?: DecodeOptions
) {
  const decoded = jsonWebToken.decode(
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

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function JwtCreate<TInterface extends IJwtBase, T extends JwtBase>(
  type: IConstructor<T>,
  token: string | TInterface,
  options?: DecodeOptions
): T {
  const decoded = isString(token)
    ? JwtDecode<TInterface>(token, options)
    : token

  return new type(decoded)
}

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
  // Refresh_token
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

// Export function JwtDecodeObject<
//   Tnew extends JwtBase,
//   TInterface extends IJwtBase
// >(
//   TheClass: { new (args: TInterface): Tnew },
//   Token: string | TInterface,
//   Options?: DecodeOptions
// ): Tnew {
//   Return createInstanceWithParams<Tnew, TInterface>(theClass, token, options)
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
  rsaPassPhrase: string,
  options?: SignOptions
) {
  const token = jsonWebToken.sign(
    payload,
    rsaPassPhrase
      ? { key: secretOrPrivateKey, passphrase: rsaPassPhrase }
      : secretOrPrivateKey,
    options
  )

  return token
}

export function GenerateJwt(
  secretOrPrivateKey: string,
  rsaPassPhrase: string,
  overrides: JwtPayload
) {
  const header: JwtHeader = {
    alg: 'RS256',
    // expiresIn: '1h',
    kid: newGuid(),
    // typ: 'JWT',
  }

  const signOptions: SignOptions = {
    header,
  }

  const payload: JwtPayload = overrides

  const jwtToken = JwtSign(
    payload,
    secretOrPrivateKey,
    rsaPassPhrase,
    signOptions
  )

  return jwtToken
}

export function JwtTokenWithUserId(
  userId: string,
  secretOrPrivateKey: string,
  rsaPassPhrase: string,
  overrides?: JwtPayload
) {
  const payload: JwtPayload = {
    sub: userId,
    ...overrides,
  }

  return GenerateJwt(secretOrPrivateKey, rsaPassPhrase, payload)
}

export function JwtTokenWithEmail(
  email: string,
  secretOrPrivateKey: string,
  rsaPassPhrase: string,
  overrides?: Partial<JwtPayload>
) {
  const payload: JwtPayload = {
    email,
    ...overrides,
  }

  return GenerateJwt(secretOrPrivateKey, rsaPassPhrase, payload)
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
  rsaPassPhrase?: string,
  options?: VerifyOptions
) {
  const secretOrKey: Secret =
    rsaPassPhrase && isString(secretOrPublicKey)
      ? { key: secretOrPublicKey, passphrase: rsaPassPhrase }
      : secretOrPublicKey

  const jwtret = jsonWebToken.verify(token, secretOrKey, options)

  return jwtret
}

// Const DEFAULT_JwtFusionAuthIdToken: IJwtFusionAuthIdToken = {
//   ApplicationId: '4b396955-2792-4c59-832f-b9a969dc9ff3',
//   Email: 'grayarrow@gmail.com',
//   Email_verified: true,
//   Family_name: 'Dietrich',
//   Given_name: 'David',
//   Roles: ['admin'],
//   Scope: 'openid offline_access email profile',
//   Sid: '0ab2f927-4858-49da-952c-ada994c7a558',
//   Sub: '73381ce2-f34c-4c9d-a1e4-8fdb4e286e9a',
//   Tid: '67e40228-0e5d-4876-894b-fcebae483a8f',
// }

// Const DEFAULT_JwtClient: IJwtFusionAuthIdToken = {
//   Active: true,
//   ApplicationId: '4b396955-2792-4c59-832f-b9a969dc9ff3',
//   Aud: '4b396955-2792-4c59-832f-b9a969dc9ff3',
//   Auth_time: 1741349501,
//   AuthenticationType: 'PASSWORD',
//   Email: 'grayarrow@gmail.com',
//   Email_verified: true,
//   Exp: 1741353101,
//   Iat: 1741349501,
//   Iss: 'tradeplotter.com',
//   Jti: '7b47b2d8-0864-4163-939f-9a1d2ce9f946',
//   Roles: ['admin'],
//   Scope: 'openid offline_access email profile',
//   Sid: '0ab2f927-4858-49da-952c-ada994c7a558',
//   Sub: '73381ce2-f34c-4c9d-a1e4-8fdb4e286e9a',
//   Tid: '67e40228-0e5d-4876-894b-fcebae483a8f',
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
    const ajwt: IJwtBase = {
      aud: '',
      exp: 0,
      iat: 0,
      iss: '',
      jti: '',
      roles: [],
      scope: '',
      tid: '',
      ...overrides,
    }

    return ajwt
  }

  get ApplicationRoles() {
    const arrRoles: WebRoles[] = [],
      safeRoles = safeArray<string>(this.roles)
    if (safeRoles.includes(WebRoleKeys.ADMIN)) {
      arrRoles.push(WebRoleKeys.ADMIN)
    }

    if (safeRoles.includes(WebRoleKeys.MANAGER)) {
      arrRoles.push(WebRoleKeys.MANAGER)
    }

    if (safeRoles.includes(WebRoleKeys.USER)) {
      arrRoles.push(WebRoleKeys.USER)
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
    return this.ApplicationRoles.includes(WebRoleKeys.ADMIN)
  }

  get isManager() {
    return this.ApplicationRoles.includes(WebRoleKeys.MANAGER) || this.isAdmin
  }

  get isUser() {
    return this.ApplicationRoles.includes(WebRoleKeys.USER) || this.isManager
  }

  get issuer() {
    return safestr(this.iss).replace(/.com$/u, '')
  }

  get isPolitagree() {
    return CONST_IssuerPolitagree === this.iss
  }
  get isPolitagreeAdmin() {
    return this.isAdmin && this.isPolitagree
  }
  get isPolitagreeManager() {
    return this.isManager && this.isPolitagree
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
  get isTradePlotterManager() {
    return this.isManager && this.isTradePlotter
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
    const ajwt: IJwtWithSubject = {
      ...super.DefaultJwt(),
      ...{
        sub: '',
      },
      ...overrides,
    }

    return ajwt
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
    const ajwt: IJwtAccessToken = {
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
      ...overrides,
    }

    return ajwt
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
    const ajwt: IJwtFusionAuthClientCredentials = {
      ...super.DefaultJwt(),
      ...{
        permissions: [],
      },
      ...overrides,
    }

    return ajwt
  }
}

export function FromBearerToken<TNew extends JwtBase>(
  type: IConstructor<TNew>,
  token: string
) {
  return JwtCreate(type, token)
}

export function FromHeaders<TNew extends JwtBase>(
  type: IConstructor<TNew>,
  headers?: Headers | IncomingHttpHeaders | null
) {
  let bearerToken = ''
  const hHeaders = headers as Headers,
    iHeaders = headers as IncomingHttpHeaders

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (hHeaders && isFunction(hHeaders.get)) {
    bearerToken = HttpHeaderManagerBase.BearerTokenParseStrict(
      hHeaders.get('Authorization') ?? hHeaders.get('authorization')
    )
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (iHeaders) {
    bearerToken = safestr(iHeaders.authorization)
  }

  return FromBearerToken(type, bearerToken)
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
    const ajwt: IJwtFusionAuthIdToken = {
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
      ...overrides,
    }

    return ajwt
  }
}
