import { success, ZodError } from 'zod/v4'
import { ZodTestHelper } from '../jest.setup.mjs'
import { Subplot } from './Subplot.mjs'
import { TradePlot } from './TradePlot.mjs'
import { safeJsonToString } from '../index.mjs'

test('TradePlot', () => {
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
      // expect(safeJsonToString(e)).toBe('')
      expect(e.issues.length).toBeGreaterThan(0)
      expect(e.stack).toBeDefined()

      expect(e).toMatchObject(ZodTestHelper.Issue(ZodTestHelper.InvalidEmail()))
    }
  })

  // test('should handle empty ticker', () => {
  //   const tradePlot = TradePlot.CreateFromTicker('', 'Test Trade Plot')

  //   expect(tradePlot.ticker).toBe('')
  //   expect(tradePlot.description).toBe('Test Trade Plot')
  //   expect(tradePlot.goal).toBe(150)
  //   expect(tradePlot.isShort).toBe(false)
  //   expect(tradePlot.purchase).toBe(145)
  //   expect(tradePlot.shares).toBe(10)
  //   expect(tradePlot.updatedby).toBe('TradePlot')
  //   expect(tradePlot.createdby).toBe('TradePlot')
  //   expect(tradePlot.subplots.length).toBe(0)
  // })
})
