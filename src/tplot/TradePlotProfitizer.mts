import { ITradePlot, TradePlot } from './TradePlot.mjs'
import {
  getPercentChange,
  getPercentChangeString,
  isNullOrUndefined,
} from '../services/general.mjs'
import { IAssetQuoteResponse } from '../models/ticker-info.mjs'
import { IPlotMsg } from './ChartSettings.mjs'
import { NumberHelper } from '../services/number-helper.mjs'
import { safeArray } from '../services/array-helper.mjs'
import { safestrLowercase } from '../services/string-helper.mjs'

export interface ITradePlotProfitizer extends ITradePlot {
  profit?: number
  patternCount?: number
  numSubplots: number
  targetLow?: number
  targetHigh?: number
  currentPrice?: number
  previousClose?: number | null
  openPrice?: number | null
  quoteTimeInLong?: number
  amountToTargetLow?: number
  amountToTargetHigh?: number
  percentToTargetLow?: number
  percentToTargetHigh?: number
  amountToGoal?: number
  percentToGoal?: number
  nextOrderNumber?: number
  nextExpectedTriggerDate?: Date
  prevExpectedTriggerDate?: Date
  maxExpectedTriggerDate?: Date
  minExpectedTriggerDate?: Date
}

export class TradePlotProfitizer
  extends TradePlot
  implements ITradePlotProfitizer
{
  profit?: number
  patternCount = 0
  numSubplots = 0
  targetLow?: number
  targetHigh?: number
  currentPrice?: number
  previousClose?: number | null
  openPrice?: number | null
  quoteTimeInLong?: number
  amountToTargetLow?: number
  amountToTargetHigh?: number
  percentToTargetLow?: number
  percentToTargetHigh?: number
  amountToGoal?: number
  percentToGoal?: number
  nextOrderNumber?: number
  nextExpectedTriggerDate?: Date
  prevExpectedTriggerDate?: Date
  maxExpectedTriggerDate?: Date
  minExpectedTriggerDate?: Date

  constructor(obj?: ITradePlotProfitizer) {
    super(obj)

    if (obj) {
      Object.assign(this, obj)
    } else {
      this.patternCount = this.subplots.length
      this.numSubplots = this.subplots.length
    }
  }

  static Create(obj: ITradePlot, tprice?: IAssetQuoteResponse) {
    const dateNow = new Date().getTime(),
      price = tprice?.price,
      tplot = new TradePlotProfitizer()

    tplot.copyObject(obj)

    tplot.profit = tplot.getProfit(price)

    tplot.patternCount = tplot.getPatternCount()
    tplot.targetHigh = tplot.getTargetHigh()
    tplot.targetLow = tplot.getTargetLow()

    tplot.currentPrice = price
    tplot.previousClose = tprice?.previousClose
    tplot.openPrice = tprice?.open
    tplot.quoteTimeInLong = tprice?.timestamp

    tplot.amountToGoal = tplot.getAmountToGoal(price)
    tplot.percentToGoal = tplot.getPercentToGoal(price)
    tplot.percentToTargetLow = tplot.getPercentToTargetLow(price)
    tplot.percentToTargetHigh = tplot.getPercentToTargetHigh(price)

    tplot.nextOrderNumber = tplot.getNextOrderNumber(dateNow)
    tplot.nextExpectedTriggerDate = tplot.getNextExpectedTriggerDate(dateNow)
    tplot.prevExpectedTriggerDate = tplot.getPrevExpectedTriggerDate(dateNow)
    tplot.maxExpectedTriggerDate = tplot.getMaxExpectedTriggerDate(dateNow)
    tplot.minExpectedTriggerDate = tplot.getMinExpectedTriggerDate(dateNow)

    tplot.numSubplots = safeArray(tplot.subplots).length

    return tplot
  }

  static GetProfitForRowItems(rows: ITradePlotProfitizer[]) {
    return safeArray(rows).reduce((acc, tprow) => acc + (tprow?.profit || 0), 0)
  }

  static MapToPlotMsg(this: void, x: ITradePlotProfitizer) {
    // eslint-disable-next-line no-useless-assignment
    let msg = ''

    if (isNullOrUndefined(x.profit)) {
      msg = 'Please setup targets in your trade plot.'
    } else if (!x.profit) {
      msg = 'Currently break even.'
    } else if (x.profit > 0) {
      msg = `Currently up ${NumberHelper.PriceInDollars(x.profit)}!`
    } else {
      msg = `Currently down ${NumberHelper.PriceInDollars(x.profit)}.`
    }

    const pl: IPlotMsg = {
      lineColor: x.isShort ? '#f2c200' : '#00ff00',
      msgText: msg,
      price: x.purchase,
      quantity: x.shares,
      symbol: x.ticker,
    }

    return pl
  }

  static MapToPlotMsgs(x: ITradePlotProfitizer[]) {
    return safeArray(x).map(TradePlotProfitizer.MapToPlotMsg)
  }

  get currentPriceDisplay() {
    return NumberHelper.PriceInDollars(this.currentPrice ?? 0)
  }

  /**
   * Returns the proper comment based on the pattern key.
   * @param pattern Pattern key to get the comment for.
   * @return string Comment text.
   */
  static GetCommentFromPattern(pattern: string) {
    switch (safestrLowercase(pattern)) {
      case 'b28':
        return 'This is a back to the 8. It is one of the most common fundamentals in moving averages.'

      case 'ra200':
        return 'When you have resistance at the 200-day moving average on the daily chart. Acts as a ceiling, and typically some type of bounce is expected.'

      case 'ra50':
        return 'When you have resistance at the 50-day moving average on the daily chart. Acts as a ceiling, and typically some type of bounce is expected.'

      case 'spt200':
        return 'When you have support at the 200-day moving average on the daily chart. Acts as a floor, and typically some type of bounce is expected.'

      case 'spt50':
        return 'When you have support at the 50-day moving average on the daily chart. Acts as a floor, and typically some type of bounce is expected.'

      case 'x8x21':
        return 'When the 8- and 21-day moving averages cross each other. Follow the 8.'

      default:
        // Throw new Error('Invalid pattern');
        return ''
    }
  }

  get goalStart() {
    return (this.goal ?? 0) * this.shares
  }

  get goalStatusText() {
    if (!this.shares) {
      return 'Please provide Number of Shares.'
    }
    if (!this.goal) {
      return 'Please provide a goal.'
    }
    if (!this.purchase) {
      return 'Please provide a purchase price that you paid per share.'
    }

    const percent2goal = getPercentChange(
      this.goalStart,
      this.investmentAmountCurrent
    )

    let s = getPercentChangeString(
      this.goalStart,
      this.investmentAmountCurrent,
      true
      // This.maxDecimalPlaces
    )

    if (percent2goal < 0) {
      s = s.substring(1)

      s += ' to go.'
      if (percent2goal <= -15) {
        s +=
          ' You are below 15% of goal. Recommendation: Exit your position to minimize loss.'
      }
    } else if (percent2goal > 0) {
      s += ' above goal.'
      if (percent2goal >= 15) {
        s +=
          ' You are above 15% of goal. Recommendation: Exit your position to lock in profits.'
      }
    }

    return s
  }

  get investmentAmountCurrent() {
    return (this.currentPrice ?? 0) * this.shares
  }

  get investmentAmountDisplay() {
    return NumberHelper.PriceInDollars(this.investmentAmountCurrent)
  }

  get investmentAmountStart() {
    return (this.purchase ?? 0) * this.shares
  }
  get investmentAmountStartDisplay() {
    if (!this.investmentAmountStart) {
      return '$0'
    }

    return NumberHelper.PriceInDollars(this.investmentAmountStart)
  }

  get profitLoss() {
    // Return (this.currentPrice - this.purchasePrice) * this.shares
    return this.investmentAmountCurrent - this.investmentAmountStart
  }
  get profitLossText() {
    return NumberHelper.NumberWithDecimalPlaces(this.profitLoss)
  }

  get subplotCount() {
    return this.subplots.length
  }

  // Title(index: number) {
  //   Const curtf = this.getPatternField(index, 'timeframe')
  //   Const pf = ChartConfig.TimeFrameOptions.find((x) => x.name === curtf)

  //   // console.log('pf:', pf, ', curtf:', curtf);
  //   Return pf ? pf.value : 'No range selected yet'
  // }
}
