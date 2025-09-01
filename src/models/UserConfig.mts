import {
  type IUserCreatedUpdatedTable,
  UserCreatedUpdatedTable,
} from './UserCreatedUpdatedTable.mjs'
import { type IKeyValueShort } from './key-val.mjs'
import { type INameVal } from './NameValManager.mjs'
import { hasData } from '../primitives/object-helper.mjs'
import { safestr } from '../primitives/string-helper.mjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IUserConfig<T = any>
  extends IUserCreatedUpdatedTable,
    IKeyValueShort<T> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UserConfig<TValue = any>
  extends UserCreatedUpdatedTable
  implements IUserConfig<TValue>
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
    currentConfig: IUserConfig<TFromApi> | undefined,
    nameVal: INameVal<TFromApi>,
    userid: string,
    email: string
  ) {
    const config =
      currentConfig ?? UserConfig.fromNameVal<TFromApi>(nameVal, userid, email)

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
    const date = curDate ?? new Date(),
      fname = 'fromNameVal',
      userEmail = safestr(email, fname),
      zconfig: IUserConfig<TFromNameVal> = {
        created: date,
        createdby: userEmail,
        k: nv.name,
        updated: date,
        updatedby: userEmail,
        userid,
        v: nv.val,
      }

    return zconfig
  }

  copyFromDatabase(dbtp: IUserConfig<TValue>) {
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
