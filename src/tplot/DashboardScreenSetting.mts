import { IIdName } from '../models/id-name.mjs'
import {
  CreateFormStatusTopLevel,
  FormStatusManager,
} from '../models/types.mjs'
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

  createFormStatus() {
    const ret: FormStatusManager<IDashboardScreenSetting> = {
      topLevelStatus: CreateFormStatusTopLevel(),
      id: this.id,
      name: { error: false, text: [] },
      tiles: this.tiles.map((x) =>
        new TileConfig(
          x.id,
          x.name,
          x.value,
          x.type,
          x.index,
          x.cols,
          x.rows
        ).createFormStatus()
      ),
    }

    return ret
  }

  static CreateNew(name: string, tiles: ITileConfig[] = []) {
    if (!isArray(tiles, 1)) {
      tiles = [TileConfig.CreateTicker('AAPL')]
    }

    return new DashboardScreenSetting(name, tiles)
  }
}
