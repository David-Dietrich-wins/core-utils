import crypto, {
  generateKeyPairSync,
  privateDecrypt,
  publicEncrypt,
} from 'node:crypto'
import { safestr, safestrToJson } from '../primitives/string-helper.mjs'

export const REGEX_RsaPrivateKeyPem =
  /-----BEGIN (?:RSA|ENCRYPTED) PRIVATE KEY-----(?:\n|\r|\r\n)(?:[0-9a-zA-Z+/=]{64}(?:\n|\r|\r\n))*(?:[0-9a-zA-Z+/=]{1,63}(?:\n|\r|\r\n))?-----END (?:RSA|ENCRYPTED) PRIVATE KEY-----/u

export const REGEX_RsaPublicKeyPem =
  /-----BEGIN(?: RSA)? PUBLIC KEY-----(?:\n|\r|\r\n)(?:[0-9a-zA-Z+/=]{64}(?:\n|\r|\r\n))*(?:[0-9a-zA-Z+/=]{1,63}(?:\n|\r|\r\n))?-----END(?: RSA)? PUBLIC KEY-----/u

export const REGEX_RsaPrivateKey =
  /-----BEGIN(?: RSA)? PRIVATE KEY-----(?:[^-!]+)-----END(?: RSA)? PRIVATE KEY-----/u

export const REGEX_RsaPublicKey =
  /-----BEGIN(?: RSA)? PUBLIC KEY-----(?:[^-!]+)-----END(?: RSA)? PUBLIC KEY-----/u

export interface ICryptoSettings {
  rsaPassphrase: string
  rsaPrivateKey: string
  rsaPublicKey: string
}

export function rsaDecrypt(
  rsaPrivateKey: string,
  rsaPassphrase: string,
  cipherText: string
) {
  const buf = privateDecrypt(
    {
      key: rsaPrivateKey,
      // In order to decrypt the data, we need to specify the
      // Same hashing function and padding scheme that we used to
      // Encrypt the data in the previous step
      oaepHash: 'sha256',
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      passphrase: rsaPassphrase,
    },
    Buffer.from(safestr(cipherText), 'base64')
  )

  return buf.toString('utf8')
}

export function rsaEncrypt(rsaPublicKey: string, whatToEncrypt: unknown) {
  const encryptedData = publicEncrypt(
      {
        key: rsaPublicKey,
        oaepHash: 'sha256',
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      // We convert the data string to a buffer using `Buffer.from`
      Buffer.from(safestr(whatToEncrypt), 'utf8')
    ),
    // The encrypted data is in the form of bytes, so we print it in base64 format
    // So that it's displayed in a more readable form
    encryptedString = encryptedData.toString('base64')

  return encryptedString
}

export function rsaDecryptObject<T = object>(
  rsaPrivateKey: string,
  rsaPassphrase: string,
  cipher: string
) {
  const decrypted = rsaDecrypt(rsaPrivateKey, rsaPassphrase, cipher)

  return safestrToJson<T>(decrypted)
}

export function rsaKeyGen(passphrase: string) {
  return generateKeyPairSync('rsa', {
    modulusLength: 4096,
    privateKeyEncoding: {
      cipher: 'aes-256-cbc',
      format: 'pem',
      passphrase,
      type: 'pkcs8',
    },
    publicKeyEncoding: {
      format: 'pem',
      type: 'spki',
    },
  })
}

// export function formatPrivateKey(key: string) {
//   const cleansedKey = safeArray(
//     key
//       .replace(/\\n/gu, '\n')
//       .replace(/-----BEGIN ENCRYPTED PRIVATE KEY-----/u, '')
//       .replace(/-----END ENCRYPTED PRIVATE KEY-----/u, '')
//       .replace(/\s+/gu, '')
//       .match(/.{1,64}/gu)
//   ).join('\n')
//   const mykey = `-----BEGIN ENCRYPTED PRIVATE KEY-----\n${cleansedKey}\n-----END ENCRYPTED PRIVATE KEY-----`
//   return mykey
// }
