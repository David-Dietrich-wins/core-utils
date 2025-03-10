import { IId } from '../models/interfaces.mjs'
import { isObject } from '../services/general.mjs'

export interface ISubplot extends IId<number> {
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
  id = 0
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
    id: number | ISubplot = 0,
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
      this.copyObject(id as ISubplot)
    } else {
      // constructor items
      this.id = id as number
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

  copyObject(dbtp: ISubplot) {
    this.id = dbtp.id || 0
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

  // toApi() {
  //   return {
  //     id: this.id,
  //     orderNumber: this.orderNumber,
  //     pattern: this.pattern,
  //     timeframe: this.timeframe,
  //     total: this.total,
  //     targetLow: this.targetLow,
  //     targetHigh: this.targetHigh,
  //     expectedTriggerDate: this.expectedTriggerDate,
  //     patcomment: this.comment,
  //     lossFloorPercent: this.lossFloorPercent,
  //     gainCeilingPercent: this.gainCeilingPercent,
  //     useMinusEight: this.useMinusEight,
  //     scaleInverted: this.scaleInverted
  //   }
  // }
}
