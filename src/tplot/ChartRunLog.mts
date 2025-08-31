import { IChartRunLogApiReturn, IUserId } from '../models/interfaces.mjs'
import { ChartSettings } from './ChartSettings.mjs'
import { ITicker } from '../models/ticker-info.mjs'
import { isObject } from '../primitives/object-helper.mjs'
import { safestr } from '../primitives/string-helper.mjs'

export interface IChartRunLog<T = string> extends IUserId<T>, ITicker {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings?: any
  lang: string
  browser: string
  ip: string
  startDate?: Date
  endDate?: Date

  frequency: number
  frequencyType: string
  granularity: string
  period: number
  periodType: string
  needExtendedHoursTrading: boolean
}

export class ChartRunLog implements IChartRunLog {
  userid
  ticker = ''
  lang = ''
  browser = ''
  ip = ''

  period = 0
  periodType = ''
  frequency = 0
  frequencyType = ''
  granularity = ''
  needExtendedHoursTrading = false

  startDate?: Date
  endDate?: Date

  created = new Date()

  constructor(
    userid: string,
    ticker: string,
    lang: string,
    browser: string,
    ip: string,
    settings?: ChartSettings
  ) {
    this.userid = userid

    this.ticker = ticker
    this.lang = safestr(lang)
    this.browser = safestr(browser)
    this.ip = safestr(ip)

    if (isObject(settings)) {
      Object.assign(this, settings)
    }

    // If (settings.hasStartDate) {
    //   This.startDate = settings.startDateAsDate
    // }
    // If (settings.hasEndDate) {
    //   This.endDate = settings.endDateAsDate
    // }
  }

  static fromDb(settings: IChartRunLog): ChartRunLog {
    const crl = new ChartRunLog(
      safestr(settings.userid),
      settings.ticker,
      settings.lang,
      settings.browser,
      settings.ip
    )

    return Object.assign(crl, settings)
  }

  static toApi(settings: IChartRunLog) {
    const cs = ChartRunLog.fromDb(settings),
      csret: IChartRunLogApiReturn = {
        created: cs.created,
        endDate: cs.endDate ? Number(cs.endDate) : 0,
        frequency: ChartSettings.frequencyTypeString(
          cs.frequencyType,
          cs.granularity
        ),
        period: ChartSettings.periodWithTypeString(cs.period, cs.periodType),
        startDate: cs.startDate ? Number(cs.startDate) : 0,
        ticker: cs.ticker,
      }

    return csret
  }
}
