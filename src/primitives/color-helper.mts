import { downUpOrEqual } from './number-helper.mjs'
import { isNullOrUndefined } from './object-helper.mjs'
import { safeArray } from './array-helper.mjs'

export type ColorRange = readonly [string, string]

export const COLOR_Help = '#1A90FF',
  COLOR_PolitagreeBlue = '#464377',
  COLOR_PolitagreeRed = '#EB2134',
  COLOR_TradePlotterBlue = '#1976D3',
  TradePlotterGray = '#4D4D4D'

export function colorFromValueChange(
  startValue: number,
  endValue: number | undefined,
  isShort = false,
  colorDown?: string,
  colorUp?: string,
  colorNeutral = '#000000'
) {
  const upDown = downUpOrEqual(startValue, endValue, isShort)

  return upDown === 1 ? colorUp : upDown === -1 ? colorDown : colorNeutral
}

/**
 * Returns an HTML #FFFFFF color that is the percent between the start and end colors provided.
 * @param colorRange The starting and ending colors for the gradient scale in HTML #FFFFFF format (# optional).
 * @param percent The percentage of the gradient scale you want returned.
 * @returns An HTML #FFFFFF formatted color that is the middle color of the percent between the start and end colors.
 */
export function colorInterpolateRange(
  colorRange: ColorRange,
  percentOfRange: number
) {
  let [startColor, endColor] = colorRange

  if (startColor.startsWith('#')) {
    startColor = startColor.substring(1)
  }
  if (endColor.startsWith('#')) {
    endColor = endColor.substring(1)
  }

  const endMatch = endColor.match(/.{1,2}/gu),
    percent = percentOfRange / 100,
    startMatch = startColor.match(/.{1,2}/gu),
    tn0 = startMatch
      ? safeArray(startMatch).map((oct) => parseInt(oct, 16) * (1 - percent))
      : [0, 0, 0],
    tn1 = endMatch
      ? safeArray(endMatch).map((oct) => parseInt(oct, 16) * percent)
      : [0, 0, 0],
    zci = [0, 1, 2].map((i) => Math.min(Math.round(tn0[i] + tn1[i]), 255))

  return `#${zci
    // eslint-disable-next-line no-bitwise
    .reduce((a, v) => (a << 8) + v, 0)
    .toString(16)
    .padStart(6, '0')}`
}

/**
 * Returns an HTML #FFFFFF color range based on the colorRange and the weights provided.
 * Used to get the gradients used for Politiscales.
 * @param colorRange The starting and ending colors for the gradient scale in HTML #FFFFFF format (# optional).
 * @param startWeight The weight for calculating the starting color.
 * @param endWeight The weight for calculating the ending color.
 * @returns An HTML #FFFFFF formatted color that is the middle color of the percent between the start and end colors.
 */
export function colorInterpolateWeightedRange(
  colorRange: ColorRange,
  startWeight: number,
  endWeight: number
) {
  const range: ColorRange = [
    colorInterpolateRange(colorRange, startWeight),
    colorInterpolateRange(colorRange, endWeight),
  ]

  return range
}

/**
 * Takes a number and converts to its uppercase hexadecimal string value.
 * @param decimal The number to convert to hexadecimal.
 * @param chars Number of chars to pad for leading zeros.
 * @returns
 */
export function toHex(decimal?: number, chars = 2) {
  if (isNullOrUndefined(chars)) {
    // eslint-disable-next-line no-param-reassign
    chars = 2
  }

  return ((decimal || 0) + 16 ** chars).toString(16).slice(-chars).toUpperCase()
}
