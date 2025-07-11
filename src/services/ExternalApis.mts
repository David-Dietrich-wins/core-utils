import { AppException } from '../models/AppException.mjs'
import { IIdName } from '../models/id-name.mjs'
import { ApiResponse } from '../models/ApiResponse.mjs'
import {
  IChartRunLogApiReturn,
  IEventLogin,
  ISlug,
} from '../models/interfaces.mjs'
import { INameVal, NameVal } from '../models/NameValManager.mjs'
import {
  UserInfoWithTokens,
  UserLoginRefreshTokenResponse,
} from '../models/types.mjs'
import { IUserInfo } from '../models/UserInfo.mjs'
import {
  IPagedResponse,
  IPagedResponseWithTotalValue,
} from '../models/PagedResponse.mjs'
import {
  AssetQuoteWithChanges,
  AssetQuoteWithIpoDate,
  AssetQuoteWithScore,
  CompanyAssetInfo,
  FmpIndicatorQueryParams,
  IAssetQuoteResponse,
  ICompanyProfile,
  ICompanyUsersWithCount,
  IIpoCalendar,
  IQuoteBar,
  IQuoteBarEma,
  IQuoteBarRsi,
  IQuoteBarSma,
  IQuoteBarWma,
  ISymbolDetail,
  ISymbolPrices,
  ISymbolPriceVolumeChanges,
  ISymbolSearch,
  ITicker,
  ITickerSearch,
  ITickerType,
  IUsersWithCount,
} from '../models/ticker-info.mjs'
import { ICity, IdNameSlugWithScales } from '../politagree/city.mjs'
import { ICompany } from '../politagree/company.mjs'
import { IPolitiscaleSearchParams } from '../politagree/politiscale.mjs'
import { ChartPlotReturn, IChartSettings } from '../tplot/ChartSettings.mjs'
import {
  ConfigTickerInfoTabSettings,
  CreateConfigTickerInfoTabSettings,
} from '../tplot/ConfigManager.mjs'
import { IDashboardScreenSetting } from '../tplot/DashboardScreenSetting.mjs'
import { IDashboardSetting } from '../tplot/DashboardSetting.mjs'
import { FacetSaveParameters } from '../tplot/Facet.mjs'
import { IPlotList } from '../tplot/PlotList.mjs'
import { ScreenData } from '../tplot/ScreenData.mjs'
import {
  ITradePlot,
  ITradePlotProfitizerWithContext,
  TradePlot,
} from '../tplot/TradePlot.mjs'
import { ITradePlotProfitizer } from '../tplot/TradePlotProfitizer.mjs'
import { ITvChartLayout } from '../tplot/TvChartLayout.mjs'
import { isArray, safeArray } from './array-helper.mjs'
import { ChartData, SearchSymbolResultItem } from './charting_library.mjs'
import {
  fetchPost,
  fetchGet,
  fetchPatch,
  fetchPut,
  fetchDelete,
  GetHttpHeaderApplicationName,
  fetchDeleteJson,
} from './fetch-http.mjs'
import { hasData, urlJoin } from './general.mjs'
import { ISearchRequestView, SearchRequestView } from './SearchRequestView.mjs'
import { safestr } from './string-helper.mjs'
import { IUserLoginRequest } from './user-helper.mjs'
import { IIdVal } from '../models/id-val.mjs'

/**
 * Interface for the result of a symbol search.
 * This is a TradingView API response that contains information about a symbol.
 * @see https://www.tradingview.com/widget/advanced-chart/
 * @see https://www.tradingview.com/widget/advanced-chart/#symbol-search
 * @see https://www.tradingview.com/widget/advanced-chart/#symbol-search-result
 * @see https://www.tradingview.com/widget/advanced-chart/#symbol-search-result-item
 * @see https://www.tradingview.com/widget/advanced-chart/#symbol-search-result-item-symbol
 */

