import {
  ConfigHeaderTickerBars,
  type IConfigHeaderTickerBars,
} from './ConfigHeaderTickerBars.mjs'
import { describe, expect, it } from '@jest/globals'
import { newGuid } from '../primitives/uuid-helper.mjs'

describe('constructor', () => {
  it('constructor with default', () => {
    expect.assertions(1)

    const cfg: IConfigHeaderTickerBars = ConfigHeaderTickerBars.defaults(),
      ui = new ConfigHeaderTickerBars(cfg)

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

  it('defaults', () => {
    expect.hasAssertions()

    const result = ConfigHeaderTickerBars.defaults()

    expect(result).toStrictEqual({
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
})

describe('disabled', () => {
  it('isHeaderTickerBarsDisabled', () => {
    expect.hasAssertions()

    const cm = ConfigHeaderTickerBars.defaults()
    cm.disabled = true
    // eslint-disable-next-line one-var
    const ui = new ConfigHeaderTickerBars(cm)

    expect(ui.isHeaderTickerBarsDisabled).toBe(true)

    cm.disabled = false

    expect(new ConfigHeaderTickerBars(cm).isHeaderTickerBarsDisabled).toBe(
      false
    )
  })

  it('shouldHeaderTickerBarsBeDisabled', () => {
    expect.hasAssertions()

    const cm = ConfigHeaderTickerBars.defaults()
    cm.disabled = true
    cm.asset.disabled = true
    cm.crypto.disabled = true

    // eslint-disable-next-line one-var
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

  it('disable', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.disable(cm, dtUpdated)

    expect(result).toStrictEqual({
      ...cm,
      disabled: true,
      updated: dtUpdated.getTime(),
    })
  })
})

describe('assets', () => {
  it('isHeaderTickerBarsAssetsDisabled', () => {
    expect.hasAssertions()

    const cm = ConfigHeaderTickerBars.defaults()
    cm.asset.disabled = true
    // eslint-disable-next-line one-var
    const ui = new ConfigHeaderTickerBars(cm)

    expect(ui.isHeaderTickerBarsAssetsDisabled).toBe(true)

    cm.asset.disabled = false

    expect(ui.isHeaderTickerBarsAssetsDisabled).toBe(false)
  })

  it('update', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.updateAsset(
        cm,
        { symbol: 'AAPL' },
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      asset: {
        ...cm.asset,
        symbol: 'AAPL',
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('addTicker', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.assetAddTicker(cm, 'AAPL', dtUpdated)

    expect(result).toStrictEqual({
      ...cm,
      asset: {
        ...cm.asset,
        tickers: ['AAPL'],
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('background', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.assetHeaderBackground(
        cm,
        'blue',
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      asset: {
        ...cm.asset,
        backgroundColor: { color: 'blue' },
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('disable', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.assetHeaderDisable(cm, dtUpdated)

    expect(result).toStrictEqual({
      ...cm,
      asset: {
        ...cm.asset,
        disabled: true,
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('scrollSpeed', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.assetHeaderScrollSpeed(cm, 100, dtUpdated)

    expect(result).toStrictEqual({
      ...cm,
      asset: {
        ...cm.asset,
        scrollSpeed: 100,
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('showPercentChanges', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.assetHeaderShowPercentChanges(
        cm,
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      asset: {
        ...cm.asset,
        showPercentChanges: true,
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('showPriceChanges', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.assetHeaderShowPriceChanges(cm, dtUpdated)

    expect(result).toStrictEqual({
      ...cm,
      asset: {
        ...cm.asset,
        showPriceChanges: true,
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('moveTicker', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults()
    cm.asset.tickers = ['AAPL', 'GOOGL', 'TSLA']
    // eslint-disable-next-line one-var
    const dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.assetMoveTicker(
        cm,
        { from: 0, to: 1 },
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      asset: {
        ...cm.asset,
        tickers: ['GOOGL', 'AAPL', 'TSLA'],
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('removeTicker', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.assetRemoveTicker(cm, 'AAPL', dtUpdated)

    expect(result).toStrictEqual({
      ...cm,
      asset: {
        ...cm.asset,
        tickers: [],
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('updateTicker', () => {
    expect.assertions(2)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.assetUpdateTicker(
        cm,
        { index: 0, ticker: 'AAPL' },
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      asset: {
        ...cm.asset,
        tickers: ['AAPL'],
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })

    cm.asset.tickers = ['AAPL', 'TSLA']

    expect(
      ConfigHeaderTickerBars.assetUpdateTicker(
        cm,
        { index: 1, ticker: 'GOOGL' },
        dtUpdated
      )
    ).toStrictEqual({
      ...cm,
      asset: {
        ...cm.asset,
        tickers: ['AAPL', 'GOOGL'],
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })
})

describe('crypto', () => {
  it('isHeaderTickerBarsCryptosDisabled', () => {
    expect.hasAssertions()

    const cm = ConfigHeaderTickerBars.defaults()
    cm.crypto.disabled = true
    // eslint-disable-next-line one-var
    const ui = new ConfigHeaderTickerBars(cm)

    expect(ui.isHeaderTickerBarsCryptosDisabled).toBe(true)

    cm.crypto.disabled = false

    expect(ui.isHeaderTickerBarsCryptosDisabled).toBe(false)
  })

  it('updateCrypto', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.updateCrypto(
        cm,
        { symbol: 'BTC' },
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      crypto: {
        ...cm.crypto,
        symbol: 'BTC',
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('addTicker', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.cryptoAddTicker(cm, 'BTCUSD', dtUpdated)

    expect(result).toStrictEqual({
      ...cm,
      crypto: {
        ...cm.crypto,
        tickers: ['BTCUSD', 'ETHUSD'],
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('headerBackground', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.cryptoHeaderBackground(
        cm,
        'blue',
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      crypto: {
        ...cm.crypto,
        backgroundColor: { color: 'blue' },
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('headerDisable', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.cryptoHeaderDisable(cm, dtUpdated)

    expect(result).toStrictEqual({
      ...cm,
      crypto: {
        ...cm.crypto,
        disabled: true,
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('scrollSpeed', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.cryptoHeaderScrollSpeed(
        cm,
        100,
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      crypto: {
        ...cm.crypto,
        scrollSpeed: 100,
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('showPercentChanges', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.cryptoHeaderShowPercentChanges(
        cm,
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      crypto: {
        ...cm.crypto,
        showPercentChanges: true,
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('showPriceChanges', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.cryptoHeaderShowPriceChanges(
        cm,
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      crypto: {
        ...cm.crypto,
        showPriceChanges: true,
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('moveTicker', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults()
    cm.crypto.tickers = ['BTCUSD', 'ETHUSD', 'LTCUSD']
    // eslint-disable-next-line one-var
    const dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.cryptoMoveTicker(
        cm,
        { from: 0, to: 1 },
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      crypto: {
        ...cm.crypto,
        tickers: ['ETHUSD', 'BTCUSD', 'LTCUSD'],
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('removeTicker', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.cryptoRemoveTicker(
        cm,
        'BTCUSD',
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      crypto: {
        ...cm.crypto,
        tickers: ['ETHUSD'],
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })

  it('updateTicker', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = new Date(),
      result = ConfigHeaderTickerBars.cryptoUpdateTicker(
        cm,
        { index: 0, ticker: 'BTCUSD' },
        dtUpdated
      )

    expect(result).toStrictEqual({
      ...cm,
      crypto: {
        ...cm.crypto,
        tickers: ['BTCUSD', 'ETHUSD'],
        updated: dtUpdated.getTime(),
      },
      updated: dtUpdated.getTime(),
    })
  })
})

describe('header', () => {
  it('update', () => {
    expect.assertions(1)

    const cm = ConfigHeaderTickerBars.defaults(),
      dtUpdated = Date.now(),
      overrides = {
        crypto: { id: newGuid(), tickers: ['ETH'], updated: dtUpdated },
        disabled: true,
      },
      result = ConfigHeaderTickerBars.updateHeader(cm, overrides, dtUpdated)

    expect(result).toStrictEqual({
      asset: {
        id: expect.any(String),
        tickers: ['AAPL'],
        updated: dtUpdated,
      },
      crypto: {
        id: expect.any(String),
        tickers: ['ETH'],
        updated: dtUpdated,
      },
      disabled: true,
      id: expect.any(String),
      updated: dtUpdated,
    })
  })
})

describe('verify', () => {
  it('header bars', () => {
    expect.assertions(8)

    const cm = ConfigHeaderTickerBars.defaults(),
      result = ConfigHeaderTickerBars.verifyHeaderBars(cm)

    expect(result).toStrictEqual({
      ...cm,
      updated: expect.any(Number),
    })

    cm.disabled = true

    expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toStrictEqual({
      ...cm,
      updated: expect.any(Number),
    })

    cm.disabled = false

    expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toStrictEqual({
      ...cm,
      updated: expect.any(Number),
    })

    cm.asset.disabled = true

    expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toStrictEqual({
      ...cm,
      updated: expect.any(Number),
    })

    cm.asset.disabled = false

    expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toStrictEqual({
      ...cm,
      updated: expect.any(Number),
    })

    cm.crypto.disabled = true

    expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toStrictEqual({
      ...cm,
      updated: expect.any(Number),
    })

    cm.crypto.disabled = false

    expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toStrictEqual({
      ...cm,
      updated: expect.any(Number),
    })

    cm.disabled = false
    cm.asset.disabled = true
    cm.crypto.disabled = true

    expect(ConfigHeaderTickerBars.verifyHeaderBars(cm)).toStrictEqual({
      ...cm,
      updated: expect.any(Number),
    })
  })
})
