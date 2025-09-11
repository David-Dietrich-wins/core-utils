import { describe, expect, it } from '@jest/globals'
import { ConfigOperations } from './ConfigOperations.mjs'

describe('config operations', () => {
  it('good', () => {
    expect.assertions(4)

    const cfg = ConfigOperations.defaults(),
      updated = ConfigOperations.minusEightPlus10(cfg)

    expect(cfg.minusEightPlus10).toBeDefined()
    expect(cfg.minusEightPlus10.value).toBe(true)

    expect(updated.minusEightPlus10.value).toBe(false)
    expect(updated.updated).toBeDefined()
  })
})

describe('minus eight plus 10', () => {
  it('good', () => {
    expect.assertions(3)

    const cfg = ConfigOperations.defaults(),
      updated = ConfigOperations.minusEightPlus10(cfg)

    expect(cfg.minusEightPlus10.value).toBe(true)

    expect(updated.minusEightPlus10.value).toBe(false)
    expect(updated.updated).toBeDefined()
  })
})
