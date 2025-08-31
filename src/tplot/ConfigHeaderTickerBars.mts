import {
  DateHelper,
  type DateTypeAcceptable,
} from '../services/primitives/date-helper.mjs'
import type { IContext, IContextUI } from '../services/ContextManager.mjs'
import {
  arrayMoveElement,
  isArray,
  safeArray,
  safeArrayUnique,
} from '../services/primitives/array-helper.mjs'
import { deepCloneJson } from '../services/primitives/object-helper.mjs'
import { getBoolean } from '../services/primitives/boolean-helper.mjs'
import { isFunction } from '../services/primitives/function-helper.mjs'
import { newGuid } from '../services/primitives/uuid-helper.mjs'

type FuncContextTickers<T> = T | ((asset: IContextTickers) => T)

export interface IContextTickers extends IContext {
  backgroundColor?: IContextUI
  scrollSpeed?: number
  showPercentChanges?: boolean
  showPriceChanges?: boolean
  tickers: string[]
}

export interface IConfigHeaderTickerBars extends IContext {
  asset: IContextTickers
  crypto: IContextTickers
}

export class ConfigHeaderTickerBars {
  iConfig: IConfigHeaderTickerBars
  constructor(cfg: IConfigHeaderTickerBars) {
    this.iConfig = cfg
  }

  static defaults(
    overrides?: Partial<IConfigHeaderTickerBars>,
    updated?: DateTypeAcceptable
  ) {
    const dateNow = DateHelper.GetTime(updated)

    const cfgHeaderTickerBars: IConfigHeaderTickerBars = {
      asset: {
        id: newGuid(),
        tickers: ['AAPL'],
        updated: dateNow,
      },
      crypto: {
        id: newGuid(),
        tickers: ['BTCUSD', 'ETHUSD'],
        updated: dateNow,
      },
      id: newGuid(),
      updated: dateNow,
      ...overrides,
    }

    return ConfigHeaderTickerBars.verifyHeaderBars(cfgHeaderTickerBars)
  }

  get isHeaderTickerBarsAssetsDisabled() {
    return (
      getBoolean(this.iConfig.asset.disabled) ||
      !isArray(this.iConfig.asset.tickers, 1)
    )
  }
  get isHeaderTickerBarsCryptosDisabled() {
    return (
      getBoolean(this.iConfig.crypto.disabled) ||
      !isArray(this.iConfig.crypto.tickers, 1)
    )
  }

  get isHeaderTickerBarsDisabled() {
    return getBoolean(this.iConfig.disabled)
  }

  /** Checks if all of the conditions are met to disable the Ticker Bars */
  get shouldHeaderTickerBarsBeDisabled() {
    return (
      this.isHeaderTickerBarsDisabled ||
      (this.isHeaderTickerBarsCryptosDisabled &&
        this.isHeaderTickerBarsAssetsDisabled)
    )
  }

  static UpdateHeader(
    cfg: IConfigHeaderTickerBars,
    overrides: Partial<IConfigHeaderTickerBars>,
    updated?: DateTypeAcceptable
  ) {
    const cfgHeader: IConfigHeaderTickerBars = {
      ...deepCloneJson(cfg),
      ...overrides,
      updated: DateHelper.GetTime(updated),
    }

    return ConfigHeaderTickerBars.verifyHeaderBars(cfgHeader)
  }

  static disable(cfg: IConfigHeaderTickerBars, updated?: DateTypeAcceptable) {
    return ConfigHeaderTickerBars.UpdateHeader(
      cfg,
      {
        disabled: !cfg.disabled,
      },
      DateHelper.GetTime(updated)
    )
  }

  static updateCrypto<T>(
    cfg: IConfigHeaderTickerBars,
    payload: FuncContextTickers<T>,
    updated?: DateTypeAcceptable
  ) {
    const dtUpdated = DateHelper.GetTime(updated)
    const updater = isFunction(payload) ? payload(cfg.crypto) : payload

    return ConfigHeaderTickerBars.UpdateHeader(
      cfg,
      { crypto: { ...cfg.crypto, ...updater, updated: dtUpdated } },
      dtUpdated
    )
  }

  static updateAsset<T>(
    cfg: IConfigHeaderTickerBars,
    payload: FuncContextTickers<T>,
    updated?: DateTypeAcceptable
  ) {
    const dtUpdated = DateHelper.GetTime(updated)
    const updater = isFunction(payload) ? payload(cfg.asset) : payload

    return ConfigHeaderTickerBars.UpdateHeader(
      cfg,
      { asset: { ...cfg.asset, ...updater, updated: dtUpdated } },
      dtUpdated
    )
  }

  static verifyHeaderBars(cfgHeader: IConfigHeaderTickerBars) {
    const cfg = new ConfigHeaderTickerBars(cfgHeader)
    if (!cfg.iConfig.disabled) {
      if (cfg.shouldHeaderTickerBarsBeDisabled) {
        cfg.iConfig.disabled = true
      }
    }

    return cfg.iConfig
  }

