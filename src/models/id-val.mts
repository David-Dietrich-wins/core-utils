import type { IId, IIdRequired } from './IdManager.mjs'
import type { INameVal } from './NameValManager.mjs'
import type { IVal } from './interfaces.mjs'

export interface IIdVal<Tid = string, Tval = string>
  extends IId<Tid>,
    IVal<Tval> {}

export interface IIdValRequired<Tid = string, Tval = string>
  extends IIdRequired<Tid>,
    IVal<Tval> {}

export class IdVal<Tid = string, Tval = string>
  implements IIdValRequired<Tid, Tval>
{
  id: Tid
  val: Tval

  constructor(id: Tid, val: Tval) {
    this.id = id
    this.val = val
  }

  static toIIdVal<Tid = string, Tval = string>(
    id: Tid,
    val: Tval
  ): IIdValRequired<Tid, Tval> {
    return { id, val }
  }

  static fromNameAndVal<Tid = string, Tval = string>(id: Tid, val: Tval) {
    return IdVal.toIIdVal<Tid, Tval>(id, val)
  }

  static fromNameVal<Tval = string>(
    nameVal: INameVal<Tval>
  ): IIdValRequired<string, Tval> {
    return IdVal.toIIdVal<string, Tval>(nameVal.name, nameVal.val)
  }
}
