import { ICompany, PermittedUserConfigs } from '../index.mjs'

export interface IUserInfo {
  displayName: string
  email: string
  firstName: string
  lastName: string
  tickers: string[]
  companies: ICompany[]
  tokenExpireTime: number
  quoteEndpoint: string
  config: PermittedUserConfigs
}
