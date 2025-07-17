import { safeArray } from './array-helper.mjs'
import { NumberHelper } from './number-helper.mjs'

export type ColorRange = readonly [string, string]

export class ColorHelper {
  static readonly Help = '#1A90FF'
  static readonly PolitagreeBlue = '#464377'
  static readonly PolitagreeRed = '#EB2134'
  static readonly TradePlotterBlue = '#1976D3'
  static readonly TradePlotterGray = '#4D4D4D'

  static GetColorFromChange(
    startValue: number,
    endValue: number | undefined,
    isShort = false,
    colorDown?: string,
    colorUp?: string,
    colorNeutral = '#000000'
  ) {
    const upDown = NumberHelper.DownUpOrEqual(startValue, endValue, isShort)

    return upDown === 1 ? colorUp : upDown === -1 ? colorDown : colorNeutral
  }

  /**
   * Returns an HTML #FFFFFF color that is the percent between the start and end colors provided.
   * @param colorRange The starting and ending colors for the gradient scale in HTML #FFFFFF format (# optional).
   * @param percent The percentage of the gradient scale you want returned.
   * @returns An HTML #FFFFFF formatted color that is the middle color of the percent between the start and end colors.
   */
  static InterpolateColorRange(colorRange: ColorRange, percent: number) {
    let [startColor, endColor] = colorRange

    percent = percent / 100

    if (startColor.startsWith('#')) {
      startColor = startColor.substring(1)
    }
    if (endColor.startsWith('#')) {
      endColor = endColor.substring(1)
    }

    const startMatch = startColor.match(/.{1,2}/g)
    const endMatch = endColor.match(/.{1,2}/g)

    const n0 = startMatch
      ? safeArray(startMatch).map((oct) => parseInt(oct, 16) * (1 - percent))
      : [0, 0, 0]
    const n1 = endMatch
      ? safeArray(endMatch).map((oct) => parseInt(oct, 16) * percent)
      : [0, 0, 0]

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
  static InterpolateWeightedColorRange(
    colorRange: ColorRange,
    startWeight: number,
    endWeight: number
  ) {
    const range: ColorRange = [
      ColorHelper.InterpolateColorRange(colorRange, startWeight),
      ColorHelper.InterpolateColorRange(colorRange, endWeight),
    ]

    return range
  }
}
