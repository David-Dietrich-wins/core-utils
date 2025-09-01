import {
  FinancialModelingPrep,
  type FmpIndicatorQueryParams,
} from './FinancialModelingPrep.mjs'
import { DateHelper } from '../../primitives/date-helper.mjs'
import type { IChartSettings } from '../../tplot/ChartSettings.mjs'
import { TEST_Settings } from '../../jest.setup.mjs'

test(FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary.name, () => {
  const aparams: FmpIndicatorQueryParams = {
      from: new Date('2021-01-01').getTime(),
      periodLength: 1,
      symbol: 'AAPL',
      timeframe: '1y',
      to: new Date('2021-12-31').getTime(),
    },
    dateBoundary =
      FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary(aparams)

  expect(dateBoundary).toMatchObject({
    from: new Date('2021-01-01').getTime(),
    to: new Date('2022-01-01').getTime(),
  })
})

test('from', () => {
  const aparams: FmpIndicatorQueryParams = {
    from: new Date('2021-01-01').getTime(),
    periodLength: 1,
    symbol: 'AAPL',
    timeframe: '1Y',
  }

  let dateBoundary =
    FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary(aparams)
  expect(dateBoundary).toMatchObject({
    from: new Date('2021-01-01').getTime(),
    // to: new Date('2022-01-01T00:00:00Z').getTime(),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
    ...aparams,
    timeframe: '5y',
  })
  expect(dateBoundary).toMatchObject({
    from: new Date('2021-01-01T00:00:00Z').getTime(),
    // to: new Date('2030-01-01').getTime(),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
    ...aparams,
    timeframe: '',
  })
  expect(dateBoundary).toMatchObject({
    from: new Date('2021-01-01T00:00:00Z').getTime(),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
    ...aparams,
    from: undefined,
    to: new Date('2025-01-01').getTime(),
  })
  expect(dateBoundary).toMatchObject({
    from: undefined,
    to: new Date('2026-01-01').getTime(),
  })
})

test('no to field', () => {
  const aparams: FmpIndicatorQueryParams = {
    from: new Date('2021-01-01').getTime(),
    periodLength: 1,
    symbol: 'AAPL',
    timeframe: '1y',
  }

  let dateBoundary =
    FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary(aparams)
  expect(dateBoundary).toMatchObject({
    from: new Date('2021-01-01').getTime(),
    to: new Date('2026-01-01T00:00:00Z').getTime(),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
    ...aparams,
    timeframe: '5y',
  })
  expect(dateBoundary).toMatchObject({
    from: new Date('2021-01-01T00:00:00Z').getTime(),
    // to: new Date('2030-01-01').getTime(),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
    ...aparams,
    timeframe: '',
  })
  expect(dateBoundary).toMatchObject({
    from: new Date('2021-01-01T00:00:00Z').getTime(),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
    ...aparams,
    from: undefined,
    to: new Date('2025-01-01').getTime(),
  })
  expect(dateBoundary).toMatchObject({
    from: undefined,
    to: new Date('2026-01-01').getTime(),
  })
})

test('FmpIndicatorQueryParamsToPath', () => {
  const aparams: FmpIndicatorQueryParams = {
    from: new Date('2021-01-01').getTime(),
    periodLength: 1,
    symbol: 'AAPL',
    timeframe: '1y',
    to: new Date('2021-12-31').getTime(),
  }

  let path = FinancialModelingPrep.FmpIndicatorParamsToPath(aparams)
  expect(path).toBe(
    '&symbol=AAPL&periodLength=1&timeframe=1y&from=1609459200000&to=1640908800000'
  )

  path = FinancialModelingPrep.FmpIndicatorParamsToPath({
    ...aparams,
    from: undefined,
  })
  expect(path).toBe('&symbol=AAPL&periodLength=1&timeframe=1y&to=1640908800000')

  path = FinancialModelingPrep.FmpIndicatorParamsToPath({
    ...aparams,
    to: undefined,
  })
  expect(path).toBe(
    '&symbol=AAPL&periodLength=1&timeframe=1y&from=1609459200000'
  )
})

