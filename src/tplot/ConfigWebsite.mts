import { DateHelper, type DateTypeAcceptable } from '../services/DateHelper.mjs'
import {
  type IContext,
  type IContextValue,
  updateContextValueToggleBoolean,
} from '../services/ContextManager.mjs'
import { deepCloneJson } from '../services/object-helper.mjs'
import { newGuid } from '../services/general.mjs'

export interface IConfigWebsite extends IContext {
  openFirstPlot: IContextValue<boolean>
  hideHelp: IContextValue<boolean>
  hideTooltips: IContextValue<boolean>
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ConfigWebsite {
  static defaults(
    overrides?: Partial<IConfigWebsite>,
    updated?: DateTypeAcceptable
  ): IConfigWebsite {
    const dtUpdated = DateHelper.GetTime(updated)

    const cfgWebsite: IConfigWebsite = {
      hideHelp: { id: newGuid(), updated: dtUpdated, value: false },
      hideTooltips: { id: newGuid(), updated: dtUpdated, value: false },
      id: newGuid(),
      openFirstPlot: { id: newGuid(), updated: dtUpdated, value: true },
      updated: dtUpdated,
      ...overrides,
    }

    return cfgWebsite
  }

  static UpdateHeader(
    cfg: IConfigWebsite,
    updated?: DateTypeAcceptable,
    overrides?: Partial<IConfigWebsite>
  ) {
    const cfgUpdate: IConfigWebsite = {
      ...deepCloneJson(cfg),
      ...overrides,
      updated: DateHelper.GetTime(updated),
    }

    return cfgUpdate
  }

  static HideHelp(cfg: IConfigWebsite, updated?: DateTypeAcceptable) {
    const dtUpdated = DateHelper.GetTime(updated)

    const hideHelp = updateContextValueToggleBoolean(cfg.hideHelp, dtUpdated)

    return ConfigWebsite.UpdateHeader(cfg, dtUpdated, {
      hideHelp,
    })
  }

  static HideTooltips(cfg: IConfigWebsite, updated?: DateTypeAcceptable) {
    const dtUpdated = DateHelper.GetTime(updated)

    const hideTooltips = updateContextValueToggleBoolean(
      cfg.hideTooltips,
      dtUpdated
    )

    return ConfigWebsite.UpdateHeader(cfg, dtUpdated, {
      hideTooltips,
    })
  }

  static OpenFirstPlot(cfg: IConfigWebsite, updated?: DateTypeAcceptable) {
    const dtUpdated = DateHelper.GetTime(updated)

    const openFirstPlot = updateContextValueToggleBoolean(
      cfg.openFirstPlot,
      dtUpdated
    )

    return ConfigWebsite.UpdateHeader(cfg, dtUpdated, {
      openFirstPlot,
    })
  }
}
