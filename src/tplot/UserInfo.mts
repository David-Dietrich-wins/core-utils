import { ICompany } from '../politagree/company.mjs'
import { TpUserInfoConfigs } from './ConfigManager.mjs'

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
