import { ISubplot, Subplot } from './Subplot.mjs'
import {
  ITradePlotProfitizer,
  TradePlotProfitizer,
} from './TradePlotProfitizer.mjs'
import { IAssetQuoteResponse } from '../models/ticker-info.mjs'
import { deepCloneJson } from '../services/object-helper.mjs'

const itpp: ITradePlotProfitizer = {
    amountToGoal: undefined,
    amountToTargetHigh: undefined,
    amountToTargetLow: undefined,
    created: new Date(),
    createdby: 'TradePlot',
    currentPrice: undefined,
    description: '',
    goal: undefined,
    id: '',
    isShort: false,
    maxExpectedTriggerDate: undefined,
    minExpectedTriggerDate: undefined,
    nextExpectedTriggerDate: undefined,
    nextOrderNumber: undefined,
    numSubplots: 0,
    openPrice: undefined,
    patternCount: 0,
    percentToGoal: undefined,
    percentToTargetHigh: undefined,
    percentToTargetLow: undefined,
    prevExpectedTriggerDate: undefined,
    previousClose: undefined,
    profit: undefined,
    purchase: undefined,
    quoteTimeInLong: undefined,
    shares: 0,
    subplots: [],
    targetHigh: undefined,
    targetLow: undefined,
    ticker: '',
    updated: new Date(),
    updatedby: 'TradePlot',
  },
  // eslint-disable-next-line sort-vars
  assetQuote: IAssetQuoteResponse = {
    avgVolume: 0,
    change: 2.132,
    changesPercentage: 12.6618,
    dayHigh: 18.97,
    dayLow: 16.752,
    earningsAnnouncement: null,
    eps: 0,
    exchange: 'STU',
    marketCap: 0,
    name: 'Lyxor MSCI World ESG Leaders Extra (DR) UCITS ETF',
    open: 16.838,
    pe: 0,
    previousClose: null,
    price: 18.97,
    priceAvg200: 0,
    priceAvg50: 0,
    sharesOutstanding: 0,
    symbol: 'LU1799934499.SG',
    timestamp: 1706804186,
    volume: 0,
    yearHigh: 18.97,
    yearLow: 16.752,
  },
  // eslint-disable-next-line sort-vars
  iSubplot: ISubplot = {
    comment: 'Test Subplot',
    expectedTriggerDate: new Date('2024-01-01'),
    gainCeilingPercent: 0.1,
    id: '123',
    lossFloorPercent: 0.05,
    orderNumber: 1,
    pattern: 'TestPattern',
    scaleInverted: false,
    targetHigh: 200,
    targetLow: 150,
    timeframe: '1D',
    total: 0,
    useMinusEight: false,
  },
  // eslint-disable-next-line sort-vars
  arrITradePlotProfitizer: ITradePlotProfitizer[] = [
    {
      amountToGoal: undefined,
      amountToTargetHigh: undefined,
      amountToTargetLow: undefined,
      created: new Date(),
      createdby: 'TradePlot',
      currentPrice: undefined,
      description: '',
      goal: undefined,
      id: '',
      isShort: false,
      maxExpectedTriggerDate: undefined,
      minExpectedTriggerDate: undefined,
      nextExpectedTriggerDate: undefined,
      nextOrderNumber: undefined,
      numSubplots: 0,
      openPrice: undefined,
      patternCount: 0,
      percentToGoal: undefined,
      percentToTargetHigh: undefined,
      percentToTargetLow: undefined,
      prevExpectedTriggerDate: undefined,
      previousClose: undefined,
      profit: 100,
      purchase: undefined,
      quoteTimeInLong: undefined,
      shares: 100,
      subplots: [iSubplot],
      targetHigh: undefined,
      targetLow: undefined,
      ticker: 'AAPL',
      updated: new Date(),
      updatedby: 'TradePlot',
    },
  ]

test('constructor', () => {
  const profitizer = new TradePlotProfitizer()
  expect(profitizer).toBeInstanceOf(TradePlotProfitizer)

  expect(profitizer).toMatchObject({
    amountToGoal: undefined,
    amountToTargetHigh: undefined,
    amountToTargetLow: undefined,
    created: expect.any(Date),
    createdby: 'TradePlot',
    currentPrice: undefined,
    description: '',
    goal: undefined,
    id: expect.any(String),
    isShort: false,
    maxExpectedTriggerDate: undefined,
    minExpectedTriggerDate: undefined,
    nextExpectedTriggerDate: undefined,
    nextOrderNumber: undefined,
    numSubplots: 0,
    openPrice: undefined,
    patternCount: 0,
    percentToGoal: undefined,
    percentToTargetHigh: undefined,
    percentToTargetLow: undefined,
    prevExpectedTriggerDate: undefined,
    previousClose: undefined,
    profit: undefined,
    purchase: undefined,
    quoteTimeInLong: undefined,
    shares: 0,
    subplots: [],
    targetHigh: undefined,
    targetLow: undefined,
    ticker: '',
    updated: expect.any(Date),
    updatedby: 'TradePlot',
  })

  expect(new TradePlotProfitizer(itpp)).toMatchObject({
    ...itpp,
    created: expect.any(Date),
    updated: expect.any(Date),
  })
})

