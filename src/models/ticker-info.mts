import moment from 'moment'
import { IdName } from '../models/id-name.mjs'
import {
  getAsNumber,
  getAsNumberOrUndefined,
  isArray,
  isObject,
  isString,
  safeArray,
  safestr,
  safestrUppercase,
} from '../services/general.mjs'
import { IDate, IName, IPrice, IType, IVal } from '../models/interfaces.mjs'
import { IHasPolitiscales } from '../politagree/politiscale.mjs'
import { IId } from './IdManager.mjs'
import { AnyRecord, FromTo } from './types.mjs'
import { AppException } from './AppException.mjs'
import { DateHelper } from '../services/DateHelper.mjs'

export interface ISymbol {
  symbol: string
}
export interface ITicker {
  ticker: string
}
export interface IVolume<T = number> {
  volume: T
}

export interface ISymbolName extends ISymbol, IName {}

export interface ISymbolPrice extends ISymbol, IPrice {}
export interface ISymbolPriceName extends ISymbolPrice, ISymbolName {}

export interface ISymbolPriceVolume extends ISymbolPrice, IVolume {}

export interface ISymbolSearch extends ISymbolName {
  currency: string
  stockExchange: string
  exchangeShortName: string
}

export interface IAssetQuoteResponse extends ISymbolPriceVolumeChanges {
  // symbol: string    // GME,
  // name: string      // GameStop Corp.,
  // price: number     // 203.0601,
  dayLow: number // 201.35,
  dayHigh: number // 214.0353,
  yearHigh: number // 483,
  yearLow: number // 3.77,
  marketCap: number // 14376655872,
  priceAvg50: number // 211.59486,
  priceAvg200: number // 136.80391,
  // volume: number    // 2006952,
  avgVolume: number // 9315590,
  exchange: string // NYSE,
  open: number // 214,
  previousClose: number // 212.31,
  eps: number // -1.78,
  pe: number // null,
  earningsAnnouncement: string // 2021-06-09T16:09:00.000+0000,
  sharesOutstanding: number // 70800004,
  timestamp: number // 1624635044
}

export interface IUsersWithCount<Tid = string> extends IId<Tid> {
  email: string
  firstname: string
  lastname: string
  status: number
  updated: Date
  created: Date
  lastlogin?: Date
  count: number
}
export interface ICompanyUsersWithCount extends IdName {
  total: number
  numusers: number
  status: number
  imageuri: string
  imageurihref: string
  email: string
  created: Date
}

export interface ILoginWithCount {
  email: string
  ip: string
  created: Date
  logoutTime: Date
}

export interface IExchangeInfo extends ISymbolPriceName {
  exchange: string
  exchangeShortName: string
}

export interface ICompanyExecutive extends ISymbolName {
  yearBorn: number
  pay: number
  currencyPay: string
  title: string
  gender: string
  titleSince: string
}

export interface ICompanyFinancialRatios {
  dividendYielTTM: number
  dividendYielPercentageTTM: number
  peRatioTTM: number
  pegRatioTTM: number
  payoutRatioTTM: number
  currentRatioTTM: number
  quickRatioTTM: number
  cashRatioTTM: number
  daysOfSalesOutstandingTTM: number
  daysOfInventoryOutstandingTTM: number
  operatingCycleTTM: number
  daysOfPayablesOutstandingTTM: number
  cashConversionCycleTTM: number
  grossProfitMarginTTM: number
  operatingProfitMarginTTM: number
  pretaxProfitMarginTTM: number
  netProfitMarginTTM: number
  effectiveTaxRateTTM: number
  returnOnAssetsTTM: number
  returnOnEquityTTM: number
  returnOnCapitalEmployedTTM: number
  netIncomePerEBTTTM: number
  ebtPerEbitTTM: number
  ebitPerRevenueTTM: number
  debtRatioTTM: number
  debtEquityRatioTTM: number
  longTermDebtToCapitalizationTTM: number
  totalDebtToCapitalizationTTM: number
  interestCoverageTTM: number
  cashFlowToDebtRatioTTM: number
  companyEquityMultiplierTTM: number
  receivablesTurnoverTTM: number
  payablesTurnoverTTM: number
  inventoryTurnoverTTM: number
  fixedAssetTurnoverTTM: number
  assetTurnoverTTM: number
  operatingCashFlowPerShareTTM: number
  freeCashFlowPerShareTTM: number
  cashPerShareTTM: number
  operatingCashFlowSalesRatioTTM: number
  freeCashFlowOperatingCashFlowRatioTTM: number
  cashFlowCoverageRatiosTTM: number
  shortTermCoverageRatiosTTM: number
  capitalExpenditureCoverageRatioTTM: number
  dividendPaidAndCapexCoverageRatioTTM: number
  priceBookValueRatioTTM: number
  priceToBookRatioTTM: number
  priceToSalesRatioTTM: number
  priceEarningsRatioTTM: number
  priceToFreeCashFlowsRatioTTM: number
  priceToOperatingCashFlowsRatioTTM: number
  priceCashFlowRatioTTM: number
  priceEarningsToGrowthRatioTTM: number
  priceSalesRatioTTM: number
  dividendYieldTTM: number
  enterpriseValueMultipleTTM: number
  priceFairValueTTM: number
}

