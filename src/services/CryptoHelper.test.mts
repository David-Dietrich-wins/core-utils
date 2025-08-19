import {
  CONST_RegexRsaPrivateKeyPem,
  CONST_RegexRsaPublicKeyPem,
  rsaDecrypt,
  rsaDecryptObject,
  rsaEncrypt,
  rsaEncryptObject,
  rsaKeyPairGenerate,
} from './CryptoHelper.mjs'
import { TEST_Settings } from '../jest.setup.mjs'
import { randomStringGenerate } from './string-helper.mts'

/**
 * Generate a 2048-bit RSA key pair
 * openssl genrsa -out rsaKey.pem 2048
 * openssl rsa -in rsaKey.pem -pubout > rsaKey.pub
 *
 * openssl genrsa -aes128 -passout "pass:${rsaPassPhrase}" -out rsaKey.pem 3072
 * openssl rsa -in rsaKey.pem -passin "pass:${rsaPassPhrase}" -pubout -out rsaKey.pub
 */

const StringToEncrypt = '1233'

test('RSA generate key pair', () => {
  const { rsaPublicKey, rsaPrivateKey } = rsaKeyPairGenerate(
    TEST_Settings.rsaPassPhrase
  )

  expect(rsaPublicKey).toMatch(CONST_RegexRsaPublicKeyPem)
  expect(rsaPrivateKey).toMatch(CONST_RegexRsaPrivateKeyPem)

  const lengthForRandomString = 4,
    randomString = StringToEncrypt

  expect(randomString).toHaveLength(lengthForRandomString)
  const cipherText = rsaEncrypt(
    rsaPublicKey,
    // TEST_Settings.rsaPassPhrase,
    randomString
  )
  expect(cipherText).not.toBeNull()
  const decrypted = rsaDecrypt(
    rsaPrivateKey,
    TEST_Settings.rsaPassPhrase,
    cipherText
  )
  expect(decrypted).not.toBeNull()

  expect(decrypted).toEqual(randomString)
})

test('RSA encrypt and decrypt', () => {
  const lengthForRandomString = 4,
    randomString = StringToEncrypt

  expect(randomString).toHaveLength(lengthForRandomString)
  const cipherText = rsaEncrypt(
    TEST_Settings.rsaPublicKey,
    // TEST_Settings.rsaPassPhrase,
    randomString
  )
  expect(cipherText).not.toBeNull()
  const decrypted = rsaDecrypt(
    TEST_Settings.rsaPrivateKey,
    TEST_Settings.rsaPassPhrase,
    cipherText
  )
  expect(decrypted).not.toBeNull()

  expect(decrypted).toEqual(randomString)
})

// Describe('Generate random PIN', () => {
//   Test('length for random PIN', () => {
//     Const lengthForRandomString = 4
//     Const ranstr = GenerateRandomPin(lengthForRandomString)

//     Expect(ranstr).toHaveLength(lengthForRandomString)
//   })
//   Test('using chars and numbers', () => {
//     Const lengthForRandomString = 4
//     Const ranstr = GenerateRandomPin(
//       LengthForRandomString,
//       CONST_CharsNumbers
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
//       GenerateRandomPin(
//         LengthForRandomString,
//         CONST_CharsNumbers
//       )
//     ).toThrow()

//     // unnecessary in this case, putting it here just to illustrate how to "unmock" a method
//     Spy.mockRestore()
//   })
// })

test('rsaDecryptStaticObject with JSON', () => {
  const lengthForRandomString = 4,
    randomString = randomStringGenerate(lengthForRandomString),
    randomStringObject = { data: randomString },
    zcipherText = rsaEncryptObject(
      TEST_Settings.rsaPublicKey,
      // TEST_Settings.rsaPassPhrase,
      randomStringObject
    )

  expect(zcipherText).not.toBeNull()
  const decrypted = rsaDecryptObject(
    TEST_Settings.rsaPrivateKey,
    TEST_Settings.rsaPassPhrase,
    zcipherText
  )
  expect(decrypted).not.toBeNull()
  expect(decrypted).toEqual(randomStringObject)
})
