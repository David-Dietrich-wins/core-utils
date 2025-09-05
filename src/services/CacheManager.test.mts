import { describe, expect, it } from '@jest/globals'
import { type ArrayOrSingle } from '../models/types.mjs'
import { CacheManager } from './CacheManager.mjs'
import { IdValueManager } from '../models/IdValueManager.mjs'
import { safestr } from '../primitives/string-helper.mjs'

describe('constructor', () => {
  it('should create an instance of CacheManager', async () => {
    expect.assertions(4)

    const cacheManager = new CacheManager<string, string>('testCache', 60)

    expect(cacheManager).toBeInstanceOf(CacheManager)
    expect(cacheManager.cacheTimeInSeconds).toBe(60)

    cacheManager.set('key1', Date.now() + 60000, 'value1')
    cacheManager.set('key2', Date.now() + 60000, 'value2')

    const akeyvals = [{ id: 'key1', value: 'abc' }],
      fnCache = async (_arrKeys: ArrayOrSingle<string>) =>
        Promise.resolve(
          akeyvals.map((x) => IdValueManager.CreateIIdValue(x.id, x.value))
        )

    await expect(cacheManager.get('key1', fnCache)).resolves.toBe('abc')
    await expect(cacheManager.get('key2', fnCache)).resolves.toBe('value2')
  })
})

describe('getters', () => {
  it('should get a single value from the cache', async () => {
    expect.assertions(9)

    const akeyvals = [{ id: 'key1', value: 'abc' }],
      cacheManager = new CacheManager<string, string>('testCache', 60),
      // eslint-disable-next-line @typescript-eslint/require-await
      fnCache = async (key: string) =>
        IdValueManager.CreateIIdValue(
          key,
          safestr(akeyvals.find((x) => x.id === key)?.value)
        )

    expect(cacheManager.has('key1')).toBe(false)
    await expect(cacheManager.getSingle('key1', fnCache)).resolves.toBe('abc')
    expect(cacheManager.has('key1')).toBe(true)
    expect(cacheManager.delete('key1')).toBe(true)
    expect(cacheManager.delete('key1')).toBe(false)

    await expect(cacheManager.getSingle('key2', fnCache)).resolves.toBe('')
    expect(cacheManager.keys).toStrictEqual(['key2'])

    cacheManager.clear()

    expect(cacheManager.size).toBe(0)
    expect(cacheManager.keys).toHaveLength(0)
  })

  it('getAll', async () => {
    expect.assertions(3)

    const cacheManager = new CacheManager<string, string>('testCache', 60),
      keyvals = [
        { id: 'key1', value: 'abc' },
        { id: 'key2', value: 'def' },
      ],
      kvCache = async (_arrKeys: ArrayOrSingle<string>) =>
        Promise.resolve(
          keyvals.map((x) => IdValueManager.CreateIIdValue(x.id, x.value))
        ),
      result = await cacheManager.getAll(['key1', 'key2'], kvCache)

    expect(result).toHaveLength(2)
    expect(result[0].valueOf()).toBe('abc')
    expect(result[1].valueOf()).toBe('def')
  })
})
