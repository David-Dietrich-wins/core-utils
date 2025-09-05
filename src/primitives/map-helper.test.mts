import {
  dictionaryFromObject,
  dictionaryToObject,
  dictionaryUpsert,
  dictionaryUpsertAll,
} from './map-helper.mjs'

it(dictionaryUpsert.name, () => {
  const dict = new Map<string, number>()
  dictionaryUpsert(dict, 'key1', 1)
  expect(dict.get('key1')).toBe(1)
  dictionaryUpsert(dict, 'key1', 2)
  expect(dict.get('key1')).toBe(2)
})

it(dictionaryUpsertAll.name, () => {
  const dict = new Map<string, number>()
  dictionaryUpsertAll(dict, { key1: 1, key2: 2 })
  expect(dict.get('key1')).toBe(1)
  expect(dict.get('key2')).toBe(2)
  dictionaryUpsertAll(dict, { key1: 3, key2: 4 })
  expect(dict.get('key1')).toBe(3)
  expect(dict.get('key2')).toBe(4)
})

it(dictionaryFromObject.name, () => {
  const obj = { key1: 1, key2: 2 }
  const dict = dictionaryFromObject(obj)
  expect(dict.get('key1')).toBe(1)
  expect(dict.get('key2')).toBe(2)
})

it(dictionaryToObject.name, () => {
  const dict = new Map<string, number>()
  dict.set('key1', 1)
  dict.set('key2', 2)
  const obj = dictionaryToObject(dict)
  expect(obj).toStrictEqual({ key1: 1, key2: 2 })
})
