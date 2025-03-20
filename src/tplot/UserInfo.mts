import { ICompany } from '../politagree/company.mjs'
import { PermittedUserConfigs } from './tp-items.mjs'

export interface IUserInfo {
  companies: ICompany[]
  config: PermittedUserConfigs
  displayName: string
  email: string
  firstName: string
  lastDashboardAccessed: string
  lastName: string
  quoteEndpoint: string
  tickers: string[]
  tokenExpireTime: number
}
