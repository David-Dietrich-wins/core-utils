import {
  CreateFormStatusTopLevel,
  FormStatusFindErrors,
  FormStatusManager,
} from '../services/FormStatus.mjs'
import { safeArray } from '../services/general.mjs'
import {
  DashboardScreenSetting,
  IDashboardScreenSetting,
} from './DashboardScreenSetting.mjs'

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

  createFormStatus() {
    const ret: FormStatusManager<IDashboardSetting> = {
      topLevelStatus: CreateFormStatusTopLevel(),
      screens: this.screens.map((x) =>
        new DashboardScreenSetting(x.name, x.tiles).createFormStatus()
      ),
    }

    ret.topLevelStatus.errorStatus = FormStatusFindErrors(ret)
    return ret
  }
}
