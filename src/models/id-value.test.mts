import { IdValue } from './id-value.mjs'

test('IdValue good', () => {
  const id = 'id'
  const value = 'value'
  const pr = new IdValue(id, value)

  expect(pr.id).toBe(id)
  expect(pr.value).toBe(value)
})
