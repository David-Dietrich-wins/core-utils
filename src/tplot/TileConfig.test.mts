import { AppException } from '../models/AppException.mjs'
import { ITileConfig, TileConfig, TileType } from './TileConfig.mjs'

test('create TileConfig', () => {
  const tileConfig = TileConfig.CreateTileConfig({
    id: 'test-id',
    type: TileType.content,
    value: {
      title: 'Test Tile',
      content: 'This is a test tile content.',
    },
    cols: 6,
    rows: 4,
    x: 0,
    y: 0,
  })

  expect(tileConfig).toEqual({
    id: 'test-id',
    index: 0,
    name: 'Trade Plotter',
    type: TileType.content,
    value: {
      title: 'Test Tile',
      content: 'This is a test tile content.',
    },
    cols: 6,
    rows: 4,
  })
})

test('ChartDefault', () => {
  const ticker = 'AAPL'
  const chartConfig = TileConfig.ChartDefault({ ticker })

  expect(chartConfig).toEqual({
    ticker,
    frequency: 1,
    frequencyType: 'daily',
    period: 1,
    periodType: 'year',
  })
})

test('CreateChart', () => {
  const ticker = 'AAPL'
  const chartTile = TileConfig.CreateChart(ticker, {
    cols: 4,
    rows: 3,
  })

  expect(chartTile).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.chart,
    value: {
      ticker,
      frequency: 1,
      frequencyType: 'daily',
      period: 1,
      periodType: 'year',
    },
    cols: 4,
    rows: 3,
  })
})

test('Creates', () => {
  expect(
    TileConfig.CreateContent({
      cols: 3,
      rows: 2,
    })
  ).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.content,
    cols: 3,
    rows: 2,
    value: {},
  })

  expect(TileConfig.CreateEmpty()).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.empty,
    value: {},
    cols: 1,
    rows: 1,
  })

  expect(TileConfig.CreateNews()).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.news,
    value: {},
    cols: 1,
    rows: 1,
  })

  expect(TileConfig.CreateTicker('AAPL')).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.ticker,
    value: {
      ticker: 'AAPL',
    },
    cols: 1,
    rows: 1,
  })

  expect(TileConfig.CreatePlotlist()).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.plotlist,
    value: {},
    cols: 12,
    rows: 1,
  })

  expect(TileConfig.CreateTable()).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.table,
    value: {},
    cols: 1,
    rows: 1,
  })
})

test('CreateFromTileType', () => {
  expect(
    TileConfig.CreateFromTileType(TileType.content, {
      cols: 3,
      rows: 2,
    })
  ).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.content,
    cols: 3,
    rows: 2,
    value: {},
  })

  const chartTile = TileConfig.CreateFromTileType(TileType.chart, {
    ticker: 'AAPL',
    cols: 4,
    rows: 3,
  } as TileConfig['value'])

  expect(chartTile).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.chart,
    value: {
      ticker: 'AAPL',
      frequency: 1,
      frequencyType: 'daily',
      period: 1,
      periodType: 'year',
    },
    cols: 4,
    rows: 3,
  })
  expect(
    TileConfig.CreateFromTileType(TileType.content, {
      cols: 3,
      rows: 2,
    })
  ).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.content,
    cols: 3,
    rows: 2,
    value: {},
  })

  expect(TileConfig.CreateFromTileType(TileType.empty)).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.empty,
    value: {},
    cols: 1,
    rows: 1,
  })

  expect(TileConfig.CreateFromTileType(TileType.news)).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.news,
    value: {},
    cols: 1,
    rows: 1,
  })

  expect(
    TileConfig.CreateFromTileType(TileType.ticker, {
      ticker: 'AAPL',
    } as TileConfig['value'])
  ).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.ticker,
    value: {
      ticker: 'AAPL',
    },
    cols: 1,
    rows: 1,
  })

  expect(TileConfig.CreateFromTileType(TileType.plotlist)).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.plotlist,
    value: {},
    cols: 12,
    rows: 1,
  })

  expect(TileConfig.CreateFromTileType(TileType.table)).toEqual({
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    type: TileType.table,
    value: {},
    cols: 1,
    rows: 1,
  })

  expect(() => TileConfig.CreateFromTileType('1' as TileType)).toThrow(
    AppException
  )
})

test('TileTypeFromString', () => {
  expect(TileConfig.TileTypeFromString('chart')).toBe(TileType.chart)
  expect(TileConfig.TileTypeFromString('content')).toBe(TileType.content)
  expect(TileConfig.TileTypeFromString('empty')).toBe(TileType.empty)
  expect(TileConfig.TileTypeFromString('news')).toBe(TileType.news)
  expect(TileConfig.TileTypeFromString('plotlist')).toBe(TileType.plotlist)
  expect(TileConfig.TileTypeFromString('table')).toBe(TileType.table)
  expect(TileConfig.TileTypeFromString('ticker-info')).toBe(TileType.ticker)

  expect(() => TileConfig.TileTypeFromString('unknown')).toThrow(AppException)
})

test('TileText', () => {
  const tileConfig: ITileConfig = {
    id: 'test-id',
    name: 'Test Tile',
    value: { content: 'This is a test tile content.' },
    type: 'unknown' as TileType,
    index: 0,
    cols: 2,
    rows: 2,
  }

  expect(TileConfig.TileText(tileConfig)).toBe(
    'Unknown: [object Object] - This is a test tile content.'
  )

  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileType.chart))
  ).toBe('Chart: AAPL')
  expect(
    TileConfig.TileText(
      TileConfig.CreateFromTileType(TileType.content, {
        value: { content: 'test content' },
      })
    )
  ).toBe('Content: test content')
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileType.empty))
  ).toBe('Empty:')
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileType.news))
  ).toBe('News:')
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileType.plotlist))
  ).toBe('PlotList')
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileType.table))
  ).toBe('Table:')
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileType.ticker))
  ).toBe('Ticker: AAPL')
})

test('getITileConfig', () => {
  const tileConfig = new TileConfig(
    'test-id',
    'Test Tile',
    {},
    TileType.empty,
    0,
    1,
    1
  )

  const iTileConfig = tileConfig.ITileConfig

  expect(iTileConfig).toEqual({
    id: 'test-id',
    name: 'Test Tile',
    value: {},
    type: TileType.empty,
    index: 0,
    cols: 1,
    rows: 1,
  })
})
