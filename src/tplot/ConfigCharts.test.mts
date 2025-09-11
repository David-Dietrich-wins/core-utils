import { describe, expect, it } from '@jest/globals'
import { ConfigCharts } from './ConfigCharts.mjs'

describe('config charts', () => {
  it('disable', () => {
    expect.assertions(1)

    const cfg = ConfigCharts.defaults(),
      dtUpdated = new Date(),
      result = ConfigCharts.disable(cfg, dtUpdated)

    expect(result).toStrictEqual({
      ...cfg,
      disabled: true,
      updated: dtUpdated.getTime(),
    })
  })
})

describe('down', () => {
  it('good', () => {
    expect.assertions(1)

    const cfg = ConfigCharts.defaults(),
      color = '#FF00FF',
      dtUpdated = new Date(),
      result = ConfigCharts.down(cfg, color, dtUpdated)

    expect(result).toStrictEqual({
      ...cfg,
      down: { ...cfg.down, color },
      updated: dtUpdated.getTime(),
    })
  })
})

describe('neutral', () => {
  it('good', () => {
    expect.assertions(1)

    const cfg = ConfigCharts.defaults(),
      dtUpdated = new Date(),
      result = ConfigCharts.neutral(cfg, '#00FF00', dtUpdated)

    expect(result).toStrictEqual({
      ...cfg,
      neutral: { ...cfg.neutral, color: '#00FF00' },
      updated: dtUpdated.getTime(),
    })
  })
})

describe('reset colors', () => {
  it('good', () => {
    expect.assertions(1)

    const cfg = ConfigCharts.defaults(),
      dtUpdated = new Date(),
      result = ConfigCharts.resetColors(cfg, dtUpdated)

    expect(result).toStrictEqual({
      down: { color: '#FF0000' },
      id: expect.any(String),
      neutral: { color: '#000000' },
      up: { color: '#00FF00' },
      updated: dtUpdated.getTime(),
    })
  })
})

describe('up', () => {
  it('good', () => {
    expect.assertions(1)

    const cfg = ConfigCharts.defaults(),
      color = '#00FF00',
      dtUpdated = new Date(),
      result = ConfigCharts.up(cfg, color, dtUpdated)

    expect(result).toStrictEqual({
      ...cfg,
      up: { ...cfg.up, color },
      updated: dtUpdated.getTime(),
    })
  })
})
