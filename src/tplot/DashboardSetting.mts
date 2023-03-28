import { safeArray } from '../utils/skky.mjs'
import { IDashboardScreenSetting, IDashboardSetting } from './tp-items.mjs'

export class DashboardSetting implements IDashboardSetting {
  constructor(public screens: IDashboardScreenSetting[] = []) {
    this.screens = safeArray(screens)
  }

  get screenNames() {
    return safeArray(this.screens).map((x) => x.name)
  }
}
