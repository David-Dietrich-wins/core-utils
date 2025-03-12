import { AppException, arrayFirst } from '../index.mjs'
import { ConfigTable, IConfigTable } from '../models/ConfigTable.mjs'
import { StringOrObjectId } from '../models/interfaces.mjs'
import {
  deepCloneJson,
  isArray,
  safeArray,
  safestr,
} from '../services/general.mjs'
import { IDashboardSetting } from './DashboardSetting.mjs'
import { TileType } from './TileConfig.mjs'
import { PermittedUserConfigs } from './tp-items.mjs'

export type PermittedConfigNames = keyof PermittedUserConfigs

export class ConfigManager {
  static readonly KEY_Dashboards = 'dashboards'

  constructor(public configs: IConfigTable<unknown>[]) {}

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
    return this.FindString('chartColorDown', '#ff0000')
  }
  get chartColorUp() {
    return this.FindString('chartColorUp', '#00ff00')
  }

  get dashboards() {
    const d = safeArray(
      this.configs.filter((cfg) => cfg.k === ConfigManager.KEY_Dashboards)
    )

    const dashboard =
      arrayFirst(d.map((cfg) => cfg.v as IDashboardSetting)) ??
      deepCloneJson(ConfigManager.allowedConfigs.dashboards)

    if (!dashboard) {
      throw new AppException('Could not retrieve dashboard.', 'dashboards')
    }

    return dashboard
  }

  get headerTickerBarIndex() {
    const found = this.configs.find(
      (config) => 'headerTickerBarIndex' === config.name
    )
    if (found) {
      return found.value as { showAsset: boolean; showCrypto: boolean }
    }

    return { showAsset: true, showCrypto: true }
  }
  get headerTickerBarUser() {
    const found = this.configs.find(
      (config) => 'headerTickerBarUser' === config.name
    )
    if (found) {
      return found.value as { tickers: string[] }
    }

    return { tickers: [] }
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
    const found = this.configs.find((config) => name === config.name)
    if (!found) {
      return ifNotExists ?? false
    }

    return found.value as boolean
  }
  FindString(name: PermittedConfigNames, ifNotExists?: string) {
    const found = this.configs.find((config) => name === config.name)
    if (found) {
      return found.value as string
    }

    return safestr(ifNotExists)
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
    userid: StringOrObjectId,
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
    userid: StringOrObjectId,
    name: PermittedConfigNames,
    updatedby?: string,
    updated?: Date,
    createdby?: string,
    created?: Date
  ) {
    const defval = ConfigManager.getDefaultValue(name)

    return new ConfigTable<typeof defval>(
      userid,
      name as string,
      defval,
      updatedby,
      updated,
      createdby,
      created
    )
  }

  static FindMissing(
    userid: StringOrObjectId,
    dataPage: IConfigTable<unknown>[]
  ) {
    const arrMissingConfigs: IConfigTable[] = []
    const arrUpdateConfigs: IConfigTable[] = []

    // Setup for the first time the default config settings.
    for (const configName of ConfigManager.permittedConfigNames) {
      const found = dataPage.find((dbConfig) => configName === dbConfig.k)
      if (!found) {
        const cfg = ConfigManager.getNewConfig(userid, configName)
        arrUpdateConfigs.push(cfg)
      } else if (
        ConfigManager.KEY_Dashboards === found.k &&
        !isArray((found as IConfigTable<IDashboardSetting>).v.screens, 1) &&
        !isArray(
          (found as IConfigTable<IDashboardSetting>).v.screens[0].tiles,
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
