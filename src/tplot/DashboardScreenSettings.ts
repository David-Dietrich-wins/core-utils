import { IDashboardScreenSetting, IGridTileConfig } from './tp-items.js'

export default class DashboardScreenSetting implements IDashboardScreenSetting {
  id = ''
  name = ''
  tiles: IGridTileConfig[] = []

  constructor(name = '', tiles: IGridTileConfig[] = []) {
    this.name = name
    this.tiles = tiles || []
  }
}
