import CryptoJs from 'crypto-js'
import crypto from 'crypto'
import { GrayArrowException } from '../models/GrayArrowException'
const { TripleDES } = CryptoJs

export interface ICryptoSettings {
  aes256key: string
  aes256iv: string
  PinEncryptionKey: string
  rsaPrivateKey: string
  rsaPublicKey: string
  rsaPassphrase?: string
}

export default class CryptoHelper {
  public static readonly CONST_CharsNumbers = '0123456789'
  public static readonly CONST_CharsAlphabetLower = 'abcdefghijklmnopqrstuvwxyz'
  public static readonly CONST_CharsAlphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  public static readonly CONST_CharsToUseForRandomString =
    CryptoHelper.CONST_CharsAlphabetLower +
    CryptoHelper.CONST_CharsAlphabetUpper +
    CryptoHelper.CONST_CharsNumbers

  constructor(public cryptoSettings: ICryptoSettings) {}

  static aesDecrypt(data: string, key: string, iv: string) {
    const cipher = CryptoJS.AES.decrypt(data, key, {
      iv: CryptoJs.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    return cipher.toString(CryptoJS.enc.Utf8)
  }
  static aesEncrypt(data: string, key: string, iv: string) {
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    })

    return cipher.toString()
  }

  static GenerateRandomPin(exactLength = 4, charsToUse = CryptoHelper.CONST_CharsNumbers) {
    let numberOfPinRetries = 0
    while (numberOfPinRetries < 100) {
      const pin = CryptoHelper.GenerateRandomString(exactLength, charsToUse)

      try {
        return pin
      } catch (err) {
        console.log('getRandomPin: created bad pin:', pin)
      }

      ++numberOfPinRetries
    }

    throw new GrayArrowException(
      `Could not generate a valid pin in ${numberOfPinRetries} tries.`,
      CryptoHelper.GenerateRandomPin.name
    )
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
      this.cryptoSettings.rsaPassphrase
    )
  }
  rsaEncrypt(decryptedString: string) {
    return CryptoHelper.rsaEncryptStatic(decryptedString, this.cryptoSettings.rsaPublicKey)
  }

  static rsaDecryptStatic(encryptedString: string, privateKey: string, passphrase?: string) {
    const buf = crypto.privateDecrypt(
      {
        key: privateKey,
        // In order to decrypt the data, we need to specify the
        // same hashing function and padding scheme that we used to
        // encrypt the data in the previous step
        // padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        // oaepHash: 'sha256',
        passphrase,
      },
      Buffer.from(encryptedString, 'base64')
    )

    return buf.toString('utf8')
  }
  static rsaEncryptStatic(decryptedString: string, publicKey: string, passphrase?: string) {
    const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        // padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        // oaepHash: 'sha256',
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

  static tripleDesDecryptStatic(encryptedString: string, encryptionKey: string) {
    const decryptedWordArray = TripleDES.decrypt(encryptedString, encryptionKey)

    const decryptedString = decryptedWordArray.toString(CryptoJs.enc.Utf8)
    console.log(
      `${CryptoHelper.tripleDesDecryptStatic.name} decrypted string: ${decryptedString} from encrypted: ${encryptedString}.`
    )

    return decryptedString
  }
  static tripleDesEncryptStatic(decryptedString: string, encryptionKey: string) {
    const encryptedCipherParams = TripleDES.encrypt(decryptedString, encryptionKey)

    const encryptedString = encryptedCipherParams.toString()
    console.log(
      `${CryptoHelper.tripleDesEncryptStatic.name} decrypted string: ${decryptedString} - encrypted: ${encryptedString}.`
    )
    return encryptedString
  }

  tripleDesDecrypt(encryptedString: string) {
    return CryptoHelper.tripleDesDecryptStatic(
      encryptedString,
      this.cryptoSettings.PinEncryptionKey
    )
  }
  tripleDesEncrypt(decryptedString: string) {
    return CryptoHelper.tripleDesEncryptStatic(
      decryptedString,
      this.cryptoSettings.PinEncryptionKey
    )
  }
}
