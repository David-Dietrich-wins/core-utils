import moment from 'moment'
import {
  AssetQuoteShort,
  CompanyProfile,
  CreateISymbolDetail,
  ExchangeInfo,
  IAssetQuoteResponse,
  IAssetQuoteResponseToAssetQuote,
  IAssetQuoteResponseToAssetQuoteWithChanges,
  IAssetQuoteResponseToAssetQuoteWithIpoDate,
  IAssetQuoteResponseToAssetQuoteWithScore,
  IAssetQuotesWithChanges,
  IAssetQuotesWithIpoDate,
  IAssetQuotesWithScore,
  ISymbolDetail,
  ISymbolSearch,
  ISymbolSearch2ITickerSearch,
  ISymbolSearch2ITickerSearchArray,
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

test('CreateISymbolDetail', () => {
  const isd: ISymbolDetail = {
    name: '',
    profile: new CompanyProfile(),
    ticker: '',
    scales: [],
    type: '',
    sector: '',
    industry: '',
    exchange: '',
    id: '',
    minmov: 0,
    minmov2: 0,
    pricescale: 0,
    createdby: '',
    updatedby: '',
    val: new ExchangeInfo(),
  }

  const isdCreate = CreateISymbolDetail()
  expect(isdCreate).toMatchObject(isd)
})

test('IAssetQuoteResponseToAssetQuote', () => {
  const iaqr: IAssetQuoteResponse = {
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }

  const aqs = IAssetQuoteResponseToAssetQuote(iaqr)
  expect(aqs).toMatchObject({
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
  })
})

test('IAssetQuoteResponseToAssetQuoteWithChanges', () => {
  const iaqr: IAssetQuoteResponse = {
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }

  const aqs = IAssetQuoteResponseToAssetQuoteWithChanges(iaqr)
  expect(aqs).toStrictEqual({
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    dayLow: 201.35,
    dayHigh: 214.0353,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
    changes: 0.01,
    companyName: 'Apple Inc.',
    ticker: 'AAPL',
  })
})

test('IAssetQuotesWithChanges', () => {
  const iaqr: IAssetQuoteResponse = {
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }
  const iaqr2: IAssetQuoteResponse = {
    symbol: 'MSFT',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Microsoft Corp.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }

  const aqs = IAssetQuotesWithChanges([iaqr, iaqr2])
  expect(aqs).toStrictEqual([
    {
      symbol: 'AAPL',
      price: 150,
      volume: 1000000,
      dayLow: 201.35,
      dayHigh: 214.0353,
      exchange: 'NASDAQ',
      name: 'Apple Inc.',
      yearHigh: 483,
      yearLow: 3.77,
      marketCap: 14376655872,
      priceAvg50: 211.59486,
      priceAvg200: 136.80391,
      avgVolume: 9315590,
      open: 214,
      previousClose: 212.31,
      eps: -1.78,
      pe: 12,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      sharesOutstanding: 70800004,
      timestamp: 1624635044,
      change: 0.01,
      changesPercentage: 0.01,
      changes: 0.01,
      companyName: 'Apple Inc.',
      ticker: 'AAPL',
    },
    {
      symbol: 'MSFT',
      price: 150,
      volume: 1000000,
      dayLow: 201.35,
      dayHigh: 214.0353,
      exchange: 'NASDAQ',
      name: 'Microsoft Corp.',
      yearHigh: 483,
      yearLow: 3.77,
      marketCap: 14376655872,
      priceAvg50: 211.59486,
      priceAvg200: 136.80391,
      avgVolume: 9315590,
      open: 214,
      previousClose: 212.31,
      eps: -1.78,
      pe: 12,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      sharesOutstanding: 70800004,
      timestamp: 1624635044,
      change: 0.01,
      changesPercentage: 0.01,
      changes: 0.01,
      companyName: 'Microsoft Corp.',
      ticker: 'MSFT',
    },
  ])
})

test('IAssetQuoteResponseToAssetQuoteWithIpoDate', () => {
  const iaqr: IAssetQuoteResponse = {
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }

  const aqs = IAssetQuoteResponseToAssetQuoteWithIpoDate(iaqr)
  expect(aqs).toStrictEqual({
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    dayLow: 201.35,
    dayHigh: 214.0353,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
    changes: 0.01,
    companyName: 'Apple Inc.',
    ticker: 'AAPL',
  })
})

test('IAssetQuotesWithIpoDate', () => {
  const iaqr: IAssetQuoteResponse = {
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }
  const iaqr2: IAssetQuoteResponse = {
    symbol: 'MSFT',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Microsoft Corp.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }

  const aqs = IAssetQuotesWithIpoDate(
    'testfname',
    [iaqr, iaqr2],
    [
      { ipoDate: '6-9-2021', symbol: 'AAPL' },
      { ipoDate: '6-9-2021', symbol: 'MSFT' },
    ]
  )
  expect(aqs).toStrictEqual([
    {
      symbol: 'AAPL',
      price: 150,
      volume: 1000000,
      dayLow: 201.35,
      dayHigh: 214.0353,
      exchange: 'NASDAQ',
      name: 'Apple Inc.',
      yearHigh: 483,
      yearLow: 3.77,
      marketCap: 14376655872,
      priceAvg50: 211.59486,
      priceAvg200: 136.80391,
      avgVolume: 9315590,
      open: 214,
      previousClose: 212.31,
      eps: -1.78,
      pe: 12,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      sharesOutstanding: 70800004,
      timestamp: 1624635044,
      change: 0.01,
      changesPercentage: 0.01,
      changes: 0.01,
      companyName: 'Apple Inc.',
      ticker: 'AAPL',
      ipoDate: moment('6-9-2021', 'M-D-YYYY').valueOf(),
    },
    {
      symbol: 'MSFT',
      price: 150,
      volume: 1000000,
      dayLow: 201.35,
      dayHigh: 214.0353,
      exchange: 'NASDAQ',
      name: 'Microsoft Corp.',
      yearHigh: 483,
      yearLow: 3.77,
      marketCap: 14376655872,
      priceAvg50: 211.59486,
      priceAvg200: 136.80391,
      avgVolume: 9315590,
      open: 214,
      previousClose: 212.31,
      eps: -1.78,
      pe: 12,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      sharesOutstanding: 70800004,
      timestamp: 1624635044,
      change: 0.01,
      changesPercentage: 0.01,
      changes: 0.01,
      companyName: 'Microsoft Corp.',
      ticker: 'MSFT',
      ipoDate: moment('6-9-2021', 'M-D-YYYY').valueOf(),
    },
  ])
})

test('IAssetQuotesWithIpoDate exception', () => {
  const iaqr: IAssetQuoteResponse = {
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }
  const iaqr2: IAssetQuoteResponse = {
    symbol: 'MSFT',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Microsoft Corp.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }

  const aqs = IAssetQuotesWithIpoDate(
    'testfname',
    [iaqr, iaqr2],
    [
      { ipoDate: 'a', symbol: 'AAPL' },
      { ipoDate: 'bbc', symbol: 'MSFT' },
    ]
  )
  expect(aqs).toMatchObject([
    {
      symbol: 'AAPL',
      price: 150,
      volume: 1000000,
      dayLow: 201.35,
      dayHigh: 214.0353,
      exchange: 'NASDAQ',
      name: 'Apple Inc.',
      yearHigh: 483,
      yearLow: 3.77,
      marketCap: 14376655872,
      priceAvg50: 211.59486,
      priceAvg200: 136.80391,
      avgVolume: 9315590,
      open: 214,
      previousClose: 212.31,
      eps: -1.78,
      pe: 12,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      sharesOutstanding: 70800004,
      timestamp: 1624635044,
      change: 0.01,
      changesPercentage: 0.01,
      changes: 0.01,
      companyName: 'Apple Inc.',
      ticker: 'AAPL',
      // ipoDate: undefined,
    },
    {
      symbol: 'MSFT',
      price: 150,
      volume: 1000000,
      dayLow: 201.35,
      dayHigh: 214.0353,
      exchange: 'NASDAQ',
      name: 'Microsoft Corp.',
      yearHigh: 483,
      yearLow: 3.77,
      marketCap: 14376655872,
      priceAvg50: 211.59486,
      priceAvg200: 136.80391,
      avgVolume: 9315590,
      open: 214,
      previousClose: 212.31,
      eps: -1.78,
      pe: 12,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      sharesOutstanding: 70800004,
      timestamp: 1624635044,
      change: 0.01,
      changesPercentage: 0.01,
      changes: 0.01,
      companyName: 'Microsoft Corp.',
      ticker: 'MSFT',
      // ipoDate: undefined,
    },
  ])
})

test('IAssetQuoteResponseToAssetQuoteWithScore', () => {
  const iaqr: IAssetQuoteResponse = {
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }

  const aqs = IAssetQuoteResponseToAssetQuoteWithScore(iaqr, 5, 25)
  expect(aqs).toStrictEqual({
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    dayLow: 201.35,
    dayHigh: 214.0353,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
    changes: 0.01,
    companyName: 'Apple Inc.',
    ticker: 'AAPL',
    matches: 5,
    scorePercentage: 25,
  })
})

test('IAssetQuotesWithScore', () => {
  const iaqr: IAssetQuoteResponse = {
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }
  const iaqr2: IAssetQuoteResponse = {
    symbol: 'MSFT',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Microsoft Corp.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }

  const aqs = IAssetQuotesWithScore([iaqr, iaqr2], {
    AAPL: { matches: 5, score: 25 },
    MSFT: { matches: 3, score: 0 },
  })
  expect(aqs).toStrictEqual([
    {
      symbol: 'AAPL',
      price: 150,
      volume: 1000000,
      dayLow: 201.35,
      dayHigh: 214.0353,
      exchange: 'NASDAQ',
      name: 'Apple Inc.',
      yearHigh: 483,
      yearLow: 3.77,
      marketCap: 14376655872,
      priceAvg50: 211.59486,
      priceAvg200: 136.80391,
      avgVolume: 9315590,
      open: 214,
      previousClose: 212.31,
      eps: -1.78,
      pe: 12,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      sharesOutstanding: 70800004,
      timestamp: 1624635044,
      change: 0.01,
      changesPercentage: 0.01,
      changes: 0.01,
      companyName: 'Apple Inc.',
      ticker: 'AAPL',
      matches: 5,
      scorePercentage: 1,
    },
    {
      symbol: 'MSFT',
      price: 150,
      volume: 1000000,
      dayLow: 201.35,
      dayHigh: 214.0353,
      exchange: 'NASDAQ',
      name: 'Microsoft Corp.',
      yearHigh: 483,
      yearLow: 3.77,
      marketCap: 14376655872,
      priceAvg50: 211.59486,
      priceAvg200: 136.80391,
      avgVolume: 9315590,
      open: 214,
      previousClose: 212.31,
      eps: -1.78,
      pe: 12,
      earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
      sharesOutstanding: 70800004,
      timestamp: 1624635044,
      change: 0.01,
      changesPercentage: 0.01,
      changes: 0.01,
      companyName: 'Microsoft Corp.',
      ticker: 'MSFT',
      matches: 3,
      scorePercentage: 0,
    },
  ])
})

describe('ISymbolSearch2ITickerSearch', () => {
  test('ISymbolSearch2ITickerSearch', () => {
    const params: ISymbolSearch = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      exchangeShortName: 'NASDAQ',
      stockExchange: 'NASDAQ',
      currency: 'USD',
    }
    const result = ISymbolSearch2ITickerSearch(params)
    expect(result).toMatchObject({
      ticker: 'AAPL',
      name: 'Apple Inc.',
      type: 'NASDAQ',
      exchange: 'NASDAQ',
    })
  })

  test('ISymbolSearch2ITickerSearchArray', () => {
    const aapl: ISymbolSearch = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      exchangeShortName: 'NASDAQ',
      stockExchange: 'NASDAQ',
      currency: 'USD',
    }
    const msft: ISymbolSearch = {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      exchangeShortName: 'NYSE',
      stockExchange: 'New York Stock Exchange',
      currency: 'USD',
    }
    const result = ISymbolSearch2ITickerSearchArray([aapl, msft])
    expect(result).toMatchObject([
      {
        ticker: 'AAPL',
        name: 'Apple Inc.',
        type: 'NASDAQ',
        exchange: 'NASDAQ',
      },
      {
        ticker: 'MSFT',
        name: 'Microsoft Corp.',
        type: 'NYSE',
        exchange: 'New York Stock Exchange',
      },
    ])
  })
})

