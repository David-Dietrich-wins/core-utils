import { KeyVal, KeyValueShort } from './key-val.mjs'

test('KeyVal good', () => {
  const key = 'key'
  const val = 'val'
  const pr = new KeyVal(key, val)

  expect(pr.key).toBe(key)
  expect(pr.val).toBe(val)
})

test('KeyValueShort good', () => {
  const key = 'key'
  const val = 'value'
  const pr = new KeyValueShort(key, val)

  expect(pr.k).toBe(key)
  expect(pr.v).toBe(val)
})
