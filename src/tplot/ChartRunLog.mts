import { ObjectId } from 'bson'
import { isObject, safestr } from '../services/general.mjs'
import { ChartSettings } from './ChartSettings.mjs'
import {
  IChartRunLogApiReturn,
  IUserId,
  StringOrObjectId,
} from '../models/interfaces.mjs'
import { ITicker } from '../models/ticker-info.mjs'

export interface IChartRunLog extends IUserId, ITicker {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings?: any
  sessionid: string
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
  sessionid = ''
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
    userid: StringOrObjectId,
    ticker: string,
    sessionid: string,
    lang: string,
    browser: string,
    ip: string,
    settings?: ChartSettings
  ) {
    this.userid = new ObjectId(userid)

    this.ticker = ticker
    this.sessionid = safestr(sessionid)
    this.lang = safestr(lang)
    this.browser = safestr(browser)
    this.ip = safestr(ip)

    if (isObject(settings)) {
      Object.assign(this, settings)
    }

    // if (settings.hasStartDate) {
    //   this.startDate = settings.startDateAsDate
    // }
    // if (settings.hasEndDate) {
    //   this.endDate = settings.endDateAsDate
    // }
  }

  static fromDb(settings: IChartRunLog): ChartRunLog {
    const crl = new ChartRunLog(
      settings.userid,
      settings.ticker,
      settings.sessionid,
      settings.lang,
      settings.browser,
      settings.ip
    )

    return Object.assign(crl, settings)
  }

  static toApi(settings: IChartRunLog) {
    const cs = ChartRunLog.fromDb(settings)

    const apiret: IChartRunLogApiReturn = {
      frequency: ChartSettings.frequencyTypeString(
        cs.frequencyType,
        cs.granularity
      ),
      period: ChartSettings.periodWithTypeString(cs.period, cs.periodType),
      endDate: cs.endDate ? +cs.endDate : 0,
      startDate: cs.startDate ? +cs.startDate : 0,
      ticker: cs.ticker,
      created: cs.created,
    }

    return apiret
  }
}
