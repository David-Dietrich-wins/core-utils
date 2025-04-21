import { NameValue, NameValueType } from './NameValueManager.mjs'

test('NameValue good', () => {
  const name = 'name'
  const value = 'value'
  const pr = new NameValue(name, value)

  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
})

test('NameValueType good', () => {
  const name = 'name'
  const value = 'value'
  const type = 'type'
  const pr = new NameValueType(name, value, type)

  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
  expect(pr.type).toBe(type)
})
