import { IAssetQuoteResponse } from '../models/ticker-info.mjs'
import { isNullOrUndefined, isObject, safeArray } from '../services/general.mjs'
import { getStockPriceInDollars } from '../services/number-helper.mjs'
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
  patternCount: number
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

  constructor(obj: ITradePlot, tprice?: IAssetQuoteResponse) {
    super(obj)

    if (isObject(obj)) {
      this.copyObject(obj)
    }

    const price = tprice?.price
    this.profit = this.getProfit(price)

    this.patternCount = this.getPatternCount()
    this.targetHigh = this.getTargetHigh()
    this.targetLow = this.getTargetLow()

    this.currentPrice = price
    this.previousClose = tprice?.previousClose
    this.openPrice = tprice?.open
    this.quoteTimeInLong = tprice?.timestamp

    this.amountToGoal = this.getAmountToGoal(price)
    this.percentToGoal = this.getPercentToGoal(price)
    this.percentToTargetLow = this.getPercentToTargetLow(price)
    this.percentToTargetHigh = this.getPercentToTargetHigh(price)

    const dateNow = new Date().getTime()
    this.nextOrderNumber = this.getNextOrderNumber(dateNow)
    this.nextExpectedTriggerDate = this.getNextExpectedTriggerDate(dateNow)
    this.prevExpectedTriggerDate = this.getPrevExpectedTriggerDate(dateNow)
    this.maxExpectedTriggerDate = this.getMaxExpectedTriggerDate(dateNow)
    this.minExpectedTriggerDate = this.getMinExpectedTriggerDate(dateNow)

    this.numSubplots = safeArray(this.subplots).length
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
}