export interface ICompanyInfo
  extends IId,
    IHasPolitiscales,
    IVal<IExchangeInfo>,
    IType {
  exchange: string
  industry: string
  minmov: number
  minmov2: number
  pricescale: number
  profile: ICompanyProfile
  sector: string
  createdby: string
  updatedby: string
}

export interface ICompanyScales
  extends IId,
    IName,
    Required<IHasPolitiscales>,
    ITicker,
    IType {
  description: string
  sector: string
  industry: string
  exchange: string
  exchangeShortName: string
  website: string
  ceo: string
  imageUrl: string
  fullTimeEmployees: number
  ipoDate: string
}

export interface ICompanyProfile extends ISymbolPrice {
  // symbol: string
  // price: number
  beta: number
  volAvg: number
  mktCap: number
  lastDiv: string
  range: string
  changes: number
  companyName: string
  currency: string
  isin: string
  isEtf: boolean
  cusip: string
  exchange: string
  exchangeShortName: string
  industry: string
  website: string
  description: string
  ceo: string
  sector: string
  country: string
  fullTimeEmployees: number
  phone: string
  address: string
  city: string
  state: string
  zip: string
  dcfDiff: string
  dcf: string
  image: string
  ipoDate: string
}

export interface ISymbolPriceChanges extends ISymbolPrice, ISymbolName {
  change: number
  changesPercentage: number
}

export interface ISymbolPriceVolumeChanges<TVolume = number>
  extends ISymbolPriceChanges,
    IVolume<TVolume> {}

export interface IIpoCalendar extends ISymbol, IDate {
  company: string
  exchange: string
  actions: string
  shares: number
  priceRange: string
  marketCap: number
}

export interface IPlotPricesWithMidpoint extends ISymbol {
  startPrice: number
  startDate: number
  endPrice: number
  endDate: number
  midprice: number
  requestDate: number
}

export interface IExtendedMovingAverage {
  ema: number
}
export interface ISimpleMovingAverage {
  sma: number
}
export interface IWeightedMovingAverage {
  wma: number
}
export interface IRelativeStrengthIndicator {
  rsi: number
}

export interface IQuoteBar<Tdate = string> extends IDate<Tdate>, IVolume {
  // date: string      // 2021-06-24,
  open: number // 221.16,
  high: number // 227.45,
  low: number // 211.6,
  close: number // 212.31,
  // volume: number    // 3866565,
}

export interface IQuoteBarEma extends IQuoteBar, IExtendedMovingAverage {}
export interface IQuoteBarSma extends IQuoteBar, ISimpleMovingAverage {}
export interface IQuoteBarWma extends IQuoteBar, IWeightedMovingAverage {}
export interface IQuoteBarRsi extends IQuoteBar, IRelativeStrengthIndicator {}

export interface IPriceHistoricalFull extends IQuoteBar {
  adjClose: number // 212.31,
  unadjustedVolume: number // 3866565,
  change: number // -8.85,
  changePercent: number // -4.002,
  vwap: number // 217.12, Volume Weighted Average Price
  label: string // June 24, 21,
  changeOverTime: number // -0.04002,
}

export interface IQuoteBarWithDateTime extends IQuoteBar {
  datetime: number // 1624507200000
}

