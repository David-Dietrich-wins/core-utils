import type { AnyRecord, FromTo } from '../../models/types.mjs'
import {
  NumberToString,
  getAsNumber,
  getAsNumberOrUndefined,
} from '../../primitives/number-helper.mjs'
import { AppException } from '../../models/AppException.mjs'
import { ChartSettings } from '../../tplot/ChartSettings.mjs'
import { DateHelper } from '../../primitives/date-helper.mjs'
import type { ISymbol } from '../../models/ticker-info.mjs'
import { TradingClientBase } from './TradingClientBase.mjs'
import { safestr } from '../../primitives/string-helper.mjs'

const MIN_CHART_INTERVALS = 1000

export type FmpIndicatorQueryParams<TFromTo = number> = ISymbol &
  FromTo<TFromTo> & {
    periodLength: number
    timeframe: string
  }

export class FinancialModelingPrep extends TradingClientBase {
  static FmpIndicatorParamsSetDateBoundary(fmp: FmpIndicatorQueryParams) {
    const { from, timeframe } = fmp,
      fmpNew = { ...fmp },
      regex = /(?<units>\d+)(?<unit>[A-Za-z]+)/giu,
      regexMatches = regex.exec(safestr(timeframe))

    if (regexMatches?.groups?.units && regexMatches.groups.unit) {
      if (from) {
        fmpNew.from = from
        //   fmpNew.from = Number(
        //     DateHelper.NextBoundaryUp(
        //       from,
        //       regexMatches.groups.unit,
        //       Number(regexMatches.groups.units)
        //     )
        //   )
      }

      fmpNew.to = Number(
        DateHelper.NextBoundaryUp(
          fmpNew.to ? fmpNew.to : Date.now(),
          regexMatches.groups.unit,
          Number(regexMatches.groups.units)
        )
      )
    }

    return fmpNew
  }

  static FmpIndicatorParamsToPath(
    params: FmpIndicatorQueryParams,
    existingQueryParams = ''
  ) {
    let qp = `${existingQueryParams}&symbol=${
      params.symbol
    }&periodLength=${NumberToString(params.periodLength)}&timeframe=${
      params.timeframe
    }`
    if (params.from) {
      qp += `&from=${params.from.toString()}`
    }
    if (params.to) {
      qp += `&to=${params.to.toString()}`
    }

    return qp
  }

  static FmpIndicatorParamsFromObject(body: AnyRecord) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const from = getAsNumberOrUndefined(body.from),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      to = getAsNumberOrUndefined(body.to),
      zfmp: FmpIndicatorQueryParams = {
        from,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        periodLength: getAsNumber(body.periodLength),
        symbol: safestr(body.symbol, body.ticker),
        timeframe: safestr(body.timeframe),
        to,
      }

    if (!zfmp.symbol) {
      throw new AppException('No ticker.', 'asset.js FinancialRatios:', zfmp)
    }

    return zfmp
  }

  static ChartSettings(
    ticker: string,
    startDate?: number,
    endDate?: number,
    resolution?: string,
    extendedHoursTrading = true,
    numIntervals?: number,
    firstDataRequest = false
  ) {
    let startTime = startDate
    const endTime = endDate ?? Date.now(),
      intervals =
        firstDataRequest || !numIntervals || numIntervals < MIN_CHART_INTERVALS
          ? MIN_CHART_INTERVALS
          : numIntervals

    if (numIntervals || firstDataRequest) {
      const resolutionLower = safestr(resolution, 'day').toLowerCase(),
        stime = DateHelper.AddTimeToDate(
          endTime,
          resolutionLower,
          -intervals
        ).getTime()

      if (!startTime || startTime > stime) {
        startTime = stime
      }
    }

    return ChartSettings.Create({
      endDate: endTime,
      extendedHoursTrading,
      frequency: 1,
      frequencyType: 'minute',
      granularity: resolution,
      period: 1,
      periodType: 'day',
      startDate: startTime,
      ticker: safestr(ticker),
    }).toISettings()
  }
}
