import { AppException } from '../../models/AppException.mjs'
import type { ISymbol } from '../../models/ticker-info.mjs'
import type { AnyRecord, FromTo } from '../../models/types.mjs'
import { isArray } from '../array-helper.mjs'
import { DateHelper } from '../DateHelper.mjs'
import { getAsNumber, getAsNumberOrUndefined } from '../number-helper.mjs'
import { safestr } from '../string-helper.mjs'
import { TradingClientBase } from './TradingClientBase.mjs'

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

     regex = /(\d+)|([A-Z]+)/gi,
     matches = safestr(timeframe).match(regex)
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
    const from = getAsNumberOrUndefined(body.from),
     to = getAsNumberOrUndefined(body.to),

     fmp: FmpIndicatorQueryParams<number> = {
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
}
