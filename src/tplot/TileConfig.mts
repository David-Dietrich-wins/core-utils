import { type IIdNameValueType, IdNameValueType } from '../models/id-name.mjs'
import { safestr, safestrLowercase } from '../primitives/string-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import { type IChartSettings } from './ChartSettings.mjs'
import { newGuid } from '../primitives/uuid-helper.mjs'

const CONST_DefaultTicker = 'AAPL'

export const TileTypeKeys = {
  chart: 'chart',
  content: 'content',
  empty: 'empty',
  news: 'news',
  plotlist: 'plotlist',
  table: 'table',
  ticker: 'ticker-info',
} as const

export type TileType = (typeof TileTypeKeys)[keyof typeof TileTypeKeys]

export type TileConfigChart = IChartSettings & {
  useProfileColors?: boolean
}

export type TileConfigTicker = {
  ticker: string
  useProfileColors?: boolean
}

export type TileConfigContent<T = string> = {
  header?: string
  body?: string
  content?: T
  footer?: string
}

export type TileTypes = {
  [TileTypeKeys.chart]: TileConfigChart
  [TileTypeKeys.content]: TileConfigContent
  [TileTypeKeys.empty]: TileConfigContent
  [TileTypeKeys.news]: TileConfigContent
  [TileTypeKeys.plotlist]: TileConfigContent
  [TileTypeKeys.table]: TileConfigContent
  [TileTypeKeys.ticker]: TileConfigTicker
}

