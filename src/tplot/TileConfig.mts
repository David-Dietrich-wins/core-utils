import { AppException } from '../models/AppException.mjs'
import { IdNameValueType, IIdNameValueType } from '../models/id-name.mjs'
import { newGuid } from '../services/general.mjs'
import { safestrLowercase } from '../services/string-helper.mjs'
import { IChartSettings } from './ChartSettings.mjs'

const CONST_DefaultTicker = 'AAPL'

export enum TileType {
  chart = 'chart',
  content = 'content',
  empty = 'empty',
  news = 'news',
  plotlist = 'plotlist',
  table = 'table',
  ticker = 'ticker-info',
}

export type TileConfigChart = IChartSettings & {
  useProfileColors?: boolean
}

export type TileConfigTicker = {
  ticker: string
  useProfileColors?: boolean
}

export function TileConfigChartDefault(overrides?: Partial<TileConfigChart>) {
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

export type TileConfigContent<T = string> = {
  header?: string
  body?: string
  content?: T
  footer?: string
}

export type TileTypes = {
  [TileType.chart]: TileConfigChart
  [TileType.content]: TileConfigContent
  [TileType.empty]: TileConfigContent
  [TileType.news]: TileConfigContent
  [TileType.plotlist]: TileConfigContent
  [TileType.table]: TileConfigContent
  [TileType.ticker]: TileConfigTicker
}

export interface ITileConfig<Tvalue = unknown>
  extends IIdNameValueType<Tvalue, TileType, string> {
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
  extends IdNameValueType<Tvalue, TileType, string>
  implements ITileConfig<Tvalue>
{
  constructor(
    id: string,
    name: string,
    value: Tvalue,
    type: TileType,
    public index: number,
    public cols: number,
    public rows: number
  ) {
    super(id, name, value, type)
  }

  static CreateFromTileType(
    type: TileType,
    overrides?: Partial<ITileConfig> | null
  ) {
    switch (type) {
      case TileType.chart:
        return TileConfig.CreateChart(
          CONST_DefaultTicker,
          overrides as Partial<ITileConfig<TileConfigChart>>
        )

      case TileType.content:
        return TileConfig.CreateContent(
          overrides as Partial<ITileConfig<TileConfigContent>>
        )

      case TileType.empty:
        return TileConfig.CreateEmpty(
          overrides as Partial<ITileConfig<TileConfigContent>>
        )

      case TileType.news:
        return TileConfig.CreateNews(
          overrides as Partial<ITileConfig<TileConfigContent>>
        )

      case TileType.plotlist:
        return TileConfig.CreatePlotlist(
          overrides as Partial<ITileConfig<TileConfigContent>>
        )

      case TileType.table:
        return TileConfig.CreateTable(
          overrides as Partial<ITileConfig<TileConfigContent>>
        )

      case TileType.ticker:
        return TileConfig.CreateTicker(
          CONST_DefaultTicker,
          overrides as Partial<ITileConfig<TileConfigTicker>>
        )

      default:
        throw new AppException(
          `TileConfig.CreateFromString: Unknown tile type '${type}'`,
          'TileConfig.CreateFromString'
        )
    }
  }

  static TileText(tile: ITileConfig) {
    switch (tile.type) {
      case TileType.plotlist:
        return 'PlotList'
      case TileType.chart:
        return `Chart: ${(tile.value as TileConfigChart).ticker}`
      case TileType.table:
        return 'Table:'
      case TileType.ticker:
        return `Ticker: ${(tile.value as TileConfigTicker).ticker}`
      case TileType.news:
        return 'News:'
      case TileType.content:
        return `Content: ${(tile.value as TileConfigContent)?.content}`
      case TileType.empty:
        return 'Empty:'
      default:
        return `Unknown: ${tile.value} - ${
          (tile.value as TileConfigContent)?.content
        }`
    }
  }

  static TileTypeFromString(type: string) {
    const ltype = safestrLowercase(type)

    switch (ltype) {
      case 'chart':
        return TileType.chart

      case 'content':
        return TileType.content

      case 'empty':
        return TileType.empty

      case 'news':
        return TileType.news

      case 'plotlist':
        return TileType.plotlist

      case 'table':
        return TileType.table

      default:
        if (ltype.startsWith('ticker')) {
          return TileType.ticker
        }
    }

    throw new AppException(
      `Unknown tile type '${type}'`,
      'TileConfig.TileTypeFromString'
    )
  }

  static CreateITileConfig(overrides?: Partial<ITileConfig> | null) {
    const iTileConfig: ITileConfig = {
      id: newGuid(),
      name: 'Trade Plotter',
      value: {},
      type: TileType.empty,
      index: 0,
      cols: 1,
      rows: 1,
      ...overrides,
    }

    return iTileConfig
  }

  static CreateTileConfig<T = unknown>(
    overrides?: Partial<ITileConfig<T>> | null
  ) {
    const itile = TileConfig.CreateITileConfig(overrides)

    const tile = new TileConfig(
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

  static CreateChart(
    ticker: string,
    overrides?: Partial<ITileConfig<TileConfigChart>> | null
  ) {
    return TileConfig.CreateTileConfig({
      value: TileConfigChartDefault({ ticker }),
      ...overrides,
      type: TileType.chart,
    })
  }

  static CreateContent(
    overrides?: Partial<ITileConfig<TileConfigContent>> | null
  ) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      type: TileType.content,
    })
  }

  static CreateEmpty(
    overrides?: Partial<ITileConfig<TileConfigContent>> | null
  ) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      type: TileType.empty,
    })
  }

  static CreateNews(
    overrides?: Partial<ITileConfig<TileConfigContent>> | null
  ) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      type: TileType.news,
    })
  }

  static CreatePlotlist(
    overrides?: Partial<ITileConfig<TileConfigContent>> | null
  ) {
    return TileConfig.CreateTileConfig({
      value: {},
      ...overrides,
      cols: 12,
      type: TileType.plotlist,
    })
  }

  static CreateTable(
    overrides?: Partial<ITileConfig<TileConfigContent>> | null
  ) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      type: TileType.table,
    })
  }

  static CreateTicker(
    ticker: string,
    overrides?: Partial<ITileConfig<TileConfigTicker>> | null
  ) {
    return TileConfig.CreateTileConfig({
      value: { ticker },
      ...overrides,
      type: TileType.ticker,
    })
  }

  get ITileConfig() {
    const itile: ITileConfig = {
      id: this.id,
      name: this.name,
      value: this.value,
      type: this.type,
      index: this.index,
      cols: this.cols,
      rows: this.rows,
    }

    return itile
  }
}
