import { arrayFirst, safeArray } from './array-helper.mjs'
import { ArrayOrSingle } from '../models/types.mjs'
import { IIdValue } from '../models/IdValueManager.mjs'
import { isNullOrUndefined } from './general.mjs'

type CacheManagerObject<T = object> = { expire: number; obj: T }

export class CacheManager<T = object, Tkey = string> {
  private cache: Map<Tkey, CacheManagerObject<T>> = new Map()

  name: string
  cacheTimeInSeconds: number

  constructor(name: string, cacheTimeInSeconds: number) {
    this.name = name
    this.cacheTimeInSeconds = cacheTimeInSeconds
  }

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

  async getSingle(
    key: Tkey,
    fnData: (key: Tkey) => Promise<IIdValue<Tkey, T>>
  ) {
    const fnall = async (symbols: ArrayOrSingle<Tkey>) => {
        const items: IIdValue<Tkey, T>[] = []

        for (const symbol of safeArray(symbols)) {
          // eslint-disable-next-line no-await-in-loop
          const idv = await fnData(symbol)

          items.push(idv)
        }

        return items
      },
      zallItems = await this.getAll([key], fnall)

    return arrayFirst(zallItems)
  }

  async getAll(
    keys: ArrayOrSingle<Tkey>,
    fnData: (arrTickers: ArrayOrSingle<Tkey>) => Promise<IIdValue<Tkey, T>[]>
  ) {
    const arrKeys = safeArray(keys),
      now = Date.now(),
      zexpiredKeys = arrKeys.filter((key) => {
        const cacheObj = this.cache.get(key)

        return !cacheObj || cacheObj.expire < now
      })

    console.log(
      `CacheManager (${this.name}):`,
      zexpiredKeys.length,
      'expired, ',
      arrKeys.length,
      'local, ',
      this.keys.length,
      'total.'
      // 'Keys:',
      // SafeJsonToString(this.keys.join)
    )
    const expire = now + this.cacheTimeInSeconds * 1000,
      ret = await fnData(zexpiredKeys)
    safeArray(ret).forEach((item) => {
      // Console.log('CacheManager:', this.name, 'set', item.id)
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