export type FmpIndicatorQueryParams<TFromTo = number> = ISymbol &
  FromTo<TFromTo> & {
    periodLength: number
    timeframe: string
  }

export function FmpIndicatorParamsSetDateBoundary(
  fmp: FmpIndicatorQueryParams<number>
) {
  const { from, timeframe } = fmp
  const fmpNew = { ...fmp }

  const regex = /(\d+)|([A-za-z]+)/g
  const matches = safestr(timeframe).match(regex)
  if (isArray(matches, 2) && matches[0] !== timeframe) {
    const [units, unit] = matches
    if (from) {
      fmpNew.from = +DateHelper.NextBoundaryUp(from, unit, +units)
    }

    fmpNew.to = +DateHelper.NextBoundaryUp(
      fmpNew.to ? fmpNew.to : Date.now(),
      unit,
      +units
    )
  }

  return fmpNew
}

export function FmpIndicatorParamsToPath(
  params: FmpIndicatorQueryParams<number>,
  existingQueryParams = ''
) {
  let qp = `${existingQueryParams}&symbol=${params.symbol}&periodLength=${params.periodLength}&timeframe=${params.timeframe}`
  if (params.from) {
    qp += `&from=${params.from}`
  }
  if (params.to) {
    qp += `&to=${params.to}`
  }

  return qp
}

export function FmpIndicatorParamsFromObject(body: AnyRecord) {
  const from = getAsNumberOrUndefined(body.from)
  const to = getAsNumberOrUndefined(body.to)

  const fmp: FmpIndicatorQueryParams<number> = {
    symbol: safestr(body.symbol, body.ticker),
    periodLength: getAsNumber(body.periodLength),
    timeframe: safestr(body.timeframe),
    from,
    to,
  }

  if (!fmp.symbol) {
    throw new AppException('No ticker.', 'asset.js FinancialRatios:', fmp)
  }

  return fmp
}

export interface ISpac extends ISymbolName {
  ipoDate: string
  marketCap: string
  mergerPending: string
  leverageFactor: number
  momentumFactor10: number
  momentumFactor200: number
  lastClosePrice: number
  sharesOutstanding: string
  averageTradingVolume: string
  percentTraded: string
  action: string
}

export interface ISymbolDetail extends ICompanyInfo, ITicker, IName {
  profile: CompanyProfile
}

export function CreateISymbolDetail(overrides?: Partial<ISymbolDetail>) {
  const isd: ISymbolDetail = {
    name: '',
    profile: new CompanyProfile(),
    ticker: '',
    scales: [],
    type: '',
    sector: '',
    industry: '',
    exchange: '',
    id: '',
    minmov: 0,
    minmov2: 0,
    pricescale: 0,
    createdby: '',
    updatedby: '',
    val: new ExchangeInfo(),
    ...overrides,
  }

  return isd
}

export interface ISymbolPrices extends ISymbol {
  candles: IQuoteBarWithDateTime[]
  midprice: number
  requestDate: number
}

export class AssetQuoteShort implements ISymbolPriceVolume {
  symbol = ''
  price = 0
  volume = 0

  constructor(obj?: AssetQuoteShort) {
    if (isObject(obj)) {
      Object.assign(this, obj)
    }
  }
}

export class CompanyProfile implements ICompanyProfile {
  symbol = ''
  price = 0
  beta = 0
  volAvg = 0
  mktCap = 0
  lastDiv = ''
  range = ''
  changes = 0
  companyName = ''
  currency = ''
  isin = ''
  isEtf = false
  cusip = ''
  exchange = ''
  exchangeShortName = ''
  industry = ''
  website = ''
  description = ''
  ceo = ''
  sector = ''
  country = ''
  fullTimeEmployees = 0
  phone = ''
  address = ''
  city = ''
  state = ''
  zip = ''
  dcfDiff = ''
  dcf = ''
  image = ''
  ipoDate = ''
}

export class ExchangeInfo implements IExchangeInfo {
  symbol = ''
  name = ''
  price = 0
  volume = 0 // Not sure about this one
  exchange = ''
  exchangeShortName = ''
}

