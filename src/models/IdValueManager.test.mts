import { IIdValue, IdValue, IdValueManager } from './IdValueManager.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

test('IdValue good', () => {
  const id = 'id',
    value = 'value',
    zpr = new IdValue(id, value)

  expect(zpr.id).toBe(id)
  expect(zpr.value).toBe(value)
})

test('good', () => {
  const aids: IIdValue[] = [
      { id: '1', value: '10' },
      { id: '2', value: '20' },
      { id: '3', value: '30' },
    ],
    idm = new IdValueManager(aids, new InstrumentationStatistics())

  expect(idm.list).toBe(aids)
  expect(idm.stats?.totalProcessed).toBe(0)

  idm.add({ id: '4', value: '40' })
  expect(idm.list.length).toBe(4)
  expect(idm.stats?.totalProcessed).toBe(1)
  expect(idm.stats?.add).toBe(0)
  expect(idm.stats?.successes).toBe(1)

  idm.remove(aids[1])
  expect(idm.list.length).toBe(3)
  expect(idm.stats?.totalProcessed).toBe(2)
  expect(idm.stats?.add).toBe(0)
  expect(idm.stats?.successes).toBe(1)
  expect(idm.stats?.delete).toBe(1)
})

test('default constructor', () => {
  const idm = new IdValueManager()

  expect(idm.list).toMatchObject([])
  expect(idm.stats?.totalProcessed).toBeUndefined()

  idm.add({ id: '4', value: '40' })
  expect(idm.list.length).toBe(1)
  expect(idm.list).toMatchObject([{ id: '4', value: '40' }])
})

test('CreateIdValueManager', () => {
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
  expect(idm.list.length).toBe(4)
  expect(idm.stats?.totalProcessed).toBe(1)
  expect(idm.stats?.add).toBe(0)
  expect(idm.stats?.successes).toBe(1)

  idm.remove(aids[1])
  expect(idm.list.length).toBe(3)
  expect(idm.stats?.totalProcessed).toBe(2)
  expect(idm.stats?.add).toBe(0)
  expect(idm.stats?.successes).toBe(1)
  expect(idm.stats?.delete).toBe(1)
})

test('CreateIIdValue', () => {
  const id = 'id',
    value = 'value',
    zpr = IdValueManager.CreateIIdValue(id, value)

  expect(zpr.id).toBe(id)
  expect(zpr.value).toBe(value)
})
test('CreateIIdValue with default values', () => {
  const id = 'id',
    value = 'value',
    zpr = IdValueManager.CreateIIdValue(id, value)

  expect(zpr.id).toBe(id)
  expect(zpr.value).toBe('value')
})
