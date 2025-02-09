import CryptoHelper from './CryptoHelper.js'

const pinResetStartingPIN = '1233'

// test('RSA encrypt and decrypt', () => {
//   const lengthForRandomString = 4
//   const randomString = pinResetStartingPIN // CryptoHelper.GenerateRandomPin(lengthForRandomString)

//   expect(randomString).toHaveLength(lengthForRandomString)
//   const cipherText = CryptoHelper.rsaEncryptStatic(randomString, getAceConfig().crypto.rsaPublicKey)
//   expect(cipherText).not.toBeNull()
//   const decrypted = CryptoHelper.rsaDecryptStatic(
//     cipherText,
//     getAceConfig().crypto.rsaPrivateKey,
//     getAceConfig().crypto.rsaPassphrase
//   )
//   expect(decrypted).not.toBeNull()

//   expect(decrypted).toEqual(randomString)
// })

test('Generate random pin', () => {
  const lengthForRandomString = 4
  const ranstr = CryptoHelper.GenerateRandomPin(lengthForRandomString)

  expect(ranstr).toHaveLength(lengthForRandomString)
})
test('Generate random string', () => {
  const lengthForRandomString = 4
  const ranstr = CryptoHelper.GenerateRandomString(lengthForRandomString)

  expect(ranstr).toHaveLength(lengthForRandomString)
})
