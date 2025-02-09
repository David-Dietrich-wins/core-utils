import { IdCreatedUpdated, IIdCreatedUpdated } from '../models/id-created-updated.js'
import { ITableId } from '../models/interfaces.js'
import { isObject } from '../services/general.js'
import { IHasPolitiscales, Politiscale } from './politiscale.js'

export interface ICompany extends IIdCreatedUpdated, IHasPolitiscales {
  name: string
  status: number
  imageuri: string
  imageurihref: string
  description: string
  phone: string
  email: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
}
export interface ICompanyTable extends ITableId, IIdCreatedUpdated, IHasPolitiscales {
  name: string
  status: number
  imageuri: string
  imageurihref: string
  description: string
  phone: string
  email: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
}

export class Company extends IdCreatedUpdated implements ICompany {
  name = ''
  status = 0
  imageuri = ''
  imageurihref = ''
  description = ''
  phone = ''
  email = ''
  address1 = ''
  address2 = ''
  city = ''
  state = ''
  zip = ''
  scales?: Politiscale[]

  constructor(obj?: ICompany) {
    super('TradePlotter')

    if (isObject(obj)) {
      Object.assign(this, obj)
    }
  }
}
