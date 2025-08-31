import {
  DateHelper,
  type DateTypeAcceptable,
} from '../services/primitives/date-helper.mjs'
import {
  type IContext,
  type IContextUI,
  updateContext,
  updateContextUi,
} from '../services/ContextManager.mjs'
import { newGuid } from '../services/primitives/uuid-helper.mjs'

export interface IConfigCharts extends IContext {
  down: IContextUI
  neutral: IContextUI
  up: IContextUI
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ConfigCharts {
  static disable(cfg: IConfigCharts, updated?: DateTypeAcceptable) {
    return updateContext(cfg, { disabled: !cfg.disabled }, updated)
  }

  static defaults(
    overrides?: Partial<IConfigCharts>,
    updated?: DateTypeAcceptable
  ) {
    const cfgCharts: IConfigCharts = {
      down: { color: '#FF0000' },
      id: newGuid(),
      neutral: { color: '#000000' },
      up: { color: '#00FF00' },
      updated: DateHelper.GetTime(updated),
      ...overrides,
    }

    return cfgCharts
  }

  static down(cfg: IConfigCharts, color: string, updated?: DateTypeAcceptable) {
    return updateContext(
      cfg,
      { down: updateContextUi(cfg.down, { color }) },
      updated
    )
  }

  static neutral(
    cfg: IConfigCharts,
    color: string,
    updated?: DateTypeAcceptable
  ) {
    return updateContext(
      cfg,
      { neutral: updateContextUi(cfg.neutral, { color }) },
      updated
    )
  }

  static resetColors(cfg: IConfigCharts, updated?: DateTypeAcceptable) {
    return updateContext(
      cfg,
      {
        down: { ...cfg.down, color: '#FF0000' },
        neutral: { ...cfg.neutral, color: '#000000' },
        up: { ...cfg.up, color: '#00FF00' },
      },
      updated
    )
  }

  static up(cfg: IConfigCharts, color: string, updated?: DateTypeAcceptable) {
    return updateContext(
      cfg,
      { up: updateContextUi(cfg.up, { color }) },
      updated
    )
  }
}
