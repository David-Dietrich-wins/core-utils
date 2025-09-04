import {
  type ITileConfig,
  type TileConfigChart,
  type TileConfigTicker,
  TileTypeKeys,
} from './TileConfig.mjs'
import { describe, expect, it } from '@jest/globals'
import { DashboardScreenSetting } from './DashboardScreenSetting.mjs'

describe('constructor', () => {
  it('should create an instance with default values', () => {
    expect.assertions(3)

    const dss = new DashboardScreenSetting('name', [])

    expect(dss.id).toBe('')
    expect(dss.name).toBe('name')
    expect(dss.tiles).toStrictEqual([])
  })

  it('default constructor', () => {
    expect.assertions(3)

    const dss = new DashboardScreenSetting()

    expect(dss.id).toBe('')
    expect(dss.name).toBe('')
    expect(dss.tiles).toStrictEqual([])
  })
})

describe('create', () => {
  it('should create a new instance with the given values', () => {
    expect.assertions(3)

    const dss = DashboardScreenSetting.Create({
      name: 'Test',
      tiles: [],
    })

    expect(dss.id).toBe('')
    expect(dss.name).toBe('Test')
    expect(dss.tiles).toStrictEqual([])
  })

  it('createISetting', () => {
    expect.assertions(3)

    const dss = DashboardScreenSetting.createISetting({
      name: 'Test',
      tiles: [],
    })

    expect(dss.id).toBe('')
    expect(dss.name).toBe('Test')
    expect(dss.tiles).toStrictEqual([])
  })

  it('createNew', () => {
    expect.hasAssertions()

    const mydss = DashboardScreenSetting.createNew('Test', [])

    expect(mydss.id).toBe('')
    expect(mydss.name).toBe('Test')
    expect(mydss.tiles).toStrictEqual([
      expect.objectContaining({
        cols: 1,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 1,
        type: TileTypeKeys.ticker,
        value: {
          ticker: 'AAPL',
        },
      }),
    ])
  })

  it('createNew with tiles', () => {
    expect.hasAssertions()

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
      mydss = DashboardScreenSetting.createNew('Test', [
        iTileConfig,
        iTileConfig2,
      ])

    expect(mydss.id).toBe('')
    expect(mydss.name).toBe('Test')
    expect(mydss.tiles).toStrictEqual([iTileConfig, iTileConfig2])
  })
})
