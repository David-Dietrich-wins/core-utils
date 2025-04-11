import { IIdName } from '../models/id-name.mjs'
import {
  CreateFormStatusItem,
  CreateFormStatusTopLevel,
  FormStatusFindErrors,
  FormStatusManager,
} from '../services/FormStatus.mjs'
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
      name: CreateFormStatusItem('input[name="name"]'),
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

    ret.topLevelStatus.errorStatus = FormStatusFindErrors(ret)
    return ret
  }

  static CreateNew(name: string, tiles: ITileConfig[] = []) {
    if (!isArray(tiles, 1)) {
      tiles = [TileConfig.CreateTicker('AAPL')]
    }

    return new DashboardScreenSetting(name, tiles)
  }
}