describe('FmpIndicatorParamsFromObject', () => {
  test('good', () => {
    const params = {
        periodLength: 1,
        symbol: 'AAPL',
        timeframe: '1y',
      },
      path = FinancialModelingPrep.FmpIndicatorParamsFromObject(params)
    expect(path).toMatchObject({
      from: undefined,
      periodLength: 1,
      symbol: 'AAPL',
      timeframe: '1y',
      to: undefined,
    })
  })

  test(' exception', () => {
    const params = {
      periodLength: 1,
      symbol: '',
      timeframe: '1y',
    }

    expect(() =>
      FinancialModelingPrep.FmpIndicatorParamsFromObject(params)
    ).toThrow('No ticker')
  })
})

describe(FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary.name, () => {
  test('good', () => {
    const aparams: FmpIndicatorQueryParams = {
        from: new Date('2021-01-01').getTime(),
        periodLength: 1,
        symbol: 'AAPL',
        timeframe: '1y',
        to: new Date('2021-12-31').getTime(),
      },
      dateBoundary =
        FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary(aparams)

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01').getTime(),
      to: new Date('2022-01-01').getTime(),
    })
  })

  test('no to', () => {
    const params: FmpIndicatorQueryParams = {
      from: new Date('2021-01-01').getTime(),
      periodLength: 1,
      symbol: 'AAPL',
      timeframe: '1y',
    }

    let dateBoundary =
      FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary(params)

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01').getTime(),
      // to: new Date('2026-01-01T00:00:00Z').getTime(),
    })

    dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
      ...params,
      timeframe: '5y',
    })
    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01T00:00:00Z').getTime(),
      // to: new Date('2030-01-01').getTime(),
    })

    dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
      ...params,
      timeframe: '',
    })
    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01T00:00:00Z').getTime(),
    })

    dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
      ...params,
      from: undefined,
      to: new Date('2025-01-01').getTime(),
    })
    expect(dateBoundary).toMatchObject({
      from: undefined,
      to: new Date('2026-01-01').getTime(),
    })
  })
})

test('FmpIndicatorQueryParamsToPath', () => {
  const params: FmpIndicatorQueryParams = {
    from: new Date('2021-01-01').getTime(),
    periodLength: 1,
    symbol: 'AAPL',
    timeframe: '1y',
    to: new Date('2021-12-31').getTime(),
  }

  let path = FinancialModelingPrep.FmpIndicatorParamsToPath(params)
  expect(path).toBe(
    '&symbol=AAPL&periodLength=1&timeframe=1y&from=1609459200000&to=1640908800000'
  )

  path = FinancialModelingPrep.FmpIndicatorParamsToPath({
    ...params,
    from: undefined,
  })
  expect(path).toBe('&symbol=AAPL&periodLength=1&timeframe=1y&to=1640908800000')

  path = FinancialModelingPrep.FmpIndicatorParamsToPath({
    ...params,
    to: undefined,
  })
  expect(path).toBe(
    '&symbol=AAPL&periodLength=1&timeframe=1y&from=1609459200000'
  )
})

describe(FinancialModelingPrep.FmpIndicatorParamsFromObject.name, () => {
  test('good', () => {
    const params = {
        periodLength: 1,
        symbol: 'AAPL',
        timeframe: '1y',
      },
      path = FinancialModelingPrep.FmpIndicatorParamsFromObject(params)
    expect(path).toMatchObject({
      from: undefined,
      periodLength: 1,
      symbol: 'AAPL',
      timeframe: '1y',
      to: undefined,
    })
  })

  test('exception', () => {
    const params = {
      periodLength: 1,
      symbol: '',
      timeframe: '1y',
    }

    expect(() =>
      FinancialModelingPrep.FmpIndicatorParamsFromObject(params)
    ).toThrow('No ticker')
  })
})

