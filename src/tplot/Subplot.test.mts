/* eslint-disable @typescript-eslint/no-misused-spread */
import * as z from 'zod'
import { Subplot } from './Subplot.mjs'
import { ZodTestHelper } from '../jest.setup.mjs'

test('Subplot', () => {
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

  expect(subplot.pattern).toBe('b28')
  expect(subplot.targetHigh).toBe(155)
  expect(subplot.targetLow).toBe(145)
  expect(subplot.toApi()).toMatchObject({
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

  expect(Subplot.zSchema.parse(subplot.toApi())).toStrictEqual({
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
    total: undefined,
    useMinusEight: true,
  })
})

test('Renumber', () => {
  const subplot = new Subplot({
      comment: 'Test comment',
      expectedTriggerDate: new Date('2023-10-01'),
      gainCeilingPercent: 10,
      id: '1',
      lossFloorPercent: 5,
      orderNumber: 7,
      pattern: 'b28',
      scaleInverted: false,
      targetHigh: 155,
      targetLow: 145,
      timeframe: '1d',
      useMinusEight: true,
    }),
    subplot2 = new Subplot({
      comment: 'Test comment',
      expectedTriggerDate: new Date('2023-10-01'),
      gainCeilingPercent: 10,
      id: '1',
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
    subplotParsed = Subplot.zSchema.parse(subplot.toApi())

  expect(subplotParsed).toStrictEqual({
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
    total: undefined,
    useMinusEight: true,
  })
  expect(subplotParsed instanceof Subplot).toBe(false)
  expect(() =>
    Subplot.zSchema.parse({ ...subplotParsed, orderNumber: 'not a number' })
  ).toThrow(z.ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...subplotParsed, pattern: 123 })
  ).toThrow(z.ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...subplotParsed, timeframe: 123 })
  ).toThrow(z.ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...subplotParsed, targetHigh: 'not a number' })
  ).toThrow(z.ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...subplotParsed, targetLow: 'not a number' })
  ).toThrow(z.ZodError)
  expect(() =>
    Subplot.zSchema.parse({
      ...subplotParsed,
      gainCeilingPercent: 'not a number',
    })
  ).toThrow(z.ZodError)
  expect(() =>
    Subplot.zSchema.parse({
      ...subplotParsed,
      lossFloorPercent: 'not a number',
    })
  ).toThrow(z.ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...subplotParsed, useMinusEight: 'not a boolean' })
  ).toThrow(z.ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...subplotParsed, scaleInverted: 'not a boolean' })
  ).toThrow(z.ZodError)
  expect(() =>
    Subplot.zSchema.parse({
      ...subplotParsed,
      expectedTriggerDate: 'not a date',
    })
  ).toThrow(z.ZodError)
  expect(() => Subplot.zSchema.parse({ ...subplotParsed, id: 123 })).toThrow(
    z.ZodError
  )
  expect(() => Subplot.zSchema.parse({ ...subplotParsed, id: null })).toThrow(
    z.ZodError
  )
  expect(() =>
    Subplot.zSchema.parse({ ...subplotParsed, id: undefined })
  ).toThrow(z.ZodError)
  expect(() => Subplot.zSchema.parse({ ...subplotParsed, id: '' })).not.toThrow(
    z.ZodError
  )
  expect(() =>
    Subplot.zSchema.parse({ ...subplotParsed, id: ' ' })
  ).not.toThrow(z.ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...subplotParsed, id: '1' })
  ).not.toThrow(z.ZodError)
  expect(() =>
    Subplot.zSchema.parse({ ...subplotParsed, id: '1', total: 'not a number' })
  ).toThrow(z.ZodError)

  try {
    Subplot.zSchema.parse({
      ...subplotParsed,
      id: '1',
      total: 'not a number',
    })
  } catch (e) {
    expect(e).toBeInstanceOf(z.ZodError)
  }
  expect(
    Subplot.zSchema.safeParse({
      ...subplotParsed,
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
    zparams = Subplot.GetFmpIndicatorQueryParams('AAPL', subplot)

  expect(zparams).toEqual({
    from: 1764158400000,
    periodLength: 8,
    symbol: 'AAPL',
    timeframe: '1day',
  })
})

test('copyObject', () => {
  const id = undefined as unknown as string,
    subplot = new Subplot({
      comment: 'Test comment',
      expectedTriggerDate: new Date('2023-10-01'),
      gainCeilingPercent: 10,
      id: 'abc',
      lossFloorPercent: 5,
      orderNumber: 1,
      pattern: 'b28',
      scaleInverted: false,
      targetHigh: 155,
      targetLow: 145,
      timeframe: '1d',
      useMinusEight: true,
    }),
    subplotCopy = new Subplot({ ...subplot.toApi(), id })

  expect(subplotCopy instanceof Subplot).toBe(true)
  expect(subplotCopy.id).not.toBe(subplot.id)
  expect(subplotCopy.id).toStrictEqual(expect.any(String))
  expect(subplotCopy.orderNumber).toBe(subplot.orderNumber)
  expect(subplotCopy.pattern).toBe(subplot.pattern)
  expect(subplotCopy.timeframe).toBe(subplot.timeframe)
  expect(subplotCopy.total).toBe(subplot.total)
  expect(subplotCopy.targetLow).toBe(subplot.targetLow)
  expect(subplotCopy.targetHigh).toBe(subplot.targetHigh)
  expect(subplotCopy.expectedTriggerDate).toEqual(subplot.expectedTriggerDate)
  expect(subplotCopy.comment).toBe(subplot.comment)
  expect(subplotCopy.lossFloorPercent).toBe(subplot.lossFloorPercent)
  expect(subplotCopy.gainCeilingPercent).toBe(subplot.gainCeilingPercent)
  expect(subplotCopy.useMinusEight).toBe(subplot.useMinusEight)
  expect(subplotCopy.scaleInverted).toBe(subplot.scaleInverted)
})

test('GetNewWithNextPattern', () => {
  const asubplots = [
      new Subplot({
        comment: 'Test comment',
        expectedTriggerDate: new Date('2023-10-01'),
        gainCeilingPercent: 10,
        id: '1',
        lossFloorPercent: 5,
        orderNumber: 0,
        pattern: 'b28',
        scaleInverted: false,
        targetHigh: 155,
        targetLow: 145,
        timeframe: '1d',
        useMinusEight: true,
      }),
    ],
    newSubplot = Subplot.GetNewWithNextPattern(asubplots)
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
  expect(newSubplot.id).not.toBe(asubplots[0].id)
  expect(newSubplot.id).toBeDefined()
  expect(newSubplot.id).not.toBeNull()
  expect(newSubplot.id).not.toBe('')
  expect(newSubplot.id).toBeTruthy()
  expect(newSubplot.id).toHaveLength(36)
})
