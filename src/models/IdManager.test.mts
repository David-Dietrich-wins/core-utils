import { IdManager, IId } from './IdManager.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'

test('good', () => {
  const ids: IId[] = [{ id: '1' }, { id: '2' }, { id: '3' }]

  const idm = new IdManager(ids, new InstrumentationStatistics())

  expect(idm.list).toBe(ids)
  expect(idm.stats?.totalProcessed).toBe(0)

  idm.add({ id: '4' })
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
  const idm = new IdManager()

  expect(idm.list).toMatchObject([])
  expect(idm.stats?.totalProcessed).toBeUndefined()

  idm.add({ id: '4' })
  expect(idm.list.length).toBe(1)
  expect(idm.list).toMatchObject([{ id: '4' }])
})

test('IdManager.Create', () => {
  const ids: IId[] = [{ id: '1' }, { id: '2' }, { id: '3' }]

  const idm = IdManager.CreateIdManager(ids, new InstrumentationStatistics())

  expect(idm.list).toBe(ids)
  expect(idm.stats?.totalProcessed).toBe(0)
})

test('IdManager.FindWithObjectId', () => {
  const ids: object[] = [
    { id: '1', b: '11' },
    { id: '2', b: '22' },
    { id: '3', b: '33' },
  ]

  const idm = IdManager.FindObjectWithId(ids, '2')

  expect(idm).toMatchObject({ id: '2', b: '22' })
})
