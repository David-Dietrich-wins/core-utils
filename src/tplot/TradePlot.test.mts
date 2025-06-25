import { ZodError } from 'zod/v4'
import { ZodTestHelper } from '../jest.setup.mjs'
import { ISubplot, Subplot } from './Subplot.mjs'
import { TradePlot } from './TradePlot.mjs'
import { deepCloneJson } from '../services/object-helper.mjs'

const iSubplot: ISubplot = {
  id: '123',
  orderNumber: 1,
  pattern: 'TestPattern',
  timeframe: '1D',
  total: 0,
  targetLow: 150,
  targetHigh: 200,
  expectedTriggerDate: new Date('2025-12-03'),
  comment: 'Test Subplot',
  lossFloorPercent: 0.05,
  gainCeilingPercent: 0.1,
  useMinusEight: false,
  scaleInverted: false,
}

const testSubplots = [
  new Subplot(iSubplot),
  new Subplot({
    id: '456',
    orderNumber: 2,
    pattern: 'AnotherPattern',
    timeframe: '1W',
    total: 0,
    targetLow: 100,
    targetHigh: 250,
    expectedTriggerDate: new Date('2025-12-10'),
    comment: 'Another Subplot',
    lossFloorPercent: 0.03,
    gainCeilingPercent: 0.15,
    useMinusEight: true,
    scaleInverted: true,
  }),
]

test('constructor', () => {
  const subplot = new Subplot({
    id: '1',
    comment: 'Test comment',
    expectedTriggerDate: new Date('2023-10-01'),
    gainCeilingPercent: 10,
    lossFloorPercent: 5,
    orderNumber: 1,
    pattern: 'b28',
    scaleInverted: false,
    targetHigh: 155,
    targetLow: 145,
    timeframe: '1d',
    useMinusEight: true,
  })

  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: [subplot],
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.ticker).toBe('AAPL')
  expect(tradePlot.description).toBe('Test Trade Plot')
  expect(tradePlot.goal).toBe(150)
  expect(tradePlot.isShort).toBe(false)
  expect(tradePlot.purchase).toBe(145)
  expect(tradePlot.shares).toBe(10)
  expect(tradePlot.updatedby).toBe('TradePlot')
  expect(tradePlot.createdby).toBe('TradePlot')
  expect(tradePlot.subplots.length).toBe(1)
  expect(tradePlot.subplots[0].pattern).toBe('b28')
  expect(tradePlot.subplots[0].targetHigh).toBe(155)
  expect(tradePlot.subplots[0].targetLow).toBe(145)
  expect(tradePlot.getPatternCount()).toBe(1)
  expect(tradePlot.getTargetHigh()).toBe(155)
  expect(tradePlot.getTargetLow()).toBe(145)
  expect(tradePlot.toApi()).toMatchObject({
    id: expect.any(String),
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: [
      {
        id: '1',
        comment: 'Test comment',
        expectedTriggerDate: new Date('2023-10-01'),
        gainCeilingPercent: 10,
        lossFloorPercent: 5,
        orderNumber: 1,
        pattern: 'b28',
        scaleInverted: false,
        targetHigh: 155,
        targetLow: 145,
        timeframe: '1d',
        useMinusEight: true,
      },
    ],
    updatedby: 'TradePlot',
    updated: expect.any(Date),
    createdby: 'TradePlot',
    created: expect.any(Date),
  })

  expect(new TradePlot()).toMatchObject({
    ticker: '',
    description: '',
    goal: undefined,
    isShort: false,
    purchase: undefined,
    shares: 0,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: expect.any(Date),
    created: expect.any(Date),
    subplots: [],
    id: expect.any(String),
  })

  expect(new TradePlot({ id: 'my string' })).toMatchObject({
    ticker: '',
    description: '',
    goal: undefined,
    isShort: false,
    purchase: undefined,
    shares: 0,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: expect.any(Date),
    created: expect.any(Date),
    subplots: [],
    id: expect.any(String),
  })

  expect(new TradePlot({ subplots: [iSubplot] })).toMatchObject({
    ticker: '',
    description: '',
    goal: undefined,
    isShort: false,
    purchase: undefined,
    shares: 0,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: expect.any(Date),
    created: expect.any(Date),
    subplots: [
      {
        id: '123',
        orderNumber: 1,
        pattern: 'TestPattern',
        timeframe: '1D',
        total: 0,
        targetLow: 150,
        targetHigh: 200,
        expectedTriggerDate: new Date('2025-12-03'),
        comment: 'Test Subplot',
        lossFloorPercent: 0.05,
        gainCeilingPercent: 0.1,
        useMinusEight: false,
        scaleInverted: false,
      },
    ],
    id: expect.any(String),
  })
})

