import { ConfigCharts, type IConfigCharts } from '../tplot/ConfigCharts.mjs'
import {
  ConfigHeaderTickerBars,
  type IConfigHeaderTickerBars,
} from '../tplot/ConfigHeaderTickerBars.mjs'
import {
  ConfigOperations,
  type IConfigOperations,
} from '../tplot/ConfigOperations.mjs'
import { ConfigWebsite, type IConfigWebsite } from '../tplot/ConfigWebsite.mjs'
import {
  DashboardSetting,
  type IDashboardSetting,
} from '../tplot/DashboardSetting.mjs'
import {
  DateHelper,
  type DateTypeAcceptable,
} from '../primitives/date-helper.mjs'
import { type ICompany } from '../politagree/company.mjs'
import type { IdName } from './id-name.mjs'
import { deepCloneJson } from '../primitives/object-helper.mjs'

export const UserConfigNames: {
  charts: string
  dashboards: string
  headerTickerBars: string
  ideaCryptoTabSelected: string
  ideaTabSelected: string
  operations: string
  tickerInfo: string
  website: string
} = {
  charts: 'charts',
  dashboards: 'dashboards',
  headerTickerBars: 'headerTickerBars',
  ideaCryptoTabSelected: 'ideaCryptoTabSelected',
  ideaTabSelected: 'ideaTabSelected',
  operations: 'operations',
  tickerInfo: 'tickerInfo',
  website: 'website',
} as const

export type ConfigTickerInfoTabNames = 'asset' | 'people' | 'profile' | 'ratios'

export type ConfigTickerInfoTabSettings = {
  selectedPeopleTab: string
  selectedTab: ConfigTickerInfoTabNames
  // SelectedRatioTab: string
}
export function TickerInfoTabSettingsDefault(
  overrides?: Partial<ConfigTickerInfoTabSettings>
) {
  const tickerInfo: ConfigTickerInfoTabSettings = {
    selectedPeopleTab: '',
    selectedTab: 'asset',
    // SelectedRatioTab: 'ratio',
    ...overrides,
  }

  return tickerInfo
}

export type UserConfigTypes = {
  charts: IConfigCharts
  dashboards: IDashboardSetting
  headerTickerBars: IConfigHeaderTickerBars
  ideaCryptoTabSelected: IdName<number>
  ideaTabSelected: IdName<number>
  operations: IConfigOperations
  website: IConfigWebsite
}

export type UserConfigTypesAll = UserConfigTypes & {
  tickerInfo: ConfigTickerInfoTabSettings
}

export interface IUserInfo {
  companies: ICompany[]
  config: UserConfigTypes
  displayName: string
  email: string
  firstName: string
  lastDashboardAccessed: string
  lastName: string
  quoteEndpoint: string
  tokenExpireTime: number
}

export function userConfigDefaults(
  updated?: DateTypeAcceptable
): UserConfigTypesAll {
  const aDateNow = DateHelper.GetTime(updated),
    cfgIdeaCryptoTabSelected: IdName<number> = {
      id: 0,
      name: 'crypto',
    },
    cfgIdeaTabSelected: IdName<number> = {
      id: 0,
      name: 'most-active',
    },
    items = {
      [UserConfigNames.charts]: ConfigCharts.defaults(undefined, aDateNow),
      [UserConfigNames.dashboards]: DashboardSetting.defaults(
        undefined,
        aDateNow
      ),

      [UserConfigNames.headerTickerBars]: ConfigHeaderTickerBars.defaults(
        undefined,
        aDateNow
      ),
      [UserConfigNames.ideaTabSelected]: cfgIdeaTabSelected,
      [UserConfigNames.ideaCryptoTabSelected]: cfgIdeaCryptoTabSelected,
      [UserConfigNames.operations]: ConfigOperations.defaults(
        undefined,
        aDateNow
      ),
      [UserConfigNames.website]: ConfigWebsite.defaults(undefined, aDateNow),
      [UserConfigNames.tickerInfo]: TickerInfoTabSettingsDefault(),
    }

  return deepCloneJson(items) as UserConfigTypesAll
}

export class UserInfo implements IUserInfo {
  companies = []
  config = userConfigDefaults()
  displayName = ''
  email = ''
  firstName = ''
  lastDashboardAccessed = ''
  lastName = ''
  quoteEndpoint = ''
  tokenExpireTime = 0

  constructor(obj?: Partial<IUserInfo>) {
    if (obj) {
      Object.assign(this, obj)
    }
  }

  static CreateUserInfo(obj?: Partial<IUserInfo>) {
    return new UserInfo(obj)
  }

  static CreateIUserInfo(obj?: Partial<IUserInfo>) {
    return new UserInfo(obj).IUserInfo
  }

  get IUserInfo() {
    const iUserInfo: IUserInfo = {
      companies: this.companies,
      config: { ...this.config },
      displayName: this.displayName,
      email: this.email,
      firstName: this.firstName,
      lastDashboardAccessed: this.lastDashboardAccessed,
      lastName: this.lastName,
      quoteEndpoint: this.quoteEndpoint,
      tokenExpireTime: this.tokenExpireTime,
    }

    return iUserInfo
  }
}
