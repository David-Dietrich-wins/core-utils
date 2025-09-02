import {
  AssetQuoteShort,
  CompanyProfile,
  CreateISymbolDetail,
  ExchangeInfo,
  type IAssetQuoteResponse,
  IAssetQuoteResponseToAssetQuote,
  IAssetQuoteResponseToAssetQuoteWithChanges,
  IAssetQuoteResponseToAssetQuoteWithIpoDate,
  IAssetQuoteResponseToAssetQuoteWithScore,
  IAssetQuotesWithChanges,
  IAssetQuotesWithIpoDate,
  IAssetQuotesWithScore,
  type ISymbolDetail,
  type ISymbolSearch,
  ISymbolSearch2ITickerSearch,
  ISymbolSearch2ITickerSearchArray,
  PriceHistoricalResponse,
} from './ticker-info.mjs'
import moment from 'moment'

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

test('CreateISymbolDetail', () => {
  const isd: ISymbolDetail = {
      createdby: '',
      exchange: '',
      id: '',
      industry: '',
      minmov: 0,
      minmov2: 0,
      name: '',
      pricescale: 0,
      profile: new CompanyProfile(),
      scales: [],
      sector: '',
      ticker: '',
      type: '',
      updatedby: '',
      val: new ExchangeInfo(),
    },
    isdCreate = CreateISymbolDetail()
  expect(isdCreate).toMatchObject(isd)
})

test('IAssetQuoteResponseToAssetQuote', () => {
  const aaqr: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqs = IAssetQuoteResponseToAssetQuote(aaqr)
  expect(aqs).toMatchObject({
    price: 150,
    symbol: 'AAPL',
    volume: 1000000,
  })
})

test('IAssetQuoteResponseToAssetQuoteWithChanges', () => {
  const aqr: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqs = IAssetQuoteResponseToAssetQuoteWithChanges(aqr)
  expect(aqs).toStrictEqual({
    avgVolume: 9315590,
    change: 0.01,
    changes: 0.01,
    changesPercentage: 0.01,
    companyName: 'Apple Inc.',
    dayHigh: 214.0353,
    dayLow: 201.35,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    eps: -1.78,
    exchange: 'NASDAQ',
    marketCap: 14376655872,
    name: 'Apple Inc.',
    open: 214,
    pe: 12,
    previousClose: 212.31,
    price: 150,
    priceAvg200: 136.80391,
    priceAvg50: 211.59486,
    sharesOutstanding: 70800004,
    symbol: 'AAPL',
    ticker: 'AAPL',
    timestamp: 1624635044,
    volume: 1000000,
    yearHigh: 483,
    yearLow: 3.77,
  })
})