describe('CreateFromTicker', () => {
  test('should create TradePlot from ticker', () => {
    const tradePlot = TradePlot.CreateFromTicker('AAPL', 'test@test.com')

    expect(tradePlot.ticker).toBe('AAPL')
    expect(tradePlot.description).toBe('')
    expect(tradePlot.goal).toBeUndefined()
    expect(tradePlot.isShort).toBe(false)
    expect(tradePlot.purchase).toBeUndefined()
    expect(tradePlot.shares).toBe(0)
    expect(tradePlot.updatedby).toBe('test@test.com')
    expect(tradePlot.createdby).toBe('test@test.com')
    expect(tradePlot.subplots.length).toBe(1)
    expect(tradePlot.id).toStrictEqual(expect.any(String))
    expect(tradePlot.updated).toBeInstanceOf(Date)
    expect(tradePlot.created).toBeInstanceOf(Date)
    expect(tradePlot.toApi()).toMatchObject({
      id: expect.any(String),
      ticker: 'AAPL',
      description: '',
      goal: undefined,
      isShort: false,
      purchase: undefined,
      shares: 0,
      subplots: [
        {
          id: expect.any(String),
          comment: '',
          expectedTriggerDate: undefined,
          gainCeilingPercent: 10,
          lossFloorPercent: 8,
          orderNumber: 0,
          pattern: 'b28',
          scaleInverted: false,
          targetHigh: 1000,
          targetLow: 0,
          timeframe: '1d',
          useMinusEight: true,
        },
      ],
      updatedby: 'test@test.com',
      createdby: 'test@test.com',
      updated: expect.any(Date),
      created: expect.any(Date),
    })
  })

  test('bad email', () => {
    try {
      TradePlot.CreateFromTicker('AAPL', 'Test Trade Plot')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e).toBeInstanceOf(ZodError)
      expect(e.issues.length).toBe(1)
      expect(e.stack).toBeDefined()

      expect(e).toMatchObject(ZodTestHelper.Issue(ZodTestHelper.InvalidEmail()))
    }

    expect.assertions(4)
  })

  test('bad empty ticker', () => {
    try {
      TradePlot.CreateFromTicker('', 'test@test.com')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e).toBeInstanceOf(ZodError)
      expect(e.issues.length).toBe(1)
      expect(e.stack).toBeDefined()

      expect(e).toMatchObject(
        ZodTestHelper.Issue(ZodTestHelper.StringTooSmall(1))
      )
    }

    expect.assertions(4)
  })
})

test('FixupForSave', () => {
  const tradePlot = TradePlot.CreateFromTicker('AAPL', 'test@test.com')
  tradePlot.subplots[0].expectedTriggerDate = new Date('2023-10-01')
  expect(tradePlot.subplots[0].expectedTriggerDate).toEqual(expect.any(Date))

  const fixedTradePlot = TradePlot.FixupForSave(tradePlot)
  expect(fixedTradePlot.subplots[0].expectedTriggerDate).toBeUndefined()

  delete tradePlot.subplots[0].expectedTriggerDate
  const fixedTradePlot2 = TradePlot.FixupForSave(tradePlot)
  expect(fixedTradePlot2.subplots[0].expectedTriggerDate).toBeUndefined()
})

test('copyObject', () => {
  const original = TradePlot.CreateFromTicker('AAPL', 'test@test.com')
  const updated = TradePlot.CreateFromTicker('TSLA', 'test-tesla@test.com')

  original.copyObject(updated)

  expect(original).not.toBe(updated)
  expect(original).toMatchObject(updated)

  updated.goal = 200
  updated.purchase = 180
  updated.shares = 100

  original.copyObject(updated)

  expect(original).not.toBe(updated)
  expect(original).toMatchObject(updated)

  original.copyObject({
    ...updated,
    createdby: '',
    updatedby: '',
  })
  expect(original.createdby).toBe('TradePlot')
  expect(original.updatedby).toBe('TradePlot')
})

