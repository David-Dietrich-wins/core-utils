import { DashboardScreenSetting } from './DashboardScreenSetting.mjs'
import {
  ITileConfig,
  TileConfigChart,
  TileConfigTicker,
  TileType,
} from './TileConfig.mjs'

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
    id: expect.any(String), // id will be generated
    cols: 1,
    rows: 1,
    name: 'Trade Plotter',
    index: 0,
    type: TileType.ticker,
    value: {
      ticker: 'AAPL',
    },
  }
  const dss = DashboardScreenSetting.CreateNew('Test', [])

  expect(dss.id).toBe('')
  expect(dss.name).toBe('Test')
  expect(dss.tiles).toEqual([iTileConfig])
})
test('CreateNew with tiles', () => {
  const iTileConfig: ITileConfig<TileConfigTicker> = {
    id: '1',
    cols: 1,
    rows: 1,
    name: 'Tile 1',
    index: 0,
    type: TileType.ticker,
    value: {
      ticker: 'AAPL',
    },
  }
  const iTileConfig2: ITileConfig<TileConfigChart> = {
    id: '2',
    cols: 3,
    rows: 2,
    name: 'Tile 2',
    index: 1,
    type: TileType.chart,
    value: {
      ticker: 'GOOGL',
      period: 1,
      periodType: 'd',
      frequency: 3,
      frequencyType: 'd',
      granularity: '1d',
      extendedHoursTrading: false,
      startDate: 123456789,
      endDate: 987654321,
    },
  }

  const dss = DashboardScreenSetting.CreateNew('Test', [
    iTileConfig,
    iTileConfig2,
  ])

  expect(dss.id).toBe('')
  expect(dss.name).toBe('Test')
  expect(dss.tiles).toEqual([iTileConfig, iTileConfig2])
})
