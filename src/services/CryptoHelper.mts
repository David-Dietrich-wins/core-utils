import crypto from 'crypto'
import { safeJsonToString, safestrToJson } from './general.mjs'

export const CONST_RegexRsaPrivateKeyPem =
  /-----BEGIN RSA PRIVATE KEY-----(\n|\r|\r\n)([0-9a-zA-Z+/=]{64}(\n|\r|\r\n))*([0-9a-zA-Z+/=]{1,63}(\n|\r|\r\n))?-----END RSA PRIVATE KEY-----/

export const CONST_RegexRsaPublicKeyPem =
  /-----BEGIN( RSA)? PUBLIC KEY-----(\n|\r|\r\n)([0-9a-zA-Z+/=]{64}(\n|\r|\r\n))*([0-9a-zA-Z+/=]{1,63}(\n|\r|\r\n))?-----END( RSA)? PUBLIC KEY-----/

export const CONST_RegexRsaPrivateKey =
  /-----BEGIN RSA PRIVATE KEY-----([^-!]+)-----END RSA PRIVATE KEY-----/

export const CONST_RegexRsaPublicKey =
  /-----BEGIN RSA PUBLIC KEY-----([^-!]+)-----END RSA PUBLIC KEY-----/

export interface ICryptoSettings {
  rsaPrivateKey: string
  rsaPublicKey: string
  rsaPassPhrase?: string
}

export class CryptoHelper {
  public static readonly CONST_CharsNumbers = '0123456789'
  public static readonly CONST_CharsAlphabetLower = 'abcdefghijklmnopqrstuvwxyz'
  public static readonly CONST_CharsAlphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  public static readonly CONST_CharsToUseForRandomString =
    CryptoHelper.CONST_CharsAlphabetLower +
    CryptoHelper.CONST_CharsAlphabetUpper +
    CryptoHelper.CONST_CharsNumbers

  constructor(public cryptoSettings: ICryptoSettings) {}

  static GenerateRsaKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
        // cipher: 'aes-256-cbc',
        // passphrase,
      },
    })

    return { rsaPublicKey: publicKey, rsaPrivateKey: privateKey }
  }

  static GenerateRandomString(
    exactLength = 4,
    charsToUse = CryptoHelper.CONST_CharsToUseForRandomString
  ) {
    return [...Array(exactLength)]
      .map(() => charsToUse[Math.floor(Math.random() * charsToUse.length)])
      .join('')
  }

  rsaDecrypt(encryptedString: string) {
    return CryptoHelper.rsaDecryptStatic(
      encryptedString,
      this.cryptoSettings.rsaPrivateKey,
      this.cryptoSettings.rsaPassPhrase
    )
  }
  rsaEncrypt(decryptedString: string) {
    return CryptoHelper.rsaEncryptStatic(
      decryptedString,
      this.cryptoSettings.rsaPublicKey
    )
  }

  static rsaDecryptStaticObject<T = object>(
    encryptedString: string,
    privateKey: string,
    passphrase?: string
  ) {
    const decrypted = CryptoHelper.rsaDecryptStatic(
      JSON.stringify(encryptedString),
      privateKey,
      passphrase
    )

    return safestrToJson<T>(decrypted)
  }
  static rsaDecryptStatic(
    encryptedString: string,
    privateKey: string,
    passphrase?: string
  ) {
    const buf = crypto.privateDecrypt(
      {
        key: privateKey,
        // In order to decrypt the data, we need to specify the
        // same hashing function and padding scheme that we used to
        // encrypt the data in the previous step
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
        passphrase,
      },
      Buffer.from(encryptedString, 'base64')
    )

    return buf.toString('utf8')
  }

  static rsaEncryptStaticObject(
    decryptedObject: object,
    publicKey: string,
    passphrase?: string
  ) {
    return CryptoHelper.rsaEncryptStatic(
      safeJsonToString(decryptedObject),
      publicKey,
      passphrase
    )
  }
  static rsaEncryptStatic(
    decryptedString: string,
    publicKey: string,
    passphrase?: string
  ) {
    const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
        passphrase,
      },
      // We convert the data string to a buffer using `Buffer.from`
      Buffer.from(decryptedString, 'utf8')
    )

    // The encrypted data is in the form of bytes, so we print it in base64 format
    // so that it's displayed in a more readable form
    const encryptedString = encryptedData.toString('base64')

    return encryptedString
  }
}
