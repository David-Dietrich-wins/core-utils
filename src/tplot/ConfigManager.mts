import { AppException } from '../models/AppException.mjs'
import { IConfigShort } from '../models/config.mjs'
import { newGuid } from '../services/general.mjs'
import {
  IContext,
  IContextUI,
  IContextValue,
} from '../services/ContextManager.mjs'
import { IdName } from '../models/id-name.mjs'
import { IKeyValueShort } from '../models/key-val.mjs'
import {
  deepCloneJson,
  DefaultWithOverrides,
} from '../services/object-helper.mjs'
import { IDashboardSetting } from './DashboardSetting.mjs'
import { TileType } from './TileConfig.mjs'

export type CryptoIdeasTabNames = 'crypto' | 'nft' | 'spac'
export type ConfigTickerInfoTabNames = 'asset' | 'people' | 'profile' | 'ratios'
export type IdeasTabNames =
  | 'top-gainers'
  | 'most-active'
  | 'top-losers'
  | 'etfs'
  | 'spacs'
  | 'wsb'

export type ConfigTickerInfoTabSettings = {
  selectedTab: ConfigTickerInfoTabNames
  selectedPeopleTab: string
  // selectedRatioTab: string
}

export interface IContextTickers extends IContext {
  backgroundColor?: IContextUI
  scrollSpeed?: number
  showPercentChanges?: boolean
  showPriceChanges?: boolean
  tickers: string[]
}

export interface IConfigTickerBars extends IContext {
  asset: IContextTickers
  crypto: IContextTickers
}

export interface IConfigCharts extends IContext {
  down: IContextUI
  neutral: IContextUI
  up: IContextUI
}

export function CreateConfigTickerInfoTabSettings(
  overrides?: Partial<ConfigTickerInfoTabSettings>
) {
  return DefaultWithOverrides(
    ConfigManager.defaults[TpConfigNamesEnum.tickerInfo],
    overrides
  )
}

export interface IConfigOperations extends IContext {
  useMinusEight: IContextValue<boolean>
}

export interface IConfigWebsite extends IContext {
  openFirstPlot: IContextValue<boolean>
  hideTooltips: IContextValue<boolean>
}

export type ConfigTickerInfo<
  Tticker extends string,
  U = `tickerInfo-${Tticker}`
> = IKeyValueShort<ConfigTickerInfoTabSettings, U>

export enum TpConfigNamesEnum {
  charts = 'charts',
  dashboards = 'dashboards',
  headerTickerBars = 'headerTickerBars',
  ideaTabSelected = 'ideaTabSelected',
  ideaCryptoTabSelected = 'ideaCryptoTabSelected',
  website = 'website',
  operations = 'operations',
  tickerInfo = 'tickerInfo',
}

export type TpUserInfoConfigs = {
  [TpConfigNamesEnum.charts]: IConfigCharts
  [TpConfigNamesEnum.dashboards]: IDashboardSetting
  [TpConfigNamesEnum.headerTickerBars]: IConfigTickerBars
  [TpConfigNamesEnum.ideaCryptoTabSelected]: IdName<number, CryptoIdeasTabNames>
  [TpConfigNamesEnum.ideaTabSelected]: IdName<number, IdeasTabNames>
  [TpConfigNamesEnum.operations]: IConfigOperations
  [TpConfigNamesEnum.website]: IConfigWebsite
}
export type TpUserInfoAllConfigs = TpUserInfoConfigs & {
  [TpConfigNamesEnum.tickerInfo]: ConfigTickerInfoTabSettings
}

export class ConfigManager {
  constructor(public configs: IConfigShort[]) {}