test('misc', () => {
  const currentPrice = 100

  const subplot = new Subplot({
    id: '1',
    comment: 'Test comment',
    expectedTriggerDate: new Date('2023-10-01'),
    gainCeilingPercent: 10,
    lossFloorPercent: 5,
    orderNumber: 1,
    pattern: 'b28',
    scaleInverted: false,
    targetHigh: 155,
    targetLow: 145,
    timeframe: '1d',
    useMinusEight: true,
  })
  const subplot2 = new Subplot({
    id: '2',
    comment: 'Another comment',
    expectedTriggerDate: new Date('2023-10-01'),
    gainCeilingPercent: 10,
    lossFloorPercent: 5,
    orderNumber: 1,
    pattern: 'b28',
    scaleInverted: false,
    targetHigh: 200,
    targetLow: 180,
    timeframe: '1d',
    useMinusEight: true,
  })

  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: [subplot, subplot2],
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.getPatternCount()).toBe(2)
  expect(tradePlot.getTargetHigh()).toBe(155)
  expect(tradePlot.getTargetLow()).toBe(145)

  expect(tradePlot.investmentAmountGain(currentPrice)).toBe(-450)
  expect(tradePlot.investmentAmountGainDisplay(currentPrice, 2)).toBe(
    '-$450.00'
  )
  expect(tradePlot.investmentAmountGainPercent(currentPrice)).toBe(
    -0.3103448275862069
  )
  expect(tradePlot.investmentAmountGainPercentDisplay(currentPrice)).toBe(
    '-31.03%'
  )

  expect(tradePlot.investmentAmountStart).toBe(1450)
  expect(tradePlot.investmentAmountStartDisplay).toBe('$1,450.00')
  expect(tradePlot.startingInvestment).toBe(1450)
  expect(tradePlot.getAmountToGoal(currentPrice)).toBe(-50)
  expect(tradePlot.getPercentToGoal(currentPrice)).toBe(-0.3333333333333333)
  expect(tradePlot.getProfit(currentPrice)).toBe(-450)
  expect(tradePlot.getMaxExpectedTriggerDate(Date.now())).toBeUndefined()
  expect(tradePlot.getNextExpectedTriggerDate(Date.now())).toBeUndefined()
  expect(tradePlot.getNextOrderNumber(Date.now())).toBeUndefined()
  expect(tradePlot.getPrevExpectedTriggerDate(Date.now())).toEqual(
    expect.any(Date)
  )
  expect(tradePlot.getAmountToTargetHigh(currentPrice)).toBe(55)
  expect(tradePlot.getAmountToTargetLow(currentPrice)).toBe(-45)
  expect(tradePlot.getPercentToTargetHigh(currentPrice)).toBe(0.55)
  expect(tradePlot.getPercentToTargetLow(currentPrice)).toBe(-0.45)
})

test('getNextOrderNumber', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.getNextOrderNumber(Date.now())).toBe(2)

  const splots: ISubplot[] = deepCloneJson(testSubplots)
  splots[0].expectedTriggerDate = undefined
  splots[1].expectedTriggerDate = undefined
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getNextOrderNumber(Date.now())).toBeUndefined()

  splots[1].expectedTriggerDate = new Date('2025-12-10')
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getNextOrderNumber(Date.now())).toBe(2)
})

test('getMinExpectedTriggerDate', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.getMinExpectedTriggerDate(Date.now())).toEqual(
    new Date('2025-12-03')
  )

  const splots: ISubplot[] = deepCloneJson(testSubplots)
  splots[0].expectedTriggerDate = undefined
  splots[1].expectedTriggerDate = undefined
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getMinExpectedTriggerDate(Date.now())).toBeUndefined()

  tradePlot.subplots[0].expectedTriggerDate = new Date('2025-12-10')
  expect(tradePlot.getMinExpectedTriggerDate(Date.now())).toBeUndefined()
})

test('getMaxExpectedTriggerDate', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.getMaxExpectedTriggerDate(Date.now())).toEqual(
    new Date('2025-12-10')
  )

  const splots: ISubplot[] = deepCloneJson(testSubplots)
  splots[0].expectedTriggerDate = undefined
  splots[1].expectedTriggerDate = undefined
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getMaxExpectedTriggerDate(Date.now())).toBeUndefined()

  tradePlot.subplots[0].expectedTriggerDate = new Date('2025-12-10')
  expect(tradePlot.getMaxExpectedTriggerDate(Date.now())).toStrictEqual(
    new Date('2025-12-10')
  )
})

