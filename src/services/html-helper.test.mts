import {
  ColorRange,
  InterpolateColorRange,
  InterpolateWeightedColorRange,
} from './html-helper.mjs'

test('InterpolateColorRange', () => {
  const colorRange: ColorRange = ['#000000', '#FFFFFF']
  const percent = 50
  const result = InterpolateColorRange(colorRange, percent)
  expect(result).toBe('#808080') // Expecting the middle gray color
})

test('InterpolateColorRange with different colors', () => {
  const colorRange: ColorRange = ['FF0000', '00FF00'] // Red to Green
  const percent = 50
  const result = InterpolateColorRange(colorRange, percent)
  expect(result).toBe('#808000') // Expecting the middle yellow color
})

test('InterpolateColorRange with no colors', () => {
  const colorRange: ColorRange = ['', ''] // Empty colors
  const percent = 50
  const result = InterpolateColorRange(colorRange, percent)
  expect(result).toBe('#000000') // Expecting black
})

test('InterpolateWeightedColorRange', () => {
  const colorRange: ColorRange = ['#0000FF', '#FF00FF'] // Blue to Magenta
  const startWeight = 25
  const endWeight = 75
  const result = InterpolateWeightedColorRange(
    colorRange,
    startWeight,
    endWeight
  )

  expect(result).toStrictEqual([
    InterpolateColorRange(colorRange, startWeight),
    InterpolateColorRange(colorRange, endWeight),
  ])
})
