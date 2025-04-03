import { AppException, AppExceptionHttp } from '../models/AppException.mjs'
import { SearchRequestViewDefault } from '../models/defaults.mjs'
import { IIdName } from '../models/id-name.mjs'
import {
  IChartRunLogApiReturn,
  IEventLogin,
  ISearchRequestView,
  ISlug,
} from '../models/interfaces.mjs'
import { INameVal, NameVal } from '../models/name-val.mjs'
import {
  IPagedResponse,
  IPagedResponseWithTotalValue,
  PagedResponse,
} from '../models/PagedResponse.mjs'
import {
  AssetQuoteWithChanges,
  AssetQuoteWithIpoDate,
  AssetQuoteWithScore,
  CompanyAssetInfo,
  IAssetQuoteResponse,
  ICompanyProfile,
  ICompanyUsersWithCount,
  IIpoCalendar,
  ISymbolDetail,
  ISymbolPrices,
  ISymbolPriceVolumeChanges,
  ITicker,
  ITickerSearch,
  ITickerType,
  IUsersWithCount,
} from '../models/ticker-info.mjs'
import {
  ConfigTickerInfoTabSettings,
  CreateConfigTickerInfoTabSettings,
} from '../tplot/ConfigManager.mjs'
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
import { urlJoin, hasData } from './general.mjs'
import { IConfig } from '../models/config.mjs'
import { ITradePlotListRowItem } from '../tplot/trade-plotlist-row-item.mjs'
import { ChartPlotReturn, ChartSettings } from '../tplot/ChartSettings.mjs'
import { ScreenData } from '../tplot/ScreenData.mjs'
import { ITvChartLayout } from '../tplot/TvChartLayout.mjs'
import { ApiResponse } from '../models/ApiResponse.mjs'
import { FacetSaveParameters } from '../tplot/Facet.mjs'
import { IUserInfo } from '../tplot/UserInfo.mjs'
import { IDashboardScreenSetting } from '../tplot/DashboardScreenSetting.mjs'
import { ITradePlot, ITradePlotApi } from '../tplot/trade-plot.mjs'
import { ICity, IdNameSlugWithScales } from '../politagree/city.mjs'
import {
  CONST_AppNamePolitagree,
  // CONST_AppNameTradePlotter,
} from './HttpHeaderManager.mjs'
import { IPolitiscaleSearchParams } from '../politagree/politiscale.mjs'
import { IDashboardSetting } from '../tplot/DashboardSetting.mjs'

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

  constructor(public baseUrl: string) {
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
    console.error(fname, err)
    if (location && err instanceof AppExceptionHttp) {
      if (err.httpStatusCode === 403) {
        setTimeout(() => {
          location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(
            location.pathname + location.search
          )}`
        }, 100)

        // redirect(
        //   '/api/auth/signin?callbackUrl=' +
        //     encodeURIComponent(window.location.href)
        // )

        return true
      }
    }

    return false
  }
  static verifySuccess<T = unknown>(
    fname: string,
    ret: ApiResponse<T>,
    allowNoDataReturned = false
  ) {
    if (!ApiResponse.isSuccess(ret)) {
      throw new AppException(
        ret.message ? ret.message : `Bad result from API call: ${ret.result}.`,
        fname
      )
    }

    if (!allowNoDataReturned && !ret.data) {
      throw new AppException('No data returned', fname)
    }

    return ret.data
  }

  static verifySuccessPagedResponse<T = unknown>(
    fname: string,
    ret: ApiResponse<IPagedResponse<T>>,
    allowNoDataReturned = false
  ) {
    if (!ApiResponse.isSuccess(ret)) {
      throw new AppException(
        ret.message ? ret.message : `Bad result from API call: ${ret.result}.`,
        fname
      )
    }

    if (!allowNoDataReturned && !ret.data) {
      throw new AppException('No data returned', fname)
    }

    return PagedResponse.CreateFromApiResponse(ret)
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
        data: SearchRequestViewDefault(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    CompaniesWithUserCount: async (bearerToken: string) => {
      const fname = this.admin.CompaniesWithUserCount.name

      return fetchGet<IPagedResponse<ICompanyUsersWithCount>>({
        url: urlJoin(this.CONST_EndpointAdmin, 'companies-with-count'),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    FacetSave: async (bearerToken: string, data: FacetSaveParameters) => {
      const fname = this.admin.FacetSave.name

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return fetchPost<any, FacetSaveParameters>({
        url: urlJoin(this.CONST_EndpointAdmin, 'facet'),
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  }

  asset = {
    ChartPlots: async (
      bearerToken: string,
      chartId: string,
      settings?: ChartSettings
    ) => {
      const fname = this.asset.ChartPlots.name

      return fetchPost<ChartPlotReturn, ChartSettings>({
        url: urlJoin(this.CONST_EndpointAsset, ['chart-plots', chartId]),
        fname,
        bearerToken,
        data: settings,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    CompanyInfo: async (bearerToken: string, ticker: string) => {
      const fname = this.asset.CompanyInfo.name

      return fetchGet<CompanyAssetInfo>({
        url: urlJoin(this.CONST_EndpointAsset, ['company-info', ticker]),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    CompanyProfile: async (bearerToken: string, ticker: string) => {
      const fname = this.asset.CompanyProfile.name

      return fetchGet<ICompanyProfile>({
        url: urlJoin(this.CONST_EndpointAsset, ['companyprofile', ticker]),
        fname,
        bearerToken,
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
          data: SearchRequestViewDefault(searchRequest),
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
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
          data: SearchRequestViewDefault(searchRequest),
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
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
        data: SearchRequestViewDefault(searchRequest),
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
        data: SearchRequestViewDefault(searchRequest),
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
        data: SearchRequestViewDefault(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    PriceHistory: async (
      bearerToken: string,
      symbol: string,
      chartSettings: ChartSettings
    ) => {
      const fname = this.asset.PriceHistory.name

      if (!hasData(symbol)) {
        throw new AppException('Missing symbol', fname)
      }

      return fetchPost<ISymbolPrices, ChartSettings>({
        url: urlJoin(this.CONST_EndpointAsset, ['pricehistory', symbol]),
        fname,
        bearerToken,
        data: chartSettings,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
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
        data: SearchRequestViewDefault(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    TickerSearch: async (
      bearerToken: string,
      ticker: string,
      limit: number,
      exchange: string
    ) => {
      const fname = this.asset.TickerSearch.name

      return fetchGet<
        PagedResponse<ITickerSearch>,
        { term: string; limit: number; exchange: string }
      >({
        url: urlJoin(this.CONST_EndpointAsset, 'ticker-search'),
        fname,
        bearerToken,
        data: { term: ticker, limit, exchange },
      })
        .then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
        .then((ret) => {
          return ret.dataPage.map((item) => {
            const ssr: SearchSymbolResultItem = {
              description: item.description,
              exchange: item.exchange,
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
        data: SearchRequestViewDefault(searchRequest),
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
        data: SearchRequestViewDefault(searchRequest),
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
          data: SearchRequestViewDefault(searchRequest),
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },
  }

  config = {
    DashboardPeopleTabSave: async (
      bearerToken: string,
      ticker: string,
      name: string | number
    ) => {
      const fname = this.config.DashboardPeopleTabSave.name

      return fetchPatch<{ name: number | string }, ConfigTickerInfoTabSettings>(
        {
          url: urlJoin(
            this.CONST_EndpointUser,
            `dashboard-people-tab/${ticker}`
          ),
          fname,
          bearerToken,
          data: { name },
        }
      ).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    GetOrSetTabSettings: async <T extends string>(
      bearerToken: string,
      configKeyName: string,
      settings: IIdName<number, T>
    ) => {
      const fname = this.config.GetOrSetTickerInfoTabSettings.name

      const data = new NameVal<IIdName<number, T>, string>(
        configKeyName,
        settings
      )

      return fetchPost<
        INameVal<IIdName<number, T>>,
        INameVal<IIdName<number, T>>
      >({
        url: this.CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    UpsertTabSettings: async <T extends string>(
      bearerToken: string,
      configKeyName: string,
      settings: IIdName<number, T>
    ) => {
      const fname = this.config.UpsertTickerInfoTabSettings.name

      const data = new NameVal<IIdName<number, T>, string>(
        configKeyName,
        settings
      )

      return fetchPut<
        INameVal<IIdName<number, T>>,
        IConfig<string, IIdName<number, T>>
      >({
        url: this.CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    GetOrSetTickerInfoTabSettings: async (
      bearerToken: string,
      ticker: string,
      settings?: Partial<ConfigTickerInfoTabSettings>
    ) => {
      const fname = this.config.GetOrSetTickerInfoTabSettings.name

      const data = new NameVal<ConfigTickerInfoTabSettings>(
        `tickerInfo-${ticker}`,
        CreateConfigTickerInfoTabSettings(settings)
      )

      return fetchPost<
        IConfig<string, ConfigTickerInfoTabSettings>,
        INameVal<ConfigTickerInfoTabSettings>
      >({
        url: this.CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    UpsertTickerInfoTabSettings: async (
      bearerToken: string,
      ticker: string,
      settings: Partial<ConfigTickerInfoTabSettings>
    ) => {
      const fname = this.config.UpsertTickerInfoTabSettings.name

      const data = new NameVal<ConfigTickerInfoTabSettings>(
        `tickerInfo-${ticker}`,
        CreateConfigTickerInfoTabSettings(settings)
      )

      return fetchPut<
        INameVal<ConfigTickerInfoTabSettings>,
        IConfig<string, ConfigTickerInfoTabSettings>
      >({
        url: this.CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  }

  politagree = {
    CitiesAll: async () => {
      const fname = this.politagree.CitiesAll.name

      return fetchGet<IPagedResponse<ICity>>({
        url: urlJoin(this.CONST_EndpointPolitagree, 'city-all-slugs'),
        fname,
        headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    CityById: async (id: string) => {
      const fname = this.politagree.CityById.name

      return fetchGet<ICity>({
        url: urlJoin(this.CONST_EndpointPolitagree, ['city', id]),
        fname,
        headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret, true))
    },

    CityBySlug: async (slug: string) => {
      const fname = this.politagree.CityBySlug.name

      return fetchGet<ICity>({
        url: urlJoin(this.CONST_EndpointPolitagree, ['city', slug]),
        fname,
        headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
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
        headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
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
        headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
      }).then((ret) =>
        ExternalApis.verifySuccessPagedResponse(fname, ret, true)
      )
    },

    CompaniesAll: async () => {
      const fname = this.politagree.CompaniesAll.name

      return fetchGet<IPagedResponse<ITickerType>>({
        url: urlJoin(this.CONST_EndpointPolitagree, 'company-all-slugs'),
        fname,
        headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
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
          headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
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
          headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
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
        headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
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
        headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
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
        headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
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
        data: SearchRequestViewDefault(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    PlotGet: async (bearerToken: string, plotNumber: number) => {
      const fname = this.trade.PlotGet.name

      return fetchGet<ITradePlot>({
        url: urlJoin(this.CONST_EndpointTrade, plotNumber),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    PlotSave: async (bearerToken: string, plot: ITradePlot) => {
      const fname = this.trade.PlotGet.name

      return fetchPut<ITradePlotApi, ITradePlot>({
        url: urlJoin(this.CONST_EndpointTrade, plot.id),
        fname,
        bearerToken,
        data: plot,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  }

  tv = {
    TvChart: async (bearerToken: string, chartId: string | number) => {
      const fname = this.tv.TvChart.name

      return fetchGet<string>({
        url: urlJoin(this.CONST_EndpointTv, ['chart', chartId]),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    GetAllCharts: async (bearerToken: string) => {
      const fname = this.tv.GetAllCharts.name

      return fetchGet<PagedResponse<ITvChartLayout>>({
        url: urlJoin(this.CONST_EndpointTv, 'charts'),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    RemoveChart: async (bearerToken: string, chartId: number | string) => {
      const fname = this.tv.RemoveChart.name

      return fetchDelete({
        url: urlJoin(this.CONST_EndpointTv, ['chart', chartId]),
        fname,
        bearerToken,
      }).then(() => undefined)
    },

    SaveChart: async (bearerToken: string, data: ChartData) => {
      const fname = this.tv.SaveChart.name

      return fetchPost<string, ChartData>({
        url: urlJoin(this.CONST_EndpointTv, 'chart'),
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  }

  user = {
    PlotList: async (
      bearerToken: string,
      searchRequest?: Partial<ISearchRequestView>,
      name = 'main'
    ) => {
      const fname = this.user.PlotList.name

      return this.user
        .PlotListRaw(bearerToken, searchRequest, name)
        .then((ret) => ExternalApis.verifySuccess(fname, ret, true))
    },

    PlotListRaw: async (
      bearerToken: string,
      searchRequest?: Partial<ISearchRequestView>,
      name = 'main'
    ) => {
      const fname = this.user.PlotListRaw.name

      return fetchPost<
        IPagedResponseWithTotalValue<ITradePlotListRowItem>,
        ISearchRequestView
      >({
        url: urlJoin(this.CONST_EndpointUser, ['plot-list', name]),
        fname,
        bearerToken,
        data: SearchRequestViewDefault(searchRequest),
      })
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
        data: SearchRequestViewDefault(searchRequest),
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
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    UserInfo: async (bearerToken: string) => {
      const fname = this.user.UserInfo.name

      return fetchGet<IUserInfo>({
        url: urlJoin(this.CONST_EndpointUser, 'info'),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    UserLogDashboardAccess: async (
      bearerToken: string,
      data: IDashboardScreenSetting
    ) => {
      const fname = this.user.UserLogDashboardAccess.name

      return fetchPost<string, IDashboardScreenSetting>({
        url: urlJoin(this.CONST_EndpointUser, 'log-dashboard-access'),
        fname,
        bearerToken,
        data,
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
        data: SearchRequestViewDefault(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },
  }

  async ServerTime(bearerToken: string) {
    const fname = this.ServerTime.name

    return fetchGet<{ serverTime: number }>({
      url: urlJoin(this.baseUrl, 'server-time'),
      fname,
      bearerToken,
      headers: GetHttpHeaderApplicationName(CONST_AppNamePolitagree),
    })
      .then((ret) => ExternalApis.verifySuccess(fname, ret))
      .then((ret) => ret.serverTime / 1000)
  }
}
