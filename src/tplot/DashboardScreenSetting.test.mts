import {
  type ITileConfig,
  type TileConfigChart,
  type TileConfigTicker,
  TileTypeKeys,
} from './TileConfig.mjs'
import { DashboardScreenSetting } from './DashboardScreenSetting.mjs'

test('constructor', () => {
  const dss = new DashboardScreenSetting('name', [])

  expect(dss.id).toBe('')
  expect(dss.name).toBe('name')
  expect(dss.tiles).toEqual([])
})

test('default constructor', () => {
  const dss = new DashboardScreenSetting()

  expect(dss.id).toBe('')
  expect(dss.name).toBe('')
  expect(dss.tiles).toEqual([])
})

test('Create', () => {
  const dss = DashboardScreenSetting.Create({
    name: 'Test',
    tiles: [],
  })

  expect(dss.id).toBe('')
  expect(dss.name).toBe('Test')
  expect(dss.tiles).toEqual([])
})
test('CreateISetting', () => {
  const dss = DashboardScreenSetting.CreateISetting({
    name: 'Test',
    tiles: [],
  })

  expect(dss.id).toBe('')
  expect(dss.name).toBe('Test')
  expect(dss.tiles).toEqual([])
})

test('CreateNew', () => {
  const iTileConfig: ITileConfig<TileConfigTicker> = {
      cols: 1,
      id: expect.any(String),
      index: 0,
      name: 'Trade Plotter',
      rows: 1,
      type: TileTypeKeys.ticker,
      value: {
        ticker: 'AAPL',
      },
    },
    mydss = DashboardScreenSetting.CreateNew('Test', [])

  expect(mydss.id).toBe('')
  expect(mydss.name).toBe('Test')
  expect(mydss.tiles).toEqual([iTileConfig])
})
test('CreateNew with tiles', () => {
  const iTileConfig: ITileConfig<TileConfigTicker> = {
      cols: 1,
      id: '1',
      index: 0,
      name: 'Tile 1',
      rows: 1,
      type: TileTypeKeys.ticker,
      value: {
        ticker: 'AAPL',
      },
    },
    iTileConfig2: ITileConfig<TileConfigChart> = {
      cols: 3,
      id: '2',
      index: 1,
      name: 'Tile 2',
      rows: 2,
      type: TileTypeKeys.chart,
      value: {
        endDate: 987654321,
        extendedHoursTrading: false,
        frequency: 3,
        frequencyType: 'd',
        granularity: '1d',
        period: 1,
        periodType: 'd',
        startDate: 123456789,
        ticker: 'GOOGL',
      },
    },
    mydss = DashboardScreenSetting.CreateNew('Test', [
      iTileConfig,
      iTileConfig2,
    ])

  expect(mydss.id).toBe('')
  expect(mydss.name).toBe('Test')
  expect(mydss.tiles).toEqual([iTileConfig, iTileConfig2])
})