test('investmentAmountStartDisplay', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.investmentAmountStartDisplay).toBe('$0')
})

test('investmentAmountGain', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.investmentAmountGain(100)).toBeUndefined()

  tradePlot.isShort = true
  expect(tradePlot.investmentAmountGain(100)).toBeUndefined()

  tradePlot.purchase = 150
  expect(tradePlot.investmentAmountGain(100)).toBe(500)

  tradePlot.isShort = false
  expect(tradePlot.investmentAmountGain(100)).toBe(-500)
})

test('investmentAmountGainDisplay', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.investmentAmountGainDisplay(100, 2)).toBe('$0')
})

test('investmentAmountGainPercentDisplay', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.investmentAmountGainPercentDisplay(100)).toBe('0%')

  tradePlot.isShort = true
  expect(tradePlot.investmentAmountGainPercentDisplay(100)).toBe('0%')

  tradePlot.purchase = 150
  expect(tradePlot.investmentAmountGainPercentDisplay(100)).toBe('+50.00%')

  tradePlot.isShort = false
  expect(tradePlot.investmentAmountGainPercentDisplay(100)).toBe('-33.33%')
})

test('zSchema', () => {
  const tradePlot = TradePlot.zSchema.parse({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot).toBeDefined()
  expect(tradePlot).toMatchObject({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        orderNumber: 1,
        pattern: 'TestPattern',
        timeframe: '1D',
        total: 0,
        targetLow: 150,
        targetHigh: 200,
        expectedTriggerDate: new Date('2025-12-03'),
        comment: 'Test Subplot',
        lossFloorPercent: 0.05,
        gainCeilingPercent: 0.1,
        useMinusEight: false,
        scaleInverted: false,
      }),
      expect.objectContaining({
        id: expect.any(String),
        orderNumber: 2,
        pattern: 'AnotherPattern',
        timeframe: '1W',
        total: 0,
        targetLow: 100,
        targetHigh: 250,
        expectedTriggerDate: new Date('2025-12-10'),
        comment: 'Another Subplot',
        lossFloorPercent: 0.03,
        gainCeilingPercent: 0.15,
        useMinusEight: true,
        scaleInverted: true,
      }),
    ]),
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: expect.any(Date),
    created: expect.any(Date),
  })
})

test('getAmountToTargetHigh', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.getAmountToTargetHigh(100)).toBe(100)
  expect(tradePlot.getAmountToTargetHigh()).toBeUndefined()
})

test('getAmountToTargetLow', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.getAmountToTargetLow(100)).toBe(0)
  expect(tradePlot.getAmountToTargetLow()).toBeUndefined()
})

test('getPreviousExpectedTriggerDate', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.getPrevExpectedTriggerDate(Date.now())).toBeUndefined()

  const splots: ISubplot[] = deepCloneJson(testSubplots)
  splots[0].expectedTriggerDate = undefined
  splots[1].expectedTriggerDate = undefined
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getPrevExpectedTriggerDate(Date.now())).toBeUndefined()
})

test('getProfit', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: true,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.getProfit(100)).toBe(450)
  expect(tradePlot.getProfit()).toBeUndefined()
})

test('startingInvestment', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  expect(tradePlot.startingInvestment).toBe(1450)

  tradePlot.purchase = undefined
  expect(tradePlot.startingInvestment).toBe(0)
})

test('getTargetHigh', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  const splots: ISubplot[] = deepCloneJson(testSubplots)
  splots[0].targetHigh = 100
  splots[1].targetHigh = undefined
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getTargetHigh()).toBe(100)
})

test('getTargetLow', () => {
  const tradePlot = new TradePlot({
    ticker: 'AAPL',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    updatedby: 'TradePlot',
    createdby: 'TradePlot',
    updated: new Date(),
    created: new Date(),
  })

  const splots: ISubplot[] = deepCloneJson(testSubplots)
  splots[0].targetLow = 100
  splots[1].targetLow = undefined
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getTargetLow()).toBe(100)
})
