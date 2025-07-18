import { DashboardScreenSetting } from './DashboardScreenSetting.mjs'
import { DashboardSetting } from './DashboardSetting.mjs'

test('default constructor', () => {
  const ds = new DashboardSetting()

  expect(ds.screens).toEqual([])
})

test('constructor', () => {
  const ds = new DashboardSetting([])

  expect(ds.screens).toEqual([])
})

test('screens', () => {
  const ascreens = [
      new DashboardScreenSetting('screen1'),
      new DashboardScreenSetting('screen2'),
    ],
    ds = new DashboardSetting(ascreens)

  expect(ds.screens).toEqual(ascreens)
  expect(ds.screenNames).toEqual(['screen1', 'screen2'])
})
