import jwt, { DecodeOptions, Secret, SignOptions, VerifyOptions } from 'jsonwebtoken'
import { isString } from './general.js'

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
  'com.mgm.emailVerified': boolean
  groups: string[]
  given_name: string
  'com.mgm.id': string
  mgm_role: 'guest'
  'com.mgm.identity.verified': boolean
  name: string
  'com.mgm.loyalty.perpetual_eligible': boolean
  phone_number: string
  mlife: string
  'com.mgm.gse.id': string
  'com.mgm.loyalty.perpetual_eligible_properties': []
  family_name: string
  'com.mgm.loyalty.freeplay_available': boolean
  email: string
  'com.mgm.mlife_number': string
}

export function JwtDecodeMgm(token: string) {
  const decoded = jwt.decode(token)
  if (!decoded || isString(decoded)) {
    throw new Error('Invalid security token when attempting to retrieve the player id.')
  }

  const jwtdata = decoded as IJwtExtended

  return jwtdata
}

export function JwtRetrievePlayerId(token: string) {
  const jwtmgm = JwtDecodeMgm(token)

  return jwtmgm.mlife
}

/**
 * Synchronously sign the given payload into a JSON Web Token string
 * payload - Payload to sign, could be an literal, buffer or string
 * secretOrPrivateKey - Either the secret for HMAC algorithms, or the PEM encoded private key for RSA and ECDSA.
 * [options] - Options for the signature
 * returns - The JSON Web Token string
 */
export function JwtDecode(token: string, options?: DecodeOptions | undefined) {
  const jwtToken = jwt.decode(token, options)

  return jwtToken
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
