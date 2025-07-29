import crypto from 'crypto'
import { safeJsonToString } from './object-helper.mjs'
import { safestrToJson } from './string-helper.mjs'

export const CONST_RegexRsaPrivateKeyPem =
  /-----BEGIN RSA PRIVATE KEY-----(?<temp5>\n|\r|\r\n)(?<temp4>[0-9a-zA-Z+/=]{64}(?<temp3>\n|\r|\r\n))*(?<temp2>[0-9a-zA-Z+/=]{1,63}(?<temp1>\n|\r|\r\n))?-----END RSA PRIVATE KEY-----/u

export const CONST_RegexRsaPublicKeyPem =
  /-----BEGIN(?<temp7> RSA)? PUBLIC KEY-----(?<temp6>\n|\r|\r\n)(?<temp5>[0-9a-zA-Z+/=]{64}(?<temp4>\n|\r|\r\n))*(?<temp3>[0-9a-zA-Z+/=]{1,63}(?<temp2>\n|\r|\r\n))?-----END(?<temp1> RSA)? PUBLIC KEY-----/u

export const CONST_RegexRsaPrivateKey =
  /-----BEGIN RSA PRIVATE KEY-----(?<temp1>[^-!]+)-----END RSA PRIVATE KEY-----/u

export const CONST_RegexRsaPublicKey =
  /-----BEGIN RSA PUBLIC KEY-----(?<temp1>[^-!]+)-----END RSA PUBLIC KEY-----/u

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
      modulusLength: 4096,
      privateKeyEncoding: {
        format: 'pem',
        type: 'pkcs1',
        // Cipher: 'aes-256-cbc',
        // Passphrase,
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

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
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
        // Same hashing function and padding scheme that we used to
        // Encrypt the data in the previous step
        oaepHash: 'sha256',
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
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
          oaepHash: 'sha256',
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          passphrase,
        },
        // We convert the data string to a buffer using `Buffer.from`
        Buffer.from(decryptedString, 'utf8')
      ),
      // The encrypted data is in the form of bytes, so we print it in base64 format
      // So that it's displayed in a more readable form
      encryptedString = encryptedData.toString('base64')

    return encryptedString
  }
}
