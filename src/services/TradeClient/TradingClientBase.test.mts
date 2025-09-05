import { describe, expect, it } from '@jest/globals'
import { TradingClientBase } from './TradingClientBase.mjs'

describe('tradingClientBase', () => {
  describe('calculatePositionSize', () => {
    it('should calculate position size correctly', () => {
      expect.assertions(1)

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
      expect.assertions(1)

      const result = TradingClientBase.CalculateRiskReward(100, 120, 90)

      expect(result).toBe(2)
    })
  })
})
