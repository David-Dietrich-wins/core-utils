import { ChartRunLog, IChartRunLog } from './ChartRunLog.mjs'
import { ChartSettings } from './ChartSettings.mjs'

test('ChartRunLog constructor', () => {
  const userid = 'user123'
  const ticker = 'AAPL'
  const lang = 'en'
  const browser = 'Chrome'
  const ip = '192.168.1.1'

  const chartRunLog = new ChartRunLog(userid, ticker, lang, browser, ip)
  expect(chartRunLog.userid).toBe(userid)
  expect(chartRunLog.ticker).toBe(ticker)
  expect(chartRunLog.lang).toBe(lang)
  expect(chartRunLog.browser).toBe(browser)
  expect(chartRunLog.ip).toBe(ip)
})

test('ChartRunLog default values', () => {
  const chartRunLog = new ChartRunLog(
    'user123',
    'AAPL',
    'en',
    'Chrome',
    '192.168.1.1'
  )
  expect(chartRunLog.startDate).toBeUndefined()
  expect(chartRunLog.endDate).toBeUndefined()
  expect(chartRunLog.frequency).toBe(0)
  expect(chartRunLog.frequencyType).toBe('')
  expect(chartRunLog.granularity).toBe('')
  expect(chartRunLog.needExtendedHoursTrading).toBe(false)
})

test('ChartRunLog object properties', () => {
  const cs: ChartSettings = new ChartSettings(
    'AAPL',
    2,
    'day',
    1,
    'min',
    '1min',
    1700000000000, // Example start date in milliseconds
    1700003600000, // Example end date in milliseconds
    true
  )

  const icrl: IChartRunLog = {
    userid: 'user123',
    ticker: 'AAPL',
    lang: 'en',
    browser: 'Chrome',
    ip: '192.168.1.1',
    startDate: new Date(1700000000000),
    endDate: new Date(1700003600000),
    frequency: 1,
    frequencyType: 'min',
    granularity: '1min',
    needExtendedHoursTrading: false,
    settings: cs,
    period: 2,
    periodType: 'day',
  }
  const chartRunLog = new ChartRunLog(
    icrl.userid ?? '',
    icrl.ticker ?? '',
    icrl.lang ?? '',
    icrl.browser ?? '',
    icrl.ip ?? '',
    cs
  )
  expect(chartRunLog.startDate).toBe(1700000000000)
  expect(chartRunLog.endDate).toBe(1700003600000)
  expect(chartRunLog.frequency).toBe(1)
  expect(chartRunLog.frequencyType).toBe('min')
  expect(chartRunLog.granularity).toBe('1min')
  expect(chartRunLog.needExtendedHoursTrading).toBe(false)

  const crl = ChartRunLog.fromDb(icrl)
  expect(crl.userid).toBe('user123')
  expect(crl.ticker).toBe('AAPL')
  expect(crl.lang).toBe('en')
  expect(crl.browser).toBe('Chrome')
  expect(crl.ip).toBe('192.168.1.1')
  expect(crl.startDate?.getTime()).toBe(1700000000000)
  expect(crl.endDate?.getTime()).toBe(1700003600000)
  expect(crl.frequency).toBe(1)
  expect(crl.frequencyType).toBe('min')
  expect(crl.granularity).toBe('1min')
  expect(crl.needExtendedHoursTrading).toBe(false)
  expect(crl.period).toBe(2)
  expect(crl.periodType).toBe('day')

  const apiSettings = ChartRunLog.toApi(icrl)
  expect(apiSettings.ticker).toBe('AAPL')
  expect(apiSettings.frequency).toBe('min')
  expect(apiSettings.period).toBe('2 day')
  expect(apiSettings.startDate).toBe(1700000000000)
  expect(apiSettings.endDate).toBe(1700003600000)
  expect(apiSettings.created).toBeInstanceOf(Date)

  icrl.startDate = undefined
  icrl.endDate = undefined
  const apiSettingsWithoutDates = ChartRunLog.toApi(icrl)
  expect(apiSettingsWithoutDates.startDate).toBe(0)
  expect(apiSettingsWithoutDates.endDate).toBe(0)
  expect(apiSettingsWithoutDates.created).toBeInstanceOf(Date)
  expect(apiSettingsWithoutDates.frequency).toBe('min')
  expect(apiSettingsWithoutDates.period).toBe('2 day')
  expect(apiSettingsWithoutDates.ticker).toBe('AAPL')
})
