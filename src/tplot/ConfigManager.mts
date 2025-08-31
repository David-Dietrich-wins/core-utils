import {
  type ConfigTickerInfoTabSettings,
  TickerInfoTabSettingsDefault,
  UserConfigDefaults,
  UserConfigNames,
  UserConfigTypes,
} from '../models/UserInfo.mjs'
import { deepCloneJson, hasData } from '../primitives/object-helper.mjs'
import { AppException } from '../models/AppException.mjs'
import type { IConfigCharts } from './ConfigCharts.mjs'
import type { IConfigHeaderTickerBars } from './ConfigHeaderTickerBars.mjs'
import type { IConfigOperations } from './ConfigOperations.mjs'
import { IConfigShort } from '../models/config.mjs'
import type { IConfigWebsite } from './ConfigWebsite.mjs'
import { IDashboardSetting } from './DashboardSetting.mjs'
import { IIdValRequired } from '../models/id-val.mjs'
import { IKeyValueShort } from '../models/key-val.mjs'
import { IdName } from '../models/id-name.mjs'
import { safestrTrim } from '../primitives/string-helper.mjs'

export type CryptoIdeasTabNames = 'crypto' | 'nft' | 'spac'
export type IdeasTabNames =
  | 'top-gainers'
  | 'most-active'
  | 'top-losers'
  | 'etfs'
  | 'spacs'
  | 'wsb'

export type FuncTabSettingsGet = (
  params: IIdValRequired<string, ConfigTickerInfoTabSettings>
) => Promise<IIdValRequired<string, ConfigTickerInfoTabSettings>>
export type FuncTabSettingsTickerInfoGetOrSet = (params: {
  id: string
  settings?: ConfigTickerInfoTabSettings
}) => Promise<IIdValRequired<string, ConfigTickerInfoTabSettings>>
export type FuncTabSettingsTickerInfoUpsert = (
  params: IIdValRequired<string, Partial<ConfigTickerInfoTabSettings>>
) => Promise<IIdValRequired<string, ConfigTickerInfoTabSettings>>

export type FuncDashboardPeopleTabGet = (
  params: IIdValRequired
) => Promise<IIdValRequired<string, ConfigTickerInfoTabSettings>>
export type FuncDashboardPeopleTabSave = (
  params: IIdValRequired
) => Promise<IIdValRequired<string, ConfigTickerInfoTabSettings>>

export type ConfigTickerInfo<
  Tticker extends string,
  U = `tickerInfo-${Tticker}`
> = IKeyValueShort<ConfigTickerInfoTabSettings, U>

export class ConfigManager {
  configs: IConfigShort[] = []

  constructor(configs: IConfigShort[]) {
    this.configs = configs
  }

  static ValidateConfigName(name: string | null | undefined): string {
    if (!name || !hasData(name) || name.length > 50) {
      throw new AppException('Config name is required.', 'ConfigManager')
    }

    const nameStr = safestrTrim(name)
    if (
      Object.values(UserConfigNames).includes(
        nameStr as keyof typeof UserConfigNames
      )
    ) {
      return nameStr
    }

    if (nameStr.startsWith('tickerInfo-')) {
      const ticker = nameStr.substring('tickerInfo-'.length)
      if (ticker.length > 0 && ticker.length < 10) {
        return nameStr
      }
    }

    throw new AppException(
      'Invalid config name',
      'ConfigManager.ValidateConfigName'
    )
  }

  get allTpUserInfoConfigs() {
    const config: UserConfigTypes = {
      charts: this.charts,
      dashboards: this.dashboards,
      headerTickerBars: this.headerTickerBars,
      ideaCryptoTabSelected: this.ideaCryptoTabSelected,
      ideaTabSelected: this.ideaTabSelected,
      operations: this.operations,
      website: this.website,
    }

    return config
  }

  get charts() {
    return this.FindConfig<IConfigCharts>(UserConfigNames.charts)
  }

  get dashboards() {
    const dashboard = this.FindConfig<IDashboardSetting>(
      UserConfigNames.dashboards
    )

    return deepCloneJson(dashboard)
  }

  get headerTickerBars() {
    return this.FindConfig<IConfigHeaderTickerBars>(
      UserConfigNames.headerTickerBars
    )
  }

  get ideaTabSelected() {
    return this.FindConfig<IdName<number>>(UserConfigNames.ideaTabSelected)
  }
  get ideaCryptoTabSelected() {
    return this.FindConfig<IdName<number>>(
      UserConfigNames.ideaCryptoTabSelected
    )
  }

  get operations() {
    return this.FindConfig<IConfigOperations>(UserConfigNames.operations)
  }

  get website() {
    return this.FindConfig<IConfigWebsite>(UserConfigNames.website)
  }

  /**
   * Searches all configs for the specified name and returns the value.
   * If the config is not found, it returns the default value for that config.
   * @param name - The name of the config to find.
   * @returns The config if found, otherwise the default value for that config.
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  FindConfig<T = string>(name: string) {
    const found = this.configs.find((config) => name === config.k)
    if (found) {
      return found.v as T
    }

    return UserConfigDefaults()[name] as T
  }

  FindBoolean(name: keyof typeof UserConfigNames) {
    return this.FindConfig<boolean>(name)
  }
  FindString(name: keyof typeof UserConfigNames) {
    return this.FindConfig(name)
  }

  findScreen(screenName: string) {
    return this.dashboards.screens.find((screen) => screen.name === screenName)
  }
}

export function CreateConfigTickerInfoTabSettings(
  overrides?: Partial<ConfigTickerInfoTabSettings>
) {
  const ret: ConfigTickerInfoTabSettings = {
    ...TickerInfoTabSettingsDefault(),
    ...overrides,
  }

  return ret
}
