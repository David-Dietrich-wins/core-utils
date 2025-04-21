import { ICompany } from '../politagree/company.mjs'
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
  tickers: string[]
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
  tickers = []
  tokenExpireTime = 0

  constructor(obj?: IUserInfo) {
    if (obj) {
      Object.assign(this, obj)
    }
  }
}
