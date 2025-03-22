import process from 'process'
import { AppException, AppExceptionHttp } from '../models/AppException.mjs'
import { DefaultSearchRequestView } from '../models/defaults.mjs'
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
} from './fetch-http.mjs'
import { urlJoin, hasData } from './general.mjs'
import { IConfig } from '../models/config.mjs'
import { ITradePlotListRowItem } from '../tplot/trade-plotlist-row-item.mjs'
import { ChartPlotReturn, ChartSettings } from '../tplot/ChartSettings.mjs'
import { ScreenData } from '../tplot/ScreenData.mjs'
import { ITvChartLayout } from '../tplot/TvChartLayout.mjs'
import { ApiResponse } from '../models/ApiResponse.mjs'
import { IFacet } from '../tplot/Facet.mjs'
import { IUserInfo } from '../tplot/UserInfo.mjs'
import { IDashboardScreenSetting } from '../tplot/DashboardScreenSetting.mjs'
import { ITradePlot, ITradePlotApi } from '../tplot/trade-plot.mjs'
import { ICity, IdNameSlugWithScales } from '../politagree/city.mjs'
import { IPolitiscaleSearchParams, ITickerSearchWithScales } from '../index.mjs'

const IntecoreApiUrl = process.env.NEXT_PUBLIC_INTECORE_API_URL
const CONST_EndpointAdmin = urlJoin(IntecoreApiUrl, 'admin', false)
const CONST_EndpointAsset = urlJoin(IntecoreApiUrl, 'asset', false)
const CONST_EndpointConfig = urlJoin(IntecoreApiUrl, 'config', false)
const CONST_EndpointPolitagree = urlJoin(IntecoreApiUrl, 'politagree', false)
// const CONST_EndpointPolitagreeAdmin = urlJoin(IntecoreApiUrl, 'politagree-admin', false)
const CONST_EndpointTrade = urlJoin(IntecoreApiUrl, 'trade', false)
const CONST_EndpointTv = urlJoin(IntecoreApiUrl, 'tv', false)
const CONST_EndpointUser = urlJoin(IntecoreApiUrl, 'user', false)

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
export const ExternalApis = {
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
  errorHandler(
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
  },

  admin: {
    async allUsers(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) {
      const fname = ExternalApis.admin.allUsers.name

      return fetchPost<IPagedResponse<IUsersWithCount>, ISearchRequestView>({
        url: urlJoin(CONST_EndpointAdmin, 'all-users'),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async CompaniesWithUserCount(bearerToken: string) {
      const fname = ExternalApis.admin.CompaniesWithUserCount.name

      return fetchGet<IPagedResponse<ICompanyUsersWithCount>>({
        url: urlJoin(CONST_EndpointAdmin, 'companies-with-count'),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async FacetSave(bearerToken: string, data: IFacet[]) {
      const fname = ExternalApis.admin.FacetSave.name

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return fetchPost<any, IFacet[]>({
        url: urlJoin(CONST_EndpointAdmin, 'facet'),
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  },

  asset: {
    async ChartPlots(
      bearerToken: string,
      chartId: string,
      settings?: ChartSettings
    ) {
      const fname = ExternalApis.asset.ChartPlots.name

      return fetchPost<ChartPlotReturn, ChartSettings>({
        url: urlJoin(CONST_EndpointAsset, ['chart-plots', chartId]),
        fname,
        bearerToken,
        data: settings,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async CompanyInfo(bearerToken: string, ticker: string) {
      const fname = ExternalApis.asset.CompanyInfo.name

      return fetchGet<CompanyAssetInfo>({
        url: urlJoin(CONST_EndpointAsset, ['company-info', ticker]),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async CompanyProfile(bearerToken: string, ticker: string) {
      const fname = ExternalApis.asset.CompanyProfile.name

      return fetchGet<ICompanyProfile>({
        url: urlJoin(CONST_EndpointAsset, ['companyprofile', ticker]),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async CryptoQuotes(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) {
      const fname = ExternalApis.asset.CryptoQuotes.name

      return fetchPost<IPagedResponse<IAssetQuoteResponse>, ISearchRequestView>(
        {
          url: urlJoin(CONST_EndpointAsset, 'crypto-quotes'),
          fname,
          bearerToken,
          data: DefaultSearchRequestView(searchRequest),
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async EtfQuotes(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) {
      const fname = ExternalApis.asset.EtfQuotes.name

      return fetchPost<IPagedResponse<IAssetQuoteResponse>, ISearchRequestView>(
        {
          url: urlJoin(CONST_EndpointAsset, 'etf-quotes'),
          fname,
          bearerToken,
          data: DefaultSearchRequestView(searchRequest),
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async IpoCalendar(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>,
      fromDate: Date,
      toDate: Date
    ) {
      const fname = ExternalApis.asset.IpoCalendar.name

      return fetchPost<IPagedResponse<IIpoCalendar>, ISearchRequestView>({
        url: urlJoin(
          CONST_EndpointAsset,
          `ipo-calendar/?from=${+fromDate}&to=${+toDate}`
        ),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async MostActive(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) {
      const fname = ExternalApis.asset.MostActive.name

      return fetchPost<
        IPagedResponse<ISymbolPriceVolumeChanges>,
        ISearchRequestView
      >({
        url: urlJoin(CONST_EndpointAsset, 'most-active'),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async NftQuotes(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) {
      const fname = ExternalApis.asset.NftQuotes.name

      return fetchPost<
        IPagedResponse<AssetQuoteWithChanges>,
        ISearchRequestView
      >({
        url: urlJoin(CONST_EndpointAsset, 'nft-ideas-quotes'),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async PriceHistory(
      bearerToken: string,
      symbol: string,
      chartSettings: ChartSettings
    ) {
      const fname = ExternalApis.asset.PriceHistory.name

      if (!hasData(symbol)) {
        throw new AppException('Missing symbol', fname)
      }

      return fetchPost<ISymbolPrices, ChartSettings>({
        url: urlJoin(CONST_EndpointAsset, ['pricehistory', symbol]),
        fname,
        bearerToken,
        data: chartSettings,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async SpacQuotes(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) {
      const fname = ExternalApis.asset.SpacQuotes.name

      return fetchPost<
        IPagedResponse<AssetQuoteWithIpoDate>,
        ISearchRequestView
      >({
        url: urlJoin(CONST_EndpointAsset, 'spac-quotes'),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async TickerSearch(
      bearerToken: string,
      ticker: string,
      limit: number,
      exchange: string
    ) {
      const fname = ExternalApis.asset.TickerSearch.name

      return fetchGet<
        PagedResponse<ITickerSearch>,
        { term: string; limit: number; exchange: string }
      >({
        url: urlJoin(CONST_EndpointAsset, 'ticker-search'),
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

    async TopGainers(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) {
      const fname = ExternalApis.asset.TopGainers.name

      return fetchPost<
        IPagedResponse<ISymbolPriceVolumeChanges>,
        ISearchRequestView
      >({
        url: urlJoin(CONST_EndpointAsset, 'gainers'),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async TopLosers(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) {
      const fname = ExternalApis.asset.TopLosers.name

      return fetchPost<
        IPagedResponse<ISymbolPriceVolumeChanges>,
        ISearchRequestView
      >({
        url: urlJoin(CONST_EndpointAsset, 'losers'),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async WallStreetBetsQuotes(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) {
      const fname = ExternalApis.asset.WallStreetBetsQuotes.name

      return fetchPost<IPagedResponse<AssetQuoteWithScore>, ISearchRequestView>(
        {
          url: urlJoin(CONST_EndpointAsset, 'wsb-quotes'),
          fname,
          bearerToken,
          data: DefaultSearchRequestView(searchRequest),
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },
  },

  config: {
    async DashboardPeopleTabSave(
      bearerToken: string,
      ticker: string,
      name: string | number
    ) {
      const fname = ExternalApis.config.DashboardPeopleTabSave.name

      return fetchPatch<{ name: number | string }, ConfigTickerInfoTabSettings>(
        {
          url: urlJoin(CONST_EndpointUser, `dashboard-people-tab/${ticker}`),
          fname,
          bearerToken,
          data: { name },
        }
      ).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async GetOrSetTabSettings<T extends string>(
      bearerToken: string,
      configKeyName: string,
      settings: IIdName<number, T>
    ) {
      const fname = ExternalApis.config.GetOrSetTickerInfoTabSettings.name

      const data = new NameVal<IIdName<number, T>, string>(
        configKeyName,
        settings
      )

      return fetchPost<
        INameVal<IIdName<number, T>>,
        INameVal<IIdName<number, T>>
      >({
        url: CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async UpsertTabSettings<T extends string>(
      bearerToken: string,
      configKeyName: string,
      settings: IIdName<number, T>
    ) {
      const fname = ExternalApis.config.UpsertTickerInfoTabSettings.name

      const data = new NameVal<IIdName<number, T>, string>(
        configKeyName,
        settings
      )

      return fetchPut<
        INameVal<IIdName<number, T>>,
        IConfig<string, IIdName<number, T>>
      >({
        url: CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async GetOrSetTickerInfoTabSettings(
      bearerToken: string,
      ticker: string,
      settings?: Partial<ConfigTickerInfoTabSettings>
    ) {
      const fname = ExternalApis.config.GetOrSetTickerInfoTabSettings.name

      const data = new NameVal<ConfigTickerInfoTabSettings>(
        `tickerInfo-${ticker}`,
        CreateConfigTickerInfoTabSettings(settings)
      )

      return fetchPost<
        IConfig<string, ConfigTickerInfoTabSettings>,
        INameVal<ConfigTickerInfoTabSettings>
      >({
        url: CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async UpsertTickerInfoTabSettings(
      bearerToken: string,
      ticker: string,
      settings: Partial<ConfigTickerInfoTabSettings>
    ) {
      const fname = ExternalApis.config.UpsertTickerInfoTabSettings.name

      const data = new NameVal<ConfigTickerInfoTabSettings>(
        `tickerInfo-${ticker}`,
        CreateConfigTickerInfoTabSettings(settings)
      )

      return fetchPut<
        INameVal<ConfigTickerInfoTabSettings>,
        IConfig<string, ConfigTickerInfoTabSettings>
      >({
        url: CONST_EndpointConfig,
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  },

  politagree: {
    async CitiesAll() {
      const fname = ExternalApis.politagree.CitiesAll.name

      return fetchGet<IPagedResponse<ICity>>({
        url: urlJoin(CONST_EndpointPolitagree, 'city-all-slugs'),
        fname,
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async CityById(id: string) {
      const fname = ExternalApis.politagree.CityById.name

      return fetchGet<ICity>({
        url: urlJoin(CONST_EndpointPolitagree, ['city', id]),
        fname,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret, true))
    },

    async CityBySlug(slug: string) {
      const fname = ExternalApis.politagree.CityBySlug.name

      return fetchGet<ICity>({
        url: urlJoin(CONST_EndpointPolitagree, ['city', slug]),
        fname,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret, true))
    },

    async CitySearch(srv: IPolitiscaleSearchParams) {
      const fname = ExternalApis.politagree.CitySearch.name

      return fetchPost<
        IPagedResponse<IdNameSlugWithScales>,
        IPolitiscaleSearchParams
      >({
        url: urlJoin(CONST_EndpointPolitagree, 'city-search'),
        fname,
        data: srv,
      }).then((ret) =>
        ExternalApis.verifySuccessPagedResponse(fname, ret, true)
      )
    },

    async CitySearchFullInfo(srv: IPolitiscaleSearchParams) {
      const fname = ExternalApis.politagree.CompaniesSearchFullInfo.name

      return fetchPost<IPagedResponse<ICity>, IPolitiscaleSearchParams>({
        url: urlJoin(CONST_EndpointPolitagree, 'city-search-full-info'),
        fname,
        data: srv,
      }).then((ret) =>
        ExternalApis.verifySuccessPagedResponse(fname, ret, true)
      )
    },

    async CityUpdate(
      bearerToken: string,
      data: Partial<ICity> & Required<ISlug>
    ) {
      const fname = ExternalApis.politagree.CitySearch.name

      return fetchPut<Partial<ICity>, ICity>({
        url: urlJoin(CONST_EndpointPolitagree, 'city'),
        fname,
        data,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async CompaniesAll() {
      const fname = ExternalApis.politagree.CompaniesAll.name

      return fetchGet<IPagedResponse<ITickerType>>({
        url: urlJoin(CONST_EndpointPolitagree, 'company-all-slugs'),
        fname,
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async CompaniesSearchFullInfo(srv: IPolitiscaleSearchParams) {
      const fname = ExternalApis.politagree.CompaniesSearchFullInfo.name

      return fetchPost<IPagedResponse<ISymbolDetail>, IPolitiscaleSearchParams>(
        {
          url: urlJoin(CONST_EndpointPolitagree, 'company-search-full-info'),
          fname,
          data: srv,
        }
      ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret, true))
    },

    async CompanySearch(srv: IPolitiscaleSearchParams) {
      const fname = ExternalApis.politagree.CompanySearch.name

      return fetchPost<
        IPagedResponse<ITickerSearchWithScales>,
        IPolitiscaleSearchParams
      >({
        url: urlJoin(CONST_EndpointPolitagree, 'company-search'),
        fname,
        data: srv,
      }).then((ret) =>
        ExternalApis.verifySuccessPagedResponse(fname, ret, true)
      )
    },

    async CompanyUpdate(
      bearerToken: string,
      data: Partial<ISymbolDetail> & Required<ITicker>
    ) {
      const fname = ExternalApis.politagree.CompanySearch.name

      return fetchPut<Partial<ISymbolDetail>, ISymbolDetail>({
        url: urlJoin(CONST_EndpointPolitagree, 'company'),
        fname,
        data,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async TopSymbols(ticker: string) {
      const fname = ExternalApis.politagree.TopSymbols.name

      return fetchPost<IPagedResponse<ISymbolDetail>, { ticker: string }>({
        url: urlJoin(CONST_EndpointPolitagree, 'top-symbols'),
        fname,

        data: {
          ticker, //: 'aapl,fb,tsla,goog,nflx,mcd,wmt,dis,ko,amzn',
        },
      }).then(
        (ret) =>
          ExternalApis.verifySuccessPagedResponse(fname, ret, true).dataPage
      )
    },
  },

  trade: {
    async ChartRunLogs(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) {
      const fname = ExternalApis.trade.ChartRunLogs.name

      return fetchPost<
        IPagedResponse<IChartRunLogApiReturn>,
        ISearchRequestView
      >({
        url: urlJoin(CONST_EndpointTrade, 'chartrunlogs'),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async PlotGet(bearerToken: string, plotNumber: number) {
      const fname = ExternalApis.trade.PlotGet.name

      return fetchGet<ITradePlot>({
        url: urlJoin(CONST_EndpointTrade, plotNumber),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async PlotSave(bearerToken: string, plot: ITradePlot, plotNumber: number) {
      const fname = ExternalApis.trade.PlotGet.name

      return fetchPost<ITradePlotApi, ITradePlot>({
        url: urlJoin(CONST_EndpointTrade, plotNumber),
        fname,
        bearerToken,
        data: plot,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  },

  user: {
    async PlotList(
      bearerToken: string,
      searchRequest?: Partial<ISearchRequestView>,
      name = 'main'
    ) {
      const fname = ExternalApis.user.PlotList.name

      return ExternalApis.user
        .PlotListRaw(bearerToken, searchRequest, name)
        .then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async PlotListRaw(
      bearerToken: string,
      searchRequest?: Partial<ISearchRequestView>,
      name = 'main'
    ) {
      const fname = ExternalApis.user.PlotListRaw.name

      return fetchPost<
        IPagedResponseWithTotalValue<ITradePlotListRowItem>,
        ISearchRequestView
      >({
        url: urlJoin(CONST_EndpointUser, ['plot-list', name]),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      })
    },

    async ScreenData(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>,
      name: string
    ) {
      const fname = ExternalApis.user.ScreenData.name

      return fetchPost<ScreenData, ISearchRequestView>({
        url: urlJoin(CONST_EndpointUser, ['screen-data', name]),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async UserInfo(bearerToken: string) {
      const fname = ExternalApis.user.UserInfo.name

      return fetchGet<IUserInfo>({
        url: urlJoin(CONST_EndpointUser, 'info'),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async UserLogDashboardAccess(
      bearerToken: string,
      data: IDashboardScreenSetting
    ) {
      const fname = ExternalApis.user.UserLogDashboardAccess.name

      return fetchPost<string, IDashboardScreenSetting>({
        url: urlJoin(CONST_EndpointUser, 'log-dashboard-access'),
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async UserLogins(
      bearerToken: string,
      searchRequest: Partial<ISearchRequestView>
    ) {
      const fname = ExternalApis.user.UserLogins.name

      return fetchPost<IPagedResponse<IEventLogin>, ISearchRequestView>({
        url: urlJoin(CONST_EndpointUser, 'logins'),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },
  },

  tv: {
    async TvChart(bearerToken: string, chartId: string | number) {
      const fname = ExternalApis.tv.TvChart.name

      return fetchGet<string>({
        url: urlJoin(CONST_EndpointTv, ['chart', chartId]),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },

    async GetAllCharts(bearerToken: string) {
      const fname = ExternalApis.tv.GetAllCharts.name

      return fetchGet<PagedResponse<ITvChartLayout>>({
        url: urlJoin(CONST_EndpointTv, 'charts'),
        fname,
        bearerToken,
      }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
    },

    async RemoveChart(bearerToken: string, chartId: number | string) {
      const fname = ExternalApis.tv.RemoveChart.name

      return fetchDelete({
        url: urlJoin(CONST_EndpointTv, ['chart', chartId]),
        fname,
        bearerToken,
      }).then(() => undefined)
    },

    async SaveChart(bearerToken: string, data: ChartData) {
      const fname = ExternalApis.tv.SaveChart.name

      return fetchPost<string, ChartData>({
        url: urlJoin(CONST_EndpointTv, 'chart'),
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  },

  async ServerTime(bearerToken: string) {
    const fname = ExternalApis.ServerTime.name

    return fetchGet<{ serverTime: number }>({
      url: urlJoin(IntecoreApiUrl, 'server-time'),
      fname,
      bearerToken,
    })
      .then((ret) => ExternalApis.verifySuccess(fname, ret))
      .then((ret) => ret.serverTime / 1000)
  },

  verifySuccess<T = unknown>(
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
  },

  verifySuccessPagedResponse<T = unknown>(
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
  },
}