  static get defaults(): Readonly<TpUserInfoAllConfigs> {
    const cfgCharts: IConfigCharts = {
      id: newGuid(),
      updated: Date.now(),
      down: { color: '#FF0000' },
      neutral: { color: '#000000' },
      up: { color: '#00FF00' },
    }
    const cfgDashboards: IDashboardSetting = {
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
              type: TileType.empty,
              value: {},
            },
            {
              id: 'initial-tile-right',
              cols: 1,
              name: 'Trade Plotter',
              rows: 2,
              color: 'white',
              index: 0,
              type: TileType.empty,
              value: {},
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
    }
    const cfgHeaderTickerBars: IConfigTickerBars = {
      id: newGuid(),
      updated: Date.now(),
      asset: { id: newGuid(), updated: Date.now(), tickers: ['AAPL'] },
      crypto: {
        id: newGuid(),
        updated: Date.now(),
        tickers: ['BTCUSD', 'ETHUSD'],
      },
    }
    const cfgOperations: IConfigOperations = {
      id: newGuid(),
      updated: Date.now(),
      useMinusEight: { id: newGuid(), updated: Date.now(), value: true },
    }
    const cfgWebsite: IConfigWebsite = {
      id: newGuid(),
      updated: Date.now(),
      openFirstPlot: { id: newGuid(), updated: Date.now(), value: true },
      hideTooltips: { id: newGuid(), updated: Date.now(), value: false },
    }
    const cfgIdeaTabSelected: IdName<number, IdeasTabNames> = {
      id: 0,
      name: 'most-active',
    }
    const cfgIdeaCryptoTabSelected: IdName<number, CryptoIdeasTabNames> = {
      id: 0,
      name: 'crypto',
    }
    const cfgTickerInfo: ConfigTickerInfoTabSettings = {
      selectedTab: 'asset',
      selectedPeopleTab: '',
      // selectedRatioTab: 'ratio',
    }

    const items: Readonly<TpUserInfoAllConfigs> = {
      [TpConfigNamesEnum.charts]: cfgCharts,
      [TpConfigNamesEnum.dashboards]: cfgDashboards,

      [TpConfigNamesEnum.headerTickerBars]: cfgHeaderTickerBars,
      [TpConfigNamesEnum.ideaTabSelected]: cfgIdeaTabSelected,
      [TpConfigNamesEnum.ideaCryptoTabSelected]: cfgIdeaCryptoTabSelected,
      [TpConfigNamesEnum.operations]: cfgOperations,
      [TpConfigNamesEnum.website]: cfgWebsite,
      [TpConfigNamesEnum.tickerInfo]: cfgTickerInfo,
    }

    return items
  }

  get allTpUserInfoConfigs() {
    const config: TpUserInfoConfigs = {
      charts: this.charts,
      dashboards: this.dashboards,
      headerTickerBars: this.headerTickerBars,
      ideaTabSelected: this.ideaTabSelected,
      ideaCryptoTabSelected: this.ideaCryptoTabSelected,
      operations: this.operations,
      website: this.website,
    }

    return config
  }
  get charts() {
    return this.FindConfig<IConfigCharts>(TpConfigNamesEnum.charts)
  }

  get dashboards() {
    const dashboard = this.FindConfig<IDashboardSetting>(
      TpConfigNamesEnum.dashboards
    )

    const clone = deepCloneJson(dashboard)
    if (!clone) {
      throw new AppException(
        'Unable to clone the dashboard config.',
        'ConfigManager.dashboards'
      )
    }

    return clone
  }

  get headerTickerBars() {
    return this.FindConfig<IConfigTickerBars>(
      TpConfigNamesEnum.headerTickerBars
    )
  }

  get ideaTabSelected() {
    return this.FindConfig<IdName<number, IdeasTabNames>>(
      TpConfigNamesEnum.ideaTabSelected
    )
  }
  get ideaCryptoTabSelected() {
    return this.FindConfig<IdName<number, CryptoIdeasTabNames>>(
      TpConfigNamesEnum.ideaCryptoTabSelected
    )
  }

  get operations() {
    return this.FindConfig<IConfigOperations>(TpConfigNamesEnum.operations)
  }

  get website() {
    return this.FindConfig<IConfigWebsite>(TpConfigNamesEnum.website)
  }

  /**
   * Searches all configs for the specified name and returns the value.
   * If the config is not found, it returns the default value for that config.
   * @param name - The name of the config to find.
   * @returns The config if found, otherwise the default value for that config.
   */
  FindConfig<T = string>(name: TpConfigNamesEnum) {
    const found = this.configs.find((config) => name === config.k)
    if (found) {
      return found.v as T
    }

    return ConfigManager.defaults[name] as T
  }

  FindBoolean(name: TpConfigNamesEnum) {
    return this.FindConfig<boolean>(name)
  }
  FindString(name: TpConfigNamesEnum) {
    return this.FindConfig<string>(name)
  }

  findScreen(screenName: string) {
    return this.dashboards.screens.find((screen) => screen.name === screenName)
  }
}