describe(FinancialModelingPrep.ChartSettings.name, () => {
  test('good', () => {
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
      chartSettings = FinancialModelingPrep.ChartSettings(
        acs.ticker,
        acs.startDate,
        acs.endDate,
        '1d',
        true,
        365,
        true
      )

    expect(chartSettings).toMatchObject({
      endDate: 1764590400000,
      extendedHoursTrading: true,
      frequency: 1,
      frequencyType: 'minute',
      granularity: acs.granularity,
      period: 1,
      periodType: 'day',
      startDate: 1678190400000,
      ticker: acs.ticker,
    })

    expect(
      FinancialModelingPrep.ChartSettings('AAPL', undefined, undefined, '1d')
    ).toMatchObject({
      endDate: 1764590400000,
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
      FinancialModelingPrep.ChartSettings(
        'AAPL',
        undefined,
        undefined,
        '1d',
        false,
        3,
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
      startDate: 1678190400000,
      ticker: 'AAPL',
    })
  })

  test('not first data request', () => {
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
      chartSettings = FinancialModelingPrep.ChartSettings(
        acs.ticker,
        acs.startDate,
        acs.endDate,
        '1d',
        true,
        365,
        false
      )

    expect(chartSettings).toMatchObject({
      endDate: 1764590400000,
      extendedHoursTrading: true,
      frequency: 1,
      frequencyType: 'minute',
      granularity: acs.granularity,
      period: 1,
      periodType: 'day',
      startDate: 1678190400000,
      ticker: acs.ticker,
    })
  })

  test('start date is < num intervals', () => {
    const acs: IChartSettings = {
        endDate: undefined,
        extendedHoursTrading: false,
        frequency: 4,
        frequencyType: '1d',
        granularity: '1d',
        period: 3,
        periodType: 'd',
        startDate: DateHelper.AddTimeToDate(
          TEST_Settings.currentDateString,
          'd',
          -2
        ).getTime(),
        ticker: 'AAPL',
      },
      chartSettings = FinancialModelingPrep.ChartSettings(
        acs.ticker,
        acs.startDate,
        acs.endDate,
        '1d',
        true,
        365,
        false
      )

    expect(chartSettings).toMatchObject({
      endDate: 1764590400000,
      extendedHoursTrading: true,
      frequency: 1,
      frequencyType: 'minute',
      granularity: acs.granularity,
      period: 1,
      periodType: 'day',
      startDate: 1678190400000,
      ticker: acs.ticker,
    })
  })

  test('start date is > num intervals', () => {
    const acs: IChartSettings = {
        endDate: undefined,
        extendedHoursTrading: false,
        frequency: 4,
        frequencyType: '1d',
        granularity: 'minute',
        period: 3,
        periodType: 'd',
        startDate: DateHelper.AddTimeToDate(
          TEST_Settings.currentDateString,
          'm',
          -1100
        ).getTime(),
        ticker: 'AAPL',
      },
      chartSettings = FinancialModelingPrep.ChartSettings(
        acs.ticker,
        acs.startDate,
        acs.endDate,
        'minute',
        true,
        365,
        false
      )

    expect(chartSettings).toMatchObject({
      endDate: 1764590400000,
      extendedHoursTrading: true,
      frequency: 1,
      frequencyType: 'minute',
      granularity: acs.granularity,
      period: 1,
      periodType: 'day',
      startDate: 1764524400000,
      ticker: acs.ticker,
    })
  })

  test('num intervals > 1000', () => {
    const acs: IChartSettings = {
        endDate: undefined,
        extendedHoursTrading: false,
        frequency: 4,
        frequencyType: '1d',
        granularity: 'minute',
        period: 3,
        periodType: 'd',
        startDate: DateHelper.AddTimeToDate(
          TEST_Settings.currentDateString,
          'm',
          -1100
        ).getTime(),
        ticker: 'AAPL',
      },
      chartSettings = FinancialModelingPrep.ChartSettings(
        acs.ticker,
        acs.startDate,
        acs.endDate,
        'minute',
        true,
        1100,
        false
      )

    expect(chartSettings).toMatchObject({
      endDate: 1764590400000,
      extendedHoursTrading: true,
      frequency: 1,
      frequencyType: 'minute',
      granularity: acs.granularity,
      period: 1,
      periodType: 'day',
      startDate: 1764524400000,
      ticker: acs.ticker,
    })
  })
})
