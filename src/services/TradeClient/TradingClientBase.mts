// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class TradingClientBase {
  static CalculatePositionSize(
    accountBalance: number,
    riskPercentage: number,
    entryPrice: number,
    stopLossPrice: number
  ): number {
    const riskAmount = accountBalance * riskPercentage,
      tradeRisk = entryPrice - stopLossPrice,
      zpositionSize = riskAmount / tradeRisk

    return zpositionSize
  }

  static CalculateRiskReward(
    entryPrice: number,
    takeProfitPrice: number,
    stopLossPrice: number
  ): number {
    const potentialLoss = entryPrice - stopLossPrice,
      potentialProfit = takeProfitPrice - entryPrice,
      riskRewardRatio = potentialProfit / potentialLoss

    return riskRewardRatio
  }
}
