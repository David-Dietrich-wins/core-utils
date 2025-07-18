import { IdValueManager } from '../models/IdValueManager.mjs'
import { ArrayOrSingle } from '../models/types.mjs'
import { CacheManager } from './CacheManager.mjs'

test('constructor', async () => {
  const cacheManager = new CacheManager<string, string>('testCache', 60)

  expect(cacheManager).toBeInstanceOf(CacheManager)
  expect(cacheManager.cacheTimeInSeconds).toBe(60)

  cacheManager.set('key1', Date.now() + 60000, 'value1')
  cacheManager.set('key2', Date.now() + 60000, 'value2')

  const keyvals = [{ id: 'key1', value: 'abc' }],

   fnCache = async (arrKeys: ArrayOrSingle<string>) =>
    keyvals.map((x) => IdValueManager.CreateIIdValue(x.id, x.value))

  expect(await cacheManager.get('key1', fnCache)).toBe('abc')
  expect(await cacheManager.get('key2', fnCache)).toBe('value2')
})

test('getSingle', async () => {
  const cacheManager = new CacheManager<string, string>('testCache', 60),

   keyvals = [{ id: 'key1', value: 'abc' }],

   fnCache = async (key: string) =>
    IdValueManager.CreateIIdValue(
      key,
      keyvals.find((x) => x.id === key)?.value || ''
    )

  expect(cacheManager.has('key1')).toBe(false)
  expect(await cacheManager.getSingle('key1', fnCache)).toBe('abc')
  expect(cacheManager.has('key1')).toBe(true)
  expect(cacheManager.delete('key1')).toBe(true)
  expect(cacheManager.delete('key1')).toBe(false)

  expect(await cacheManager.getSingle('key2', fnCache)).toBe('')
  expect(cacheManager.keys).toStrictEqual(['key2'])

  cacheManager.clear()
  expect(cacheManager.size).toBe(0)
  expect(cacheManager.keys.length).toBe(0)
})

test('getAll', async () => {
  const cacheManager = new CacheManager<string, string>('testCache', 60),

   keyvals = [
    { id: 'key1', value: 'abc' },
    { id: 'key2', value: 'def' },
  ],

   fnCache = async (arrKeys: ArrayOrSingle<string>) =>
    keyvals.map((x) => IdValueManager.CreateIIdValue(x.id, x.value)),

   result = await cacheManager.getAll(['key1', 'key2'], fnCache)

  expect(result.length).toBe(2)
  expect(result[0].valueOf()).toBe('abc')
  expect(result[1].valueOf()).toBe('def')
})
