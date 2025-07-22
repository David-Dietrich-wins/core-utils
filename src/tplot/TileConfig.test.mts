/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ITileConfig, TileConfig, TileType } from './TileConfig.mjs'
import { AppException } from '../models/AppException.mjs'

test('create TileConfig', () => {
  const tileConfig = TileConfig.CreateTileConfig({
    cols: 6,
    id: 'test-id',
    rows: 4,
    type: TileType.content,
    value: {
      content: 'This is a test tile content.',
      title: 'Test Tile',
    },
    x: 0,
    y: 0,
  })

  expect(tileConfig).toEqual({
    cols: 6,
    id: 'test-id',
    index: 0,
    name: 'Trade Plotter',
    rows: 4,
    type: TileType.content,
    value: {
      content: 'This is a test tile content.',
      title: 'Test Tile',
    },
  })
})

test('ChartDefault', () => {
  const chartConfig = TileConfig.ChartDefault({ ticker: 'AAPL' })

  expect(chartConfig).toEqual({
    frequency: 1,
    frequencyType: 'daily',
    period: 1,
    periodType: 'year',
    ticker: 'AAPL',
  })
})

test('CreateChart', () => {
  const aticker = 'AAPL',
    chartTile = TileConfig.CreateChart(aticker, {
      cols: 4,
      rows: 3,
    })

  expect(chartTile).toEqual({
    cols: 4,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 3,
    type: TileType.chart,
    value: {
      frequency: 1,
      frequencyType: 'daily',
      period: 1,
      periodType: 'year',
      ticker: aticker,
    },
  })
})

test('Creates', () => {
  expect(
    TileConfig.CreateContent({
      cols: 3,
      rows: 2,
    })
  ).toEqual({
    cols: 3,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 2,
    type: TileType.content,
    value: {},
  })

  expect(TileConfig.CreateEmpty()).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileType.empty,
    value: {},
  })

  expect(TileConfig.CreateNews()).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileType.news,
    value: {},
  })

  expect(TileConfig.CreateTicker('AAPL')).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileType.ticker,
    value: {
      ticker: 'AAPL',
    },
  })

  expect(TileConfig.CreatePlotlist()).toEqual({
    cols: 12,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileType.plotlist,
    value: {},
  })

  expect(TileConfig.CreateTable()).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileType.table,
    value: {},
  })
})

test('CreateFromTileType', () => {
  expect(
    TileConfig.CreateFromTileType(TileType.content, {
      cols: 3,
      rows: 2,
    })
  ).toEqual({
    cols: 3,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 2,
    type: TileType.content,
    value: {},
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const chartTile = TileConfig.CreateFromTileType(TileType.chart, {
    cols: 4,
    rows: 3,
    ticker: 'AAPL',
  } as TileConfig['value'])

  expect(chartTile).toEqual({
    cols: 4,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 3,
    type: TileType.chart,
    value: {
      frequency: 1,
      frequencyType: 'daily',
      period: 1,
      periodType: 'year',
      ticker: 'AAPL',
    },
  })
  expect(
    TileConfig.CreateFromTileType(TileType.content, {
      cols: 3,
      rows: 2,
    })
  ).toEqual({
    cols: 3,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 2,
    type: TileType.content,
    value: {},
  })

  expect(TileConfig.CreateFromTileType(TileType.empty)).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileType.empty,
    value: {},
  })

  expect(TileConfig.CreateFromTileType(TileType.news)).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileType.news,
    value: {},
  })

  expect(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    TileConfig.CreateFromTileType(TileType.ticker, {
      ticker: 'AAPL',
    } as TileConfig['value'])
  ).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileType.ticker,
    value: {
      ticker: 'AAPL',
    },
  })

  expect(TileConfig.CreateFromTileType(TileType.plotlist)).toEqual({
    cols: 12,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileType.plotlist,
    value: {},
  })

  expect(TileConfig.CreateFromTileType(TileType.table)).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileType.table,
    value: {},
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
    cols: 2,
    id: 'test-id',
    index: 0,
    name: 'Test Tile',
    rows: 2,
    type: 'unknown' as TileType,
    value: { content: 'This is a test tile content.' },
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
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileType.content))
  ).toBe('Content: ')
  expect(
    TileConfig.TileText({
      ...tileConfig,
      type: '45' as unknown as TileType,
    } as ITileConfig)
  ).toBe('Unknown: [object Object] - This is a test tile content.')
})

test('getITileConfig', () => {
  const atileConfig = new TileConfig(
      'test-id',
      'Test Tile',
      {},
      TileType.empty,
      0,
      1,
      1
    ),
    iTileConfig = atileConfig.ITileConfig

  expect(iTileConfig).toEqual({
    cols: 1,
    id: 'test-id',
    index: 0,
    name: 'Test Tile',
    rows: 1,
    type: TileType.empty,
    value: {},
  })
})
