import { IIdName } from '../models/id-name.mjs'
import { isArray } from '../services/array-helper.mjs'
import { ITileConfig, TileConfig } from './TileConfig.mjs'

export interface IDashboardScreenSetting extends IIdName<string> {
  tiles: ITileConfig[]
}

export class DashboardScreenSetting implements IDashboardScreenSetting {
  id = ''

  constructor(public name = '', public tiles: ITileConfig[] = []) {}

  static Create(overrides?: Partial<IDashboardScreenSetting>) {
    return Object.assign(new DashboardScreenSetting(), overrides)
  }
  static CreateISetting(overrides?: Partial<IDashboardScreenSetting>) {
    const idss: IDashboardScreenSetting = Object.assign(
      {},
      DashboardScreenSetting.CreateNew('New Dashboard'),
      overrides
    )

    return idss
  }

  static CreateNew(name: string, tiles: ITileConfig[] = []) {
    if (!isArray(tiles, 1)) {
      tiles = [TileConfig.CreateTicker('AAPL').ITileConfig]
    }

    return new DashboardScreenSetting(name, tiles)
  }
}
