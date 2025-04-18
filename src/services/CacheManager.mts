import { IIdValue } from '../models/id-value.mjs'
import { ArrayOrSingle } from '../models/types.mjs'
import { arrayFirst } from './array-helper.mjs'
import { isNullOrUndefined, safeArray, safeJsonToString } from './general.mjs'

type CacheManagerObject<T = object> = { expire: number; obj: T }

export class CacheManager<T = object, Tkey = string> {
  private cache: Map<Tkey, CacheManagerObject<T>> = new Map()

  constructor(private name: string, public cacheTimeInSeconds: number) {}

  set(key: Tkey, expire: number, obj: T) {
    this.cache.set(key, {
      expire,
      obj,
    })
  }

  async get(
    key: Tkey,
    fnData: (arrKeys: ArrayOrSingle<Tkey>) => Promise<IIdValue<Tkey, T>[]>
  ) {
    const items = await this.getAll(key, fnData)

    return arrayFirst(items)
  }

  async getAll(
    keys: ArrayOrSingle<Tkey>,
    fnData: (arrTickers: ArrayOrSingle<Tkey>) => Promise<IIdValue<Tkey, T>[]>
  ) {
    const arrKeys = safeArray(keys)
    const now = Date.now()

    const expiredKeys = arrKeys.filter((key) => {
      const cacheObj = this.cache.get(key)
      if (!cacheObj || cacheObj.expire < now) {
        return true
      }
    })

    console.log(
      `CacheManager (${this.name}):`,
      expiredKeys.length,
      'expired',
      arrKeys.length,
      'total.',
      'Keys:',
      safeJsonToString(this.keys.join)
    )
    const expire = now + this.cacheTimeInSeconds * 1000

    const ret = await fnData(expiredKeys)
    safeArray(ret).forEach((item) => {
      console.log('CacheManager:', this.name, 'set', item.id)
      this.set(item.id, expire, item.value)
    })

    return arrKeys
      .map((key) => this.cache.get(key)?.obj)
      .filter((x) => !isNullOrUndefined(x)) as T[]
  }

  has(key: Tkey) {
    return this.cache.has(key)
  }

  delete(key: Tkey) {
    return this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  get keys() {
    return Array.from(this.cache.keys())
  }

  get size(): number {
    return this.cache.size
  }
}
