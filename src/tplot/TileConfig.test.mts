import {
  type ITileConfig,
  TileConfig,
  type TileType,
  TileTypeKeys,
} from './TileConfig.mjs'
import { describe, expect, it } from '@jest/globals'
import { AppException } from '../models/AppException.mjs'

describe('create methods', () => {
  it('create TileConfig', () => {
    expect.hasAssertions()

    const tileConfig = TileConfig.createTileConfig({
      cols: 6,
      id: 'test-id',
      rows: 4,
      type: TileTypeKeys.content,
      value: {
        content: 'This is a test tile content.',
        title: 'Test Tile',
      },
      x: 0,
      y: 0,
    })

    expect(tileConfig).toStrictEqual(
      expect.objectContaining({
        cols: 6,
        id: 'test-id',
        index: 0,
        name: 'Trade Plotter',
        rows: 4,
        type: TileTypeKeys.content,
        value: {
          content: 'This is a test tile content.',
          title: 'Test Tile',
        },
      })
    )
  })

  it('chartDefault', () => {
    expect.hasAssertions()

    const chartConfig = TileConfig.ChartDefault({ ticker: 'AAPL' })

    expect(chartConfig).toStrictEqual({
      frequency: 1,
      frequencyType: 'daily',
      period: 1,
      periodType: 'year',
      ticker: 'AAPL',
    })
  })

  it('createChart', () => {
    expect.hasAssertions()

    const aticker = 'AAPL',
      chartTile = TileConfig.createChart(aticker, {
        cols: 4,
        rows: 3,
      })

    expect(chartTile).toStrictEqual(
      expect.objectContaining({
        cols: 4,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 3,
        type: TileTypeKeys.chart,
        value: {
          frequency: 1,
          frequencyType: 'daily',
          period: 1,
          periodType: 'year',
          ticker: aticker,
        },
      })
    )
  })

  it('creates', () => {
    expect.hasAssertions()

    expect(
      TileConfig.createContent({
        cols: 3,
        rows: 2,
      })
    ).toStrictEqual(
      expect.objectContaining({
        cols: 3,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 2,
        type: TileTypeKeys.content,
        value: {},
      })
    )

    expect(TileConfig.createEmpty()).toStrictEqual(
      expect.objectContaining({
        cols: 1,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 1,
        type: TileTypeKeys.empty,
        value: {},
      })
    )

    expect(TileConfig.createNews()).toStrictEqual(
      expect.objectContaining({
        cols: 1,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 1,
        type: TileTypeKeys.news,
        value: {},
      })
    )

    expect(TileConfig.createTicker('AAPL')).toStrictEqual(
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
      })
    )

    expect(TileConfig.createPlotlist()).toStrictEqual(
      expect.objectContaining({
        cols: 12,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 1,
        type: TileTypeKeys.plotlist,
        value: {},
      })
    )

    expect(TileConfig.createTable()).toStrictEqual(
      expect.objectContaining({
        cols: 1,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 1,
        type: TileTypeKeys.table,
        value: {},
      })
    )
  })

  it('createFromTileType', () => {
    expect.hasAssertions()

    expect(
      TileConfig.createFromTileType(TileTypeKeys.content, {
        cols: 3,
        rows: 2,
      })
    ).toStrictEqual(
      expect.objectContaining({
        cols: 3,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 2,
        type: TileTypeKeys.content,
        value: {},
      })
    )

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const chartTile = TileConfig.createFromTileType(TileTypeKeys.chart, {
      cols: 4,
      rows: 3,
      ticker: 'AAPL',
    } as TileConfig['value'])

    expect(chartTile).toStrictEqual(
      expect.objectContaining({
        cols: 4,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 3,
        type: TileTypeKeys.chart,
        value: {
          frequency: 1,
          frequencyType: 'daily',
          period: 1,
          periodType: 'year',
          ticker: 'AAPL',
        },
      })
    )
    expect(
      TileConfig.createFromTileType(TileTypeKeys.content, {
        cols: 3,
        rows: 2,
      })
    ).toStrictEqual(
      expect.objectContaining({
        cols: 3,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 2,
        type: TileTypeKeys.content,
        value: {},
      })
    )

    expect(TileConfig.createFromTileType(TileTypeKeys.empty)).toStrictEqual(
      expect.objectContaining({
        cols: 1,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 1,
        type: TileTypeKeys.empty,
        value: {},
      })
    )

    expect(TileConfig.createFromTileType(TileTypeKeys.news)).toStrictEqual(
      expect.objectContaining({
        cols: 1,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 1,
        type: TileTypeKeys.news,
        value: {},
      })
    )

    expect(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      TileConfig.createFromTileType(TileTypeKeys.ticker, {
        ticker: 'AAPL',
      } as TileConfig['value'])
    ).toStrictEqual(
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
      })
    )

    expect(TileConfig.createFromTileType(TileTypeKeys.plotlist)).toStrictEqual(
      expect.objectContaining({
        cols: 12,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 1,
        type: TileTypeKeys.plotlist,
        value: {},
      })
    )

    expect(TileConfig.createFromTileType(TileTypeKeys.table)).toStrictEqual(
      expect.objectContaining({
        cols: 1,
        id: expect.any(String),
        index: 0,
        name: 'Trade Plotter',
        rows: 1,
        type: TileTypeKeys.table,
        value: {},
      })
    )

    expect(() => TileConfig.createFromTileType('1' as TileType)).toThrow(
      AppException
    )
  })

  it('tileTypeFromString', () => {
    expect.hasAssertions()

    expect(TileConfig.tileTypeFromString('chart')).toBe(TileTypeKeys.chart)
    expect(TileConfig.tileTypeFromString('content')).toBe(TileTypeKeys.content)
    expect(TileConfig.tileTypeFromString('empty')).toBe(TileTypeKeys.empty)
    expect(TileConfig.tileTypeFromString('news')).toBe(TileTypeKeys.news)
    expect(TileConfig.tileTypeFromString('plotlist')).toBe(
      TileTypeKeys.plotlist
    )
    expect(TileConfig.tileTypeFromString('table')).toBe(TileTypeKeys.table)
    expect(TileConfig.tileTypeFromString('ticker-info')).toBe(
      TileTypeKeys.ticker
    )

    expect(() => TileConfig.tileTypeFromString('unknown')).toThrow(AppException)
  })
})

