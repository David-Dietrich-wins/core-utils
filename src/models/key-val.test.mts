import { KeyVal, KeyValueShort } from './key-val.mjs'

test('KeyVal good', () => {
  const key = 'key',
    kval = 'val',
    pr = new KeyVal(key, kval)

  expect(pr.key).toBe(key)
  expect(pr.val).toBe(kval)
})

test('KeyValueShort good', () => {
  const key = 'key',
    kval = 'value',
    pr = new KeyValueShort(key, kval)

  expect(pr.k).toBe(key)
  expect(pr.v).toBe(kval)
})
