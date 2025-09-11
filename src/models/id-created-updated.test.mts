import * as z from 'zod/v4'
import { IdCreated, IdCreatedUpdated } from './id-created-updated.mjs'
import { describe, expect, it } from '@jest/globals'

const suffix = Date.now()

describe('id created', () => {
  it('good', () => {
    expect.assertions(3)

    const created = new Date(),
      createdBy = `test-create-${suffix}`,
      id = 'id',
      pr = new IdCreated(id, createdBy, created)

    expect(pr.id).toBe(id)
    expect(pr.createdby).toBe(createdBy)
    expect(pr.created).toBe(created)
  })

  it('idCreated good with object', () => {
    expect.assertions(6)

    const created = new Date(),
      createdBy = `test-create-${suffix}`,
      id = 'id',
      pr = new IdCreated(id, createdBy, created),
      pr2 = new IdCreated(pr)

    expect(pr.id).toBe(id)
    expect(pr.createdby).toBe(createdBy)
    expect(pr.created).toBe(created)

    expect(pr2.id).toBe(id)
    expect(pr2.createdby).toBe(createdBy)
    expect(pr2.created).toBe(created)
  })

  it('idCreated undefined id', () => {
    expect.assertions(6)

    const created = new Date(),
      createdBy = `test-create-${suffix}`,
      id = 0,
      pr = new IdCreated(id, createdBy, created),
      pr2 = new IdCreated(pr)

    expect(pr.id).toBe(id)
    expect(pr.createdby).toBe(createdBy)
    expect(pr.created).toBe(created)

    expect(pr2.id).toBe(id)
    expect(pr2.createdby).toBe(createdBy)
    expect(pr2.created).toBe(created)
  })

  it('idCreatedUpdated good', () => {
    expect.assertions(5)

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

  it('idCreatedUpdated good with object', () => {
    expect.assertions(10)

    const byupdated = `test-update-${suffix}`,
      created = new Date(),
      createdby = `test-create-${suffix}`,
      dtUpdated = new Date(),
      id = 'id',
      pricu = new IdCreatedUpdated(
        id,
        createdby,
        created,
        byupdated,
        dtUpdated
      ),
      pricu2 = new IdCreatedUpdated(pricu)

    expect(pricu.id).toBe(id)
    expect(pricu.created).toBe(created)
    expect(pricu.createdby).toBe(createdby)
    expect(pricu.updated).toBe(dtUpdated)
    expect(pricu.updatedby).toBe(byupdated)

    expect(pricu2.id).toBe(id)
    expect(pricu2.created).toBe(created)
    expect(pricu2.createdby).toBe(createdby)
    expect(pricu2.updated).toBe(dtUpdated)
    expect(pricu2.updatedby).toBe(byupdated)
  })

  it('zCreatedBy', () => {
    expect.assertions(5)

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
    expect(result.data).toStrictEqual(data)
    expect(result.data?.created).toBeInstanceOf(Date)
    expect(result.data?.created.getTime()).toBe(data.created.getTime())
  })

  it('zCreatedOn', () => {
    expect.assertions(4)

    const aSchema = IdCreated.zCreated(z.date()),
      data = { created: new Date() },
      result = aSchema.safeParse(data)

    expect(result.success).toBe(true)
    expect(result.data).toStrictEqual(data)
    expect(result.data?.created).toBeInstanceOf(Date)
    expect(result.data?.created.getTime()).toBe(data.created.getTime())
  })

  it('zUpdatedBy', () => {
    expect.assertions(5)

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
    expect(result.data).toStrictEqual(data)
    expect(result.data?.updated).toBeInstanceOf(Date)
    expect(result.data?.updated.getTime()).toBe(data.updated.getTime())
  })

  it('zUpdatedOn', () => {
    expect.assertions(4)

    const aSchema = IdCreatedUpdated.zUpdated(z.date()),
      data = { updated: new Date() },
      result = aSchema.safeParse(data)

    expect(result.success).toBe(true)
    expect(result.data).toStrictEqual(data)
    expect(result.data?.updated).toBeInstanceOf(Date)
    expect(result.data?.updated.getTime()).toBe(data.updated.getTime())
  })
})
