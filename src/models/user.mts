import { ITableId } from './interfaces.mjs'
import { IUserMainDatabase } from './UserMainDatabase.mjs'
import {
  CreatedUpdatedTable,
  ICreatedUpdatedTable,
} from './UserCreatedUpdatedTable.mjs'
import { ICompany } from '../politagree/company.mjs'
import { isObject, safeArray } from '../services/general.mjs'
import { IConfigTable } from './ConfigTable.mjs'

export interface IUserBase {
  firstname: string
  middlename: string
  lastname: string
  ftoken: string
  description: string
  status: number
  address1: string
  address2: string
  city: string
  state: string
  country: string
  zip: string
  email: string
  phone1: string
  phone2: string
}

export interface IUserTable extends IUserBase, ITableId, ICreatedUpdatedTable {
  oauth?: IUserMainDatabase
  company: ICompany[]
}

export default class UserTable
  extends CreatedUpdatedTable
  implements IUserTable
{
  firstname = ''
  middlename = ''
  lastname = ''
  ftoken = ''
  description = ''
  status = 0
  address1 = ''
  address2 = ''
  city = ''
  state = ''
  country = ''
  zip = ''
  email = ''
  phone1 = ''
  phone2 = ''
  oauth?: IUserMainDatabase
  company: ICompany[] = []

  constructor(
    updatedby: string | IUserTable = 'User',
    updated = new Date(),
    createdby = 'User',
    created = new Date()
  ) {
    super(updatedby, updated, createdby, created)

    if (isObject(updatedby)) {
      Object.assign(this, updatedby as IUserTable)
    }
  }
}

export interface IUserTpDbUser extends IUserTable {
  eventloginid: string
  config: IConfigTable[]
}

export class UserTpDbUser extends UserTable implements IUserTpDbUser {
  eventloginid = ''
  config: IConfigTable[] = []

  constructor(obj?: IUserTpDbUser) {
    super(obj)

    if (obj && isObject(obj)) {
      this.eventloginid = obj.eventloginid
      this.config = safeArray(obj.config)
    }
  }
}
