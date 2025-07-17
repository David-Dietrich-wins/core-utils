export abstract class TradingClientBase {
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
}