export interface IMarketHolidays {
  'year': number
  'New Years Day': string
  'Martin Luther King, Jr. Day': string
  // eslint-disable-next-line quotes
  "Washington's Birthday": string
  'Good Friday': string
  'Memorial Day': string
  'Juneteenth National Independence Day': string
  'Independence Day': string
  'Labor Day': string
  'Thanksgiving Day': string
  'Christmas': string
}
export interface IMarketOpenCloseHours {
  openingHour: string
  closingHour: string
}
export interface IMarketHours {
  stockExchangeName: string
  stockMarketHours: IMarketOpenCloseHours
  stockMarketHolidays: IMarketHolidays[]
  isTheStockMarketOpen: boolean
  isTheEuronextMarketOpen: boolean
  isTheForexMarketOpen: boolean
  isTheCryptoMarketOpen: boolean
}

export class PriceHistoricalResponse implements IPriceHistoricalFull {
  date = '' // 2021-06-24,
  open = 0 // 221.16,
  high = 0 // 227.45,
  low = 0 // 211.6,
  close = 0 // 212.31,
  adjClose = 0 // 212.31,
  volume = 0 // 3866565,
  unadjustedVolume = 0 // 3866565,
  change = 0 // -8.85,
  changePercent = 0 // -4.002,
  vwap = 0 // 217.12,
  label = '' // June 24, 21,
  changeOverTime = 0 // -0.04002,
  datetime = 0 // 1624507200000

  constructor(obj?: IPriceHistoricalFull) {
    if (isObject(obj)) {
      Object.assign(this, obj)
    }
  }
}

export interface IRatioCashFlow {
  capitalExpenditureCoverageRatios: string
  cashFlowCoverageRatios: string
  cashPerShare: string
  dividendPayoutRatio: string
  dividendpaidAndCapexCoverageRatios: string
  freeCashFlowOperatingCashFlowRatio: string
  freeCashFlowPerShare: string
  operatingCashFlowPerShare: string
  operatingCashFlowSalesRatio: string
  payoutRatio: string
  receivablesTurnover: string
  shortTermCoverageRatios: string
}

export interface IRatioDebt {
  cashFlowToDebtRatio: string
  companyEquityMultiplier: string
  debtEquityRatio: string
  debtRatio: string
  interestCoverage: string
  longtermDebtToCapitalization: string
  totalDebtToCapitalization: string
}

export interface IRatioInvestmentValuation {
  dividendYield: string
  enterpriseValueMultiple: string
  priceBookValueRatio: string
  priceCashFlowRatio: string
  priceEarningsRatio: string
  priceEarningsToGrowthRatio: string
  priceFairValue: string
  priceSalesRatio: string
  priceToBookRatio: string
  priceToFreeCashFlowsRatio: string
  priceToOperatingCashFlowsRatio: string
  priceToSalesRatio: string
  receivablesTurnover: string
}

export interface IRatioLiquidity {
  cashConversionCycle: string
  cashRatio: string
  currentRatio: string
  daysOfInventoryOutstanding: string
  daysOfPayablesOutstanding: string
  daysOfSalesOutstanding: string
  operatingCycle: string
  quickRatio: string
}

export interface IRatioOperatingPerformance {
  assetTurnover: string
  fixedAssetTurnover: string
  inventoryTurnover: string
  payablesTurnover: string
  receivablesTurnover: string
}

export interface IRatioProfitability {
  eBITperRevenue: string
  eBTperEBIT: string
  effectiveTaxRate: string
  grossProfitMargin: string
  nIperEBT: string
  netProfitMargin: string
  operatingProfitMargin: string
  pretaxProfitMargin: string
  returnOnAssets: string
  returnOnCapitalEmployed: string
  returnOnEquity: string
}

