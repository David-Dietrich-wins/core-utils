import {
  ConfigManager,
  createConfigTickerInfoTabSettings,
} from './ConfigManager.mjs'
import { UserConfigNames, userConfigDefaults } from '../models/UserInfo.mjs'
import { describe, expect, it } from '@jest/globals'
import { AppException } from '../models/AppException.mjs'
import { type IConfigShort } from '../models/config.mjs'

describe('createConfigTickerInfoTabSettings', () => {
  it('should create default settings', () => {
    expect.hasAssertions()

    const settings = createConfigTickerInfoTabSettings({
      selectedPeopleTab: 'top',
      selectedTab: 'asset',
    })

    expect(settings).toStrictEqual({
      ...userConfigDefaults().tickerInfo,
      selectedPeopleTab: 'top',
      selectedTab: 'asset',
    })
  })
})

describe('constructor', () => {
  it('should create a new instance', () => {
    expect.hasAssertions()

    const configCharts: IConfigShort = {
        created: new Date(),
        createdby: 'test',
        k: 'charts',
        updated: new Date(),
        updatedby: 'test',
        userid: 'chart1',
        v: UserConfigNames.charts,
      },
      configDashboards: IConfigShort = {
        created: new Date(),
        createdby: 'test',
        k: 'dashboards',
        updated: new Date(),
        updatedby: 'test',
        userid: 'dashboard1',
        v: UserConfigNames.dashboards,
      },
      configIes: IConfigShort[] = [configCharts, configDashboards],
      configManager = new ConfigManager(configIes)

    expect(configManager.allTpUserInfoConfigs).toStrictEqual({
      charts: 'charts',
      dashboards: ['dashboards'],
      headerTickerBars: {
        asset: {
          id: expect.any(String),
          tickers: ['AAPL'],
          updated: 1764590400000,
        },
        crypto: {
          id: expect.any(String),
          tickers: ['BTCUSD', 'ETHUSD'],
          updated: 1764590400000,
        },
        id: expect.any(String),
        updated: 1764590400000,
      },
      ideaCryptoTabSelected: { id: 0, name: 'crypto' },
      ideaTabSelected: { id: 0, name: 'most-active' },
      operations: {
        id: expect.any(String),
        minusEightPlus10: {
          id: expect.any(String),
          updated: 1764590400000,
          value: true,
        },
        updated: 1764590400000,
      },
      website: {
        hideHelp: {
          id: expect.any(String),
          updated: 1764590400000,
          value: false,
        },
        hideTooltips: {
          id: expect.any(String),
          updated: 1764590400000,
          value: false,
        },
        id: expect.any(String),
        openFirstPlot: {
          id: expect.any(String),
          updated: 1764590400000,
          value: true,
        },
        updated: 1764590400000,
      },
    })
  })
})

describe('validateConfigName', () => {
  it('should validate config names', () => {
    expect.hasAssertions()

    expect(() => ConfigManager.ValidateConfigName('charts')).not.toThrow()
    expect(() => ConfigManager.ValidateConfigName('dashboards')).not.toThrow()
    expect(() =>
      ConfigManager.ValidateConfigName('headerTickerBars')
    ).not.toThrow()
    expect(() =>
      ConfigManager.ValidateConfigName('ideaTabSelected')
    ).not.toThrow()
    expect(() =>
      ConfigManager.ValidateConfigName('ideaCryptoTabSelected')
    ).not.toThrow()
    expect(() => ConfigManager.ValidateConfigName('operations')).not.toThrow()
    expect(() => ConfigManager.ValidateConfigName('website')).not.toThrow()
    expect(() => ConfigManager.ValidateConfigName('tickerInfo')).not.toThrow()

    expect(() => ConfigManager.ValidateConfigName('invalidConfig')).toThrow(
      'Invalid config name'
    )
    expect(() => ConfigManager.ValidateConfigName('')).toThrow(
      new AppException('Config name is required.', 'ConfigManager')
    )
    expect(() => ConfigManager.ValidateConfigName(null)).toThrow(
      new AppException('Config name is required.', 'ConfigManager')
    )
    expect(() => ConfigManager.ValidateConfigName(undefined)).toThrow(
      new AppException('Config name is required.', 'ConfigManager')
    )
    expect(() =>
      ConfigManager.ValidateConfigName(
        '012345678901234567890123456789012345678901234567895'
      )
    ).toThrow(new AppException('Config name is required.', 'ConfigManager'))

    expect(() => ConfigManager.ValidateConfigName('tickerInfo-')).toThrow(
      new AppException(
        'Invalid config name',
        'ConfigManager.ValidateConfigName'
      )
    )
    expect(() =>
      ConfigManager.ValidateConfigName('tickerInfo-12345678901')
    ).toThrow(
      new AppException(
        'Invalid config name',
        'ConfigManager.ValidateConfigName'
      )
    )

    expect(ConfigManager.ValidateConfigName('tickerInfo-AAPL')).toBe(
      'tickerInfo-AAPL'
    )
  })
})

