export abstract class TradingClientBase {
  static CalculatePositionSize(
    accountBalance: number,
    riskPercentage: number,
    entryPrice: number,
    stopLossPrice: number
  ): number {
    const riskAmount = accountBalance * riskPercentage,
     tradeRisk = entryPrice - stopLossPrice,
     positionSize = riskAmount / tradeRisk
    return positionSize
  }

  static CalculateRiskReward(
    entryPrice: number,
    takeProfitPrice: number,
    stopLossPrice: number
  ): number {
    const potentialProfit = takeProfitPrice - entryPrice,
     potentialLoss = entryPrice - stopLossPrice,
     riskRewardRatio = potentialProfit / potentialLoss

    return riskRewardRatio
  }
}
