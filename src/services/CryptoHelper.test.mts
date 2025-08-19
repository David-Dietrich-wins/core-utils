import {
  CONST_RegexRsaPrivateKeyPem,
  CONST_RegexRsaPublicKeyPem,
  rsaDecrypt,
  rsaDecryptObject,
  rsaEncrypt,
  rsaKeyPairGenerate,
} from './CryptoHelper.mjs'
import { TEST_Settings } from '../jest.setup.mjs'
import { randomStringGenerate } from './string-helper.mts'

/**
 * Generate an RSA key pair
 * openssl genrsa -out rsaKey.pem 2048
 * openssl rsa -in rsaKey.pem -pubout > rsaKey.pub
 *
 * openssl genrsa -aes128 -passout "pass:${rsaPassPhrase}" -out rsaKey.pem 3072
 * openssl rsa -in rsaKey.pem -passin "pass:${rsaPassPhrase}" -pubout -out rsaKey.pub
 *
 * Or use the `rsaKeyPairGenerate` function
 * run-func ./dist/services/CryptoHelper.mjs rsaKeyPairGenerate -- "${rsaPassPhrase}" >> ~/.bashrc
 */

test.each(['Anything we want to encrypt.', 542, 45.55, true, Symbol('test')])(
  `${rsaKeyPairGenerate.name}: %s`,
  (val) => {
    const { rsaPublicKey, rsaPrivateKey } = rsaKeyPairGenerate(
      TEST_Settings.rsaPassPhrase
    )

    expect(rsaPublicKey).toMatch(CONST_RegexRsaPublicKeyPem)
    expect(rsaPrivateKey).toMatch(CONST_RegexRsaPrivateKeyPem)

    const cipherText = rsaEncrypt(rsaPublicKey, val)
    expect(cipherText).not.toBeNull()

    const decrypted = rsaDecrypt(
      rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      cipherText
    )

    expect(decrypted).toEqual(String(val))
  }
)

describe(rsaDecrypt.name, () => {
  test.each(['string', 4578, true, 24.4589, 5n, Symbol('test')])(
    `${rsaEncrypt.name}: %s`,
    (input) => {
      const cipherText = rsaEncrypt(TEST_Settings.rsaPublicKey, input)
      expect(cipherText).not.toBeNull()

      const decrypted = rsaDecrypt(
        TEST_Settings.rsaPrivateKey,
        TEST_Settings.rsaPassPhrase,
        cipherText
      )

      expect(decrypted).toEqual(String(input))
    }
  )
})

describe(rsaDecryptObject.name, () => {
  test('array of numbers', () => {
    const arr = [1, 2, 3, 465, 50067, 1000, 5000, 10000]
    const cipherText = rsaEncrypt(TEST_Settings.rsaPublicKey, arr)
    expect(cipherText).not.toBeNull()

    const decrypted = rsaDecryptObject(
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      cipherText
    )
    expect(decrypted).not.toBeNull()

    expect(decrypted).toStrictEqual(arr)
  })

  test('array of strings', () => {
    const arr = ['array', 'hello world', 'world']
    const cipherText = rsaEncrypt(TEST_Settings.rsaPublicKey, arr)
    expect(cipherText).not.toBeNull()

    const decrypted = rsaDecryptObject(
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      cipherText
    )
    expect(decrypted).not.toBeNull()

    expect(decrypted).toStrictEqual(arr)
  })

  test('array of objects', () => {
    const arr = ['hello world', { world: 'hello world' }]
    const cipherText = rsaEncrypt(TEST_Settings.rsaPublicKey, arr)
    expect(cipherText).not.toBeNull()

    const decrypted = rsaDecryptObject(
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      cipherText
    )

    expect(decrypted).toStrictEqual(arr)
  })

  test('object', () => {
    const obj = {
      data: 'hello world',
      hello: { world: 'hello world' },
    }

    const cipherText = rsaEncrypt(TEST_Settings.rsaPublicKey, obj)
    expect(cipherText).not.toBeNull()

    const decrypted = rsaDecryptObject<typeof obj>(
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      cipherText
    )
    expect(decrypted).not.toBeNull()

    expect(decrypted).toStrictEqual(obj)
  })

  test('random object', () => {
    const lengthForRandomString = 4,
      randomString = randomStringGenerate(lengthForRandomString),
      randomStringObject = { data: randomString },
      zcipherText = rsaEncrypt(TEST_Settings.rsaPublicKey, randomStringObject)
    expect(zcipherText).not.toBeNull()

    const decrypted = rsaDecryptObject(
      TEST_Settings.rsaPrivateKey,
      TEST_Settings.rsaPassPhrase,
      zcipherText
    )
    expect(decrypted).not.toBeNull()
    expect(decrypted).toEqual(randomStringObject)
  })
})
