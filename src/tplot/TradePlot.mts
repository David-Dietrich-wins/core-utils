import { AppException } from '../models/AppException.mjs'
import { IIdValue } from '../models/id-value.mjs'
import { IIdRequired } from '../models/IdManager.mjs'
import { ICreatedBy, IUpdatedBy } from '../models/interfaces.mjs'
import {
  IAssetQuoteResponse,
  IQuoteBarEma,
  ITicker,
} from '../models/ticker-info.mjs'
import { FormStatus, FormStatusManager } from '../services/FormStatus.mjs'
import {
  getNumberFormatted,
  getPercentChangeString,
  isNullOrUndefined,
  isObject,
  newGuid,
  safeArray,
} from '../services/general.mjs'
import { getStockPriceInDollars } from '../services/number-helper.mjs'
import { ISubplot, Subplot } from './Subplot.mjs'
import { ITradePlotProfitizer } from './TradePlotProfitizer.mjs'

export interface ITradePlot
  extends IIdRequired<string>,
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

  constructor(obj?: ITradePlot) {
    if (obj) {
      this.copyObject(obj)
    }
  }

  static CreateFromTicker(ticker: string, email: string) {
    if (!ticker) {
      throw new AppException(
        'You must specify a ticker to create a TradePlot.',
        'TradePlot.CreateFromTicker'
      )
    }
    if (!email) {
      throw new AppException(
        'You must specify an email to create a TradePlot.',
        'TradePlot.CreateFromTicker'
      )
    }

    const tp = new TradePlot()
    tp.ticker = ticker
    tp.subplots = [Subplot.GetNewWithNextPattern()]

    tp.updatedby = email
    tp.createdby = email

    return tp
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

    this.shares = obj.shares

    this.updatedby = obj.updatedby || 'TradePlot'
    this.updated = obj.updated || new Date()
    this.createdby = obj.createdby || 'TradePlot'
    this.created = obj.created || new Date()

    this.subplots = safeArray(obj.subplots).map(
      (subplot) => new Subplot(subplot)
    )
  }

  createFormStatus() {
    const topLevelStatus = FormStatus.CreateTopLevel()
    const parentId = topLevelStatus.id
    const ret: FormStatusManager<ITradePlot> = {
      topLevelStatus,
      id: this.id,
      subplots: safeArray(this.subplots).map((x) =>
        x.createFormStatus(parentId)
      ),
      created: FormStatus.CreateItem('', parentId, this.id),
      createdby: FormStatus.CreateItem('', parentId, this.id),
      description: FormStatus.CreateItem(
        'input[name="description"]',
        parentId,
        this.id
      ),
      goal: FormStatus.CreateItem('input[name="goal"]', parentId, this.id),
      isShort: FormStatus.CreateItem(
        'input[name="isShort"]',
        parentId,
        this.id
      ),
      purchase: FormStatus.CreateItem(
        'input[name="purchase"]',
        parentId,
        this.id
      ),
      shares: FormStatus.CreateItem('input[name="shares"]', parentId, this.id),
      ticker: FormStatus.CreateItem('input[name="ticker"]', parentId, this.id),
      updated: FormStatus.CreateItem('', parentId, this.id),
      updatedby: FormStatus.CreateItem('', parentId, this.id),
    }

    ret.topLevelStatus.errorStatus = FormStatus.FindAllErrorsFromChildren(ret)
    return ret
  }

  toApi() {
    const ret: ITradePlot = {
      id: this.id,
      ticker: this.ticker,
      description: this.description,
      goal: this.goal,
      isShort: this.isShort,
      purchase: this.purchase,
      shares: this.shares,
      subplots: this.subplots.map((subplot) => subplot.toApi()),
      updatedby: this.updatedby,
      updated: this.updated,
      createdby: this.createdby,
      created: this.created,
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
      ? (this.investmentAmountStart ?? 0) *
          (this.investmentAmountGainPercent(currentPrice) ?? 0)
      : undefined
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
    return !isNullOrUndefined(this.purchase)
      ? this.purchase * this.shares
      : undefined
  }
  get investmentAmountStartDisplay() {
    if (!this.investmentAmountStart) {
      return '$0'
    }

    return getStockPriceInDollars(this.investmentAmountStart)
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
        ? +cur.expectedTriggerDate
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
        ? +cur.expectedTriggerDate
        : 0

      return acc > triggerDateNum ? triggerDateNum : acc
    }, 0)

    if (dateNum >= dateNow) {
      return new Date(dateNum)
    }
  }

  getNextExpectedTriggerDate(dateNow: number) {
    const dateNum = this.subplots.reduce((acc: number, cur) => {
      const triggerDateNum = cur.expectedTriggerDate
        ? +cur.expectedTriggerDate
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
      const nextDateNum = +nextDate
      return this.subplots.find(
        (x) => nextDateNum && nextDateNum === +(x.expectedTriggerDate ?? 0)
      )?.orderNumber
    }
  }

  getPrevExpectedTriggerDate(dateNow: number) {
    const dateNum = this.subplots.reduce((acc: number, cur) => {
      const triggerDateNum = cur.expectedTriggerDate
        ? +cur.expectedTriggerDate
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
