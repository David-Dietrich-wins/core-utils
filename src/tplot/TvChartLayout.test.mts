import { type ITvChartLayout, TvChartLayout } from './TvChartLayout.mjs'
import { describe, expect, it } from '@jest/globals'

const itv: ITvChartLayout = {
  content: '',
  created: new Date(),
  createdby: 'IdCreatedUpdated',
  description: '',
  exchange: 'New York Stock Exchange',
  id: undefined,
  is_realtime: '',
  legs: '',
  listed_exchange: 'NYSE',
  name: 'test name',
  publish_request_id: '',
  resolution: '',
  short_name: '',
  symbol: 'AAPL',
  symbol_type: '',
  updated: new Date(),
  updatedby: 'IdCreatedUpdated',
  userid: undefined,
}

describe('constructor', () => {
  it('good', () => {
    expect.hasAssertions()

    let layout = new TvChartLayout()

    expect(layout).toBeInstanceOf(TvChartLayout)
    expect(layout.publish_request_id).toBe('')
    expect(layout.name).toBe('')
    expect(layout.description).toBe('')
    expect(layout.resolution).toBe('')
    expect(layout.symbol).toBe('')
    expect(layout.symbol_type).toBe('')
    expect(layout.exchange).toBe('')
    expect(layout.listed_exchange).toBe('')
    expect(layout.short_name).toBe('')
    expect(layout.legs).toBe('')
    expect(layout.is_realtime).toBe('')
    expect(layout.content).toBe('')

    layout = new TvChartLayout(itv)

    expect(layout).toBeInstanceOf(TvChartLayout)
    expect(layout).toMatchObject(itv as unknown as Record<string, unknown>)
    expect(layout.publish_request_id).toBe(itv.publish_request_id)
    expect(layout.name).toBe(itv.name)
    expect(layout.description).toBe(itv.description)
    expect(layout.resolution).toBe(itv.resolution)
    expect(layout.symbol).toBe(itv.symbol)
    expect(layout.symbol_type).toBe(itv.symbol_type)
    expect(layout.exchange).toBe(itv.exchange)
    expect(layout.listed_exchange).toBe(itv.listed_exchange)
    expect(layout.short_name).toBe(itv.short_name)
    expect(layout.legs).toBe(itv.legs)
    expect(layout.is_realtime).toBe(itv.is_realtime)
    expect(layout.content).toBe(itv.content)
  })
})
