import {
  type ColorRange,
  colorFromValueChange,
  colorInterpolateRange,
  colorInterpolateWeightedRange,
  toHex,
} from './color-helper.mjs'

it('GetColorFromChange', () => {
  const color = colorFromValueChange(100, 10)
  expect(color).toBeUndefined()
})
it('GetColorFromChange with priceChange', () => {
  const color = colorFromValueChange(100, 10, false, '#FF0000', '#00FF00')
  expect(color).toBe('#FF0000')
})
it('GetColorFromChange with priceChange and isShort', () => {
  const color = colorFromValueChange(100, -10, true, '#FF0000', '#00FF00')
  expect(color).toBe('#00FF00')
})
it('GetColorFromChange with priceChange and isShort and colorNeutral', () => {
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
it('GetColorFromChange with priceChange and isShort and colorNeutral and colorDown', () => {
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
it('GetColorFromChange with priceChange and isShort and colorNeutral and colorUp', () => {
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
it('GetColorFromChange with priceChange and isShort and colorNeutral and colorDown and colorUp', () => {
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
it('GetColorFromChange color neutral', () => {
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

it('InterpolateColorRange', () => {
  const colorRange: ColorRange = ['#000000', '#FFFFFF'],
    percent = 50,
    result = colorInterpolateRange(colorRange, percent)

  // Expecting the middle gray color
  expect(result).toBe('#808080')
})

it('InterpolateColorRange with different colors', () => {
  // Red to Green
  const colorRange: ColorRange = ['FF0000', '00FF00'],
    percent = 50,
    result = colorInterpolateRange(colorRange, percent)

  // Expecting the middle yellow color
  expect(result).toBe('#808000')
})

it('InterpolateColorRange with no colors', () => {
  // Empty colors
  const colorRange: ColorRange = ['', ''],
    percent = 50,
    result = colorInterpolateRange(colorRange, percent)

  // Expecting black
  expect(result).toBe('#000000')
})

it('InterpolateWeightedColorRange', () => {
  // Blue to Magenta
  const colorRange: ColorRange = ['#0000FF', '#FF00FF'],
    endWeight = 75,
    startWeight = 25,
    zresult = colorInterpolateWeightedRange(colorRange, startWeight, endWeight)

  expect(zresult).toStrictEqual([
    colorInterpolateRange(colorRange, startWeight),
    colorInterpolateRange(colorRange, endWeight),
  ])
})

describe(toHex.name, () => {
  it('0 should be 00', () => {
    const ret = toHex(0)

    expect(ret).toBe('00')
  })

  it('10 should a', () => {
    const ret = toHex(10)

    expect(ret).toBe('0A')
  })

  it('10 should a', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    const ret = toHex(10, null as any)

    expect(ret).toBe('0A')
  })

  it('10 should a 4 chars', () => {
    const ret = toHex(10, 4)

    expect(ret).toBe('000A')
  })
})
