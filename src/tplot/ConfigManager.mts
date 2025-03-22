import { AppException } from '../models/AppException.mjs'
import { IConfigShort } from '../models/config.mjs'
import { UserConfig, IUserConfig } from '../models/UserConfig.mjs'
import { IdName } from '../models/id-name.mjs'
import { IKeyValueShort } from '../models/key-val.mjs'
import { arrayFirst } from '../services/array-helper.mjs'
import {
  deepCloneJson,
  isArray,
  safeArray,
  safestr,
} from '../services/general.mjs'
import { DefaultWithOverrides } from '../services/object-helper.mjs'
import { IDashboardSetting } from './DashboardSetting.mjs'
import { TileType } from './TileConfig.mjs'

export type IdeasTabNames =
  | 'top-gainers'
  | 'most-active'
  | 'top-losers'
  | 'etfs'
  | 'spacs'
  | 'wsb'
export const IdeasSelectedType: IKeyValueShort<IdName<number, IdeasTabNames>> =
  {
    k: 'idea-tab-selected',
    v: { id: 0, name: 'most-active' },
  }

export type CryptoIdeasTabNames = 'crypto' | 'nft' | 'spac' | 'wsb'
export const CryptoIdeasSelectedType: IKeyValueShort<
  IdName<number, CryptoIdeasTabNames>
> = {
  k: 'idea-crypto-tab-selected',
  v: { id: 0, name: 'crypto' },
}

export type ConfigTickerInfoTabNames = 'asset' | 'people' | 'profile' | 'ratios'
export type ConfigTickerInfoTabSettings = {
  selectedTab: ConfigTickerInfoTabNames
  selectedPeopleTab: string
  // selectedRatioTab: string
}

export function CreateConfigTickerInfoTabSettings(
  overrides?: Partial<ConfigTickerInfoTabSettings>
) {
  const DEFAULT_TabSettings: ConfigTickerInfoTabSettings = {
    selectedTab: 'asset',
    selectedPeopleTab: '',
    // selectedRatioTab: 'ratio',
  }

  return DefaultWithOverrides(DEFAULT_TabSettings, overrides)
}

export type ConfigTickerInfo<
  Tticker extends string,
  U = `tickerInfo-${Tticker}`
> = IKeyValueShort<ConfigTickerInfoTabSettings, U>

export interface IHeaderTickersConfig {
  tickers: string[]
}
export interface IHeaderTickersIndexConfig {
  showAsset: boolean
  showCrypto: boolean
}

export type PermittedUserConfigs = {
  chartColorDown: string
  chartColorUp: string
  dashboards: IDashboardSetting
  headerTickerBarIndex: IHeaderTickersIndexConfig
  headerTickerBarUser: IHeaderTickersConfig
  hideTickerBar: boolean
  hideTooltips: boolean
  openFirstPlot: boolean
  showPriceChangeInTickerBar: boolean
  useMinusEight: boolean
  [IdeasSelectedType.k]: IdName<number, IdeasTabNames>
  [CryptoIdeasSelectedType.k]: IdName<number, CryptoIdeasTabNames>
}

export type PermittedConfigNames = keyof PermittedUserConfigs

export class ConfigManager {
  static readonly KEY_Dashboards = 'dashboards'

  constructor(public configs: IConfigShort[]) {}

  get allConfigs() {
    const config: PermittedUserConfigs = {
      chartColorUp: this.chartColorUp,
      chartColorDown: this.chartColorDown,
      dashboards: this.dashboards,
      headerTickerBarIndex: this.headerTickerBarIndex,
      headerTickerBarUser: this.headerTickerBarUser,
      hideTickerBar: this.hideTickerBar,
      hideTooltips: this.hideTooltips,
      openFirstPlot: this.openFirstPlot,
      showPriceChangeInTickerBar: this.showPriceChangeInTickerBar,
      useMinusEight: this.useMinusEight,
    }

    return config
  }
  get chartColorDown() {
    return this.FindString('chartColorDown', '#FF0000')
  }
  get chartColorUp() {
    return this.FindString('chartColorUp', '#00FF00')
  }

  get dashboards() {
    const d = safeArray(
      this.configs.filter((cfg) => cfg.k === ConfigManager.KEY_Dashboards)
    )

    const dashboard =
      arrayFirst(d.map((cfg) => cfg.v as unknown as IDashboardSetting)) ??
      deepCloneJson(ConfigManager.allowedConfigs.dashboards)

    if (!dashboard) {
      throw new AppException('Could not retrieve dashboard.', 'dashboards')
    }

    return dashboard
  }