describe('findConfig', () => {
  it('good', () => {
    expect.hasAssertions()

    const configCharts: IConfigShort = {
        created: new Date(),
        createdby: 'test',
        k: 'charts',
        updated: new Date(),
        updatedby: 'test',
        userid: 'chart1',
        v: UserConfigNames.charts,
      },
      configManager = new ConfigManager([configCharts])

    expect(configManager.FindConfig(UserConfigNames.charts)).toBe(
      UserConfigNames.charts
    )
    expect(
      configManager.FindConfig(
        'nonExistentConfig' as keyof typeof UserConfigNames
      )
    ).toBeUndefined()
  })

  it('findBoolean', () => {
    expect.hasAssertions()

    const configManager = new ConfigManager([])

    expect(
      configManager.FindBoolean(
        UserConfigNames.charts as keyof typeof UserConfigNames
      )
    ).toStrictEqual({
      down: { color: '#FF0000' },
      id: expect.any(String),
      neutral: { color: '#000000' },
      up: { color: '#00FF00' },
      updated: 1764590400000,
    })
  })

  it('findString', () => {
    expect.hasAssertions()

    const configManager = new ConfigManager([])

    expect(
      configManager.FindString(
        UserConfigNames.charts as keyof typeof UserConfigNames
      )
    ).toStrictEqual({
      down: { color: '#FF0000' },
      id: expect.any(String),
      neutral: { color: '#000000' },
      up: { color: '#00FF00' },
      updated: 1764590400000,
    })
  })

  it('findScreen', () => {
    expect.hasAssertions()

    const configManager = new ConfigManager([])

    expect(configManager.findScreen('nonExistentScreen')).toBeUndefined()
  })
})

describe('dashboards', () => {
  it('initial state', () => {
    expect.hasAssertions()

    let configManager = new ConfigManager([])

    expect(configManager.dashboards).toStrictEqual({
      id: expect.any(String),
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
              type: 'empty',
              value: {},
            },
            {
              color: 'white',
              cols: 1,
              id: 'initial-tile-right',
              index: 0,
              name: 'Trade Plotter',
              rows: 2,
              type: 'empty',
              value: {},
            },
          ],
        },
      ],
      updated: expect.any(Number),
    })

    // const configDashboards: IConfigShort = {
    //   created: new Date(),
    //   createdby: 'test',
    //   k: 'dashboards',
    //   updated: new Date(),
    //   updatedby: 'test',
    //   userid: 'dashboard1',
    //   v: null,
    // }

    configManager = new ConfigManager([])

    expect(configManager.dashboards).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
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
                type: 'empty',
                value: {},
              },
              {
                color: 'white',
                cols: 1,
                id: 'initial-tile-right',
                index: 0,
                name: 'Trade Plotter',
                rows: 2,
                type: 'empty',
                value: {},
              },
            ],
          },
        ],
        updated: expect.any(Number),
      })
    )
  })
})