  static assetAddTicker(
    cfg: IConfigHeaderTickerBars,
    payload: string,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateAsset(
      cfg,
      (asset: IContextTickers) => ({
        tickers: safeArrayUnique([...asset.tickers, payload]),
      }),
      updated
    )
  }

  static assetMoveTicker(
    cfg: IConfigHeaderTickerBars,
    payload: { from: number; to: number },
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateAsset(
      cfg,
      (asset: IContextTickers) => ({
        tickers: arrayMoveElement([...asset.tickers], payload.from, payload.to),
      }),
      updated
    )
  }

  static assetRemoveTicker(
    cfg: IConfigHeaderTickerBars,
    payload: string,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateAsset(
      cfg,
      (asset: IContextTickers) => ({
        tickers: safeArray(asset.tickers).filter((x) => x !== payload),
      }),
      updated
    )
  }

  static assetUpdateTicker(
    cfg: IConfigHeaderTickerBars,
    payload: { ticker: string; index: number },
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateAsset(
      cfg,
      (asset: IContextTickers) => ({
        tickers: safeArrayUnique(asset.tickers).map((ticker, index) =>
          index === payload.index ? payload.ticker : ticker
        ),
      }),
      updated
    )
  }

  static assetHeaderDisable(
    cfg: IConfigHeaderTickerBars,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateAsset(
      cfg,
      (asset: IContextTickers) => ({
        disabled: !asset.disabled,
      }),
      updated
    )
  }

  static assetHeaderBackground(
    cfg: IConfigHeaderTickerBars,
    payload: string,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateAsset(
      cfg,
      (asset: IContextTickers) => ({
        backgroundColor: {
          ...asset.backgroundColor,
          color: payload,
        },
      }),
      updated
    )
  }

  static assetHeaderScrollSpeed(
    cfg: IConfigHeaderTickerBars,
    payload: number,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateAsset(
      cfg,
      () => ({
        scrollSpeed: payload,
      }),
      updated
    )
  }

  static assetHeaderShowPriceChanges(
    cfg: IConfigHeaderTickerBars,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateAsset(
      cfg,
      (asset: IContextTickers) => ({
        showPriceChanges: !asset.showPriceChanges,
      }),
      updated
    )
  }

  static assetHeaderShowPercentChanges(
    cfg: IConfigHeaderTickerBars,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateAsset(
      cfg,
      (asset: IContextTickers) => ({
        showPercentChanges: !asset.showPercentChanges,
      }),
      updated
    )
  }

  static cryptoAddTicker(
    cfg: IConfigHeaderTickerBars,
    payload: string,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateCrypto(
      cfg,
      (crypto: IContextTickers) => ({
        tickers: safeArrayUnique([...crypto.tickers, payload]),
      }),
      updated
    )
  }

  static cryptoMoveTicker(
    cfg: IConfigHeaderTickerBars,
    payload: { from: number; to: number },
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateCrypto(
      cfg,
      (crypto: IContextTickers) => ({
        tickers: arrayMoveElement(crypto.tickers, payload.from, payload.to),
      }),
      updated
    )
  }

  static cryptoRemoveTicker(
    cfg: IConfigHeaderTickerBars,
    payload: string,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateCrypto(
      cfg,
      (crypto: IContextTickers) => ({
        tickers: safeArray(crypto.tickers).filter((x) => x !== payload),
      }),
      updated
    )
  }

  static cryptoUpdateTicker(
    cfg: IConfigHeaderTickerBars,
    payload: { ticker: string; index: number },
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateCrypto(
      cfg,
      (crypto: IContextTickers) => ({
        tickers: safeArrayUnique(crypto.tickers).map((ticker, index) =>
          index === payload.index ? payload.ticker : ticker
        ),
      }),
      updated
    )
  }

  static cryptoHeaderDisable(
    cfg: IConfigHeaderTickerBars,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateCrypto(
      cfg,
      (crypto: IContextTickers) => ({
        disabled: !crypto.disabled,
      }),
      updated
    )
  }

  static cryptoHeaderBackground(
    cfg: IConfigHeaderTickerBars,
    payload: string,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateCrypto(
      cfg,
      (crypto: IContextTickers) => ({
        backgroundColor: {
          ...crypto.backgroundColor,
          color: payload,
        },
      }),
      updated
    )
  }

  static cryptoHeaderScrollSpeed(
    cfg: IConfigHeaderTickerBars,
    payload: number,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateCrypto(
      cfg,
      () => ({
        scrollSpeed: payload,
      }),
      updated
    )
  }

  static cryptoHeaderShowPriceChanges(
    cfg: IConfigHeaderTickerBars,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateCrypto(
      cfg,
      (crypto: IContextTickers) => ({
        showPriceChanges: !crypto.showPriceChanges,
      }),
      updated
    )
  }

  static cryptoHeaderShowPercentChanges(
    cfg: IConfigHeaderTickerBars,
    updated?: DateTypeAcceptable
  ) {
    return ConfigHeaderTickerBars.updateCrypto(
      cfg,
      (crypto: IContextTickers) => ({
        showPercentChanges: !crypto.showPercentChanges,
      }),
      updated
    )
  }
}
