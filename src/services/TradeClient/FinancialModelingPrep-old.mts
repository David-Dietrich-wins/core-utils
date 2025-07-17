import { TradingClientBase } from './TradingClientBase.mjs'

export class FinancialModelingPrep extends TradingClientBase {
  static readonly BASE_URL = 'https://financialmodelingprep.com/api/v3'

  static readonly INDICATORS = {
    SMA: 'technical_indicator/sma',
    EMA: 'technical_indicator/ema',
    RSI: 'technical_indicator/rsi',
    MACD: 'technical_indicator/macd',
    BBANDS: 'technical_indicator/bbands',
    ATR: 'technical_indicator/atr',
  }

  static readonly QUOTE = {
    LATEST: 'quote/latest',
    HISTORICAL: 'historical-price-full',
  }

  static readonly COMPANY = {
    PROFILE: 'profile',
    FINANCIALS: 'financials/income-statement',
  }
}
