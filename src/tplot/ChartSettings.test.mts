import {
  ChartPlotReturn,
  ChartSettings,
  type IChartSettings,
} from './ChartSettings.mjs'
import { DateHelper, dateLocalToUtc } from '../primitives/date-helper.mjs'
import { describe, expect, it } from '@jest/globals'

describe('constructor', () => {
  it('defaults', () => {
    expect.hasAssertions()

    const result = new ChartPlotReturn()

    expect(result).toStrictEqual(
      expect.objectContaining({
        drawings: {},
        facets: [],
        plotlist: [],
        positions: [],
      })
    )
  })

  it('good', () => {
    expect.hasAssertions()

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
      endDate: 1700000000000,
      extendedHoursTrading: true,
      frequency: 5,
      frequencyType: 'minute',
      granularity: '1',
      period: 2,
      periodType: 'day',
      startDate: -1,
      ticker: 'AAPL',
    })
  })

  it('with settings', () => {
    expect.hasAssertions()

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
      },
      myChartSettings = new ChartSettings(
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

    expect(myChartSettings).toMatchObject(iChartSettings)
  })

  it('create', () => {
    expect.hasAssertions()

    const acs: IChartSettings = {
        endDate: undefined,
        extendedHoursTrading: false,
        frequency: 4,
        frequencyType: '1d',
        granularity: '1d',
        period: 3,
        periodType: 'd',
        startDate: undefined,
        ticker: 'AAPL',
      },
      chartSettings = ChartSettings.create(acs),
      chartSettingsWithExtendedHours = ChartSettings.create(acs)

    expect(chartSettings).toMatchObject(acs)

    acs.extendedHoursTrading = undefined
    acs.startDate = 0
    acs.endDate = 0

    expect(chartSettingsWithExtendedHours).toMatchObject({
      ...acs,
      endDate: undefined,
      extendedHoursTrading: false,
      startDate: undefined,
    })

    acs.startDate = Number(new Date('2025-01-01'))
    acs.endDate = Number(new Date('2026-01-01'))

    const chartSettingsWithDates = ChartSettings.create(acs)

    expect(chartSettingsWithDates).toMatchObject({
      ...acs,
      endDate: acs.endDate,
      extendedHoursTrading: false,
      startDate: acs.startDate,
    })
  })

  it('createISettings', () => {
    expect.hasAssertions()

    const acs: IChartSettings = {
        endDate: undefined,
        extendedHoursTrading: false,
        frequency: 4,
        frequencyType: '1d',
        granularity: '1d',
        period: 3,
        periodType: 'd',
        startDate: undefined,
        ticker: 'aapl',
      },
      chartSettings = ChartSettings.createISettings(acs)

    expect(chartSettings).toMatchObject({ ...acs, ticker: 'AAPL' })
  })

  it('createForTradingView', () => {
    expect.hasAssertions()

    const acs: IChartSettings = {
        endDate: undefined,
        extendedHoursTrading: false,
        frequency: 4,
        frequencyType: '1d',
        granularity: '1d',
        period: 3,
        periodType: 'd',
        startDate: undefined,
        ticker: 'AAPL',
      },
      chartSettings = ChartSettings.createForTradingView(
        acs.ticker,
        acs.startDate,
        acs.endDate,
        '1d',
        true
      )

    expect(chartSettings).toMatchObject({
      endDate: acs.endDate,
      extendedHoursTrading: true,
      frequency: 1,
      frequencyType: 'minute',
      granularity: acs.granularity,
      period: 1,
      periodType: 'day',
      startDate: acs.startDate,
      ticker: acs.ticker,
    })

    expect(
      ChartSettings.createForTradingView('AAPL', undefined, undefined, '1d')
    ).toMatchObject({
      endDate: undefined,
      extendedHoursTrading: true,
      frequency: 1,
      frequencyType: 'minute',
      granularity: '1d',
      period: 1,
      periodType: 'day',
      startDate: undefined,
      ticker: 'AAPL',
    })

    expect(
      ChartSettings.createForTradingView(
        'AAPL',
        undefined,
        undefined,
        '1d',
        false,
        true
      )
    ).toMatchObject({
      endDate: 1764590400000,
      extendedHoursTrading: false,
      frequency: 1,
      frequencyType: 'minute',
      granularity: '1d',
      period: 1,
      periodType: 'day',
      startDate: 1733054400000,
      ticker: 'AAPL',
    })
  })
})

