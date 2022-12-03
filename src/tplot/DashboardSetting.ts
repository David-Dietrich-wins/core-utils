import { safeArray } from '../index.js'
import { IDashboardScreenSetting, IDashboardSetting } from './tp-items.js'

export default class DashboardSetting implements IDashboardSetting {
  screens: IDashboardScreenSetting[] = []

  constructor(screens: IDashboardScreenSetting[] = []) {
    this.screens = safeArray(screens)
  }

  get screenNames() {
    return safeArray(this.screens).map((x) => x.name)
  }
}