export interface IRatio extends ISymbol, IDate {
  period: string
  currentRatio: number
  quickRatio: number
  cashRatio: number
  daysOfSalesOutstanding: number
  daysOfInventoryOutstanding: number
  operatingCycle: number
  daysOfPayablesOutstanding: number
  cashConversionCycle: number
  grossProfitMargin: number
  operatingProfitMargin: number
  pretaxProfitMargin: number
  netProfitMargin: number
  effectiveTaxRate: number
  returnOnAssets: number
  returnOnEquity: number
  returnOnCapitalEmployed: number
  netIncomePerEBT: number
  ebtPerEbit: number
  ebitPerRevenue: number
  debtRatio: number
  debtEquityRatio: number
  longTermDebtToCapitalization: number
  totalDebtToCapitalization: number
  interestCoverage: number
  cashFlowToDebtRatio: number
  companyEquityMultiplier: number
  receivablesTurnover: number
  payablesTurnover: number
  inventoryTurnover: number
  fixedAssetTurnover: number
  assetTurnover: number
  operatingCashFlowPerShare: number
  freeCashFlowPerShare: number
  cashPerShare: number
  payoutRatio: number
  operatingCashFlowSalesRatio: number
  freeCashFlowOperatingCashFlowRatio: number
  cashFlowCoverageRatios: number
  shortTermCoverageRatios: number
  capitalExpenditureCoverageRatio: number
  dividendPaidAndCapexCoverageRatio: number
  dividendPayoutRatio: number
  priceBookValueRatio: number
  priceToBookRatio: number
  priceToSalesRatio: number
  priceEarningsRatio: number
  priceToFreeCashFlowsRatio: number
  priceToOperatingCashFlowsRatio: number
  priceCashFlowRatio: number
  priceEarningsToGrowthRatio: number
  priceSalesRatio: number
  dividendYield: number
  enterpriseValueMultiple: number
  priceFairValue: number
}

export interface IRatioNew extends ISymbol, IDate {
  fiscalYear: string
  period: string
  reportedCurrency: string
  grossProfitMargin: number
  ebitMargin: number
  ebitdaMargin: number
  operatingProfitMargin: number
  pretaxProfitMargin: number
  continuousOperationsProfitMargin: number
  netProfitMargin: number
  bottomLineProfitMargin: number
  receivablesTurnover: number
  payablesTurnover: number
  inventoryTurnover: number
  fixedAssetTurnover: number
  assetTurnover: number
  currentRatio: number
  quickRatio: number
  solvencyRatio: number
  cashRatio: number
  priceToEarningsRatio: number
  priceToEarningsGrowthRatio: number
  forwardPriceToEarningsGrowthRatio: number
  priceToBookRatio: number
  priceToSalesRatio: number
  priceToFreeCashFlowRatio: number
  priceToOperatingCashFlowRatio: number
  debtToAssetsRatio: number
  debtToEquityRatio: number
  debtToCapitalRatio: number
  longTermDebtToCapitalRatio: number
  financialLeverageRatio: number
  workingCapitalTurnoverRatio: number
  operatingCashFlowRatio: number
  operatingCashFlowSalesRatio: number
  freeCashFlowOperatingCashFlowRatio: number
  debtServiceCoverageRatio: number
  interestCoverageRatio: number
  shortTermOperatingCashFlowCoverageRatio: number
  operatingCashFlowCoverageRatio: number
  capitalExpenditureCoverageRatio: number
  dividendPaidAndCapexCoverageRatio: number
  dividendPayoutRatio: number
  dividendYield: number
  dividendYieldPercentage: number
  revenuePerShare: number
  netIncomePerShare: number
  interestDebtPerShare: number
  cashPerShare: number
  bookValuePerShare: number
  tangibleBookValuePerShare: number
  shareholdersEquityPerShare: number
  operatingCashFlowPerShare: number
  capexPerShare: number
  freeCashFlowPerShare: number
  netIncomePerEBT: number
  ebtPerEbit: number
  priceToFairValue: number
  debtToMarketCap: number
  effectiveTaxRate: number
  enterpriseValueMultiple: number
}

export interface IFinancialRatios extends IDate {
  cashFlowIndicatorRatios: IRatioCashFlow
  debtRatios: IRatioDebt
  investmentValuationRatios: IRatioInvestmentValuation
  liquidityMeasurementRatios: IRatioLiquidity
  operatingPerformanceRatios: IRatioOperatingPerformance
  profitabilityIndicatorRatios: IRatioProfitability
}

export interface IFinancialRatiosResponse extends ISymbol {
  ratios: IFinancialRatios[]
}

export interface ISectorChangePercentage {
  sector: string
  changesPercentage: string
}

