/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as z from 'zod/v4'
import { IdCreated, IdCreatedUpdated } from './id-created-updated.mjs'

const suffix = Date.now()

test('IdCreated good', () => {
  const created = new Date(),
    createdBy = `test-create-${suffix}`,
    id = 'id',
    pr = new IdCreated(id, createdBy, created)

  expect(pr.id).toBe(id)
  expect(pr.createdby).toBe(createdBy)
  expect(pr.created).toBe(created)
})

test('IdCreated good with object', () => {
  const created = new Date(),
    createdBy = `test-create-${suffix}`,
    id = 'id',
    pr = new IdCreated(id, createdBy, created)

  expect(pr.id).toBe(id)
  expect(pr.createdby).toBe(createdBy)
  expect(pr.created).toBe(created)

  const pr2 = new IdCreated(pr)
  expect(pr2.id).toBe(id)
  expect(pr2.createdby).toBe(createdBy)
  expect(pr2.created).toBe(created)
})

test('IdCreated undefined id', () => {
  const created = new Date(),
    createdBy = `test-create-${suffix}`,
    id = 0,
    pr = new IdCreated(id, createdBy, created)

  expect(pr.id).toBe(id)
  expect(pr.createdby).toBe(createdBy)
  expect(pr.created).toBe(created)

  const pr2 = new IdCreated(pr)
  expect(pr2.id).toBe(id)
  expect(pr2.createdby).toBe(createdBy)
  expect(pr2.created).toBe(created)
})

test('IdCreatedUpdated good', () => {
  const created = new Date(),
    createdby = `test-create-${suffix}`,
    id = 'id',
    updated = new Date(),
    updatedby = `test-update-${suffix}`,
    zpr = new IdCreatedUpdated(id, createdby, created, updatedby, updated)

  expect(zpr.id).toBe(id)
  expect(zpr.created).toBe(created)
  expect(zpr.createdby).toBe(createdby)
  expect(zpr.updated).toBe(updated)
  expect(zpr.updatedby).toBe(updatedby)
})

test('IdCreatedUpdated good with object', () => {
  const created = new Date(),
    createdby = `test-create-${suffix}`,
    id = 'id',
    updated = new Date(),
    updatedby = `test-update-${suffix}`,
    zpr = new IdCreatedUpdated(id, createdby, created, updatedby, updated)

  expect(zpr.id).toBe(id)
  expect(zpr.created).toBe(created)
  expect(zpr.createdby).toBe(createdby)
  expect(zpr.updated).toBe(updated)
  expect(zpr.updatedby).toBe(updatedby)

  const pr2 = new IdCreatedUpdated(zpr)
  expect(pr2.id).toBe(id)
  expect(pr2.created).toBe(created)
  expect(pr2.createdby).toBe(createdby)
  expect(pr2.updated).toBe(updated)
  expect(pr2.updatedby).toBe(updatedby)
})

test('zCreatedBy', () => {
  const aSchema = IdCreated.zCreatedBy(z.date()),
    data = {
      created: new Date(),
      createdby: 'test',
    },
    result = aSchema.safeParse(data)
  expect(result.success).toBe(true)
  expect(result).toMatchObject({
    data: expect.objectContaining({
      created: expect.any(Date),
      createdby: expect.any(String),
    }),
  })
  expect(result.data).toEqual(data)
  expect(result.data?.created).toBeInstanceOf(Date)
  expect(result.data?.created.getTime()).toBe(data.created.getTime())
})

test('zCreatedOn', () => {
  const aSchema = IdCreated.zCreated(z.date()),
    data = { created: new Date() },
    result = aSchema.safeParse(data)
  expect(result.success).toBe(true)
  expect(result.data).toEqual(data)
  expect(result.data?.created).toBeInstanceOf(Date)
  expect(result.data?.created.getTime()).toBe(data.created.getTime())
})

test('zUpdatedBy', () => {
  const aSchema = IdCreatedUpdated.zUpdatedBy(z.date()),
    data = {
      updated: new Date(),
      updatedby: 'test',
    },
    result = aSchema.safeParse(data)

  expect(result.success).toBe(true)
  expect(result).toMatchObject({
    data: expect.objectContaining({
      updated: expect.any(Date),
      updatedby: expect.any(String),
    }),
  })
  expect(result.data).toEqual(data)
  expect(result.data?.updated).toBeInstanceOf(Date)
  expect(result.data?.updated.getTime()).toBe(data.updated.getTime())
})

test('zUpdatedOn', () => {
  const aSchema = IdCreatedUpdated.zUpdated(z.date()),
    data = { updated: new Date() },
    result = aSchema.safeParse(data)
  expect(result.success).toBe(true)
  expect(result.data).toEqual(data)
  expect(result.data?.updated).toBeInstanceOf(Date)
  expect(result.data?.updated.getTime()).toBe(data.updated.getTime())
})
