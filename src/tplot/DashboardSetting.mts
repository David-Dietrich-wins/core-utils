import { IDashboardScreenSetting } from './DashboardScreenSetting.mjs'
import { safeArray } from '../services/array-helper.mjs'

export interface IDashboardSetting {
  screens: IDashboardScreenSetting[]
}

export class DashboardSetting implements IDashboardSetting {
  constructor(public screens: IDashboardScreenSetting[] = []) {
    this.screens = safeArray(screens)
  }

  get screenNames() {
    return safeArray(this.screens).map((x) => x.name)
  }
}
