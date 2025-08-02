import { jest } from '@jest/globals'

const mockSafestrToJson = jest.fn(() => null)

jest.unstable_mockModule('./services/string-helper.mjs', () => ({
  safestrToJson: mockSafestrToJson,
}))
const { safestrToJson } = await import('./string-helper.mjs')

const { deepCloneJson } = await import('./object-helper.mjs')

test('deepCloneJson', () => {
  console.log('deepCloneJson', safestrToJson('{"a": "a"}'))
  expect(deepCloneJson({ a: 'a' })).toStrictEqual({ a: 'a' })

  expect(deepCloneJson({})).toStrictEqual({})
  expect(deepCloneJson([])).toStrictEqual([])

  expect(deepCloneJson(undefined as unknown as object)).toStrictEqual({})
})
