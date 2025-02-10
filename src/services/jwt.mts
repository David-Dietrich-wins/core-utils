import jwt, {
  DecodeOptions,
  JwtHeader,
  JwtPayload,
  Secret,
  SignOptions,
  VerifyOptions,
} from 'jsonwebtoken'
import { isString } from './general.mjs'

export interface IJwtExtended {
  ver: number
  jti: string
  iss: string
  aud: string
  iat: number
  exp: number
  cid: string
  uid: string
  scp: string[]
  auth_time: number
  sub: string
  birthdate: string
  emailVerified: boolean
  groups: string[]
  givenName: string
  userId: string
  role: 'user'
  identityVerified: boolean
  name: string
  phoneNumber: string
  familyName: string
  email: string
}

export function JwtDecode(token: string, options?: DecodeOptions) {
  const decoded = jwt.decode(token, options)
  if (!decoded || isString(decoded)) {
    throw new Error('Invalid security token when attempting to retrieve the player id.')
  }

  const jwtdata = decoded as IJwtExtended

  return jwtdata
}

export function JwtRetrieveUserId(token: string) {
  const jwtmgm = JwtDecode(token)

  return jwtmgm.userId
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
