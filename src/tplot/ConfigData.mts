import { IHeaderTickersIndexConfig, IHeaderTickersConfig, IDashboardSetting } from './tp-items.mjs'

export class ConfigData {
  customData = ''
  useMinusEight = true
  openFirstPlot = true
  hideTooltips = false
  hideTickerBar = false
  showPriceChangeInTickerBar = false

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
