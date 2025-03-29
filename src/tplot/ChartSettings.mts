import moment, { Moment } from 'moment'
import { IFacet } from './Facet.mjs'
import { IPrice } from '../models/interfaces.mjs'
import { IPlotPricesWithMidpoint } from '../models/ticker-info.mjs'
import { hasData, safestr, safestrLowercase } from '../services/general.mjs'
import { IIdName } from '../models/id-name.mjs'

export const ChartTimeFrameOptions: IIdName[] = [
  { id: '1m', name: '1 minute' },
  { id: '2m', name: '2 minute' },
  { id: '3m', name: '3 minute' },
  { id: '5m', name: '5 minute' },
  { id: '10m', name: '10 minute' },
  { id: '15m', name: '15 minute' },
  { id: '30m', name: '30 minute' },
  { id: '1h', name: '1 hour' },
  { id: '4h', name: '4 hour' },
  { id: '1d', name: '1 day' },
  { id: '1w', name: '1 week' },
  { id: '1M', name: '1 month' },
] as const

export const ChartPatternOptions: Required<IIdName>[] = [
  { id: 'b28', name: 'Back to the 8' },
  { id: 'ra200', name: 'Resistance at the 200' },
  { id: 'ra50', name: 'Resistance at the 50' },
  { id: 'spt200', name: 'Support at the 200' },
  { id: 'spt50', name: 'Support at the 50' },
  { id: 'x8x21', name: '8 and 21 cross' },
] as const

export interface IPlotMsg {
  symbol: string
  price?: number
  quantity?: number
  lineColor: string
  msgText: string
}

export interface IFacetPoint extends IPrice {
  time: number
}

export interface IShapeInfo {
  shape: string
  lock: boolean
  disableSelection: boolean
  disableSave: boolean
  disableUndo: boolean
  text: string
}

export interface IShapePosition {
  shapeInfo: IShapeInfo
  plotlineData: IPlotPricesWithMidpoint
  points: IFacetPoint[]
}

export class ChartPlotReturn {
  plotlist: IPlotMsg[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drawings: any = {}
  facets: IFacet[] = []
  positions: IShapePosition[] = []
}

export interface IChartData {
  ticker: string
  period: number
  periodType: string
  frequency: number
  frequencyType: string
  granularity?: string
  needExtendedHoursTrading?: boolean
  startDate?: number // as milliseconds since epoch
  endDate?: number // as milliseconds since epoch
}

export class ChartSettings implements IChartData {
  static CONST_FmpYearFormat = 'YYYY-MM-DD'

  ticker = ''
  /**
   * The number of periods to show.
   * Example: For a 2 day / 1 min chart, the values would be:
   * period: 2
   * periodType: day
   * frequency: 1
   * frequencyType: min
   * Valid periods by periodType (defaults marked with an asterisk):
   * day: 1, 2, 3, 4, 5, 10*
   * month: 1*, 2, 3, 6
   * year: 1*, 2, 3, 5, 10, 15, 20
   * ytd: 1
   */
  period = 1

  /**
   * day, month, year, ytd
   */
  periodType = 'day'

  /**
   * The number of the frequencyType to be included in each candle.
   * Valid frequencies by frequencyType (defaults marked with an asterisk):
   * minute: 1*, 5, 10, 15, 30
   * daily: 1*
   * weekly: 1*
   * monthly: 1*
   */
  frequency = 1

  /**
   * The type of frequency with which a new candle is formed.
   * Valid frequencyTypes by periodType (defaults marked with an asterisk):
   * day: minute*
   * month: daily, weekly*
   * year: daily, weekly, monthly*
   * ytd: daily, weekly*
   */
  frequencyType = ''

  /** Specify a granularity string. FMP uses this as its ResolutionString */
  granularity = ''

  /** true to return extended hours data, false for regular market hours only. Defaults to true. */
  needExtendedHoursTrading = false

  /**
   * Start date as milliseconds since epoch.
   * If startDate and endDate are provided, period should not be provided.
   */
  startDate?: number
  #_startMoment?: Moment
  #_startMillis?: number

  /**
   * End date as milliseconds since epoch. If startDate and endDate are provided,
   * period should not be provided. Default is previous trading day.
   */
  endDate?: number
  #_endMoment?: Moment
  #_endMillis?: number

  constructor(
    ticker: string,
    period: number,
    periodType: string,
    frequency: number,
    frequencyType: string,
    granularity: string,
    startDate: number,
    endDate: number,
    needExtendedHoursTrading: boolean
  ) {
    this.ticker = safestr(ticker)

    this.period = period ?? 1
    this.periodType = safestr(periodType)

    this.frequency = frequency ?? 1
    this.frequencyType = safestr(frequencyType)
    this.granularity = safestr(granularity)

    if (startDate) {
      this.startDate = startDate
      this.#_startMoment = moment.unix(startDate)
      if (!this.#_startMoment.isValid()) {
        throw new Error(`Invalid date format for start date: ${startDate}.`)
      }

      // this.#_startMoment = this.#_startMoment.startOf('day');

      this.#_startMillis = this.#_startMoment.valueOf()
    }
    if (endDate) {
      this.endDate = endDate
      this.#_endMoment = moment.unix(endDate)
      if (!this.#_endMoment.isValid()) {
        throw new Error(`Invalid date format for start date: ${endDate}.`)
      }

      // this.#_endMoment = this.#_endMoment.endOf('day');

      this.#_endMillis = this.#_endMoment.valueOf()
    }

    if (needExtendedHoursTrading) {
      this.needExtendedHoursTrading = needExtendedHoursTrading
    }
  }

