import { describe, expect, it } from '@jest/globals'
import {
  dictionaryFromObject,
  dictionaryToObject,
  dictionaryUpsert,
  dictionaryUpsertAll,
} from './map-helper.mjs'

describe('map-helper', () => {
  it('dictionaryUpsert', () => {
    expect.assertions(2)

    const dict = new Map<string, number>()

    dictionaryUpsert(dict, 'key1', 1)

    expect(dict.get('key1')).toBe(1)

    dictionaryUpsert(dict, 'key1', 2)

    expect(dict.get('key1')).toBe(2)
  })

  it('dictionaryUpsertAll', () => {
    expect.assertions(4)

    const dict = new Map<string, number>()
    dictionaryUpsertAll(dict, { key1: 1, key2: 2 })

    expect(dict.get('key1')).toBe(1)
    expect(dict.get('key2')).toBe(2)

    dictionaryUpsertAll(dict, { key1: 3, key2: 4 })

    expect(dict.get('key1')).toBe(3)
    expect(dict.get('key2')).toBe(4)
  })

  it('dictionaryFromObject', () => {
    expect.assertions(2)

    const aobj = { key1: 1, key2: 2 },
      dict = dictionaryFromObject(aobj)

    expect(dict.get('key1')).toBe(1)
    expect(dict.get('key2')).toBe(2)
  })

  it('dictionaryToObject', () => {
    expect.assertions(1)

    const dict = new Map<string, number>()
    dict.set('key1', 1)
    dict.set('key2', 2)
    // eslint-disable-next-line one-var
    const obj = dictionaryToObject(dict)

    expect(obj).toStrictEqual({ key1: 1, key2: 2 })
  })
})
