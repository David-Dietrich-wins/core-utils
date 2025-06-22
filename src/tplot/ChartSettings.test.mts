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

test('zChartSettings', () => {
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

  expect(ChartSettings.zChartSettings.parse(ics)).toEqual({
    ticker: 'AAPL',
    period: 3,
    periodType: 'd',
    frequency: 4,
    frequencyType: '1d',
    granularity: '1d',
    startDate: undefined,
    endDate: undefined,
    extendedHoursTrading: false,
  })
})

test('debugMessage', () => {
  const cs = new ChartSettings('AAPL', 1, 'd', 1, 'd', '1')

  expect(cs.debugMessage).toBe('Daily')
})

test('oneMinute', () => {
  const cs = ChartSettings.oneMinute('AAPL')

  expect(cs).toBeInstanceOf(ChartSettings)
  expect(cs.ticker).toBe('AAPL')
  expect(cs.period).toBe(2)
  expect(cs.periodType).toBe('day')
  expect(cs.frequency).toBe(1)
  expect(cs.frequencyType).toBe('minute')
  expect(cs.granularity).toBe('1')
  expect(cs.startDate).toBeUndefined()
  expect(cs.endDate).toBeUndefined()
  expect(cs.extendedHoursTrading).toBe(true)
})

test('fiveMinute', () => {
  const cs = ChartSettings.fiveMinute('AAPL')

  expect(cs).toBeInstanceOf(ChartSettings)
  expect(cs.ticker).toBe('AAPL')
  expect(cs.period).toBe(5)
  expect(cs.periodType).toBe('day')
  expect(cs.frequency).toBe(5)
  expect(cs.frequencyType).toBe('minute')
  expect(cs.granularity).toBe('1')
  expect(cs.startDate).toBeUndefined()
  expect(cs.endDate).toBeUndefined()
  expect(cs.extendedHoursTrading).toBe(true)
})

test('tenMinute', () => {
  const cs = ChartSettings.tenMinute('AAPL')

  expect(cs).toBeInstanceOf(ChartSettings)
  expect(cs.ticker).toBe('AAPL')
  expect(cs.period).toBe(10)
  expect(cs.periodType).toBe('day')
  expect(cs.frequency).toBe(10)
  expect(cs.frequencyType).toBe('minute')
  expect(cs.granularity).toBe('1')
  expect(cs.startDate).toBeUndefined()
  expect(cs.endDate).toBeUndefined()
  expect(cs.extendedHoursTrading).toBe(true)
})

test('fifteenMinute', () => {
  const cs = ChartSettings.fifteenMinute('AAPL')

  expect(cs).toBeInstanceOf(ChartSettings)
  expect(cs.ticker).toBe('AAPL')
  expect(cs.period).toBe(15)
  expect(cs.periodType).toBe('day')
  expect(cs.frequency).toBe(15)
  expect(cs.frequencyType).toBe('minute')
  expect(cs.granularity).toBe('1')
  expect(cs.startDate).toBeUndefined()
  expect(cs.endDate).toBeUndefined()
  expect(cs.extendedHoursTrading).toBe(true)
})

test('thirtyMinute', () => {
  const cs = ChartSettings.thirtyMinute('AAPL')

  expect(cs).toBeInstanceOf(ChartSettings)
  expect(cs.ticker).toBe('AAPL')
  expect(cs.period).toBe(30)
  expect(cs.periodType).toBe('day')
  expect(cs.frequency).toBe(30)
  expect(cs.frequencyType).toBe('minute')
  expect(cs.granularity).toBe('1')
  expect(cs.startDate).toBeUndefined()
  expect(cs.endDate).toBeUndefined()
  expect(cs.extendedHoursTrading).toBe(true)
})

test('oneDay', () => {
  const cs = ChartSettings.oneDay('AAPL')

  expect(cs).toBeInstanceOf(ChartSettings)
  expect(cs.ticker).toBe('AAPL')
  expect(cs.period).toBe(90)
  expect(cs.periodType).toBe('day')
  expect(cs.frequency).toBe(1)
  expect(cs.frequencyType).toBe('daily')
  expect(cs.granularity).toBe('1')
  expect(cs.startDate).toBeUndefined()
  expect(cs.endDate).toBeUndefined()
  expect(cs.extendedHoursTrading).toBe(true)
})

test('oneWeek', () => {
  const cs = ChartSettings.oneWeek('AAPL')

  expect(cs).toBeInstanceOf(ChartSettings)
  expect(cs.ticker).toBe('AAPL')
  expect(cs.period).toBe(2)
  expect(cs.periodType).toBe('year')
  expect(cs.frequency).toBe(1)
  expect(cs.frequencyType).toBe('weekly')
  expect(cs.granularity).toBe('1')
  expect(cs.startDate).toBeUndefined()
  expect(cs.endDate).toBeUndefined()
  expect(cs.extendedHoursTrading).toBe(false)
})

test('oneMonth', () => {
  const cs = ChartSettings.oneMonth('AAPL')

  expect(cs).toBeInstanceOf(ChartSettings)
  expect(cs.ticker).toBe('AAPL')
  expect(cs.period).toBe(10)
  expect(cs.periodType).toBe('year')
  expect(cs.frequency).toBe(1)
  expect(cs.frequencyType).toBe('monthly')
  expect(cs.granularity).toBe('1')
  expect(cs.startDate).toBeUndefined()
  expect(cs.endDate).toBeUndefined()
  expect(cs.extendedHoursTrading).toBe(false)
})
