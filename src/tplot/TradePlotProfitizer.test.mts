import { IAssetQuoteResponse } from '../models/ticker-info.mjs'
import { deepCloneJson } from '../services/object-helper.mjs'
import { ISubplot, Subplot } from './Subplot.mjs'
import {
  ITradePlotProfitizer,
  TradePlotProfitizer,
} from './TradePlotProfitizer.mjs'

const itpp: ITradePlotProfitizer = {
  id: '',
  ticker: '',
  description: '',
  goal: undefined,
  isShort: false,
  purchase: undefined,
  shares: 0,
  subplots: [],
  updatedby: 'TradePlot',
  updated: new Date(),
  createdby: 'TradePlot',
  created: new Date(),
  profit: undefined,
  patternCount: 0,
  numSubplots: 0,
  targetLow: undefined,
  targetHigh: undefined,
  currentPrice: undefined,
  previousClose: undefined,
  openPrice: undefined,
  quoteTimeInLong: undefined,
  amountToTargetLow: undefined,
  amountToTargetHigh: undefined,
  percentToTargetLow: undefined,
  percentToTargetHigh: undefined,
  amountToGoal: undefined,
  percentToGoal: undefined,
  nextOrderNumber: undefined,
  nextExpectedTriggerDate: undefined,
  prevExpectedTriggerDate: undefined,
  maxExpectedTriggerDate: undefined,
  minExpectedTriggerDate: undefined,
}

const assetQuote: IAssetQuoteResponse = {
  symbol: 'LU1799934499.SG',
  name: 'Lyxor MSCI World ESG Leaders Extra (DR) UCITS ETF',
  price: 18.97,
  changesPercentage: 12.6618,
  change: 2.132,
  dayLow: 16.752,
  dayHigh: 18.97,
  yearHigh: 18.97,
  yearLow: 16.752,
  marketCap: 0,
  priceAvg50: 0,
  priceAvg200: 0,
  exchange: 'STU',
  volume: 0,
  avgVolume: 0,
  open: 16.838,
  previousClose: null,
  eps: 0,
  pe: 0,
  earningsAnnouncement: null,
  sharesOutstanding: 0,
  timestamp: 1706804186,
}

const iSubplot: ISubplot = {
  id: '123',
  orderNumber: 1,
  pattern: 'TestPattern',
  timeframe: '1D',
  total: 0,
  targetLow: 150,
  targetHigh: 200,
  expectedTriggerDate: new Date('2024-01-01'),
  comment: 'Test Subplot',
  lossFloorPercent: 0.05,
  gainCeilingPercent: 0.1,
  useMinusEight: false,
  scaleInverted: false,
}

const arrITradePlotProfitizer: ITradePlotProfitizer[] = [
  {
    id: '',
    ticker: 'AAPL',
    description: '',
    goal: undefined,
    isShort: false,
    purchase: undefined,
    shares: 100,
    subplots: [iSubplot],
    updatedby: 'TradePlot',
    updated: new Date(),
    createdby: 'TradePlot',
    created: new Date(),
    profit: 100,
    patternCount: 0,
    numSubplots: 0,
    targetLow: undefined,
    targetHigh: undefined,
    currentPrice: undefined,
    previousClose: undefined,
    openPrice: undefined,
    quoteTimeInLong: undefined,
    amountToTargetLow: undefined,
    amountToTargetHigh: undefined,
    percentToTargetLow: undefined,
    percentToTargetHigh: undefined,
    amountToGoal: undefined,
    percentToGoal: undefined,
    nextOrderNumber: undefined,
    nextExpectedTriggerDate: undefined,
    prevExpectedTriggerDate: undefined,
    maxExpectedTriggerDate: undefined,
    minExpectedTriggerDate: undefined,
  },
]

test('constructor', () => {
  const profitizer = new TradePlotProfitizer()
  expect(profitizer).toBeInstanceOf(TradePlotProfitizer)

  expect(profitizer).toMatchObject({
    id: expect.any(String),
    ticker: '',
    description: '',
    goal: undefined,
    isShort: false,
    purchase: undefined,
    shares: 0,
    subplots: [],
    updatedby: 'TradePlot',
    updated: expect.any(Date),
    createdby: 'TradePlot',
    created: expect.any(Date),
    profit: undefined,
    patternCount: 0,
    numSubplots: 0,
    targetLow: undefined,
    targetHigh: undefined,
    currentPrice: undefined,
    previousClose: undefined,
    openPrice: undefined,
    quoteTimeInLong: undefined,
    amountToTargetLow: undefined,
    amountToTargetHigh: undefined,
    percentToTargetLow: undefined,
    percentToTargetHigh: undefined,
    amountToGoal: undefined,
    percentToGoal: undefined,
    nextOrderNumber: undefined,
    nextExpectedTriggerDate: undefined,
    prevExpectedTriggerDate: undefined,
    maxExpectedTriggerDate: undefined,
    minExpectedTriggerDate: undefined,
  })

  expect(new TradePlotProfitizer(itpp)).toMatchObject({
    ...itpp,
    updated: expect.any(Date),
    created: expect.any(Date),
  })
})

