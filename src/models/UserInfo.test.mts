import { ConfigManager, TpConfigNamesEnum } from '../index.mjs'
import { UserInfo } from './UserInfo.mjs'

test('constructor with default', () => {
  const ui = new UserInfo()

  expect(ui).toBeInstanceOf(UserInfo)
  expect(ui).toMatchObject({
    companies: [],
    config: expect.objectContaining({
      [TpConfigNamesEnum.charts]: expect.objectContaining({}),
      [TpConfigNamesEnum.dashboards]: expect.objectContaining({}),
      [TpConfigNamesEnum.headerTickerBars]: expect.objectContaining({}),
      [TpConfigNamesEnum.ideaCryptoTabSelected]: expect.objectContaining({}),
      [TpConfigNamesEnum.ideaTabSelected]: expect.objectContaining({}),
      [TpConfigNamesEnum.operations]: expect.objectContaining({}),
      [TpConfigNamesEnum.website]: expect.objectContaining({}),
    }),
    displayName: '',
    email: '',
    firstName: '',
    lastDashboardAccessed: '',
    lastName: '',
    quoteEndpoint: '',
    tokenExpireTime: 0,
  })
})

test('constructor with partial IUserInfo', () => {
  const ui = new UserInfo({
    displayName: 'John Doe',
    email: 'john.doe@example.com',
  })

  expect(ui.displayName).toBe('John Doe')
  expect(ui.email).toBe('john.doe@example.com')
})

test('CreateUserInfo static method', () => {
  const ui = UserInfo.CreateUserInfo({
    firstName: 'Jane',
    lastName: 'Doe',
  })

  expect(ui).toBeInstanceOf(UserInfo)
  expect(ui).toMatchObject({
    companies: [],
    config: expect.objectContaining({
      [TpConfigNamesEnum.charts]: expect.objectContaining({}),
      [TpConfigNamesEnum.dashboards]: expect.objectContaining({}),
      [TpConfigNamesEnum.headerTickerBars]: expect.objectContaining({}),
      [TpConfigNamesEnum.ideaCryptoTabSelected]: expect.objectContaining({}),
      [TpConfigNamesEnum.ideaTabSelected]: expect.objectContaining({}),
      [TpConfigNamesEnum.operations]: expect.objectContaining({}),
      [TpConfigNamesEnum.website]: expect.objectContaining({}),
    }),
    displayName: '',
    email: '',
    firstName: 'Jane',
    lastDashboardAccessed: '',
    lastName: 'Doe',
    quoteEndpoint: '',
    tokenExpireTime: 0,
  })
})

test('CreateIUserInfo static method', () => {
  const ui = UserInfo.CreateIUserInfo({
    firstName: 'Jane',
    lastName: 'Doe',
  })

  expect(ui).toMatchObject({
    companies: [],
    config: expect.objectContaining({
      [TpConfigNamesEnum.charts]: expect.objectContaining({}),
      [TpConfigNamesEnum.dashboards]: expect.objectContaining({}),
      [TpConfigNamesEnum.headerTickerBars]: expect.objectContaining({}),
      [TpConfigNamesEnum.ideaCryptoTabSelected]: expect.objectContaining({}),
      [TpConfigNamesEnum.ideaTabSelected]: expect.objectContaining({}),
      [TpConfigNamesEnum.operations]: expect.objectContaining({}),
      [TpConfigNamesEnum.website]: expect.objectContaining({}),
    }),
    displayName: '',
    email: '',
    firstName: 'Jane',
    lastDashboardAccessed: '',
    lastName: 'Doe',
    quoteEndpoint: '',
    tokenExpireTime: 0,
  })
})

test('get IUserInfo', () => {
  const ui = UserInfo.CreateUserInfo({
    firstName: 'Jane',
    lastName: 'Doe',
  })

  expect(ui.IUserInfo).toMatchObject({
    companies: [],
    config: expect.objectContaining({
      [TpConfigNamesEnum.charts]: expect.objectContaining({}),
      [TpConfigNamesEnum.dashboards]: expect.objectContaining({}),
      [TpConfigNamesEnum.headerTickerBars]: expect.objectContaining({}),
      [TpConfigNamesEnum.ideaCryptoTabSelected]: expect.objectContaining({}),
      [TpConfigNamesEnum.ideaTabSelected]: expect.objectContaining({}),
      [TpConfigNamesEnum.operations]: expect.objectContaining({}),
      [TpConfigNamesEnum.website]: expect.objectContaining({}),
    }),
    displayName: '',
    email: '',
    firstName: 'Jane',
    lastDashboardAccessed: '',
    lastName: 'Doe',
    quoteEndpoint: '',
    tokenExpireTime: 0,
  })
})

test('isHeaderTickerBarsDisabled', () => {
  const cm = ConfigManager.defaults
  cm[TpConfigNamesEnum.headerTickerBars].disabled = true
  const ui = new UserInfo({ config: cm })

  expect(ui.isHeaderTickerBarsDisabled).toBe(true)

  ui.config.headerTickerBars.disabled = false
  expect(ui.isHeaderTickerBarsDisabled).toBe(false)
})

test('shouldHeaderTickerBarsBeDisabled', () => {
  const cm = ConfigManager.defaults
  cm[TpConfigNamesEnum.headerTickerBars].disabled = true
  cm[TpConfigNamesEnum.headerTickerBars].asset.disabled = true
  cm[TpConfigNamesEnum.headerTickerBars].crypto.disabled = true

  const ui = new UserInfo({ config: cm })

  expect(ui.shouldHeaderTickerBarsBeDisabled).toBe(true)
  ui.config.headerTickerBars.disabled = false
  expect(ui.shouldHeaderTickerBarsBeDisabled).toBe(true)

  ui.config.headerTickerBars.asset.disabled = false
  expect(ui.shouldHeaderTickerBarsBeDisabled).toBe(false)

  ui.config.headerTickerBars.asset.disabled = true
  ui.config.headerTickerBars.crypto.disabled = true
  expect(ui.shouldHeaderTickerBarsBeDisabled).toBe(true)

  ui.config.headerTickerBars.asset.disabled = true
  ui.config.headerTickerBars.crypto.disabled = false
  expect(ui.shouldHeaderTickerBarsBeDisabled).toBe(false)
})

test('isHeaderTickerBarsAssetsDisabled', () => {
  const cm = ConfigManager.defaults
  cm[TpConfigNamesEnum.headerTickerBars].asset.disabled = true
  const ui = new UserInfo({ config: cm })

  expect(ui.isHeaderTickerBarsAssetsDisabled).toBe(true)

  ui.config.headerTickerBars.asset.disabled = false
  expect(ui.isHeaderTickerBarsAssetsDisabled).toBe(false)
})
test('isHeaderTickerBarsCryptosDisabled', () => {
  const cm = ConfigManager.defaults
  cm[TpConfigNamesEnum.headerTickerBars].crypto.disabled = true
  const ui = new UserInfo({ config: cm })

  expect(ui.isHeaderTickerBarsCryptosDisabled).toBe(true)

  ui.config.headerTickerBars.crypto.disabled = false
  expect(ui.isHeaderTickerBarsCryptosDisabled).toBe(false)
})
