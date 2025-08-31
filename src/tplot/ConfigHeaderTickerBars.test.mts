import {
  ConfigHeaderTickerBars,
  type IConfigHeaderTickerBars,
} from './ConfigHeaderTickerBars.mjs'
import { newGuid } from '../services/primitives/uuid-helper.mjs'

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

test(ConfigHeaderTickerBars.disable.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.disable(cm, updated)

  expect(result).toEqual({
    ...cm,
    disabled: true,
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.updateCrypto.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.updateCrypto(
    cm,
    { symbol: 'BTC' },
    updated
  )

  expect(result).toEqual({
    ...cm,
    crypto: {
      ...cm.crypto,
      symbol: 'BTC',
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.updateAsset.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.updateAsset(
    cm,
    { symbol: 'AAPL' },
    updated
  )

  expect(result).toEqual({
    ...cm,
    asset: {
      ...cm.asset,
      symbol: 'AAPL',
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.verifyHeaderBars.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const result = ConfigHeaderTickerBars.verifyHeaderBars(cm)

  expect(result).toEqual({
    ...cm,
    updated: expect.any(Number),
  })

  cm.disabled = true
  expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toEqual({
    ...cm,
    updated: expect.any(Number),
  })

  cm.disabled = false
  expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toEqual({
    ...cm,
    updated: expect.any(Number),
  })

  cm.asset.disabled = true
  expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toEqual({
    ...cm,
    updated: expect.any(Number),
  })

  cm.asset.disabled = false
  expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toEqual({
    ...cm,
    updated: expect.any(Number),
  })

  cm.crypto.disabled = true
  expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toEqual({
    ...cm,
    updated: expect.any(Number),
  })

  cm.crypto.disabled = false
  expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toEqual({
    ...cm,
    updated: expect.any(Number),
  })

  cm.disabled = false
  cm.asset.disabled = true
  cm.crypto.disabled = true
  expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toEqual({
    ...cm,
    updated: expect.any(Number),
  })
})

test(ConfigHeaderTickerBars.UpdateHeader.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = Date.now()
  const overrides = {
    crypto: { id: newGuid(), tickers: ['ETH'], updated },
    disabled: true,
  }
  const result = ConfigHeaderTickerBars.UpdateHeader(cm, overrides, updated)

  expect(result).toEqual({
    asset: {
      id: expect.any(String),
      tickers: ['AAPL'],
      updated,
    },
    crypto: {
      id: expect.any(String),
      tickers: ['ETH'],
      updated,
    },
    disabled: true,
    id: expect.any(String),
    updated,
  })
})

test(ConfigHeaderTickerBars.defaults.name, () => {
  const result = ConfigHeaderTickerBars.defaults()
  expect(result).toEqual({
    asset: {
      id: expect.any(String),
      tickers: ['AAPL'],
      updated: expect.any(Number),
    },
    crypto: {
      id: expect.any(String),
      tickers: ['BTCUSD', 'ETHUSD'],
      updated: expect.any(Number),
    },
    id: expect.any(String),
    updated: expect.any(Number),
  })
  expect(result.asset.tickers.length).toBeGreaterThanOrEqual(1)
  expect(result.crypto.tickers.length).toBeGreaterThanOrEqual(1)
  expect(result.id).toBeDefined()
  expect(result.updated).toBeDefined()
})

test(ConfigHeaderTickerBars.assetAddTicker.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.assetAddTicker(cm, 'AAPL', updated)

  expect(result).toEqual({
    ...cm,
    asset: {
      ...cm.asset,
      tickers: ['AAPL'],
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.assetHeaderBackground.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.assetHeaderBackground(
    cm,
    'blue',
    updated
  )

  expect(result).toEqual({
    ...cm,
    asset: {
      ...cm.asset,
      backgroundColor: { color: 'blue' },
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.assetHeaderDisable.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.assetHeaderDisable(cm, updated)

  expect(result).toEqual({
    ...cm,
    asset: {
      ...cm.asset,
      disabled: true,
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.assetHeaderScrollSpeed.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.assetHeaderScrollSpeed(cm, 100, updated)

  expect(result).toEqual({
    ...cm,
    asset: {
      ...cm.asset,
      scrollSpeed: 100,
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.assetHeaderShowPercentChanges.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.assetHeaderShowPercentChanges(
    cm,
    updated
  )

  expect(result).toEqual({
    ...cm,
    asset: {
      ...cm.asset,
      showPercentChanges: true,
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.assetHeaderShowPriceChanges.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.assetHeaderShowPriceChanges(cm, updated)

  expect(result).toEqual({
    ...cm,
    asset: {
      ...cm.asset,
      showPriceChanges: true,
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.assetMoveTicker.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  cm.asset.tickers = ['AAPL', 'GOOGL', 'TSLA']
  const updated = new Date()
  const result = ConfigHeaderTickerBars.assetMoveTicker(
    cm,
    { from: 0, to: 1 },
    updated
  )

  expect(result).toEqual({
    ...cm,
    asset: {
      ...cm.asset,
      tickers: ['GOOGL', 'AAPL', 'TSLA'],
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.assetRemoveTicker.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.assetRemoveTicker(cm, 'AAPL', updated)

  expect(result).toEqual({
    ...cm,
    asset: {
      ...cm.asset,
      tickers: [],
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.assetUpdateTicker.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.assetUpdateTicker(
    cm,
    { index: 0, ticker: 'AAPL' },
    updated
  )
  expect(result).toEqual({
    ...cm,
    asset: {
      ...cm.asset,
      tickers: ['AAPL'],
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })

  cm.asset.tickers = ['AAPL', 'TSLA']
  expect(
    ConfigHeaderTickerBars.assetUpdateTicker(
      cm,
      { index: 1, ticker: 'GOOGL' },
      updated
    )
  ).toEqual({
    ...cm,
    asset: {
      ...cm.asset,
      tickers: ['AAPL', 'GOOGL'],
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.cryptoAddTicker.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.cryptoAddTicker(cm, 'BTCUSD', updated)

  expect(result).toEqual({
    ...cm,
    crypto: {
      ...cm.crypto,
      tickers: ['BTCUSD', 'ETHUSD'],
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.cryptoHeaderBackground.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.cryptoHeaderBackground(
    cm,
    'blue',
    updated
  )

  expect(result).toEqual({
    ...cm,
    crypto: {
      ...cm.crypto,
      backgroundColor: { color: 'blue' },
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.cryptoHeaderDisable.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.cryptoHeaderDisable(cm, updated)

  expect(result).toEqual({
    ...cm,
    crypto: {
      ...cm.crypto,
      disabled: true,
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.cryptoHeaderScrollSpeed.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.cryptoHeaderScrollSpeed(
    cm,
    100,
    updated
  )

  expect(result).toEqual({
    ...cm,
    crypto: {
      ...cm.crypto,
      scrollSpeed: 100,
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.cryptoHeaderShowPercentChanges.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.cryptoHeaderShowPercentChanges(
    cm,
    updated
  )

  expect(result).toEqual({
    ...cm,
    crypto: {
      ...cm.crypto,
      showPercentChanges: true,
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.cryptoHeaderShowPriceChanges.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.cryptoHeaderShowPriceChanges(
    cm,
    updated
  )

  expect(result).toEqual({
    ...cm,
    crypto: {
      ...cm.crypto,
      showPriceChanges: true,
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.cryptoMoveTicker.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  cm.crypto.tickers = ['BTCUSD', 'ETHUSD', 'LTCUSD']
  const updated = new Date()
  const result = ConfigHeaderTickerBars.cryptoMoveTicker(
    cm,
    { from: 0, to: 1 },
    updated
  )

  expect(result).toEqual({
    ...cm,
    crypto: {
      ...cm.crypto,
      tickers: ['ETHUSD', 'BTCUSD', 'LTCUSD'],
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.cryptoRemoveTicker.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.cryptoRemoveTicker(
    cm,
    'BTCUSD',
    updated
  )

  expect(result).toEqual({
    ...cm,
    crypto: {
      ...cm.crypto,
      tickers: ['ETHUSD'],
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})

test(ConfigHeaderTickerBars.cryptoUpdateTicker.name, () => {
  const cm = ConfigHeaderTickerBars.defaults()
  const updated = new Date()
  const result = ConfigHeaderTickerBars.cryptoUpdateTicker(
    cm,
    { index: 0, ticker: 'BTCUSD' },
    updated
  )

  expect(result).toEqual({
    ...cm,
    crypto: {
      ...cm.crypto,
      tickers: ['BTCUSD', 'ETHUSD'],
      updated: updated.getTime(),
    },
    updated: updated.getTime(),
  })
})
