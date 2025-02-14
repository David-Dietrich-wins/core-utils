import { ConfigData } from './ConfigData.mjs'

test('ConfigData', () => {
  const cd = new ConfigData()

  expect(cd.customData).toBe('')
  expect(cd.useMinusEight).toBe(true)
  expect(cd.openFirstPlot).toBe(true)
  expect(cd.hideTooltips).toBe(false)
  expect(cd.hideTickerBar).toBe(false)
  expect(cd.showPriceChangeInTickerBar).toBe(false)
})
