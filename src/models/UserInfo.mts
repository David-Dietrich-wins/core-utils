import { isArray } from '../services/array-helper.mjs'
import { getBoolean } from '../services/general.mjs'
import { ICompany } from '../politagree/company.mjs'
import { ConfigManager, TpUserInfoConfigs } from '../tplot/ConfigManager.mjs'

export interface IUserInfo {
  companies: ICompany[]
  config: TpUserInfoConfigs
  displayName: string
  email: string
  firstName: string
  lastDashboardAccessed: string
  lastName: string
  quoteEndpoint: string
  tokenExpireTime: number
}

export class UserInfo implements IUserInfo {
  companies = []
  config = { ...ConfigManager.defaults }
  displayName = ''
  email = ''
  firstName = ''
  lastDashboardAccessed = ''
  lastName = ''
  quoteEndpoint = ''
  tokenExpireTime = 0

  constructor(obj?: Partial<IUserInfo>) {
    if (obj) {
      Object.assign(this, obj)
    }
  }

  static CreateUserInfo(obj?: Partial<IUserInfo>) {
    return new UserInfo(obj)
  }

  get IUserInfo() {
    const iUserInfo: IUserInfo = {
      companies: this.companies,
      config: this.config,
      displayName: this.displayName,
      email: this.email,
      firstName: this.firstName,
      lastDashboardAccessed: this.lastDashboardAccessed,
      lastName: this.lastName,
      quoteEndpoint: this.quoteEndpoint,
      tokenExpireTime: this.tokenExpireTime,
    }

    return iUserInfo
  }

  get isHeaderTickerBarsDisabled() {
    return getBoolean(this.config.headerTickerBars.disabled)
  }

  /** Checks if all of the conditions are met to disable the Ticker Bars */
  get shouldHeaderTickerBarsBeDisabled() {
    return (
      this.isHeaderTickerBarsDisabled ||
      (this.isHeaderTickerBarsCryptosDisabled &&
        this.isHeaderTickerBarsAssetsDisabled)
    )
  }

  get isHeaderTickerBarsAssetsDisabled() {
    return (
      getBoolean(this.config.headerTickerBars.asset.disabled) ||
      !isArray(this.config.headerTickerBars.asset.tickers, 1)
    )
  }
  get isHeaderTickerBarsCryptosDisabled() {
    return (
      getBoolean(this.config.headerTickerBars.crypto.disabled) ||
      !isArray(this.config.headerTickerBars.crypto.tickers, 1)
    )
  }
}
