import {
  IdName,
  IdNameValue,
  IdNameValueType,
  createValueChange,
} from './id-name.mjs'

it('IdName good', () => {
  const id = 'id',
    name = 'name',
    pr = new IdName(id, name)

  expect(pr.id).toBe(id)
  expect(pr.name).toBe(name)
})

it('createValueChange good', () => {
  const date = 123,
    id = 'id',
    name = 'name',
    type = 'type',
    value = { id: 'id', name: 'name' },
    zpr = createValueChange<IdName>(id, name, value, type, date)

  expect(zpr.id).toBe(id)
  expect(zpr.name).toBe(name)
  expect(zpr.value).toBe(value)
  expect(zpr.type).toBe(type)
  expect(zpr.date).toBe(date)
})

it('createValueChange good without type and date', () => {
  const id = 'id',
    name = 'name',
    value = { id: 'id', name: 'name' },
    zpr = createValueChange<IdName>(id, name, value)

  expect(zpr.id).toBe(id)
  expect(zpr.name).toBe(name)
  expect(zpr.value).toBe(value)
  expect(zpr.type).toBe('')
  expect(Date.now() - zpr.date).toBeLessThan(1000)
})

it('IdNameValue good', () => {
  const id = 'id',
    name = 'name',
    value = { id: 'id', name: 'name' },
    zpr = new IdNameValue(id, name, value)

  expect(zpr.id).toBe(id)
  expect(zpr.name).toBe(name)
  expect(zpr.value).toBe(value)
})

it('IdNameValueType good', () => {
  const id = 'id',
    name = 'name',
    value = { id: 'id', name: 'name' },
    zpr = new IdNameValueType(id, name, value, 'string')

  expect(zpr.id).toBe(id)
  expect(zpr.name).toBe(name)
  expect(zpr.value).toBe(value)
  expect(zpr.type).toBe('string')
})

it('ToIIdName', () => {
  const id = 'id',
    name = 'name',
    pr = IdName.ToIIdName(id, name)

  expect(pr.id).toBe(id)
  expect(pr.name).toBe(name)
})

it('ToIIdNameValueType', () => {
  const id = 'id',
    name = 'name',
    type = 'type',
    value = { id: 'id', name: 'name' },
    zpr = IdNameValueType.ToIIdNameValueType(id, name, value, type)

  expect(zpr.id).toBe(id)
  expect(zpr.name).toBe(name)
  expect(zpr.value).toBe(value)
  expect(zpr.type).toBe(type)
})