test('IAssetQuotesWithIpoDate', () => {
  const iaqr: IAssetQuoteResponse = {
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }

  const assets = [{ ipoDate: '2024-01-01', symbol: 'AAPL' }]

  let ret = IAssetQuotesWithIpoDate('test', [iaqr], assets)
  expect(ret).toStrictEqual([
    {
      ...iaqr,
      ticker: 'AAPL',
      changes: 0.01,
      companyName: 'Apple Inc.',
    },
  ])

  ret = IAssetQuotesWithIpoDate(
    'test',
    [iaqr],
    [{ ...assets[0], symbol: 'MSFT' }]
  )
  expect(ret).toStrictEqual([
    {
      ...iaqr,
      ticker: 'AAPL',
      changes: 0.01,
      companyName: 'Apple Inc.',
    },
  ])
})

test('IAssetQuotesWithScore', () => {
  const iaqr: IAssetQuoteResponse = {
    symbol: 'AAPL',
    price: 150,
    volume: 1000000,
    exchange: 'NASDAQ',
    name: 'Apple Inc.',
    dayLow: 201.35,
    dayHigh: 214.0353,
    yearHigh: 483,
    yearLow: 3.77,
    marketCap: 14376655872,
    priceAvg50: 211.59486,
    priceAvg200: 136.80391,
    // volume: number    // 2006952,
    avgVolume: 9315590,
    open: 214,
    previousClose: 212.31,
    eps: -1.78,
    pe: 12,
    earningsAnnouncement: '2021-06-09T16:09:00.000+0000',
    sharesOutstanding: 70800004,
    timestamp: 1624635044,
    change: 0.01,
    changesPercentage: 0.01,
  }

  const assets = { AAPL: { matches: 5, score: 25 } }

  let ret = IAssetQuotesWithScore([iaqr], assets)
  expect(ret).toStrictEqual([
    {
      ...iaqr,
      ticker: 'AAPL',
      changesPercentage: 0.01,
      changes: 0.01,
      companyName: 'Apple Inc.',
      matches: 5,
      scorePercentage: 1, //  25 / 100, // Convert to percentage
    },
  ])

  ret = IAssetQuotesWithScore([iaqr], { MSFT: { matches: 3, score: 15 } })
  expect(ret).toStrictEqual([
    {
      ...iaqr,
      ticker: 'AAPL',
      changesPercentage: 0.01,
      changes: 0.01,
      companyName: 'Apple Inc.',
      matches: 0, // No match for AAPL
      scorePercentage: 0, // No score for AAPL
    },
  ])
})
