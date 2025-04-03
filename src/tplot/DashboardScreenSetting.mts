import { IIdName } from '../models/id-name.mjs'
import { isArray } from '../services/general.mjs'
import { ITileConfig, TileConfig } from './TileConfig.mjs'

export interface IDashboardScreenSetting extends IIdName<string, string> {
  tiles: ITileConfig[]
}

export class DashboardScreenSetting implements IDashboardScreenSetting {
  id = ''

  constructor(public name = '', public tiles: ITileConfig[] = []) {}

  static Create(overrides?: Partial<IDashboardScreenSetting>) {
    return Object.assign(new DashboardScreenSetting(), overrides)
  }

  static CreateNew(name: string, tiles: ITileConfig[] = []) {
    if (!isArray(tiles, 1)) {
      tiles = [TileConfig.CreateTicker('AAPL')]
    }

    return new DashboardScreenSetting(name, tiles)
  }
}
