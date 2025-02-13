import {
  AssetQuoteShort,
  CompanyProfile,
  ExchangeInfo,
  PriceHistoricalResponse,
} from './ticker-info.mjs'

test('AssetQuoteShort', () => {
  const aqs = new AssetQuoteShort()

  expect(aqs.symbol).toBe('')
  expect(aqs.price).toBe(0)
  expect(aqs.volume).toBe(0)
})

test('AssetQuoteShort assign', () => {
  const a = new AssetQuoteShort()
  a.symbol = 'AAPL'
  a.price = 123.45
  a.volume = 1000000

  const aqs = new AssetQuoteShort(a)

  expect(aqs.symbol).toBe('AAPL')
  expect(aqs.price).toBe(123.45)
  expect(aqs.volume).toBe(1000000)
})

test('CompanyProfile', () => {
  const cp = new CompanyProfile()

  expect(cp.symbol).toBe('')
  expect(cp.companyName).toBe('')
  expect(cp.exchange).toBe('')
  expect(cp.industry).toBe('')
  expect(cp.website).toBe('')
  expect(cp.description).toBe('')
  expect(cp.ceo).toBe('')
  expect(cp.sector).toBe('')
  expect(cp.image).toBe('')
  expect(cp.price).toBe(0)
})

test('ExchangeInfo', () => {
  const ei = new ExchangeInfo()

  expect(ei.exchange).toBe('')
  expect(ei.exchangeShortName).toBe('')
  expect(ei.symbol).toBe('')
  expect(ei.name).toBe('')
  expect(ei.price).toBe(0)
  expect(ei.volume).toBe(0)
})

test('PriceHistoricalResponse', () => {
  const phr = new PriceHistoricalResponse()

  expect(phr.date).toBe('')
  expect(phr.open).toBe(0)
  expect(phr.high).toBe(0)
  expect(phr.low).toBe(0)
  expect(phr.close).toBe(0)
  expect(phr.adjClose).toBe(0)
  expect(phr.volume).toBe(0)
  expect(phr.unadjustedVolume).toBe(0)
  expect(phr.change).toBe(0)
  expect(phr.changePercent).toBe(0)
  expect(phr.vwap).toBe(0)
  expect(phr.label).toBe('')
  expect(phr.changeOverTime).toBe(0)
  expect(phr.datetime).toBe(0)
})

test('PriceHistoricalResponse', () => {
  const a = new PriceHistoricalResponse()
  a.date = '2021-01-01'
  a.open = 100
  a.high = 200
  a.low = 50
  a.close = 150
  a.adjClose = 150
  a.volume = 1000000
  a.unadjustedVolume = 1000000
  a.change = 50
  a.changePercent = 50
  a.vwap = 150
  a.label = 'AAPL'
  a.changeOverTime = 50
  a.datetime = 1609459200

  const phr = new PriceHistoricalResponse(a)

  expect(phr.date).toBe('2021-01-01')
  expect(phr.open).toBe(100)
  expect(phr.high).toBe(200)
  expect(phr.low).toBe(50)
  expect(phr.close).toBe(150)
  expect(phr.adjClose).toBe(150)
  expect(phr.volume).toBe(1000000)
  expect(phr.unadjustedVolume).toBe(1000000)
  expect(phr.change).toBe(50)
  expect(phr.changePercent).toBe(50)
  expect(phr.vwap).toBe(150)
  expect(phr.label).toBe('AAPL')
  expect(phr.changeOverTime).toBe(50)
  expect(phr.datetime).toBe(1609459200)
})
