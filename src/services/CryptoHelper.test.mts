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
  }
  const ch = new CryptoHelper(cryptoSettings)

  const encrypted = ch.rsaEncrypt(StringToEncrypt)
  const decrypted = ch.rsaDecrypt(encrypted)

  expect(decrypted).toBe(StringToEncrypt)
})

test('RSA generate key pair', () => {
  const { rsaPublicKey, rsaPrivateKey } = CryptoHelper.GenerateRsaKeyPair()

  expect(rsaPublicKey).toMatch(CONST_RegexRsaPublicKeyPem)
  expect(rsaPrivateKey).toMatch(CONST_RegexRsaPrivateKeyPem)
})

test('RSA encrypt and decrypt', () => {
  const lengthForRandomString = 4
  const randomString = StringToEncrypt // CryptoHelper.GenerateRandomPin(lengthForRandomString)

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

// describe('Generate random PIN', () => {
//   test('length for random PIN', () => {
//     const lengthForRandomString = 4
//     const ranstr = CryptoHelper.GenerateRandomPin(lengthForRandomString)

//     expect(ranstr).toHaveLength(lengthForRandomString)
//   })
//   test('using chars and numbers', () => {
//     const lengthForRandomString = 4
//     const ranstr = CryptoHelper.GenerateRandomPin(
//       lengthForRandomString,
//       CryptoHelper.CONST_CharsNumbers
//     )

//     expect(ranstr).toHaveLength(lengthForRandomString)
//   })

//   test('cannot verify', () => {
//     const mockStaticF = jest.fn().mockReturnValue(true)
//     AceApiHelper.verifyPin = mockStaticF

//     const spy = jest.spyOn(AceApiHelper, 'verifyPin').mockReturnValue()

//     expect(AceApiHelper.verifyPin('1234')).toBeUndefined()

//     // unnecessary in this case, putting it here just to illustrate how to "unmock" a method
//     spy.mockRestore()
//   })

//   test('cannot verify, too long', () => {
//     const spy = jest.spyOn(AceApiHelper, 'verifyPin').mockImplementation(() => {
//       throw new Error('Your PIN cannot be greater than 4 numbers.')
//     })

//     expect(spy).toThrow()

//     const lengthForRandomString = 4
//     expect(() =>
//       CryptoHelper.GenerateRandomPin(
//         lengthForRandomString,
//         CryptoHelper.CONST_CharsNumbers
//       )
//     ).toThrow()

//     // unnecessary in this case, putting it here just to illustrate how to "unmock" a method
//     spy.mockRestore()
//   })
// })

describe('Generate random string', () => {
  test('no params', () => {
    const lengthForRandomString = 4
    const ranstr = CryptoHelper.GenerateRandomString()

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
  test('proper length', () => {
    const lengthForRandomString = 4
    const ranstr = CryptoHelper.GenerateRandomString(lengthForRandomString)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
  test('using chars and numbers', () => {
    const lengthForRandomString = 4
    const ranstr = CryptoHelper.GenerateRandomString(
      lengthForRandomString,
      CryptoHelper.CONST_CharsNumbers
    )

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
})