  get headerTickerBarIndex() {
    const found = this.configs.find(
      (config) => 'headerTickerBarIndex' === config.k
    )
    if (found) {
      return found.v as IHeaderTickersIndexConfig
    }

    const ret: IHeaderTickersIndexConfig = { showAsset: true, showCrypto: true }
    return ret
  }
  get headerTickerBarUser() {
    const found = this.configs.find(
      (config) => 'headerTickerBarUser' === config.k
    )
    if (found) {
      return found.v as unknown as { tickers: string[] }
    }

    const ret: IHeaderTickersConfig = { tickers: [] }
    return ret
  }

  get hideTickerBar() {
    return this.FindBoolean('hideTickerBar', false)
  }
  get hideTooltips() {
    return this.FindBoolean('hideTooltips', false)
  }
  get openFirstPlot() {
    return this.FindBoolean('openFirstPlot', true)
  }
  get showPriceChangeInTickerBar() {
    return this.FindBoolean('showPriceChangeInTickerBar', false)
  }

  get useMinusEight() {
    return this.FindBoolean('useMinusEight', true)
  }

  FindBoolean(name: PermittedConfigNames, ifNotExists?: boolean) {
    const found = this.configs.find((config) => name === config.k)
    if (!found) {
      return ifNotExists ?? false
    }

    return found.v as boolean
  }
  FindString(name: PermittedConfigNames, ifNotExists?: string) {
    const found = this.configs.find((config) => name === config.k)
    if (found) {
      return found.v as unknown as string
    }

    return safestr(ifNotExists)
  }

  findScreen(screenName: string) {
    return this.dashboards.screens.find((screen) => screen.name === screenName)
  }

  static readonly allowedConfigs: PermittedUserConfigs = {
    useMinusEight: true,
    openFirstPlot: true,
    hideTickerBar: false,
    showPriceChangeInTickerBar: false,
    headerTickerBarIndex: { showAsset: true, showCrypto: true },
    headerTickerBarUser: { tickers: ['AAPL'] },
    hideTooltips: false,
    chartColorUp: '#00ff00',
    chartColorDown: '#ff0000',
    dashboards: {
      screens: [
        {
          id: 'default',
          name: 'default',
          tiles: [
            {
              id: 'initial-tile-left',
              cols: 1,
              name: 'Trade Plotter',
              rows: 2,
              color: 'white',
              index: 0,
              value: TileType.empty,
              typeid: 6,
            },
            {
              id: 'initial-tile-right',
              cols: 1,
              name: 'Trade Plotter',
              rows: 2,
              color: 'white',
              index: 0,
              value: TileType.empty,
              typeid: 7,
            },
          ],
        },
        // Example for a chart and a plotlist.
        // [
        //   {
        //     id: 'AAPL',
        //     index: 0,
        //     typeid: 3,
        //     cols: 1,
        //     rows: 2
        //   },
        //   {
        //     id: 'Trade Plotter',
        //     index: 2,
        //     typeid: 1,
        //     cols: 2,
        //     rows: 2
        //   }
        // ],
      ],
    },
  }

  static permittedConfigNames = Object.keys(
    ConfigManager.allowedConfigs
  ) as PermittedConfigNames[]

  static getDefaultValue(name: PermittedConfigNames) {
    return ConfigManager.allowedConfigs[name]
  }

  static getDefaultConfig(
    configName: PermittedConfigNames,
    userid: string,
    updatedby?: string,
    updated?: Date,
    createdby?: string,
    created?: Date
  ) {
    return ConfigManager.getNewConfig(
      userid,
      configName,
      updatedby,
      updated,
      createdby,
      created
    )
  }

  static getNewConfig(
    userid: string,
    name: PermittedConfigNames,
    updatedby?: string,
    updated?: Date,
    createdby?: string,
    created?: Date
  ) {
    const defval = ConfigManager.getDefaultValue(name)

    return new UserConfig<typeof defval>(
      userid,
      name as string,
      defval,
      updatedby,
      updated,
      createdby,
      created
    )
  }

  static FindMissing(userid: string, dataPage: IUserConfig<unknown>[]) {
    const arrMissingConfigs: IUserConfig[] = []
    const arrUpdateConfigs: IUserConfig[] = []

    // Setup for the first time the default config settings.
    for (const configName of ConfigManager.permittedConfigNames) {
      const found = dataPage.find((dbConfig) => configName === dbConfig.k)
      if (!found) {
        const cfg = ConfigManager.getNewConfig(userid, configName)
        arrUpdateConfigs.push(cfg)
      } else if (
        ConfigManager.KEY_Dashboards === found.k &&
        !isArray((found as IUserConfig<IDashboardSetting>).v.screens, 1) &&
        !isArray(
          (found as IUserConfig<IDashboardSetting>).v.screens[0].tiles,
          1
        )
      ) {
        // Not a valid dashboard config saved.
        // Overwrite what's in the db with the default.
        const cfg = ConfigManager.getNewConfig(userid, found.k)
        arrMissingConfigs.push(cfg)
      }
    }

    return [arrMissingConfigs, arrUpdateConfigs] as const
  }
}
