import {
  FinancialModelingPrep,
  type FmpIndicatorQueryParams,
} from './FinancialModelingPrep.mjs'
import { describe, expect, it } from '@jest/globals'
import { DateHelper } from '../../primitives/date-helper.mjs'
import type { IChartSettings } from '../../tplot/ChartSettings.mjs'
import { TEST_Settings } from '../../jest.setup.mjs'

describe('from', () => {
  it('should throw an error if from is invalid', () => {
    expect.assertions(4)

    const aparams: FmpIndicatorQueryParams = {
      from: new Date('2021-01-01').getTime(),
      periodLength: 1,
      symbol: 'AAPL',
      timeframe: '1Y',
    }

    let dateBoundary =
      FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary(aparams)

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01').getTime(),
      // to: new Date('2022-01-01T00:00:00Z').getTime(),
    })

    dateBoundary = FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary({
      ...aparams,
      timeframe: '5y',
    })

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01T00:00:00Z').getTime(),
      // to: new Date('2030-01-01').getTime(),
    })

    dateBoundary = FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary({
      ...aparams,
      timeframe: '',
    })

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01T00:00:00Z').getTime(),
    })

    dateBoundary = FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary({
      ...aparams,
      from: undefined,
      to: new Date('2025-01-01').getTime(),
    })

    expect(dateBoundary).toMatchObject({
      from: undefined,
      to: new Date('2026-01-01').getTime(),
    })
  })
})

describe('to', () => {
  it('no to field', () => {
    expect.assertions(4)

    const aparams: FmpIndicatorQueryParams = {
      from: new Date('2021-01-01').getTime(),
      periodLength: 1,
      symbol: 'AAPL',
      timeframe: '1y',
    }

    let dateBoundary =
      FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary(aparams)

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01').getTime(),
      to: new Date('2026-01-01T00:00:00Z').getTime(),
    })

    dateBoundary = FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary({
      ...aparams,
      timeframe: '5y',
    })

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01T00:00:00Z').getTime(),
      // to: new Date('2030-01-01').getTime(),
    })

    dateBoundary = FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary({
      ...aparams,
      timeframe: '',
    })

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01T00:00:00Z').getTime(),
    })

    dateBoundary = FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary({
      ...aparams,
      from: undefined,
      to: new Date('2025-01-01').getTime(),
    })

    expect(dateBoundary).toMatchObject({
      from: undefined,
      to: new Date('2026-01-01').getTime(),
    })
  })
})

