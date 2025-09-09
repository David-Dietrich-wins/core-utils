import {
  type DateTypeAcceptable,
  dateGetTime,
} from '../primitives/date-helper.mjs'
import {
  type IContext,
  type IContextValue,
  updateContextValueToggleBoolean,
} from '../services/ContextManager.mjs'
import { deepCloneJson } from '../primitives/object-helper.mjs'
import { newGuid } from '../primitives/uuid-helper.mjs'

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
    const dtUpdated = dateGetTime(updated)

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

  static updateHeader(
    cfg: IConfigWebsite,
    updated?: DateTypeAcceptable,
    overrides?: Partial<IConfigWebsite>
  ) {
    const cfgUpdate: IConfigWebsite = {
      ...deepCloneJson(cfg),
      ...overrides,
      updated: dateGetTime(updated),
    }

    return cfgUpdate
  }

  static hideHelp(cfg: IConfigWebsite, updated?: DateTypeAcceptable) {
    const dtUpdated = dateGetTime(updated)

    const hideHelp = updateContextValueToggleBoolean(cfg.hideHelp, dtUpdated)

    return ConfigWebsite.updateHeader(cfg, dtUpdated, {
      hideHelp,
    })
  }

  static hideTooltips(cfg: IConfigWebsite, updated?: DateTypeAcceptable) {
    const dtUpdated = dateGetTime(updated)

    const hideTooltips = updateContextValueToggleBoolean(
      cfg.hideTooltips,
      dtUpdated
    )

    return ConfigWebsite.updateHeader(cfg, dtUpdated, {
      hideTooltips,
    })
  }

  static openFirstPlot(cfg: IConfigWebsite, updated?: DateTypeAcceptable) {
    const dtUpdated = dateGetTime(updated)

    const openFirstPlot = updateContextValueToggleBoolean(
      cfg.openFirstPlot,
      dtUpdated
    )

    return ConfigWebsite.updateHeader(cfg, dtUpdated, {
      openFirstPlot,
    })
  }
}
