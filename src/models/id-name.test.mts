import {
  IdName,
  IdNameValue,
  IdNameValueType,
  createValueChange,
} from './id-name.mjs'

test('IdName good', () => {
  const id = 'id'
  const name = 'name'
  const pr = new IdName(id, name)

  expect(pr.id).toBe(id)
  expect(pr.name).toBe(name)
})

test('createValueChange good', () => {
  const id = 'id'
  const name = 'name'
  const value = { id: 'id', name: 'name' }
  const type = 'type'
  const date = 123
  const pr = createValueChange<IdName>(id, name, value, type, date)

  expect(pr.id).toBe(id)
  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
  expect(pr.type).toBe(type)
  expect(pr.date).toBe(date)
})

test('createValueChange good without type and date', () => {
  const id = 'id'
  const name = 'name'
  const value = { id: 'id', name: 'name' }
  const pr = createValueChange<IdName>(id, name, value)

  expect(pr.id).toBe(id)
  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
  expect(pr.type).toBe('')
  expect(Date.now() - +pr.date).toBeLessThan(1000)
})

test('IdNameValue good', () => {
  const id = 'id'
  const name = 'name'
  const value = { id: 'id', name: 'name' }
  const pr = new IdNameValue(id, name, value)

  expect(pr.id).toBe(id)
  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
})

test('IdNameValueType good', () => {
  const id = 'id'
  const name = 'name'
  const value = { id: 'id', name: 'name' }
  const pr = new IdNameValueType(id, name, value, 'string')

  expect(pr.id).toBe(id)
  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
  expect(pr.type).toBe('string')
})

test('ToIIdName', () => {
  const id = 'id'
  const name = 'name'
  const pr = IdName.ToIIdName(id, name)

  expect(pr.id).toBe(id)
  expect(pr.name).toBe(name)
})

test('ToIIdNameValueType', () => {
  const id = 'id'
  const name = 'name'
  const value = { id: 'id', name: 'name' }
  const type = 'type'
  const pr = IdNameValueType.ToIIdNameValueType(id, name, value, type)

  expect(pr.id).toBe(id)
  expect(pr.name).toBe(name)
  expect(pr.value).toBe(value)
  expect(pr.type).toBe(type)
})
