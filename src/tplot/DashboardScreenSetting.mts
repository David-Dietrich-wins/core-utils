import { IDashboardScreenSetting, IGridTileConfig } from './tp-items.mjs'

export class DashboardScreenSetting implements IDashboardScreenSetting {
  id = ''

  constructor(
    public name = '',
    public tiles: IGridTileConfig[] = []
  ) {}
}
