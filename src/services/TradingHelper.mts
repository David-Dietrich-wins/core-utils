import { AppException } from '../models/AppException.mjs'
import type { ISymbol } from '../models/ticker-info.mjs'
import type { AnyRecord, FromTo } from '../models/types.mjs'
import { isArray } from './array-helper.mjs'
import { DateHelper } from './DateHelper.mjs'
import { getAsNumber, getAsNumberOrUndefined } from './number-helper.mjs'
import { safestr } from './string-helper.mjs'

export type FmpIndicatorQueryParams<TFromTo = number> = ISymbol &
  FromTo<TFromTo> & {
    periodLength: number
    timeframe: string
  }

export abstract class TradingHelper {
  static CalculatePositionSize(
    accountBalance: number,
    riskPercentage: number,
    entryPrice: number,
    stopLossPrice: number
  ): number {
    const riskAmount = accountBalance * riskPercentage
    const tradeRisk = entryPrice - stopLossPrice
    const positionSize = riskAmount / tradeRisk
    return positionSize
  }

  static CalculateRiskReward(
    entryPrice: number,
    takeProfitPrice: number,
    stopLossPrice: number
  ): number {
    const potentialProfit = takeProfitPrice - entryPrice
    const potentialLoss = entryPrice - stopLossPrice
    const riskRewardRatio = potentialProfit / potentialLoss
    return riskRewardRatio
  }

  static FmpIndicatorParamsSetDateBoundary(
    fmp: FmpIndicatorQueryParams<number>
  ) {
    const { from, timeframe } = fmp
    const fmpNew = { ...fmp }

    const regex = /(\d+)|([A-Z]+)/gi
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
}
