import type { AnyRecord, FromTo } from '../../models/types.mjs'
import { getAsNumber, getAsNumberOrUndefined } from '../number-helper.mjs'
import { AppException } from '../../models/AppException.mjs'
import { ChartSettings } from '../../tplot/ChartSettings.mjs'
import { DateHelper } from '../DateHelper.mjs'
import type { ISymbol } from '../../models/ticker-info.mjs'
import { TradingClientBase } from './TradingClientBase.mjs'
import { isArray } from '../array-helper.mjs'
import { safestr } from '../string-helper.mjs'

export type FmpIndicatorQueryParams<TFromTo = number> = ISymbol &
  FromTo<TFromTo> & {
    periodLength: number
    timeframe: string
  }

export class FinancialModelingPrep extends TradingClientBase {
  static FmpIndicatorParamsSetDateBoundary(
    fmp: FmpIndicatorQueryParams<number>
  ) {
    const { from, timeframe } = fmp,
      fmpNew = { ...fmp },
      regex = /(?<temp2>\d+)|(?<temp1>[A-Z]+)/giu,
      regexMatches = safestr(timeframe).match(regex)
    if (isArray(regexMatches, 2) && regexMatches[0] !== timeframe) {
      const [units, unit] = regexMatches
      if (from) {
        fmpNew.from = Number(
          DateHelper.NextBoundaryUp(from, unit, Number(units))
        )
      }

      fmpNew.to = Number(
        DateHelper.NextBoundaryUp(
          fmpNew.to ? fmpNew.to : Date.now(),
          unit,
          Number(units)
        )
      )
    }

    return fmpNew
  }

  static FmpIndicatorParamsToPath(
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

  static FmpIndicatorParamsFromObject(body: AnyRecord) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const from = getAsNumberOrUndefined(body.from),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      to = getAsNumberOrUndefined(body.to),
      zfmp: FmpIndicatorQueryParams<number> = {
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
      intervals = firstDataRequest || !numIntervals ? 1000 : numIntervals

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
