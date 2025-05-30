import {
  ChartPlotReturn,
  ChartSettings,
  IChartSettings,
} from './ChartSettings.mjs'

test('ChartPlotReturn', () => {
  const result = new ChartPlotReturn()
  expect(result).toEqual({
    plotlist: [],
    drawings: {},
    facets: [],
    positions: [],
  })
})

test('ChartSettings', () => {
  const chartSettings = new ChartSettings('AAPL')

  expect(chartSettings).toMatchObject({
    endDate: undefined,
    extendedHoursTrading: false,
    frequency: 1,
    frequencyType: '',
    granularity: '',
    period: 1,
    periodType: '',
    startDate: undefined,
    ticker: 'AAPL',
  })
})

test('ChartSettings with settings', () => {
  const iChartSettings: IChartSettings = {
    endDate: undefined,
    extendedHoursTrading: false,
    frequency: 4,
    frequencyType: '1d',
    granularity: '1d',
    period: 3,
    periodType: 'd',
    startDate: undefined,
    ticker: 'AAPL',
  }

  const chartSettings = new ChartSettings(
    iChartSettings.ticker,
    iChartSettings.period,
    iChartSettings.periodType,
    iChartSettings.frequency,
    iChartSettings.frequencyType,
    iChartSettings.granularity,
    iChartSettings.startDate,
    iChartSettings.endDate,
    iChartSettings.extendedHoursTrading
  )
  expect(chartSettings).toMatchObject(iChartSettings)
})

test('ChartSettings.Create', () => {
  const iChartSettings: IChartSettings = {
    endDate: undefined,
    extendedHoursTrading: false,
    frequency: 4,
    frequencyType: '1d',
    granularity: '1d',
    period: 3,
    periodType: 'd',
    startDate: undefined,
    ticker: 'AAPL',
  }

  const chartSettings = ChartSettings.Create(iChartSettings)
  expect(chartSettings).toMatchObject(iChartSettings)
})

test('CreateForTradingView', () => {
  const ics: IChartSettings = {
    endDate: undefined,
    extendedHoursTrading: false,
    frequency: 4,
    frequencyType: '1d',
    granularity: '1d',
    period: 3,
    periodType: 'd',
    startDate: undefined,
    ticker: 'AAPL',
  }
  const chartSettings = ChartSettings.CreateForTradingView(
    ics.ticker,
    ics.startDate,
    ics.endDate,
    '1d',
    true
  )

  expect(chartSettings).toMatchObject({
    ticker: ics.ticker,
    period: 1,
    periodType: 'day',
    frequency: 1,
    frequencyType: 'minute',
    granularity: ics.granularity,
    startDate: ics.startDate,
    endDate: ics.endDate,
    extendedHoursTrading: true,
  })
})

test('chartTimeForFmp', () => {
  const cs = new ChartSettings('AAPL', 1, 'd', 1, 'minute', '1')

  expect(cs.chartTimeForFmp).toBe('1min')
  cs.granularity = '5'
  expect(cs.chartTimeForFmp).toBe('5min')
  cs.granularity = '15'
  expect(cs.chartTimeForFmp).toBe('15min')
  cs.granularity = '30'
  expect(cs.chartTimeForFmp).toBe('30min')
  cs.granularity = '60'
  expect(cs.chartTimeForFmp).toBe('1hour')
  cs.granularity = '240'
  expect(cs.chartTimeForFmp).toBe('4hour')

  cs.granularity = 'anything'
  expect(cs.chartTimeForFmp).toBe('')
})

test('frequencyTypeString', () => {
  expect(ChartSettings.frequencyTypeString('1', '1')).toBe('1 minute')
  expect(ChartSettings.frequencyTypeString('5', '5')).toBe('5 minute')
  expect(ChartSettings.frequencyTypeString('15', '15')).toBe('15 minute')
  expect(ChartSettings.frequencyTypeString('30', '30')).toBe('30 minute')
  expect(ChartSettings.frequencyTypeString('60', '60')).toBe('1 hour')
  expect(ChartSettings.frequencyTypeString('240', '240')).toBe('4 hour')

  expect(ChartSettings.frequencyTypeString('', '1')).toBe('1 minute')
  expect(ChartSettings.frequencyTypeString('', '')).toBe('Daily')
  expect(ChartSettings.frequencyTypeString('d', '')).toBe('Daily')
  expect(ChartSettings.frequencyTypeString('1d', '')).toBe('Daily')
  expect(ChartSettings.frequencyTypeString('daily', '')).toBe('Daily')

  expect(ChartSettings.frequencyTypeString('w', '')).toBe('Weekly')
  expect(ChartSettings.frequencyTypeString('1w', '')).toBe('Weekly')
  expect(ChartSettings.frequencyTypeString('weekly', '')).toBe('Weekly')

  expect(ChartSettings.frequencyTypeString('m', '')).toBe('Monthly')
  expect(ChartSettings.frequencyTypeString('1m', '')).toBe('Monthly')
  expect(ChartSettings.frequencyTypeString('monthly', '')).toBe('Monthly')

  expect(ChartSettings.frequencyTypeString('anything', '')).toBe('anything')
})

test('frequencyTypeFriendlyString', () => {
  const cs = new ChartSettings('AAPL', 1, 'd', 1, 'd', '1')

  expect(cs.frequencyTypeFriendlyString).toBe('Daily')
})
