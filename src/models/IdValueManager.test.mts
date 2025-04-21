import { IdValue, IdValueManager, IIdValue } from './IdValueManager.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

test('IdValue good', () => {
  const id = 'id'
  const value = 'value'
  const pr = new IdValue(id, value)

  expect(pr.id).toBe(id)
  expect(pr.value).toBe(value)
})

test('good', () => {
  const ids: IIdValue[] = [
    { id: '1', value: '10' },
    { id: '2', value: '20' },
    { id: '3', value: '30' },
  ]

  const idm = new IdValueManager(ids, new InstrumentationStatistics())

  expect(idm.list).toBe(ids)
  expect(idm.stats?.totalProcessed).toBe(0)

  idm.add({ id: '4', value: '40' })
  expect(idm.list.length).toBe(4)
  expect(idm.stats?.totalProcessed).toBe(1)
  expect(idm.stats?.add).toBe(0)
  expect(idm.stats?.successes).toBe(1)

  idm.remove(ids[1])
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
  const ids: IIdValue[] = [
    { id: '1', value: '10' },
    { id: '2', value: '20' },
    { id: '3', value: '30' },
  ]

  const idm = IdValueManager.CreateIdValueManager(
    ids,
    new InstrumentationStatistics()
  )

  expect(idm.list).toBe(ids)
  expect(idm.stats?.totalProcessed).toBe(0)

  idm.add({ id: '4', value: '40' })
  expect(idm.list.length).toBe(4)
  expect(idm.stats?.totalProcessed).toBe(1)
  expect(idm.stats?.add).toBe(0)
  expect(idm.stats?.successes).toBe(1)

  idm.remove(ids[1])
  expect(idm.list.length).toBe(3)
  expect(idm.stats?.totalProcessed).toBe(2)
  expect(idm.stats?.add).toBe(0)
  expect(idm.stats?.successes).toBe(1)
  expect(idm.stats?.delete).toBe(1)
})

test('CreateIIdValue', () => {
  const id = 'id'
  const value = 'value'
  const pr = IdValueManager.CreateIIdValue(id, value)

  expect(pr.id).toBe(id)
  expect(pr.value).toBe(value)
})
test('CreateIIdValue with default values', () => {
  const id = 'id'
  const value = 'value'
  const pr = IdValueManager.CreateIIdValue(id, value)

  expect(pr.id).toBe(id)
  expect(pr.value).toBe('value')
})
