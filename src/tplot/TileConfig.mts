import { AppException } from '../models/AppException.mjs'
import { IId } from '../models/interfaces.mjs'
import { newGuid, safestrLowercase } from '../services/general.mjs'
import { DefaultWithOverrides } from '../services/object-helper.mjs'

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

export interface ITileConfig extends Required<IId<string | number>> {
  name?: string
  // The type of the tile
  value: TileType
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

export class TileConfig implements ITileConfig {
  constructor(
    public id: string | number,
    public index: number,
    public cols: number,
    public rows: number,
    public typeid: number,
    public value: TileType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public config?: any
  ) {}

  static CreateFromString(type: string, id: string | number) {
    switch (safestrLowercase(type)) {
      case 'chart':
        return TileConfig.CreateChart(CONST_DefaultTicker, { id })

      case 'content':
        return TileConfig.CreateContent({ id })

      case 'empty':
        return TileConfig.CreateEmpty({ id })

      case 'news':
        return TileConfig.CreateNews({ id })

      case 'plotlist':
        return TileConfig.CreatePlotlist({ id })

      case 'table':
        return TileConfig.CreateTable({ id })

      case 'ticker':
      case 'ticker-info':
        return TileConfig.CreateTicker(CONST_DefaultTicker, { id })

      default:
        throw new AppException(
          `TileConfig.CreateFromString: Unknown tile type '${type}'`,
          'TileConfig.CreateFromString'
        )
    }
  }

  static CreateITileConfig(overrides?: Partial<ITileConfig> | null) {
    const DEFAULT_TileConfig: ITileConfig = {
      id: newGuid(),
      index: 0,
      cols: 1,
      rows: 1,
      typeid: 0,
      value: TileType.empty,
    }

    const itile = DefaultWithOverrides(DEFAULT_TileConfig, overrides)

    return itile
  }

  static CreateTileConfig(overrides?: Partial<ITileConfig> | null) {
    const itile = TileConfig.CreateITileConfig(overrides)

    const tile = new TileConfig(
      itile.id,
      itile.index,
      itile.cols,
      itile.rows,
      itile.typeid,
      itile.value,
      itile.config
    )

    return tile
  }

  static CreateChart(ticker: string, overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      config: { ticker },
      value: TileType.chart,
    })
  }

  static CreateContent(overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      value: TileType.content,
    })
  }

  static CreateEmpty(overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      value: TileType.empty,
    })
  }

  static CreateNews(overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      value: TileType.news,
    })
  }

  static CreatePlotlist(overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      value: TileType.plotlist,
    })
  }

  static CreateTable(overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      value: TileType.table,
    })
  }

  static CreateTicker(ticker: string, overrides?: Partial<ITileConfig> | null) {
    return TileConfig.CreateTileConfig({
      ...overrides,
      config: { ticker },
      value: TileType.ticker,
    })
  }

  get ITileConfig() {
    const itile: ITileConfig = {
      id: this.id,
      index: this.index,
      cols: this.cols,
      rows: this.rows,
      typeid: this.typeid,
      value: this.value,
      config: this.config,
    }

    return itile
  }
}
