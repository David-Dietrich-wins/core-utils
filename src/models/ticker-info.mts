import { IDate, IName, IPrice, IType, IVal } from '../models/interfaces.mjs'
import { isString, safestrUppercase } from '../services/string-helper.mjs'
import {
  zFromStringOrStringArray,
  zStringMinMax,
  zToStringArray,
} from '../services/zod-helper.mjs'
import { AppException } from './AppException.mjs'
import { IHasPolitiscales } from '../politagree/politiscale.mjs'
import { IId } from './IdManager.mjs'
import { IdName } from '../models/id-name.mjs'
import { isObject } from '../services/object-helper.mjs'
import moment from 'moment'
import { safeArray } from '../services/array-helper.mjs'
import { z } from 'zod/v4'

const CONST_TickerMaxLength = 20

export const zSymbol = z.object({
  symbol: zStringMinMax(1, CONST_TickerMaxLength, { uppercase: true }),
})
export type ISymbol = z.infer<typeof zSymbol>

export const zTicker = z.object({
  ticker: zStringMinMax(1, CONST_TickerMaxLength, { uppercase: true }),
})
export type ITicker = z.infer<typeof zTicker>

export const zTickerArray = z.object({
  ticker: zFromStringOrStringArray(1, CONST_TickerMaxLength, {
    arrayStringMax: 1000,
    uppercase: true,
  }),
})
export type ITickerArray = z.infer<typeof zTickerArray>

export const zTickerToArray = z.object({
  ticker: zToStringArray(1, 10, { arrayStringMax: 1000, uppercase: true }),
})
export type ITickerToArray = z.infer<typeof zTickerToArray>

export const zTickersArray = z.object({
  tickers: zFromStringOrStringArray(1, 10, { uppercase: true }),
})
export type ITickersArray = z.infer<typeof zTickersArray>

export const zVolume = z.object({
  //Z.preprocess(Number, z.number()),
  volume: z.coerce.number().min(1).max(1000000000000),
})

export type IVolume = z.infer<typeof zVolume>

export interface ISymbolName extends ISymbol, IName {}

export interface ISymbolPrice extends ISymbol, IPrice {}
export interface ISymbolPriceName extends ISymbolPrice, ISymbolName {}

export interface ISymbolPriceVolume extends ISymbolPrice, IVolume {}

export interface ISymbolSearch extends ISymbolName {
  currency: string
  stockExchange: string
  exchangeShortName: string
}

export function ISymbolSearch2ITickerSearch(iss: ISymbolSearch) {
  const its: ITickerSearch = {
    description: iss.stockExchange,
    exchange: iss.stockExchange,
    full_name: iss.name,
    name: iss.name,
    symbol: iss.symbol,
    ticker: iss.symbol,
    type: iss.exchangeShortName,
  }

  return its
}

export function ISymbolSearch2ITickerSearchArray(
  iss: ISymbolSearch[]
): ITickerSearch[] {
  return safeArray(iss).map(ISymbolSearch2ITickerSearch)
}

export interface ISymbolPriceChanges extends ISymbolPrice, ISymbolName {
  change?: number | null
  changesPercentage?: number | null
}

export interface ISymbolPriceVolumeChanges
  extends ISymbolPriceChanges,
    IVolume {}

