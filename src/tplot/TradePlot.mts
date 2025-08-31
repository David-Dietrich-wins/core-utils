import * as z from 'zod/v4'
import {
  IAssetQuoteResponse,
  IQuoteBarEma,
  ITicker,
  zTicker,
} from '../models/ticker-info.mjs'
import { ICreatedBy, IUpdatedBy } from '../models/id-created-updated.mjs'
import { ISubplot, Subplot } from './Subplot.mjs'
import {
  PriceInDollars,
  getAsNumber,
  getNumberFormatted,
} from '../services/primitives/number-helper.mjs'
import {
  getPercentChangeString,
  isNullOrUndefined,
  newGuid,
} from '../services/general.mjs'
import { zDateTime, zStringMinMax } from '../services/zod-helper.mjs'
import { IIdRequired } from '../models/IdManager.mjs'
import { IIdValue } from '../models/IdValueManager.mjs'
import { ITradePlotProfitizer } from './TradePlotProfitizer.mjs'
import { safeArray } from '../services/primitives/array-helper.mjs'

export interface ITradePlot
  extends IIdRequired,
    ITicker,
    ICreatedBy,
    IUpdatedBy {
  description: string
  goal?: number
  isShort: boolean
  purchase?: number
  shares: number
  subplots: ISubplot[]
}

/**
 * A view of the trade table for a TradePlot.
 * Ensure only PostgreSQL named variables are used.
 * Use toApi() to convert to camel case for the outside world.
 */
export class TradePlot implements ITradePlot {
  id = newGuid()
  ticker = ''
  description = ''
  goal?: number
  isShort = false
  purchase?: number
  shares = 0
  subplots: Subplot[] = []

  updatedby = 'TradePlot'
  updated = new Date()
  createdby = 'TradePlot'
  created = new Date()

  constructor(obj?: Partial<ITradePlot>) {
    if (obj) {
      Object.assign(this, obj)

      if (obj.subplots) {
        this.subplots = safeArray(obj.subplots).map(
          (subplot) => new Subplot(subplot)
        )
      }
    }
  }

  static get zSchema() {
    const dnow = new Date(),
      schema = zTicker.extend({
        created: zDateTime().default(dnow),
        createdby: z.string().default('TradePlot'),
        description: z.string().default(''),
        goal: z.coerce.number().optional(),
        id: z.string().default(newGuid()),
        isShort: z.boolean().default(false),
        purchase: z.coerce.number().min(0).max(1000000).optional(),
        shares: z.coerce.number().min(0).max(1000000).default(0),
        subplots: z.array(Subplot.zSchema).default([]),
        updated: zDateTime().default(dnow),
        updatedby: z.string().default('TradePlot'),
      })

    return schema
  }

  static CreateFromTicker(ticker: string, email: string) {
    const cleanEmail = z.email().parse(email),
      cleanTicker = zStringMinMax(1, 100, { trim: true }).parse(ticker),
      tp = new TradePlot()
    tp.ticker = cleanTicker
    tp.subplots = [Subplot.GetNewWithNextPattern()]

    tp.updatedby = cleanEmail
    tp.createdby = cleanEmail

    return tp
  }

  static FixupForSave(obj: ITradePlot) {
    for (const subplot of obj.subplots) {
      if ('expectedTriggerDate' in subplot) {
        delete subplot.expectedTriggerDate
      }
    }

    return obj
  }

  copyObject(obj: ITradePlot) {
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

    this.shares = obj.shares

    this.updatedby = obj.updatedby || 'TradePlot'
    this.updated = obj.updated
    this.createdby = obj.createdby || 'TradePlot'
    this.created = obj.created

    this.subplots = safeArray(obj.subplots).map(
      (subplot) => new Subplot(subplot)
    )
  }

  toApi() {
    const ret: ITradePlot = {
      created: this.created,
      createdby: this.createdby,
      description: this.description,
      goal: this.goal,
      id: this.id,
      isShort: this.isShort,
      purchase: this.purchase,
      shares: this.shares,
      subplots: this.subplots.map((subplot) => subplot.toApi()),
      ticker: this.ticker,
      updated: this.updated,
      updatedby: this.updatedby,
    }

    return ret
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
    return !isNullOrUndefined(this.investmentAmountStart) &&
      !isNullOrUndefined(this.investmentAmountGainPercent(currentPrice))
      ? getAsNumber(this.investmentAmountStart) *
          getAsNumber(this.investmentAmountGainPercent(currentPrice))
      : undefined
  }
  investmentAmountGainDisplay(currentPrice: number, maxDecimalPlaces: number) {
    const gain = this.investmentAmountGain(currentPrice)
    if (!gain) {
      return '$0'
    }

    return PriceInDollars(gain, true, maxDecimalPlaces)
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
      ? getPercentChangeString(currentPrice, getAsNumber(this.purchase))
      : getPercentChangeString(getAsNumber(this.purchase), currentPrice)
  }

