import { ITileConfig, TileConfig } from './TileConfig.mjs'
import { IIdName } from '../models/id-name.mjs'
import { isArray } from '../primitives/array-helper.mjs'

export interface IDashboardScreenSetting extends IIdName {
  tiles: ITileConfig[]
}

export class DashboardScreenSetting implements IDashboardScreenSetting {
  id = ''
  name = ''
  tiles: ITileConfig[] = []

  constructor(name = '', tiles: ITileConfig[] = []) {
    this.name = name
    this.tiles = tiles
  }

  static Create(overrides?: Partial<IDashboardScreenSetting>) {
    return Object.assign(new DashboardScreenSetting(), overrides)
  }
  static CreateISetting(overrides?: Partial<IDashboardScreenSetting>) {
    const idss: IDashboardScreenSetting = {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...DashboardScreenSetting.CreateNew('New Dashboard'),
      ...overrides,
    }

    return idss
  }

  static CreateNew(name: string, tiles: ITileConfig[] = []) {
    return new DashboardScreenSetting(
      name,
      isArray(tiles, 1) ? tiles : [TileConfig.CreateTicker('AAPL').ITileConfig]
    )
  }
}