test('copyObject', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.copyObject(itpp)

  expect(profitizer).toMatchObject({
    ...itpp,
    created: expect.any(Date),
    id: expect.any(String),
    updated: expect.any(Date),
  })
})

test('Create', () => {
  let profitizer = TradePlotProfitizer.Create(itpp)

  expect(profitizer).toBeInstanceOf(TradePlotProfitizer)
  expect(profitizer).toMatchObject({
    ...itpp,
    created: expect.any(Date),
    id: expect.any(String),
    targetHigh: Infinity,
    targetLow: Infinity,
    updated: expect.any(Date),
  })

  profitizer = TradePlotProfitizer.Create(itpp, assetQuote)
  expect(profitizer).toBeInstanceOf(TradePlotProfitizer)
  expect(profitizer).toMatchObject({
    ...itpp,
    amountToTargetHigh: undefined,
    amountToTargetLow: undefined,
    created: expect.any(Date),
    currentPrice: 18.97,
    id: expect.any(String),
    openPrice: 16.838,
    percentToTargetHigh: Infinity,
    percentToTargetLow: -Infinity,
    previousClose: null,
    quoteTimeInLong: 1706804186,
    targetHigh: Infinity,
    targetLow: Infinity,
    updated: expect.any(Date),
  })
})

test('GetProfitForRowItems', () => {
  const profitizer = TradePlotProfitizer.GetProfitForRowItems(
      arrITradePlotProfitizer
    ),
    tpp = deepCloneJson(arrITradePlotProfitizer[0])

  expect(profitizer).toBe(100)

  tpp.profit = undefined
  expect(TradePlotProfitizer.GetProfitForRowItems([tpp])).toBe(0)
})

test('MapToPlotMsg', () => {
  const itp: ITradePlotProfitizer = deepCloneJson(arrITradePlotProfitizer[0]),
    itpNoProfit: ITradePlotProfitizer = deepCloneJson(itp),
    profitizer = TradePlotProfitizer.MapToPlotMsg(itpp)

  expect(profitizer).toMatchObject({
    lineColor: '#00ff00',
    msgText: 'Please setup targets in your trade plot.',
    price: undefined,
    quantity: 0,
    symbol: '',
  })

  expect(TradePlotProfitizer.MapToPlotMsg(itp)).toMatchObject({
    lineColor: '#00ff00',
    msgText: 'Currently up $100.00!',
    price: undefined,
    quantity: 100,
    symbol: 'AAPL',
  })

  itpNoProfit.profit = 0
  expect(TradePlotProfitizer.MapToPlotMsg(itpNoProfit)).toMatchObject({
    lineColor: '#00ff00',
    msgText: 'Currently break even.',
    price: undefined,
    quantity: 100,
    symbol: 'AAPL',
  })

  itpNoProfit.profit = -100
  expect(TradePlotProfitizer.MapToPlotMsg(itpNoProfit)).toMatchObject({
    lineColor: '#00ff00',
    msgText: 'Currently down -$100.00.',
    price: undefined,
    quantity: 100,
    symbol: 'AAPL',
  })

  itpNoProfit.isShort = true
  expect(TradePlotProfitizer.MapToPlotMsg(itpNoProfit)).toMatchObject({
    lineColor: '#f2c200',
    msgText: 'Currently down -$100.00.',
    price: undefined,
    quantity: 100,
    symbol: 'AAPL',
  })
})

test('MapToPlotMsgs', () => {
  const profitizers = TradePlotProfitizer.MapToPlotMsgs(arrITradePlotProfitizer)

  expect(profitizers).toHaveLength(1)
  expect(profitizers[0]).toMatchObject({
    lineColor: '#00ff00',
    msgText: 'Currently up $100.00!',
    price: undefined,
    quantity: 100,
    symbol: 'AAPL',
  })
})

test('get currentPriceDisplay', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.currentPrice = 123.456

  expect(profitizer.currentPriceDisplay).toBe('$123.456')

  profitizer.currentPrice = undefined
  expect(profitizer.currentPriceDisplay).toBe('$0.00')
})

test('getCommentFromPattern', () => {
  const comment = TradePlotProfitizer.GetCommentFromPattern('TestPattern')

  expect(comment).toBe('')
})

test('getCommentFromPattern with unknown pattern', () => {
  const comment = TradePlotProfitizer.GetCommentFromPattern('UnknownPattern')

  expect(comment).toBe('')
})
test('get goalStart', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.goal = 1000

  expect(profitizer.goalStart).toBe(0)

  profitizer.goal = undefined
  expect(profitizer.goalStart).toBe(0)
})

