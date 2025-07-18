import { TEST_Parameters_DEV } from '../jest.setup.mjs'
import {
  CONST_RegexRsaPrivateKeyPem,
  CONST_RegexRsaPublicKeyPem,
  CryptoHelper,
  ICryptoSettings,
} from './CryptoHelper.mjs'

/**
 * Generate a 2048-bit RSA key pair
 * openssl genrsa -out rsaKey.pem 2048
 * openssl rsa -in rsaKey.pem -pubout > rsaKey.pub
 *
 * openssl genrsa -aes128 -passout "pass:${rsaPassPhrase}" -out rsaKey.pem 3072
 * openssl rsa -in rsaKey.pem -passin "pass:${rsaPassPhrase}" -pubout -out rsaKey.pub
 */

const StringToEncrypt = '1233'

test('Constructor', () => {
  const cryptoSettings: ICryptoSettings = {
      rsaPrivateKey: TEST_Parameters_DEV.rsaPrivateKey,
      rsaPublicKey: TEST_Parameters_DEV.rsaPublicKey,
      rsaPassPhrase: '',
    },
    ch = new CryptoHelper(cryptoSettings),
    encrypted = ch.rsaEncrypt(StringToEncrypt),
    decrypted = ch.rsaDecrypt(encrypted)

  expect(decrypted).toBe(StringToEncrypt)
})

test('RSA generate key pair', () => {
  const { rsaPublicKey, rsaPrivateKey } = CryptoHelper.GenerateRsaKeyPair()

  expect(rsaPublicKey).toMatch(CONST_RegexRsaPublicKeyPem)
  expect(rsaPrivateKey).toMatch(CONST_RegexRsaPrivateKeyPem)
})

test('RSA encrypt and decrypt', () => {
  const lengthForRandomString = 4,
    randomString = StringToEncrypt // CryptoHelper.GenerateRandomPin(lengthForRandomString)

  expect(randomString).toHaveLength(lengthForRandomString)
  const cipherText = CryptoHelper.rsaEncryptStatic(
    randomString,
    TEST_Parameters_DEV.rsaPublicKey
  )
  expect(cipherText).not.toBeNull()
  const decrypted = CryptoHelper.rsaDecryptStatic(
    cipherText,
    TEST_Parameters_DEV.rsaPrivateKey,
    '' //TEST_Parameters_DEV.rsaPassPhrase
  )
  expect(decrypted).not.toBeNull()

  expect(decrypted).toEqual(randomString)
})

// Describe('Generate random PIN', () => {
//   Test('length for random PIN', () => {
//     Const lengthForRandomString = 4
//     Const ranstr = CryptoHelper.GenerateRandomPin(lengthForRandomString)

//     Expect(ranstr).toHaveLength(lengthForRandomString)
//   })
//   Test('using chars and numbers', () => {
//     Const lengthForRandomString = 4
//     Const ranstr = CryptoHelper.GenerateRandomPin(
//       LengthForRandomString,
//       CryptoHelper.CONST_CharsNumbers
//     )

//     Expect(ranstr).toHaveLength(lengthForRandomString)
//   })

//   Test('cannot verify', () => {
//     Const mockStaticF = jest.fn().mockReturnValue(true)
//     AceApiHelper.verifyPin = mockStaticF

//     Const spy = jest.spyOn(AceApiHelper, 'verifyPin').mockReturnValue()

//     Expect(AceApiHelper.verifyPin('1234')).toBeUndefined()

//     // unnecessary in this case, putting it here just to illustrate how to "unmock" a method
//     Spy.mockRestore()
//   })

//   Test('cannot verify, too long', () => {
//     Const spy = jest.spyOn(AceApiHelper, 'verifyPin').mockImplementation(() => {
//       throw new AppException('Your PIN cannot be greater than 4 numbers.')
//     })

//     Expect(spy).toThrow()

//     Const lengthForRandomString = 4
//     Expect(() =>
//       CryptoHelper.GenerateRandomPin(
//         LengthForRandomString,
//         CryptoHelper.CONST_CharsNumbers
//       )
//     ).toThrow()

//     // unnecessary in this case, putting it here just to illustrate how to "unmock" a method
//     Spy.mockRestore()
//   })
// })

describe('Generate random string', () => {
  test('no params', () => {
    const lengthForRandomString = 4,
      ranstr = CryptoHelper.GenerateRandomString()

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
  test('proper length', () => {
    const lengthForRandomString = 4,
      ranstr = CryptoHelper.GenerateRandomString(lengthForRandomString)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
  test('using chars and numbers', () => {
    const lengthForRandomString = 4,
      ranstr = CryptoHelper.GenerateRandomString(
        lengthForRandomString,
        CryptoHelper.CONST_CharsNumbers
      )

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
})

test('rsaDecryptStaticObject with JSON', () => {
  const lengthForRandomString = 4,
    randomString = CryptoHelper.GenerateRandomString(lengthForRandomString),
    jsonObject = { data: randomString },
    cipherText = CryptoHelper.rsaEncryptStaticObject(
      jsonObject,
      TEST_Parameters_DEV.rsaPublicKey
    )
  expect(cipherText).not.toBeNull()
  const decrypted = CryptoHelper.rsaDecryptStaticObject(
    cipherText,
    TEST_Parameters_DEV.rsaPrivateKey,
    '' //TEST_Parameters_DEV.rsaPassPhrase
  )
  expect(decrypted).not.toBeNull()
  expect(decrypted).toEqual(jsonObject)
})
