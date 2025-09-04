import { describe, expect, it } from '@jest/globals'
import { ConfigCharts } from './ConfigCharts.mjs'

describe('config charts', () => {
  it('disable', () => {
    expect.hasAssertions()

    const cfg = ConfigCharts.defaults()
    const updated = new Date()
    const result = ConfigCharts.disable(cfg, updated)

    expect(result).toStrictEqual({
      ...cfg,
      disabled: true,
      updated: updated.getTime(),
    })
  })
})

describe('down', () => {
  it('good', () => {
    expect.hasAssertions()

    const cfg = ConfigCharts.defaults()
    const color = '#FF00FF'
    const updated = new Date()
    const result = ConfigCharts.down(cfg, color, updated)

    expect(result).toStrictEqual({
      ...cfg,
      down: { ...cfg.down, color },
      updated: updated.getTime(),
    })
  })
})

describe('neutral', () => {
  it('good', () => {
    expect.hasAssertions()

    const cfg = ConfigCharts.defaults()
    const updated = new Date()
    const result = ConfigCharts.neutral(cfg, '#00FF00', updated)

    expect(result).toStrictEqual({
      ...cfg,
      neutral: { ...cfg.neutral, color: '#00FF00' },
      updated: updated.getTime(),
    })
  })
})

describe('reset colors', () => {
  it('good', () => {
    expect.hasAssertions()

    const cfg = ConfigCharts.defaults()
    const updated = new Date()
    const result = ConfigCharts.resetColors(cfg, updated)

    expect(result).toStrictEqual({
      down: { color: '#FF0000' },
      id: expect.any(String),
      neutral: { color: '#000000' },
      up: { color: '#00FF00' },
      updated: updated.getTime(),
    })
  })
})

describe('up', () => {
  it('good', () => {
    expect.hasAssertions()

    const cfg = ConfigCharts.defaults()
    const color = '#00FF00'
    const updated = new Date()
    const result = ConfigCharts.up(cfg, color, updated)

    expect(result).toStrictEqual({
      ...cfg,
      up: { ...cfg.up, color },
      updated: updated.getTime(),
    })
  })
})