/**
 * ExternalApis is a collection of functions that interact with various external APIs.
 * These functions handle fetching data from the APIs, processing the responses,
 * and returning the relevant data or throwing exceptions in case of errors.
 */
export class ExternalApis {
  readonly CONST_EndpointAdmin: string
  readonly CONST_EndpointAsset: string
  readonly CONST_EndpointConfig: string
  readonly CONST_EndpointPolitagree: string
  readonly CONST_EndpointPolitagreeAdmin: string
  readonly CONST_EndpointTrade: string
  readonly CONST_EndpointTv: string
  readonly CONST_EndpointUser: string

  constructor(public baseUrl: string, public appName: string) {
    this.CONST_EndpointAdmin = urlJoin(baseUrl, 'admin', false)
    this.CONST_EndpointAsset = urlJoin(baseUrl, 'asset', false)
    this.CONST_EndpointConfig = urlJoin(baseUrl, 'config', false)
    this.CONST_EndpointPolitagree = urlJoin(baseUrl, 'politagree', false)
    this.CONST_EndpointPolitagreeAdmin = urlJoin(
      baseUrl,
      'politagree-admin',
      false
    )
    this.CONST_EndpointTrade = urlJoin(baseUrl, 'trade', false)
    this.CONST_EndpointTv = urlJoin(baseUrl, 'tv', false)
    this.CONST_EndpointUser = urlJoin(baseUrl, 'user', false)
  }

  /**
   * Checks if an error is a 403 Forbidden error and redirects to the sign-in page if so.
   * This function is intended to be used as a global error handler for API calls.
   * @param fname - The name of the function that is calling this error handler.
   * This is used for logging purposes to identify where the error occurred.
   * @param err The error object that was thrown. This can be any type of error, including
   * custom errors like AppException or AppExceptionHttp.
   * @param location The window.location object, which contains information about the current URL.
   * @returns true if the error was handled (e.g., a 403 error that redirects to a sign-in page),
   * false otherwise.
   */
  static errorHandler(
    fname: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    location?: any /* should be an HTML window.location object. */
  ) {
    return ApiResponse.ErrorHandler(fname, err, location)
  }
  static verifySuccess<T = unknown>(
    fname: string,
    ret: ApiResponse<T>,
    allowNoDataReturned = false
  ) {
    return ApiResponse.VerifySuccess(fname, ret, allowNoDataReturned)
  }

  static verifySuccessPagedResponse<T = unknown>(
    fname: string,
    ret: ApiResponse<IPagedResponse<T>>,
    allowNoDataReturned = false
  ) {
    return ApiResponse.VerifySuccess(fname, ret, allowNoDataReturned)
  }

