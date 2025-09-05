import {
  type DateTypeAcceptable,
  dateGetTime,
} from '../primitives/date-helper.mjs'
import {
  type IContext,
  type IContextValue,
  updateContext,
  updateContextValueToggleBoolean,
} from '../services/ContextManager.mjs'
import { newGuid } from '../primitives/uuid-helper.mjs'

export interface IConfigOperations extends IContext {
  minusEightPlus10: IContextValue<boolean>
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ConfigOperations {
  static defaults(
    overrides?: Partial<IConfigOperations>,
    updated?: DateTypeAcceptable
  ) {
    const cfgOperations: IConfigOperations = {
      id: newGuid(),
      minusEightPlus10: {
        id: newGuid(),
        updated: dateGetTime(updated),
        value: true,
      },
      updated: dateGetTime(updated),
      ...overrides,
    }

    return cfgOperations
  }

  static minusEightPlus10(
    cfg: IConfigOperations,
    updated?: DateTypeAcceptable
  ) {
    const ctxValue = updateContextValueToggleBoolean(
      cfg.minusEightPlus10,
      updated
    )

    const ctx = updateContext(cfg, { minusEightPlus10: ctxValue }, updated)

    return ctx
  }
}
