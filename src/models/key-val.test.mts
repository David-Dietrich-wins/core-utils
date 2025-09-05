import { KeyVal, KeyValueShort } from './key-val.mjs'
import { describe, expect, it } from '@jest/globals'

describe('keyVal', () => {
  it('should be defined', () => {
    expect.assertions(1)

    expect(KeyVal).toBeDefined()
  })

  it('good', () => {
    expect.assertions(2)

    const key = 'key',
      kval = 'val',
      pr = new KeyVal(key, kval)

    expect(pr.key).toBe(key)
    expect(pr.val).toBe(kval)
  })
})

describe('keyValueShort', () => {
  it('should be defined', () => {
    expect.assertions(1)

    expect(KeyValueShort).toBeDefined()
  })

  it('good', () => {
    expect.assertions(2)

    const key = 'key',
      kval = 'value',
      pr = new KeyValueShort(key, kval)

    expect(pr.k).toBe(key)
    expect(pr.v).toBe(kval)
  })
})
