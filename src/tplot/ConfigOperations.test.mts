import { describe, expect, it } from '@jest/globals'
import { ConfigOperations } from './ConfigOperations.mjs'

describe('config operations', () => {
  it('good', () => {
    expect.hasAssertions()

    const cfg = ConfigOperations.defaults()

    expect(cfg).toBeDefined()
    expect(cfg.minusEightPlus10).toBeDefined()
    expect(cfg.minusEightPlus10.value).toBe(true)

    const updated = ConfigOperations.minusEightPlus10(cfg)

    expect(updated).toBeDefined()
    expect(updated.minusEightPlus10.value).toBe(false)
    expect(updated.updated).toBeDefined()
  })
})

describe('minus eight plus 10', () => {
  it('good', () => {
    expect.hasAssertions()

    const cfg = ConfigOperations.defaults()

    expect(cfg).toBeDefined()
    expect(cfg.minusEightPlus10).toBeDefined()
    expect(cfg.minusEightPlus10.value).toBe(true)

    const updated = ConfigOperations.minusEightPlus10(cfg)

    expect(updated).toBeDefined()
    expect(updated.minusEightPlus10.value).toBe(false)
    expect(updated.updated).toBeDefined()
  })
})
