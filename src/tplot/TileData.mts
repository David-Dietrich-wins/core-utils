import { ITileConfig } from './TileConfig.mjs'

export interface ITileData<Tdata = unknown> {
  config: ITileConfig
  data: Tdata
}
