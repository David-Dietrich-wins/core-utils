import * as z from 'zod/v4'
import {
  ChartPatternOptions,
  TradeSubplotTimeFrameOptions,
} from './ChartSettings.mjs'
import { arrayMustFind, safeArray } from '../primitives/array-helper.mjs'
import { DateHelper } from '../primitives/date-helper.mjs'
import { FmpIndicatorQueryParams } from '../services/TradeClient/FinancialModelingPrep.mjs'
import { IIdRequired } from '../models/IdManager.mjs'
import { isObject } from '../primitives/object-helper.mjs'
import { newGuid } from '../primitives/uuid-helper.mjs'
import { zDateTime } from '../services/zod-helper.mjs'

export interface ISubplot extends IIdRequired {
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
      // Constructor items
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
      comment: z.string().max(1000).default(''),
      expectedTriggerDate: zDateTime().optional(),
      gainCeilingPercent: z.number().min(0).max(100).default(10),
      id: z.string(),
      lossFloorPercent: z.number().min(0).max(100).default(8),
      orderNumber: z.number().min(0).max(100).default(0),
      pattern: z.string().default(''),
      scaleInverted: z.boolean().default(false),
      targetHigh: z.number().min(0).max(10000000).optional(),
      targetLow: z.number().min(0).max(10000000).optional(),
      timeframe: z.string().default(''),
      total: z.number().nonnegative().optional(),
      useMinusEight: z.boolean().default(true),
    })

    return schema
  }

  static GetFmpIndicatorQueryParams(symbol: string, subplot: ISubplot) {
    const { periodLength } = arrayMustFind(
        ChartPatternOptions,
        subplot.pattern
      ),
      fmp: FmpIndicatorQueryParams = {
        from: DateHelper.addDaysToDate(-5).getTime(),
        periodLength,
        symbol,
        timeframe: arrayMustFind(
          TradeSubplotTimeFrameOptions,
          subplot.timeframe
        ).fmpTimeFrame,
      }

    return fmp
  }

  static GetNewWithNextPattern(subplots: ISubplot[] = []) {
    let pattern = 'b28'

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
    this.id = dbtp.id || newGuid()
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
      comment: this.comment,
      expectedTriggerDate: this.expectedTriggerDate,
      gainCeilingPercent: this.gainCeilingPercent,
      id: this.id,
      lossFloorPercent: this.lossFloorPercent,
      orderNumber: this.orderNumber,
      pattern: this.pattern,
      scaleInverted: this.scaleInverted,
      targetHigh: this.targetHigh,
      targetLow: this.targetLow,
      timeframe: this.timeframe,
      total: this.total,
      useMinusEight: this.useMinusEight,
    }

    return ret
  }
}