  get investmentAmountStart() {
    if (!isNullOrUndefined(this.purchase)) {
      return this.purchase * this.shares
    }
  }
  get investmentAmountStartDisplay() {
    if (!this.investmentAmountStart) {
      return '$0'
    }

    return PriceInDollars(this.investmentAmountStart)
  }

  get startingInvestment() {
    return this.purchase ? this.purchase * this.shares : 0
  }

  getAmountToGoal(price?: number) {
    return price && this.goal ? price - this.goal : undefined
  }
  getPercentToGoal(price?: number) {
    const a2goal = this.getAmountToGoal(price)
    return !isNullOrUndefined(a2goal) && this.goal && this.goal !== 0
      ? a2goal / this.goal
      : undefined
  }

  getProfit(price?: number) {
    if (
      price &&
      price > 0 &&
      this.purchase &&
      this.purchase > 0 &&
      this.shares > 0
    ) {
      const profit = this.isShort
        ? this.purchase - price
        : price - this.purchase

      return profit * this.shares
    }
  }

  getMaxExpectedTriggerDate(dateNow: number) {
    const dateNum = this.subplots.reduce((acc: number, cur) => {
      const triggerDateNum = cur.expectedTriggerDate
        ? Number(cur.expectedTriggerDate)
        : 0

      return acc < triggerDateNum ? triggerDateNum : acc
    }, 0)

    if (dateNum >= dateNow) {
      return new Date(dateNum)
    }
  }

  getMinExpectedTriggerDate(dateNow: number) {
    const dateNum = this.subplots.reduce((acc: number, cur) => {
      const triggerDateNum = cur.expectedTriggerDate
        ? Number(cur.expectedTriggerDate)
        : 0

      // If acc is 0, then we are looking for the first trigger date that is >= dateNow
      // If acc is not 0, then we are looking for the earliest trigger date that is >= dateNow
      return !acc && triggerDateNum >= dateNow
        ? triggerDateNum
        : acc > triggerDateNum
        ? triggerDateNum
        : acc
    }, 0)

    if (dateNum >= dateNow) {
      return new Date(dateNum)
    }
  }

  getNextExpectedTriggerDate(dateNow: number) {
    const dateNum = this.subplots.reduce((acc: number, cur) => {
      const triggerDateNum = cur.expectedTriggerDate
        ? Number(cur.expectedTriggerDate)
        : 0

      return dateNow <= triggerDateNum && acc < triggerDateNum
        ? triggerDateNum
        : acc
    }, 0)

    if (dateNum) {
      return new Date(dateNum)
    }
  }

  getNextOrderNumber(dateNow: number) {
    const nextDate = this.getNextExpectedTriggerDate(dateNow)
    if (nextDate) {
      const nextDateNum = Number(nextDate)
      return this.subplots.find(
        (x) => nextDateNum && nextDateNum === Number(x.expectedTriggerDate ?? 0)
      )?.orderNumber
    }
  }

  getPrevExpectedTriggerDate(dateNow: number) {
    const dateNum = this.subplots.reduce((acc: number, cur) => {
      const triggerDateNum = cur.expectedTriggerDate
        ? Number(cur.expectedTriggerDate)
        : 0

      return dateNow > triggerDateNum && acc < triggerDateNum
        ? triggerDateNum
        : acc
    }, 0)

    if (dateNum) {
      return new Date(dateNum)
    }
  }

  getAmountToTargetLow(price?: number) {
    return !isNullOrUndefined(this.getTargetLow()) && !isNullOrUndefined(price)
      ? price - this.getTargetLow()
      : undefined
  }
  getAmountToTargetHigh(price?: number) {
    return !isNullOrUndefined(this.getTargetHigh()) && !isNullOrUndefined(price)
      ? this.getTargetHigh() - price
      : undefined
  }
  getPercentToTargetLow(price?: number) {
    return !isNullOrUndefined(this.getTargetLow()) && price
      ? (price - this.getTargetLow()) / price
      : undefined
  }
  getPercentToTargetHigh(price?: number) {
    return !isNullOrUndefined(this.getTargetHigh()) && price
      ? (this.getTargetHigh() - price) / price
      : undefined
  }
}

export type ITradePlotProfitizerWithContext = {
  emas: IIdValue<ISubplot['id'], IQuoteBarEma[]>[]
  profitizer?: ITradePlotProfitizer
  quote?: IAssetQuoteResponse
  tradePlot: ITradePlot
}
