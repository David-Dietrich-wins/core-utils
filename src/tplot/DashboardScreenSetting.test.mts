import { DashboardScreenSetting } from './DashboardScreenSetting.mjs'

test('constructor', () => {
  const dss = new DashboardScreenSetting('name', [])

  expect(dss.id).toBe('')
  expect(dss.name).toBe('name')
  expect(dss.tiles).toEqual([])
})

test('default constructor', () => {
  const dss = new DashboardScreenSetting()

  expect(dss.id).toBe('')
  expect(dss.name).toBe('')
  expect(dss.tiles).toEqual([])
})
