/* eslint-disable @typescript-eslint/no-misused-spread */
import * as z from 'zod/v4'
import { ISubplot, Subplot } from './Subplot.mjs'
import { TradePlot } from './TradePlot.mjs'
import { ZodTestHelper } from '../jest.setup.mjs'
import { deepCloneJson } from '../services/primitives/object-helper.mjs'

const iSubplot: ISubplot = {
    comment: 'Test Subplot',
    expectedTriggerDate: new Date('2025-12-03'),
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
  testSubplots = [
    new Subplot(iSubplot),
    new Subplot({
      comment: 'Another Subplot',
      expectedTriggerDate: new Date('2025-12-10'),
      gainCeilingPercent: 0.15,
      id: '456',
      lossFloorPercent: 0.03,
      orderNumber: 2,
      pattern: 'AnotherPattern',
      scaleInverted: true,
      targetHigh: 250,
      targetLow: 100,
      timeframe: '1W',
      total: 0,
      useMinusEight: true,
    }),
  ]

test('constructor', () => {
  const subplot = new Subplot({
      comment: 'Test comment',
      expectedTriggerDate: new Date('2023-10-01'),
      gainCeilingPercent: 10,
      id: '1',
      lossFloorPercent: 5,
      orderNumber: 1,
      pattern: 'b28',
      scaleInverted: false,
      targetHigh: 155,
      targetLow: 145,
      timeframe: '1d',
      useMinusEight: true,
    }),
    tradePlot = new TradePlot({
      created: new Date(),
      createdby: 'TradePlot',
      description: 'Test Trade Plot',
      goal: 150,
      isShort: false,
      purchase: 145,
      shares: 10,
      subplots: [subplot],
      ticker: 'AAPL',
      updated: new Date(),
      updatedby: 'TradePlot',
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
    created: expect.any(Date),
    createdby: 'TradePlot',
    description: 'Test Trade Plot',
    goal: 150,
    id: expect.any(String),
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: [
      {
        comment: 'Test comment',
        expectedTriggerDate: new Date('2023-10-01'),
        gainCeilingPercent: 10,
        id: '1',
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
    ticker: 'AAPL',
    updated: expect.any(Date),
    updatedby: 'TradePlot',
  })

  expect(new TradePlot()).toMatchObject({
    created: expect.any(Date),
    createdby: 'TradePlot',
    description: '',
    goal: undefined,
    id: expect.any(String),
    isShort: false,
    purchase: undefined,
    shares: 0,
    subplots: [],
    ticker: '',
    updated: expect.any(Date),
    updatedby: 'TradePlot',
  })

  expect(new TradePlot({ id: 'my string' })).toMatchObject({
    created: expect.any(Date),
    createdby: 'TradePlot',
    description: '',
    goal: undefined,
    id: expect.any(String),
    isShort: false,
    purchase: undefined,
    shares: 0,
    subplots: [],
    ticker: '',
    updated: expect.any(Date),
    updatedby: 'TradePlot',
  })

  expect(new TradePlot({ subplots: [iSubplot] })).toMatchObject({
    created: expect.any(Date),
    createdby: 'TradePlot',
    description: '',
    goal: undefined,
    id: expect.any(String),
    isShort: false,
    purchase: undefined,
    shares: 0,
    subplots: [
      {
        comment: 'Test Subplot',
        expectedTriggerDate: new Date('2025-12-03'),
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
    ],
    ticker: '',
    updated: expect.any(Date),
    updatedby: 'TradePlot',
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
      created: expect.any(Date),
      createdby: 'test@test.com',
      description: '',
      goal: undefined,
      id: expect.any(String),
      isShort: false,
      purchase: undefined,
      shares: 0,
      subplots: [
        {
          comment: '',
          expectedTriggerDate: undefined,
          gainCeilingPercent: 10,
          id: expect.any(String),
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
      ticker: 'AAPL',
      updated: expect.any(Date),
      updatedby: 'test@test.com',
    })
  })

  test('bad email', () => {
    try {
      TradePlot.CreateFromTicker('AAPL', 'Test Trade Plot')
    } catch (e) {
      expect(e).toBeInstanceOf(z.ZodError)
      expect((e as z.ZodError).issues.length).toBe(1)
      expect((e as z.ZodError).stack).toBeDefined()

      expect(e).toMatchObject(ZodTestHelper.Issue(ZodTestHelper.InvalidEmail()))
    }

    expect.assertions(4)
  })

  test('bad empty ticker', () => {
    try {
      TradePlot.CreateFromTicker('', 'test@test.com')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e).toBeInstanceOf(z.ZodError)
      expect((e as z.ZodError).issues.length).toBe(1)
      expect((e as z.ZodError).stack).toBeDefined()

      const retzod = e as z.ZodError
      expect(retzod.issues).toEqual([ZodTestHelper.StringTooSmall(1, [], true)])
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
  const original = TradePlot.CreateFromTicker('AAPL', 'test@test.com'),
    updated = TradePlot.CreateFromTicker('TSLA', 'test-tesla@test.com')

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
  const currentPrice = 100,
    subplot = new Subplot({
      comment: 'Test comment',
      expectedTriggerDate: new Date('2023-10-01'),
      gainCeilingPercent: 10,
      id: '1',
      lossFloorPercent: 5,
      orderNumber: 1,
      pattern: 'b28',
      scaleInverted: false,
      targetHigh: 155,
      targetLow: 145,
      timeframe: '1d',
      useMinusEight: true,
    }),
    subplot2 = new Subplot({
      comment: 'Another comment',
      expectedTriggerDate: new Date('2023-10-01'),
      gainCeilingPercent: 10,
      id: '2',
      lossFloorPercent: 5,
      orderNumber: 1,
      pattern: 'b28',
      scaleInverted: false,
      targetHigh: 200,
      targetLow: 180,
      timeframe: '1d',
      useMinusEight: true,
    }),
    tradePlot = new TradePlot({
      created: new Date(),
      createdby: 'TradePlot',
      description: 'Test Trade Plot',
      goal: 150,
      isShort: false,
      purchase: 145,
      shares: 10,
      subplots: [subplot, subplot2],
      ticker: 'AAPL',
      updated: new Date(),
      updatedby: 'TradePlot',
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
  const splots: ISubplot[] = deepCloneJson(testSubplots),
    tradePlot = new TradePlot({
      created: new Date(),
      createdby: 'TradePlot',
      description: 'Test Trade Plot',
      goal: 150,
      isShort: false,
      purchase: 145,
      shares: 10,
      subplots: testSubplots,
      ticker: 'AAPL',
      updated: new Date(),
      updatedby: 'TradePlot',
    })

  expect(tradePlot.getNextOrderNumber(Date.now())).toBe(2)

  splots[0].expectedTriggerDate = undefined
  splots[1].expectedTriggerDate = undefined
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getNextOrderNumber(Date.now())).toBeUndefined()

  splots[1].expectedTriggerDate = new Date('2025-12-10')
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getNextOrderNumber(Date.now())).toBe(2)
})

test('getMinExpectedTriggerDate', () => {
  const splots: ISubplot[] = deepCloneJson(testSubplots),
    tradePlot = new TradePlot({
      created: new Date(),
      createdby: 'TradePlot',
      description: 'Test Trade Plot',
      goal: 150,
      isShort: false,
      purchase: 145,
      shares: 10,
      subplots: testSubplots,
      ticker: 'AAPL',
      updated: new Date(),
      updatedby: 'TradePlot',
    })

  expect(tradePlot.getMinExpectedTriggerDate(Date.now())).toEqual(
    new Date('2025-12-03')
  )

  splots[0].expectedTriggerDate = undefined
  splots[1].expectedTriggerDate = undefined
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getMinExpectedTriggerDate(Date.now())).toBeUndefined()

  tradePlot.subplots[0].expectedTriggerDate = new Date('2025-12-10')
  expect(tradePlot.getMinExpectedTriggerDate(Date.now())).toBeUndefined()
})

test('getMaxExpectedTriggerDate', () => {
  const splots: ISubplot[] = deepCloneJson(testSubplots),
    tradePlot = new TradePlot({
      created: new Date(),
      createdby: 'TradePlot',
      description: 'Test Trade Plot',
      goal: 150,
      isShort: false,
      purchase: 145,
      shares: 10,
      subplots: testSubplots,
      ticker: 'AAPL',
      updated: new Date(),
      updatedby: 'TradePlot',
    })

  expect(tradePlot.getMaxExpectedTriggerDate(Date.now())).toEqual(
    new Date('2025-12-10')
  )

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
    created: new Date(),
    createdby: 'TradePlot',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: testSubplots,
    ticker: 'AAPL',
    updated: new Date(),
    updatedby: 'TradePlot',
  })

  expect(tradePlot.investmentAmountStartDisplay).toBe('$0')
})

test('investmentAmountGain', () => {
  const tradePlot = new TradePlot({
    created: new Date(),
    createdby: 'TradePlot',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: testSubplots,
    ticker: 'AAPL',
    updated: new Date(),
    updatedby: 'TradePlot',
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
    created: new Date(),
    createdby: 'TradePlot',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: testSubplots,
    ticker: 'AAPL',
    updated: new Date(),
    updatedby: 'TradePlot',
  })

  expect(tradePlot.investmentAmountGainDisplay(100, 2)).toBe('$0')
})

test('investmentAmountGainPercentDisplay', () => {
  const tradePlot = new TradePlot({
    created: new Date(),
    createdby: 'TradePlot',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: testSubplots,
    ticker: 'AAPL',
    updated: new Date(),
    updatedby: 'TradePlot',
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
    created: new Date(),
    createdby: 'TradePlot',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: testSubplots,
    ticker: 'AAPL',
    updated: new Date(),
    updatedby: 'TradePlot',
  })

  expect(tradePlot).toBeDefined()
  expect(tradePlot).toMatchObject({
    created: expect.any(Date),
    createdby: 'TradePlot',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: undefined,
    shares: 10,
    subplots: expect.arrayContaining([
      expect.objectContaining({
        comment: 'Test Subplot',
        expectedTriggerDate: new Date('2025-12-03'),
        gainCeilingPercent: 0.1,
        id: expect.any(String),
        lossFloorPercent: 0.05,
        orderNumber: 1,
        pattern: 'TestPattern',
        scaleInverted: false,
        targetHigh: 200,
        targetLow: 150,
        timeframe: '1D',
        total: 0,
        useMinusEight: false,
      }),
      expect.objectContaining({
        comment: 'Another Subplot',
        expectedTriggerDate: new Date('2025-12-10'),
        gainCeilingPercent: 0.15,
        id: expect.any(String),
        lossFloorPercent: 0.03,
        orderNumber: 2,
        pattern: 'AnotherPattern',
        scaleInverted: true,
        targetHigh: 250,
        targetLow: 100,
        timeframe: '1W',
        total: 0,
        useMinusEight: true,
      }),
    ]),
    ticker: 'AAPL',
    updated: expect.any(Date),
    updatedby: 'TradePlot',
  })
})

test('getAmountToTargetHigh', () => {
  const tradePlot = new TradePlot({
    created: new Date(),
    createdby: 'TradePlot',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    ticker: 'AAPL',
    updated: new Date(),
    updatedby: 'TradePlot',
  })

  expect(tradePlot.getAmountToTargetHigh(100)).toBe(100)
  expect(tradePlot.getAmountToTargetHigh()).toBeUndefined()
})

test('getAmountToTargetLow', () => {
  const tradePlot = new TradePlot({
    created: new Date(),
    createdby: 'TradePlot',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    ticker: 'AAPL',
    updated: new Date(),
    updatedby: 'TradePlot',
  })

  expect(tradePlot.getAmountToTargetLow(100)).toBe(0)
  expect(tradePlot.getAmountToTargetLow()).toBeUndefined()
})

test('getPreviousExpectedTriggerDate', () => {
  const splots: ISubplot[] = deepCloneJson(testSubplots),
    tradePlot = new TradePlot({
      created: new Date(),
      createdby: 'TradePlot',
      description: 'Test Trade Plot',
      goal: 150,
      isShort: false,
      purchase: 145,
      shares: 10,
      subplots: testSubplots,
      ticker: 'AAPL',
      updated: new Date(),
      updatedby: 'TradePlot',
    })

  expect(tradePlot.getPrevExpectedTriggerDate(Date.now())).toBeUndefined()

  splots[0].expectedTriggerDate = undefined
  splots[1].expectedTriggerDate = undefined
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getPrevExpectedTriggerDate(Date.now())).toBeUndefined()
})

test('getProfit', () => {
  const tradePlot = new TradePlot({
    created: new Date(),
    createdby: 'TradePlot',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: true,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    ticker: 'AAPL',
    updated: new Date(),
    updatedby: 'TradePlot',
  })

  expect(tradePlot.getProfit(100)).toBe(450)
  expect(tradePlot.getProfit()).toBeUndefined()
})

test('startingInvestment', () => {
  const tradePlot = new TradePlot({
    created: new Date(),
    createdby: 'TradePlot',
    description: 'Test Trade Plot',
    goal: 150,
    isShort: false,
    purchase: 145,
    shares: 10,
    subplots: testSubplots,
    ticker: 'AAPL',
    updated: new Date(),
    updatedby: 'TradePlot',
  })

  expect(tradePlot.startingInvestment).toBe(1450)

  tradePlot.purchase = undefined
  expect(tradePlot.startingInvestment).toBe(0)
})

test('getTargetHigh', () => {
  const splots: ISubplot[] = deepCloneJson(testSubplots),
    tradePlot = new TradePlot({
      created: new Date(),
      createdby: 'TradePlot',
      description: 'Test Trade Plot',
      goal: 150,
      isShort: false,
      purchase: 145,
      shares: 10,
      subplots: testSubplots,
      ticker: 'AAPL',
      updated: new Date(),
      updatedby: 'TradePlot',
    })

  splots[0].targetHigh = 100
  splots[1].targetHigh = undefined
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getTargetHigh()).toBe(100)
})

test('getTargetLow', () => {
  const splots: ISubplot[] = deepCloneJson(testSubplots),
    tradePlot = new TradePlot({
      created: new Date(),
      createdby: 'TradePlot',
      description: 'Test Trade Plot',
      goal: 150,
      isShort: false,
      purchase: 145,
      shares: 10,
      subplots: testSubplots,
      ticker: 'AAPL',
      updated: new Date(),
      updatedby: 'TradePlot',
    })

  splots[0].targetLow = 100
  splots[1].targetLow = undefined
  tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))
  expect(tradePlot.getTargetLow()).toBe(100)
})
