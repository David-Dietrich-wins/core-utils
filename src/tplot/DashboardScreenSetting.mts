import { IIdName } from '../models/id-name.mjs'
import { ITileConfig } from './TileConfig.mjs'

export interface IDashboardScreenSetting extends IIdName<string, string> {
  tiles: ITileConfig[]
}

export class DashboardScreenSetting implements IDashboardScreenSetting {
  id = ''

  constructor(public name = '', public tiles: ITileConfig[] = []) {}
}
