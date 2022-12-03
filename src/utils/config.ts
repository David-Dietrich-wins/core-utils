import { IdCreatedUpdated, IIdCreatedUpdated } from './id-created-updated'
import { IIdName } from './id-name'
import { IIdVal } from './id-val'
import { NameValType } from './name-val'
import { isObject } from './skky'

export interface IConfig<Tid = string, Tval = boolean>
  extends IIdVal<Tid, Tval>,
    IIdName<Tid, string>,
    IIdCreatedUpdated<Tid> {
  userid: Tid
}

export default class Config<Tid = string, Tval = boolean>
  extends IdCreatedUpdated<Tid>
  implements IConfig<Tid, Tval>
{
  userid!: Tid
  name = ''
  val!: Tval

  constructor(
    id: Tid | IConfig<Tid, Tval>,
    userid: Tid,
    name = '',
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

  api(): NameValType<Tval> {
    return {
      name: this.name,
      val: this.val,
    }
  }
}

export type ConfigType<Tid = string, Tval = boolean> = {
  id: Tid
  userid: Tid
  name: string
  val: Tval
  updatedby: string
  updated: Date
  createdby: string
  created: Date
}
