import {
  IHeaderTickersIndexConfig,
  IHeaderTickersConfig,
  IDashboardSetting,
} from './tp-items.mjs'

export class ConfigData {
  constructor(
    public customData = '',
    public useMinusEight = true,
    public openFirstPlot = true,
    public hideTooltips = false,
    public hideTickerBar = false,
    public showPriceChangeInTickerBar = false
  ) {}

  headerTickerBarIndex: IHeaderTickersIndexConfig = {
    showAsset: true,
    showCrypto: true,
  }

  headerTickerBarUser: IHeaderTickersConfig = {
    tickers: [],
  }

  chartColorUp = '#00FF00'
  chartColorDown = '#FF0000'
  dashboards?: IDashboardSetting
}
