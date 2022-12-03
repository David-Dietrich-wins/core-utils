import { IIdName } from '../utils/id-name.js'
import { IId } from '../utils/interfaces.js'

export interface IHeaderTickersConfig {
  tickers: string[]
}
export interface IHeaderTickersIndexConfig {
  showAsset: boolean
  showCrypto: boolean
}

export interface IGridTileConfig extends IId {
  name?: string
  value?: string
  index: number
  typeid: number
  width?: string
  height?: string
  color?: string
  cols: number
  rows: number
  config?: any
}

export interface IDashboardScreenSetting extends IIdName<string, string> {
  tiles: IGridTileConfig[]
}

export interface IDashboardSettings {
  screens: IDashboardScreenSetting[]
}

export interface IUserConfigData {
  chartColorDown: string
  chartColorUp: string
  customData: string
  dashboards: IDashboardSettings
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
  dashboards: IDashboardSettings
  useMinusEight: boolean
  headerTickerBarIndex: IHeaderTickersIndexConfig
  headerTickerBarUser: IHeaderTickersConfig
  hideTickerBar: boolean
  hideTooltips: boolean
  openFirstPlot: boolean
  showPriceChangeInTickerBar: boolean
}
