import { ConfigHeaderTickerBars } from '../tplot/ConfigHeaderTickerBars.mjs'
import { UserInfo } from './UserInfo.mjs'

test('constructor with default', () => {
  const ui = new UserInfo()

  expect(ui).toBeInstanceOf(UserInfo)
  expect(ui).toMatchObject({
    companies: [],
    config: expect.objectContaining({
      charts: expect.objectContaining({}),
      dashboards: expect.objectContaining({}),
      headerTickerBars: expect.objectContaining({}),
      ideaCryptoTabSelected: expect.objectContaining({}),
      ideaTabSelected: expect.objectContaining({}),
      operations: expect.objectContaining({}),
      website: expect.objectContaining({}),
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
      charts: expect.objectContaining({}),
      dashboards: expect.objectContaining({}),
      headerTickerBars: expect.objectContaining({}),
      ideaCryptoTabSelected: expect.objectContaining({}),
      ideaTabSelected: expect.objectContaining({}),
      operations: expect.objectContaining({}),
      website: expect.objectContaining({}),
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
      charts: expect.objectContaining({}),
      dashboards: expect.objectContaining({}),
      headerTickerBars: expect.objectContaining({}),
      ideaCryptoTabSelected: expect.objectContaining({}),
      ideaTabSelected: expect.objectContaining({}),
      operations: expect.objectContaining({}),
      website: expect.objectContaining({}),
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
      charts: expect.objectContaining({}),
      dashboards: expect.objectContaining({}),
      headerTickerBars: expect.objectContaining({}),
      ideaCryptoTabSelected: expect.objectContaining({}),
      ideaTabSelected: expect.objectContaining({}),
      operations: expect.objectContaining({}),
      website: expect.objectContaining({}),
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
  const cm = ConfigHeaderTickerBars.defaults()
  cm.disabled = true

  expect(new ConfigHeaderTickerBars(cm).isHeaderTickerBarsDisabled).toBe(true)

  cm.disabled = false
  expect(new ConfigHeaderTickerBars(cm).isHeaderTickerBarsDisabled).toBe(false)
})

test('shouldHeaderTickerBarsBeDisabled', () => {
  const cm = ConfigHeaderTickerBars.defaults()
  cm.disabled = true
  cm.asset.disabled = true
  cm.crypto.disabled = true

  expect(new ConfigHeaderTickerBars(cm).shouldHeaderTickerBarsBeDisabled).toBe(
    true
  )
  cm.disabled = false
  expect(new ConfigHeaderTickerBars(cm).shouldHeaderTickerBarsBeDisabled).toBe(
    true
  )

  cm.asset.disabled = false
  expect(new ConfigHeaderTickerBars(cm).shouldHeaderTickerBarsBeDisabled).toBe(
    false
  )

  cm.asset.disabled = true
  cm.crypto.disabled = true
  expect(new ConfigHeaderTickerBars(cm).shouldHeaderTickerBarsBeDisabled).toBe(
    true
  )

  cm.asset.disabled = true
  cm.crypto.disabled = false
  expect(new ConfigHeaderTickerBars(cm).shouldHeaderTickerBarsBeDisabled).toBe(
    false
  )
})

test('isHeaderTickerBarsAssetsDisabled', () => {
  const cm = ConfigHeaderTickerBars.defaults()
  cm.asset.disabled = true

  expect(new ConfigHeaderTickerBars(cm).isHeaderTickerBarsAssetsDisabled).toBe(
    true
  )

  cm.asset.disabled = false
  expect(new ConfigHeaderTickerBars(cm).isHeaderTickerBarsAssetsDisabled).toBe(
    false
  )
})
test('isHeaderTickerBarsCryptosDisabled', () => {
  const cm = ConfigHeaderTickerBars.defaults()
  cm.crypto.disabled = true

  expect(new ConfigHeaderTickerBars(cm).isHeaderTickerBarsCryptosDisabled).toBe(
    true
  )

  cm.crypto.disabled = false
  expect(new ConfigHeaderTickerBars(cm).isHeaderTickerBarsCryptosDisabled).toBe(
    false
  )
})
