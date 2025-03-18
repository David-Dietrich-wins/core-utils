import { ICreatedBy, IId, IUpdatedBy } from '../models/interfaces.mjs'
import { ITicker } from '../models/ticker-info.mjs'
import {
  getAsNumber,
  getNumberFormatted,
  getPercentChangeString,
  isNullOrUndefined,
  isObject,
  safeArray,
} from '../services/general.mjs'
import { getStockPriceInDollars } from '../services/number-helper.mjs'
import { ISubplot, Subplot } from './Subplot.mjs'

export interface ITradePlotApi<T = number>
  extends IId<T>,
    ITicker,
    ICreatedBy,
    IUpdatedBy {
  description: string
  goal?: number
  isShort: boolean
  purchase?: number
  shares?: number
  subplots: ISubplot[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ITradePlot extends ITradePlotApi<number> {}

/**
 * A view of the trade table for a TradePlot.
 * Ensure only PostgreSQL named variables are used.
 * Use toApi() to convert to camel case for the outside world.
 */
export class TradePlot implements ITradePlot {
  id = 0
  ticker = ''
  description = ''
  goal?: number
  isShort = false
  purchase?: number
  shares?: number
  subplots: Subplot[] = []

  updatedby = 'TradePlot'
  updated = new Date()
  createdby = 'TradePlot'
  created = new Date()

  constructor(obj: ITradePlot) {
    this.copyObject(obj)
  }

  copyObject(obj: ITradePlot) {
    if (!isObject(obj)) {
      return
    }

    if (obj.id) {
      this.id = obj.id
    }

    this.ticker = obj.ticker
    this.description = obj.description
    if (!isNullOrUndefined(obj.goal)) {
      this.goal = getNumberFormatted(obj.goal, 2, 2)
    }
    this.isShort = obj.isShort

    if (!isNullOrUndefined(obj.purchase)) {
      this.purchase = getNumberFormatted(obj.purchase, 2, 2)
    }
    if (!isNullOrUndefined(obj.shares)) {
      this.shares = getAsNumber(obj.shares)
    }

    this.updatedby = obj.updatedby || 'TradePlot'
    this.updated = obj.updated || new Date()
    this.createdby = obj.createdby || 'TradePlot'
    this.created = obj.created || new Date()

    this.subplots = safeArray(obj.subplots).map(
      (subplot) => new Subplot(subplot)
    )
  }

  toApi(): ITradePlotApi<number> {
    return {
      id: this.id,
      ticker: this.ticker,
      description: this.description,
      goal: this.goal,
      isShort: this.isShort,
      purchase: this.purchase,
      shares: this.shares,
      subplots: this.subplots.map((x) => new Subplot(x)),
      updatedby: this.updatedby,
      updated: this.updated,
      createdby: this.createdby,
      created: this.created,
    }
  }

  getPatternCount() {
    return this.subplots.length
  }

  getTargetHigh() {
    const arr = this.subplots.map((x) => x.targetHigh ?? 0).filter((x) => x > 0)

    return Math.min(...arr)
  }
  getTargetLow() {
    const arr = this.subplots.map((x) => x.targetLow ?? 0).filter((x) => x > 0)
    return Math.min(...arr)
  }

  investmentAmountGain(currentPrice: number) {
    return isNullOrUndefined(this.investmentAmountStart) ||
      isNullOrUndefined(this.investmentAmountGainPercent(currentPrice))
      ? undefined
      : (this.investmentAmountStart ?? 0) *
          (this.investmentAmountGainPercent(currentPrice) ?? 0)
  }
  investmentAmountGainDisplay(currentPrice: number, maxDecimalPlaces: number) {
    const gain = this.investmentAmountGain(currentPrice)
    if (!gain) {
      return '$0'
    }

    return getStockPriceInDollars(gain, maxDecimalPlaces)
  }

  investmentAmountGainPercent(currentPrice: number) {
    if (this.purchase) {
      return this.isShort
        ? (this.purchase - currentPrice) / this.purchase
        : (currentPrice - this.purchase) / this.purchase
    }
  }
  investmentAmountGainPercentDisplay(currentPrice: number) {
    if (!this.investmentAmountGainPercent(currentPrice)) {
      return '0%'
    }

    return this.isShort
      ? getPercentChangeString(currentPrice, this.purchase ?? 0)
      : getPercentChangeString(this.purchase ?? 0, currentPrice)
  }

  get investmentAmountStart() {
    return !this.purchase || !this.shares
      ? undefined
      : this.purchase * this.shares
  }
  get investmentAmountStartDisplay() {
    if (!this.investmentAmountStart) {
      return '$0'
    }

    return getStockPriceInDollars(this.investmentAmountStart)
  }

  get startingInvestment() {
    return !this.purchase || !this.shares
      ? undefined
      : this.purchase * this.shares
  }

  getAmountToGoal(price?: number) {
    return price && this.goal ? price - this.goal : undefined
  }
  getPercentToGoal(price?: number) {
    return price && this.goal ? (price - this.goal) / this.goal : undefined
  }

  getProfit(price?: number) {
    if (
      price &&
      price > 0 &&
      !isNullOrUndefined(this.purchase) &&
      !isNullOrUndefined(this.shares) &&
      this.purchase &&
      this.purchase > 0 &&
      this.shares &&
      this.shares > 0
    ) {
      const profit = this.isShort
        ? this.purchase - price
        : price - this.purchase

      return profit * this.shares
    }
  }

  getMaxExpectedTriggerDate(dateNow: number): Date | undefined {
    const dateNum = this.subplots.reduce((acc: number, cur) => {
      if (cur.expectedTriggerDate && acc < +cur.expectedTriggerDate) {
        acc = +cur.expectedTriggerDate
      }

      return acc
    }, 0)

    if (dateNum >= dateNow) {
      return new Date(dateNum)
    }
  }

  getMinExpectedTriggerDate(dateNow: number): Date | undefined {
    const dateNum = this.subplots.reduce((acc: number, cur) => {
      if (cur.expectedTriggerDate && acc > +cur.expectedTriggerDate) {
        acc = +cur.expectedTriggerDate
      }

      return acc
    }, 0)

    if (dateNum >= dateNow) {
      return new Date(dateNum)
    }
  }

  getNextExpectedTriggerDate(dateNow: number): Date | undefined {
    const dateNum = this.subplots.reduce((acc: number, cur) => {
      if (
        cur.expectedTriggerDate &&
        dateNow <= +cur.expectedTriggerDate &&
        acc < +cur.expectedTriggerDate
      ) {
        acc = +cur.expectedTriggerDate
      }

      return acc
    }, 0)

    if (dateNum) {
      return new Date(dateNum)
    }
  }

  getNextOrderNumber(dateNow: number) {
    const nextDate = this.getNextExpectedTriggerDate(dateNow)
    if (nextDate) {
      const nextDateNum = +nextDate
      return this.subplots.find(
        (x) => nextDateNum && nextDateNum === +(x.expectedTriggerDate ?? 0)
      )?.orderNumber
    }
  }

  getPrevExpectedTriggerDate(dateNow: number): Date | undefined {
    const dateNum = this.subplots.reduce((acc: number, cur) => {
      if (
        cur.expectedTriggerDate &&
        dateNow > +cur.expectedTriggerDate &&
        acc < +cur.expectedTriggerDate
      ) {
        acc = +cur.expectedTriggerDate
      }

      return acc
    }, 0)

    if (dateNum) {
      return new Date(dateNum)
    }
  }

  getAmountToTargetLow(price?: number) {
    return isNullOrUndefined(this.getTargetLow()) ||
      !price ||
      isNullOrUndefined(price)
      ? undefined
      : price - this.getTargetLow()
  }
  getAmountToTargetHigh(price?: number) {
    return isNullOrUndefined(this.getTargetHigh()) ||
      !price ||
      isNullOrUndefined(price)
      ? undefined
      : this.getTargetHigh() - price
  }
  getPercentToTargetLow(price?: number) {
    return isNullOrUndefined(this.getTargetLow()) || !price
      ? undefined
      : (price - this.getTargetLow()) / price
  }
  getPercentToTargetHigh(price?: number) {
    return isNullOrUndefined(this.getTargetHigh()) || !price
      ? undefined
      : (this.getTargetHigh() - price) / price
  }
}
