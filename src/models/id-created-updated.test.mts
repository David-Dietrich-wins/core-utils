import { IdCreated, IdCreatedUpdated } from './id-created-updated.mjs'

const suffix = Date.now()

test('IdCreated good', () => {
  const id = 'id'
  const createdBy = `test-create-${suffix}`
  const created = new Date()

  const pr = new IdCreated(id, createdBy, created)

  expect(pr.id).toBe(id)
  expect(pr.createdby).toBe(createdBy)
  expect(pr.created).toBe(created)
})

test('IdCreated good with object', () => {
  const id = 'id'
  const createdBy = `test-create-${suffix}`
  const created = new Date()

  const pr = new IdCreated(id, createdBy, created)

  expect(pr.id).toBe(id)
  expect(pr.createdby).toBe(createdBy)
  expect(pr.created).toBe(created)

  const pr2 = new IdCreated(pr)
  expect(pr2.id).toBe(id)
  expect(pr2.createdby).toBe(createdBy)
  expect(pr2.created).toBe(created)
})

test('IdCreatedUpdated good', () => {
  const id = 'id'
  const createdby = `test-create-${suffix}`
  const updatedby = `test-update-${suffix}`
  const created = new Date()
  const updated = new Date()
  const pr = new IdCreatedUpdated(id, createdby, created, updatedby, updated)

  expect(pr.id).toBe(id)
  expect(pr.created).toBe(created)
  expect(pr.createdby).toBe(createdby)
  expect(pr.updated).toBe(updated)
  expect(pr.updatedby).toBe(updatedby)
})

test('IdCreatedUpdated good with object', () => {
  const id = 'id'
  const createdby = `test-create-${suffix}`
  const updatedby = `test-update-${suffix}`
  const created = new Date()
  const updated = new Date()
  const pr = new IdCreatedUpdated(id, createdby, created, updatedby, updated)

  expect(pr.id).toBe(id)
  expect(pr.created).toBe(created)
  expect(pr.createdby).toBe(createdby)
  expect(pr.updated).toBe(updated)
  expect(pr.updatedby).toBe(updatedby)

  const pr2 = new IdCreatedUpdated(pr)
  expect(pr2.id).toBe(id)
  expect(pr2.created).toBe(created)
  expect(pr2.createdby).toBe(createdby)
  expect(pr2.updated).toBe(updated)
  expect(pr2.updatedby).toBe(updatedby)
})
