import jwt, {
  DecodeOptions,
  JwtHeader,
  JwtPayload,
  Secret,
  SignOptions,
  VerifyOptions,
} from 'jsonwebtoken'
import {
  hasData,
  isFunction,
  isString,
  safeArray,
  safestr,
} from './general.mjs'
import { IncomingHttpHeaders } from 'node:http'
import { HttpHeaderManagerBase } from './HttpHeaderManager.mjs'
import { AppException } from '../index.mjs'

export type WebRoles = 'user' | 'admin'

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
}

/**
 * Interface for the extended JWT token.
 * This is the decoded token and it follows FusionAuth's JWT token format.
 * https://fusionauth.io/docs/lifecycle/authenticate-users/oauth/tokens
 */
export interface IJwtAccessClient extends IJwtBase {
  ver: number
  cid: string
  uid: string
  // refresh_token
  sid: string
  // UUID: The FusionAuth Tenant unique Id.
  tid: string
  scp: string[]
  auth_time: number
  // UUID The subject of the access token.
  // This value is equal to the recipient Entity’s unique Id in FusionAuth.
  sub: string
  birthdate: string
  // Always JWT
  authenticationType: string
  email: string
  email_verified: boolean
  applicationId: string
  givenName: string
  userId: string
  identityVerified: boolean
  name: string
  phoneNumber: string
  familyName: string
}

export function JwtDecode(token?: string, options?: DecodeOptions) {
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

  return decoded as IJwtAccessClient
}

export function JwtDecodeObject(token?: string, options?: DecodeOptions) {
  const decoded = JwtDecode(token, options)

  return new JwtAccessClient(decoded)
}

export function JwtRetrieveUserId(token: string) {
  const jwtret = JwtDecode(token)

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
  userId: number,
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

  const payload: JwtPayload = {
    ...{
      userId,
    },
    ...overrides,
  }

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

const DEFAULT_JWT: IJwtAccessClient = {
  ver: 0,
  jti: '',
  iss: '',
  aud: '',
  iat: 0,
  exp: 0,
  cid: '',
  uid: '',
  sid: '',
  tid: '',
  scp: [],
  auth_time: 0,
  sub: '',
  birthdate: '',
  authenticationType: '',
  email: '',
  email_verified: false,
  applicationId: '',
  scope: '',
  roles: new Array<string>(),
  givenName: '',
  userId: '',
  identityVerified: false,
  name: '',
  phoneNumber: '',
  familyName: '',
}

export class JwtAccessClient implements IJwtAccessClient {
  ver = 0
  jti = ''
  iss = ''
  aud = ''
  iat = 0
  exp = 0
  cid = ''
  uid = ''
  sid = ''
  tid = ''
  scp = []
  auth_time = 0
  sub = ''
  birthdate = ''
  authenticationType = ''
  email = ''
  email_verified = false
  applicationId = ''
  scope = ''
  roles = []
  givenName = ''
  userId = ''
  role = '' as WebRoles
  identityVerified = false
  name = ''
  phoneNumber = ''
  familyName = ''

  constructor(token?: string | IJwtAccessClient | null) {
    let jwtdata = DEFAULT_JWT
    if (token && hasData(token)) {
      if (isString(token)) {
        jwtdata = JwtDecode(token)
      } else {
        jwtdata = { ...token }
      }
    }

    Object.assign(this, { ...DEFAULT_JWT, ...jwtdata })
  }

  static FromHeaders(headers?: Headers | IncomingHttpHeaders | null) {
    let authHeader = ''
    const hHeaders = headers as Headers
    const iHeaders = headers as IncomingHttpHeaders

    if (hHeaders && isFunction(hHeaders.get)) {
      authHeader = safestr(
        hHeaders.get('Authorization') ?? hHeaders.get('authorization')
      )
    } else if (iHeaders) {
      authHeader = safestr(iHeaders.authorization)
    }

    return JwtDecodeObject(authHeader)
  }

  static FromString(token?: string) {
    return JwtDecodeObject(token)
  }

  get ApplicationRoles() {
    const arrRoles: WebRoles[] = []

    const safeRoles = safeArray<string>(this.roles)
    if (safeRoles.includes('admin')) {
      arrRoles.push('admin')
      arrRoles.push('user')
    }

    if (safeRoles.includes('user') && !arrRoles.includes('user')) {
      arrRoles.push('user')
    }

    return arrRoles
  }

  get audience() {
    return this.aud
  }

  get authenticationTime() {
    return this.auth_time
  }

  get FusionAuthUserId() {
    return this.sub
  }

  get issuer() {
    return safestr(this.iss).replace(new RegExp('.com$'), '')
  }

  get issuedTime() {
    return this.iat
  }

  get refreshToken() {
    return this.sid
  }

  get tenantId() {
    return this.tid
  }
}
