import { NumberHelper } from './number-helper.mjs'

export class ColorHelper {
  static readonly Help = '#1A90FF'
  static readonly PolitagreeBlue = '#464377'
  static readonly PolitagreeRed = '#EB2134'
  static readonly TradePlotterBlue = '#1976D3'
  static readonly TradePlotterGray = '#4D4D4D'

  static GetColorFromChange(
    currentValue: number,
    priceChange: number | undefined,
    isShort = false,
    colorDown?: string,
    colorUp?: string,
    colorNeutral = '#000000'
  ) {
    const upDown = NumberHelper.DownUpOrEqual(
      currentValue,
      priceChange,
      isShort
    )

    return upDown === 1 ? colorUp : upDown === -1 ? colorDown : colorNeutral
  }
}
