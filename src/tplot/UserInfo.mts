import { isArray } from '../index.mjs'
import { ICompany } from '../politagree/company.mjs'
import { getBoolean } from '../services/general.mjs'
import { ConfigManager, TpUserInfoConfigs } from './ConfigManager.mjs'

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

  constructor(obj?: IUserInfo) {
    if (obj) {
      Object.assign(this, obj)
    }
  }

  get isHeaderTickerBarsDisabled() {
    return getBoolean(this.config.headerTickerBars.disabled)
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