describe('chartTimeForFmp', () => {
  it('should return the correct chart time for FMP', () => {
    expect.hasAssertions()

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
})

describe('frequencyTypeString', () => {
  it('should return the correct frequency type string', () => {
    expect.hasAssertions()

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

  it('frequencyTypeFriendlyString', () => {
    expect.hasAssertions()

    const cs = new ChartSettings('AAPL', 1, 'd', 1, 'd', '1')

    expect(cs.frequencyTypeFriendlyString).toBe('Daily')
  })
})

describe('zChartSettings', () => {
  it('should parse and validate IChartSettings', () => {
    expect.hasAssertions()

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

    expect(ChartSettings.zChartSettings.parse(ics)).toStrictEqual({
      endDate: undefined,
      extendedHoursTrading: false,
      frequency: 4,
      frequencyType: '1d',
      granularity: '1d',
      period: 3,
      periodType: 'd',
      startDate: undefined,
      ticker: 'AAPL',
    })
  })
})

describe('debugMessage', () => {
  it('should return the correct debug message', () => {
    expect.hasAssertions()

    const cs = new ChartSettings('AAPL', 1, 'd', 1, 'd', '1')

    expect(cs.debugMessage).toBe('Daily')

    cs.startDate = Number(dateLocalToUtc('2025-01-01'))
    cs.endDate = Number(dateLocalToUtc('2026-01-01'))

    expect(cs.debugMessage).toBe('Daily from 2025-01-01 to 2026-01-01')
  })
})

describe('time frames', () => {
  it('oneMinute', () => {
    expect.hasAssertions()

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

  it('fiveMinute', () => {
    expect.hasAssertions()

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

  it('tenMinute', () => {
    expect.hasAssertions()

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

  it('fifteenMinute', () => {
    expect.hasAssertions()

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

  it('thirtyMinute', () => {
    expect.hasAssertions()

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

  it('oneDay', () => {
    expect.hasAssertions()

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

  it('oneWeek', () => {
    expect.hasAssertions()

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

  it('oneMonth', () => {
    expect.hasAssertions()

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
})

describe('has and ends', () => {
  it('from to', () => {
    expect.hasAssertions()

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

  it('fromToForFmpForThePastYear', () => {
    expect.hasAssertions()

    const cs = ChartSettings.fromToForFmpForThePastYear()

    expect(cs).toBe('&from=2024-12-01&to=2025-12-01')
  })
})

describe('isToday', () => {
  it("should return true for today's date", () => {
    expect.assertions(1)
    expect(ChartSettings.isToday(new Date())).toBe(true)
  })

  it('should return false for a different date', () => {
    expect.assertions(1)
    expect(ChartSettings.isToday(new Date('2025-01-01'))).toBe(false)
  })

  it("should return true for yesterday's date", () => {
    expect.assertions(1)
    expect(ChartSettings.isYesterday(DateHelper.addDaysToDate(-1))).toBe(true)
  })

  it("should return false for today's date", () => {
    expect.assertions(1)
    expect(ChartSettings.isYesterday()).toBe(false)
  })

  it('should return false for null', () => {
    expect.assertions(1)
    expect(ChartSettings.isYesterday(null)).toBe(false)
  })

  it('should return false for a yesterday', () => {
    expect.assertions(1)
    expect(ChartSettings.isYesterday(new Date('2025-01-01T00:00:00Z'))).toBe(
      false
    )
  })
})

describe('periodWithTypeString', () => {
  it('should return the correct string for day', () => {
    expect.assertions(1)
    expect(ChartSettings.periodWithTypeString(1, 'day')).toBe('1 day')
  })

  it('should return the correct string for month', () => {
    expect.assertions(1)
    expect(ChartSettings.periodWithTypeString(1, 'month')).toBe('1 month')
  })

  it('should return the correct string for year', () => {
    expect.assertions(1)
    expect(ChartSettings.periodWithTypeString(1, 'year')).toBe('1 year')
  })

  it('should return the correct string for ytd', () => {
    expect.assertions(1)
    expect(ChartSettings.periodWithTypeString(1, 'ytd')).toBe('1 ytd')
  })

  it('should return the correct string for anything else', () => {
    expect.assertions(1)
    expect(ChartSettings.periodWithTypeString(1, 'anything')).toBe('1 anything')
  })

  it('should return the correct string for an empty string', () => {
    expect.assertions(1)
    expect(ChartSettings.periodWithTypeString(1, '')).toBe('1 year')
  })

  it('should return the correct string for zero', () => {
    expect.assertions(1)
    expect(ChartSettings.periodWithTypeString(0, '')).toBe('1 year')
  })
})
