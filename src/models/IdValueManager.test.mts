import { type IIdValue, IdValue, IdValueManager } from './IdValueManager.mjs'
import { describe, expect, it } from '@jest/globals'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

describe('id value manager', () => {
  it('idValue good', () => {
    expect.assertions(2)

    const id = 'id',
      value = 'value',
      zpr = new IdValue(id, value)

    expect(zpr.id).toBe(id)
    expect(zpr.value).toBe(value)
  })

  it('good', () => {
    expect.assertions(11)

    const aids: IIdValue[] = [
        { id: '1', value: '10' },
        { id: '2', value: '20' },
        { id: '3', value: '30' },
      ],
      idm = new IdValueManager(aids, new InstrumentationStatistics())

    expect(idm.list).toBe(aids)
    expect(idm.stats?.totalProcessed).toBe(0)

    idm.add({ id: '4', value: '40' })

    expect(idm.list).toHaveLength(4)
    expect(idm.stats?.totalProcessed).toBe(1)
    expect(idm.stats?.add).toBe(0)
    expect(idm.stats?.successes).toBe(1)

    idm.remove(aids[1])

    expect(idm.list).toHaveLength(3)
    expect(idm.stats?.totalProcessed).toBe(2)
    expect(idm.stats?.add).toBe(0)
    expect(idm.stats?.successes).toBe(1)
    expect(idm.stats?.delete).toBe(1)
  })

  it('default constructor', () => {
    expect.assertions(4)

    const idm = new IdValueManager()

    expect(idm.list).toMatchObject([])
    expect(idm.stats?.totalProcessed).toBeUndefined()

    idm.add({ id: '4', value: '40' })

    expect(idm.list).toHaveLength(1)
    expect(idm.list).toMatchObject([{ id: '4', value: '40' }])
  })

  it('createIdValueManager', () => {
    expect.assertions(11)

    const aids: IIdValue[] = [
        { id: '1', value: '10' },
        { id: '2', value: '20' },
        { id: '3', value: '30' },
      ],
      idm = IdValueManager.CreateIdValueManager(
        aids,
        new InstrumentationStatistics()
      )

    expect(idm.list).toBe(aids)
    expect(idm.stats?.totalProcessed).toBe(0)

    idm.add({ id: '4', value: '40' })

    expect(idm.list).toHaveLength(4)
    expect(idm.stats?.totalProcessed).toBe(1)
    expect(idm.stats?.add).toBe(0)
    expect(idm.stats?.successes).toBe(1)

    idm.remove(aids[1])

    expect(idm.list).toHaveLength(3)
    expect(idm.stats?.totalProcessed).toBe(2)
    expect(idm.stats?.add).toBe(0)
    expect(idm.stats?.successes).toBe(1)
    expect(idm.stats?.delete).toBe(1)
  })
})

describe('iid value', () => {
  it('createIIdValue', () => {
    expect.assertions(2)

    const id = 'id',
      value = 'value',
      zpr = IdValueManager.CreateIIdValue(id, value)

    expect(zpr.id).toBe(id)
    expect(zpr.value).toBe(value)
  })

  it('createIIdValue with default values', () => {
    expect.assertions(2)

    const id = 'id',
      value = 'value',
      zpr = IdValueManager.CreateIIdValue(id, value)

    expect(zpr.id).toBe(id)
    expect(zpr.value).toBe('value')
  })
})
