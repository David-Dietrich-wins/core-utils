import { ObjectId } from 'bson'
import { StringOrObjectId } from './interfaces.mjs'
import { IKeyValueShort } from './key-val.mjs'
import { INameVal, NameVal } from './name-val.mjs'
import {
  IUserCreatedUpdatedTable,
  UserCreatedUpdatedTable,
} from './UserCreatedUpdatedTable.mjs'
import { hasData, safestr } from '../services/general.mjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IConfigTable<T = any>
  extends IUserCreatedUpdatedTable,
    IKeyValueShort<T> {}

export class ConfigTable<TValue = boolean>
  extends UserCreatedUpdatedTable
  implements IConfigTable<TValue>
{
  k = ''
  v: TValue

  constructor(
    userid: StringOrObjectId,
    key: string,
    val: TValue,
    updatedby = 'Config',
    updated = new Date(),
    createdby = 'Config',
    created = new Date()
  ) {
    super(userid, updatedby, updated, createdby, created)
    this.k = key
    this.v = val
  }

  static fromApi(
    currentConfig: IConfigTable | undefined,
    nameVal: INameVal,
    userid: StringOrObjectId,
    email: string
  ) {
    const config =
      currentConfig ?? ConfigTable.fromNameVal(nameVal, userid, email)

    config.k = nameVal.name
    config.v = nameVal.val

    return config
  }
  static fromNameVal(
    nv: INameVal,
    userid: StringOrObjectId,
    email: string,
    curDate?: Date
  ) {
    const fname = 'fromNameVal'

    curDate = curDate ?? new Date()
    const userEmail = safestr(email, fname)

    const config: IConfigTable = {
      k: nv.name,
      v: nv.val,
      userid: new ObjectId(userid),
      created: curDate,
      createdby: userEmail,
      updated: curDate,
      updatedby: userEmail,
    }

    return config
  }

  copyFromDatabase(dbtp: IConfigTable) {
    super.copyFromDatabase(dbtp)

    if (hasData(dbtp.k)) {
      this.k = dbtp.k
    }
    if (hasData(dbtp.v)) {
      this.v = dbtp.v
    }
  }

  api() {
    const nv: NameVal<TValue> = { name: this.k, val: this.v }

    return nv
  }
}
