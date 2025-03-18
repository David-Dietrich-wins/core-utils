import { IKeyValueShort } from './key-val.mjs'
import { INameVal } from './name-val.mjs'
import {
  IUserCreatedUpdatedTable,
  UserCreatedUpdatedTable,
} from './UserCreatedUpdatedTable.mjs'
import { hasData, safestr } from '../services/general.mjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IConfigTable<T = any>
  extends IUserCreatedUpdatedTable,
    IKeyValueShort<T> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ConfigTable<TValue = any>
  extends UserCreatedUpdatedTable
  implements IConfigTable<TValue>
{
  k = ''
  v: TValue

  constructor(
    userid: string,
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

  static fromApi<TFromApi = boolean>(
    currentConfig: IConfigTable<TFromApi> | undefined,
    nameVal: INameVal<TFromApi>,
    userid: string,
    email: string
  ) {
    const config =
      currentConfig ?? ConfigTable.fromNameVal<TFromApi>(nameVal, userid, email)

    config.k = nameVal.name
    config.v = nameVal.val

    return config
  }
  static fromNameVal<TFromNameVal = boolean>(
    nv: INameVal<TFromNameVal>,
    userid: string,
    email: string,
    curDate?: Date
  ) {
    const fname = 'fromNameVal'

    curDate = curDate ?? new Date()
    const userEmail = safestr(email, fname)

    const config: IConfigTable<TFromNameVal> = {
      k: nv.name,
      v: nv.val,
      userid,
      created: curDate,
      createdby: userEmail,
      updated: curDate,
      updatedby: userEmail,
    }

    return config
  }

  copyFromDatabase(dbtp: IConfigTable<TValue>) {
    super.copyFromDatabase(dbtp)

    if (hasData(dbtp.k)) {
      this.k = dbtp.k
    }
    if (hasData(dbtp.v)) {
      this.v = dbtp.v
    }
  }

  api() {
    const nv: INameVal<TValue> = { name: this.k, val: this.v }

    return nv
  }
}
