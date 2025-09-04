import { describe, expect, it } from '@jest/globals'
import { DashboardScreenSetting } from './DashboardScreenSetting.mjs'
import { DashboardSetting } from './DashboardSetting.mjs'

describe('constructor', () => {
  it('default constructor', () => {
    expect.assertions(1)

    const ds = new DashboardSetting()

    expect(ds.screens).toStrictEqual([])
  })

  it('constructor', () => {
    expect.assertions(1)

    const ds = new DashboardSetting([])

    expect(ds.screens).toStrictEqual([])
  })
})

describe('screens', () => {
  it('get screens and names', () => {
    expect.assertions(2)

    const ascreens = [
        new DashboardScreenSetting('screen1'),
        new DashboardScreenSetting('screen2'),
      ],
      ds = new DashboardSetting(ascreens)

    expect(ds.screens).toStrictEqual(ascreens)
    expect(ds.screenNames).toStrictEqual(['screen1', 'screen2'])
  })
})
