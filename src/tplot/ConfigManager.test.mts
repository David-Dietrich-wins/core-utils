import { AppException } from '../models/AppException.mjs'
import { IConfigShort } from '../models/config.mjs'
import {
  ConfigManager,
  CreateConfigTickerInfoTabSettings,
  TpConfigNamesEnum,
} from './ConfigManager.mjs'

test('CreateConfigTickerInfoTabSettings', () => {
  const settings = CreateConfigTickerInfoTabSettings({
    selectedTab: 'asset',
    selectedPeopleTab: 'top',
  })

  expect(settings).toEqual({
    ...ConfigManager.defaults[TpConfigNamesEnum.tickerInfo],
    selectedTab: 'asset',
    selectedPeopleTab: 'top',
  })
})

test('constructor', () => {
  const configCharts: IConfigShort = {
    k: 'charts',
    v: TpConfigNamesEnum.charts,
    userid: 'chart1',
    createdby: 'test',
    created: new Date(),
    updatedby: 'test',
    updated: new Date(),
  }

  const configDashboards: IConfigShort = {
    k: 'dashboards',
    v: TpConfigNamesEnum.dashboards,
    userid: 'dashboard1',
    createdby: 'test',
    created: new Date(),
    updatedby: 'test',
    updated: new Date(),
  }

  const configs: IConfigShort[] = [configCharts, configDashboards]

  const configManager = new ConfigManager(configs)

  expect(configManager.allTpUserInfoConfigs).toEqual({
    charts: 'charts',
    dashboards: {},
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
      updated: 1764590400000,
      useMinusEight: {
        id: expect.any(String),
        updated: 1764590400000,
        value: true,
      },
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

test('ValidateConfigName', () => {
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
    new AppException('Invalid config name', 'ConfigManager.ValidateConfigName')
  )
  expect(() =>
    ConfigManager.ValidateConfigName('tickerInfo-12345678901')
  ).toThrow(
    new AppException('Invalid config name', 'ConfigManager.ValidateConfigName')
  )

  expect(ConfigManager.ValidateConfigName('tickerInfo-AAPL')).toBe(
    'tickerInfo-AAPL'
  )
})

test('FindConfig', () => {
  const configCharts: IConfigShort = {
    k: 'charts',
    v: TpConfigNamesEnum.charts,
    userid: 'chart1',
    createdby: 'test',
    created: new Date(),
    updatedby: 'test',
    updated: new Date(),
  }

  const configManager = new ConfigManager([configCharts])

  expect(configManager.FindConfig(TpConfigNamesEnum.charts)).toBe(
    TpConfigNamesEnum.charts
  )
  expect(
    configManager.FindConfig('nonExistentConfig' as TpConfigNamesEnum)
  ).toBeUndefined()
})

test('FindBoolean', () => {
  const configManager = new ConfigManager([])

  expect(configManager.FindBoolean(TpConfigNamesEnum.charts)).toStrictEqual({
    down: { color: '#FF0000' },
    id: expect.any(String),
    neutral: { color: '#000000' },
    up: { color: '#00FF00' },
    updated: 1764590400000,
  })
})

test('FindString', () => {
  const configManager = new ConfigManager([])

  expect(configManager.FindString(TpConfigNamesEnum.charts)).toStrictEqual({
    down: { color: '#FF0000' },
    id: expect.any(String),
    neutral: { color: '#000000' },
    up: { color: '#00FF00' },
    updated: 1764590400000,
  })
})

test('findScreen', () => {
  const configManager = new ConfigManager([])

  expect(configManager.findScreen('nonExistentScreen')).toBeUndefined()
})

test('dashboards', () => {
  let configManager = new ConfigManager([])

  expect(configManager.dashboards).toStrictEqual({
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
  })

  const configDashboards: IConfigShort = {
    k: 'dashboards',
    v: null,
    userid: 'dashboard1',
    createdby: 'test',
    created: new Date(),
    updatedby: 'test',
    updated: new Date(),
  }

  configManager = new ConfigManager([configDashboards])

  expect(configManager.dashboards).toStrictEqual({})
})
