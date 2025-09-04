import { ChartRunLog, type IChartRunLog } from './ChartRunLog.mjs'
import { ChartSettings } from './ChartSettings.mjs'

it('ChartRunLog constructor', () => {
  const browser = 'Chrome',
    ip = '192.168.1.1',
    lang = 'en',
    ticker = 'AAPL',
    userid = 'user123',
    zchartRunLog = new ChartRunLog(userid, ticker, lang, browser, ip)

  expect(zchartRunLog.userid).toBe(userid)
  expect(zchartRunLog.ticker).toBe(ticker)
  expect(zchartRunLog.lang).toBe(lang)
  expect(zchartRunLog.browser).toBe(browser)
  expect(zchartRunLog.ip).toBe(ip)
})

it('ChartRunLog default values', () => {
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

it('ChartRunLog object properties', () => {
  const acs: ChartSettings = new ChartSettings(
      'AAPL',
      2,
      'day',
      1,
      'min',
      '1min',
      1700000000000,
      1700003600000,
      true
    ),
    aicrl: IChartRunLog = {
      browser: 'Chrome',
      endDate: new Date(1700003600000),
      frequency: 1,
      frequencyType: 'min',
      granularity: '1min',
      ip: '192.168.1.1',
      lang: 'en',
      needExtendedHoursTrading: false,
      period: 2,
      periodType: 'day',
      settings: acs,
      startDate: new Date(1700000000000),
      ticker: 'AAPL',
      userid: 'user123',
    },
    chartRunLog = new ChartRunLog(
      aicrl.userid ?? '',
      aicrl.ticker,
      aicrl.lang,
      aicrl.browser,
      aicrl.ip,
      acs
    ),
    crl = ChartRunLog.fromDb(aicrl),
    crlapi = ChartRunLog.toApi(aicrl)

  expect(chartRunLog.startDate).toBe(1700000000000)
  expect(chartRunLog.endDate).toBe(1700003600000)
  expect(chartRunLog.frequency).toBe(1)
  expect(chartRunLog.frequencyType).toBe('min')
  expect(chartRunLog.granularity).toBe('1min')
  expect(chartRunLog.needExtendedHoursTrading).toBe(false)

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

  expect(crlapi.ticker).toBe('AAPL')
  expect(crlapi.frequency).toBe('min')
  expect(crlapi.period).toBe('2 day')
  expect(crlapi.startDate).toBe(1700000000000)
  expect(crlapi.endDate).toBe(1700003600000)
  expect(crlapi.created).toBeInstanceOf(Date)

  aicrl.startDate = undefined
  aicrl.endDate = undefined

  const apiSettingsWithoutDates = ChartRunLog.toApi(aicrl)
  expect(apiSettingsWithoutDates.startDate).toBe(0)
  expect(apiSettingsWithoutDates.endDate).toBe(0)
  expect(apiSettingsWithoutDates.created).toBeInstanceOf(Date)
  expect(apiSettingsWithoutDates.frequency).toBe('min')
  expect(apiSettingsWithoutDates.period).toBe('2 day')
  expect(apiSettingsWithoutDates.ticker).toBe('AAPL')
})
