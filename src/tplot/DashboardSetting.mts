import {
  type DateTypeAcceptable,
  dateGetTime,
} from '../primitives/date-helper.mjs'
import type { IContext } from '../services/ContextManager.mjs'
import { type IDashboardScreenSetting } from './DashboardScreenSetting.mjs'
import { TileTypeKeys } from './TileConfig.mjs'
import { newGuid } from '../primitives/uuid-helper.mjs'
import { safeArray } from '../primitives/array-helper.mjs'

export interface IDashboardSetting extends IContext {
  screens: IDashboardScreenSetting[]
}

export class DashboardSetting implements IDashboardSetting {
  id = newGuid()
  updated: number = Date.now()
  screens: IDashboardScreenSetting[] = []

  constructor(screens: IDashboardScreenSetting[] = []) {
    this.screens = safeArray(screens)
  }
  [x: string]: unknown

  static defaults(
    overrides?: Partial<IDashboardSetting>,
    updated?: DateTypeAcceptable
  ): IDashboardSetting {
    const aDateNow = dateGetTime(updated)

    const cfgDashboards: IDashboardSetting = {
      id: newGuid(),
      screens: [
        {
          id: 'default',
          name: 'default',
          tiles: [
            {
              color: 'white',
              cols: 1,
              id: 'initial-tile-left',
              index: 0,
              name: 'Trade Plotter',
              rows: 2,
              type: TileTypeKeys.empty,
              value: {},
            },
            {
              color: 'white',
              cols: 1,
              id: 'initial-tile-right',
              index: 0,
              name: 'Trade Plotter',
              rows: 2,
              type: TileTypeKeys.empty,
              value: {},
            },
          ],
        },
        // Example for a chart and a plotlist.
        // [
        //   {
        //     Id: 'AAPL',
        //     Index: 0,
        //     Typeid: 3,
        //     Cols: 1,
        //     Rows: 2
        //   },
        //   {
        //     Id: 'Trade Plotter',
        //     Index: 2,
        //     Typeid: 1,
        //     Cols: 2,
        //     Rows: 2
        //   }
        // ],
      ],
      updated: aDateNow,
      ...overrides,
    }

    return cfgDashboards
  }

  get screenNames() {
    return safeArray(this.screens).map((x) => x.name)
  }
}