test('copyObject', () => {
  const profitizer = new TradePlotProfitizer()
  profitizer.copyObject(itpp)

  expect(profitizer).toMatchObject({
    ...itpp,
    id: expect.any(String),
    updated: expect.any(Date),
    created: expect.any(Date),
  })
})

test('Create', () => {
  let profitizer = TradePlotProfitizer.Create(itpp)

  expect(profitizer).toBeInstanceOf(TradePlotProfitizer)
  expect(profitizer).toMatchObject({
    ...itpp,
    id: expect.any(String),
    updated: expect.any(Date),
    created: expect.any(Date),
    targetHigh: Infinity,
    targetLow: Infinity,
  })

  profitizer = TradePlotProfitizer.Create(itpp, assetQuote)
  expect(profitizer).toBeInstanceOf(TradePlotProfitizer)
  expect(profitizer).toMatchObject({
    ...itpp,
    id: expect.any(String),
    updated: expect.any(Date),
    created: expect.any(Date),
    targetHigh: Infinity,
    targetLow: Infinity,
    currentPrice: 18.97,
    previousClose: null,
    openPrice: 16.838,
    quoteTimeInLong: 1706804186,
    percentToTargetHigh: Infinity,
    percentToTargetLow: -Infinity,
    amountToTargetHigh: undefined,
    amountToTargetLow: undefined,
  })
})

test('GetProfitForRowItems', () => {
  const profitizer = TradePlotProfitizer.GetProfitForRowItems(
    arrITradePlotProfitizer
  )

  expect(profitizer).toBe(100)

  const tpp = deepCloneJson(arrITradePlotProfitizer[0])
  tpp.profit = undefined
  expect(TradePlotProfitizer.GetProfitForRowItems(tpp)).toBe(0)
})

test('MapToPlotMsg', () => {
  const profitizer = TradePlotProfitizer.MapToPlotMsg(itpp)

  expect(profitizer).toMatchObject({
    lineColor: '#00ff00',
    msgText: 'Please setup targets in your trade plot.',
    price: undefined,
    quantity: 0,
    symbol: '',
  })

  const itp: ITradePlotProfitizer = deepCloneJson(arrITradePlotProfitizer[0])
  expect(TradePlotProfitizer.MapToPlotMsg(itp)).toMatchObject({
    lineColor: '#00ff00',
    msgText: 'Currently up $100.00!',
    price: undefined,
    quantity: 100,
    symbol: 'AAPL',
  })

  const itpNoProfit: ITradePlotProfitizer = deepCloneJson(itp)
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
  const profitizer = new TradePlotProfitizer()
  const comment = profitizer.getCommentFromPattern('TestPattern')

  expect(comment).toBe('')
})

test('getCommentFromPattern with unknown pattern', () => {
  const profitizer = new TradePlotProfitizer()
  const comment = profitizer.getCommentFromPattern('UnknownPattern')

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
  const profitizer = new TradePlotProfitizer()

  expect(profitizer.getCommentFromPattern('TestPattern')).toBe('')
  expect(profitizer.getCommentFromPattern('b28')).toBe(
    'This is a back to the 8. It is one of the most common fundamentals in moving averages.'
  )
  expect(profitizer.getCommentFromPattern('ra200')).toBe(
    'When you have resistance at the 200-day moving average on the daily chart. Acts as a ceiling, and typically some type of bounce is expected.'
  )
  expect(profitizer.getCommentFromPattern('ra50')).toBe(
    'When you have resistance at the 50-day moving average on the daily chart. Acts as a ceiling, and typically some type of bounce is expected.'
  )
  expect(profitizer.getCommentFromPattern('spt200')).toBe(
    'When you have support at the 200-day moving average on the daily chart. Acts as a floor, and typically some type of bounce is expected.'
  )
  expect(profitizer.getCommentFromPattern('spt50')).toBe(
    'When you have support at the 50-day moving average on the daily chart. Acts as a floor, and typically some type of bounce is expected.'
  )
  expect(profitizer.getCommentFromPattern('x8x21')).toBe(
    'When the 8- and 21-day moving averages cross each other. Follow the 8.'
  )
  expect(profitizer.getCommentFromPattern('unknownPattern')).toBe('')
})