  admin = {
    allUsers: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) => {
      const fname = this.admin.allUsers.name

      return fetchPost<IPagedResponse<IUsersWithCount>, ISearchRequestView>({
        url: urlJoin(this.CONST_EndpointAdmin, 'all-users'),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    CompaniesWithUserCount: async (bearerToken: string) => {
      const fname = this.admin.CompaniesWithUserCount.name

      return fetchGet<IPagedResponse<ICompanyUsersWithCount>>({
        url: urlJoin(this.CONST_EndpointAdmin, 'companies-with-count'),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    CompanyCreate: async (bearerToken: string, company: ICompany) => {
      const fname = this.admin.CompanyCreate.name

      return fetchPost<ICompany, ICompany>({
        url: urlJoin(this.CONST_EndpointAdmin, 'company'),
        fname,
        bearerToken,
        data: company,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    CompanyDelete: async (bearerToken: string, id: ICompany['id']) => {
      const fname = this.admin.CompanyDelete.name

      return fetchDeleteJson<ICompany>({
        url: urlJoin(this.CONST_EndpointAdmin, ['company', id]),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    CompanyUpdate: async (
      bearerToken: string,
      companyId: ICompany['id'],
      company: Partial<ICompany>
    ) => {
      const fname = this.admin.CompanyUpdate.name

      return fetchPatch<Partial<ICompany>, ICompany>({
        url: urlJoin(this.CONST_EndpointAdmin, ['company', companyId]),
        fname,
        bearerToken,
        data: company,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    FacetSave: async (bearerToken: string, data: FacetSaveParameters) => {
      const fname = this.admin.FacetSave.name

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return fetchPost<any, FacetSaveParameters>({
        url: urlJoin(this.CONST_EndpointAdmin, 'facet'),
        fname,
        bearerToken,
        data,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  }

  asset = {
    ChartPlots: async (bearerToken: string, settings: IChartSettings) => {
      const fname = this.asset.ChartPlots.name

      return fetchPost<ChartPlotReturn, IChartSettings>({
        url: urlJoin(this.CONST_EndpointAsset, [
          'chart-plots',
          settings.ticker,
        ]),
        fname,
        bearerToken,
        data: settings,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    CompanyInfo: async (bearerToken: string, ticker: string) => {
      const fname = this.asset.CompanyInfo.name

      return fetchGet<CompanyAssetInfo>({
        url: urlJoin(this.CONST_EndpointAsset, ['company-info', ticker]),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    CompanyProfile: async (bearerToken: string, ticker: string) => {
      const fname = this.asset.CompanyProfile.name

      return fetchGet<ICompanyProfile>({
        url: urlJoin(this.CONST_EndpointAsset, ['companyprofile', ticker]),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    CryptoQuotes: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) => {
      const fname = this.asset.CryptoQuotes.name

      return fetchPost<IPagedResponse<IAssetQuoteResponse>, ISearchRequestView>(
        {
          url: urlJoin(this.CONST_EndpointAsset, 'crypto-quotes'),
          fname,
          bearerToken,
          data: SearchRequestView.Create(searchRequest),
          headers: GetHttpHeaderApplicationName(this.appName),
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    CryptoSearch: async (
      bearerToken: string,
      searchRequest: ISearchRequestView
    ) => {
      const fname = this.asset.CryptoQuotes.name

      return fetchPost<IPagedResponse<ISymbolSearch>, ISearchRequestView>({
        url: urlJoin(this.CONST_EndpointAsset, 'crypto-search'),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    EtfQuotes: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) => {
      const fname = this.asset.EtfQuotes.name

      return fetchPost<IPagedResponse<IAssetQuoteResponse>, ISearchRequestView>(
        {
          url: urlJoin(this.CONST_EndpointAsset, 'etf-quotes'),
          fname,
          bearerToken,
          data: SearchRequestView.Create(searchRequest),
          headers: GetHttpHeaderApplicationName(this.appName),
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    Ema: async (bearerToken: string, fmp: FmpIndicatorQueryParams) => {
      return this.asset.TechnicalIndicator<IQuoteBarEma>(
        bearerToken,
        fmp,
        'ema'
      )
    },

    IpoCalendar: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>,
      fromDate: Date,
      toDate: Date
    ) => {
      const fname = this.asset.IpoCalendar.name

      return fetchPost<IPagedResponse<IIpoCalendar>, ISearchRequestView>({
        url: urlJoin(
          this.CONST_EndpointAsset,
          `ipo-calendar/?from=${+fromDate}&to=${+toDate}`
        ),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    MostActive: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) => {
      const fname = this.asset.MostActive.name

      return fetchPost<
        IPagedResponse<ISymbolPriceVolumeChanges>,
        ISearchRequestView
      >({
        url: urlJoin(this.CONST_EndpointAsset, 'most-active'),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    NftQuotes: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) => {
      const fname = this.asset.NftQuotes.name

      return fetchPost<
        IPagedResponse<AssetQuoteWithChanges>,
        ISearchRequestView
      >({
        url: urlJoin(this.CONST_EndpointAsset, 'nft-ideas-quotes'),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    PriceHistory: async (
      bearerToken: string,
      chartSettings: IChartSettings
    ) => {
      const fname = this.asset.PriceHistory.name

      if (!hasData(chartSettings.ticker)) {
        throw new AppException('Missing symbol', fname)
      }

      return fetchPost<ISymbolPrices, IChartSettings>({
        url: urlJoin(this.CONST_EndpointAsset, [
          'pricehistory',
          chartSettings.ticker,
        ]),
        fname,
        bearerToken,
        data: chartSettings,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    Quote: async (bearerToken: string, ticker: string) => {
      const fname = this.asset.Quote.name

      return this.asset.Quotes(bearerToken, [ticker]).then((ret) => {
        if (!isArray(ret, 1)) {
          throw new AppException('No data returned', fname)
        }

        return ret[0]
      })
    },

    Quotes: async (bearerToken: string, tickers: string[]) => {
      const fname = this.asset.Quotes.name

      return fetchPost<IAssetQuoteResponse[], { tickers: string[] }>({
        url: urlJoin(this.CONST_EndpointAsset, 'quotes'),
        fname,
        bearerToken,
        data: { tickers },
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    Rsi: async (bearerToken: string, fmp: FmpIndicatorQueryParams) => {
      return this.asset.TechnicalIndicator<IQuoteBarRsi>(
        bearerToken,
        fmp,
        'rsi'
      )
    },

    Sma: async (bearerToken: string, fmp: FmpIndicatorQueryParams) => {
      return this.asset.TechnicalIndicator<IQuoteBarSma>(
        bearerToken,
        fmp,
        'sma'
      )
    },

    SpacQuotes: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) => {
      const fname = this.asset.SpacQuotes.name

      return fetchPost<
        IPagedResponse<AssetQuoteWithIpoDate>,
        ISearchRequestView
      >({
        url: urlJoin(this.CONST_EndpointAsset, 'spac-quotes'),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    TechnicalIndicator: async <TIndicator extends IQuoteBar>(
      bearerToken: string,
      fmp: FmpIndicatorQueryParams,
      endpoint: string
    ) => {
      const fname = endpoint

      return fetchPost<TIndicator[], FmpIndicatorQueryParams>({
        url: urlJoin(this.CONST_EndpointAsset, endpoint),
        fname,
        bearerToken,
        data: fmp,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    TickerSearch: async (
      bearerToken: string,
      srv: IPolitiscaleSearchParams,
      exchange: string
    ) => {
      const fname = this.asset.TickerSearch.name

      return fetchGet<
        IPagedResponse<ITickerSearch>,
        IPolitiscaleSearchParams & { exchange: string }
      >({
        url: urlJoin(this.CONST_EndpointAsset, 'ticker-search'),
        fname,
        bearerToken,
        data: { ...srv, exchange },
        headers: GetHttpHeaderApplicationName(this.appName),
      })
        .then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
        .then((ret) => {
          return ret.dataPage.map((item) => {
            const ssr: SearchSymbolResultItem = {
              description: item.description,
              exchange: safestr(item.exchange),
              full_name: item.full_name,
              symbol: item.symbol,
              ticker: item.ticker,
              type: item.type,
            }

            return ssr
          })
        })
    },

    TopGainers: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) => {
      const fname = this.asset.TopGainers.name

      return fetchPost<
        IPagedResponse<ISymbolPriceVolumeChanges>,
        ISearchRequestView
      >({
        url: urlJoin(this.CONST_EndpointAsset, 'gainers'),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    TopLosers: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) => {
      const fname = this.asset.TopLosers.name

      return fetchPost<
        IPagedResponse<ISymbolPriceVolumeChanges>,
        ISearchRequestView
      >({
        url: urlJoin(this.CONST_EndpointAsset, 'losers'),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    WallStreetBetsQuotes: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) => {
      const fname = this.asset.WallStreetBetsQuotes.name

      return fetchPost<IPagedResponse<AssetQuoteWithScore>, ISearchRequestView>(
        {
          url: urlJoin(this.CONST_EndpointAsset, 'wsb-quotes'),
          fname,
          bearerToken,
          data: SearchRequestView.Create(searchRequest),
          headers: GetHttpHeaderApplicationName(this.appName),
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    Wma: async (bearerToken: string, fmp: FmpIndicatorQueryParams) => {
      return this.asset.TechnicalIndicator<IQuoteBarWma>(
        bearerToken,
        fmp,
        'wma'
      )
    },
  }

  config = {
    DashboardPeopleTabSave: async (
      bearerToken: string,
      ticker: string,
      name: string | number
    ) => {
      const fname = this.config.DashboardPeopleTabSave.name

      return fetchPatch<
        { name: number | string },
        IIdVal<string, ConfigTickerInfoTabSettings>
      >({
        url: urlJoin(this.CONST_EndpointUser, `dashboard-people-tab/${ticker}`),
        fname,
        bearerToken,
        data: { name },
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    GetOrSetTabSettings: async (
      bearerToken: string,
      configKeyName: string,
      settings: IIdName<number>
    ) => {
      const fname = this.config.GetOrSetTickerInfoTabSettings.name

      const data = NameVal.CreateINameVal<IIdName<number>>(
        configKeyName,
        settings
      )

      return fetchPost<
        INameVal<IIdName<number>>,
        IIdVal<string, IIdName<number>>
      >({
        url: this.CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    UpsertTabSettings: async (
      bearerToken: string,
      configKeyName: string,
      settings: IIdName<number>
    ) => {
      const fname = this.config.UpsertTickerInfoTabSettings.name

      const data = NameVal.CreateINameVal<IIdName<number>>(
        configKeyName,
        settings
      )

      return fetchPut<
        INameVal<IIdName<number>>,
        IIdVal<string, IIdName<number>>
      >({
        url: this.CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    GetOrSetTickerInfoTabSettings: async (
      bearerToken: string,
      ticker: string,
      settings?: Partial<ConfigTickerInfoTabSettings>
    ) => {
      const fname = this.config.GetOrSetTickerInfoTabSettings.name

      const data = NameVal.CreateINameVal<ConfigTickerInfoTabSettings>(
        `tickerInfo-${ticker}`,
        CreateConfigTickerInfoTabSettings(settings)
      )

      return fetchPost<
        IIdVal<string, ConfigTickerInfoTabSettings>,
        INameVal<ConfigTickerInfoTabSettings>
      >({
        url: this.CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    UpsertTickerInfoTabSettings: async (
      bearerToken: string,
      ticker: string,
      settings: Partial<ConfigTickerInfoTabSettings>
    ) => {
      const fname = this.config.UpsertTickerInfoTabSettings.name

      const data = NameVal.CreateINameVal<ConfigTickerInfoTabSettings>(
        `tickerInfo-${ticker}`,
        CreateConfigTickerInfoTabSettings(settings)
      )

      return fetchPut<
        INameVal<ConfigTickerInfoTabSettings>,
        IIdVal<string, ConfigTickerInfoTabSettings>
      >({
        url: this.CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  }

  politagree = {
    CitiesAll: async () => {
      const fname = this.politagree.CitiesAll.name

      return fetchGet<IPagedResponse<ICity>>({
        url: urlJoin(this.CONST_EndpointPolitagree, 'city-all-slugs'),
        fname,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    CityById: async (id: string) => {
      const fname = this.politagree.CityById.name

      return fetchGet<ICity>({
        url: urlJoin(this.CONST_EndpointPolitagree, ['city', id]),
        fname,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret, true))
    },

    CityBySlug: async (slug: string) => {
      const fname = this.politagree.CityBySlug.name

      return fetchGet<ICity>({
        url: urlJoin(this.CONST_EndpointPolitagree, ['city', slug]),
        fname,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret, true))
    },

    CitySearch: async (srv: IPolitiscaleSearchParams) => {
      const fname = this.politagree.CitySearch.name

      return fetchPost<
        IPagedResponse<IdNameSlugWithScales>,
        IPolitiscaleSearchParams
      >({
        url: urlJoin(this.CONST_EndpointPolitagree, 'city-search'),
        fname,
        data: srv,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) =>
        ExternalApis.verifySuccessPagedResponse(fname, ret, true)
      )
    },

    CitySearchFullInfo: async (srv: IPolitiscaleSearchParams) => {
      const fname = this.politagree.CompaniesSearchFullInfo.name

      return fetchPost<IPagedResponse<ICity>, IPolitiscaleSearchParams>({
        url: urlJoin(this.CONST_EndpointPolitagree, 'city-search-full-info'),
        fname,
        data: srv,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) =>
        ExternalApis.verifySuccessPagedResponse(fname, ret, true)
      )
    },

    CompaniesAll: async () => {
      const fname = this.politagree.CompaniesAll.name

      return fetchGet<IPagedResponse<ITickerType>>({
        url: urlJoin(this.CONST_EndpointPolitagree, 'company-all-slugs'),
        fname,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    CompaniesSearchFullInfo: async (srv: IPolitiscaleSearchParams) => {
      const fname = this.politagree.CompaniesSearchFullInfo.name

      return fetchPost<IPagedResponse<ISymbolDetail>, IPolitiscaleSearchParams>(
        {
          url: urlJoin(
            this.CONST_EndpointPolitagree,
            'company-search-full-info'
          ),
          fname,
          data: srv,
          headers: GetHttpHeaderApplicationName(this.appName),
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret, true))
    },

    CompanySearch: async (srv: IPolitiscaleSearchParams) => {
      const fname = this.politagree.CompanySearch.name

      return fetchPost<IPagedResponse<ITickerSearch>, IPolitiscaleSearchParams>(
        {
          url: urlJoin(this.CONST_EndpointPolitagree, 'company-search'),
          fname,
          data: srv,
          headers: GetHttpHeaderApplicationName(this.appName),
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret, true))
    },

    TopSymbols: async (ticker: string) => {
      const fname = this.politagree.TopSymbols.name

      return fetchPost<IPagedResponse<ISymbolDetail>, { ticker: string }>({
        url: urlJoin(this.CONST_EndpointPolitagree, 'top-symbols'),
        fname,
        data: {
          ticker, //: 'aapl,fb,tsla,goog,nflx,mcd,wmt,dis,ko,amzn',
        },
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then(
        (ret) =>
          ExternalApis.verifySuccessPagedResponse(fname, ret, true).dataPage
      )
    },
  }

  politagreeAdmin = {
    CityUpdate: async (
      bearerToken: string,
      data: Partial<ICity> & Required<ISlug>
    ) => {
      const fname = this.politagreeAdmin.CityUpdate.name

      return fetchPut<Partial<ICity>, ICity>({
        url: urlJoin(this.CONST_EndpointPolitagreeAdmin, 'city'),
        fname,
        data,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    CompanyUpdate: async (
      bearerToken: string,
      data: Partial<ISymbolDetail> & Required<ITicker>
    ) => {
      const fname = this.politagreeAdmin.CompanyUpdate.name

      return fetchPut<Partial<ISymbolDetail>, ISymbolDetail>({
        url: urlJoin(this.CONST_EndpointPolitagreeAdmin, 'company'),
        fname,
        data,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  }

  trade = {
    ChartRunLogs: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) => {
      const fname = this.trade.ChartRunLogs.name

      return fetchPost<
        IPagedResponse<IChartRunLogApiReturn>,
        ISearchRequestView
      >({
        url: urlJoin(this.CONST_EndpointTrade, 'chartrunlogs'),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    TradePlotCreate: async (
      bearerToken: string,
      plotListName: string | undefined,
      ticker: string
    ) => {
      const fname = this.trade.TradePlotCreate.name

      return fetchPost<
        ITradePlotProfitizerWithContext,
        { plotListName?: string; ticker: string }
      >({
        url: urlJoin(this.CONST_EndpointTrade),
        fname,
        bearerToken,
        data: { plotListName, ticker },
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    TradePlotDelete: async (bearerToken: string, plotId: ITradePlot['id']) => {
      const fname = this.trade.TradePlotDelete.name

      return fetchDeleteJson<IPlotList>({
        url: urlJoin(this.CONST_EndpointTrade, plotId),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    TradePlotGet: async (bearerToken: string, plotId: ITradePlot['id']) => {
      const fname = this.trade.TradePlotGet.name

      return fetchGet<ITradePlotProfitizerWithContext>({
        url: urlJoin(this.CONST_EndpointTrade, plotId),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    TradePlotSave: async (bearerToken: string, plot: ITradePlot) => {
      const fname = this.trade.TradePlotSave.name

      return fetchPut<ITradePlot, ITradePlotProfitizerWithContext>({
        url: urlJoin(this.CONST_EndpointTrade, plot.id),
        fname,
        bearerToken,
        data: TradePlot.FixupForSave(plot),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  }

  tv = {
    TvChart: async (bearerToken: string, id: string | number) => {
      const fname = this.tv.TvChart.name

      return fetchGet<string>({
        url: urlJoin(this.CONST_EndpointTv, ['chart', id]),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    GetAllCharts: async (bearerToken: string) => {
      const fname = this.tv.GetAllCharts.name

      return fetchGet<IPagedResponse<ITvChartLayout>>({
        url: urlJoin(this.CONST_EndpointTv, 'charts'),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    PriceHistory: async (
      bearerToken: string,
      chartSettings: IChartSettings
    ) => {
      return this.asset.PriceHistory(bearerToken, chartSettings).then((ret) => {
        // console.log('getBars: data:', ret);
        return safeArray(ret?.candles).map((x) => {
          return {
            time: x.datetime,
            open: x.open,
            close: x.close,
            high: x.high,
            low: x.low,
            volume: x.volume,
          }
        })
      })
    },

    RemoveChart: async (bearerToken: string, id: number | string) => {
      const fname = this.tv.RemoveChart.name

      return fetchDelete({
        url: urlJoin(this.CONST_EndpointTv, ['chart', id]),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then(() => undefined)
    },

    SaveChart: async (bearerToken: string, data: ChartData) => {
      const fname = this.tv.SaveChart.name

      return fetchPost<string, ChartData>({
        url: urlJoin(this.CONST_EndpointTv, 'chart'),
        fname,
        bearerToken,
        data,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  }

  user = {
    ConfigSet: async <T extends object>(
      bearerToken: string,
      nameVal: INameVal<T>
    ) => {
      const fname = this.user.ConfigSet.name

      return fetchPut<INameVal<T>, INameVal<T>>({
        url: this.CONST_EndpointConfig,
        fname,
        bearerToken,
        data: nameVal,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    Login: async (iLogin: IUserLoginRequest) => {
      const fname = this.user.Login.name
      return fetchPost<UserInfoWithTokens, IUserLoginRequest>({
        url: urlJoin(this.baseUrl, 'login'),
        fname,
        data: iLogin,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    Logout: async (bearerToken: string, refreshToken: string) => {
      const fname = this.user.Logout.name

      return fetchPost<string, { refreshToken: string }>({
        url: urlJoin(this.baseUrl, 'logout'),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
        data: { refreshToken },
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    RefreshToken: async (refreshToken: string) => {
      const fname = this.user.RefreshToken.name
      return fetchGet<UserLoginRefreshTokenResponse>({
        url: urlJoin(this.baseUrl, ['refresh-token', refreshToken]),
        fname,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    RevokeToken: async (refreshToken: string) => {
      const fname = this.user.RevokeToken.name
      return fetchPost<{ message: string }, { revokeToken: string }>({
        url: urlJoin(this.baseUrl, 'revoke-token'),
        fname,
        headers: GetHttpHeaderApplicationName(this.appName),
        data: { revokeToken: refreshToken },
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    ScreenData: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>,
      name: string
    ) => {
      const fname = this.user.ScreenData.name

      return fetchPost<ScreenData, ISearchRequestView>({
        url: urlJoin(this.CONST_EndpointUser, ['screen-data', name]),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    ScreenDelete: async (
      bearerToken: string,
      screenId: IDashboardScreenSetting['id']
    ) => {
      const fname = this.user.ScreenDelete.name

      return fetchDeleteJson<undefined, IDashboardSetting>({
        url: urlJoin(this.CONST_EndpointUser, ['screen', screenId]),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    ScreenSave: async (
      bearerToken: string,
      screen: IDashboardScreenSetting
    ) => {
      const fname = this.user.ScreenSave.name

      return fetchPatch<IDashboardScreenSetting, IDashboardSetting>({
        url: urlJoin(this.CONST_EndpointUser, 'screen'),
        fname,
        bearerToken,
        data: screen,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    TradePlot: async (
      bearerToken: string,
      tradePlot: ITradePlot,
      name = 'main'
    ) => {
      const fname = this.user.TradePlot.name

      return fetchPost<ITradePlotProfitizer, ITradePlot>({
        url: urlJoin(this.CONST_EndpointUser, ['tradeplot', name]),
        fname,
        bearerToken,
        data: tradePlot,
      })
    },

    TradePlotList: async (
      bearerToken: string,
      searchRequest?: Partial<ISearchRequestView>,
      name = 'main'
    ) => {
      const fname = this.user.TradePlotList.name

      return this.user
        .TradePlotListRaw(bearerToken, searchRequest, name)
        .then((ret) => ExternalApis.verifySuccess(fname, ret, true))
    },

    TradePlotListRaw: async (
      bearerToken: string,
      searchRequest?: Partial<ISearchRequestView>,
      name = 'main'
    ) => {
      const fname = this.user.TradePlotListRaw.name

      return fetchPost<
        IPagedResponseWithTotalValue<ITradePlotProfitizer>,
        ISearchRequestView
      >({
        url: urlJoin(this.CONST_EndpointUser, ['tradeplot-list', name]),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      })
    },

    UserInfo: async (bearerToken: string) => {
      const fname = this.user.UserInfo.name

      return fetchGet<IUserInfo>({
        url: urlJoin(this.CONST_EndpointUser, 'info'),
        fname,
        bearerToken,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    UserLogDashboardAccess: async (
      bearerToken: string,
      data: IDashboardScreenSetting
    ) => {
      const fname = this.user.UserLogDashboardAccess.name

      return fetchPost<IDashboardScreenSetting, IDashboardScreenSetting>({
        url: urlJoin(this.CONST_EndpointUser, 'log-dashboard-access'),
        fname,
        bearerToken,
        data,
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    UserLogins: async (
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) => {
      const fname = this.user.UserLogins.name

      return fetchPost<IPagedResponse<IEventLogin>, ISearchRequestView>({
        url: urlJoin(this.CONST_EndpointUser, 'logins'),
        fname,
        bearerToken,
        data: SearchRequestView.Create(searchRequest),
        headers: GetHttpHeaderApplicationName(this.appName),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },
  }

  async ServerTime(bearerToken: string) {
    const fname = this.ServerTime.name

    return fetchGet<{ serverTime: number }>({
      url: urlJoin(this.baseUrl, 'server-time'),
      fname,
      bearerToken,
      headers: GetHttpHeaderApplicationName(this.appName),
    })
      .then((ret) => ExternalApis.verifySuccess(fname, ret))
      .then((ret) => ret.serverTime / 1000)
  }
}
