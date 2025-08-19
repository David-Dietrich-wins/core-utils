import crypto, {
  generateKeyPairSync,
  privateDecrypt,
  publicEncrypt,
} from 'crypto'
import { isString, safestr, safestrToJson } from './string-helper.mjs'
import { safeJsonToString } from './object-helper.mjs'

export const CONST_RegexRsaPrivateKeyPem =
  /-----BEGIN (?<temp6>RSA|ENCRYPTED) PRIVATE KEY-----(?<temp5>\n|\r|\r\n)(?<temp4>[0-9a-zA-Z+/=]{64}(?<temp3>\n|\r|\r\n))*(?<temp2>[0-9a-zA-Z+/=]{1,63}(?<temp1>\n|\r|\r\n))?-----END (?<temp0>RSA|ENCRYPTED) PRIVATE KEY-----/u

export const CONST_RegexRsaPublicKeyPem =
  /-----BEGIN(?<temp7> RSA)? PUBLIC KEY-----(?<temp6>\n|\r|\r\n)(?<temp5>[0-9a-zA-Z+/=]{64}(?<temp4>\n|\r|\r\n))*(?<temp3>[0-9a-zA-Z+/=]{1,63}(?<temp2>\n|\r|\r\n))?-----END(?<temp1> RSA)? PUBLIC KEY-----/u

export const CONST_RegexRsaPrivateKey =
  /-----BEGIN RSA PRIVATE KEY-----(?<temp1>[^-!]+)-----END RSA PRIVATE KEY-----/u

export const CONST_RegexRsaPublicKey =
  /-----BEGIN RSA PUBLIC KEY-----(?<temp1>[^-!]+)-----END RSA PUBLIC KEY-----/u

export interface ICryptoSettings {
  rsaPassPhrase: string
  rsaPrivateKey: string
  rsaPublicKey: string
}

export function rsaDecrypt(
  rsaPrivateKey: string,
  rsaPassPhrase: string,
  cipher: string
) {
  const buf = privateDecrypt(
    {
      key: rsaPrivateKey,
      // In order to decrypt the data, we need to specify the
      // Same hashing function and padding scheme that we used to
      // Encrypt the data in the previous step
      oaepHash: 'sha256',
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      passphrase: rsaPassPhrase,
    },
    Buffer.from(safestr(cipher), 'base64')
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

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function rsaDecryptObject<T = object>(
  rsaPrivateKey: string,
  rsaPassphrase: string,
  cipher: string
) {
  const decrypted = rsaDecrypt(rsaPrivateKey, rsaPassphrase, cipher)

  return safestrToJson<T>(decrypted)
}

export function rsaKeyPairGenerate(passphrase: string) {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
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

  return {
    rsaPrivateKey: privateKey,
    rsaPublicKey: publicKey,
  }
}
