import {
  type ColorRange,
  colorFromValueChange,
  colorInterpolateRange,
  colorInterpolateWeightedRange,
  toHex,
} from './color-helper.mjs'
import { describe, expect, it } from '@jest/globals'

describe('colorFromValueChange', () => {
  it('should be defined', () => {
    expect.assertions(1)

    expect(colorFromValueChange).toBeDefined()
  })

  it('getColorFromChange', () => {
    expect.assertions(1)

    const color = colorFromValueChange(100, 10)

    expect(color).toBeUndefined()
  })

  it('with priceChange', () => {
    expect.assertions(1)

    const color = colorFromValueChange(100, 10, false, '#FF0000', '#00FF00')

    expect(color).toBe('#FF0000')
  })

  it('with priceChange and isShort', () => {
    expect.assertions(1)

    const color = colorFromValueChange(100, -10, true, '#FF0000', '#00FF00')

    expect(color).toBe('#00FF00')
  })

  it('with priceChange and isShort and colorNeutral', () => {
    expect.assertions(1)

    const color = colorFromValueChange(
      100,
      0,
      true,
      '#FF0000',
      '#00FF00',
      '#0000FF'
    )

    expect(color).toBe('#00FF00')
  })

  it('with priceChange and isShort and colorNeutral and colorDown', () => {
    expect.assertions(1)

    const color = colorFromValueChange(
      100,
      -10,
      true,
      '#FF0000',
      '#00FF00',
      '#0000FF'
    )

    expect(color).toBe('#00FF00')
  })

  it('with priceChange and isShort and colorNeutral and colorUp', () => {
    expect.assertions(1)

    const color = colorFromValueChange(
      100,
      10,
      true,
      '#FF0000',
      '#00FF00',
      '#0000FF'
    )

    expect(color).toBe('#00FF00')
  })

  it('with priceChange and isShort and colorNeutral and colorDown and colorUp', () => {
    expect.assertions(1)

    const color = colorFromValueChange(
      100,
      0,
      true,
      '#FF0000',
      '#00FF00',
      '#0000FF'
    )

    expect(color).toBe('#00FF00')
  })

  it('color neutral', () => {
    expect.assertions(1)

    const color = colorFromValueChange(
      50.1,
      50.1,
      true,
      '#FF0000',
      '#00FF00',
      '#0000FF'
    )

    expect(color).toBe('#0000FF')
  })
})

describe('colorInterpolateRange', () => {
  it('good', () => {
    expect.assertions(1)

    const colorRange: ColorRange = ['#000000', '#FFFFFF'],
      percent = 50,
      result = colorInterpolateRange(colorRange, percent)

    // Expecting the middle gray color
    expect(result).toBe('#808080')
  })

  it('with different colors', () => {
    expect.assertions(1)

    // Red to Green
    const colorRange: ColorRange = ['FF0000', '00FF00'],
      percent = 50,
      result = colorInterpolateRange(colorRange, percent)

    // Expecting the middle yellow color
    expect(result).toBe('#808000')
  })

  it('with no colors', () => {
    expect.assertions(1)

    // Empty colors
    const colorRange: ColorRange = ['', ''],
      percent = 50,
      result = colorInterpolateRange(colorRange, percent)

    // Expecting black
    expect(result).toBe('#000000')
  })

  it('weighted range', () => {
    expect.assertions(1)

    // Blue to Magenta
    const colorRange: ColorRange = ['#0000FF', '#FF00FF'],
      endWeight = 75,
      startWeight = 25,
      zresult = colorInterpolateWeightedRange(
        colorRange,
        startWeight,
        endWeight
      )

    expect(zresult).toStrictEqual([
      colorInterpolateRange(colorRange, startWeight),
      colorInterpolateRange(colorRange, endWeight),
    ])
  })
})

describe('toHex', () => {
  it('0 should be 00', () => {
    expect.assertions(1)

    const ret = toHex(0)

    expect(ret).toBe('00')
  })

  it('10 should be 0A', () => {
    expect.assertions(1)

    const ret = toHex(10)

    expect(ret).toBe('0A')
  })

  it('10 null should be 0A', () => {
    expect.assertions(1)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    const ret = toHex(10, null as any)

    expect(ret).toBe('0A')
  })

  it('10 should a 4 chars', () => {
    expect.assertions(1)

    const ret = toHex(10, 4)

    expect(ret).toBe('000A')
  })
})
