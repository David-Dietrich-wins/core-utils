import { TradingClientBase } from './TradingClientBase.mjs'

describe('TradingClientBase', () => {
  describe('calculatePositionSize', () => {
    it('should calculate position size correctly', () => {
      const result = TradingClientBase.CalculatePositionSize(
        10000,
        0.01,
        100,
        90
      )
      expect(result).toBe(10)
    })
  })

  describe('calculateRiskReward', () => {
    it('should calculate risk-reward ratio correctly', () => {
      const result = TradingClientBase.CalculateRiskReward(100, 120, 90)
      expect(result).toBe(2)
    })
  })
})
