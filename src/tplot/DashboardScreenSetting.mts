import { IIdName } from '../models/id-name.mjs'
import { FormStatus, FormStatusManager } from '../services/FormStatus.mjs'
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
    const topLevelStatus = FormStatus.CreateTopLevel()
    const parentId = topLevelStatus.id
    const ret: FormStatusManager<IDashboardScreenSetting> = {
      topLevelStatus,
      id: this.id,
      name: FormStatus.CreateItem('input[name="name"]', parentId, this.id),
      tiles: this.tiles.map((x) =>
        new TileConfig(
          x.id,
          x.name,
          x.value,
          x.type,
          x.index,
          x.cols,
          x.rows
        ).createFormStatus(topLevelStatus.id)
      ),
    }

    ret.topLevelStatus.errorStatus = FormStatus.FindErrors(ret)
    return ret
  }

  static CreateNew(name: string, tiles: ITileConfig[] = []) {
    if (!isArray(tiles, 1)) {
      tiles = [TileConfig.CreateTicker('AAPL')]
    }

    return new DashboardScreenSetting(name, tiles)
  }
}
