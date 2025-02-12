import { NameVal, NameValType } from './name-val.mjs'

test('NameVal good', () => {
  const name = 'name'
  const val = 'val'
  const pr = new NameVal(name, val)

  expect(pr.name).toBe(name)
  expect(pr.val).toBe(val)
})

test('NameValType good', () => {
  const name = 'name'
  const val = 'value'
  const type = 'type'
  const pr = new NameValType(name, val, type)

  expect(pr.name).toBe(name)
  expect(pr.val).toBe(val)
  expect(pr.type).toBe(type)
})
