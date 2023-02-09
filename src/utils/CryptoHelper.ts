import CryptoJs from 'crypto-js'
const { TripleDES } = CryptoJs

export interface ICryptoSettings {
  aes256key: string
  aes256iv: string
  tripleDesEncryptionKey: string
}

export default class CryptoHelper {
  public static readonly CONST_CharsNumbers = '01234567890'
  public static readonly CONST_CharsAlphabetLower = 'abcdefghijklmnopqrstuvwxyz'
  public static readonly CONST_CharsAlphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  public static readonly CONST_CharsToUseForRandomString =
    CryptoHelper.CONST_CharsAlphabetLower +
    CryptoHelper.CONST_CharsAlphabetUpper +
    CryptoHelper.CONST_CharsNumbers

  constructor(public cryptoSettings: ICryptoSettings) {}

  static decryptStringTripleDesStatic(encryptedString: string, encryptionKey: string) {
    const decryptedWordArray = TripleDES.decrypt(encryptedString, encryptionKey)

    const decryptedString = decryptedWordArray.toString(CryptoJs.enc.Utf8)
    console.log(
      `${CryptoHelper.decryptStringTripleDesStatic.name} decrypted string: ${decryptedString} from encrypted: ${encryptedString}.`
    )

    return decryptedString
  }

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

  static encryptStringTripleDesStatic(decryptedString: string, encryptionKey: string) {
    const encryptedCipherParams = TripleDES.encrypt(decryptedString, encryptionKey)

    const encryptedString = encryptedCipherParams.toString()
    console.log(
      `${CryptoHelper.encryptStringTripleDesStatic.name} decrypted string: ${decryptedString} - encrypted: ${encryptedString}.`
    )
    return encryptedString
  }

  static GenerateRandomString(
    exactLength = 4,
    charsToUse = CryptoHelper.CONST_CharsToUseForRandomString
  ) {
    return [...Array(exactLength)]
      .map(() => charsToUse[Math.floor(Math.random() * charsToUse.length)])
      .join('')
  }

  decryptStringTripleDes(encryptedString: string) {
    return CryptoHelper.decryptStringTripleDesStatic(
      encryptedString,
      this.cryptoSettings.tripleDesEncryptionKey
    )
  }
  encryptStringTripleDes(decryptedString: string) {
    return CryptoHelper.encryptStringTripleDesStatic(
      decryptedString,
      this.cryptoSettings.tripleDesEncryptionKey
    )
  }
}
