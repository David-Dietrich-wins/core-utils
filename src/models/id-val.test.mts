import { IdVal } from './id-val.mjs'

test('IdVal good', () => {
  const id = 'id'
  const val = 'val'
  const pr = new IdVal(id, val)

  expect(pr.id).toBe(id)
  expect(pr.val).toBe(val)
})
