import { describe, expect, it } from '@jest/globals'
import { ConfigHeaderTickerBars } from '../tplot/ConfigHeaderTickerBars.mjs'
import { UserInfo } from './UserInfo.mjs'

describe('constructor', () => {
  it('with default', () => {
    expect.assertions(2)

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

  it('with partial IUserInfo', () => {
    expect.assertions(2)

    const ui = new UserInfo({
      displayName: 'John Doe',
      email: 'john.doe@example.com',
    })

    expect(ui.displayName).toBe('John Doe')
    expect(ui.email).toBe('john.doe@example.com')
  })
})

describe('createUserInfo', () => {
  it('with default', () => {
    expect.assertions(2)

    const ui = UserInfo.createUserInfo({
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

  it('iUserInfo', () => {
    expect.assertions(1)

    const ui = UserInfo.createUserInfo({
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
})

describe('createIUserInfo', () => {
  it('with default', () => {
    expect.assertions(1)

    const ui = UserInfo.createIUserInfo({
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

  it('iUserInfo', () => {
    expect.assertions(1)

    const ui = UserInfo.createIUserInfo({
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
})

describe('settings', () => {
  it('isHeaderTickerBarsDisabled', () => {
    expect.assertions(2)

    const cm = ConfigHeaderTickerBars.defaults()
    cm.disabled = true

    expect(new ConfigHeaderTickerBars(cm).isHeaderTickerBarsDisabled).toBe(true)

    cm.disabled = false

    expect(new ConfigHeaderTickerBars(cm).isHeaderTickerBarsDisabled).toBe(
      false
    )
  })

  it('shouldHeaderTickerBarsBeDisabled', () => {
    expect.assertions(5)

    const cm = ConfigHeaderTickerBars.defaults()
    cm.disabled = true
    cm.asset.disabled = true
    cm.crypto.disabled = true

    expect(
      new ConfigHeaderTickerBars(cm).shouldHeaderTickerBarsBeDisabled
    ).toBe(true)

    cm.disabled = false

    expect(
      new ConfigHeaderTickerBars(cm).shouldHeaderTickerBarsBeDisabled
    ).toBe(true)

    cm.asset.disabled = false

    expect(
      new ConfigHeaderTickerBars(cm).shouldHeaderTickerBarsBeDisabled
    ).toBe(false)

    cm.asset.disabled = true
    cm.crypto.disabled = true

    expect(
      new ConfigHeaderTickerBars(cm).shouldHeaderTickerBarsBeDisabled
    ).toBe(true)

    cm.asset.disabled = true
    cm.crypto.disabled = false

    expect(
      new ConfigHeaderTickerBars(cm).shouldHeaderTickerBarsBeDisabled
    ).toBe(false)
  })

  it('isHeaderTickerBarsAssetsDisabled', () => {
    expect.assertions(2)

    const cm = ConfigHeaderTickerBars.defaults()
    cm.asset.disabled = true

    expect(
      new ConfigHeaderTickerBars(cm).isHeaderTickerBarsAssetsDisabled
    ).toBe(true)

    cm.asset.disabled = false

    expect(
      new ConfigHeaderTickerBars(cm).isHeaderTickerBarsAssetsDisabled
    ).toBe(false)
  })

  it('isHeaderTickerBarsCryptosDisabled', () => {
    expect.assertions(2)

    const cm = ConfigHeaderTickerBars.defaults()
    cm.crypto.disabled = true

    expect(
      new ConfigHeaderTickerBars(cm).isHeaderTickerBarsCryptosDisabled
    ).toBe(true)

    cm.crypto.disabled = false

    expect(
      new ConfigHeaderTickerBars(cm).isHeaderTickerBarsCryptosDisabled
    ).toBe(false)
  })
})
