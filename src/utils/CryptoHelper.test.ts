import { CryptoHelper } from './CryptoHelper.js'

describe('CryptoHelper', () => {
  test('Generate random string', () => {
    const lengthForRandomString = 4
    const ranstr = CryptoHelper.GenerateRandomString(lengthForRandomString)

    expect(ranstr).toHaveLength(lengthForRandomString)
  })
})
