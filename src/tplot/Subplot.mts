import { z } from 'zod/v4'
import { IIdRequired } from '../models/IdManager.mjs'
import { FmpIndicatorQueryParams } from '../models/ticker-info.mjs'
import { arrayMustFind, safeArray } from '../services/array-helper.mjs'
import { DateHelper } from '../services/DateHelper.mjs'
import { newGuid } from '../services/general.mjs'
import { isObject } from '../services/object-helper.mjs'
import { zDateTime } from '../services/zod-helper.mjs'
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

  static get zSchema() {
    const schema = z.object({
      id: z.string(),
      orderNumber: z.number().min(0).max(100).default(0),
      pattern: z.string().default(''),
      timeframe: z.string().default(''),
      total: z.number().nonnegative().optional(),
      targetLow: z.number().min(0).max(10000000).optional(),
      targetHigh: z.number().min(0).max(10000000).optional(),
      expectedTriggerDate: zDateTime().optional(),
      comment: z.string().max(1000).default(''),
      lossFloorPercent: z.number().min(0).max(100).default(8),
      gainCeilingPercent: z.number().min(0).max(100).default(10),
      useMinusEight: z.boolean().default(true),
      scaleInverted: z.boolean().default(false),
    })

    return schema
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
