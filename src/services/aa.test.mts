/* eslint-disable arrow-body-style */
import { jest } from '@jest/globals'

jest.unstable_mockModule('./services/string-helper.mjs', () => ({
  safestrToJson: () => {
    return undefined
    // throw new Error('safestrToJson not implemented')
  },
}))
describe('safeJsonToString', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('deepCloneJson from ObjectHelper', async () => {
    const { deepCloneJson } = await import('./object-helper.mjs')
    // const { safestrToJson } = await import('./string-helper.mjs')

    // const obj = mockModule.safestrToJson<{ a: 1 }>('{ a: 1 }')

    expect(() => deepCloneJson({ a: 1 })).toThrow()
    // expect(clonedObj).not.toBe(obj)
  })
})