test('get goalStatusText', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.goal = 1000
  profitizer.shares = 10

  expect(profitizer.goalStatusText).toBe(
    'Please provide a purchase price that you paid per share.'
  )

  profitizer.purchase = 100
  expect(profitizer.goalStatusText).toBe(
    '1000000.00% to go. You are below 15% of goal. Recommendation: Exit your position to minimize loss.'
  )

  profitizer.purchase = 0
  expect(profitizer.goalStatusText).toBe(
    'Please provide a purchase price that you paid per share.'
  )

  profitizer.goal = 0
  expect(profitizer.goalStatusText).toBe('Please provide a goal.')

  profitizer.shares = 0
  expect(profitizer.goalStatusText).toBe('Please provide Number of Shares.')

  profitizer.shares = 10
  profitizer.purchase = 100
  profitizer.currentPrice = 120
  profitizer.goal = 1200
  expect(profitizer.goalStatusText).toBe(
    '90.00% to go. You are below 15% of goal. Recommendation: Exit your position to minimize loss.'
  )

  profitizer.goal = 20
  expect(profitizer.goalStatusText).toBe(
    '+500.00% above goal. You are above 15% of goal. Recommendation: Exit your position to lock in profits.'
  )

  profitizer.goal = 140
  expect(profitizer.goalStatusText).toBe('14.29% to go.')

  profitizer.currentPrice = 100
  expect(profitizer.goalStatusText).toBe(
    '28.57% to go. You are below 15% of goal. Recommendation: Exit your position to minimize loss.'
  )

  profitizer.currentPrice = 140
  expect(profitizer.goalStatusText).toBe('0.00%')

  profitizer.currentPrice = 145
  expect(profitizer.goalStatusText).toBe('+3.57% above goal.')
})

test('get investmentAmountCurrent', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.currentPrice = 50
  profitizer.shares = 10

  expect(profitizer.investmentAmountCurrent).toBe(500)
})

test('get investmentAmountDisplay', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.currentPrice = 50
  profitizer.shares = 10

  expect(profitizer.investmentAmountDisplay).toBe('$500.00')

  profitizer.currentPrice = 0
  profitizer.shares = 0
  profitizer.purchase = 0
  expect(profitizer.investmentAmountDisplay).toBe('$0.00')

  profitizer.currentPrice = undefined
  profitizer.shares = 0
  profitizer.purchase = undefined
  expect(profitizer.investmentAmountDisplay).toBe('$0.00')
})

test('get investmentAmountStart', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.purchase = 50
  profitizer.shares = 10

  expect(profitizer.investmentAmountStart).toBe(500)

  profitizer.purchase = 0
  expect(profitizer.investmentAmountStart).toBe(0)
})

test('get investmentAmountStartDisplay', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.purchase = 50
  profitizer.shares = 10

  expect(profitizer.investmentAmountStartDisplay).toBe('$500.00')

  profitizer.purchase = undefined
  profitizer.shares = 0
  expect(profitizer.investmentAmountStartDisplay).toBe('$0')
})

test('get profitLoss', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.currentPrice = 60
  profitizer.purchase = 50
  profitizer.shares = 10

  expect(profitizer.profitLoss).toBe(100)
})

test('get profitLossText', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.currentPrice = 60
  profitizer.purchase = 50
  profitizer.shares = 10

  expect(profitizer.profitLossText).toBe('100.00')
})

test('get subplotCount', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.subplots = [new Subplot(iSubplot), new Subplot(iSubplot)]

  expect(profitizer.subplotCount).toBe(2)
})

test('getCommentFromPattern', () => {
  expect(TradePlotProfitizer.GetCommentFromPattern('TestPattern')).toBe('')
  expect(TradePlotProfitizer.GetCommentFromPattern('b28')).toBe(
    'This is a back to the 8. It is one of the most common fundamentals in moving averages.'
  )
  expect(TradePlotProfitizer.GetCommentFromPattern('ra200')).toBe(
    'When you have resistance at the 200-day moving average on the daily chart. Acts as a ceiling, and typically some type of bounce is expected.'
  )
  expect(TradePlotProfitizer.GetCommentFromPattern('ra50')).toBe(
    'When you have resistance at the 50-day moving average on the daily chart. Acts as a ceiling, and typically some type of bounce is expected.'
  )
  expect(TradePlotProfitizer.GetCommentFromPattern('spt200')).toBe(
    'When you have support at the 200-day moving average on the daily chart. Acts as a floor, and typically some type of bounce is expected.'
  )
  expect(TradePlotProfitizer.GetCommentFromPattern('spt50')).toBe(
    'When you have support at the 50-day moving average on the daily chart. Acts as a floor, and typically some type of bounce is expected.'
  )
  expect(TradePlotProfitizer.GetCommentFromPattern('x8x21')).toBe(
    'When the 8- and 21-day moving averages cross each other. Follow the 8.'
  )
  expect(TradePlotProfitizer.GetCommentFromPattern('unknownPattern')).toBe('')
})