export interface ISectorsHistorical extends IDate {
  utilitiesChangesPercentage: number
  basicMaterialsChangesPercentage: number
  communicationServicesChangesPercentage: number
  conglomeratesChangesPercentage: number
  consumerCyclicalChangesPercentage: number
  consumerDefensiveChangesPercentage: number
  energyChangesPercentage: number
  financialChangesPercentage: number
  financialServicesChangesPercentage: number
  healthcareChangesPercentage: number
  industrialsChangesPercentage: number
  realEstateChangesPercentage: number
  servicesChangesPercentage: number
  technologyChangesPercentage: number
}

export interface ITickerSearch
  extends IId,
    ISymbolName,
    ITicker,
    IType,
    IHasPolitiscales {
  description: string
  exchange: string
  imageUrl?: string
  full_name: string
}

export interface ITickerType extends IdName, ITicker, IType {}
export type AssetQuoteWithChanges = IAssetQuoteResponse &
  ITicker & { changes: number; companyName: string }
export type AssetQuoteWithIpoDate = AssetQuoteWithChanges & {
  ipoDate?: number
}
export type AssetQuoteWithScore = AssetQuoteWithChanges & {
  matches: number
  scorePercentage?: number
}

export type CompanyAssetInfo = {
  execs: ICompanyExecutive[]
  info: ISymbolDetail
  quote?: IAssetQuoteResponse
  ratios?: IRatio
}

export function IAssetQuoteResponseToAssetQuote(obj: IAssetQuoteResponse) {
  return new AssetQuoteShort({
    symbol: obj.symbol,
    price: obj.price,
    volume: obj.volume,
  })
}

export function IAssetQuoteResponseToAssetQuoteWithChanges(
  x: IAssetQuoteResponse
) {
  const aqr: AssetQuoteWithChanges = {
    ...x,
    changes: x.change,
    companyName: x.name,
    ticker: x.symbol,
  }

  return aqr
}

export function IAssetQuotesWithChanges(assetQuotes: IAssetQuoteResponse[]) {
  return safeArray(assetQuotes).map(IAssetQuoteResponseToAssetQuoteWithChanges)
}

export function IAssetQuoteResponseToAssetQuoteWithIpoDate(
  x: IAssetQuoteResponse
) {
  const aqr: AssetQuoteWithIpoDate = {
    ...x,
    changes: x.change,
    companyName: x.name,
    ticker: x.symbol,
  }

  return aqr
}

export function IAssetQuotesWithIpoDate(
  fname: string,
  assetQuotes: IAssetQuoteResponse[],
  retobj: { ipoDate: string; symbol: string }[]
) {
  return safeArray(assetQuotes).map((aqr) => {
    const aqripo = IAssetQuoteResponseToAssetQuoteWithIpoDate(aqr)

    try {
      const found = retobj.find((spac) => aqr.symbol === spac.symbol)
      if (found && isString(found?.ipoDate, 1)) {
        const t = moment(found.ipoDate, 'M-D-YYYY')
        const val = t.valueOf()
        if (isNaN(val)) {
          throw new AppException(
            `IAssetQuotesWithIpoDate: ${fname} - Invalid IPO date for symbol ${aqr.symbol}`
          )
        }

        aqripo.ipoDate = val
      }
    } catch (ex) {
      console.error(fname, ex)
    }

    return aqripo
  })
}

export function IAssetQuoteResponseToAssetQuoteWithScore(
  x: IAssetQuoteResponse,
  matches: number,
  scorePercentage?: number
) {
  const aqr: AssetQuoteWithScore = {
    ...x,
    changes: x.change,
    companyName: x.name,
    matches,
    ticker: x.symbol,
    scorePercentage,
  }

  return aqr
}

export function IAssetQuotesWithScore(
  iaqrs: IAssetQuoteResponse[],
  retobj: { [key: string]: { matches: number; score?: number } }
) {
  const totalScore = Object.values(retobj).reduce((acc, cur) => {
    acc += cur.score || 0

    return acc
  }, 0)

  return safeArray(iaqrs).map((iaqr) => {
    const symbol = safestrUppercase(iaqr.symbol)

    const dictsym = retobj[symbol]
    let scorePercentage = 0
    let matches = 0
    if (isObject(dictsym) && totalScore) {
      scorePercentage = dictsym.score ? dictsym.score / totalScore : 0
      matches = dictsym.matches
    }

    return IAssetQuoteResponseToAssetQuoteWithScore(
      iaqr,
      matches,
      scorePercentage
    )
  })
}