test('IAssetQuotesWithChanges', () => {
  const aqr: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqr2: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Microsoft Corp.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'MSFT',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqs = IAssetQuotesWithChanges([aqr, aqr2])
  expect(aqs).toStrictEqual([
    {
      avgVolume: 9315590,
      change: 0.01,
      changes: 0.01,
      changesPercentage: 0.01,
      companyName: 'Apple Inc.',
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      ticker: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    {
      avgVolume: 9315590,
      change: 0.01,
      changes: 0.01,
      changesPercentage: 0.01,
      companyName: 'Microsoft Corp.',
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Microsoft Corp.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'MSFT',
      ticker: 'MSFT',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
  ])
})

test('IAssetQuoteResponseToAssetQuoteWithIpoDate', () => {
  const aqr: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqs = IAssetQuoteResponseToAssetQuoteWithIpoDate(aqr)
  expect(aqs).toStrictEqual({
    avgVolume: 9315590,
    change: 0.01,
    changes: 0.01,
    changesPercentage: 0.01,
    companyName: 'Apple Inc.',
    dayHigh: 214.0353,
    dayLow: 201.35,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    eps: -1.78,
    exchange: 'NASDAQ',
    marketCap: 14376655872,
    name: 'Apple Inc.',
    open: 214,
    pe: 12,
    previousClose: 212.31,
    price: 150,
    priceAvg200: 136.80391,
    priceAvg50: 211.59486,
    sharesOutstanding: 70800004,
    symbol: 'AAPL',
    ticker: 'AAPL',
    timestamp: 1624635044,
    volume: 1000000,
    yearHigh: 483,
    yearLow: 3.77,
  })
})

test('IAssetQuotesWithIpoDate', () => {
  const aqr: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqr2: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Microsoft Corp.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'MSFT',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqs = IAssetQuotesWithIpoDate(
      'testfname',
      [aqr, aqr2],
      [
        { ipoDate: '6-9-2021', symbol: 'AAPL' },
        { ipoDate: '6-9-2021', symbol: 'MSFT' },
      ]
    )
  expect(aqs).toStrictEqual([
    {
      avgVolume: 9315590,
      change: 0.01,
      changes: 0.01,
      changesPercentage: 0.01,
      companyName: 'Apple Inc.',
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      ipoDate: moment('6-9-2021', 'M-D-YYYY').valueOf(),
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      ticker: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    {
      avgVolume: 9315590,
      change: 0.01,
      changes: 0.01,
      changesPercentage: 0.01,
      companyName: 'Microsoft Corp.',
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      ipoDate: moment('6-9-2021', 'M-D-YYYY').valueOf(),
      marketCap: 14376655872,
      name: 'Microsoft Corp.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'MSFT',
      ticker: 'MSFT',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
  ])
})

test('IAssetQuotesWithIpoDate exception', () => {
  const aqr: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqr2: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Microsoft Corp.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'MSFT',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqs = IAssetQuotesWithIpoDate(
      'testfname',
      [aqr, aqr2],
      [
        { ipoDate: 'a', symbol: 'AAPL' },
        { ipoDate: 'bbc', symbol: 'MSFT' },
      ]
    )
  expect(aqs).toMatchObject([
    {
      avgVolume: 9315590,
      change: 0.01,
      changes: 0.01,
      changesPercentage: 0.01,
      companyName: 'Apple Inc.',
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      ticker: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
      // IpoDate: undefined,
    },
    {
      avgVolume: 9315590,
      change: 0.01,
      changes: 0.01,
      changesPercentage: 0.01,
      companyName: 'Microsoft Corp.',
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Microsoft Corp.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'MSFT',
      ticker: 'MSFT',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
      // IpoDate: undefined,
    },
  ])
})

test('IAssetQuoteResponseToAssetQuoteWithScore', () => {
  const aqr: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqs = IAssetQuoteResponseToAssetQuoteWithScore(aqr, 5, 25)
  expect(aqs).toStrictEqual({
    avgVolume: 9315590,
    change: 0.01,
    changes: 0.01,
    changesPercentage: 0.01,
    companyName: 'Apple Inc.',
    dayHigh: 214.0353,
    dayLow: 201.35,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    eps: -1.78,
    exchange: 'NASDAQ',
    marketCap: 14376655872,
    matches: 5,
    name: 'Apple Inc.',
    open: 214,
    pe: 12,
    previousClose: 212.31,
    price: 150,
    priceAvg200: 136.80391,
    priceAvg50: 211.59486,
    scorePercentage: 25,
    sharesOutstanding: 70800004,
    symbol: 'AAPL',
    ticker: 'AAPL',
    timestamp: 1624635044,
    volume: 1000000,
    yearHigh: 483,
    yearLow: 3.77,
  })
})

test('IAssetQuotesWithScore', () => {
  const aqr: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqr2: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Microsoft Corp.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'MSFT',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    aqs = IAssetQuotesWithScore([aqr, aqr2], {
      AAPL: { matches: 5, score: 25 },
      MSFT: { matches: 3, score: 0 },
    })
  expect(aqs).toStrictEqual([
    {
      avgVolume: 9315590,
      change: 0.01,
      changes: 0.01,
      changesPercentage: 0.01,
      companyName: 'Apple Inc.',
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      matches: 5,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      scorePercentage: 1,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      ticker: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    {
      avgVolume: 9315590,
      change: 0.01,
      changes: 0.01,
      changesPercentage: 0.01,
      companyName: 'Microsoft Corp.',
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      matches: 3,
      name: 'Microsoft Corp.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      scorePercentage: 0,
      sharesOutstanding: 70800004,
      symbol: 'MSFT',
      ticker: 'MSFT',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
  ])
})

describe('ISymbolSearch2ITickerSearch', () => {
  test('ISymbolSearch2ITickerSearch', () => {
    const params: ISymbolSearch = {
        currency: 'USD',
        exchangeShortName: 'NASDAQ',
        name: 'Apple Inc.',
        stockExchange: 'NASDAQ',
        symbol: 'AAPL',
      },
      result = ISymbolSearch2ITickerSearch(params)
    expect(result).toMatchObject({
      exchange: 'NASDAQ',
      name: 'Apple Inc.',
      ticker: 'AAPL',
      type: 'NASDAQ',
    })
  })

  test('ISymbolSearch2ITickerSearchArray', () => {
    const aapl: ISymbolSearch = {
        currency: 'USD',
        exchangeShortName: 'NASDAQ',
        name: 'Apple Inc.',
        stockExchange: 'NASDAQ',
        symbol: 'AAPL',
      },
      msft: ISymbolSearch = {
        currency: 'USD',
        exchangeShortName: 'NYSE',
        name: 'Microsoft Corp.',
        stockExchange: 'New York Stock Exchange',
        symbol: 'MSFT',
      },
      result = ISymbolSearch2ITickerSearchArray([aapl, msft])
    expect(result).toMatchObject([
      {
        exchange: 'NASDAQ',
        name: 'Apple Inc.',
        ticker: 'AAPL',
        type: 'NASDAQ',
      },
      {
        exchange: 'New York Stock Exchange',
        name: 'Microsoft Corp.',
        ticker: 'MSFT',
        type: 'NYSE',
      },
    ])
  })
})

test('IAssetQuotesWithIpoDate', () => {
  const aqr: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    assets = [{ ipoDate: '2024-01-01', symbol: 'AAPL' }]

  let ret = IAssetQuotesWithIpoDate('test', [aqr], assets)
  expect(ret).toStrictEqual([
    {
      ...aqr,
      changes: 0.01,
      companyName: 'Apple Inc.',
      ticker: 'AAPL',
    },
  ])

  ret = IAssetQuotesWithIpoDate(
    'test',
    [aqr],
    [{ ...assets[0], symbol: 'MSFT' }]
  )
  expect(ret).toStrictEqual([
    {
      ...aqr,
      changes: 0.01,
      companyName: 'Apple Inc.',
      ticker: 'AAPL',
    },
  ])
})

test('IAssetQuotesWithScore', () => {
  const aqr: IAssetQuoteResponse = {
      // Volume: number    // 2006952,
      avgVolume: 9315590,
      change: 0.01,
      changesPercentage: 0.01,
      dayHigh: 214.0353,
      dayLow: 201.35,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      eps: -1.78,
      exchange: 'NASDAQ',
      marketCap: 14376655872,
      name: 'Apple Inc.',
      open: 214,
      pe: 12,
      previousClose: 212.31,
      price: 150,
      priceAvg200: 136.80391,
      priceAvg50: 211.59486,
      sharesOutstanding: 70800004,
      symbol: 'AAPL',
      timestamp: 1624635044,
      volume: 1000000,
      yearHigh: 483,
      yearLow: 3.77,
    },
    assets = { AAPL: { matches: 5, score: 25 } }

  let ret = IAssetQuotesWithScore([aqr], assets)
  expect(ret).toStrictEqual([
    {
      ...aqr,
      changes: 0.01,
      changesPercentage: 0.01,
      companyName: 'Apple Inc.',
      matches: 5,
      //  25 / 100, // Convert to percentage
      scorePercentage: 1,
      ticker: 'AAPL',
    },
  ])

  ret = IAssetQuotesWithScore([aqr], { MSFT: { matches: 3, score: 15 } })
  expect(ret).toStrictEqual([
    {
      ...aqr,
      changes: 0.01,
      changesPercentage: 0.01,
      companyName: 'Apple Inc.',
      // No match for AAPL
      matches: 0,
      // No score for AAPL
      scorePercentage: 0,
      ticker: 'AAPL',
    },
  ])
})
