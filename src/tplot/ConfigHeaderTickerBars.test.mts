import {
  ConfigHeaderTickerBars,
  type IConfigHeaderTickerBars,
} from './ConfigHeaderTickerBars.mjs'

test('constructor with default', () => {
  const cfg: IConfigHeaderTickerBars = ConfigHeaderTickerBars.defaults()
  const ui = new ConfigHeaderTickerBars(cfg)

  expect(ui).toBeInstanceOf(ConfigHeaderTickerBars)
  // expect(ui).toMatchObject({
  //   iConfig: expect.objectContaining({
  //     charts: expect.objectContaining({}),
  //     dashboards: expect.objectContaining({}),
  //     headerTickerBars: expect.objectContaining({}),
  //     ideaCryptoTabSelected: expect.objectContaining({}),
  //     ideaTabSelected: expect.objectContaining({}),
  //     operations: expect.objectContaining({}),
  //     website: expect.objectContaining({}),
  //   }),
  // })
})

test('isHeaderTickerBarsDisabled', () => {
  const cm = ConfigHeaderTickerBars.defaults()
  cm.disabled = true
  const ui = new ConfigHeaderTickerBars(cm)

  expect(ui.isHeaderTickerBarsDisabled).toBe(true)

  cm.disabled = false
  expect(new ConfigHeaderTickerBars(cm).isHeaderTickerBarsDisabled).toBe(false)
})

test('shouldHeaderTickerBarsBeDisabled', () => {
  const cm = ConfigHeaderTickerBars.defaults()
  cm.disabled = true
  cm.asset.disabled = true
  cm.crypto.disabled = true

  const ui = new ConfigHeaderTickerBars(cm)

  expect(ui.shouldHeaderTickerBarsBeDisabled).toBe(true)
  cm.disabled = false
  expect(ui.shouldHeaderTickerBarsBeDisabled).toBe(true)

  cm.asset.disabled = false
  expect(ui.shouldHeaderTickerBarsBeDisabled).toBe(false)

  cm.asset.disabled = true
  cm.crypto.disabled = true
  expect(ui.shouldHeaderTickerBarsBeDisabled).toBe(true)

  cm.asset.disabled = true
  cm.crypto.disabled = false
  expect(ui.shouldHeaderTickerBarsBeDisabled).toBe(false)
})

test('isHeaderTickerBarsAssetsDisabled', () => {
  const cm = ConfigHeaderTickerBars.defaults()
  cm.asset.disabled = true
  const ui = new ConfigHeaderTickerBars(cm)

  expect(ui.isHeaderTickerBarsAssetsDisabled).toBe(true)

  cm.asset.disabled = false
  expect(ui.isHeaderTickerBarsAssetsDisabled).toBe(false)
})
test('isHeaderTickerBarsCryptosDisabled', () => {
  const cm = ConfigHeaderTickerBars.defaults()
  cm.crypto.disabled = true
  const ui = new ConfigHeaderTickerBars(cm)

  expect(ui.isHeaderTickerBarsCryptosDisabled).toBe(true)

  cm.crypto.disabled = false
  expect(ui.isHeaderTickerBarsCryptosDisabled).toBe(false)
})