  static fromToForFmpStatic(startMoment?: Moment, endMoment?: Moment) {
    let s = '&from=' + startMoment?.format(ChartSettings.CONST_FmpYearFormat)
    s += '&to=' + endMoment?.format(ChartSettings.CONST_FmpYearFormat)

    return s
  }
  static fromToForFmpForThePastYear() {
    return ChartSettings.fromToForFmpStatic(moment().add(-1, 'year'), moment())
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isToday(date?: any): boolean {
    if (!date) {
      return false
    }

    const mdate = moment(date)
    const mtoday = moment()

    return mtoday.isSame(mdate, 'day')
  }
  static isYesterday(date: Date): boolean {
    if (!date) {
      return false
    }

    const mdate = moment(date)
    const yesterday = moment().subtract(1, 'day')

    return yesterday.isSame(mdate, 'day')
  }

  get chartTimeForFmp() {
    let chartTime = ''
    switch (this.granularity) {
      case '1':
        chartTime = '1min'
        break
      case '5':
        chartTime = '5min'
        break
      case '15':
        chartTime = '15min'
        break
      case '30':
        chartTime = '30min'
        break
      case '60':
        chartTime = '1hour'
        break
      case '240':
        chartTime = '4hour'
        break
      // case '1D':
      //   break;
      default:
        break
    }

    return chartTime
  }

  static frequencyTypeString(frequencyType: string, granularity: string) {
    let ftype = safestrLowercase(
      hasData(frequencyType) ? frequencyType : granularity
    )

    switch (ftype) {
      case '1':
        ftype = '1 minute'
        break
      case '5':
        ftype = '5 minute'
        break
      case '15':
        ftype = '15 minute'
        break
      case '30':
        ftype = '30 minute'
        break
      case '60':
        ftype = '1 hour'
        break
      case '240':
        ftype = '4 hour'
        break
      case 'd':
      case '1d':
      case 'daily':
      case '':
        ftype = 'Daily'
        break
      case 'w':
      case '1w':
      case 'weekly':
        ftype = 'Weekly'
        break
      case 'm':
      case '1m':
      case 'monthly':
        ftype = 'Monthly'
        break
      default:
        break
    }

    return ftype
  }
  get frequencyTypeFriendlyString() {
    return ChartSettings.frequencyTypeString(
      this.frequencyType,
      this.granularity
    )
  }

  get debugMessage() {
    let s = this.frequencyTypeFriendlyString

    const fromDateStr = this.startDate
      ? this.startMoment!.format(ChartSettings.CONST_FmpYearFormat)
      : ''
    const toDateStr = this.endDate
      ? this.endMoment!.format(ChartSettings.CONST_FmpYearFormat)
      : ''

    if (fromDateStr && toDateStr) {
      s += ` from ${fromDateStr} to ${toDateStr}`
    }

    return s
  }

  get endIsToday() {
    return ChartSettings.isToday(this.endMoment)
  }
  get fromToForFmp() {
    return ChartSettings.fromToForFmpStatic(this.startMoment, this.endMoment)
  }
  get hasStartDate() {
    return hasData(this.startDate)
  }
  get hasEndDate() {
    return hasData(this.endDate)
  }

  get isDailyChart() {
    return 'Daily' === this.frequencyTypeFriendlyString
  }

  get startDateAsDate() {
    return this.startMoment?.toDate()
  }
  get endDateAsDate() {
    return this.endMoment?.toDate()
  }

  get startMillis() {
    return this.#_startMillis
  }
  get endMillis() {
    return this.#_endMillis
  }

  get startMoment() {
    return this.#_startMoment
  }
  get endMoment() {
    return this.#_endMoment
  }

  static periodWithTypeString(period: number, periodType: string) {
    let str = period > 0 ? '' + period : '1'

    str += ' ' + (hasData(periodType) ? periodType : 'year')

    return str
  }

  static oneMinute(ticker: string) {
    return new ChartSettings(ticker, 2, 'day', 1, 'minute', '1', 0, 0, true)
  }
  static fiveMinute(ticker: string) {
    return new ChartSettings(ticker, 5, 'day', 5, 'minute', '1', 0, 0, true)
  }
  static tenMinute(ticker: string) {
    return new ChartSettings(ticker, 10, 'day', 10, 'minute', '1', 0, 0, true)
  }
  static fifteenMinute(ticker: string) {
    return new ChartSettings(ticker, 15, 'day', 15, 'minute', '1', 0, 0, true)
  }
  static thirtyMinute(ticker: string) {
    return new ChartSettings(ticker, 30, 'day', 30, 'minute', '1', 0, 0, true)
  }
  // static oneHour() {
  //   return new ChartSettings('day', 60, 'hour', 1);
  // }
  // static fourHour() {
  //   return new ChartSettings('day', 60, 'hour', 4);
  // }
  static oneDay(ticker: string) {
    return new ChartSettings(ticker, 90, 'day', 1, 'daily', '1', 0, 0, true)
  }
  static oneWeek(ticker: string) {
    return new ChartSettings(ticker, 2, 'year', 1, 'weekly', '1', 0, 0, false)
  }
  static oneMonth(ticker: string) {
    return new ChartSettings(ticker, 10, 'year', 1, 'monthly', '1', 0, 0, false)
  }

  static CreateForTradingView(
    ticker: string,
    startDate: number,
    endDate: number,
    resolution: string,
    extendedHours = true
  ) {
    return new ChartSettings(
      ticker,
      1,
      'day',
      1,
      'minute',
      resolution,
      startDate,
      endDate,
      extendedHours
    )
  }
}
