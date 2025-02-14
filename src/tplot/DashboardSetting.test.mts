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
  const screens = [
    new DashboardScreenSetting('screen1'),
    new DashboardScreenSetting('screen2'),
  ]

  const ds = new DashboardSetting(screens)

  expect(ds.screens).toEqual(screens)
  expect(ds.screenNames).toEqual(['screen1', 'screen2'])
})
