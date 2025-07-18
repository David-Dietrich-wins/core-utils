import { KeyVal, KeyValueShort } from './key-val.mjs'

test('KeyVal good', () => {
  const key = 'key',
   val = 'val',
   pr = new KeyVal(key, val)

  expect(pr.key).toBe(key)
  expect(pr.val).toBe(val)
})

test('KeyValueShort good', () => {
  const key = 'key',
   val = 'value',
   pr = new KeyValueShort(key, val)

  expect(pr.k).toBe(key)
  expect(pr.v).toBe(val)
})
