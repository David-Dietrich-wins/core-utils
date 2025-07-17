import {
  FinancialModelingPrep,
  type FmpIndicatorQueryParams,
} from './FinancialModelingPrep.mjs'

test('FmpIndicatorParamsSetDateBoundary', () => {
  const params: FmpIndicatorQueryParams = {
    symbol: 'AAPL',
    periodLength: 1,
    timeframe: '1y',
    from: +new Date('2021-01-01'),
    to: +new Date('2021-12-31'),
  }
  const dateBoundary =
    FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary(params)
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

  let dateBoundary =
    FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary(params)
  expect(dateBoundary).toMatchObject({
    from: +new Date('2022-01-01'),
    to: +new Date('2026-01-01T00:00:00Z'),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
    ...params,
    timeframe: '5y',
  })
  expect(dateBoundary).toMatchObject({
    from: +new Date('2026-01-01T00:00:00Z'),
    to: +new Date('2030-01-01'),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
    ...params,
    timeframe: '',
  })
  expect(dateBoundary).toMatchObject({
    from: +new Date('2021-01-01T00:00:00Z'),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
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

test('FmpIndicatorParamsFromObject', () => {
  const params = {
    symbol: 'AAPL',
    periodLength: 1,
    timeframe: '1y',
  }
  const path = FinancialModelingPrep.FmpIndicatorParamsFromObject(params)
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

  expect(() =>
    FinancialModelingPrep.FmpIndicatorParamsFromObject(params)
  ).toThrow('No ticker')
})

test('FmpIndicatorParamsSetDateBoundary', () => {
  const params: FmpIndicatorQueryParams = {
    symbol: 'AAPL',
    periodLength: 1,
    timeframe: '1y',
    from: +new Date('2021-01-01'),
    to: +new Date('2021-12-31'),
  }
  const dateBoundary =
    FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary(params)
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

  let dateBoundary =
    FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary(params)
  expect(dateBoundary).toMatchObject({
    from: +new Date('2022-01-01'),
    to: +new Date('2026-01-01T00:00:00Z'),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
    ...params,
    timeframe: '5y',
  })
  expect(dateBoundary).toMatchObject({
    from: +new Date('2026-01-01T00:00:00Z'),
    to: +new Date('2030-01-01'),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
    ...params,
    timeframe: '',
  })
  expect(dateBoundary).toMatchObject({
    from: +new Date('2021-01-01T00:00:00Z'),
  })

  dateBoundary = FinancialModelingPrep.FmpIndicatorParamsSetDateBoundary({
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

test('FmpIndicatorParamsFromObject', () => {
  const params = {
    symbol: 'AAPL',
    periodLength: 1,
    timeframe: '1y',
  }
  const path = FinancialModelingPrep.FmpIndicatorParamsFromObject(params)
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

  expect(() =>
    FinancialModelingPrep.FmpIndicatorParamsFromObject(params)
  ).toThrow('No ticker')
})
