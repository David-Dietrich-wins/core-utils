<<<<<<<< HEAD:src/tplot/DashboardSetting.mts
import { safeArray } from '../services/general.mjs'
import { IDashboardScreenSetting, IDashboardSetting } from './tp-items.mjs'
========
import { safeArray } from '../utils/skky.js'
import { IDashboardScreenSetting, IDashboardSettings } from './tp-items.js'
>>>>>>>> 7b5ae1f06d9cd8e7167741d1f7c7524a24d5475f:src/tplot/DashboardSettings.ts

export default class DashboardSettings implements IDashboardSettings {
  constructor(public screens: IDashboardScreenSetting[] = []) {
    this.screens = safeArray(screens)
  }

  get screenNames() {
    return safeArray(this.screens).map((x) => x.name)
  }
}