describe('fmpIndicatorParamsSetDateBoundary', () => {
  it('should set the date boundary correctly', () => {
    expect.assertions(1)

    const aparams: FmpIndicatorQueryParams = {
        from: new Date('2021-01-01').getTime(),
        periodLength: 1,
        symbol: 'AAPL',
        timeframe: '1y',
        to: new Date('2021-12-31').getTime(),
      },
      dateBoundary =
        FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary(aparams)

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01').getTime(),
      to: new Date('2022-01-01').getTime(),
    })
  })

  it('should set date boundaries correctly', () => {
    expect.assertions(1)

    const aparams: FmpIndicatorQueryParams = {
        from: new Date('2021-01-01').getTime(),
        periodLength: 1,
        symbol: 'AAPL',
        timeframe: '1y',
        to: new Date('2021-12-31').getTime(),
      },
      dateBoundary =
        FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary(aparams)

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01').getTime(),
      to: new Date('2022-01-01').getTime(),
    })
  })

  it('no to', () => {
    expect.assertions(4)

    const params: FmpIndicatorQueryParams = {
      from: new Date('2021-01-01').getTime(),
      periodLength: 1,
      symbol: 'AAPL',
      timeframe: '1y',
    }

    let dateBoundary =
      FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary(params)

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01').getTime(),
      // to: new Date('2026-01-01T00:00:00Z').getTime(),
    })

    dateBoundary = FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary({
      ...params,
      timeframe: '5y',
    })

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01T00:00:00Z').getTime(),
      // to: new Date('2030-01-01').getTime(),
    })

    dateBoundary = FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary({
      ...params,
      timeframe: '',
    })

    expect(dateBoundary).toMatchObject({
      from: new Date('2021-01-01T00:00:00Z').getTime(),
    })

    dateBoundary = FinancialModelingPrep.fmpIndicatorParamsSetDateBoundary({
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

describe('fmpIndicatorQueryParamsToPath', () => {
  it('should convert FmpIndicatorQueryParams to path', () => {
    expect.assertions(3)

    const aparams: FmpIndicatorQueryParams = {
      from: new Date('2021-01-01').getTime(),
      periodLength: 1,
      symbol: 'AAPL',
      timeframe: '1y',
      to: new Date('2021-12-31').getTime(),
    }

    let path = FinancialModelingPrep.fmpIndicatorParamsToPath(aparams)

    expect(path).toBe(
      '&symbol=AAPL&periodLength=1&timeframe=1y&from=1609459200000&to=1640908800000'
    )

    path = FinancialModelingPrep.fmpIndicatorParamsToPath({
      ...aparams,
      from: undefined,
    })

    expect(path).toBe(
      '&symbol=AAPL&periodLength=1&timeframe=1y&to=1640908800000'
    )

    path = FinancialModelingPrep.fmpIndicatorParamsToPath({
      ...aparams,
      to: undefined,
    })

    expect(path).toBe(
      '&symbol=AAPL&periodLength=1&timeframe=1y&from=1609459200000'
    )
  })

  it('should convert FmpIndicatorQueryParams to query string', () => {
    expect.assertions(3)

    const params: FmpIndicatorQueryParams = {
      from: new Date('2021-01-01').getTime(),
      periodLength: 1,
      symbol: 'AAPL',
      timeframe: '1y',
      to: new Date('2021-12-31').getTime(),
    }

    let path = FinancialModelingPrep.fmpIndicatorParamsToPath(params)

    expect(path).toBe(
      '&symbol=AAPL&periodLength=1&timeframe=1y&from=1609459200000&to=1640908800000'
    )

    path = FinancialModelingPrep.fmpIndicatorParamsToPath({
      ...params,
      from: undefined,
    })

    expect(path).toBe(
      '&symbol=AAPL&periodLength=1&timeframe=1y&to=1640908800000'
    )

    path = FinancialModelingPrep.fmpIndicatorParamsToPath({
      ...params,
      to: undefined,
    })

    expect(path).toBe(
      '&symbol=AAPL&periodLength=1&timeframe=1y&from=1609459200000'
    )
  })
})

describe('fmpIndicatorParamsFromObject', () => {
  it('should convert object to FmpIndicatorQueryParams', () => {
    expect.assertions(1)

    const params = {
        periodLength: 1,
        symbol: 'AAPL',
        timeframe: '1y',
      },
      path = FinancialModelingPrep.fmpIndicatorParamsFromObject(params)

    expect(path).toMatchObject({
      from: undefined,
      periodLength: 1,
      symbol: 'AAPL',
      timeframe: '1y',
      to: undefined,
    })
  })

  it('should throw an exception for invalid params', () => {
    expect.assertions(1)

    const params = {
      periodLength: 1,
      symbol: '',
      timeframe: '1y',
    }

    expect(() =>
      FinancialModelingPrep.fmpIndicatorParamsFromObject(params)
    ).toThrow('No ticker')
  })

  it('should throw error for missing symbol', () => {
    expect.assertions(1)

    const params = {
      periodLength: 1,
      symbol: '',
      timeframe: '1y',
    }

    expect(() =>
      FinancialModelingPrep.fmpIndicatorParamsFromObject(params)
    ).toThrow('No ticker')
  })
})

describe('chartSettings', () => {
  it('should return chart settings', () => {
    expect.assertions(3)

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
      chartSettings = FinancialModelingPrep.chartSettings(
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
      FinancialModelingPrep.chartSettings('AAPL', undefined, undefined, '1d')
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
      FinancialModelingPrep.chartSettings(
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

  it('should handle not first data request', () => {
    expect.assertions(1)

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
      chartSettings = FinancialModelingPrep.chartSettings(
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

  it('should handle start date is < num intervals', () => {
    expect.assertions(1)

    const acs: IChartSettings = {
        endDate: undefined,
        extendedHoursTrading: false,
        frequency: 4,
        frequencyType: '1d',
        granularity: '1d',
        period: 3,
        periodType: 'd',
        startDate: DateHelper.addTimeToDate(
          TEST_Settings.currentDateString,
          'd',
          -2
        ).getTime(),
        ticker: 'AAPL',
      },
      chartSettings = FinancialModelingPrep.chartSettings(
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

  it('should handle start date is > num intervals', () => {
    expect.assertions(1)

    const acs: IChartSettings = {
        endDate: undefined,
        extendedHoursTrading: false,
        frequency: 4,
        frequencyType: '1d',
        granularity: 'minute',
        period: 3,
        periodType: 'd',
        startDate: DateHelper.addTimeToDate(
          TEST_Settings.currentDateString,
          'm',
          -1100
        ).getTime(),
        ticker: 'AAPL',
      },
      chartSettings = FinancialModelingPrep.chartSettings(
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

  it('should handle num intervals > 1000', () => {
    expect.assertions(1)

    const acs: IChartSettings = {
        endDate: undefined,
        extendedHoursTrading: false,
        frequency: 4,
        frequencyType: '1d',
        granularity: 'minute',
        period: 3,
        periodType: 'd',
        startDate: DateHelper.addTimeToDate(
          TEST_Settings.currentDateString,
          'm',
          -1100
        ).getTime(),
        ticker: 'AAPL',
      },
      chartSettings = FinancialModelingPrep.chartSettings(
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
