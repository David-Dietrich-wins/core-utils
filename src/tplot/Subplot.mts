import { IIdRequired } from '../models/IdManager.mjs'
import { FmpIndicatorQueryParams } from '../models/ticker-info.mjs'
import { arrayMustFind } from '../services/array-helper.mjs'
import { DateHelper } from '../services/DateHelper.mjs'
import { FormStatus, FormStatusItem } from '../services/FormStatus.mjs'
import { isObject, newGuid, safeArray } from '../services/general.mjs'
import {
  ChartPatternOptions,
  TradeSubplotTimeFrameOptions,
} from './ChartSettings.mjs'

export interface ISubplot extends IIdRequired<string> {
  orderNumber: number
  pattern: string
  timeframe: string
  total?: number
  targetLow?: number
  targetHigh?: number
  expectedTriggerDate?: Date
  comment: string
  lossFloorPercent: number
  gainCeilingPercent: number
  useMinusEight: boolean
  scaleInverted: boolean
}

/**
 * A view of the Subplot for a TradePlot.
 */
export class Subplot implements ISubplot {
  id = newGuid()
  orderNumber = 0
  pattern = ''
  timeframe = ''
  total?: number
  targetLow?: number
  targetHigh?: number
  expectedTriggerDate?: Date
  comment = ''
  lossFloorPercent = 8
  gainCeilingPercent = 10
  useMinusEight = true
  scaleInverted = false

  constructor(
    id: ISubplot['id'] | ISubplot,
    orderNumber = 0,
    pattern = '',
    timeframe = '',
    total?: number,
    targetLow?: number,
    targetHigh?: number,
    expectedTriggerDate?: Date,
    comment = '',
    lossFloorPercent = 8,
    gainCeilingPercent = 10,
    useMinusEight = true,
    scaleInverted = false
  ) {
    if (isObject(id)) {
      this.copyObject(id)
    } else {
      // constructor items
      this.id = id
      this.orderNumber = orderNumber
      this.pattern = pattern
      this.timeframe = timeframe
      this.total = total
      this.targetLow = targetLow
      this.targetHigh = targetHigh
      this.expectedTriggerDate = expectedTriggerDate
      this.comment = comment
      this.lossFloorPercent = lossFloorPercent
      this.gainCeilingPercent = gainCeilingPercent
      this.useMinusEight = useMinusEight
      this.scaleInverted = scaleInverted
    }
  }

  createFormStatus(parentId: FormStatusItem['id']) {
    const sperr = FormStatus.CreateChild<ISubplot>(this.id, parentId, {
      orderNumber: FormStatus.CreateItem('', parentId, this.id),
      pattern: FormStatus.CreateItem(
        'input[name="pattern"]',
        parentId,
        this.id
      ),
      timeframe: FormStatus.CreateItem(
        'input[name="timeframe"]',
        parentId,
        this.id
      ),
      total: FormStatus.CreateItem('input[name="total"]', parentId, this.id),
      targetLow: FormStatus.CreateItem(
        'input[name="targetLow"]',
        parentId,
        this.id
      ),
      targetHigh: FormStatus.CreateItem(
        'input[name="targetHigh"]',
        parentId,
        this.id
      ),
      expectedTriggerDate: FormStatus.DateBeforeMidnightToday(
        'input[name="expectedTriggerDate"]',
        this.expectedTriggerDate,
        parentId,
        this.id
      ),
      comment: FormStatus.CreateItem(
        'input[name="comment"]',
        parentId,
        this.id
      ),
      lossFloorPercent: FormStatus.CreateItem(
        'input[name="lossFloorPercent"]',
        parentId,
        this.id
      ),
      gainCeilingPercent: FormStatus.CreateItem(
        'input[name="gainCeilingPercent"]',
        parentId,
        this.id
      ),
      useMinusEight: FormStatus.CreateItem(
        'input[name="useMinusEight"]',
        parentId,
        this.id
      ),
      scaleInverted: FormStatus.CreateItem(
        'input[name="scaleInverted"]',
        parentId,
        this.id
      ),
    })

    return sperr
  }
  static GetFmpIndicatorQueryParams(symbol: string, subplot: ISubplot) {
    const periodLength = arrayMustFind(
      ChartPatternOptions,
      subplot.pattern
    ).periodLength

    const fmp: FmpIndicatorQueryParams = {
      periodLength,
      symbol,
      timeframe: arrayMustFind(TradeSubplotTimeFrameOptions, subplot.timeframe)
        .fmpTimeFrame,
      from: DateHelper.addDaysToDate(-5).getTime(),
    }

    return fmp
  }

  static GetNewWithNextPattern(subplots: ISubplot[] = []) {
    let pattern = 'b28' // default pattern

    const subplotPatterns = safeArray(subplots).map((sp) => sp.pattern)
    for (let i = 0; i < ChartPatternOptions.length; i++) {
      if (!subplotPatterns.includes(ChartPatternOptions[i].id)) {
        pattern = ChartPatternOptions[i].id

        break
      }
    }

    return new Subplot(newGuid(), 0, pattern, '1d', 0, 0, 1000)
  }

  static Renumber(subplots: ISubplot[]) {
    safeArray(subplots).forEach((sp, index) => {
      sp.orderNumber = index
    })

    return subplots
  }

  copyObject(dbtp: ISubplot) {
    this.id = dbtp.id ?? newGuid()
    this.orderNumber = dbtp.orderNumber
    this.pattern = dbtp.pattern
    this.timeframe = dbtp.timeframe
    this.total = dbtp.total
    this.targetLow = dbtp.targetLow
    this.targetHigh = dbtp.targetHigh
    this.expectedTriggerDate = dbtp.expectedTriggerDate
    this.comment = dbtp.comment
    this.lossFloorPercent = dbtp.lossFloorPercent
    this.gainCeilingPercent = dbtp.gainCeilingPercent
    this.useMinusEight = dbtp.useMinusEight
    this.scaleInverted = dbtp.scaleInverted
  }

  toApi() {
    const ret: ISubplot = {
      id: this.id,
      orderNumber: this.orderNumber,
      pattern: this.pattern,
      timeframe: this.timeframe,
      total: this.total,
      targetLow: this.targetLow,
      targetHigh: this.targetHigh,
      expectedTriggerDate: this.expectedTriggerDate,
      comment: this.comment,
      lossFloorPercent: this.lossFloorPercent,
      gainCeilingPercent: this.gainCeilingPercent,
      useMinusEight: this.useMinusEight,
      scaleInverted: this.scaleInverted,
    }

    return ret
  }
}
