import { IDashboardScreenSetting, IDashboardSettings } from "./tp-items"

export default class DashboardSettings implements IDashboardSettings {
  screens: IDashboardScreenSetting[] = []

  constructor(screens: IDashboardScreenSetting[] = []) {
    this.screens = screens || []
  }

  // get screenNames() {
  //   return (this.screens || []).map(x => x.name)
  // }
}
