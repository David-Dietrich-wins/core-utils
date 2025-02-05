import { safeArray } from '../utils/skky.js'
import { IDashboardScreenSetting, IDashboardSettings } from './tp-items.js'

export default class DashboardSettings implements IDashboardSettings {
  constructor(public screens: IDashboardScreenSetting[] = []) {
    this.screens = safeArray(screens)
  }

  get screenNames() {
    return safeArray(this.screens).map((x) => x.name)
  }
}
