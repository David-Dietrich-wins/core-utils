import { safeArray } from './skky'

export type ColorRange = readonly [string, string]

/**
 * Returns an HTML #FFFFFF color that is the percent between the start and end colors provided.
 * @param colorRange The starting and ending colors for the gradient scale in HTML #FFFFFF format (# optional).
 * @param percent The percentage of the gradient scale you want returned.
 * @returns An HTML #FFFFFF formatted color that is the middle color of the percent between the start and end colors.
 */
export function InterpolateColorRange(colorRange: ColorRange, percent: number) {
  let [startColor, endColor] = colorRange

  percent = percent / 100

  if (startColor.startsWith('#')) {
    startColor = startColor.substring(1)
  }
  if (endColor.startsWith('#')) {
    endColor = endColor.substring(1)
  }

  const n0 = safeArray(startColor.match(/.{1,2}/g)).map((oct) => parseInt(oct, 16) * (1 - percent))
  const n1 = safeArray(endColor.match(/.{1,2}/g)).map((oct) => parseInt(oct, 16) * percent)

  const ci = [0, 1, 2].map((i) => Math.min(Math.round(n0[i] + n1[i]), 255))

  return (
    '#' +
    ci
      .reduce((a, v) => (a << 8) + v, 0)
      .toString(16)
      .padStart(6, '0')
  )
}

/**
 * Returns an HTML #FFFFFF color range based on the colorRange and the weights provided.
 * Used to get the gradients used for Politiscales.
 * @param colorRange The starting and ending colors for the gradient scale in HTML #FFFFFF format (# optional).
 * @param startWeight The weight for calculating the starting color.
 * @param endWeight The weight for calculating the ending color.
 * @returns An HTML #FFFFFF formatted color that is the middle color of the percent between the start and end colors.
 */
export function InterpolateWeightedColorRange(
  colorRange: ColorRange,
  startWeight: number,
  endWeight: number
) {
  const range: ColorRange = [
    InterpolateColorRange(colorRange, startWeight),
    InterpolateColorRange(colorRange, endWeight),
  ]

  return range
}
