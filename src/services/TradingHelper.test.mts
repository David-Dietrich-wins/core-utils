import {
  TradingHelper,
  type FmpIndicatorQueryParams,
} from './TradingHelper.mjs'

describe('TradingHelper', () => {
  describe('calculatePositionSize', () => {
    it('should calculate position size correctly', () => {
      const result = TradingHelper.CalculatePositionSize(10000, 0.01, 100, 90)
      expect(result).toBe(10)
    })
  })

  describe('calculateRiskReward', () => {
    it('should calculate risk-reward ratio correctly', () => {
      const result = TradingHelper.CalculateRiskReward(100, 120, 90)
      expect(result).toBe(2)
    })
  })
})

describe('FmpIndicatorQueryParams', () => {
  test('FmpIndicatorParamsSetDateBoundary', () => {
    const params: FmpIndicatorQueryParams = {
      symbol: 'AAPL',
      periodLength: 1,
      timeframe: '1y',
      from: +new Date('2021-01-01'),
      to: +new Date('2021-12-31'),
    }
    const dateBoundary = TradingHelper.FmpIndicatorParamsSetDateBoundary(params)
    expect(dateBoundary).toMatchObject({
      from: +new Date('2022-01-01'),
      to: +new Date('2022-01-01'),
    })
  })

  test('FmpIndicatorParamsSetDateBoundary no to', () => {
    const params: FmpIndicatorQueryParams = {
      symbol: 'AAPL',
      periodLength: 1,
      timeframe: '1y',
      from: +new Date('2021-01-01'),
    }

    let dateBoundary = TradingHelper.FmpIndicatorParamsSetDateBoundary(params)
    expect(dateBoundary).toMatchObject({
      from: +new Date('2022-01-01'),
      to: +new Date('2026-01-01T00:00:00Z'),
    })

    dateBoundary = TradingHelper.FmpIndicatorParamsSetDateBoundary({
      ...params,
      timeframe: '5y',
    })
    expect(dateBoundary).toMatchObject({
      from: +new Date('2026-01-01T00:00:00Z'),
      to: +new Date('2030-01-01'),
    })

    dateBoundary = TradingHelper.FmpIndicatorParamsSetDateBoundary({
      ...params,
      timeframe: '',
    })
    expect(dateBoundary).toMatchObject({
      from: +new Date('2021-01-01T00:00:00Z'),
    })

    dateBoundary = TradingHelper.FmpIndicatorParamsSetDateBoundary({
      ...params,
      from: undefined,
      to: +new Date('2025-01-01'),
    })
    expect(dateBoundary).toMatchObject({
      from: undefined,
      to: +new Date('2026-01-01'),
    })
  })

  test('FmpIndicatorQueryParamsToPath', () => {
    const params: FmpIndicatorQueryParams = {
      symbol: 'AAPL',
      periodLength: 1,
      timeframe: '1y',
      from: +new Date('2021-01-01'),
      to: +new Date('2021-12-31'),
    }

    let path = TradingHelper.FmpIndicatorParamsToPath(params)
    expect(path).toBe(
      '&symbol=AAPL&periodLength=1&timeframe=1y&from=1609459200000&to=1640908800000'
    )

    path = TradingHelper.FmpIndicatorParamsToPath({
      ...params,
      from: undefined,
    })
    expect(path).toBe(
      '&symbol=AAPL&periodLength=1&timeframe=1y&to=1640908800000'
    )

    path = TradingHelper.FmpIndicatorParamsToPath({ ...params, to: undefined })
    expect(path).toBe(
      '&symbol=AAPL&periodLength=1&timeframe=1y&from=1609459200000'
    )
  })

  test('FmpIndicatorParamsFromObject', () => {
    const params = {
      symbol: 'AAPL',
      periodLength: 1,
      timeframe: '1y',
    }
    const path = TradingHelper.FmpIndicatorParamsFromObject(params)
    expect(path).toMatchObject({
      from: undefined,
      periodLength: 1,
      symbol: 'AAPL',
      timeframe: '1y',
      to: undefined,
    })
  })

  test('FmpIndicatorParamsFromObject exception', () => {
    const params = {
      symbol: '',
      periodLength: 1,
      timeframe: '1y',
    }

    expect(() => TradingHelper.FmpIndicatorParamsFromObject(params)).toThrow(
      'No ticker'
    )
  })
})
