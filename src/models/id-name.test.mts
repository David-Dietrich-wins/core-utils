import { IdName, createValueChange } from './id-name.mjs'

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
