import { IIdName } from '../models/id-name.mjs'
import { IId } from '../models/interfaces.mjs'
import { INameValue } from '../models/name-value.mjs'

export interface IHeaderTickersConfig {
  tickers: string[]
}
export interface IHeaderTickersIndexConfig {
  showAsset: boolean
  showCrypto: boolean
}

export interface IGridTileConfig extends Iid {
  name?: string
  value?: string
export interface IGridTileConfig extends Iid {
  name?: string
  value?: string
  index: number
  typeid: number
  width?: string
  height?: string
  color?: string
  cols: number
  rows: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any
}

export interface IDashboardScreenSetting extends IIdName<string, string> {
  tiles: IGridTileConfig[]
}

export interface IDashboardSettings {
export interface IDashboardSettings {
  screens: IDashboardScreenSetting[]
}

export interface IUserConfigData {
  chartColorDown: string
  chartColorUp: string
  customData: string
  dashboards: IDashboardSettings
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
  dashboards: IDashboardSettings
  useMinusEight: boolean
  headerTickerBarIndex: IHeaderTickersIndexConfig
  headerTickerBarUser: IHeaderTickersConfig
  hideTickerBar: boolean
  hideTooltips: boolean
  openFirstPlot: boolean
  showPriceChangeInTickerBar: boolean
}
