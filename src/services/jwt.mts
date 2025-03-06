import jwt, {
  DecodeOptions,
  JwtHeader,
  JwtPayload,
  Secret,
  SignOptions,
  VerifyOptions,
} from 'jsonwebtoken'
import { hasData, isFunction, isString, safestr } from './general.mjs'
import { IncomingHttpHeaders } from 'node:http'

export type WebRoles = 'user' | 'admin' | ''

export interface IJwtExtended {
  ver: number
  jti: string
  iss: string
  aud: string
  iat: number
  exp: number
  cid: string
  uid: string
  sid: string
  tid: string
  scp: string[]
  auth_time: number
  sub: string
  birthdate: string
  authenticationType: string
  email: string
  email_verified: boolean
  applicationId: string
  scope: string
  roles: string[]
  givenName: string
  userId: string
  role: WebRoles
  identityVerified: boolean
  name: string
  phoneNumber: string
  familyName: string
}

export function BearerTokenParse(token?: string) {
  let bearerToken = safestr(token)
  if (bearerToken.match(/^[Bb][Ee][Aa][Rr][Ee][Rr] /)) {
    bearerToken = bearerToken.slice(7)
  }

  return bearerToken
}

export function JwtDecode(token?: string, options?: DecodeOptions) {
  const decoded = jwt.decode(BearerTokenParse(token), options)
  if (!decoded || isString(decoded)) {
    throw new Error('Invalid security token when attempting to decode the JWT.')
  }

  const jwtdata = decoded as IJwtExtended

  return jwtdata
}

export function JwtDecodeObject(token?: string, options?: DecodeOptions) {
  const decoded = JwtDecode(token, options)

  return new JwtHelper(decoded)
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
  overrides?: JwtPayload
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

const DEFAULT_JWT: IJwtExtended = {
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
  roles: [],
  givenName: '',
  userId: '',
  role: '' as WebRoles,
  identityVerified: false,
  name: '',
  phoneNumber: '',
  familyName: '',
}

export class JwtHelper implements IJwtExtended {
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

  constructor(token?: string | IJwtExtended | null) {
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

  get issuer() {
    return safestr(this.iss).replace(new RegExp('.com$'), '')
  }
}