describe('tileText', () => {
  it('should return the correct tile text for each tile type', () => {
    expect.hasAssertions()

    const tileConfig: ITileConfig = {
      cols: 2,
      id: 'test-id',
      index: 0,
      name: 'Test Tile',
      rows: 2,
      type: 'unknown' as TileType,
      value: { content: 'This is a test tile content.' },
    }

    expect(TileConfig.tileText(tileConfig)).toBe(
      'Unknown: [object Object] - This is a test tile content.'
    )

    expect(
      TileConfig.tileText(TileConfig.createFromTileType(TileTypeKeys.chart))
    ).toBe('Chart: AAPL')
    expect(
      TileConfig.tileText(
        TileConfig.createFromTileType(TileTypeKeys.content, {
          value: { content: 'test content' },
        })
      )
    ).toBe('Content: test content')
    expect(
      TileConfig.tileText(TileConfig.createFromTileType(TileTypeKeys.empty))
    ).toBe('Empty:')
    expect(
      TileConfig.tileText(TileConfig.createFromTileType(TileTypeKeys.news))
    ).toBe('News:')
    expect(
      TileConfig.tileText(TileConfig.createFromTileType(TileTypeKeys.plotlist))
    ).toBe('PlotList')
    expect(
      TileConfig.tileText(TileConfig.createFromTileType(TileTypeKeys.table))
    ).toBe('Table:')
    expect(
      TileConfig.tileText(TileConfig.createFromTileType(TileTypeKeys.ticker))
    ).toBe('Ticker: AAPL')
    expect(
      TileConfig.tileText(TileConfig.createFromTileType(TileTypeKeys.content))
    ).toBe('Content: ')
    expect(
      TileConfig.tileText({
        ...tileConfig,
        type: '45' as unknown as TileType,
      } as ITileConfig)
    ).toBe('Unknown: [object Object] - This is a test tile content.')
  })
})

describe('getITileConfig', () => {
  it('should return the correct ITileConfig', () => {
    expect.hasAssertions()

    const atileConfig = new TileConfig(
        'test-id',
        'Test Tile',
        {},
        TileTypeKeys.empty,
        0,
        1,
        1
      ),
      iTileConfig = atileConfig.ITileConfig

    expect(iTileConfig).toStrictEqual({
      cols: 1,
      id: 'test-id',
      index: 0,
      name: 'Test Tile',
      rows: 1,
      type: TileTypeKeys.empty,
      value: {},
    })
  })
})
