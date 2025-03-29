import { AppException } from '../models/AppException.mjs'
import { IdNameValueType, IIdNameValueType } from '../models/id-name.mjs'
import { newGuid, safestrLowercase } from '../services/general.mjs'
import { DefaultWithOverrides } from '../services/object-helper.mjs'
import { IChartData } from './ChartSettings.mjs'

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
export type TileConfigTicker = IChartData & {
  useProfileColors?: boolean
}
export function TileConfigTickerDefault(overrides?: Partial<TileConfigTicker>) {
  const ret: TileConfigTicker = {
    frequency: 1,
    frequencyType: 'daily',
    period: 1,
    periodType: 'year',
    ticker: CONST_DefaultTicker,
    ...overrides,
  }

  return ret
}

export type TileConfigContent = {
  header?: string
  body?: string
  footer?: string
}

export type TileTypes = {
  [TileType.chart]: TileConfigTicker
  [TileType.content]: TileConfigContent
  [TileType.empty]: TileConfigContent
  [TileType.news]: TileConfigContent
  [TileType.plotlist]: TileConfigContent
  [TileType.table]: TileConfigContent
  [TileType.ticker]: TileConfigTicker
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ITileConfig<Tvalue = any>
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

  static CreateFromTileType(type: TileType, overrides?: Partial<ITileConfig>) {
    switch (type) {
      case TileType.chart:
        return TileConfig.CreateChart(CONST_DefaultTicker, overrides)

      case TileType.content:
        return TileConfig.CreateContent(overrides)

      case TileType.empty:
        return TileConfig.CreateEmpty(overrides)

      case TileType.news:
        return TileConfig.CreateNews(overrides)

      case TileType.plotlist:
        return TileConfig.CreatePlotlist(overrides)

      case TileType.table:
        return TileConfig.CreateTable(overrides)

      case TileType.ticker:
        return TileConfig.CreateTicker(CONST_DefaultTicker, overrides)

      default:
        throw new AppException(
          `TileConfig.CreateFromString: Unknown tile type '${type}'`,
          'TileConfig.CreateFromString'
        )
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
    const DEFAULT_TileConfig: ITileConfig = {
      id: newGuid(),
      name: 'Trade Plotter',
      value: {},
      type: TileType.empty,
      index: 0,
      cols: 1,
      rows: 1,
    }

    const itile = DefaultWithOverrides(DEFAULT_TileConfig, overrides)

    return itile
  }

  static CreateTileConfig(overrides?: Partial<ITileConfig> | null) {
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

  static CreateChart(ticker: string, overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      value: TileConfigTickerDefault({ ticker }),
      ...overrides,
      type: TileType.chart,
    })
  }

  static CreateContent(overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      type: TileType.content,
    })
  }

  static CreateEmpty(overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      type: TileType.empty,
    })
  }

  static CreateNews(overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      type: TileType.news,
    })
  }

  static CreatePlotlist(overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      value: {},
      ...overrides,
      cols: 12,
      type: TileType.plotlist,
    })
  }

  static CreateTable(overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      type: TileType.table,
    })
  }

  static CreateTicker(ticker: string, overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      value: TileConfigTickerDefault({ ticker }),
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