export interface IAssetQuoteResponse extends ISymbolPriceVolumeChanges {
  // Symbol: string    // GME,
  // Name: string      // GameStop Corp.,
  // Price: number     // 203.0601,
  dayLow: number
  dayHigh: number
  yearHigh: number
  yearLow: number
  marketCap: number
  priceAvg50: number
  priceAvg200: number
  avgVolume?: number | null
  exchange: string
  open?: number | null
  previousClose?: number | null
  eps?: number | null
  pe?: number | null
  earningsAnnouncement?: string | null
  sharesOutstanding?: number | null
  timestamp: number
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

export interface IExchangeInfo
  extends ISymbolPriceName,
    Partial<IType<string>> {
  exchange: string
  exchangeShortName: string
}

export interface ICompanyExecutive extends Partial<ISymbol>, IName {
  yearBorn?: number | null
  pay?: number | null
  currencyPay: string
  title: string
  gender: string
  titleSince?: string | null
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
  ceo?: string | null
  date?: number | null
  description?: string | null
  exchange: string
  exchangeShortName?: string | null
  fullTimeEmployees?: number | null
  imageUrl?: string | null
  industry: string
  ipoDate?: string | null
  minmov: number
  minmov2: number
  pricescale: number
  profile: ICompanyProfile
  sector: string
  createdby: string
  updatedby: string
  website?: string | null
  slug?: string | null
  tags?: string[] | null
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
  // Symbol: string
  // Price: number
  beta: number
  volAvg: number
  mktCap: number
  lastDiv: number
  range: string
  changes: number
  companyName: string
  currency: string
  cik?: string | null
  isin: string
  isEtf: boolean
  isActivelyTrading?: boolean | null
  isAdr?: boolean | null
  isFund?: boolean | null
  cusip: string
  exchange: string
  exchangeShortName: string
  industry: string
  website: string
  description: string
  ceo: string
  sector: string
  country: string
  fullTimeEmployees: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  dcfDiff: number
  dcf: number
  image: string
  ipoDate: string
  defaultImage?: boolean | null
}

export interface IIpoCalendar extends ISymbol, IDate {
  company: string
  exchange: string
  actions: string
  shares?: number | null
  priceRange?: string | null
  marketCap?: number | null
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
  // Date: string      // 2021-06-24,
  open: number
  high: number
  low: number
  close: number
  // Volume: number    // 3866565,
}

export interface IQuoteBarEma extends IQuoteBar, IExtendedMovingAverage {}
export interface IQuoteBarSma extends IQuoteBar, ISimpleMovingAverage {}
export interface IQuoteBarWma extends IQuoteBar, IWeightedMovingAverage {}
export interface IQuoteBarRsi extends IQuoteBar, IRelativeStrengthIndicator {}

export interface IPriceHistoricalFull extends IQuoteBar {
  adjClose: number
  unadjustedVolume: number
  change: number
  changePercent: number
  vwap: number
  label: string
  changeOverTime: number
}

export interface IQuoteBarWithDateTime extends IQuoteBar {
  datetime: number
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
  profile: ICompanyProfile
}

export class CompanyProfile implements ICompanyProfile {
  symbol = ''
  price = 0
  beta = 0
  volAvg = 0
  mktCap = 0
  lastDiv = 0
  range = ''
  changes = 0
  companyName = ''
  currency = ''
  cik = ''
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
  fullTimeEmployees = ''
  phone = ''
  address = ''
  city = ''
  state = ''
  zip = ''
  dcfDiff = 0
  dcf = 0
  image = ''
  ipoDate = ''
  defaultImage = false
}

export class ExchangeInfo implements IExchangeInfo {
  symbol = ''
  name = ''
  price = 0
  volume = 0
  exchange = ''
  exchangeShortName = ''
}

export function CreateISymbolDetail(overrides?: Partial<ISymbolDetail>) {
  const isd: ISymbolDetail = {
    createdby: '',
    exchange: '',
    id: '',
    industry: '',
    minmov: 0,
    minmov2: 0,
    name: '',
    pricescale: 0,
    profile: new CompanyProfile(),
    scales: [],
    sector: '',
    ticker: '',
    type: '',
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

export interface IMarketHolidays {
  'year': number
  'New Years Day': string
  'Martin Luther King, Jr. Day': string

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
  date = ''
  open = 0
  high = 0
  low = 0
  close = 0
  adjClose = 0
  volume = 0
  unadjustedVolume = 0
  change = 0
  changePercent = 0
  vwap = 0
  label = ''
  changeOverTime = 0
  datetime = 0

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
  calendarYear?: string | null
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
  ITicker & { changes?: number | null; companyName: string }
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
    price: obj.price,
    symbol: obj.symbol,
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
        const t = moment(found.ipoDate, 'M-D-YYYY'),
          val = t.valueOf()
        if (isNaN(val)) {
          throw new AppException(
            `IAssetQuotesWithIpoDate: ${fname} - Invalid IPO date for symbol ${aqr.symbol}`
          )
        }

        aqripo.ipoDate = val
      }
    } catch (ex) {
      // eslint-disable-next-line no-console
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
    scorePercentage,
    ticker: x.symbol,
  }

  return aqr
}

export function IAssetQuotesWithScore(
  iaqrs: IAssetQuoteResponse[],
  retobj: { [key: string]: { matches: number; score?: number } }
) {
  const totalScore = Object.values(retobj).reduce((acc, cur) => {
    // eslint-disable-next-line no-param-reassign
    acc += cur.score || 0

    return acc
  }, 0)

  return safeArray(iaqrs).map((iaqr) => {
    const asymbol = safestrUppercase(iaqr.symbol),
      dictsym = retobj[asymbol]
    let matches = 0,
      scorePercentage = 0
    if (isObject(dictsym) && totalScore) {
      scorePercentage = dictsym.score ? dictsym.score / totalScore : 0
      // eslint-disable-next-line prefer-destructuring
      matches = dictsym.matches
    }

    return IAssetQuoteResponseToAssetQuoteWithScore(
      iaqr,
      matches,
      scorePercentage
    )
  })
}
