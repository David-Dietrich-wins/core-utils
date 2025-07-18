import type { AnyRecord, FromTo } from '../../models/types.mjs'
import { getAsNumber, getAsNumberOrUndefined } from '../number-helper.mjs'
import { AppException } from '../../models/AppException.mjs'
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
}
