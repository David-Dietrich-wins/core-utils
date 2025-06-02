import { ZodError } from 'zod/v4'
import { ZodTestHelper } from '../jest.setup.mjs'
import { Subplot } from './Subplot.mjs'

test('Subplot', () => {
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

  expect(subplot.pattern).toBe('b28')
  expect(subplot.targetHigh).toBe(155)
  expect(subplot.targetLow).toBe(145)
  expect(subplot.toApi()).toMatchObject({
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

  expect(Subplot.zSchema.parse(subplot.toApi())).toStrictEqual({
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
    total: undefined,
  })
})

test('Renumber', () => {
  const subplot = new Subplot({
    id: '1',
    comment: 'Test comment',
    expectedTriggerDate: new Date('2023-10-01'),
    gainCeilingPercent: 10,
    lossFloorPercent: 5,
    orderNumber: 7,
    pattern: 'b28',
    scaleInverted: false,
    targetHigh: 155,
    targetLow: 145,
    timeframe: '1d',
    useMinusEight: true,
  })

  const subplot2 = new Subplot({
    id: '1',
    comment: 'Test comment',
    expectedTriggerDate: new Date('2023-10-01'),
    gainCeilingPercent: 10,
    lossFloorPercent: 5,
    orderNumber: 5,
    pattern: 'b28',
    scaleInverted: false,
    targetHigh: 155,
    targetLow: 145,
    timeframe: '1d',
    useMinusEight: true,
  })

  expect(Subplot.Renumber([subplot, subplot2])).toStrictEqual([
    new Subplot({ ...subplot, orderNumber: 0 }),
    new Subplot({ ...subplot2, orderNumber: 1 }),
  ])
})

test('parse', () => {
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
  const parsed = Subplot.zSchema.parse(subplot.toApi())
  expect(parsed).toStrictEqual({
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
    total: undefined,
  })
  expect(parsed instanceof Subplot).toBe(false)
  expect(() =>
    Subplot.zSchema.parse({ ...parsed, orderNumber: 'not a number' })
  ).toThrow(ZodError)
  expect(() => Subplot.zSchema.parse({ ...parsed, pattern: 123 })).toThrow(
    ZodError
  )
  expect(() => Subplot.zSchema.parse({ ...parsed, timeframe: 123 })).toThrow(
    ZodError
  )
  expect(() =>
    Subplot.zSchema.parse({ ...parsed, targetHigh: 'not a number' })
  ).toThrow(ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...parsed, targetLow: 'not a number' })
  ).toThrow(ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...parsed, gainCeilingPercent: 'not a number' })
  ).toThrow(ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...parsed, lossFloorPercent: 'not a number' })
  ).toThrow(ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...parsed, useMinusEight: 'not a boolean' })
  ).toThrow(ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...parsed, scaleInverted: 'not a boolean' })
  ).toThrow(ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...parsed, expectedTriggerDate: 'not a date' })
  ).toThrow(ZodError)
  expect(() => Subplot.zSchema.parse({ ...parsed, id: 123 })).toThrow(ZodError)
  expect(() => Subplot.zSchema.parse({ ...parsed, id: null })).toThrow(ZodError)
  expect(() => Subplot.zSchema.parse({ ...parsed, id: undefined })).toThrow(
    ZodError
  )
  expect(() => Subplot.zSchema.parse({ ...parsed, id: '' })).not.toThrow(
    ZodError
  )
  expect(() => Subplot.zSchema.parse({ ...parsed, id: ' ' })).not.toThrow(
    ZodError
  )
  expect(() => Subplot.zSchema.parse({ ...parsed, id: '1' })).not.toThrow(
    ZodError
  )
  expect(() =>
    Subplot.zSchema.parse({ ...parsed, id: '1', total: 'not a number' })
  ).toThrow(ZodError)

  try {
    Subplot.zSchema.parse({
      ...parsed,
      id: '1',
      total: 'not a number',
    })
  } catch (e) {
    expect(e).toBeInstanceOf(ZodError)
  }
  expect(
    Subplot.zSchema.safeParse({
      ...parsed,
      id: '1',
      total: 'not a number',
    })
  ).toEqual(
    ZodTestHelper.SuccessFalseSingle(
      ZodTestHelper.InvalidType('number', 'string', ['total'])
    )
  )
})

test('GetFmpIndicatorQueryParams', () => {
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
  const params = Subplot.GetFmpIndicatorQueryParams('AAPL', subplot)
  expect(params).toEqual({
    from: 1764158400000,
    periodLength: 8,
    symbol: 'AAPL',
    timeframe: '1day',
  })
})

test('copyObject', () => {
  const subplot = new Subplot({
    id: 'abc',
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

  const id = undefined as unknown as string
  const copy = new Subplot({ ...subplot.toApi(), id })
  expect(copy instanceof Subplot).toBe(true)
  expect(copy.id).not.toBe(subplot.id)
  expect(copy.id).toStrictEqual(expect.any(String))
  expect(copy.orderNumber).toBe(subplot.orderNumber)
  expect(copy.pattern).toBe(subplot.pattern)
  expect(copy.timeframe).toBe(subplot.timeframe)
  expect(copy.total).toBe(subplot.total)
  expect(copy.targetLow).toBe(subplot.targetLow)
  expect(copy.targetHigh).toBe(subplot.targetHigh)
  expect(copy.expectedTriggerDate).toEqual(subplot.expectedTriggerDate)
  expect(copy.comment).toBe(subplot.comment)
  expect(copy.lossFloorPercent).toBe(subplot.lossFloorPercent)
  expect(copy.gainCeilingPercent).toBe(subplot.gainCeilingPercent)
  expect(copy.useMinusEight).toBe(subplot.useMinusEight)
  expect(copy.scaleInverted).toBe(subplot.scaleInverted)
})

test('GetNewWithNextPattern', () => {
  const subplots = [
    new Subplot({
      id: '1',
      comment: 'Test comment',
      expectedTriggerDate: new Date('2023-10-01'),
      gainCeilingPercent: 10,
      lossFloorPercent: 5,
      orderNumber: 0,
      pattern: 'b28',
      scaleInverted: false,
      targetHigh: 155,
      targetLow: 145,
      timeframe: '1d',
      useMinusEight: true,
    }),
  ]
  const newSubplot = Subplot.GetNewWithNextPattern(subplots)
  expect(newSubplot instanceof Subplot).toBe(true)
  expect(newSubplot.pattern).toBe('ra200')
  expect(newSubplot.orderNumber).toBe(0)
  expect(newSubplot.timeframe).toBe('1d')
  expect(newSubplot.targetHigh).toBe(1000)
  expect(newSubplot.targetLow).toBe(0)
  expect(newSubplot.expectedTriggerDate).toBeUndefined()
  expect(newSubplot.comment).toBe('')
  expect(newSubplot.lossFloorPercent).toBe(8)
  expect(newSubplot.gainCeilingPercent).toBe(10)
  expect(newSubplot.useMinusEight).toBe(true)
  expect(newSubplot.scaleInverted).toBe(false)
  expect(newSubplot.total).toBe(0)
  expect(newSubplot.id).toStrictEqual(expect.any(String))
  expect(newSubplot.id).not.toBe(subplots[0].id)
  expect(newSubplot.id).toBeDefined()
  expect(newSubplot.id).not.toBeNull()
  expect(newSubplot.id).not.toBe('')
  expect(newSubplot.id).toBeTruthy()
  expect(newSubplot.id).toHaveLength(36) // Assuming UUID format
})
