import {
  ITileConfig,
  TileConfig,
  type TileType,
  TileTypeKeys,
} from './TileConfig.mjs'
import { AppException } from '../models/AppException.mjs'

test('create TileConfig', () => {
  const tileConfig = TileConfig.CreateTileConfig({
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

  expect(tileConfig).toEqual({
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
    type: TileTypeKeys.chart,
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
    type: TileTypeKeys.content,
    value: {},
  })

  expect(TileConfig.CreateEmpty()).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileTypeKeys.empty,
    value: {},
  })

  expect(TileConfig.CreateNews()).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileTypeKeys.news,
    value: {},
  })

  expect(TileConfig.CreateTicker('AAPL')).toEqual({
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

  expect(TileConfig.CreatePlotlist()).toEqual({
    cols: 12,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileTypeKeys.plotlist,
    value: {},
  })

  expect(TileConfig.CreateTable()).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileTypeKeys.table,
    value: {},
  })
})

test('CreateFromTileType', () => {
  expect(
    TileConfig.CreateFromTileType(TileTypeKeys.content, {
      cols: 3,
      rows: 2,
    })
  ).toEqual({
    cols: 3,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 2,
    type: TileTypeKeys.content,
    value: {},
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const chartTile = TileConfig.CreateFromTileType(TileTypeKeys.chart, {
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
    type: TileTypeKeys.chart,
    value: {
      frequency: 1,
      frequencyType: 'daily',
      period: 1,
      periodType: 'year',
      ticker: 'AAPL',
    },
  })
  expect(
    TileConfig.CreateFromTileType(TileTypeKeys.content, {
      cols: 3,
      rows: 2,
    })
  ).toEqual({
    cols: 3,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 2,
    type: TileTypeKeys.content,
    value: {},
  })

  expect(TileConfig.CreateFromTileType(TileTypeKeys.empty)).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileTypeKeys.empty,
    value: {},
  })

  expect(TileConfig.CreateFromTileType(TileTypeKeys.news)).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileTypeKeys.news,
    value: {},
  })

  expect(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    TileConfig.CreateFromTileType(TileTypeKeys.ticker, {
      ticker: 'AAPL',
    } as TileConfig['value'])
  ).toEqual({
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

  expect(TileConfig.CreateFromTileType(TileTypeKeys.plotlist)).toEqual({
    cols: 12,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileTypeKeys.plotlist,
    value: {},
  })

  expect(TileConfig.CreateFromTileType(TileTypeKeys.table)).toEqual({
    cols: 1,
    id: expect.any(String),
    index: 0,
    name: 'Trade Plotter',
    rows: 1,
    type: TileTypeKeys.table,
    value: {},
  })

  expect(() => TileConfig.CreateFromTileType('1' as TileType)).toThrow(
    AppException
  )
})

test('TileTypeFromString', () => {
  expect(TileConfig.TileTypeFromString('chart')).toBe(TileTypeKeys.chart)
  expect(TileConfig.TileTypeFromString('content')).toBe(TileTypeKeys.content)
  expect(TileConfig.TileTypeFromString('empty')).toBe(TileTypeKeys.empty)
  expect(TileConfig.TileTypeFromString('news')).toBe(TileTypeKeys.news)
  expect(TileConfig.TileTypeFromString('plotlist')).toBe(TileTypeKeys.plotlist)
  expect(TileConfig.TileTypeFromString('table')).toBe(TileTypeKeys.table)
  expect(TileConfig.TileTypeFromString('ticker-info')).toBe(TileTypeKeys.ticker)

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
    TileConfig.TileText(TileConfig.CreateFromTileType(TileTypeKeys.chart))
  ).toBe('Chart: AAPL')
  expect(
    TileConfig.TileText(
      TileConfig.CreateFromTileType(TileTypeKeys.content, {
        value: { content: 'test content' },
      })
    )
  ).toBe('Content: test content')
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileTypeKeys.empty))
  ).toBe('Empty:')
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileTypeKeys.news))
  ).toBe('News:')
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileTypeKeys.plotlist))
  ).toBe('PlotList')
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileTypeKeys.table))
  ).toBe('Table:')
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileTypeKeys.ticker))
  ).toBe('Ticker: AAPL')
  expect(
    TileConfig.TileText(TileConfig.CreateFromTileType(TileTypeKeys.content))
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
      TileTypeKeys.empty,
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
    type: TileTypeKeys.empty,
    value: {},
  })
})
