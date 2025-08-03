import * as z from 'zod'
import { IId, IdManager } from './IdManager.mjs'
import { InstrumentationStatistics } from './InstrumentationStatistics.mjs'
import { zStringMinMax } from '../services/zod-helper.mjs'

test('good', () => {
  const ads: IId[] = [{ id: '1' }, { id: '2' }, { id: '3' }],
    idm = new IdManager(ads, new InstrumentationStatistics())

  expect(idm.list).toBe(ads)
  expect(idm.stats?.totalProcessed).toBe(0)

  idm.add({ id: '4' })
  expect(idm.list.length).toBe(4)
  expect(idm.stats?.totalProcessed).toBe(1)
  expect(idm.stats?.add).toBe(0)
  expect(idm.stats?.successes).toBe(1)

  idm.remove(ads[1])
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
  const ads: IId[] = [{ id: '1' }, { id: '2' }, { id: '3' }],
    idm = IdManager.CreateIdManager(ads, new InstrumentationStatistics())

  expect(idm.list).toBe(ads)
  expect(idm.stats?.totalProcessed).toBe(0)
})

test('IdManager.FindWithObjectId', () => {
  const ads: object[] = [
      {
        b: '11',
        id: '1',
      },
      {
        b: '22',
        id: '2',
      },
      {
        b: '33',
        id: '3',
      },
    ],
    idm = IdManager.FindObjectWithId(ads, '2')

  expect(idm).toMatchObject({
    b: '22',
    id: '2',
  })
})

test('zIId', () => {
  const zId = IdManager.zIId(zStringMinMax(1, 50))
  // Const ret = zId.safeParse({ id: 'test' })
  expect(zId.safeParse({ id: 'test' }).success).toBe(true)
  expect(zId.safeParse({}).success).toBe(true)
  expect(zId.safeParse({ id: 123 }).success).toBe(false)
  expect(zId.safeParse({ id: 'a'.repeat(51) }).success).toBe(false)
  expect(zId.safeParse({ id: 'a' }).success).toBe(true)
  expect(zId.safeParse({ id: '' }).success).toBe(false)
  expect(zId.safeParse({ id: null }).success).toBe(false)
  expect(zId.safeParse({ id: undefined }).success).toBe(true)
  expect(zId.safeParse({ id: ' ' }).success).toBe(true)
  expect(zId.safeParse({ id: 'a'.repeat(50) }).success).toBe(true)
  expect(zId.safeParse({ id: 'a'.repeat(49) }).success).toBe(true)
  expect(zId.safeParse({ id: 'a'.repeat(52) }).success).toBe(false)
  expect(zId.safeParse({ id: 'a'.repeat(51) }).success).toBe(false)

  const zIdNum = IdManager.zIId(z.number().min(1).max(50))
  expect(zIdNum.safeParse({ id: 'test' }).success).toBe(false)
  expect(zIdNum.safeParse({ id: 25 }).success).toBe(true)
  expect(zIdNum.safeParse({ id: 0 }).success).toBe(false)
  expect(zIdNum.safeParse({ id: 1 }).success).toBe(true)
  expect(zIdNum.safeParse({ id: 50 }).success).toBe(true)
  expect(zIdNum.safeParse({ id: 51 }).success).toBe(false)
  expect(zIdNum.safeParse({ id: -1 }).success).toBe(false)
})