export interface ITileConfig<Tvalue = unknown>
  extends IIdNameValueType<Tvalue, TileType> {
  // The type of the tile
  index: number
  color?: string
  cols: number
  rows: number
  x?: number
  y?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TileConfig<Tvalue = any>
  extends IdNameValueType<Tvalue, TileType>
  implements ITileConfig<Tvalue>
{
  index: number
  cols: number
  rows: number

  constructor(
    id: string,
    name: string,
    value: Tvalue,
    type: TileType,
    index: number,
    cols: number,
    rows: number
  ) {
    super(id, name, value, type)

    this.index = index
    this.cols = cols
    this.rows = rows
  }

  static createFromTileType(
    type: TileType,
    overrides?: Partial<ITileConfig> | null
  ) {
    switch (type) {
      case TileTypeKeys.chart:
        return TileConfig.createChart(
          CONST_DefaultTicker,
          overrides as Partial<ITileConfig<TileConfigChart>>
        )

      case TileTypeKeys.content:
        return TileConfig.createContent(
          overrides as Partial<ITileConfig<TileConfigContent>>
        )

      case TileTypeKeys.empty:
        return TileConfig.createEmpty(
          overrides as Partial<ITileConfig<TileConfigContent>>
        )

      case TileTypeKeys.news:
        return TileConfig.createNews(
          overrides as Partial<ITileConfig<TileConfigContent>>
        )

      case TileTypeKeys.plotlist:
        return TileConfig.createPlotlist(
          overrides as Partial<ITileConfig<TileConfigContent>>
        )

      case TileTypeKeys.table:
        return TileConfig.createTable(
          overrides as Partial<ITileConfig<TileConfigContent>>
        )

      case TileTypeKeys.ticker:
        return TileConfig.createTicker(
          CONST_DefaultTicker,
          overrides as Partial<ITileConfig<TileConfigTicker>>
        )

      default:
        throw new AppException(
          `TileConfig.createFromString: Unknown tile type '${type}'`,
          'TileConfig.createFromString'
        )
    }
  }

  static tileText(tile: ITileConfig) {
    switch (tile.type) {
      case TileTypeKeys.plotlist:
        return 'PlotList'
      case TileTypeKeys.chart:
        return `Chart: ${(tile.value as TileConfigChart).ticker}`
      case TileTypeKeys.table:
        return 'Table:'
      case TileTypeKeys.ticker:
        return `Ticker: ${(tile.value as TileConfigTicker).ticker}`
      case TileTypeKeys.news:
        return 'News:'
      case TileTypeKeys.content:
        return `Content: ${(tile.value as TileConfigContent).content ?? ''}`
      case TileTypeKeys.empty:
        return 'Empty:'
      default:
        return `Unknown: ${tile.value} - ${safestr(
          (tile.value as TileConfigContent).content
        )}`
    }
  }

  static tileTypeFromString(type: string) {
    const ltype = safestrLowercase(type)

    switch (ltype) {
      case 'chart':
        return TileTypeKeys.chart

      case 'content':
        return TileTypeKeys.content

      case 'empty':
        return TileTypeKeys.empty

      case 'news':
        return TileTypeKeys.news

      case 'plotlist':
        return TileTypeKeys.plotlist

      case 'table':
        return TileTypeKeys.table

      default:
        if (ltype.startsWith('ticker')) {
          return TileTypeKeys.ticker
        }
    }

    throw new AppException(
      `Unknown tile type '${type}'`,
      'TileConfig.TileTypeFromString'
    )
  }

  static createITileConfig(overrides?: Partial<ITileConfig> | null) {
    const iTileConfig: ITileConfig = {
      cols: 1,
      id: newGuid(),
      index: 0,
      name: 'Trade Plotter',
      rows: 1,
      type: TileTypeKeys.empty,
      value: {},
      ...overrides,
    }

    return iTileConfig
  }

  static createTileConfig<T = unknown>(
    overrides?: Partial<ITileConfig<T>> | null
  ) {
    const itile = TileConfig.createITileConfig(overrides),
      tile = new TileConfig(
        itile.id,
        itile.name,
        itile.value,
        itile.type,
        itile.index,
        itile.cols,
        itile.rows
      )

    return tile
  }

  static ChartDefault(overrides?: Partial<TileConfigChart>) {
    const ret: TileConfigChart = {
      frequency: 1,
      frequencyType: 'daily',
      period: 1,
      periodType: 'year',
      ticker: CONST_DefaultTicker,
      ...overrides,
    }

    return ret
  }

  static createChart(
    ticker: string,
    overrides?: Partial<ITileConfig<TileConfigChart>> | null
  ) {
    return TileConfig.createTileConfig({
      value: TileConfig.ChartDefault({ ticker }),
      ...overrides,
      type: TileTypeKeys.chart,
    })
  }

  static createContent(
    overrides?: Partial<ITileConfig<TileConfigContent>> | null
  ) {
    return TileConfig.createTileConfig({
      ...overrides,
      type: TileTypeKeys.content,
    })
  }

  static createEmpty(
    overrides?: Partial<ITileConfig<TileConfigContent>> | null
  ) {
    return TileConfig.createTileConfig({
      ...overrides,
      type: TileTypeKeys.empty,
    })
  }

  static createNews(
    overrides?: Partial<ITileConfig<TileConfigContent>> | null
  ) {
    return TileConfig.createTileConfig({
      ...overrides,
      type: TileTypeKeys.news,
    })
  }

  static createPlotlist(
    overrides?: Partial<ITileConfig<TileConfigContent>> | null
  ) {
    return TileConfig.createTileConfig({
      value: {},
      ...overrides,
      cols: 12,
      type: TileTypeKeys.plotlist,
    })
  }

  static createTable(
    overrides?: Partial<ITileConfig<TileConfigContent>> | null
  ) {
    return TileConfig.createTileConfig({
      ...overrides,
      type: TileTypeKeys.table,
    })
  }

  static createTicker(
    ticker: string,
    overrides?: Partial<ITileConfig<TileConfigTicker>> | null
  ) {
    return TileConfig.createTileConfig({
      value: { ticker },
      ...overrides,
      type: TileTypeKeys.ticker,
    })
  }

  get ITileConfig() {
    const itile: ITileConfig = {
      cols: this.cols,
      id: this.id,
      index: this.index,
      name: this.name,
      rows: this.rows,
      type: this.type,
      value: this.value,
    }

    return itile
  }
}
