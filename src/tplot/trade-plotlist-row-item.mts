import { IAssetQuoteResponse } from '../models/ticker-info.mjs'
import {
  getPercentChange,
  getPercentChangeString,
  hasData,
  isNullOrUndefined,
  isObject,
  safeArray,
  safestrLowercase,
} from '../services/general.mjs'
import {
  getStockPrice,
  getStockPriceInDollars,
} from '../services/number-helper.mjs'
import { IPlotMsg } from './ChartSettings.mjs'
import { ITradePlot, TradePlot } from './trade-plot.mjs'

export interface ITradePlotListRowItem extends ITradePlot {
  profit?: number
  patternCount?: number
  numSubplots: number
  targetLow?: number
  targetHigh?: number
  currentPrice?: number
  previousClose?: number
  openPrice?: number
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

export class TradePlotListRowItem
  extends TradePlot
  implements ITradePlotListRowItem
{
  profit?: number
  patternCount = 0
  numSubplots = 0
  targetLow?: number
  targetHigh?: number
  currentPrice?: number
  previousClose?: number
  openPrice?: number
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

  constructor(obj?: ITradePlotListRowItem) {
    super(obj)

    if (obj) {
      Object.assign(this, obj)
    } else {
      this.patternCount = this.subplots.length
      this.numSubplots = this.subplots.length
    }
  }

  static Create(obj: ITradePlot, tprice?: IAssetQuoteResponse) {
    const tplot = new TradePlotListRowItem()
    if (isObject(obj)) {
      tplot.copyObject(obj)
    }

    const price = tprice?.price
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

    const dateNow = new Date().getTime()
    tplot.nextOrderNumber = tplot.getNextOrderNumber(dateNow)
    tplot.nextExpectedTriggerDate = tplot.getNextExpectedTriggerDate(dateNow)
    tplot.prevExpectedTriggerDate = tplot.getPrevExpectedTriggerDate(dateNow)
    tplot.maxExpectedTriggerDate = tplot.getMaxExpectedTriggerDate(dateNow)
    tplot.minExpectedTriggerDate = tplot.getMinExpectedTriggerDate(dateNow)

    tplot.numSubplots = safeArray(tplot.subplots).length

    return tplot
  }

  static GetProfitForRowItems(rows: TradePlotListRowItem[]) {
    return safeArray(rows).reduce(
      (acc, tprow) => (acc || 0) + (tprow?.profit || 0),
      0
    )
  }

  static MapToPlotMsg(x: TradePlotListRowItem) {
    {
      let msg = ''
      if (isNullOrUndefined(x.profit)) {
        msg = 'Please setup targets in your trade plot.'
      } else if (!x.profit) {
        msg = 'Current break even.'
      } else if (x.profit > 0) {
        msg = `Currently up ${getStockPriceInDollars(x.profit)}!`
      } else {
        msg = `Currently down ${getStockPriceInDollars(x.profit)}.`
      }

      const pl: IPlotMsg = {
        symbol: x.ticker,
        price: x.purchase,
        quantity: x.shares,
        lineColor: x.isShort ? '#f2c200' : '#00ff00',
        msgText: msg,
      }

      return pl
    }
  }
  static MapToPlotMsgs(x: TradePlotListRowItem[]) {
    return safeArray(x).map(TradePlotListRowItem.MapToPlotMsg)
  }

  get currentPriceDisplay() {
    return getStockPriceInDollars(this.currentPrice ?? 0)
  }

  /**
   * Returns the proper comment based on the pattern key.
   * @param pattern Pattern key to get the comment for.
   * @return string Comment text.
   */
  getCommentFromPattern(pattern: string) {
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
        // throw new Error('Invalid pattern');
        return ''
    }
  }

  get goalStart() {
    return (this.goal ?? 0) * (this.shares ?? 0)
  }

  get goalStatusText() {
    const percent2goal = getPercentChange(
      this.goalStart,
      this.investmentAmountCurrent
    )

    let s = getPercentChangeString(
      this.goalStart,
      this.investmentAmountCurrent,
      true
      // this.maxDecimalPlaces
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
    return (this.currentPrice ?? 0) * (this.shares ?? 0)
  }

  get investmentAmountDisplay() {
    const s = getStockPriceInDollars(this.investmentAmountCurrent)
    if (!hasData(s)) {
      return '-'
    }

    return s
  }

  get investmentAmountStart() {
    return (this.purchase ?? 0) * (this.shares ?? 0)
  }
  get investmentAmountStartDisplay() {
    if (!this.investmentAmountStart) {
      return '$0'
    }

    return getStockPriceInDollars(this.investmentAmountStart)
  }

  get profitLoss() {
    // return (this.currentPrice - this.purchasePrice) * this.shares
    return this.investmentAmountCurrent - this.investmentAmountStart
  }
  get profitLossText() {
    return getStockPrice(this.profitLoss) //, this.maxDecimalPlaces)
  }

  get subplotCount() {
    return this.subplots.length
  }

  // title(index: number) {
  //   const curtf = this.getPatternField(index, 'timeframe')
  //   const pf = ChartConfig.TimeFrameOptions.find((x) => x.name === curtf)

  //   // console.log('pf:', pf, ', curtf:', curtf);
  //   return pf ? pf.value : 'No range selected yet'
  // }
}
