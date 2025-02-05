import { IIdName } from '../utils/id-name.js'
<<<<<<< HEAD
import { Iid } from '../utils/interfaces.js'
=======
import { IId } from '../utils/interfaces.js'
import { INameValue } from '../utils/name-value.js'
>>>>>>> 5ed179635b17d3454802648186c6b4d535190e23

export interface IHeaderTickersConfig {
  tickers: string[]
}
export interface IHeaderTickersIndexConfig {
  showAsset: boolean
  showCrypto: boolean
}

<<<<<<< HEAD
export interface IGridTileConfig extends Iid {
  name?: string
  value?: string
=======
export interface IGridTileConfig extends IId, INameValue {
>>>>>>> 5ed179635b17d3454802648186c6b4d535190e23
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

export interface IDashboardSetting {
  screens: IDashboardScreenSetting[]
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
  useMinusEight: boolean
  headerTickerBarIndex: IHeaderTickersIndexConfig
  headerTickerBarUser: IHeaderTickersConfig
  hideTickerBar: boolean
  hideTooltips: boolean
  openFirstPlot: boolean
  showPriceChangeInTickerBar: boolean
}
