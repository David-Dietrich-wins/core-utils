import {
  IdCreatedUpdated,
  IIdCreatedUpdated,
} from '../models/id-created-updated.mjs'
import { IIdVal } from '../models/id-val.mjs'
import { INameVal } from '../models/name-val.mjs'
import { isObject } from '../services/general.mjs'
import { IId } from './IdManager.mjs'
import { IName } from './interfaces.mjs'
import { IKeyValueShort } from './key-val.mjs'

export interface IConfig<Tid = string, Tval = boolean>
  extends IIdVal<Tid, Tval>,
    IName<string>,
    IIdCreatedUpdated<Tid> {
  userid: Tid
}

export class Config<Tid = string, Tval = boolean>
  extends IdCreatedUpdated<Tid>
  implements IConfig<Tid, Tval>
{
  userid!: Tid
  name = ''
  val!: Tval

  constructor(
    id: Tid | IConfig<Tid, Tval>,
    userid: Tid,
    name: string,
    val: Tval,
    updatedby = 'Config',
    updated = new Date(),
    createdby = 'Config',
    created = new Date()
  ) {
    super(id, createdby, created, updatedby, updated)
    if (isObject(id)) {
      this.copyFromDatabase(id as IConfig<Tid, Tval>)
    } else {
      // constructor items
      this.userid = userid
      this.name = name
      this.val = val
    }
  }

  copyFromDatabase(dbtp: IConfig<Tid, Tval>) {
    super.copyFromDatabase(dbtp)

    this.userid = dbtp.userid
    this.name = dbtp.name
    this.val = dbtp.val
  }

  api() {
    const ret: INameVal<Tval> = {
      name: this.name,
      val: this.val,
    }

    return ret
  }
}

export interface IConfigShort<Tid = string, Tval = unknown>
  extends IKeyValueShort<Tval, Tid>,
    IId<Tid>,
    IIdCreatedUpdated<Tid> {
  k: Tid
  v: Tval
  userid: Tid
}

export class ConfigShort<Tid = string, Tval = unknown>
  extends IdCreatedUpdated<Tid>
  implements IConfigShort<Tid, Tval>
{
  userid!: Tid
  k!: Tid
  v!: Tval

  constructor(
    id: Tid | IConfigShort<Tid, Tval>,
    userid: Tid,
    k: Tid,
    v: Tval,
    updatedby = 'Config',
    updated = new Date(),
    createdby = 'Config',
    created = new Date()
  ) {
    super(id, createdby, created, updatedby, updated)
    if (isObject(id)) {
      this.copyFromDatabase(id as IConfigShort<Tid, Tval>)
    } else {
      // constructor items
      this.userid = userid
      this.k = k
      this.v = v
    }
  }

  copyFromDatabase(dbtp: IConfigShort<Tid, Tval>) {
    super.copyFromDatabase(dbtp)

    this.userid = dbtp.userid
    this.k = dbtp.k
    this.v = dbtp.v
  }

  api() {
    const ret: INameVal<Tval, Tid> = {
      name: this.k,
      val: this.v,
    }

    return ret
  }
}
