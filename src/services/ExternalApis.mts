import process from 'process'
import { AppException, AppExceptionHttp } from '../models/AppException.mjs'
import { DefaultSearchRequestView } from '../models/defaults.mjs'
import { IIdName } from '../models/id-name.mjs'
import {
  IChartRunLogApiReturn,
  IEventLogin,
  ISearchRequestView,
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
  ICompanyScales,
  ICompanyUsersWithCount,
  IIpoCalendar,
  ISymbolPrices,
  ISymbolPriceVolumeChanges,
  ITickerSearch,
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
import { urlJoin, hasData, safeArray } from './general.mjs'
import { IConfig } from '../models/config.mjs'
import { ITradePlotListRowItem } from '../tplot/trade-plotlist-row-item.mjs'
import { ChartPlotReturn, ChartSettings } from '../tplot/ChartSettings.mjs'
import { ScreenData } from '../tplot/ScreenData.mjs'
import { ITvChartLayout } from '../tplot/TvChartLayout.mjs'
import { ApiResponse } from '../models/ApiResponse.mjs'
import { IUserInfo } from '../tplot/UserInfo.mjs'
import { IDashboardScreenSetting } from '../tplot/DashboardScreenSetting.mjs'

const politagreeApiUrl = process.env.NEXT_PUBLIC_POLITAGREE_API_URL
// const politagreeAdminApiUrl = process.env.NEXT_PUBLIC_POLITAGREEADMIN_API_URL
const tpApiUrl = process.env.NEXT_PUBLIC_TRADEPLOTTER_API_URL
const tpConfigEndpoint = urlJoin(tpApiUrl, 'config', false)
const tpUserEndpoint = urlJoin(tpApiUrl, 'user', false)
const tpAssetEndpoint = urlJoin(tpApiUrl, 'asset', false)
/**
 * Interface for the result of a symbol search.
 * This is a TradingView API response that contains information about a symbol.
 * @see https://www.tradingview.com/widget/advanced-chart/
 * @see https://www.tradingview.com/widget/advanced-chart/#symbol-search
 * @see https://www.tradingview.com/widget/advanced-chart/#symbol-search-result
 * @see https://www.tradingview.com/widget/advanced-chart/#symbol-search-result-item
 * @see https://www.tradingview.com/widget/advanced-chart/#symbol-search-result-item-symbol
 */

export const ExternalApis = {
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
      }
    }

    throw err
  },

  async allUsers(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>
  ) {
    const fname = ExternalApis.allUsers.name

    return fetchPost<IPagedResponse<IUsersWithCount>, ISearchRequestView>({
      url: urlJoin(tpApiUrl, 'admin/all-users'),
      fname,
      bearerToken,
      data: DefaultSearchRequestView(searchRequest),
    }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  async ChartRunLogs(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>
  ) {
    const fname = ExternalApis.ChartRunLogs.name

    return fetchPost<IPagedResponse<IChartRunLogApiReturn>, ISearchRequestView>(
      {
        url: urlJoin(tpApiUrl, 'trade/chartrunlogs'),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }
    ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  async CompaniesWithUserCount(bearerToken: string) {
    return fetchGet<IPagedResponse<ICompanyUsersWithCount>>({
      url: `${tpApiUrl}admin/companies-with-count/`,
      fname: ExternalApis.fetchCompaniesWithUserCount.name,
      bearerToken,
    }).then(PagedResponse.GetDataFromApiResponse)
  },

  async CompanyInfo(bearerToken: string, ticker: string) {
    const fname = ExternalApis.CompanyInfo.name

    return fetchGet<CompanyAssetInfo>({
      url: urlJoin(tpAssetEndpoint, `company-info/${ticker}`),
      fname,
      bearerToken,
    }).then((ret) => ExternalApis.verifySuccess(fname, ret))
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
          url: urlJoin(tpUserEndpoint, `dashboard-people-tab/${ticker}`),
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
        url: tpConfigEndpoint,
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
        url: tpConfigEndpoint,
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
        url: tpConfigEndpoint,
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
        url: tpConfigEndpoint,
        fname,
        bearerToken,
        data,
      }).then((ret) => ExternalApis.verifySuccess(fname, ret))
    },
  },

  async CompanyProfile(bearerToken: string, ticker: string) {
    const fname = ExternalApis.CompanyProfile.name

    return fetchGet<ICompanyProfile>({
      url: urlJoin(tpAssetEndpoint, `companyprofile/${ticker}`),
      fname,
      bearerToken,
    }).then((ret) => ExternalApis.verifySuccess(fname, ret))
  },

  async CryptoQuotes(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>
  ) {
    const fname = ExternalApis.CryptoQuotes.name

    return fetchPost<IPagedResponse<IAssetQuoteResponse>, ISearchRequestView>({
      url: urlJoin(tpApiUrl, 'asset/crypto-quotes'),
      fname,
      bearerToken,
      data: DefaultSearchRequestView(searchRequest),
    }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  async fetchCompaniesWithUserCount(bearerToken: string) {
    const fname = ExternalApis.fetchCompaniesWithUserCount.name

    return fetchGet<IPagedResponse<ICompanyUsersWithCount>>({
      url: urlJoin(tpApiUrl, 'admin/companies-with-count'),
      fname,
      bearerToken,
    }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  async EtfQuotes(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>
  ) {
    const fname = ExternalApis.EtfQuotes.name

    return fetchPost<IPagedResponse<IAssetQuoteResponse>, ISearchRequestView>({
      url: urlJoin(tpApiUrl, 'asset/etf-quotes'),
      fname,
      bearerToken,
      data: DefaultSearchRequestView(searchRequest),
    }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  async IpoCalendar(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>,
    fromDate: Date,
    toDate: Date
  ) {
    const fname = ExternalApis.IpoCalendar.name

    return fetchPost<IPagedResponse<IIpoCalendar>, ISearchRequestView>({
      url: urlJoin(
        tpApiUrl,
        `asset/ipo-calendar/?from=${+fromDate}&to=${+toDate}`
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
    const fname = ExternalApis.MostActive.name

    return fetchPost<
      IPagedResponse<ISymbolPriceVolumeChanges>,
      ISearchRequestView
    >({
      url: urlJoin(tpApiUrl, 'asset/most-active'),
      fname,
      bearerToken,
      data: DefaultSearchRequestView(searchRequest),
    }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  async NftQuotes(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>
  ) {
    const fname = ExternalApis.NftQuotes.name

    return fetchPost<IPagedResponse<AssetQuoteWithChanges>, ISearchRequestView>(
      {
        url: urlJoin(tpApiUrl, 'asset/nft-ideas-quotes'),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }
    ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  async PlotList(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>,
    name = 'main'
  ) {
    const fname = ExternalApis.PlotList.name

    return fetchPost<
      IPagedResponseWithTotalValue<ITradePlotListRowItem>,
      ISearchRequestView
    >({
      url: urlJoin(tpApiUrl, `user/plot-list/${name}`),
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
    const fname = ExternalApis.PriceHistory.name

    if (!hasData(symbol)) {
      throw new AppException('Missing symbol', fname)
    }

    return fetchPost<ISymbolPrices, ChartSettings>({
      url: urlJoin(tpApiUrl, `asset/pricehistory/${symbol}`),
      fname,
      bearerToken,
      data: chartSettings,
    }).then((ret) => ExternalApis.verifySuccess(fname, ret))
  },

  async ScreenData(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>,
    name: string
  ) {
    const fname = ExternalApis.ScreenData.name

    return fetchPost<ScreenData, ISearchRequestView>({
      url: urlJoin(tpApiUrl, `user/screen-data/${name}`),
      fname,
      bearerToken,
      data: DefaultSearchRequestView(searchRequest),
    }).then((ret) => ExternalApis.verifySuccess(fname, ret))
  },

  async ServerTime(bearerToken: string) {
    const fname = ExternalApis.ServerTime.name

    return fetchGet<{ serverTime: number }>({
      url: urlJoin(tpApiUrl, 'server-time'),
      fname,
      bearerToken,
    })
      .then((ret) => ExternalApis.verifySuccess(fname, ret))
      .then((ret) => ret.serverTime / 1000)
  },

  async SpacQuotes(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>
  ) {
    const fname = ExternalApis.SpacQuotes.name

    return fetchPost<IPagedResponse<AssetQuoteWithIpoDate>, ISearchRequestView>(
      {
        url: urlJoin(tpApiUrl, 'asset/spac-quotes'),
        fname,
        bearerToken,
        data: DefaultSearchRequestView(searchRequest),
      }
    ).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  async TickerSearch(
    bearerToken: string,
    ticker: string,
    limit: number,
    exchange: string
  ) {
    const fname = ExternalApis.TickerSearch.name

    return fetchGet<
      PagedResponse<ITickerSearch>,
      { term: string; limit: number; exchange: string }
    >({
      url: urlJoin(tpApiUrl, 'asset/ticker-search/'),
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
    const fname = ExternalApis.TopGainers.name

    return fetchPost<
      IPagedResponse<ISymbolPriceVolumeChanges>,
      ISearchRequestView
    >({
      url: urlJoin(tpApiUrl, 'asset/gainers'),
      fname,
      bearerToken,
      data: DefaultSearchRequestView(searchRequest),
    }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  async TopLosers(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>
  ) {
    const fname = ExternalApis.TopLosers.name

    return fetchPost<
      IPagedResponse<ISymbolPriceVolumeChanges>,
      ISearchRequestView
    >({
      url: urlJoin(tpApiUrl, 'asset/losers'),
      fname,
      bearerToken,
      data: DefaultSearchRequestView(searchRequest),
    }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  async TopSymbols() {
    const fname = ExternalApis.TopSymbols.name

    if (!hasData(politagreeApiUrl)) {
      throw new AppException('Missing NEXT_PUBLIC_POLITAGREE_API_URL', fname)
    }

    try {
      const ret = await fetchPost<
        IPagedResponse<ICompanyScales>,
        { ticker: string }
      >({
        url: urlJoin(politagreeApiUrl, 'top-symbols'),
        fname,

        data: {
          ticker: 'aapl,fb,tsla,goog,nflx,mcd,wmt,dis,ko,amzn',
        },
      })

      return safeArray(ret?.data?.dataPage)
    } catch (e) {
      console.error(fname, e)
    }

    return []
  },

  async TvChart(bearerToken: string, chartId: string | number) {
    const fname = ExternalApis.TvChart.name

    return fetchGet<string>({
      url: urlJoin(tpApiUrl, `tv/chart/${chartId}`),
      fname,
      bearerToken,
    }).then((ret) => ExternalApis.verifySuccess(fname, ret))
  },

  async TvChartPlots(
    bearerToken: string,
    chartId: string,
    settings?: ChartSettings
  ) {
    const fname = ExternalApis.TvChartPlots.name

    if (!hasData(chartId)) {
      throw new AppException('Missing chartId', fname)
    }

    return fetchPost<ChartPlotReturn, ChartSettings>({
      url: urlJoin(tpApiUrl, `asset/chart-plots/${chartId}`),
      fname,
      bearerToken,
      data: settings,
    }).then((ret) => ExternalApis.verifySuccess(fname, ret))
  },

  async TvGetAllCharts(bearerToken: string) {
    const fname = ExternalApis.TvGetAllCharts.name

    return fetchGet<PagedResponse<ITvChartLayout>>({
      url: urlJoin(tpApiUrl, 'tv/charts'),
      fname,
      bearerToken,
    }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  async TvRemoveChart(bearerToken: string, chartId: number | string) {
    const fname = ExternalApis.TvRemoveChart.name

    return fetchDelete({
      url: urlJoin(tpApiUrl, `tv/chart/${chartId}`),
      fname,
      bearerToken,
    }).then(() => undefined)
  },

  async TvSaveChart(bearerToken: string, data: ChartData) {
    const fname = ExternalApis.TvSaveChart.name

    return fetchPost<string, ChartData>({
      url: urlJoin(tpApiUrl, 'tv/chart'),
      fname,
      bearerToken,
      data,
    }).then((ret) => ExternalApis.verifySuccess(fname, ret))
  },

  async UserInfo(bearerToken: string) {
    const fname = ExternalApis.UserInfo.name

    return fetchGet<IUserInfo>({
      url: urlJoin(tpApiUrl, 'user/info'),
      fname,
      bearerToken,
    }).then((ret) => ExternalApis.verifySuccess(fname, ret))
  },

  async UserLogDashboardAccess(
    bearerToken: string,
    data: IDashboardScreenSetting
  ) {
    const fname = ExternalApis.UserLogDashboardAccess.name

    return fetchPost<string, IDashboardScreenSetting>({
      url: urlJoin(tpApiUrl, 'user/log-dashboard-access'),
      fname,
      bearerToken,
      data,
    }).then((ret) => ExternalApis.verifySuccess(fname, ret))
  },

  async UserLogins(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>
  ) {
    const fname = ExternalApis.UserLogins.name

    return fetchPost<IPagedResponse<IEventLogin>, ISearchRequestView>({
      url: urlJoin(tpApiUrl, 'user/logins'),
      fname,
      bearerToken,
      data: DefaultSearchRequestView(searchRequest),
    }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },

  verifySuccess<T = unknown>(fname: string, ret: ApiResponse<T>) {
    if (!ApiResponse.isSuccess(ret)) {
      throw new AppException(
        ret.message ? ret.message : `Bad result from API call: ${ret.result}.`,
        fname
      )
    }

    if (!ret.data) {
      throw new AppException('No data returned', fname)
    }

    return ret.data
  },

  verifySuccessPagedResponse<T = unknown>(
    fname: string,
    ret: ApiResponse<IPagedResponse<T>>
  ) {
    if (!ApiResponse.isSuccess(ret)) {
      throw new AppException(
        ret.message ? ret.message : `Bad result from API call: ${ret.result}.`,
        fname
      )
    }

    if (!ret.data) {
      throw new AppException('No data returned', fname)
    }

    return PagedResponse.CreateFromApiResponse(ret)
  },

  async WallStreetBetsQuotes(
    bearerToken: string,
    searchRequest: Partial<ISearchRequestView>
  ) {
    const fname = ExternalApis.WallStreetBetsQuotes.name

    return fetchPost<IPagedResponse<AssetQuoteWithScore>, ISearchRequestView>({
      url: urlJoin(tpApiUrl, 'asset/wsb-quotes'),
      fname,
      bearerToken,
      data: DefaultSearchRequestView(searchRequest),
    }).then((ret) => ExternalApis.verifySuccessPagedResponse(fname, ret))
  },
}
