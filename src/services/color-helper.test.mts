import { ColorHelper, type ColorRange } from './color-helper.mjs'

test('constructor', () => {
  const color = new ColorHelper()
  expect(color).toBeInstanceOf(ColorHelper)
})

test('GetColorFromChange', () => {
  const color = ColorHelper.GetColorFromChange(100, 10)
  expect(color).toBeUndefined()
})
test('GetColorFromChange with priceChange', () => {
  const color = ColorHelper.GetColorFromChange(
    100,
    10,
    false,
    '#FF0000',
    '#00FF00'
  )
  expect(color).toBe('#FF0000')
})
test('GetColorFromChange with priceChange and isShort', () => {
  const color = ColorHelper.GetColorFromChange(
    100,
    -10,
    true,
    '#FF0000',
    '#00FF00'
  )
  expect(color).toBe('#00FF00')
})
test('GetColorFromChange with priceChange and isShort and colorNeutral', () => {
  const color = ColorHelper.GetColorFromChange(
    100,
    0,
    true,
    '#FF0000',
    '#00FF00',
    '#0000FF'
  )
  expect(color).toBe('#00FF00')
})
test('GetColorFromChange with priceChange and isShort and colorNeutral and colorDown', () => {
  const color = ColorHelper.GetColorFromChange(
    100,
    -10,
    true,
    '#FF0000',
    '#00FF00',
    '#0000FF'
  )
  expect(color).toBe('#00FF00')
})
test('GetColorFromChange with priceChange and isShort and colorNeutral and colorUp', () => {
  const color = ColorHelper.GetColorFromChange(
    100,
    10,
    true,
    '#FF0000',
    '#00FF00',
    '#0000FF'
  )
  expect(color).toBe('#00FF00')
})
test('GetColorFromChange with priceChange and isShort and colorNeutral and colorDown and colorUp', () => {
  const color = ColorHelper.GetColorFromChange(
    100,
    0,
    true,
    '#FF0000',
    '#00FF00',
    '#0000FF'
  )
  expect(color).toBe('#00FF00')
})
test('GetColorFromChange color neutral', () => {
  const color = ColorHelper.GetColorFromChange(
    50.1,
    50.1,
    true,
    '#FF0000',
    '#00FF00',
    '#0000FF'
  )
  expect(color).toBe('#0000FF')
})

test('InterpolateColorRange', () => {
  const colorRange: ColorRange = ['#000000', '#FFFFFF'],
   percent = 50,
   result = ColorHelper.InterpolateColorRange(colorRange, percent)
  expect(result).toBe('#808080') // Expecting the middle gray color
})

test('InterpolateColorRange with different colors', () => {
  const colorRange: ColorRange = ['FF0000', '00FF00'], // Red to Green
   percent = 50,
   result = ColorHelper.InterpolateColorRange(colorRange, percent)
  expect(result).toBe('#808000') // Expecting the middle yellow color
})

test('InterpolateColorRange with no colors', () => {
  const colorRange: ColorRange = ['', ''], // Empty colors
   percent = 50,
   result = ColorHelper.InterpolateColorRange(colorRange, percent)
  expect(result).toBe('#000000') // Expecting black
})

test('InterpolateWeightedColorRange', () => {
  const colorRange: ColorRange = ['#0000FF', '#FF00FF'], // Blue to Magenta
   startWeight = 25,
   endWeight = 75,
   result = ColorHelper.InterpolateWeightedColorRange(
    colorRange,
    startWeight,
    endWeight
  )

  expect(result).toStrictEqual([
    ColorHelper.InterpolateColorRange(colorRange, startWeight),
    ColorHelper.InterpolateColorRange(colorRange, endWeight),
  ])
})
