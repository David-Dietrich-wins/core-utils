import { IDashboardSetting } from './DashboardSetting.mjs'

export interface IHeaderTickersConfig {
  tickers: string[]
}
export interface IHeaderTickersIndexConfig {
  showAsset: boolean
  showCrypto: boolean
}

export interface IUserConfigData {
  chartColorDown: string
  chartColorUp: string
  customData: string
  dashboards: IDashboardSetting
  headerTickerBarIndex: IHeaderTickersIndexConfig
  headerTickerBarUser: IHeaderTickersConfig
  hideTooltips: boolean
  hideTickerBar: boolean
  openFirstPlot: boolean
  showPriceChangeInTickerBar: boolean
  useMinusEight: boolean
}

export type PermittedUserConfigs = {
  chartColorDown: string
  chartColorUp: string
  dashboards: IDashboardSetting
  headerTickerBarIndex: IHeaderTickersIndexConfig
  headerTickerBarUser: IHeaderTickersConfig
  hideTickerBar: boolean
  hideTooltips: boolean
  openFirstPlot: boolean
  showPriceChangeInTickerBar: boolean
  useMinusEight: boolean
}
