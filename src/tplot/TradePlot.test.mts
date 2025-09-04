/* eslint-disable @typescript-eslint/no-misused-spread */
import * as z from 'zod/v4'
import { type ISubplot, Subplot } from './Subplot.mjs'
import { describe, expect, it } from '@jest/globals'
import { TradePlot } from './TradePlot.mjs'
import { ZodTestHelper } from '../jest.setup.mjs'
import { deepCloneJson } from '../primitives/object-helper.mjs'

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

describe('createFromTicker', () => {
  it('should create TradePlot from ticker', () => {
    expect.hasAssertions()

    const tradePlot = TradePlot.createFromTicker('AAPL', 'test@test.com')

    expect(tradePlot.ticker).toBe('AAPL')
    expect(tradePlot.description).toBe('')
    expect(tradePlot.goal).toBeUndefined()
    expect(tradePlot.isShort).toBe(false)
    expect(tradePlot.purchase).toBeUndefined()
    expect(tradePlot.shares).toBe(0)
    expect(tradePlot.updatedby).toBe('test@test.com')
    expect(tradePlot.createdby).toBe('test@test.com')
    expect(tradePlot.subplots).toHaveLength(1)
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

  it('bad email', () => {
    expect.assertions(4)

    let err: unknown
    try {
      TradePlot.createFromTicker('AAPL', 'Test Trade Plot')
    } catch (e) {
      err = e
    }

    expect(err).toBeInstanceOf(z.ZodError)
    expect((err as z.ZodError).issues).toHaveLength(1)
    expect((err as z.ZodError).stack).toBeDefined()

    expect(err).toMatchObject(ZodTestHelper.Issue(ZodTestHelper.InvalidEmail()))
  })

  it('bad empty ticker', () => {
    expect.assertions(4)

    let err: unknown
    try {
      TradePlot.createFromTicker('', 'test@test.com')
    } catch (e) {
      err = e
    }

    expect(err).toBeInstanceOf(z.ZodError)

    const retzod = err as z.ZodError

    expect(retzod.issues).toHaveLength(1)
    expect(retzod.stack).toBeDefined()
    expect(retzod.issues).toStrictEqual([
      ZodTestHelper.StringTooSmall(1, [], true),
    ])
  })
})

describe('fixupForSave', () => {
  it('good case', () => {
    expect.hasAssertions()

    const tradePlot = TradePlot.createFromTicker('AAPL', 'test@test.com')
    tradePlot.subplots[0].expectedTriggerDate = new Date('2023-10-01')

    expect(tradePlot.subplots[0].expectedTriggerDate).toStrictEqual(
      expect.any(Date)
    )

    const fixedTradePlot = TradePlot.fixupForSave(tradePlot)

    expect(fixedTradePlot.subplots[0].expectedTriggerDate).toBeUndefined()

    delete tradePlot.subplots[0].expectedTriggerDate

    const fixedTradePlot2 = TradePlot.fixupForSave(tradePlot)

    expect(fixedTradePlot2.subplots[0].expectedTriggerDate).toBeUndefined()
  })
})

describe('copyObject', () => {
  it('should copy object', () => {
    expect.hasAssertions()

    const original = TradePlot.createFromTicker('AAPL', 'test@test.com'),
      updated = TradePlot.createFromTicker('TSLA', 'test-tesla@test.com')

    original.copyObject(updated)

    expect(original).not.toBe(updated)
    expect(original).toStrictEqual(updated)

    updated.goal = 200
    updated.purchase = 180
    updated.shares = 100

    original.copyObject(updated)

    expect(original).not.toBe(updated)
    expect(original).toStrictEqual(updated)

    original.copyObject({
      ...updated,
      createdby: '',
      updatedby: '',
    })

    expect(original.createdby).toBe('TradePlot')
    expect(original.updatedby).toBe('TradePlot')
  })
})

describe('misc', () => {
  it('should calculate various trade plot metrics', () => {
    expect.hasAssertions()

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
    expect(tradePlot.getPrevExpectedTriggerDate(Date.now())).toStrictEqual(
      expect.any(Date)
    )
    expect(tradePlot.getAmountToTargetHigh(currentPrice)).toBe(55)
    expect(tradePlot.getAmountToTargetLow(currentPrice)).toBe(-45)
    expect(tradePlot.getPercentToTargetHigh(currentPrice)).toBe(0.55)
    expect(tradePlot.getPercentToTargetLow(currentPrice)).toBe(-0.45)
  })
})

describe('constructor', () => {
  it('good', () => {
    expect.hasAssertions()

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
    expect(tradePlot.subplots).toHaveLength(1)
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

  it('should create a valid Subplot instance', () => {
    expect.hasAssertions()

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

    expect(tradePlot).toBeInstanceOf(TradePlot)
    //expect(tradePlot.getPercentToGoal(currentPrice)).toBe(-0.3333333333333333)
  })

  it('misc calculations', () => {
    expect.hasAssertions()

    const currentPrice = 100
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
    })
    const subplot2 = new Subplot({
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
    })
    const tradePlot = new TradePlot({
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

    expect(tradePlot.getProfit(currentPrice)).toBe(-450)
    expect(tradePlot.getMaxExpectedTriggerDate(Date.now())).toBeUndefined()
    expect(tradePlot.getNextExpectedTriggerDate(Date.now())).toBeUndefined()
    expect(tradePlot.getNextOrderNumber(Date.now())).toBeUndefined()
    expect(tradePlot.getPrevExpectedTriggerDate(Date.now())).toStrictEqual(
      expect.any(Date)
    )
    expect(tradePlot.getAmountToTargetHigh(currentPrice)).toBe(55)
    expect(tradePlot.getAmountToTargetLow(currentPrice)).toBe(-45)
    expect(tradePlot.getPercentToTargetHigh(currentPrice)).toBe(0.55)
    expect(tradePlot.getPercentToTargetLow(currentPrice)).toBe(-0.45)
  })
})

describe('getMinExpectedTriggerDate', () => {
  it('should return the minimum expected trigger date', () => {
    expect.hasAssertions()

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

    expect(tradePlot.getMinExpectedTriggerDate(Date.now())).toStrictEqual(
      new Date('2025-12-03')
    )

    splots[0].expectedTriggerDate = undefined
    splots[1].expectedTriggerDate = undefined
    tradePlot.subplots = splots.map((subplot) => new Subplot(subplot))

    expect(tradePlot.getMinExpectedTriggerDate(Date.now())).toBeUndefined()

    tradePlot.subplots[0].expectedTriggerDate = new Date('2025-12-10')

    expect(tradePlot.getMinExpectedTriggerDate(Date.now())).toBeUndefined()
  })
})

describe('getMaxExpectedTriggerDate', () => {
  it('should return the maximum expected trigger date', () => {
    expect.hasAssertions()

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

    expect(tradePlot.getMaxExpectedTriggerDate(Date.now())).toStrictEqual(
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
})

describe('investmentAmountStartDisplay', () => {
  it('should return the initial investment amount display', () => {
    expect.hasAssertions()

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
})

describe('investmentAmountGain', () => {
  it('should return the investment amount gain', () => {
    expect.hasAssertions()

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
})

describe('investmentAmountGainDisplay', () => {
  it('should return the investment amount gain display', () => {
    expect.hasAssertions()

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
})

describe('investmentAmountGainPercentDisplay', () => {
  it('should return the investment amount gain percent display', () => {
    expect.hasAssertions()

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
})

describe('zSchema', () => {
  it('should validate and create a TradePlot instance from zod schema', () => {
    expect.hasAssertions()

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
})

describe('getAmountToTargetHigh', () => {
  it('should return the amount to target high', () => {
    expect.hasAssertions()

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
})

describe('getAmountToTargetLow', () => {
  it('should return the amount to target low', () => {
    expect.hasAssertions()

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
})

describe('getPreviousExpectedTriggerDate', () => {
  it('should return the previous expected trigger date', () => {
    expect.hasAssertions()

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
})

describe('getProfit', () => {
  it('should return the profit amount', () => {
    expect.hasAssertions()

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
})

describe('startingInvestment', () => {
  it('should return the starting investment amount', () => {
    expect.hasAssertions()

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
})

describe('getNextOrderNumber', () => {
  it('should return the next order number based on expectedTriggerDate', () => {
    expect.hasAssertions()

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
})

describe('getTargetHigh', () => {
  it('should return the target high', () => {
    expect.hasAssertions()

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
})

describe('getTargetLow', () => {
  it('good', () => {
    expect.hasAssertions()

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
})
