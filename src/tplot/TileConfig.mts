import { IId } from '../models/interfaces.mjs'

export enum TileType {
  chart = 'chart',
  content = 'content',
  empty = 'empty',
  news = 'news',
  plotlist = 'plotlist',
  table = 'table',
  ticker = 'ticker-info',
}

export interface ITileConfig extends IId {
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
