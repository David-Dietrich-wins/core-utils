import { IAssetQuoteResponse } from '../models/ticker-info.mjs'
import { isObject, safeArray } from '../services/general.mjs'
import { ITradePlot, TradePlot } from './trade-plot.mjs'

export interface ITradePlotListRowItem extends ITradePlot {
  profit?: number
  patternCount?: number
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
  }

  static GetProfitForRowItems(rows: TradePlotListRowItem[]) {
    return safeArray(rows).reduce(
      (acc, tprow) => (acc || 0) + (tprow?.profit || 0),
      0
    )
  }
}
