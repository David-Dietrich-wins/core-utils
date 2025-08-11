import { ConfigCharts } from './ConfigCharts.mjs'

test(ConfigCharts.disable.name, () => {
  const cfg = ConfigCharts.defaults()
  const updated = new Date()
  const result = ConfigCharts.disable(cfg, updated)

  expect(result).toEqual({
    ...cfg,
    disabled: true,
    updated: updated.getTime(),
  })
})

test(ConfigCharts.down.name, () => {
  const cfg = ConfigCharts.defaults()
  const color = '#FF00FF'
  const updated = new Date()
  const result = ConfigCharts.down(cfg, color, updated)

  expect(result).toEqual({
    ...cfg,
    down: { ...cfg.down, color },
    updated: updated.getTime(),
  })
})

test(ConfigCharts.neutral.name, () => {
  const cfg = ConfigCharts.defaults()
  const updated = new Date()
  const result = ConfigCharts.neutral(cfg, '#00FF00', updated)

  expect(result).toEqual({
    ...cfg,
    neutral: { ...cfg.neutral, color: '#00FF00' },
    updated: updated.getTime(),
  })
})

test(ConfigCharts.resetColors.name, () => {
  const cfg = ConfigCharts.defaults()
  const updated = new Date()
  const result = ConfigCharts.resetColors(cfg, updated)

  expect(result).toEqual({
    down: { color: '#FF0000' },
    id: expect.any(String),
    neutral: { color: '#000000' },
    up: { color: '#00FF00' },
    updated: updated.getTime(),
  })
})

test(ConfigCharts.up.name, () => {
  const cfg = ConfigCharts.defaults()
  const color = '#00FF00'
  const updated = new Date()
  const result = ConfigCharts.up(cfg, color, updated)

  expect(result).toEqual({
    ...cfg,
    up: { ...cfg.up, color },
    updated: updated.getTime(),
  })
})
