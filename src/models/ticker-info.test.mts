import {
  AssetQuoteShort,
  CompanyProfile,
  ExchangeInfo,
  type IAssetQuoteResponse,
  type IPriceHistoricalFull,
  type ISymbolDetail,
  type ISymbolSearch,
  PriceHistoricalResponse,
  createIAssetQuoteResponseToAssetQuote,
  createIAssetQuoteResponseToAssetQuoteWithChanges,
  createIAssetQuoteResponseToAssetQuoteWithIpoDate,
  createIAssetQuoteResponseToAssetQuoteWithScore,
  createIAssetQuotesWithChanges,
  createIAssetQuotesWithIpoDate,
  createIAssetQuotesWithScore,
  createISymbolDetail,
  createISymbolSearch2ITickerSearch,
  createISymbolSearch2ITickerSearchArray,
} from './ticker-info.mjs'
import { describe, expect, it } from '@jest/globals'
import moment from 'moment'
import { safeJsonToString } from '../primitives/object-helper.mjs'

describe('assetQuoteShort', () => {
  it('should create an instance with default values', () => {
    expect.assertions(3)

    const aqs = new AssetQuoteShort()

    expect(aqs.symbol).toBe('')
    expect(aqs.price).toBe(0)
    expect(aqs.volume).toBe(0)
  })

  it('assetQuoteShort assign', () => {
    expect.assertions(3)

    const a = new AssetQuoteShort()
    a.symbol = 'AAPL'
    a.price = 123.45
    a.volume = 1000000

    const aqs = new AssetQuoteShort(a)

    expect(aqs.symbol).toBe('AAPL')
    expect(aqs.price).toBe(123.45)
    expect(aqs.volume).toBe(1000000)
  })
})

describe('companyProfile', () => {
  it('should create an instance with default values', () => {
    expect.assertions(10)

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

  it('exchangeInfo', () => {
    expect.assertions(6)

    const ei = new ExchangeInfo()

    expect(ei.exchange).toBe('')
    expect(ei.exchangeShortName).toBe('')
    expect(ei.symbol).toBe('')
    expect(ei.name).toBe('')
    expect(ei.price).toBe(0)
    expect(ei.volume).toBe(0)
  })

  it('priceHistoricalResponse default', () => {
    expect.assertions(14)

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

  it('priceHistoricalResponse with value', () => {
    expect.assertions(14)

    const iphr: IPriceHistoricalFull = {
      adjClose: 0,
      change: 0,
      changeOverTime: 0,
      changePercent: 0,
      close: 0,
      date: '',
      high: 0,
      label: '',
      low: 0,
      open: 0,
      unadjustedVolume: 0,
      volume: 0,
      vwap: 0,
    }
    const phr = new PriceHistoricalResponse(iphr)

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

  it('createISymbolDetail', () => {
    expect.assertions(1)

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
      isdCreate = createISymbolDetail()

    expect(safeJsonToString(isdCreate)).toBe(safeJsonToString(isd))
  })

  it('iAssetQuoteResponseToAssetQuote', () => {
    expect.assertions(1)

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
      aqs = createIAssetQuoteResponseToAssetQuote(aaqr)

    expect(aqs).toMatchObject({
      price: 150,
      symbol: 'AAPL',
      volume: 1000000,
    })
  })

  it('iAssetQuoteResponseToAssetQuoteWithChanges', () => {
    expect.assertions(1)

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
      aqs = createIAssetQuoteResponseToAssetQuoteWithChanges(aqr)

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

  it('iAssetQuotesWithChanges', () => {
    expect.assertions(1)

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
      aqs = createIAssetQuotesWithChanges([aqr, aqr2])

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

  it('iAssetQuoteResponseToAssetQuoteWithIpoDate', () => {
    expect.assertions(1)

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
      aqs = createIAssetQuoteResponseToAssetQuoteWithIpoDate(aqr)

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

  it('iAssetQuotesWithIpoDate', () => {
    expect.assertions(1)

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
      aqs = createIAssetQuotesWithIpoDate(
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

  it('iAssetQuotesWithIpoDate exception', () => {
    expect.assertions(1)

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
      aqs = createIAssetQuotesWithIpoDate(
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

  it('iAssetQuoteResponseToAssetQuoteWithScore', () => {
    expect.assertions(1)

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
      aqs = createIAssetQuoteResponseToAssetQuoteWithScore(aqr, 5, 25)

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

  it('iAssetQuotesWithScore', () => {
    expect.assertions(1)

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
      aqs = createIAssetQuotesWithScore([aqr, aqr2], {
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
})

describe('iSymbolSearch2ITickerSearch', () => {
  it('iSymbolSearch2ITickerSearch', () => {
    expect.assertions(1)

    const params: ISymbolSearch = {
        currency: 'USD',
        exchangeShortName: 'NASDAQ',
        name: 'Apple Inc.',
        stockExchange: 'NASDAQ',
        symbol: 'AAPL',
      },
      result = createISymbolSearch2ITickerSearch(params)

    expect(result).toMatchObject({
      exchange: 'NASDAQ',
      name: 'Apple Inc.',
      ticker: 'AAPL',
      type: 'NASDAQ',
    })
  })

  it('iSymbolSearch2ITickerSearchArray', () => {
    expect.assertions(1)

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
      result = createISymbolSearch2ITickerSearchArray([aapl, msft])

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

describe('asset quotes', () => {
  it('iAssetQuotesWithIpoDate', () => {
    expect.assertions(2)

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

    let ret = createIAssetQuotesWithIpoDate('test', [aqr], assets)

    expect(ret).toStrictEqual([
      {
        ...aqr,
        changes: 0.01,
        companyName: 'Apple Inc.',
        ticker: 'AAPL',
      },
    ])

    ret = createIAssetQuotesWithIpoDate(
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

  it('iAssetQuotesWithScore', () => {
    expect.assertions(2)

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

    let ret = createIAssetQuotesWithScore([aqr], assets)

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

    ret = createIAssetQuotesWithScore([aqr], {
      MSFT: { matches: 3, score: 15 },
    })

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
})
