import { describe, expect, it } from '@jest/globals'
import { ConfigWebsite } from './ConfigWebsite.mjs'

describe('config website', () => {
  it('good', () => {
    expect.assertions(6)

    const cfg = ConfigWebsite.defaults(),
      updated = ConfigWebsite.hideTooltips(cfg)

    expect(cfg.hideHelp.value).toBe(false)
    expect(cfg.hideTooltips.value).toBe(false)
    expect(cfg.openFirstPlot.value).toBe(true)

    expect(cfg).toStrictEqual({
      hideHelp: {
        id: expect.any(String),
        updated: expect.any(Number),
        value: false,
      },
      hideTooltips: {
        id: expect.any(String),
        updated: expect.any(Number),
        value: false,
      },
      id: expect.any(String),
      openFirstPlot: {
        id: expect.any(String),
        updated: expect.any(Number),
        value: true,
      },
      updated: expect.any(Number),
    })

    expect(updated.hideHelp.value).toBe(false)
    expect(updated.updated).toBeDefined()
  })
})

describe('hide help', () => {
  it('good', () => {
    expect.hasAssertions()

    const cfg = ConfigWebsite.defaults(),
      updated = ConfigWebsite.hideHelp(cfg)

    expect(cfg).toBeDefined()
    expect(cfg.hideHelp).toBeDefined()
    expect(cfg.hideHelp.value).toBe(false)

    expect(updated).toBeDefined()
    expect(updated.hideHelp.value).toBe(true)
    expect(updated.updated).toBeDefined()
  })
})

describe('hide tooltips', () => {
  it('good', () => {
    expect.assertions(2)

    const cfg = ConfigWebsite.defaults(),
      updated = ConfigWebsite.hideTooltips(cfg)

    expect(cfg.hideTooltips.value).toBe(false)
    expect(updated.updated).toBeDefined()
  })
})

describe('open first plot', () => {
  it('good', () => {
    expect.assertions(2)

    const cfg = ConfigWebsite.defaults(),
      updated = ConfigWebsite.openFirstPlot(cfg)

    expect(cfg.openFirstPlot.value).toBe(true)
    expect(updated.updated).toBeDefined()
  })
})
