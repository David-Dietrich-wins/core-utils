import { DateHelper } from '../services/DateHelper.mjs'
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

test('constructor', () => {
  const cs = new ChartSettings('AAPL')

  expect(cs).toMatchObject({
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

  expect(
    new ChartSettings(
      'AAPL',
      2,
      'day',
      5,
      'minute',
      '1',
      -1,
      1700000000000,
      true
    )
  ).toMatchObject({
    ticker: 'AAPL',
    period: 2,
    periodType: 'day',
    frequency: 5,
    frequencyType: 'minute',
    granularity: '1',
    startDate: -1,
    endDate: 1700000000000,
    extendedHoursTrading: true,
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

  const chartSettings = ChartSettings.Create(ics)
  expect(chartSettings).toMatchObject(ics)

  ics.extendedHoursTrading = undefined
  ics.startDate = 0
  ics.endDate = 0
  const chartSettingsWithExtendedHours = ChartSettings.Create(ics)
  expect(chartSettingsWithExtendedHours).toMatchObject({
    ...ics,
    startDate: undefined,
    endDate: undefined,
    extendedHoursTrading: false,
  })

  ics.startDate = +new Date('2025-01-01')
  ics.endDate = +new Date('2026-01-01')
  const chartSettingsWithDates = ChartSettings.Create(ics)
  expect(chartSettingsWithDates).toMatchObject({
    ...ics,
    extendedHoursTrading: false,
    startDate: ics.startDate,
    endDate: ics.endDate,
  })
})

test('CreateISettings', () => {
  const ics: IChartSettings = {
    endDate: undefined,
    extendedHoursTrading: false,
    frequency: 4,
    frequencyType: '1d',
    granularity: '1d',
    period: 3,
    periodType: 'd',
    startDate: undefined,
    ticker: 'aapl',
  }

  const chartSettings = ChartSettings.CreateISettings(ics)
  expect(chartSettings).toMatchObject({ ...ics, ticker: 'AAPL' })
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

  expect(
    ChartSettings.CreateForTradingView('AAPL', undefined, undefined, '1d')
  ).toMatchObject({
    ticker: 'AAPL',
    period: 1,
    periodType: 'day',
    frequency: 1,
    frequencyType: 'minute',
    granularity: '1d',
    startDate: undefined,
    endDate: undefined,
    extendedHoursTrading: true,
  })

  expect(
    ChartSettings.CreateForTradingView(
      'AAPL',
      undefined,
      undefined,
      '1d',
      false,
      true
    )
  ).toMatchObject({
    ticker: 'AAPL',
    period: 1,
    periodType: 'day',
    frequency: 1,
    frequencyType: 'minute',
    granularity: '1d',
    startDate: 1733054400000,
    endDate: 1764590400000,
    extendedHoursTrading: false,
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

  cs.startDate = +DateHelper.LocalToUtc('2025-01-01')
  cs.endDate = +DateHelper.LocalToUtc('2026-01-01')

  expect(cs.debugMessage).toBe('Daily from 2025-01-01 to 2026-01-01')
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

test('has and ends', () => {
  const cs = ChartSettings.fifteenMinute('AAPL')

  expect(cs.endIsToday).toBe(false)
  expect(cs.fromToForFmp).toBe('&from=2025-12-01&to=2025-12-01')
  expect(cs.hasStartDate).toBe(false)
  expect(cs.hasEndDate).toBe(false)

  expect(cs.isDailyChart).toBe(false)
  expect(cs.startDateAsDate).toBeUndefined()
  expect(cs.endDateAsDate).toBeUndefined()
  expect(cs.startMillis).toBeUndefined()
  expect(cs.endMillis).toBeUndefined()
  expect(cs.startMoment).toBeUndefined()
  expect(cs.endMoment).toBeUndefined()
})

test('isToday', () => {
  expect(ChartSettings.isToday(new Date())).toBe(true)
  expect(ChartSettings.isToday(new Date('2025-01-01'))).toBe(false)

  expect(ChartSettings.isYesterday(DateHelper.addDaysToDate(-1))).toBe(true)
  expect(ChartSettings.isYesterday()).toBe(false)
  expect(ChartSettings.isYesterday(null)).toBe(false)
  expect(ChartSettings.isYesterday(new Date('2025-01-01T00:00:00Z'))).toBe(
    false
  )
})

test('fromToForFmpForThePastYear', () => {
  const cs = ChartSettings.fromToForFmpForThePastYear()

  expect(cs).toBe('&from=2024-12-01&to=2025-12-01')
})

test('periodWithTypeString', () => {
  expect(ChartSettings.periodWithTypeString(1, 'day')).toBe('1 day')
  expect(ChartSettings.periodWithTypeString(1, 'month')).toBe('1 month')
  expect(ChartSettings.periodWithTypeString(1, 'year')).toBe('1 year')
  expect(ChartSettings.periodWithTypeString(1, 'ytd')).toBe('1 ytd')
  expect(ChartSettings.periodWithTypeString(1, 'anything')).toBe('1 anything')
  expect(ChartSettings.periodWithTypeString(1, '')).toBe('1 year')
  expect(ChartSettings.periodWithTypeString(0, '')).toBe('1 year')
})
